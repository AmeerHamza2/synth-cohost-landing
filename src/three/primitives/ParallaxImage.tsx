'use client';

/**
 * The existing artwork, made dimensional.
 *
 * This does not rebuild anything as a 3D model. It takes the page's own image,
 * draws it on a plane in the 3D layer, and separates it in depth so the subject
 * and the background move at different rates — the 2.5D/parallax effect that
 * makes a flat character feel like it occupies space.
 *
 * Depth comes from a *subject mask*:
 *   - If the image has an alpha channel (the character is already cut out), the
 *     alpha is the mask and the separation is exact.
 *   - Otherwise an elliptical mask marks roughly where the character stands.
 *     Crude, but at the small offsets used here it reads convincingly, and it
 *     costs nothing.
 *
 * On top of that sit the gentle motions the brief asks for: breathing, a slow
 * float, small head and body movement that follows the cursor, and a light that
 * sweeps as the pointer moves.
 *
 * A proper per-layer treatment (hair, clothing, accessories on their own
 * planes) needs the layered source files; this is what is achievable from the
 * flattened exports we have, and the same component takes layered art without
 * changes — pass each layer as its own `ParallaxImage` at a different `depth`.
 */

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, damp, frame, range } from '../stage/frame';
import type { SectionId } from '../stage/types';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * All displacement happens in UV space rather than on the mesh, so the plane's
 * silhouette never distorts and the image keeps its exact footprint on the page.
 */
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uPointer;      // -1..1, smoothed for body movement
  uniform vec2 uEyePointer;   // -1..1, tracked faster, for the gaze
  uniform vec2 uCover;        // object-cover UV scale
  uniform vec2 uOffset;       // object-cover UV offset
  uniform vec2 uFocus;        // subject centre, in UV
  uniform vec2 uEllipse;      // subject radii, in UV
  uniform float uUseAlpha;    // 1 = alpha channel is the subject mask
  uniform float uWholePlane;  // 1 = this plane IS the subject layer
  uniform float uParallax;    // subject vs background separation
  uniform float uBreath;      // -1..1
  uniform float uHeadSway;    // -1..1, upper-body drift
  uniform float uLight;       // 0..1 light strength
  uniform vec3 uLightColor;
  uniform float uOpacity;
  uniform float uPresence;    // 0..1 master fade
  uniform vec2 uEyeL;         // left eye centre, in UV
  uniform vec2 uEyeR;         // right eye centre, in UV
  uniform float uEyeSize;     // eye radius, in UV
  uniform float uEyeTrack;    // how far the iris travels
  uniform float uBlink;       // 0 = open, 1 = closed
  uniform float uEyesOn;      // 0 when this plate has no eyes configured
  varying vec2 vUv;

/**
 * Move one eye.
 *
 * The iris is nudged toward the pointer inside a soft elliptical falloff, so it
 * shifts without dragging the eyelid or the surrounding skin with it. A blink
 * is the same trick inverted: sampling from further away in Y pulls the
 * surrounding skin across the eye, which reads as a lid closing.
 */
