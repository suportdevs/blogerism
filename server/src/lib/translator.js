const Anthropic = require('@anthropic-ai/sdk');
const { zodOutputFormat } = require('@anthropic-ai/sdk/helpers/zod');
const { z } = require('zod/v4');
const { LANGUAGE_PRESETS } = require('./i18n');

/*
 * AI translation with Claude. Segments go out as a JSON list and come back as structured output (one entry per key),
 * in batches so long pages stay within a single response. The API key comes from Settings → Languages or the
 * ANTHROPIC_API_KEY environment variable.
 */

const OUTPUT = z.object({ translations: z.array(z.object({ key: z.string(), text: z.string() })) });
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-sonnet-5-5']); // accept fallbacks: "default"
const BATCH_CHARS = 12000;

class TranslationError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

const languageName = (code) => {
  const p = LANGUAGE_PRESETS.find((l) => l.code === code);
  return p ? `${p.name} (${p.native})` : code;
};

function batches(segments) {
  const out = [];
  let cur = [];
  let size = 0;
  for (const s of segments) {
    if (cur.length && size + s.source.length > BATCH_CHARS) { out.push(cur); cur = []; size = 0; }
    cur.push(s);
    size += s.source.length;
  }
  if (cur.length) out.push(cur);
  return out;
}

const SYSTEM = (from, to, siteName, glossary) => `You translate website content from ${languageName(from)} to ${languageName(to)} for the site "${siteName}".
Write natural, fluent ${languageName(to)} that a native speaker would use on a professional website — not word-for-word.
Rules:
- Return exactly one translation for every key you receive, with the same key.
- Keep HTML tags, attributes, URLs, email addresses, phone numbers, numbers, prices, code and {placeholders} exactly as they are; translate only the human-readable text.
- Keep brand names, product names, people's names and technology names (e.g. Laravel, React, PostgreSQL) unchanged.
- Keep the tone and length close to the original; short UI labels stay short.${glossary ? `\n- Glossary (always use these terms):\n${glossary}` : ''}`;

async function translateBatch(client, cfg, { from, to, siteName }, batch) {
  const params = {
    model: cfg.model || 'claude-opus-5-5',
    max_tokens: 64000,
    system: SYSTEM(from, to, siteName, cfg.glossary),
    output_config: { effort: cfg.effort || 'medium', format: zodOutputFormat(OUTPUT) },
    messages: [{ role: 'user', content: `Translate these segments:\n${JSON.stringify(batch.map((s) => ({ key: s.key, text: s.source })))}` }],
  };
  if (FALLBACK_MODELS.has(params.model)) Object.assign(params, { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });

  let message;
  try {
    message = await client.beta.messages.stream(params).finalMessage();
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new TranslationError('The Anthropic API key is not valid — check Settings → Languages.');
    if (e instanceof Anthropic.PermissionDeniedError) throw new TranslationError('This API key cannot use the selected model.');
    if (e instanceof Anthropic.NotFoundError) throw new TranslationError(`Model "${params.model}" was not found — pick another in Settings → Languages.`);
    if (e instanceof Anthropic.RateLimitError) throw new TranslationError('The AI service is busy (rate limit). Try again in a minute.', 429);
    if (e instanceof Anthropic.BadRequestError) throw new TranslationError(`The AI service rejected the request: ${e.message}`);
    if (e instanceof Anthropic.APIConnectionError) throw new TranslationError('Could not reach the AI service. Check the server’s internet connection.', 502);
    if (e instanceof Anthropic.APIError) throw new TranslationError(`AI service error (${e.status}). Try again shortly.`, 502);
    throw e;
  }
  if (message.stop_reason === 'refusal') throw new TranslationError('The AI declined to translate this content.');
  if (message.stop_reason === 'max_tokens') throw new TranslationError('This content is too long to translate in one go.');
  const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  let parsed;
  try {
    parsed = OUTPUT.parse(JSON.parse(text));
  } catch {
    throw new TranslationError('The AI returned an unexpected answer. Please try again.', 502);
  }
  return parsed.translations;
}

/**
 * Translates [{ key, source }] → { key: text }. Keys the model leaves out are simply missing from the result.
 * cfg = settings.i18n.ai ({ apiKey, model, effort, glossary })
 */
async function translateSegments(segments, { from, to, siteName, cfg = {} }) {
  const apiKey = cfg.apiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new TranslationError('Add an Anthropic API key in Settings → Languages to use AI translation.');
  if (!segments.length) return {};
  const client = new Anthropic({ apiKey });
  const wanted = new Set(segments.map((s) => s.key));
  const result = {};
  for (const batch of batches(segments)) {
    for (const { key, text } of await translateBatch(client, cfg, { from, to, siteName }, batch)) if (wanted.has(key)) result[key] = text;
  }
  return result;
}

module.exports = { translateSegments, TranslationError };
