"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HeroContentData, ScrollWorldContentData } from "../content/site";
import ImageWithFallback from "./ImageWithFallback";

type ScrollWorldHeroProps = {
  hero: HeroContentData;
  scrollWorld: ScrollWorldContentData;
};

export default function ScrollWorldHero({
  hero,
  scrollWorld,
}: ScrollWorldHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersMobileVideo, setPrefersMobileVideo] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const videoSrc = useMemo(
    () =>
      prefersMobileVideo
        ? scrollWorld.mobileVideo || scrollWorld.desktopVideo || ""
        : scrollWorld.desktopVideo || scrollWorld.mobileVideo || "",
    [prefersMobileVideo, scrollWorld.desktopVideo, scrollWorld.mobileVideo],
  );
  const shouldUseVideo =
    Boolean(videoSrc) && !hasVideoError && !prefersReducedMotion;
  const scenes = scrollWorld.scenes?.length
    ? scrollWorld.scenes
    : [
        {
          id: "portal",
          no: "01",
          title: hero.title,
          subtitle: hero.positioning,
          body: hero.statement,
        },
      ];
  const activeScene = scenes[activeSceneIndex] ?? scenes[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () =>
      setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    durationRef.current = 0;
    setIsReady(false);
    setHasVideoError(false);
  }, [videoSrc]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateVideoPreference = () =>
      setPrefersMobileVideo(mediaQuery.matches);

    updateVideoPreference();
    mediaQuery.addEventListener("change", updateVideoPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateVideoPreference);
    };
  }, []);

  useEffect(() => {
    if (!shouldUseVideo) return;

    let metadataTimer: number | null = null;

    const updateDuration = () => {
      const video = videoRef.current;
      const duration = video?.duration || 0;
      if (duration) {
        durationRef.current = duration;
        setIsReady(true);
        if (metadataTimer) {
          window.clearInterval(metadataTimer);
          metadataTimer = null;
        }
      }
      return duration;
    };

    const syncVideoTime = () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const duration = durationRef.current || updateDuration();

      if (!section || !video || !duration) return;

      const scrollableDistance = Math.max(
        section.offsetHeight - window.innerHeight,
        1,
      );
      const progress = clamp(
        (window.scrollY - section.offsetTop) / scrollableDistance,
        0,
        1,
      );
      const targetTime = progress * duration;
      const nextSceneIndex = Math.min(
        scenes.length - 1,
        Math.floor(progress * scenes.length),
      );

      if (Number.isFinite(targetTime)) {
        video.currentTime = targetTime;
      }

      setActiveSceneIndex((current) =>
        current === nextSceneIndex ? current : nextSceneIndex,
      );
    };

    const requestSync = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        syncVideoTime();
      });
    };

    const video = videoRef.current;
    requestSync();
    video?.addEventListener("loadedmetadata", requestSync);
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    metadataTimer = window.setInterval(requestSync, 250);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      video?.removeEventListener("loadedmetadata", requestSync);
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      if (metadataTimer) window.clearInterval(metadataTimer);
    };
  }, [scenes.length, shouldUseVideo]);

  if (hasVideoError && scrollWorld.fallbackMode === "static") {
    return <StaticHeroFallback hero={hero} poster={scrollWorld.poster} />;
  }

  return (
    <section ref={sectionRef} id="hero" className="scroll-world-hero">
      <div className="scroll-world-sticky">
        <div className="scroll-world-media" aria-hidden="true">
          <ImageWithFallback
            src={scrollWorld.poster || hero.cover}
            alt=""
            priority
            sizes="100vw"
            className="scroll-world-poster"
          />
          {shouldUseVideo ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={scrollWorld.poster || hero.cover}
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(event) => {
                const duration = event.currentTarget.duration || 0;
                durationRef.current = duration;
                setIsReady(true);
                const section = sectionRef.current;
                if (section && duration) {
                  const scrollableDistance = Math.max(
                    section.offsetHeight - window.innerHeight,
                    1,
                  );
                  const progress = clamp(
                    (window.scrollY - section.offsetTop) / scrollableDistance,
                    0,
                    1,
                  );
                  event.currentTarget.currentTime = progress * duration;
                }
              }}
              onError={() => {
                setHasVideoError(true);
                setIsReady(false);
              }}
            />
          ) : null}
        </div>

        <div className="scroll-world-vignette" aria-hidden="true" />
        <div className="scroll-world-progress" aria-hidden="true">
          <span>{scrollWorld.introTitle}</span>
          <span>{isReady ? "WORLD ACTIVE" : "POSTER READY"}</span>
        </div>

        <div className="scroll-world-copy">
          <div className="brand-lockup">
            <Image
              src="/yito-logo-white-v2.png"
              alt="YITO visual logo"
              width={88}
              height={88}
              priority
            />
          </div>
          <p className="scroll-world-kicker">{activeScene.no}</p>
          <h1>{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <p className="hero-positioning">{hero.positioning}</p>
          <p className="hero-description">{hero.statement}</p>
          <p className="hero-note">{hero.description}</p>
          <div className="hero-tags">
            {hero.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="green-rule" />
          <div className="hero-actions">
            <a href="#work">{hero.primaryCta}</a>
            <a href="#contact">{hero.secondaryCta}</a>
          </div>
        </div>

        <div className="scroll-world-scene-card">
          <span>{scrollWorld.introSubtitle}</span>
          <p>{activeScene.title}</p>
          <strong>{activeScene.subtitle}</strong>
          <small>{activeScene.body}</small>
        </div>

        <div className="scroll-world-rail" aria-hidden="true">
          {scenes.map((scene, index) => (
            <span
              key={scene.id}
              className={index === activeSceneIndex ? "is-active" : ""}
            >
              {scene.no}
            </span>
          ))}
        </div>

        {hasVideoError ? (
          <p className="scroll-world-status">
            视频暂不可用，当前显示 poster fallback。
          </p>
        ) : null}
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function StaticHeroFallback({
  hero,
  poster,
}: {
  hero: HeroContentData;
  poster: string;
}) {
  return (
    <section id="hero" className="chapter hero-chapter">
      <span className="chapter-no">01</span>
      <div className="hero-copy">
        <div className="brand-lockup">
          <Image
            src="/yito-logo-white-v2.png"
            alt="YITO visual logo"
            width={88}
            height={88}
            priority
          />
        </div>
        <h1>{hero.title}</h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <p className="hero-positioning">{hero.positioning}</p>
        <p className="hero-description">{hero.statement}</p>
        <p className="hero-note">{hero.description}</p>
        <div className="hero-tags">
          {hero.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="green-rule" />
        <div className="hero-actions">
          <a href="#work">{hero.primaryCta}</a>
          <a href="#contact">{hero.secondaryCta}</a>
        </div>
      </div>
      <div className="cinematic-visual has-image">
        <ImageWithFallback
          src={poster || hero.cover}
          alt=""
          priority
          className="visual-media"
          sizes="(max-width: 820px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
