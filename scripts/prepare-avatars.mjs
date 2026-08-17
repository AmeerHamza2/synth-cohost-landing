/**
 * Prepare the client's supplied avatar art for use in the 3D world.
 *
 * The files arrive as RGB PNGs with no alpha channel despite previewing as
 * transparent — the subjects sit on a near-white background. Dropping them into
 * a dark 3D scene as-is would show a white card behind each character, so the
 * background is removed here, once, at build time.
 *
 * Two modes, because the images are two different problems:
 *
 *   'cutout' — a subject on a flat near-white ground. The background is found
 *     by flood-filling inward from the borders, *not* by thresholding every
 *     pixel: a global threshold also eats the light pixels inside the subject
 *     (skin, highlights, the white logo on the jacket).
 *
 *   'fade' — a dark scene that dissolves into white at one edge. There is no
 *     subject to isolate; the whiteness itself is the transparency, so alpha
 *     comes straight from how far each pixel is from white.
 *
 * Run with: node scripts/prepare-avatars.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * Sources live outside `public/` on purpose: they are build inputs, not
 * deployed assets. Left in `public/` they would ship alongside the WebP the
 * site actually loads — about 5.5 MB of dead weight.
 */
const SRC_DIR = 'assets/avatars-source';
const OUT_DIR = 'public/avatars';

const JOBS = [
  { src: `${SRC_DIR}/syn-lead.png`, name: 'syn-lead', mode: 'cutout', bg: 255 },
  { src: `${SRC_DIR}/syn-second.png`, name: 'syn-second', mode: 'cutout', bg: 255 },
  { src: `${SRC_DIR}/creators.png`, name: 'creators', mode: 'fade' },
  // Supplied on a flat grey card rather than white, so the cutout matches
  // against that value instead.
  { src: `${SRC_DIR}/syn-athlete.png`, name: 'syn-athlete', mode: 'cutout', bg: 150 },
];

/**
 * Flood-fill tolerance. Deliberately loose: the characters have a purple glow
 * that dissolves into the white, and a tight cutoff stops at the outer edge of
 * that glow and leaves a white rim around everything.
 */
const FILL_NEUTRAL = 48;
/** How far a pixel may sit from the supplied background value and still count. */
const BG_TOLERANCE = 55;
/** Edge softening, in pixels. */
const FEATHER = 1;

const luminance = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114;

async function cutout(src, bg) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  // Background test, relative to whatever flat colour the art was supplied on.
  const isBackground = (i) => {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Near-neutral, and close to the known background value.
    return max - min <= FILL_NEUTRAL && Math.abs((r + g + b) / 3 - bg) <= BG_TOLERANCE;
  };

  // Flood fill inward from every border pixel.
  const background = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  let top = 0;
  const push = (i) => {
    if (i < 0 || i >= W * H || background[i]) return;
    if (!isBackground(i)) return;
    background[i] = 1;
    stack[top++] = i;
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  while (top > 0) {
    const p = stack[--top];
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (y > 0) push(p - W);
    if (y < H - 1) push(p + W);
  }

  // Alpha. Inside the subject it is solid. Inside the filled region it is zero
  // *unless* the pixel is tinted, in which case it ramps — that keeps the
  // purple glow fading out while discarding the background completely.
  //
  // The tint test matters: these files were exported with the editor's
  // transparency checkerboard baked in as real pixels, and its grey squares sit
  // exactly in the range a plain whiteness ramp would keep. Requiring chroma
  // throws the checker away and keeps the glow.
  const alpha = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    if (!background[i]) {
      alpha[i] = 1;
      continue;
    }
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const min = Math.min(r, g, b);
    const chroma = Math.max(r, g, b) - min;
    if (chroma < 12) {
      alpha[i] = 0;
      continue;
    }
    const tint = Math.min(1, (chroma - 12) / 30);
    const away = Math.abs((r + g + b) / 3 - bg);
    alpha[i] = Math.min(1, Math.max(0, away / 55)) * tint;
  }

  const blurred = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0;
      let n = 0;
      for (let k = -FEATHER; k <= FEATHER; k++) {
        const xx = x + k;
        if (xx < 0 || xx >= W) continue;
        sum += alpha[y * W + xx];
        n++;
      }
      blurred[y * W + x] = sum / n;
    }
  }
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      let sum = 0;
      let n = 0;
      for (let k = -FEATHER; k <= FEATHER; k++) {
        const yy = y + k;
        if (yy < 0 || yy >= H) continue;
        sum += blurred[yy * W + x];
        n++;
      }
      alpha[y * W + x] = sum / n;
    }
  }

  const out = Buffer.alloc(W * H * 4);
  let kept = 0;
  for (let i = 0; i < W * H; i++) {
    const a = alpha[i];
    // Un-multiply the known white background out of partially transparent
    // pixels. Without this every soft edge keeps the white it was blended
    // against and the whole cutout wears a pale halo.
    for (let c = 0; c < 3; c++) {
      const v = data[i * 3 + c];
      const unmixed = a > 0.02 ? (v - bg * (1 - a)) / a : v;
      out[i * 4 + c] = Math.max(0, Math.min(255, Math.round(unmixed)));
    }
    const a8 = Math.round(a * 255);
    out[i * 4 + 3] = a8;
    if (a8 > 128) kept++;
  }

  return { out, W, H, kept };
}

