"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type VideoFrameCallback = (now: number, metadata: { mediaTime: number; presentedFrames: number }) => void;

const DIRECT_LOOP_CROSSFADE_MS = 180;
const DIRECT_LOOP_START_OFFSET_SECONDS = 0.016;
const DIRECT_LOOP_END_BUFFER_SECONDS = 0.04;

type KeyedVideoLogoProps = {
  src: string;
  poster?: string;
  className?: string;
  threshold?: number;
  softness?: number;
  playbackRate?: number;
  startOnScroll?: boolean;
  stillFrameTime?: number;
};

type KeyableVideoElement = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: VideoFrameCallback) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export function KeyedVideoLogo({
  src,
  poster,
  className,
  threshold = 22,
  softness = 34,
  playbackRate = 1,
  startOnScroll = false,
  stillFrameTime = 0
}: KeyedVideoLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [preferDirectVideo, setPreferDirectVideo] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setPreferDirectVideo(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (preferDirectVideo) {
      return;
    }

    const video = videoRef.current as KeyableVideoElement | null;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: true
    });

    if (!context) {
      return;
    }

    let frameId = 0;
    let rafId = 0;
    let isDisposed = false;
    let hasStarted = false;
    let hasDrawnStillFrame = false;
    let hasAttachedScrollListener = false;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const renderFrame = (shouldContinue: boolean) => {
      if (isDisposed || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        if (shouldContinue) {
          scheduleNextFrame();
        }
        return;
      }

      const deviceScale = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
      const targetWidth = Math.max(1, Math.round((canvas.clientWidth || video.videoWidth) * deviceScale));
      const targetHeight = Math.max(1, Math.round((canvas.clientHeight || video.videoHeight) * deviceScale));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const brightest = Math.max(red, green, blue);
        const alphaStrength = clamp((brightest - threshold) / softness, 0, 1);

        if (alphaStrength <= 0) {
          pixels[index + 3] = 0;
          continue;
        }

        pixels[index + 3] = Math.round(alphaStrength * 255);
      }

      context.putImageData(frame, 0, 0);

      if (shouldContinue) {
        scheduleNextFrame();
      }
    };

    const drawFrame = () => {
      renderFrame(true);
    };

    const drawStillFrame = () => {
      renderFrame(false);
      hasDrawnStillFrame = true;
    };

    const scheduleNextFrame = () => {
      if (isDisposed) {
        return;
      }

      if (typeof video.requestVideoFrameCallback === "function") {
        frameId = video.requestVideoFrameCallback(() => {
          drawFrame();
        });
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        drawFrame();
      });
    };

    const startPlayback = () => {
      if (hasStarted || isDisposed) {
        return;
      }

      hasStarted = true;
      video.playbackRate = playbackRate;
      void video.play().catch(() => undefined);
      drawFrame();
    };

    const handleScrollStart = () => {
      if (window.scrollY > 0) {
        startPlayback();
        window.removeEventListener("scroll", handleScrollStart);
        hasAttachedScrollListener = false;
      }
    };

    const attachScrollListener = () => {
      if (hasAttachedScrollListener || isDisposed) {
        return;
      }

      if (window.scrollY > 0) {
        startPlayback();
        return;
      }

      window.addEventListener("scroll", handleScrollStart, { passive: true });
      hasAttachedScrollListener = true;
    };

    const drawConfiguredStillFrame = () => {
      if (hasDrawnStillFrame || isDisposed) {
        attachScrollListener();
        return;
      }

      const safeFrameTime =
        video.duration && Number.isFinite(video.duration)
          ? Math.min(Math.max(stillFrameTime, 0), Math.max(video.duration - 0.01, 0))
          : Math.max(stillFrameTime, 0);

      const finalizeStillFrame = () => {
        drawStillFrame();
        attachScrollListener();
      };

      if (Math.abs(video.currentTime - safeFrameTime) < 0.02) {
        finalizeStillFrame();
        return;
      }

      const handleSeeked = () => {
        video.removeEventListener("seeked", handleSeeked);
        finalizeStillFrame();
      };

      video.pause();
      video.addEventListener("seeked", handleSeeked, { once: true });
      video.currentTime = safeFrameTime;
    };

    const handleCanPlay = () => {
      if (!startOnScroll) {
        startPlayback();
        return;
      }

      if (window.scrollY > 0) {
        startPlayback();
        return;
      }

      drawConfiguredStillFrame();
    };

    video.addEventListener("canplay", handleCanPlay);
    video.load();

    if (video.readyState >= 2) {
      handleCanPlay();
    }

    return () => {
      isDisposed = true;
      video.pause();
      video.removeEventListener("canplay", handleCanPlay);
      window.removeEventListener("scroll", handleScrollStart);

      if (frameId) {
        video.cancelVideoFrameCallback?.(frameId);
      }

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [playbackRate, preferDirectVideo, softness, src, startOnScroll, stillFrameTime, threshold]);

  if (preferDirectVideo) {
    return (
      <SmoothDirectVideoLogo src={src} poster={poster} className={className} />
    );
  }

  return (
    <div className={cn("relative", className)}>
      <video
        ref={videoRef}
        className="sr-only"
        src={src}
        poster={poster}
        autoPlay={!startOnScroll}
        muted
        loop
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className="h-full w-full object-contain" aria-hidden="true" />
    </div>
  );
}

function SmoothDirectVideoLogo({
  src,
  poster,
  className
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
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
    let started = false;
    let disposed = false;

    const hasUsableDuration = (video: HTMLVideoElement) => Number.isFinite(video.duration) && video.duration > 0;

    const pauseAndReset = (video: HTMLVideoElement) => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
    };

    const primeVideo = async (video: HTMLVideoElement) => {
      try {
        video.currentTime = DIRECT_LOOP_START_OFFSET_SECONDS;
      } catch {}

      try {
        await video.play();
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
      }

      pauseAndReset(firstVideo);
      pauseAndReset(secondVideo);
      void primeVideo(firstVideo);

      const tick = () => {
        const activeVideo = videos[activeIndexRef.current];

        if (!activeVideo || !hasUsableDuration(activeVideo) || isCrossfadingRef.current) {
          animationFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        const crossfadeStartTime =
          activeVideo.duration - DIRECT_LOOP_END_BUFFER_SECONDS - DIRECT_LOOP_CROSSFADE_MS / 1000;

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
            }, DIRECT_LOOP_CROSSFADE_MS);
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
  }, [src]);

  return (
    <div className={cn("relative", className)}>
      {[primaryVideoRef, secondaryVideoRef].map((videoRef, index) => (
        <video
          key={`${src}-${index}`}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain mix-blend-screen transition-opacity duration-200 will-change-[opacity,transform] [filter:brightness(1.16)_contrast(1.22)_saturate(0.96)_drop-shadow(0_0_20px_rgba(255,255,255,0.14))]"
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden={visibleIndex !== index}
          style={{ opacity: visibleIndex === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
