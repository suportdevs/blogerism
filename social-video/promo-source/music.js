// Synthesize a 60s ambient-tech music bed -> music.wav (44.1kHz stereo 16-bit).
const fs = require('fs');
const SR = 44100, DUR = 60, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const BAR = 2.2, BEAT = BAR / 4; // 109 BPM: the brand reveal (4.4s) lands on a bar line
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Am9, Fmaj7, C(add9), G6 – two bars each
const CHORDS = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 60, 62, 64], [55, 59, 62, 64, 67]];
const ROOTS = [45, 41, 48, 43];
const chordAt = (t) => Math.floor(t / (BAR * 2)) % 4;

function add(i, l, r) { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } }

// pad: soft saw (4 harmonics), detuned per channel, crossfaded per chord
for (let c = 0; c * BAR * 2 < DUR; c++) {
  const t0 = c * BAR * 2, len = BAR * 2 + 1.2, notes = CHORDS[c % 4];
  for (let s = Math.floor(t0 * SR); s < Math.min(N, (t0 + len) * SR); s++) {
    const t = s / SR - t0;
    const env = Math.min(1, t / .9) * Math.min(1, (len - t) / 1.2);
    let l = 0, r = 0;
    for (const m of notes) {
      const f = hz(m);
      for (let h = 1; h <= 4; h++) {
        l += Math.sin(2 * Math.PI * f * h * 1.0015 * t) / (h * h);
        r += Math.sin(2 * Math.PI * f * h * .9985 * t + 1) / (h * h);
      }
    }
    const k = .018 * env;
    add(s, l * k, r * k);
  }
}

// rhythm section from the brand reveal until the outro
const GROOVE0 = 4.4, GROOVE1 = 55;
for (let b = 0; GROOVE0 + b * BEAT < GROOVE1; b++) {
  const t0 = GROOVE0 + b * BEAT, s0 = Math.floor(t0 * SR);
  // kick
  for (let i = 0; i < SR * .35; i++) {
    const t = i / SR, f = 45 + 90 * Math.exp(-t * 30);
    const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 9) * .32;
    add(s0 + i, v, v);
  }
  // off-beat hat (high-passed noise)
  const sh = Math.floor((t0 + BEAT / 2) * SR);
  let prev = 0;
  for (let i = 0; i < SR * .06; i++) {
    const n = Math.random() * 2 - 1, hp = n - prev; prev = n;
    const v = hp * Math.exp(-i / SR * 70) * .035;
    add(sh + i, v * .8, v);
  }
  // bass on beats 1 and 3
  if (b % 2 === 0) {
    const f = hz(ROOTS[chordAt(t0)] - 12);
    for (let i = 0; i < SR * BEAT * 1.8; i++) {
      const t = i / SR;
      const v = (Math.sin(2 * Math.PI * f * t) + .25 * Math.sin(4 * Math.PI * f * t)) * Math.min(1, t * 80) * Math.exp(-t * 2.2) * .16;
      add(s0 + i, v, v);
    }
  }
}

// arpeggio: 8th-note plucks, ping-ponged
for (let k = 0; k * BEAT / 2 < DUR - 2; k++) {
  const t0 = 2.2 + k * BEAT / 2;
  if (t0 > GROOVE1 + 2) break;
  const notes = CHORDS[chordAt(t0)], seq = [0, 2, 4, 3, 1, 3, 4, 2];
  const f = hz(notes[seq[k % 8]] + 12), s0 = Math.floor(t0 * SR), pan = k % 2 ? .35 : .65;
  for (let i = 0; i < SR * .5; i++) {
    const t = i / SR;
    const v = (Math.sin(2 * Math.PI * f * t) + .3 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t * 7) * .05;
    add(s0 + i, v * (1 - pan) * 2, v * pan * 2);
  }
}

// impact + reverse swell into the brand reveal
for (let i = 0; i < SR * 1.6; i++) {
  const t = i / SR, f = 30 + 70 * Math.exp(-t * 5);
  const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 2.5) * .35;
  add(Math.floor(4.4 * SR) + i, v, v);
}
for (let i = 0; i < SR * 1.4; i++) {
  const t = i / SR, n = Math.random() * 2 - 1;
  const v = n * Math.pow(t / 1.4, 3) * .06;
  add(Math.floor(3.0 * SR) + i, v, v);
}

// simple stereo delay for space, master fades, soft clip
const D = Math.floor(BEAT * .75 * SR);
for (let i = D; i < N; i++) { L[i] += R[i - D] * .22; R[i] += L[i - D] * .22; }
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const t = i / SR, g = Math.min(1, t / .6) * Math.min(1, (DUR - t) / 3.5) * .9;
  buf.writeInt16LE(Math.round(Math.tanh(L[i] * g * 1.3) * 32000), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.tanh(R[i] * g * 1.3) * 32000), 46 + i * 4);
}
fs.writeFileSync(__dirname + '/music.wav', buf);
console.log('music.wav written');
