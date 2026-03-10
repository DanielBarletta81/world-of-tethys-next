'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function BookCoverImage({
  primarySrc,
  fallbackSrc = '/img/books/book1-cover.png',
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
