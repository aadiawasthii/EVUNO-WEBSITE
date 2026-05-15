"use client";

import Image from "next/image";

import { motion, type MotionValue, useSpring, useTransform } from "framer-motion";

const wordmarkSlices = [
  { id: "s1", clipPath: "inset(0 92% 0 0)", x: -300, y: -120, rotate: -12, origin: "8% 50%", introX: -560, introY: -220, introRotate: -28 },
  { id: "s2", clipPath: "inset(0 84% 0 6%)", x: -250, y: 140, rotate: -11, origin: "12% 55%", introX: -470, introY: 340, introRotate: -24 },
  { id: "s3", clipPath: "inset(0 76% 0 14%)", x: -210, y: -180, rotate: -9, origin: "18% 48%", introX: -120, introY: -520, introRotate: 16 },
  { id: "s4", clipPath: "inset(0 68% 0 22%)", x: -165, y: 210, rotate: -7, origin: "24% 58%", introX: -380, introY: 480, introRotate: -15 },
  { id: "s5", clipPath: "inset(0 60% 0 30%)", x: -110, y: -235, rotate: -5, origin: "32% 42%", introX: 70, introY: -560, introRotate: 13 },
  { id: "s6", clipPath: "inset(0 51% 0 39%)", x: -45, y: 175, rotate: -2, origin: "42% 56%", introX: -160, introY: 500, introRotate: -8 },
  { id: "s7", clipPath: "inset(0 42% 0 48%)", x: 30, y: -260, rotate: 2, origin: "52% 40%", introX: 180, introY: -590, introRotate: -10 },
  { id: "s8", clipPath: "inset(0 33% 0 57%)", x: 95, y: 190, rotate: 5, origin: "60% 60%", introX: 210, introY: 500, introRotate: 10 },
  { id: "s9", clipPath: "inset(0 24% 0 66%)", x: 150, y: -210, rotate: 7, origin: "68% 42%", introX: 420, introY: -460, introRotate: 18 },
  { id: "s10", clipPath: "inset(0 16% 0 74%)", x: 205, y: 165, rotate: 9, origin: "78% 58%", introX: 520, introY: 260, introRotate: 22 },
  { id: "s11", clipPath: "inset(0 8% 0 82%)", x: 255, y: -150, rotate: 11, origin: "88% 46%", introX: 600, introY: -180, introRotate: 26 },
  { id: "s12", clipPath: "inset(0 0 0 90%)", x: 310, y: 120, rotate: 13, origin: "94% 52%", introX: 660, introY: 120, introRotate: 30 }
] as const;

type MetallicWordmarkProps = {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  className?: string;
};

export function MetallicWordmark({ progress, reduceMotion, className }: MetallicWordmarkProps) {
  const smoothedProgress = useSpring(progress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4
  });

  return (
    <div className={className}>
      <span className="sr-only">EVUNO metallic wordmark</span>
      <motion.div
        className="absolute inset-0 scale-[0.96] bg-[radial-gradient(circle,rgba(255,255,255,0.24),transparent_68%)] blur-3xl"
        initial={reduceMotion ? false : { opacity: 0.22, scale: 0.86 }}
        animate={reduceMotion ? undefined : { opacity: [0.22, 0.88, 0.72], scale: [0.86, 1.03, 0.96] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 1.05,
                times: [0, 0.58, 1],
                ease: [0.22, 1, 0.36, 1]
              }
        }
      />
      <div className="relative aspect-[1152/768] w-full" aria-hidden="true">
        {wordmarkSlices.map((slice, index) => (
          <MetallicWordmarkSlice
            key={slice.id}
            clipPath={slice.clipPath}
            index={index}
            progress={smoothedProgress}
            reduceMotion={reduceMotion}
            origin={slice.origin}
            rotate={slice.rotate}
            x={slice.x}
            y={slice.y}
            introX={slice.introX}
            introY={slice.introY}
            introRotate={slice.introRotate}
          />
        ))}
      </div>
    </div>
  );
}

type MetallicWordmarkSliceProps = {
  clipPath: string;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
  origin: string;
  rotate: number;
  x: number;
  y: number;
  introX: number;
  introY: number;
  introRotate: number;
};

function MetallicWordmarkSlice({
  clipPath,
  index,
  progress,
  reduceMotion,
  origin,
  rotate,
  x,
  y,
  introX,
  introY,
  introRotate
}: MetallicWordmarkSliceProps) {
  const exitX = useTransform(progress, [0, 0.46], [0, x]);
  const exitY = useTransform(progress, [0, 0.46], [0, y]);
  const exitRotate = useTransform(progress, [0, 0.46], [0, rotate]);
  const exitOpacity = useTransform(progress, [0, 0.24, 0.58], [1, 1, 0]);
  const exitScale = useTransform(progress, [0, 0.46], [1, 0.95 + index * 0.008]);
  const introDuration = 1.08;
  const introDelay = index * 0.038;

  return (
    <motion.div
      className="absolute inset-0"
      initial={
        reduceMotion
          ? false
          : {
              x: introX,
              y: introY,
              rotate: introRotate,
              opacity: 0,
              scale: 0.82,
              filter: "blur(12px) brightness(1.45) saturate(1.16)"
            }
      }
      animate={
        reduceMotion
          ? undefined
          : {
              x: [0, x * -0.022, 0],
              y: [0, y * -0.022, 0],
              rotate: [0, rotate * -0.09, 0],
              opacity: [0, 1, 1],
              scale: [0.9, 1.028, 1],
              filter: [
                "blur(12px) brightness(1.45) saturate(1.16)",
                "blur(1.8px) brightness(1.16) saturate(1.04)",
                "blur(0px) brightness(1) saturate(1)"
              ]
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: introDuration,
              delay: introDelay,
              times: [0, 0.76, 1],
              ease: [0.22, 1, 0.36, 1]
            }
      }
      style={{ transformOrigin: origin }}
    >
      <motion.div
        className="absolute inset-0"
        style={
          reduceMotion
            ? undefined
            : {
                x: exitX,
                y: exitY,
                rotate: exitRotate,
                opacity: exitOpacity,
                scale: exitScale,
                transformOrigin: origin
              }
        }
      >
        <div className="absolute inset-0" style={{ clipPath }}>
          <Image
            src="/assets/logos/evuno-wordmark-metallic.png"
            alt=""
            fill
            className="object-contain"
            sizes="82vw"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
