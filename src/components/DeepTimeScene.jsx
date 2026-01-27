"use client";

import dynamic from 'next/dynamic';

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), {
  ssr: false
});

export default function DeepTimeScene() {
  return <ThreeCanvas />;
}
