// Translates a block's data-source settings into public API requests.
// Returns [key, path] pairs; results are stored in ctx.feeds[key] as arrays of items.

const qs = (params) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)).toString();
  return s ? `?${s}` : '';
};

const postsPath = (d, extra = {}) => `/posts${qs({
  limit: Number(d.count) || 6,
  category: d.category,
  format: d.format,
  series: d.series,
  sort: d.sort === 'latest' ? '' : d.sort,
  featured: d.featuredOnly ? 'true' : '',
  breaking: d.breakingOnly ? 'true' : '',
  ...extra,
})}`;

const seriesPath = (d, extra = {}) => `/series${qs({ type: d.seriesType, limit: Number(d.count) || 10, sort: d.sort === 'popular' ? 'popular' : '', ...extra })}`;

export function blockQueries(block) {
  const d = block.data || {};
  const id = block.id;
  switch (block.type) {
    case 'breakingNews':
    case 'newsHero':
    case 'newsSection':
    case 'audioPlaylist':
      return [[id, postsPath({ ...d, format: block.type === 'audioPlaylist' ? 'AUDIO' : d.format, sort: block.type === 'audioPlaylist' && d.series && d.sort === 'latest' ? 'episodes' : d.sort })]];
    case 'newsColumns':
      return (d.columns || []).map((c, i) => [`${id}:${i}`, postsPath({ count: d.count, category: c.category, format: 'STANDARD' })]);
    case 'latestWithSidebar':
      return [
        [id, postsPath(d)],
        [`${id}:popular`, postsPath({ ...d, count: d.sidebarCount || 5, sort: 'popular' })],
      ];
    case 'videoFeature':
    case 'videoGrid':
      return [[id, postsPath({ ...d, format: 'VIDEO' })]];
    case 'mediaRail':
      return [[id, d.source === 'series' ? seriesPath(d) : postsPath(d)]];
    case 'seriesGrid':
      return [[id, seriesPath(d)]];
    case 'luxeList':
      return [[id, d.source === 'series' ? seriesPath(d) : postsPath(d)]];
    case 'luxeFeatured':
      return [[id, postsPath({ ...d, count: Number(d.count) || 5 })]];
    case 'episodeSpotlight':
      return [[id, postsPath({ ...d, count: Math.max(1, Number(d.count) || 4) })]];
    case 'billboard':
      return [[id, seriesPath({ seriesType: d.series ? '' : d.seriesType, count: 50 })]];
    case 'top10':
      return [[id, d.source === 'posts' ? postsPath({ format: d.format, count: 10, sort: 'popular' }) : seriesPath({ seriesType: d.seriesType, count: 10, sort: 'popular' })]];
    default:
      return [];
  }
}

// Fetch every feed needed by a list of blocks. `get(path)` must resolve to the JSON body.
export async function loadFeeds(blocks, get, existing = {}) {
  const pairs = blocks.flatMap(blockQueries).filter(([key, path]) => existing[`${key}|${path}`] === undefined);
  const results = await Promise.all(pairs.map(([, path]) => get(path).then((r) => r?.items || []).catch(() => [])));
  const feeds = { ...existing };
  pairs.forEach(([key, path], i) => { feeds[`${key}|${path}`] = results[i]; });
  return feeds;
}

// Look up a block's feed (the cache is keyed by key + path so edits in the builder refetch).
export function feedFor(feeds = {}, block, suffix = '') {
  const key = suffix === '' ? block.id : `${block.id}:${suffix}`;
  const pair = blockQueries(block).find(([k]) => k === key);
  return (pair && feeds[`${key}|${pair[1]}`]) || [];
}
