import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AURORA_FRAGMENT_SHADER, AURORA_VERTEX_SHADER } from './AuroraShader';
import { useTheme } from '@/hooks/useTheme';
import { useReducedMotion } from '@/hooks/useInteractions';
import { hexToRgbNormalised, readCssVariable } from '@/lib/utils';

interface AuroraUniforms {
  uTime: { value: number };
  uResolution: { value: THREE.Vector2 };
  uPointer: { value: THREE.Vector2 };
  uPointerPower: { value: number };
  uColorA: { value: THREE.Color };
  uColorB: { value: THREE.Color };
  uColorC: { value: THREE.Color };
  uIntensity: { value: number };
  uIsDark: { value: number };
}

/** Reads the live theme tokens straight out of CSS, so there is one palette. */
function readThemePalette(): {
  colours: [THREE.Color, THREE.Color, THREE.Color];
  intensity: number;
} {
  const toColor = (token: string, fallback: string): THREE.Color => {
    const raw = readCssVariable(token) || fallback;
    const [r, g, b] = hexToRgbNormalised(raw.startsWith('#') ? raw : fallback);
    return new THREE.Color(r, g, b);
  };

  const intensityRaw = Number.parseFloat(readCssVariable('--field-opacity'));

  return {
    colours: [
      toColor('--c-accent', '#22d3ee'),
      toColor('--c-accent-2', '#8b5cf6'),
      toColor('--c-accent-3', '#e879f9'),
    ],
    intensity: Number.isFinite(intensityRaw) ? intensityRaw : 1,
  };
}

function AuroraPlane({ isDark }: { readonly isDark: boolean }): React.JSX.Element {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  // Pointer is eased on the CPU: a raw value makes the bloom snap and jitter.
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerPowerTarget = useRef(0);

  const uniforms = useMemo<AuroraUniforms>(() => {
    const { colours, intensity } = readThemePalette();
    return {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerPower: { value: 0 },
      uColorA: { value: colours[0] },
      uColorB: { value: colours[1] },
      uColorC: { value: colours[2] },
      uIntensity: { value: intensity },
      uIsDark: { value: isDark ? 1 : 0 },
    };
    // Built once; theme changes are pushed imperatively below so the material
    // is never torn down and recompiled mid-animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-tint on theme change. The CSS variables have already flipped by the time
  // this effect runs, so reading them here gives the new palette.
  useEffect(() => {
    const { colours, intensity } = readThemePalette();
    uniforms.uColorA.value = colours[0];
    uniforms.uColorB.value = colours[1];
    uniforms.uColorC.value = colours[2];
    uniforms.uIntensity.value = intensity;
    uniforms.uIsDark.value = isDark ? 1 : 0;
  }, [isDark, uniforms]);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height, uniforms]);

  // Track the pointer against the window: the canvas sits behind the hero
  // content, so it never receives pointer events of its own.
  useEffect(() => {
    const handleMove = (event: PointerEvent): void => {
      pointerTarget.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      );
      pointerPowerTarget.current = 1;
    };
    const handleLeave = (): void => {
      pointerPowerTarget.current = 0;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  useFrame((_state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    uniforms.uTime.value += delta;

    const ease = Math.min(1, delta * 4.5);
    uniforms.uPointer.value.lerp(pointerTarget.current, ease);
    uniforms.uPointerPower.value +=
      (pointerPowerTarget.current - uniforms.uPointerPower.value) * ease;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={AURORA_VERTEX_SHADER}
        fragmentShader={AURORA_FRAGMENT_SHADER}
        uniforms={uniforms as unknown as Record<string, THREE.IUniform>}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/**
 * The hero's animated aurora.
 *
 * Mounted lazily and skipped entirely for reduced-motion visitors — the CSS
 * `AmbientBackdrop` already provides a static version of the same atmosphere,
 * so nothing looks broken without it.
 */
export function AuroraField(): React.JSX.Element | null {
  const { isDark } = useTheme();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas
        // Orthographic + a clip-space quad: no camera maths in the shader.
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        // Capped DPR — the field is low-frequency, so 2x adds cost but no detail.
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          // Keeps the colour ramp smooth instead of banding in dark areas.
          preserveDrawingBuffer: false,
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <AuroraPlane isDark={isDark} />
      </Canvas>
    </div>
  );
}
