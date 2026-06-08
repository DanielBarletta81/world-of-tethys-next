'use client';

import { useState } from 'react';
import Image from 'next/image';
import cdn from '@/lib/cdn';

const DEFAULT_COVER = cdn('/img/books/book1-cover.png');

export default function BookCoverImage({
  primarySrc,
  fallbackSrc = DEFAULT_COVER,
  alt,
  width = 720,
  height = 1080,
  className = '',
  priority = false,
}) {
  const [src, setSrc] = useState(primarySrc || fallbackSrc);

  return (
    <Image
      src={src || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}
