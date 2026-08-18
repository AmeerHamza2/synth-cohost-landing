'use client';

/**
 * Extruded type, standing in the world.
 *
 * The words are drawn to a canvas in the site's own typeface, then that texture
 * is stacked across a run of planes in depth — the stack *is* the extrusion.
 * Back layers are dark and form the body, the front layer is bright and forms
 * the face, and because it is a real object in the scene it catches the fog,
 * sits behind geometry that is closer, and turns as the camera moves past it.
 *
 * Built this way rather than with `Text3D` because real extruded geometry needs
 * a converted typeface file, which would mean shipping the brand font twice and
 * losing the exact letterforms the rest of the page uses.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { frame } from '../stage/frame';

/** Depth layers. More reads as a deeper extrusion, one draw call each. */
const LAYERS = 16;

interface Built {
  texture: THREE.CanvasTexture;
  aspect: number;
}

function drawToCanvas(lines: string[], fontFamily: string): Built {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const fontSize = 128;
  const lineHeight = fontSize * 1.18;
  const padding = fontSize * 0.35;

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
    ctx.fillText(line, canvas.width / scale / 2, padding + lineHeight * (i + 0.5));
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return { texture, aspect: canvas.width / canvas.height };
}

export interface WorldTextProps {
  lines: string[];
  position: [number, number, number];
  /** Height of one line in world units. */
  size?: number;
  /** Depth of the extrusion. */
  depth?: number;
  color?: string;
  bodyColor?: string;
  /** Which station this belongs to, so it only draws while nearby. */
  station: number;
  /**
   * Selector for the section this belongs to.
   *
   * Used on narrow frames only — see the visibility block in the frame loop.
   */
  narrowAnchor?: string;
}

export default function WorldText({
  lines,
  position,
  size = 1.1,
  depth = 0.55,
  color = '#f5f3ff',
  bodyColor = '#5b21b6',
  station,
  narrowAnchor,
}: WorldTextProps) {
  const [built, setBuilt] = useState<Built | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const here = useRef(new THREE.Vector3());
  const anchorEl = useRef<HTMLElement | null>(null);

  // Wait for the webfont, or the type falls back to a system face and stops
  // matching the rest of the page.
  useEffect(() => {
    let cancelled = false;
    const family = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
    const make = () => {
      if (!cancelled) setBuilt(drawToCanvas(lines, family));
    };
    if (document.fonts?.ready) document.fonts.ready.then(make).catch(make);
    else make();
    return () => {
      cancelled = true;
    };
  }, [lines]);

  useEffect(() => () => built?.texture.dispose(), [built]);

  const layers = useMemo(
    () =>
      Array.from({ length: LAYERS }, (_, i) => {
        const t = i / (LAYERS - 1);
        return {
          z: -depth * (1 - t),
          color: i === LAYERS - 1 ? color : bodyColor,
          opacity: i === LAYERS - 1 ? 1 : 0.9,
        };
      }),
    [depth, color, bodyColor],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || !built) return;
    // Only while the reader is genuinely on this station.
    //
    // The window has to be tight. The 3D layer is fixed to the world while the
    // copy scrolls past it, so a generous window leaves the statement hanging in
    // frame long after its own section has gone — landing on top of the heading
    // of the section before it, which is exactly what it was doing.
    //
    // On a narrow frame the journey is not a tight enough proxy on its own:
    // sections there are several viewports tall, so the journey reaches this
    // station while the previous section's copy still fills the screen, and the
    // statement lands across it. Where a section is named, its own box decides.
    const distance = Math.abs(frame.journey - station);
    let fade = Math.min(1, (0.42 - distance) / 0.16);
    group.visible = distance < 0.42;

    if (frame.viewport.width < 900 && narrowAnchor) {
      if (!anchorEl.current || !anchorEl.current.isConnected) {
        anchorEl.current = document.querySelector<HTMLElement>(narrowAnchor);
      }
      const rect = anchorEl.current?.getBoundingClientRect();
      const vh = window.innerHeight;
      // How much of the section is in view, as a fraction of how much of it
      // *could* be. Measuring against the viewport instead would never reach 1
      // for a section shorter than the screen — which this one is on a phone,
      // so the statement would be permanently faded out.
      const overlap = rect
        ? Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0))
        : 0;
      const room = rect ? Math.min(rect.height, vh) : 1;
      const shown = overlap / Math.max(room, 1);
      group.visible = shown > 0.55;
      fade = Math.min(1, (shown - 0.55) / 0.25);
    }

    if (!group.visible) return;

    // Fade at the edges of that window rather than popping in.
    group.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      if (material) material.opacity = material.userData.baseOpacity * fade;
    });

    // Keep the statement whole in the frame it is actually being read in.
    //
    // It is authored against a wide viewport, where the camera composes the
    // whole set. A narrow one does something different: it pans across to hold
    // the section's subject, and it shoots on a wider lens. Between the two, a
    // fixed object at the centre of the set ends up off to one side and larger
    // than the frame — which, on a line the client asked for by name, is the one
    // thing it must not do.
    //
    // So on a narrow frame it follows the camera and scales down to fit. The
    // camera looks straight down -z there, so its own x is dead centre. Wide
    // frames keep the authored position and size untouched.
    const cam = state.camera as THREE.PerspectiveCamera;
    const narrow = frame.viewport.width < 900;
    let centreX = position[0];
    if (narrow && cam.isPerspectiveCamera) {
      centreX = cam.position.x;
      group.getWorldPosition(here.current);
      const distance = Math.max(0.1, Math.abs(cam.position.z - here.current.z));
      const visibleWidth =
        2 * distance * Math.tan((cam.fov * Math.PI) / 360) * cam.aspect;
      const worldWidth = size * lines.length * built.aspect;
      group.scale.setScalar(Math.min(1, (visibleWidth * 0.88) / worldWidth));
    } else {
      group.scale.setScalar(1);
    }

    // A slow float, and a turn toward the cursor so you see round the letters.
    const calm = frame.reducedMotion;
    group.position.x = centreX;
    group.position.y = position[1] + Math.sin(frame.time * 0.45) * (calm ? 0.02 : 0.09);
    group.rotation.y = calm ? 0 : frame.pointer.x * 0.12;
  });

  if (!built) return null;

  const height = size * lines.length;
  const width = height * built.aspect;

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
            // Remembered so the station fade can scale it without losing the
            // difference between the bright face and the darker body.
            userData={{ baseOpacity: layer.opacity }}
          />
        </mesh>
      ))}
    </group>
  );
}