vec2 eyeWarp(vec2 uv, vec2 eye, vec2 pointer, float size, float track, float blink) {
  vec2 d = (uv - eye) / vec2(size, size * 0.62);
  float fall = 1.0 - smoothstep(0.15, 0.9, length(d));
  if (fall <= 0.0) return uv;

  // Iris follows the cursor.
  vec2 out_ = uv - pointer * track * fall;
  // Lid closes: widen the Y sample around the eye centre.
  out_.y = eye.y + (out_.y - eye.y) * (1.0 + blink * 1.7 * fall);
  return out_;
}

  void main() {
    // Map the plane's UV through an object-cover fit so the image frames
    // exactly as the CSS version did.
    vec2 base = vUv * uCover + uOffset;

    // Cheap elliptical falloff standing in for a depth map.
    vec2 d = (base - uFocus) / uEllipse;
    float ellipse = 1.0 - smoothstep(0.6, 1.15, length(d));

    // When the art has been separated into its own layer the whole plane is
    // the subject, so it moves as one and no mask is needed.
    float alphaMask = mix(
      texture2D(uMap, clamp(base, 0.001, 0.999)).a,
      1.0,
      uWholePlane
    );
    float mask = mix(ellipse, alphaMask, uUseAlpha);

    // Subject drifts against the background: the whole point of the effect.
    vec2 shift = uPointer * uParallax * mask;

    // Breathing lifts the chest; the head and shoulders sway further. These
    // amplitudes are deliberately large enough to read on a screen recording —
    // the previous values were technically present but invisible.
    float upper = smoothstep(0.25, 0.85, 1.0 - base.y) * mask;
    shift.y += uBreath * 0.021 * mask;
    shift += vec2(uHeadSway * 0.024, 0.0) * upper;

    vec2 uv = base - shift;

    // Eyes last, so they ride on top of the body movement rather than fighting
    // it — the head can drift while the gaze stays on the reader.
    if (uEyesOn > 0.5) {
      uv = eyeWarp(uv, uEyeL, uEyePointer, uEyeSize, uEyeTrack, uBlink);
      uv = eyeWarp(uv, uEyeR, uEyePointer, uEyeSize, uEyeTrack, uBlink);
    }

    uv = clamp(uv, vec2(0.0005), vec2(0.9995));
    vec4 tex = texture2D(uMap, uv);

    // A soft light that follows the pointer, so the scene reacts to the reader.
    float lit = 1.0 - smoothstep(0.0, 0.85, distance(base, uFocus + uPointer * 0.22));
    tex.rgb += uLightColor * lit * uLight * (0.35 + mask * 0.65);

    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity * uPresence);
    #include <colorspace_fragment>
  }
