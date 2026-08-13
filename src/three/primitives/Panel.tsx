'use client';

/**
 * Reusable "UI object" primitives.
 *
 * Deliberately abstract: no 3D text anywhere on this page. The DOM already
 * carries every word, and rendering copy into WebGL would duplicate it,
 * break selection and screen readers, and pull a font loader into the bundle.
 * The 3D layer's job is the shape and behaviour of the information — a chat
 * message arriving, a document being absorbed — while the HTML says what it is.
 */

import { forwardRef, useMemo } from 'react';
import { useDisposable } from './useDisposable';
import * as THREE from 'three';

/** Rounded-rectangle shape, cached per size so panels share geometry. */
function roundedRect(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

export interface PanelProps {
  width: number;
  height: number;
  radius?: number;
  color?: string;
  emissive?: string;
  opacity?: number;
  /** Faint horizontal bars standing in for lines of text. */
  lines?: number;
  lineColor?: string;
}

/**
 * A floating glass panel — the building block for chat messages, stream UI,
 * documents and controls across the seven sections.
 */
export const Panel = forwardRef<THREE.Group, PanelProps>(function Panel(
  {
    width,
    height,
    radius = 0.03,
    color = '#150f28',
    emissive = '#7c3aed',
    opacity = 0.82,
    lines = 0,
    lineColor = '#b58af7',
  },
  ref,
) {
  const geometry = useMemo(
    () => new THREE.ShapeGeometry(roundedRect(width, height, radius), 4),
    [width, height, radius],
  );

  const border = useMemo(() => {
    const points = roundedRect(width, height, radius).getPoints(48);
    return new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, p.y, 0)),
    );
  }, [width, height, radius]);

  useDisposable(geometry, border);

  const lineRows = useMemo(() => {
    if (lines <= 0) return [];
    const rows: Array<{ y: number; w: number }> = [];
    const gap = height / (lines + 1);
    for (let i = 0; i < lines; i++) {
      // Ragged right edge so it reads as text rather than a barcode.
      const factor = i === lines - 1 ? 0.52 : 0.62 + ((i * 37) % 30) / 100;
      rows.push({ y: height / 2 - gap * (i + 1), w: width * factor });
    }
    return rows;
  }, [lines, height, width]);

  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments position={[0, 0, 0.001]}>
        <primitive object={border} attach="geometry" />
        <lineBasicMaterial color={emissive} transparent opacity={0.75} />
      </lineSegments>
      {lineRows.map((row, i) => (
        <mesh key={i} position={[-(width - row.w) / 2 + 0.012, row.y, 0.002]}>
          <planeGeometry args={[row.w - 0.024, height * 0.055]} />
          <meshBasicMaterial
            color={lineColor}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
});

/** Thin glowing ring, used for orbits, focus rings and processing halos. */
export function Ring({
  radius,
  thickness = 0.004,
  color = '#7c3aed',
  opacity = 0.5,
  segments = 64,
}: {
  radius: number;
  thickness?: number;
  color?: string;
  opacity?: number;
  segments?: number;
}) {
  return (
    <mesh>
      <ringGeometry args={[radius - thickness, radius + thickness, segments]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Straight glowing link between two points, for knowledge graph edges. */
export function Link({
  from,
  to,
  color = '#8b5cf6',
  opacity = 0.35,
}: {
  from: THREE.Vector3 | [number, number, number];
  to: THREE.Vector3 | [number, number, number];
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const a = Array.isArray(from) ? new THREE.Vector3(...from) : from;
    const b = Array.isArray(to) ? new THREE.Vector3(...to) : to;
    return new THREE.BufferGeometry().setFromPoints([a, b]);
  }, [from, to]);

  useDisposable(geometry);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}
