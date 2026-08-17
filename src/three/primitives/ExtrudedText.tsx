'use client';

/**
 * Text that pops out of the page.
 *
 * Built by drawing the words to a canvas in the site's own typeface and then
 * stacking that texture across a run of planes in depth. The stack is the
 * extrusion: back layers are dark and form the body, the front layer is bright
 * and forms the face.
 *
 * Done this way rather than with `Text3D` because real extruded geometry needs
 * a converted typeface file, which would mean shipping a second copy of the
 * brand font in a different format and losing the exact letterforms the rest of
 * the page uses. A canvas texture keeps the type identical to the CSS.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { damp, frame } from '../stage/frame';

/** Depth layers. More reads as a deeper extrusion and costs one draw each. */
const LAYERS = 14;

interface Built {
  texture: THREE.CanvasTexture;
  aspect: number;
}

function drawToCanvas(lines: string[], fontFamily: string): Built {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const fontSize = 128;
  const lineHeight = fontSize * 1.16;
  const padding = fontSize * 0.4;

  const measure = document.createElement('canvas').getContext('2d')!;
  const font = `800 ${fontSize}px ${fontFamily}`;
  measure.font = font;
  const width = Math.max(...lines.map((l) => measure.measureText(l).width));

  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil((width + padding * 2) * scale);
  canvas.height = Math.ceil((lineHeight * lines.length + padding * 2) * scale);

  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      canvas.width / scale / 2,
      padding + lineHeight * (i + 0.5),
    );
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return { texture, aspect: canvas.width / canvas.height };
}

export interface ExtrudedTextProps {
  /** One entry per line. */
  lines: string[];
  /** Width on screen as a fraction of the viewport. */
  widthFraction?: number;
  /** Depth of the extrusion in world units. */
  depth?: number;
  /** 0..1 master fade, driven by the owning scene. */
  presence: React.RefObject<number>;
  /**
   * Live rect of a DOM element to sit against, in world units. The canvas is
   * viewport-fixed, so without this the type stays put while its section
   * scrolls past underneath it.
   */
  anchor?: React.RefObject<import('./useDomQuad').Quad>;
  /** Where inside that rect to sit, as a fraction from its centre. */
  anchorOffset?: [number, number];
  /** Face colour, and the darker body behind it. */
  color?: string;
  bodyColor?: string;
  position?: [number, number, number];
}

export default function ExtrudedText({
  lines,
  widthFraction = 0.52,
  depth = 0.26,
  presence,
  color = '#f5f3ff',
  bodyColor = '#5b21b6',
  position = [0, 0, 0],
  anchor,
  anchorOffset = [0, 0],
}: ExtrudedTextProps) {
  const [built, setBuilt] = useState<Built | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);

  // Wait for the webfont before rasterising, or the type falls back to a system
  // face and the letterforms stop matching the rest of the page.
  useEffect(() => {
    let cancelled = false;
    const family =
      getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
    const make = () => {
      if (cancelled) return;
      setBuilt(drawToCanvas(lines, family));
    };
    if (document.fonts?.ready) document.fonts.ready.then(make).catch(make);
    else make();
    return () => {
      cancelled = true;
    };
  }, [lines]);

  useEffect(() => {
    return () => built?.texture.dispose();
  }, [built]);

  // World width of the viewport at the text's depth, so the type scales with
  // the layout instead of being fixed in world units.
  const worldWidth = useMemo(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const distance = Math.abs(camera.position.z - position[2]);
    const height =
      2 * Math.tan(THREE.MathUtils.degToRad(perspective.fov ?? 40) / 2) * distance;
    return height * (size.width / Math.max(size.height, 1));
  }, [camera, size.width, size.height, position]);

  const layers = useMemo(
    () =>
      Array.from({ length: LAYERS }, (_, i) => {
        const t = i / (LAYERS - 1);
        return {
          z: -depth * (1 - t),
          // Back layers are the darkest; the face sits proud and bright.
          color: i === LAYERS - 1 ? color : bodyColor,
          opacity: i === LAYERS - 1 ? 1 : 0.85,
        };
      }),
    [depth, color, bodyColor],
  );

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group || !built) return;
    const dt = Math.min(rawDelta, 0.05);
    const p = presence.current ?? 0;
    group.visible = p > 0.01;
    if (!group.visible) return;

    const calm = frame.reducedMotion;
    const sway = calm ? 0.15 : 1;

    // Turning with the cursor is what makes the extrusion legible — you see
    // round the side of the letters.
    group.rotation.y = damp(group.rotation.y, frame.pointer.x * 0.34 * sway, 3, dt);
    group.rotation.x = damp(group.rotation.x, -frame.pointer.y * 0.2 * sway, 3, dt);
    // Ride the section it belongs to.
    const rect = anchor?.current;
    if (rect?.valid) {
      group.position.x = rect.x + rect.width * anchorOffset[0];
      group.position.y = rect.y + rect.height * anchorOffset[1];
    }
    group.position.z = position[2] + Math.sin(frame.time * 0.5) * (calm ? 0.01 : 0.045);

    // Arrives with a little overshoot rather than simply fading up.
    const eased = p * p * (3 - 2 * p);
    group.scale.setScalar(0.9 + eased * 0.1);
  });

  if (!built) return null;

  const width = worldWidth * widthFraction;
  const height = width / built.aspect;

  return (
    <group ref={groupRef} position={position}>
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, 0, layer.z]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            map={built.texture}
            color={layer.color}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
