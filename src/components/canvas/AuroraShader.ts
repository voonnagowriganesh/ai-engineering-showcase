/**
 * GLSL for the hero's aurora backdrop.
 *
 * A full-screen quad renders three layers of animated fractal Brownian motion
 * (fBm), each sampled at a different scale and drift, then mapped onto the
 * theme's three accent colours. The result is a slow, non-repeating colour
 * field — the kind of movement that looks organic rather than looped.
 *
 * Every theme-dependent value arrives as a uniform, so flipping light/dark
 * re-tints the shader without recompiling it.
 */

export const AURORA_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const AURORA_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uPointer;      // 0..1, eased on the CPU
  uniform float uPointerPower; // 0 when the pointer has left the canvas
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform float uIntensity;    // --field-opacity, so light mode stays restrained
  uniform float uIsDark;       // 1.0 dark, 0.0 light

  // ── Value noise ────────────────────────────────────────────────────────────
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float gradientNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    // Quintic smoothstep — C2 continuous, so fBm has no visible grid creases.
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    return mix(
      mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Five octaves: enough detail to read as cloud, cheap enough for 60fps.
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8); // decorrelates the octaves

    for (int i = 0; i < 5; i++) {
      value += amplitude * gradientNoise(p);
      p = rotate * p * 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Aspect-corrected coordinates so the field is not stretched on wide screens.
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

    float t = uTime * 0.045;

    // Domain warping: feed noise into noise so the flow curls instead of sliding.
    vec2 warp = vec2(
      fbm(p * 1.6 + vec2(0.0, t)),
      fbm(p * 1.6 + vec2(5.2, -t))
    );

    float layerA = fbm(p * 2.1 + warp * 1.4 + vec2(t * 1.2, 0.0));
    float layerB = fbm(p * 3.4 - warp * 0.9 + vec2(-t * 0.8, t * 0.6));
    float layerC = fbm(p * 1.2 + warp * 2.1 + vec2(t * 0.4, -t * 0.5));

    // Pointer adds a soft local bloom that follows the cursor.
    vec2 pointer = (uPointer - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    float pointerFalloff = 1.0 - smoothstep(0.0, 0.55, length(p - pointer));
    float bloom = pointerFalloff * pointerFalloff * uPointerPower;

    float a = smoothstep(-0.25, 0.65, layerA + bloom * 0.45);
    float b = smoothstep(-0.30, 0.70, layerB);
    float c = smoothstep(-0.20, 0.60, layerC);

    vec3 colour = vec3(0.0);
    colour += uColorA * a * 0.85;
    colour += uColorB * b * 0.75;
    colour += uColorC * c * 0.45;
    colour += uColorA * bloom * 0.5;

    // Vignette: pull the field away from the edges so text stays readable.
    float vignette = 1.0 - smoothstep(0.35, 1.05, length((uv - 0.5) * 2.0));

    // Light mode uses the field as a tint over white rather than as emitted
    // light, otherwise the accents turn to mud against a bright canvas.
    float alpha = (a * 0.55 + b * 0.4 + c * 0.3) * vignette * uIntensity;
    alpha = mix(alpha * 0.55, alpha, uIsDark);

    gl_FragColor = vec4(colour, clamp(alpha, 0.0, 1.0));
  }
`;
