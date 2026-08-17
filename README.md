# Synth Cohost — Landing Site

Marketing site for Synth Cohost, an AI co-host for live streamers. Next.js 16
(App Router, Turbopack) with a WebGL layer rendered behind the page content.

- `/` — the seven-section narrative, with the 3D world behind it
- `/products` — pricing and licensed characters
- `/api/auth/session` — session handoff to `synth-cohost-core`

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

Node 20+ . **No environment variables are required** — every one below has a
working default, so the site builds and deploys as-is.

---

## Environment variables

All optional. All are `NEXT_PUBLIC_*`, so they are inlined at build time and a
change needs a redeploy, not just a restart.

### Auth

The sign-in and login modals talk to `synth-cohost-core`. The defaults point at
production, so these only need setting to aim at a different backend.

| Variable | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.synthcohost.com` | Auth API base. Used by `src/lib/auth.ts` and the MFA step in `LoginModal`. |
| `NEXT_PUBLIC_DASHBOARD_URL` | `https://app.synthcohost.com` | Where a signed-in user is sent. |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | unset | Domain written on the `sc_access_token` / `sc_refresh_token` cookies by `/api/auth/session`. **Unset means the cookies are host-only** — they will not be readable on the dashboard subdomain. Set it to `.synthcohost.com` for the session to carry across. Ignored on localhost. |

### 3D layer

| Variable | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SYN_MODEL_URL` | unset | URL of the rigged SYN character (`.glb`). Unset means the site renders the built-in placeholder rig. |
| `NEXT_PUBLIC_SHOW_SYN_FIGURE` | unset | Legacy flag for the earlier per-section stage in `src/three/syn/SynStage.tsx`, which nothing mounts. Leave unset. |

### Shipping the real SYN character

The 3D figure in the world is currently an **articulated placeholder** — a real
skeleton and real blendshapes, but untextured geometry. It is deliberately built
against the same interface a production model would expose, so swapping in the
finished character is a config change, not a code change:

1. Drop the rigged GLB at `public/models/syn.glb` (Draco or Meshopt compressed,
   5–8 MB target).
2. Set `NEXT_PUBLIC_SYN_MODEL_URL=/models/syn.glb` and redeploy.

The model must expose the following for the existing animation driver to pick it
up. Naming is flexible — Mixamo (`mixamorig*`), VRM (`J_Bip_*`) and ARKit
conventions are all understood; see `src/three/syn/rig.ts` for the full alias
table.

- **Bones** — `Hips`, `Spine`, `Chest`, `Neck`, `Head`, `LeftEye`, `RightEye`,
  `Left/RightShoulder`, `Left/RightArm`, `Left/RightForeArm`
- **Blendshapes** — `eyeBlinkLeft`, `eyeBlinkRight`, `jawOpen`, `mouthSmile`,
  `browInnerUp` (ARKit or VRM `Fcl_*` naming)
- **Optional** — outfit meshes tagged `userData.variant` with a role id, which
  the roles section uses to change costume without loading a second model

Anything missing degrades silently rather than throwing: a model with no eye
bones simply moves its head.

---

## The 3D layer

`src/three/` holds the whole WebGL layer. Two things are worth knowing before
touching it.

**It is an enhancement, never a requirement.** `src/three/stage/quality.ts`
returns `off` when WebGL is unavailable or the reader has
`prefers-reduced-motion: reduce`. In that case **zero canvases are created** and
the page renders as the original 2D design. Every visual change the stage makes
is gated behind a `stage-active` class on `<html>`, applied only once a canvas is
live — so the fallback is the default, not a special case.

**One canvas, one world.** There is a single persistent WebGL context mounted in
the root layout, sitting behind all page content with `pointer-events: none`. The
page's own DOM is untouched and fully selectable on top of it.

| Path | What it is |
| --- | --- |
| `stage/StageRoot.tsx` | The single `<Canvas>`, quality tiering, post-processing |
| `stage/frame.ts` | Per-frame mutable state, deliberately outside React so scroll and pointer updates never re-render |
| `stage/useStageDriver.ts` | Turns scroll into `frame.journey` — a continuous position along the page measured in section units |
| `world/World.tsx` | Floor, fog, dust, and the fly camera that follows `frame.journey` |
| `world/Stations.tsx` | The seven sets, one per page section, mounted only while the camera is near |
| `world/WorldSyn.tsx` | The rigged figure and the supplied avatar artwork |
| `world/WorldCast.tsx` | The character sprites populating each station |
| `syn/useSynRig.ts` | Breathing, blinking, gaze and mood posture |

Sections declare themselves to the stage with `data-stage="<id>"`, and sections
whose own background would cover the canvas opt out with `.stage-transparent`.

### Not yet mounted

`src/three/scenes/` and `src/three/syn/SynStage.tsx` are the earlier
per-section architecture. They still typecheck but nothing renders them; the
world in `src/three/world/` replaced them. They are kept because the rig
contract documented above is shared.

---

## Asset pipeline

Scripts in `scripts/` prepare artwork; each is run by hand and commits its
output. Source files live in `assets/` (not served); output lands in `public/`.

| Script | In | Out |
| --- | --- | --- |
| `extract-characters.mjs` | `assets/source-sheets/floating-avatars-sheet.png` | `public/characters/syn-01…21.png` — cuts 21 characters off the supplied sheet |
| `prepare-avatars.mjs` | `assets/avatars-source/*.png` | `public/avatars/*.webp` — removes the baked-in transparency checkerboard and un-multiplies edges |
| `build-parallax-layers.mjs` | `public/*.webp` | `public/parallax/*` — splits hero artwork into background and character layers |

```bash
node scripts/extract-characters.mjs
node scripts/prepare-avatars.mjs
node scripts/build-parallax-layers.mjs
```

---

## Known issues

Things a developer picking this up should know about rather than rediscover.

- **`public/` is large (~100 MB)** and every `next/image` on the site passes
  `unoptimized`, so nothing is resized or re-encoded at request time. Worth an
  optimisation pass; it is the biggest lever on page weight.
- **Filenames in `public/` must be URL-safe.** Files with apostrophes or
  parentheses 404 in production while working fine in dev. Two were hit and
  renamed (`our-products-tab.png`, `synth-cohost-demo.mp4`); the same trap
  applies to anything added later.
- **`/avatars/creators.webp` has a faint residual checkerboard.** The supplied
  source is genuinely semi-transparent in places, so the background removal
  cannot fully separate it. A clean source export would fix it.
- **Links without destinations.** "About", "Privacy Policy" and "Terms of
  Service" in the footer are `href="#"` — there are no pages behind them yet.
- **`https://discord.com/synthcohost`** is used as the Discord link in three
  places. Discord invites are `discord.gg/<code>`; this URL is unlikely to
  resolve.
