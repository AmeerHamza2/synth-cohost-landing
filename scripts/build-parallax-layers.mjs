/**
 * Split the flat avatar artwork into parallax layers.
 *
 * The source art only exists as flattened exports — character, background,
 * lighting and effects all baked into one bitmap — and no layered originals are
 * available. So the layers are derived here instead, once, at build time:
 *
 *   <name>-character.png   the subject, cut out, with a soft alpha edge
 *   <name>-background.png  the same plate with the subject painted out
 *
 * The 3D layer draws them as two planes at different depths, which is what
 * produces real 2.5D separation rather than an approximation of it.
 *
 * The subject is found by luminance inside a bounding box: every one of these
 * plates puts the character against a smooth, near-uniform ground, so a soft
 * threshold separates them cleanly. The hole left behind is filled per row by
 * interpolating between the background pixels either side of the subject —
 * which works precisely because that ground is a smooth gradient.
 *
 * Run with: node scripts/build-parallax-layers.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = 'public/parallax';

/**
 * @typedef {Object} LayerSpec
 * @property {string} src        source image under public/
 * @property {string} name       output basename
 * @property {[number,number]} box  horizontal band the subject occupies, 0..1
 * @property {[number,number]} vBox vertical band the subject occupies, 0..1
 * @property {'dark'|'light'} subject  whether the subject is darker or lighter
 * @property {[number,number]} threshold  luminance edges: fully background → fully subject
 */

/** @type {LayerSpec[]} */
const SPECS = [
  {
    // Hero: dark character on a light lavender ground. The purple star sits to
    // her right and is deliberately outside the box so it stays in the
    // background plate, where it belongs.
    src: 'public/synth_character_lossless.webp',
    name: 'hero',
    box: [0.4, 0.88],
    vBox: [0.0, 1.0],
    subject: 'dark',
    threshold: [224, 188],
  },
  // Section 03 and the finale are NOT separable this way. Measured inside the
  // character band, both plates are ~80% near-black: the figures are dark
  // silhouettes rim-lit against a dark ground, so no luminance threshold can
  // tell subject from background. Those two sections use the single-plane
  // treatment instead (a soft mask displacing the subject region), and will
  // only get true layers when cut-out character PNGs are supplied.
];

const luminance = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;

/** Smooth 0..1 ramp between two edges, in either direction. */
function ramp(value, from, to) {
  const t = (value - from) / (to - from);
  return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
}

async function buildLayers(spec) {
  const { data, info } = await sharp(spec.src)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  const x0 = Math.floor(spec.box[0] * W);
  const x1 = Math.ceil(spec.box[1] * W);
  const y0 = Math.floor(spec.vBox[0] * H);
  const y1 = Math.ceil(spec.vBox[1] * H);

  // --- subject mask -------------------------------------------------------
  const mask = new Float32Array(W * H);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * W + x) * 3;
      const l = luminance(data[i], data[i + 1], data[i + 2]);
      mask[y * W + x] =
        spec.subject === 'dark'
          ? ramp(l, spec.threshold[0], spec.threshold[1])
          : ramp(l, spec.threshold[0], spec.threshold[1]);
    }
  }

  // Soften the edge so the cutout does not read as a sticker. A small
  // separable box blur over the mask is enough at this resolution.
  const blurred = new Float32Array(W * H);
  const R = 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0;
      let n = 0;
      for (let k = -R; k <= R; k++) {
        const xx = x + k;
        if (xx < 0 || xx >= W) continue;
        sum += mask[y * W + xx];
        n++;
      }
      blurred[y * W + x] = sum / n;
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let sum = 0;
      let n = 0;
      for (let k = -R; k <= R; k++) {
        const yy = y + k;
        if (yy < 0 || yy >= H) continue;
        sum += blurred[yy * W + x];
        n++;
      }
      mask[y * W + x] = sum / n;
    }
  }

  // --- character layer ----------------------------------------------------
  const character = Buffer.alloc(W * H * 4);
  let covered = 0;
  for (let p = 0; p < W * H; p++) {
    const a = mask[p];
    if (a > 0.5) covered++;
    character[p * 4] = data[p * 3];
    character[p * 4 + 1] = data[p * 3 + 1];
    character[p * 4 + 2] = data[p * 3 + 2];
    character[p * 4 + 3] = Math.round(a * 255);
  }

  // --- background layer: paint the subject out ----------------------------
  // Per row, find the span the subject occupies and interpolate across it from
  // the background either side. The ground behind these characters is a smooth
  // gradient, so a straight lerp is indistinguishable from a real plate.
  const background = Buffer.from(data);
  for (let y = 0; y < H; y++) {
    let start = -1;
    for (let x = 0; x <= W; x++) {
      const inside = x < W && mask[y * W + x] > 0.08;
      if (inside && start === -1) start = x;
      if (!inside && start !== -1) {
        const end = x;
        const li = (y * W + Math.max(start - 1, 0)) * 3;
        const ri = (y * W + Math.min(end, W - 1)) * 3;
        const span = end - start;
        for (let k = 0; k < span; k++) {
          const t = span <= 1 ? 0.5 : k / (span - 1);
          const o = (y * W + start + k) * 3;
          background[o] = data[li] * (1 - t) + data[ri] * t;
          background[o + 1] = data[li + 1] * (1 - t) + data[ri + 1] * t;
          background[o + 2] = data[li + 2] * (1 - t) + data[ri + 2] * t;
        }
        start = -1;
      }
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  // WebP rather than PNG: these are photographic plates, and the character
  // layer needs alpha, which WebP carries at a fraction of PNG's weight.
  const charPath = path.join(OUT_DIR, `${spec.name}-character.webp`);
  const bgPath = path.join(OUT_DIR, `${spec.name}-background.webp`);

  await sharp(character, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(charPath);

  // The row interpolation leaves visible streaking. Blur the filled plate hard
  // — it is a smooth gradient, so nothing is lost — then paste the untouched
  // original back over everything outside the subject, which keeps the star and
  // the rest of the plate perfectly sharp.
  const smoothed = await sharp(background, { raw: { width: W, height: H, channels: 3 } })
    .blur(24)
    .raw()
    .toBuffer();

  const finalBg = Buffer.alloc(W * H * 3);
  for (let p2 = 0; p2 < W * H; p2++) {
    // Feather the join so the repaired area blends into the original plate.
    const t = Math.min(1, mask[p2] / 0.08);
    for (let c = 0; c < 3; c++) {
      finalBg[p2 * 3 + c] = data[p2 * 3 + c] * (1 - t) + smoothed[p2 * 3 + c] * t;
    }
  }

  await sharp(finalBg, { raw: { width: W, height: H, channels: 3 } })
    .webp({ quality: 88, effort: 5 })
    .toFile(bgPath);

  const pct = ((100 * covered) / (W * H)).toFixed(1);
  console.log(`${spec.name}: ${W}x${H}  subject covers ${pct}%  →  ${charPath}, ${bgPath}`);
}

for (const spec of SPECS) {
  await buildLayers(spec);
}
