"use client";

import Image from "next/image";
import type { ElementType } from "react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const ModelViewerElement = "model-viewer" as ElementType;
const LOOP_CROSSFADE_MS = 260;
const LOOP_START_OFFSET_SECONDS = 0.025;
const LOOP_END_BUFFER_SECONDS = 0.06;
const REFERENCE_SOURCE_DURATION_SECONDS = 26.65;
let syncedLoopEpochMs = 0;

function getSyncedLoopEpochMs() {
  if (!syncedLoopEpochMs) {
    syncedLoopEpochMs = performance.now();
  }

  return syncedLoopEpochMs;
}

type ProductModelViewerProps = {
  alt: string;
  fallbackImage: string;
  hasModel: boolean;
  modelUrl: string;
  videoUrl?: string;
  videoMp4Url?: string;
  videoScale?: number;
  videoPlaybackRate?: number;
  className?: string;
};

export function ProductModelViewer({
  alt,
  fallbackImage,
  hasModel,
  modelUrl,
  videoUrl,
  videoMp4Url,
  videoScale = 1,
  videoPlaybackRate = 1.12,
  className
}: ProductModelViewerProps) {
  const reduceMotion = useReducedMotion();
  const [preferLightweightVideo, setPreferLightweightVideo] = useState(false);
  const [hasError, setHasError] = useState(!hasModel);

  useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setPreferLightweightVideo(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (videoUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-[26px] border border-white/10 bg-metal-sheen", className)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.05)_48%,transparent_72%)] opacity-70 mix-blend-screen" />
        {reduceMotion ? (
          <Image src={fallbackImage} alt={alt} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 40vw" />
        ) : preferLightweightVideo ? (
          <NativeLoopVideo
            alt={alt}
            fallbackImage={fallbackImage}
            videoUrl={videoUrl}
            videoMp4Url={videoMp4Url}
            videoScale={videoScale}
          />
        ) : (
          <SmoothLoopVideo
            key={videoUrl}
            alt={alt}
            fallbackImage={fallbackImage}
            videoUrl={videoUrl}
            videoMp4Url={videoMp4Url}
            videoScale={videoScale}
            videoPlaybackRate={videoPlaybackRate}
          />
        )}
      </div>
    );
  }

  if (!hasModel || hasError) {
    return (
      <div className={cn("relative overflow-hidden rounded-[26px] border border-white/10 bg-metal-sheen", className)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.05)_48%,transparent_72%)] opacity-70 mix-blend-screen" />
        <Image src={fallbackImage} alt={alt} fill className="object-contain p-6" sizes="(max-width: 768px) 100vw, 40vw" />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03]", className)}>
      <ModelViewerElement
        src={modelUrl}
        poster={fallbackImage}
        alt={alt}
        loading="lazy"
        exposure="1.1"
        camera-controls
        auto-rotate={reduceMotion ? undefined : true}
        rotation-per-second="18deg"
        shadow-intensity="1"
        interaction-prompt="none"
        touch-action="pan-y"
        className="h-full w-full bg-transparent"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

type SmoothLoopVideoProps = {
  alt: string;
  fallbackImage: string;
  videoUrl: string;
  videoMp4Url?: string;
  videoScale: number;
  videoPlaybackRate: number;
};

