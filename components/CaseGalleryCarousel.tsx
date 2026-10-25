"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

export default function CaseGalleryCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  const go = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  if (!total) return null;

  return (
    <div
      className="case-carousel"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current == null) return;
        const delta =
          (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 40) return;
        go(index + (delta < 0 ? 1 : -1));
      }}
    >
      <div className="case-carousel-stage">
        {images.map((image, imageIndex) => (
          <div
            key={image}
            className={`case-carousel-slide ${
              imageIndex === index ? "is-active" : ""
            }`}
            aria-hidden={imageIndex !== index}
          >
            <ImageWithFallback
              src={image}
              alt={`${title} ${imageIndex + 1}`}
              className="case-carousel-media"
              priority={imageIndex === 0}
              sizes="(max-width: 1120px) 100vw, 70vw"
            />
          </div>
        ))}

        {total > 1 ? (
          <>
            <button
              type="button"
              className="case-carousel-nav is-prev"
              onClick={() => go(index - 1)}
              aria-label="上一张"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="case-carousel-nav is-next"
              onClick={() => go(index + 1)}
              aria-label="下一张"
            >
              <ChevronRight size={20} />
            </button>
            <span className="case-carousel-counter">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="case-carousel-thumbs" role="tablist">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={imageIndex === index}
              aria-label={`查看第 ${imageIndex + 1} 张`}
              className={`case-carousel-thumb ${
                imageIndex === index ? "is-active" : ""
              }`}
              onClick={() => go(imageIndex)}
            >
              <ImageWithFallback
                src={image}
                alt=""
                className="case-carousel-thumb-media"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
