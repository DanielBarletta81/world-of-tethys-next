"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { createProceduralEarthMaterial } from '@/lib/proceduralEarthMaterial';
import { createAtmosphereMaterial } from '@/lib/atmosphereMaterial';
import { createEstuaryMaterial } from '@/lib/estuaryMaterial';

gsap.registerPlugin(ScrollTrigger);

const GEO_LINEAR = 'cubic-bezier(0.25,0.25,0.25,0.25)';
const PRESSURE_EASE = 'cubic-bezier(0.40,0.00,0.20,1.00)';
const SETTLING_EASE = 'cubic-bezier(0.10,0.90,0.20,1.00)';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const [label, setLabel] = useState('Earth Forms');
  const [subtitle, setSubtitle] = useState('~4,540 MYA');

  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const cameraRig = new THREE.Group();
    cameraRig.add(camera);
    scene.add(cameraRig);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060605, 1);
    mountNode.appendChild(renderer.domElement);

    const earthGeometry = new THREE.SphereGeometry(2, 128, 128);
    const earthMaterial = createProceduralEarthMaterial();
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(2.03, 128, 128);
    const atmosphereMaterial = createAtmosphereMaterial();
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const estuaryGeometry = new THREE.PlaneGeometry(5, 3, 80, 50);
    const estuaryMaterial = createEstuaryMaterial();
    const estuary = new THREE.Mesh(estuaryGeometry, estuaryMaterial);
    estuary.rotation.x = -Math.PI / 2.5;
    estuary.position.set(0, -1.7, 0.5);
    estuary.visible = false;
    estuaryMaterial.opacity = 0;
    scene.add(estuary);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(4, 3, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const tl = gsap.timeline({ defaults: { ease: GEO_LINEAR } });

    const ice = earthMaterial.uniforms.uIceAmount;
    const heat = earthMaterial.uniforms.uHeatAmount;
    const uniforms = earthMaterial.uniforms;
    const atmosphereUniforms = atmosphereMaterial.uniforms;
    const motion = { spin: 0.00025 };

    const EXTINCTION = {
      IMPACT: 0,
      FLOOD_BASALT: 1,
      ANOXIC: 2,
      GLACIATION: 3,
      HOTHOUSE: 4
    };
    const EXTINCTION_SEVERITY = {
      [EXTINCTION.IMPACT]: 0.25,
      [EXTINCTION.FLOOD_BASALT]: 0.18,
      [EXTINCTION.ANOXIC]: 0.22,
      [EXTINCTION.GLACIATION]: 0.2,
      [EXTINCTION.HOTHOUSE]: 0.15
    };
    const appliedExtinctions = new Set();

    const applyPathDependence = (type) => {
      if (appliedExtinctions.has(type)) return;
      appliedExtinctions.add(type);

      const damage = EXTINCTION_SEVERITY[type] ?? 0;
      const nextDamage = Math.min(1, uniforms.uPathDamage.value + damage);
      uniforms.uPathDamage.value = nextDamage;
      uniforms.uResilience.value = Math.max(0, 1 - nextDamage);
    };

    tl.to(camera, { zoom: 0.92, duration: 8, ease: GEO_LINEAR }, 0);
    tl.to(earth.rotation, { y: '+=0.2', duration: 8, ease: GEO_LINEAR }, 0);

    tl.to(camera, { zoom: 0.85, duration: 6, ease: GEO_LINEAR });
    tl.to(earth.rotation, { y: '+=0.32', duration: 6, ease: PRESSURE_EASE }, '<');

    tl.to(camera, { zoom: 0.75, duration: 5, ease: PRESSURE_EASE });

    tl.to(ice, { value: 0.85, duration: 6, ease: PRESSURE_EASE }, '<');
    tl.to(ice, { value: 0.15, duration: 6, ease: GEO_LINEAR });
    tl.to(heat, { value: 0.75, duration: 6, ease: PRESSURE_EASE }, '<');
    tl.to(heat, { value: 0.25, duration: 6, ease: GEO_LINEAR });

    tl.to(cameraRig.position, {
      y: -1.2,
      duration: 10,
      ease: PRESSURE_EASE
    });
    tl.to(camera, { zoom: 0.4, duration: 10, ease: PRESSURE_EASE }, '<');
    tl.to(atmosphereUniforms.uIntensity, { value: 0.0, duration: 10, ease: PRESSURE_EASE }, '<');

    tl.to(camera, { zoom: 0.3, duration: 6, ease: SETTLING_EASE });
    tl.to(earthMaterial, { opacity: 0.0, duration: 6, ease: SETTLING_EASE }, '<');
    tl.to(atmosphereMaterial, { opacity: 0.0, duration: 6, ease: SETTLING_EASE }, '<');
    tl.to(motion, { spin: 0.0, duration: 6, ease: SETTLING_EASE }, '<');
    tl.set(estuary, { visible: true }, '<');
    tl.to(estuaryMaterial, { opacity: 1.0, duration: 6, ease: SETTLING_EASE }, '<');
    tl.to({}, { duration: 3 });

    const systemTl = gsap.timeline({ defaults: { ease: GEO_LINEAR } });

    systemTl.to({}, { duration: 8 });
    systemTl.call(() => applyPathDependence(EXTINCTION.IMPACT));
    systemTl.set(uniforms.uExtinctionType, { value: EXTINCTION.IMPACT });
    systemTl.to([uniforms.uAerosol, atmosphereUniforms.uAerosol], {
      value: 1.0,
      duration: 6,
      ease: PRESSURE_EASE
    });
    systemTl.to(uniforms.uAnoxia, { value: 1.0, duration: 8, ease: PRESSURE_EASE }, '<');
    systemTl.to(uniforms.uPlantLife, { value: 0.0, duration: 6, ease: PRESSURE_EASE }, '<');
    systemTl.to(uniforms.uAnimalLife, { value: 0.0, duration: 4, ease: PRESSURE_EASE }, '<');
    systemTl.to(uniforms.uLandRecovery, { value: 0.0, duration: 6, ease: PRESSURE_EASE }, '<');
    systemTl.to(uniforms.uLifeDensity, { value: 0.0, duration: 6, ease: PRESSURE_EASE }, '<');

    systemTl.to([uniforms.uAerosol, atmosphereUniforms.uAerosol], {
      value: 0.0,
      duration: 14,
      ease: GEO_LINEAR
    });
    systemTl.to(uniforms.uAnoxia, { value: 0.0, duration: 18, ease: GEO_LINEAR }, '+=6');
    systemTl.to(uniforms.uPlantLife, { value: 1.0, duration: 18, ease: GEO_LINEAR }, '<');
    systemTl.to(uniforms.uLandRecovery, { value: 1.0, duration: 24, ease: GEO_LINEAR }, '<');
    systemTl.to(uniforms.uLifeDensity, { value: 1.0, duration: 30, ease: GEO_LINEAR }, '+=6');

    systemTl.to(uniforms.uBloom, { value: 1.0, duration: 6, ease: PRESSURE_EASE }, '+=2');
    systemTl.to(uniforms.uBloom, { value: 0.0, duration: 4, ease: PRESSURE_EASE });

    systemTl.to(uniforms.uOvershoot, { value: 1.0, duration: 10, ease: PRESSURE_EASE }, '+=4');
    systemTl.to(uniforms.uOvershoot, { value: 0.0, duration: 12, ease: GEO_LINEAR });

    systemTl.to(uniforms.uAnimalLife, { value: 1.0, duration: 30, ease: GEO_LINEAR }, '+=8');
    systemTl.to(uniforms.uTrophicMotion, { value: 1.0, duration: 24, ease: GEO_LINEAR }, '+=12');

    systemTl.set(uniforms.uExtinctionType, { value: -1 });

    const labelTrack = [
      { start: 0.0, end: 0.06, title: 'Earth Forms', subtitle: '~4,540 MYA' },
      { start: 0.06, end: 0.12, title: 'First Water', subtitle: '~4,000–3,800 MYA' },
      { start: 0.12, end: 0.2, title: 'First Life', subtitle: '~3,800–3,500 MYA' },
      { start: 0.2, end: 0.3, title: 'The Long Quiet', subtitle: '~3,500–1,000 MYA' },
      { start: 0.3, end: 0.34, title: 'Oxygenation', subtitle: '~2,400 MYA' },
      { start: 0.34, end: 0.38, title: 'Snowball Earth', subtitle: '~720–635 MYA' },
      { start: 0.38, end: 0.44, title: 'Cambrian Explosion', subtitle: '~541 MYA' },
      { start: 0.44, end: 0.5, title: 'Mass Extinction', subtitle: '~444 MYA' },
      { start: 0.5, end: 0.58, title: 'Pangea Forms', subtitle: '~335–250 MYA' },
      { start: 0.58, end: 0.66, title: 'Great Dying', subtitle: '~252 MYA' },
      { start: 0.66, end: 0.72, title: 'Recovery & Reptile Age', subtitle: '~250–200 MYA' },
      { start: 0.72, end: 0.78, title: 'Dinosaur World', subtitle: '~200–145 MYA' },
      { start: 0.78, end: 0.84, title: 'Pangea Breaks', subtitle: '~175–145 MYA' },
      { start: 0.84, end: 0.92, title: 'Toward Tethys', subtitle: '~145–111 MYA' },
      { start: 0.92, end: 0.98, title: 'Human Appearance', subtitle: '~0.3 MYA (scale marker)' },
      { start: 0.98, end: 1.0, title: 'Entering the Estuary', subtitle: '~111 MYA' }
    ];

    const updateLabel = (progress) => {
      const entry = labelTrack.find((item) => progress >= item.start && progress < item.end);
      if (!entry) return;
      setLabel(entry.title);
      setSubtitle(entry.subtitle);
    };

    const logTime = (t) => Math.log10(1 + 9 * t);

    if (prefersReducedMotion()) {
      tl.clear();
      systemTl.clear();
      gsap.set(camera, { zoom: 0.3 });
      gsap.set(atmosphereUniforms.uIntensity, { value: 0.15 });
      gsap.set(uniforms.uTrophicMotion, { value: 0.0 });
      updateLabel(0.9);
    } else {
      tl.pause(0);
      systemTl.pause(0);
      ScrollTrigger.create({
        trigger: '#timeline',
        start: 'top top',
        end: 'bottom+=4000 top',
        scrub: true,
        onUpdate: (self) => {
          const mapped = logTime(self.progress);
          tl.progress(mapped);
          systemTl.progress(mapped);
          if (mapped >= 0.82 && mapped <= 0.9) {
            const local = (mapped - 0.82) / 0.08;
            const peak = local < 0.5 ? local / 0.5 : (1 - local) / 0.5;
            applyPathDependence(EXTINCTION.ANOXIC);
            uniforms.uExtinctionType.value = EXTINCTION.ANOXIC;
            uniforms.uAnoxia.value = Math.max(uniforms.uAnoxia.value, peak);
            uniforms.uAnimalLife.value = Math.min(
              uniforms.uAnimalLife.value,
              1 - peak * 0.9
            );
            uniforms.uLifeDensity.value = Math.min(
              uniforms.uLifeDensity.value,
              1 - peak * 0.6
            );
          } else {
            uniforms.uExtinctionType.value = -1;
          }
          updateLabel(mapped);
        }
      });
    }

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      earth.rotation.y += motion.spin;
      const delta = clock.getDelta();
      earthMaterial.uniforms.uTime.value += delta;
      estuaryMaterial.uniforms.uTime.value += delta;
      uniforms.uBioTemp.value += (uniforms.uHeatAmount.value - uniforms.uBioTemp.value) * 0.02;
      renderer.render(scene, camera);
      camera.updateProjectionMatrix();
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      estuaryGeometry.dispose();
      estuaryMaterial.dispose();
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div className="pointer-events-none absolute left-8 top-8 z-10 max-w-sm text-stone-200">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Deep Time</p>
        <h2 className="text-2xl font-serif text-stone-100">{label}</h2>
        <p className="text-xs text-stone-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