`;

export interface ParallaxImageProps {
  /** Public path of the existing image, unchanged. */
  src: string;
  /**
   * Live rect of the DOM element this image stands in for, in world units.
   * Read every frame so the plane stays locked to the artwork as the page
   * scrolls and reflows.
   */
  quad: React.RefObject<import('./useDomQuad').Quad>;
  /** Subject centre in image space, 0,0 = top-left. */
  focus?: [number, number];
  /** Subject radii in UV space. */
  ellipse?: [number, number];
  /** How far the subject separates from the background. */
  parallax?: number;
  /** Use the image's alpha as the subject mask (set when the art is cut out). */
  useAlpha?: boolean;
  /**
   * This plane is itself a separated layer, so it moves as a whole rather than
   * having a subject picked out of it. Set on the character layer of a split
   * plate; leave off for the background layer, which should barely move.
   */
  wholePlane?: boolean;
  /** 0..1 master fade, driven by the owning scene. */
  presence: React.RefObject<number>;
  /**
   * Section whose scroll progress drives the follow and the hand-off.
   * Omit for a layer that should stay pinned to its plate (a background).
   */
  section?: SectionId;
  /**
   * How far, in world units, the character lags the page as it scrolls. She
   * travels *with* the reader rather than being nailed to the artwork, which
   * is what makes one section's character feel like it hands over to the next.
   */
  follow?: number;
  /**
   * Fade in/out across the section, so the outgoing character dissolves into
   * the incoming one instead of both being on screen at full strength.
   */
  handoff?: boolean;
  /**
   * Eye centres in image space (0,0 = top-left), left then right. Supplying these turns on gaze
   * tracking and blinking for this plate — which is how a flat painting ends up
   * looking at the reader without any of it being modelled.
   */
  eyes?: [[number, number], [number, number]];
  /** Eye radius in UV; the warp falls off to nothing outside it. */
  eyeSize?: number;
  /** How far the iris travels. Small values only; this is a painting. */
  eyeTrack?: number;
  /** Strength of the pointer-driven light. */
  light?: number;
  lightColor?: string;
  opacity?: number;
}

export default function ParallaxImage({
  src,
  quad,
  focus = [0.62, 0.45],
  ellipse = [0.28, 0.55],
  parallax = 0.018,
  useAlpha = false,
  wholePlane = false,
  presence,
  section,
  follow = 0,
  handoff = false,
  eyes,
  eyeSize = 0.024,
  eyeTrack = 0.0035,
  light = 0.12,
  lightColor = '#c4b5fd',
  opacity = 1,
}: ParallaxImageProps) {
  // Encode the path: several of these plates have spaces and commas in their
  // filenames. `next/image` encodes for us in the DOM, but `TextureLoader` is
  // handed the raw string and 404s on them.
  const texture = useLoader(THREE.TextureLoader, encodeURI(src));
  const meshRef = useRef<THREE.Mesh>(null);
  const breath = useRef(0);
  const blink = useRef({ timer: 1.6, progress: -1, queue: 0 });

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uPointer: { value: new THREE.Vector2() },
      uEyePointer: { value: new THREE.Vector2() },
      uCover: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uFocus: { value: new THREE.Vector2(focus[0], 1 - focus[1]) },
      uEllipse: { value: new THREE.Vector2(ellipse[0], ellipse[1]) },
      uUseAlpha: { value: useAlpha ? 1 : 0 },
      uWholePlane: { value: wholePlane ? 1 : 0 },
      uParallax: { value: parallax },
      uBreath: { value: 0 },
      uHeadSway: { value: 0 },
      uLight: { value: light },
      uLightColor: { value: new THREE.Color(lightColor) },
      uOpacity: { value: opacity },
      uPresence: { value: 0 },
      // Y is flipped on the way in. `TextureLoader` sets `flipY`, so texture V
      // runs bottom-up, while anyone measuring a feature off the actual file
      // measures from the top-left. Props are given in image space and
      // converted here so callers never have to think about it.
      uEyeL: { value: new THREE.Vector2(eyes ? eyes[0][0] : 0, eyes ? 1 - eyes[0][1] : 0) },
      uEyeR: { value: new THREE.Vector2(eyes ? eyes[1][0] : 0, eyes ? 1 - eyes[1][1] : 0) },
      uEyeSize: { value: eyeSize },
      uEyeTrack: { value: eyeTrack },
      uBlink: { value: 0 },
      uEyesOn: { value: eyes ? 1 : 0 },
    }),
    // Built once; every value below is updated imperatively per frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texture],
  );

  // Configuring the texture is a side effect, so it belongs in an effect and
  // not in `useMemo`. Layout timing keeps it ahead of the first painted frame,
  // which matters because colour space is one of the settings.
  useLayoutEffect(() => {
    // The lint rule treats anything returned from a hook as immutable. Loaded
    // textures are the documented exception: `useLoader` hands back a cached
    // THREE.Texture that the consumer is expected to configure, and cloning it
    // per component would defeat the cache.
    /* eslint-disable react-hooks/immutability */
    texture.colorSpace = THREE.SRGBColorSpace;
    // Edge clamping matters: the parallax shift samples slightly outside the
    // original frame and must not wrap.
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    /* eslint-enable react-hooks/immutability */
  }, [texture]);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dt = Math.min(rawDelta, 0.05);
    const p = presence.current ?? 0;
    const rect = quad.current;
    mesh.visible = p > 0.005 && !!rect?.valid;
    if (!mesh.visible || !rect) return;

    // Sit where the original image sits — then lag behind the page, so the
    // character drifts with the reader instead of scrolling away with the plate.
    const progress = section ? frame.section[section] : 0;
    const lag = follow * (progress - 0.5) * 2;
    mesh.position.x = rect.x;
    mesh.position.y = rect.y + lag;
    mesh.scale.set(rect.width, rect.height, 1);
    const width = rect.width;
    const height = rect.height;

    // Read the uniforms off the material rather than the memoized object.
    // React Three Fiber clones the uniform holders when it applies the prop, so
    // `u.uFoo.value = x` writes to an orphan and silently does nothing —
    // while in-place mutation of a Vector2 still works, which makes the bug
    // look like only *some* uniforms are broken.
    const material = mesh.material as THREE.ShaderMaterial;
    const u = material.uniforms;
    if (!u?.uPresence) return;

    const calm = frame.reducedMotion;
    breath.current += dt * (calm ? 0.12 : 0.24);

    // Object-cover: scale UVs so the image fills the plane without distorting,
    // exactly matching what `object-cover` did in CSS.
    const image = texture.image as { width: number; height: number } | undefined;
    if (image?.width) {
      const imageAspect = image.width / image.height;
      const planeAspect = width / height;
      if (planeAspect > imageAspect) {
        const s = imageAspect / planeAspect;
        u.uCover.value.set(1, s);
        u.uOffset.value.set(0, (1 - s) / 2);
      } else {
        const s = planeAspect / imageAspect;
        u.uCover.value.set(s, 1);
        u.uOffset.value.set((1 - s) / 2, 0);
      }
    }

    const sway = calm ? 0.2 : 1;
    u.uPointer.value.x = damp(
      u.uPointer.value.x,
      frame.pointer.x * sway,
      3,
      dt,
    );
    u.uPointer.value.y = damp(
      u.uPointer.value.y,
      frame.pointer.y * sway,
      3,
      dt,
    );
    // Eyes settle roughly three times faster than the body. Sharing the body's
    // damping made the gaze feel like it was being dragged along behind.
    u.uEyePointer.value.x = damp(u.uEyePointer.value.x, frame.pointer.x * sway, 9, dt);
    u.uEyePointer.value.y = damp(u.uEyePointer.value.y, frame.pointer.y * sway, 9, dt);

    u.uBreath.value = Math.sin(breath.current * Math.PI * 2);

    // --- blink -----------------------------------------------------------
    const b = blink.current;
    if (b.progress >= 0) {
      b.progress += dt / 0.14;
      if (b.progress >= 1) {
        b.progress = -1;
        if (b.queue > 0) {
          b.queue -= 1;
          b.timer = 0.1;
        } else {
          b.timer = 2.4 + Math.random() * 3.4;
          // People often blink twice in quick succession.
          if (Math.random() < 0.2) b.queue = 1;
        }
      }
    } else {
      b.timer -= dt;
      if (b.timer <= 0) b.progress = 0;
    }
    // Fast close, slower open.
    const shape =
      b.progress < 0 ? 0 : b.progress < 0.32 ? b.progress / 0.32 : 1 - (b.progress - 0.32) / 0.68;
    u.uBlink.value = calm ? 0 : shape;
    u.uHeadSway.value =
      Math.sin(frame.time * 0.42) * 0.35 * sway + frame.pointer.x * 0.5 * sway;
    // Hand-off: rise as the section arrives, dissolve as it leaves. The next
    // section's character is rising on the same frames, so the two cross.
    const fade = handoff
      ? Math.min(range(progress, 0.04, 0.24), 1 - range(progress, 0.72, 0.95))
      : 1;
    u.uPresence.value = p * clamp01(fade);

    // The whole plane floats a little, which reads as the character having
    // weight rather than being pinned to the page.
    mesh.position.z = Math.sin(frame.time * 0.33) * (calm ? 0.008 : 0.05);
    mesh.position.y += Math.sin(frame.time * 0.27) * (calm ? 0.006 : 0.04);

    // A breath in the plane itself, on top of the one in the shader. Small, but
    // it is what stops her reading as a decal.
    const swell = 1 + Math.sin(breath.current * Math.PI * 2) * (calm ? 0.002 : 0.008);
    mesh.scale.x *= swell;
    mesh.scale.y *= swell;
  });

  return (
    <mesh ref={meshRef}>
      {/* Unit plane; the DOM rect drives scale every frame. */}
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
