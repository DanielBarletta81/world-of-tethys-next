"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050403, 5, 18);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050403, 1);
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2.4, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0b0a09,
      roughness: 1.0,
      metalness: 0.0
    });
    const mass = new THREE.Mesh(geometry, material);
    scene.add(mass);

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    const directional = new THREE.DirectionalLight(0xffffff, 0.35);
    directional.position.set(3, 2, 4);
    scene.add(ambient);
    scene.add(directional);

    let raf = 0;
    const animate = (t) => {
      const time = t * 0.001;
      mass.rotation.y = time * 0.005;
      mass.position.y = Math.sin(time * 0.01) * 0.15;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
