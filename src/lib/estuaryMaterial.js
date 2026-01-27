import * as THREE from 'three';

export function createEstuaryMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDepth: { value: 0.6 },
      uGlow: { value: 0.25 },
      uRipple: { value: 0.12 },
      uShoreWidth: { value: 0.28 },
      uShoreContrast: { value: 0.6 },
      uFoam: { value: 0.45 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vHeight;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin((pos.x + pos.z) * 1.8 + uTime * 0.3);
        float ripple = sin((pos.x - pos.z) * 2.2 - uTime * 0.25);
        vHeight = (wave + ripple) * uRipple;
        pos.y += vHeight;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      varying float vHeight;

      uniform float uTime;
      uniform float uDepth;
      uniform float uGlow;
      uniform float uRipple;
      uniform float uShoreWidth;
      uniform float uShoreContrast;
      uniform float uFoam;

      float ripple(vec2 p, float t) {
        float d = length(p);
        return sin(d * 10.0 - t * 0.6) * 0.5 + 0.5;
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float r = ripple(uv, uTime);
        float silt = smoothstep(0.1, 0.9, r);
        vec3 shallow = vec3(0.10, 0.22, 0.20);
        vec3 deep = vec3(0.03, 0.08, 0.10);
        vec3 color = mix(deep, shallow, silt * uDepth);
        float shoreMask = smoothstep(1.0 - uShoreWidth, 1.0, length(uv));
        vec3 shoreColor = shallow + vec3(0.04, 0.03, 0.02);
        color = mix(color, shoreColor, shoreMask);
        color += vHeight * 0.2;
        color = mix(color, color * 0.85, shoreMask * uShoreContrast);
        float foamBand = smoothstep(1.0 - uShoreWidth * 0.6, 1.0 - uShoreWidth * 0.2, length(uv));
        float foamPulse = smoothstep(0.35, 0.9, ripple(uv * 1.6, uTime));
        float foam = foamBand * foamPulse * uFoam;
        color = mix(color, vec3(0.85, 0.86, 0.84), foam);
        color += uGlow * 0.1;
        float alpha = 1.0 - shoreMask * 0.55;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: true
  });
}
