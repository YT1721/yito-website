"use client";

import Image from "next/image";
import { useState } from "react";

const DEFAULT_FALLBACK_SRC = "/images/placeholder.jpg";

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  priority,
  sizes = "100vw",
}: ImageWithFallbackProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src || fallbackSrc);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (resolvedSrc !== fallbackSrc) setResolvedSrc(fallbackSrc);
      }}
    />
  );
}
