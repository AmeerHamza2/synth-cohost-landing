'use client';

/**
 * SYN model source.
 *
 * `null` means "no production model available" and the stage renders the
 * articulated proxy in `SynProxy.tsx`. This is deliberately a hard switch and
 * not a fetch-with-fallback: there is no 404 in the happy path, and the
 * `useGLTF` code path is never even loaded until a URL exists.
 *
 * To ship the real character:
 *   1. Drop the rigged GLB at `public/models/syn.glb` (Draco or Meshopt
 *      compressed, ~5-8 MB target).
 *   2. Set `NEXT_PUBLIC_SYN_MODEL_URL=/models/syn.glb`.
 *
 * Rig requirements — the model must expose these for the existing driver to
 * animate it without code changes (see `rig.ts` for the accepted aliases):
 *   - Bones: Hips, Spine, Chest, Neck, Head, LeftEye, RightEye,
 *     Left/RightShoulder, Left/RightArm, Left/RightForeArm
 *     (Mixamo `mixamorig*` and VRM `J_Bip_*` naming are both understood)
 *   - Blendshapes: eyeBlinkLeft, eyeBlinkRight, jawOpen, mouthSmile,
 *     browInnerUp (ARKit or VRM `Fcl_*` naming)
 *   - Optional: outfit meshes tagged `userData.variant` with a role id, which
 *     the roles section uses to swap costume without loading a second model.
 *
 * Anything missing degrades silently — a model without eye bones simply moves
 * its head, it does not throw.
 */

/**
 * Whether the per-section stage in `SynStage.tsx` renders a figure.
 *
 * Only that component reads this, and nothing on the page mounts it any more —
 * the world in `world/` is what ships, and `world/WorldSyn.tsx` mounts the
 * rigged figure unconditionally, alongside the supplied avatar artwork rather
 * than instead of it. This flag and `SynStage` are the earlier per-section
 * architecture, kept because the rig contract documented above still applies.
 */
export const SHOW_SYN_FIGURE =
  process.env.NEXT_PUBLIC_SHOW_SYN_FIGURE === 'true';

const url = process.env.NEXT_PUBLIC_SYN_MODEL_URL?.trim();

export const SYN_MODEL_URL: string | null = url && url.length > 0 ? url : null;

/** True while the stage is running on the placeholder rig. */
export const USING_PROXY_MODEL = SYN_MODEL_URL === null;