/**
 * Mean value of the editor's transparency checkerboard.
 *
 * This file was exported with that checkerboard composited *underneath* a scene
 * that was genuinely semi-transparent, so its two greys (measured at ~251 and
 * ~243, in 13px cells) are mixed into every partly-transparent pixel. Setting
 * alpha alone leaves the pattern visible in the colour; the background has to
 * be divided back out.
 *
 * Un-multiplying against the mean rather than the exact cell leaves a residual
 * ripple of about 1.5%, which is invisible, and avoids having to detect the
 * checker's phase and origin.
 */
const CHECKER_MEAN = 247;

/** Checker cell, measured off the file: 13px squares. */
const CHECKER_CELL = 13;

async function fade(src) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const out = Buffer.alloc(W * H * 4);
  let kept = 0;

  // Flatten the checkerboard *before* deriving alpha.
  //
  // Its two greys straddle any threshold, so computing alpha first leaves a
  // grid of alternating transparent and faintly-opaque squares — and
  // un-multiplying afterwards only sharpens them. Averaging over exactly one
  // cell collapses the pair to their mean, and it is applied only to near-white
  // pixels, so the scene itself is never blurred.
  const flat = Float32Array.from(data);
  const half = Math.floor(CHECKER_CELL / 2);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      // Applied everywhere, not just to near-white pixels: the checker is also
      // mixed into the semi-transparent parts of the scene itself (the city
      // glow), and skipping those leaves the pattern exactly where it is most
      // visible.
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let n = 0;
        for (let k = -half; k <= half; k++) {
          const xx = Math.min(W - 1, Math.max(0, x + k));
          sum += data[(y * W + xx) * 3 + c];
          n++;
        }
        flat[i * 3 + c] = sum / n;
      }
    }
  }

  for (let i = 0; i < W * H; i++) {
    const r = flat[i * 3];
    const g = flat[i * 3 + 1];
    const b = flat[i * 3 + 2];
    // Fully transparent at the checker's own brightness, fully opaque once the
    // scene has taken over.
    const l = luminance(r, g, b);
    const t = Math.min(1, Math.max(0, (CHECKER_MEAN - l) / 55));
    const a = t * t * (3 - 2 * t);

    for (let c = 0; c < 3; c++) {
      // Opaque pixels keep their original sharpness; the more transparent a
      // pixel is, the more it leans on the flattened version, because that is
      // exactly where the checker contaminates it.
      const v = data[i * 3 + c] * a + flat[i * 3 + c] * (1 - a);
      const unmixed = a > 0.02 ? (v - CHECKER_MEAN * (1 - a)) / a : v;
      out[i * 4 + c] = Math.max(0, Math.min(255, Math.round(unmixed)));
    }
    const a8 = Math.round(a * 255);
    out[i * 4 + 3] = a8;
    if (a8 > 128) kept++;
  }

  return { out, W, H, kept };
}

await mkdir(OUT_DIR, { recursive: true });

for (const job of JOBS) {
  const { out, W, H, kept } = job.mode === 'cutout'
    ? await cutout(job.src, job.bg)
    : await fade(job.src);

  const dest = path.join(OUT_DIR, `${job.name}.webp`);
  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100, effort: 5 })
    .toFile(dest);

  console.log(
    `${job.name.padEnd(12)} ${W}x${H}  ${job.mode.padEnd(6)}  ${((100 * kept) / (W * H)).toFixed(1)}% opaque  →  ${dest}`,
  );
}
