"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import type { ResolvedWorkVideo } from "../lib/work-media";
import { workMediaLabel } from "../lib/work-media";

type WorkMediaHeroProps = {
  poster: string;
  title: string;
  video: ResolvedWorkVideo;
};

export default function WorkMediaHero({
  poster,
  title,
  video,
}: WorkMediaHeroProps) {
  const [playing, setPlaying] = useState(false);
  const canInline = Boolean(video.embedUrl || video.directUrl);

  if (!canInline) {
    return (
      <div className="case-cinematic-image">
        <ImageWithFallback
          src={poster}
          alt={title}
          className="case-cinematic-media"
          priority
          sizes="(max-width: 1120px) 100vw, 58vw"
        />
      </div>
    );
  }

  if (playing) {
    return (
      <div className="work-hero-player">
        {video.embedUrl ? (
          <iframe
            src={video.embedUrl}
            title={title}
            className="work-bilibili-frame"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            scrolling="no"
            frameBorder={0}
          />
        ) : (
          <video
            src={video.directUrl}
            poster={poster}
            controls
            autoPlay
            playsInline
          />
        )}
        {video.pageUrl ? (
          <a
            className="work-video-origin"
            href={video.pageUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ArrowUpRight size={14} />
            在原平台查看
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="work-hero-poster"
      onClick={() => setPlaying(true)}
      aria-label={`播放 ${title}`}
    >
      <ImageWithFallback
        src={poster}
        alt={title}
        className="case-cinematic-media"
        priority
        sizes="(max-width: 1120px) 100vw, 58vw"
      />
      <span className="work-hero-play">
        <Play size={22} fill="currentColor" />
      </span>
      <span className="work-hero-kind">{workMediaLabel(video.kind)}</span>
    </button>
  );
}
