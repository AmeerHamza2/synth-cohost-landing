/**
 * Cut the supplied character sheet into individual transparent PNGs.
 *
 * The client provides the SYN cast as a single sheet. Rather than hand-cropping
 * 22 sprites (and re-cropping every time the sheet is updated), this finds them
 * automatically: the sheet already has a clean alpha channel, so each character
 * is simply a connected region of non-transparent pixels.
 *
 * Boxes that nearly touch are merged, which keeps a character together with its
 * detached parts — the cloaked figure's floating orb, a creature's loose glow.
 *
 * Run with: node scripts/extract-characters.mjs
 */

import sharp from 'sharp';
import { mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets/source-sheets/floating-avatars-sheet.png';
const OUT_DIR = 'public/characters';

/**
 * Alpha above this counts as a character *body* during labelling.
 *
 * Set high on purpose. The sheet is 55% fully transparent and 37% fully opaque,
 * with a thin tail of soft glow in between — and that glow bridges neighbouring
 * characters into a single blob at any low threshold. Labelling on solid pixels
 * keeps them separate; the glow is still included in the extracted crop.
 */
const ALPHA_CUTOFF = 150;
/** Ignore specks: anything smaller than this is stray glow, not a character. */
const MIN_AREA = 1400;
/** Boxes within this many pixels of each other belong to the same character. */
const MERGE_GAP = 8;
/** Transparent margin kept around each sprite. */
const PADDING = 6;

const overlaps = (a, b, gap) =>
  a.x0 - gap <= b.x1 && b.x0 - gap <= a.x1 && a.y0 - gap <= b.y1 && b.y0 - gap <= a.y1;

function mergeBoxes(boxes, gap) {
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        if (!overlaps(boxes[i], boxes[j], gap)) continue;
        boxes[i] = {
          x0: Math.min(boxes[i].x0, boxes[j].x0),
          y0: Math.min(boxes[i].y0, boxes[j].y0),
          x1: Math.max(boxes[i].x1, boxes[j].x1),
          y1: Math.max(boxes[i].y1, boxes[j].y1),
          area: boxes[i].area + boxes[j].area,
        };
        boxes.splice(j, 1);
        merged = true;
        break outer;
      }
    }
  }
  return boxes;
}

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// --- connected components over the alpha channel ---------------------------
const seen = new Uint8Array(W * H);
const boxes = [];
const stack = new Int32Array(W * H);

for (let start = 0; start < W * H; start++) {
  if (seen[start]) continue;
  if (data[start * 4 + 3] <= ALPHA_CUTOFF) {
    seen[start] = 1;
    continue;
  }

  let top = 0;
  stack[top++] = start;
  seen[start] = 1;
  let x0 = W, y0 = H, x1 = 0, y1 = 0, area = 0;

  while (top > 0) {
    const p = stack[--top];
    const x = p % W;
    const y = (p / W) | 0;
    area++;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;

    // 8-connected, so diagonal wisps stay attached to their owner.
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const np = ny * W + nx;
        if (seen[np]) continue;
        seen[np] = 1;
        if (data[np * 4 + 3] > ALPHA_CUTOFF) stack[top++] = np;
      }
    }
  }

  if (area >= MIN_AREA) boxes.push({ x0, y0, x1, y1, area });
}

/**
 * Split a box that swallowed two neighbours.
 *
 * Every character on this sheet is taller than it is wide, so a landscape box
 * is always two of them whose glows touched. The cut goes at the emptiest
 * column in the middle of the box — the gap between the two figures.
 */
function splitWide(box) {
  const w = box.x1 - box.x0 + 1;
  const h = box.y1 - box.y0 + 1;

  const from = box.x0 + Math.round(w * 0.2);
  const to = box.x0 + Math.round(w * 0.8);
  let bestX = -1;
  let bestCount = Infinity;
  for (let x = from; x <= to; x++) {
    let count = 0;
    for (let y = box.y0; y <= box.y1; y++) {
      if (data[(y * W + x) * 4 + 3] > ALPHA_CUTOFF) count++;
    }
    if (count < bestCount) {
      bestCount = count;
      bestX = x;
    }
  }

  // Two separate figures either make the box landscape, or leave a column with
  // no solid pixels at all running clean through the middle. A single character
  // does neither.
  const landscape = w / h >= 1.12;
  const cleanGap = bestCount === 0 && w > 120;
  if (!landscape && !cleanGap) return [box];
  if (bestX < 0) return [box];

  // Recurse: a box can occasionally have swallowed three.
  return [
    ...splitWide({ ...box, x1: bestX - 1 }),
    ...splitWide({ ...box, x0: bestX + 1 }),
  ];
}

const merged = mergeBoxes(boxes, MERGE_GAP)
  .flatMap(splitWide)
  // Reading order: top row first, left to right.
  .sort((a, b) => (Math.abs(a.y0 - b.y0) > 60 ? a.y0 - b.y0 : a.x0 - b.x0));

await mkdir(OUT_DIR, { recursive: true });
for (const file of await readdir(OUT_DIR).catch(() => [])) {
  if (file.endsWith('.png')) await unlink(path.join(OUT_DIR, file));
}

let index = 0;
for (const box of merged) {
  index++;
  const left = Math.max(0, box.x0 - PADDING);
  const top = Math.max(0, box.y0 - PADDING);
  const width = Math.min(W - left, box.x1 - box.x0 + 1 + PADDING * 2);
  const height = Math.min(H - top, box.y1 - box.y0 + 1 + PADDING * 2);
  const name = `syn-${String(index).padStart(2, '0')}.png`;

  await sharp(SRC)
    .extract({ left, top, width, height })
    // These are drawn small on screen; half size is plenty and keeps the
    // texture budget sane across 20+ sprites.
    .resize({ width: Math.round(width / 2) })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, name));

  console.log(`${name}  ${width}x${height}  at ${left},${top}`);
}

console.log(`\n${index} characters extracted to ${OUT_DIR}`);
