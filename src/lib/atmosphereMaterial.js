import * as THREE from 'three';

export function createAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uLightDir: { value: new THREE.Vector3(1, 0.5, 1).normalize() },
      uIntensity: { value: 0.35 },
      uAerosol: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      precision highp float;

      varying vec3 vNormal;
      varying vec3 vWorldPos;

      uniform vec3 uLightDir;
      uniform float uIntensity;
      uniform float uAerosol;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
        rim = pow(rim, 3.0);

        vec3 cleanAtmosphere = vec3(0.45, 0.65, 0.9);
        vec3 aerosolColor = vec3(0.55, 0.52, 0.48);
        vec3 atmosphereColor = mix(cleanAtmosphere, aerosolColor, uAerosol);

        float hazeStrength = rim * (uIntensity + uAerosol * 0.4);
        float sunAngle = clamp(dot(normalize(uLightDir), vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
        float veil = mix(1.0, sunAngle, uAerosol);
        hazeStrength *= veil;

        gl_FragColor = vec4(atmosphereColor * hazeStrength, hazeStrength);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
}
