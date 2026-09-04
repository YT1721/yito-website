"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const durationRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const seekFrameRef = useRef<number | null>(null);
  const lastSeekTimeRef = useRef(-1);
  const touchYRef = useRef<number | null>(null);
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

  const applyVideoSeek = useCallback(() => {
    seekFrameRef.current = null;

    const video = videoRef.current;
    const duration = durationRef.current || video?.duration || 0;

    if (!video || !duration || !Number.isFinite(duration)) return;
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const nextTime = targetProgressRef.current * duration;

    if (Math.abs(nextTime - lastSeekTimeRef.current) < 0.04) return;

    try {
      video.currentTime = nextTime;
      lastSeekTimeRef.current = nextTime;
    } catch {
      // Some browsers reject seeks before the media pipeline is ready.
    }
  }, []);

  const scheduleVideoSeek = useCallback(() => {
    if (seekFrameRef.current != null) return;
    seekFrameRef.current = window.requestAnimationFrame(applyVideoSeek);
  }, [applyVideoSeek]);

  const scrubToProgress = useCallback(
    (progress: number) => {
      const nextProgress = clamp(progress, 0, 1);
      progressRef.current = nextProgress;
      targetProgressRef.current = nextProgress;
      scheduleVideoSeek();

      const nextSceneIndex = Math.min(
        scenes.length - 1,
        Math.floor(nextProgress * scenes.length),
      );

      setActiveSceneIndex((current) =>
        current === nextSceneIndex ? current : nextSceneIndex,
      );
    },
    [scenes.length, scheduleVideoSeek],
  );

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
    lastSeekTimeRef.current = -1;
    targetProgressRef.current = progressRef.current;
    setIsReady(false);
    setHasVideoError(false);
  }, [videoSrc]);

  useEffect(
    () => () => {
      if (seekFrameRef.current != null) {
        window.cancelAnimationFrame(seekFrameRef.current);
      }
    },
    [],
  );

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

    const canScrubInsideHero = (delta: number) => {
      const section = sectionRef.current;
      if (!section) return false;

      const topTolerance = 12;
      const isAtHeroTop = window.scrollY <= section.offsetTop + topTolerance;

      if (!isAtHeroTop) return false;
      if (delta > 0) return progressRef.current < 1;
      if (delta < 0) return progressRef.current > 0;
      return false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!canScrubInsideHero(event.deltaY)) return;

      event.preventDefault();
      const sensitivity = window.innerWidth < 768 ? 2200 : 3600;
      scrubToProgress(progressRef.current + event.deltaY / sensitivity);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      const previousY = touchYRef.current;
      if (currentY == null || previousY == null) return;

      const delta = previousY - currentY;
      touchYRef.current = currentY;

      if (!canScrubInsideHero(delta)) return;

      event.preventDefault();
      scrubToProgress(progressRef.current + delta / 1800);
    };

    const section = sectionRef.current;
    section?.addEventListener("wheel", handleWheel, { passive: false });
    section?.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    section?.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      section?.removeEventListener("wheel", handleWheel);
      section?.removeEventListener("touchstart", handleTouchStart);
      section?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isReady, scrubToProgress, shouldUseVideo]);

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
              preload="auto"
              onLoadedMetadata={(event) => {
                const duration = event.currentTarget.duration || 0;
                durationRef.current = duration;
                setIsReady(true);
                targetProgressRef.current = progressRef.current;
                scheduleVideoSeek();
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