function SmoothLoopVideo({
  alt,
  fallbackImage,
  videoUrl,
  videoMp4Url,
  videoScale,
  videoPlaybackRate
}: SmoothLoopVideoProps) {
  const primaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const crossfadeTimeoutRef = useRef<number | null>(null);
  const activeIndexRef = useRef<0 | 1>(0);
  const isCrossfadingRef = useRef(false);
  const [visibleIndex, setVisibleIndex] = useState<0 | 1>(0);

  useEffect(() => {
    const firstVideo = primaryVideoRef.current;
    const secondVideo = secondaryVideoRef.current;

    if (!firstVideo || !secondVideo) {
      return;
    }

    const videos: [HTMLVideoElement, HTMLVideoElement] = [firstVideo, secondVideo];
    const overlapSeconds = LOOP_CROSSFADE_MS / 1000;
    const targetLoopDurationSeconds = REFERENCE_SOURCE_DURATION_SECONDS / videoPlaybackRate;
    let started = false;
    let disposed = false;

    const hasUsableDuration = (video: HTMLVideoElement) => Number.isFinite(video.duration) && video.duration > 0;

    const getSourceLoopSpan = (video: HTMLVideoElement) =>
      hasUsableDuration(video)
        ? Math.max(video.duration - LOOP_START_OFFSET_SECONDS - LOOP_END_BUFFER_SECONDS - overlapSeconds, 0.001)
        : 0.001;

    const applyPlaybackRate = (video: HTMLVideoElement) => {
      if (!hasUsableDuration(video)) {
        return;
      }

      const computedRate = getSourceLoopSpan(video) / targetLoopDurationSeconds;
      video.defaultPlaybackRate = computedRate;
      video.playbackRate = computedRate;
    };

    const pauseAndReset = (video: HTMLVideoElement) => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
    };

    const primeVideo = async (video: HTMLVideoElement) => {
      try {
        video.currentTime = LOOP_START_OFFSET_SECONDS;
      } catch {}

      applyPlaybackRate(video);

      try {
        await video.play();
      } catch {}
    };

    const setSyncedCurrentTime = (video: HTMLVideoElement) => {
      if (!hasUsableDuration(video)) {
        return;
      }

      const elapsedSeconds = (performance.now() - getSyncedLoopEpochMs()) / 1000;
      const normalizedProgress = (elapsedSeconds % targetLoopDurationSeconds) / targetLoopDurationSeconds;

      try {
        video.currentTime = LOOP_START_OFFSET_SECONDS + normalizedProgress * getSourceLoopSpan(video);
      } catch {}
    };

    const clearLoopHandles = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (crossfadeTimeoutRef.current !== null) {
        window.clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
    };

    const startLoop = () => {
      if (started || disposed || !videos.every(hasUsableDuration)) {
        return;
      }

      started = true;
      setVisibleIndex(0);
      activeIndexRef.current = 0;
      isCrossfadingRef.current = false;

      for (const video of videos) {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        applyPlaybackRate(video);
      }

      pauseAndReset(firstVideo);
      pauseAndReset(secondVideo);
      setSyncedCurrentTime(firstVideo);
      void primeVideo(firstVideo);

      const tick = () => {
        const activeVideo = videos[activeIndexRef.current];

        if (!activeVideo || !hasUsableDuration(activeVideo) || isCrossfadingRef.current) {
          animationFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        const crossfadeStartTime = LOOP_START_OFFSET_SECONDS + getSourceLoopSpan(activeVideo);

        if (activeVideo.currentTime >= crossfadeStartTime) {
          const standbyIndex = activeIndexRef.current === 0 ? 1 : 0;
          const standbyVideo = videos[standbyIndex];

          if (standbyVideo) {
            isCrossfadingRef.current = true;
            void primeVideo(standbyVideo);
            setVisibleIndex(standbyIndex);

            crossfadeTimeoutRef.current = window.setTimeout(() => {
              pauseAndReset(activeVideo);
              activeIndexRef.current = standbyIndex;
              isCrossfadingRef.current = false;
            }, LOOP_CROSSFADE_MS);
          }
        }

        animationFrameRef.current = requestAnimationFrame(tick);
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    const handleReady = () => {
      startLoop();
    };

    for (const video of videos) {
      video.addEventListener("loadedmetadata", handleReady);
      video.addEventListener("canplay", handleReady);
    }

    startLoop();

    return () => {
      disposed = true;
      clearLoopHandles();
      for (const video of videos) {
        video.removeEventListener("loadedmetadata", handleReady);
        video.removeEventListener("canplay", handleReady);
      }
      pauseAndReset(firstVideo);
      pauseAndReset(secondVideo);
    };
  }, [videoPlaybackRate, videoUrl]);

  return (
    <div className="relative z-10 h-full w-full" aria-label={alt}>
      {[primaryVideoRef, secondaryVideoRef].map((videoRef, index) => (
        <video
          key={`${videoUrl}-${index}`}
          ref={videoRef}
          className="absolute inset-0 h-full w-full origin-center object-cover transition-[opacity,transform] duration-300 will-change-[opacity,transform]"
          muted
          playsInline
          preload="auto"
          poster={fallbackImage}
          disablePictureInPicture
          aria-hidden={visibleIndex !== index}
          style={{
            opacity: visibleIndex === index ? 1 : 0,
            transform: `scale(${videoScale})`
          }}
        >
          <source src={videoUrl} type="video/webm" />
          {videoMp4Url ? <source src={videoMp4Url} type="video/mp4" /> : null}
        </video>
      ))}
    </div>
  );
}

function NativeLoopVideo({
  alt,
  fallbackImage,
  videoUrl,
  videoMp4Url,
  videoScale
}: {
  alt: string;
  fallbackImage: string;
  videoUrl: string;
  videoMp4Url?: string;
  videoScale: number;
}) {
  return (
    <div className="relative z-10 h-full w-full" aria-label={alt}>
      <video
        className="absolute inset-0 h-full w-full origin-center object-cover"
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        poster={fallbackImage}
        disablePictureInPicture
        style={{
          transform: `scale(${videoScale})`
        }}
      >
        <source src={videoUrl} type="video/webm" />
        {videoMp4Url ? <source src={videoMp4Url} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
