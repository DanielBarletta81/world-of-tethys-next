import * as THREE from 'three';

export function createProceduralEarthMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(1, 0.5, 1).normalize() },
      uIceAmount: { value: 0 },
      uHeatAmount: { value: 0 },
      uAerosol: { value: 0 },
      uAnoxia: { value: 0 },
      uPlantLife: { value: 1 },
      uAnimalLife: { value: 1 },
      uLifeDensity: { value: 1 },
      uLandRecovery: { value: 1 },
      uBloom: { value: 0 },
      uOvershoot: { value: 0 },
      uTrophicMotion: { value: 0 },
      uExtinctionType: { value: -1 },
      uBioTemp: { value: 0.5 },
      uPathDamage: { value: 0.0 },
      uResilience: { value: 1.0 }
    },
    vertexShader: `
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      varying vec3 vNormal;

      uniform float uTime;
      uniform vec3 uLightDir;
      uniform float uIceAmount;
      uniform float uHeatAmount;
      uniform float uAerosol;
      uniform float uAnoxia;
      uniform float uPlantLife;
      uniform float uAnimalLife;
      uniform float uLifeDensity;
      uniform float uLandRecovery;
      uniform float uBloom;
      uniform float uOvershoot;
      uniform float uTrophicMotion;
      uniform float uExtinctionType;
      uniform float uBioTemp;
      uniform float uPathDamage;
      uniform float uResilience;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
      }

      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }

      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      float basinMask(vec3 n) {
        float lat = abs(n.y);
        float zone = smoothstep(0.15, 0.35, lat) * smoothstep(0.6, 0.4, lat);
        float irregular = fbm(n * 4.0);
        return smoothstep(0.55, 0.75, irregular) * zone;
      }

      float refugiaMask(vec3 n) {
        float lat = abs(n.y);
        float shelter = smoothstep(0.2, 0.5, lat);
        float noiseField = fbm(n * 5.0);
        return smoothstep(0.65, 0.85, noiseField) * shelter;
      }

      float migrationCorridor(vec3 n, float elevation) {
        float coast = 1.0 - smoothstep(0.48, 0.52, elevation);
        float lat = abs(n.y);
        float latitudeBand = smoothstep(0.15, 0.45, lat) * smoothstep(0.75, 0.55, lat);
        float currentNoise = fbm(n * 3.0);
        return coast * latitudeBand * smoothstep(0.4, 0.7, currentNoise);
      }

      void main() {
        vec3 n = normalize(vNormal);
        float baseElevation = fbm(n * 2.6 + uTime * 0.02);
        float landMask = smoothstep(0.45, 0.55, baseElevation);

        float basin = basinMask(n);
        float refugia = refugiaMask(n);

        vec4 bias = vec4(1.0);
        if (uExtinctionType >= 0.0 && uExtinctionType < 0.5) {
          bias = vec4(1.0, 0.4, 0.5, 1.0);
        } else if (uExtinctionType >= 0.5 && uExtinctionType < 1.5) {
          bias = vec4(0.6, 1.0, 0.3, 0.6);
        } else if (uExtinctionType >= 1.5 && uExtinctionType < 2.5) {
          bias = vec4(0.2, 1.0, 0.6, 1.0);
        } else if (uExtinctionType >= 2.5 && uExtinctionType < 3.5) {
          bias = vec4(0.6, 0.2, 1.0, 0.6);
        } else if (uExtinctionType >= 3.5 && uExtinctionType < 4.5) {
          bias = vec4(0.2, 0.6, 0.3, 0.6);
        }

        float aerosolLocal = clamp(uAerosol * bias.x, 0.0, 1.0);
        float anoxiaLocal = clamp(uAnoxia * bias.y, 0.0, 1.0);
        float basinExpansion = mix(1.0, 1.4, uPathDamage);
        float basinScaled = clamp(basin * basinExpansion, 0.0, 1.0);
        float effectiveAnoxia = max(anoxiaLocal, basinScaled * 0.9);

        float plantLocal = clamp(uPlantLife * (1.0 - bias.z), 0.0, 1.0);
        float animalLocal = clamp(uAnimalLife * (1.0 - bias.w), 0.0, 1.0);

        float refugiaStrength = mix(1.0, 0.4, uPathDamage);
        plantLocal = mix(plantLocal, max(plantLocal, 0.25) * refugiaStrength, refugia);
        animalLocal = mix(animalLocal, max(animalLocal, 0.15) * refugiaStrength, refugia);

        float corridor = migrationCorridor(n, baseElevation);
        float corridorAllowed = corridor * (1.0 - basinScaled);

        plantLocal = clamp(plantLocal + corridorAllowed * 0.25 * uPlantLife, 0.0, 1.0);
        animalLocal = clamp(animalLocal + corridorAllowed * 0.15 * uAnimalLife, 0.0, 1.0);
        animalLocal *= (1.0 - basinScaled * 0.8);

        float plantCeiling = mix(1.0, 0.6, 1.0 - uResilience);
        float animalCeiling = mix(1.0, 0.4, 1.0 - uResilience);
        plantLocal = min(plantLocal, plantCeiling);
        animalLocal = min(animalLocal, animalCeiling);

        float recoveryDrag = mix(1.0, 0.6, 1.0 - uResilience);
        plantLocal *= recoveryDrag;
        animalLocal *= recoveryDrag;

        float tempStress = abs(uBioTemp - 0.5) * 2.0;
        float bioEfficiency = clamp(1.0 - tempStress, 0.0, 1.0);
        float effectiveLife = clamp(uLifeDensity * bioEfficiency, 0.0, 1.0);

        float plantDetail = mix(0.25, 1.0, plantLocal);
        float lifeDetail = mix(0.35, 1.0, effectiveLife);
        float bloomAmplified = uBloom * mix(1.0, 1.3, uPathDamage);
        float overshootAmplified = uOvershoot * mix(1.0, 1.5, uPathDamage);
        float bloomBoost = mix(1.0, 1.6, bloomAmplified);
        float trophicGap = clamp(plantLocal - animalLocal, 0.0, 1.0);
        float overshoot = smoothstep(0.4, 0.8, trophicGap) * overshootAmplified;
        float overshootCollapse = mix(1.0, 0.6, overshoot);

        float detailScale = plantDetail * lifeDetail * bloomBoost * overshootCollapse;
        float elevation = fbm(n * 2.6 * detailScale + uTime * 0.02);

        vec3 coldOcean = vec3(0.05, 0.12, 0.18);
        vec3 warmOcean = vec3(0.08, 0.18, 0.25);
        vec3 anoxicOcean = vec3(0.02, 0.04, 0.06);
        vec3 frozenIce = vec3(0.9, 0.95, 1.0);
        vec3 hotLand = vec3(0.35, 0.25, 0.15);
        vec3 coolLand = vec3(0.18, 0.25, 0.15);
        vec3 bareLand = vec3(0.22, 0.22, 0.20);
        vec3 stressedLand = vec3(0.20, 0.20, 0.18);

        vec3 oceanBase = mix(warmOcean, coldOcean, clamp(uIceAmount, 0.0, 1.0));
        vec3 ocean = mix(oceanBase, anoxicOcean, effectiveAnoxia);

        vec3 healthyLand = mix(coolLand, hotLand, clamp(uHeatAmount, 0.0, 1.0));
        vec3 landCol = mix(stressedLand, healthyLand, clamp(uLandRecovery, 0.0, 1.0));
        landCol = mix(bareLand, landCol, plantLocal);
        landCol = mix(landCol, vec3(0.22, 0.27, 0.18), bloomAmplified * 0.4);
        landCol = mix(landCol, vec3(0.19, 0.20, 0.18), overshoot * 0.5);
        landCol = mix(vec3(0.22), landCol, effectiveLife);

        float pole = abs(n.y);
        float iceCoverage = smoothstep(0.4 - uIceAmount * 0.25, 0.7, pole);

        float reliefMask = smoothstep(0.45, 0.55, elevation);
        float blendedMask = mix(landMask, reliefMask, 0.15);
        vec3 color = mix(ocean, landCol, blendedMask);
        color = mix(color, frozenIce, iceCoverage);

        float ndotl = max(dot(n, normalize(uLightDir)), 0.0);
        float sunAngle = clamp(dot(normalize(uLightDir), vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
        float sulfurVeil = mix(1.0, sunAngle, aerosolLocal);
        float scatteredLight = mix(ndotl, 0.35, aerosolLocal);
        float light = scatteredLight * sulfurVeil;

        float oceanAbsorption = mix(1.0, 0.6, effectiveAnoxia);
        float landFatigue = mix(0.65, 1.0, clamp(uLandRecovery, 0.0, 1.0));
        float surfaceLight = mix(oceanAbsorption, landFatigue, landMask);

        color *= 0.4 + 0.6 * light * surfaceLight;
        color = mix(color, vec3(dot(color, vec3(0.333))), aerosolLocal * 0.25);

        float motionNoise = fbm(n * 6.0 + uTime * 0.05);
        float motionCap = mix(1.0, 0.5, uPathDamage);
        float localMotion = min(uTrophicMotion, motionCap) * (1.0 - basinScaled * 0.9);
        float motionEffect = mix(0.0, motionNoise * 0.02, localMotion);
        color += motionEffect;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true
  });
}
