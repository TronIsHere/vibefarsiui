"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Drop = { id: number; x: number; y: number; src: string; tilt: number };

/**
 * ردِ تصویر. Moving the pointer across the zone drops photos behind it, one
 * every `spacing` pixels; each pops in, then sinks and fades. Works with mouse,
 * pen and touch drags. Needs the `trail-pop` keyframes.
 */
export function ImageTrail({
  images,
  spacing = 70,
  life = 900,
  size = 96,
  max = 12,
  className,
  children,
}: {
  images: string[];
  /** Pixels the pointer must travel before the next photo drops. */
  spacing?: number;
  /** ms each photo lives. */
  life?: number;
  /** Photo width in px (height is 4:5). */
  size?: number;
  /** Most photos on screen at once. */
  max?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const last = React.useRef<{ x: number; y: number } | null>(null);
  const seq = React.useRef(0);
  const [drops, setDrops] = React.useState<Drop[]>([]);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const onMove = (e: React.PointerEvent) => {
    if (!images.length) return;
    const r = ref.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const p = last.current;
    if (p && Math.hypot(x - p.x, y - p.y) < spacing) return;
    last.current = { x, y };
    const id = ++seq.current;
    const drop = { id, x, y, src: images[id % images.length], tilt: ((id * 37) % 17) - 8 };
    setDrops((d) => [...d.slice(-(max - 1)), drop]);
    timers.current.push(window.setTimeout(() => setDrops((d) => d.filter((v) => v.id !== id)), life));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => (last.current = null)}
      className={cn("relative isolate touch-pan-y overflow-hidden", className)}
    >
      {drops.map((d) => (
        // eslint-disable-next-line @next/next/no-img-element -- registry items stay framework-agnostic
        <img
          key={d.id}
          src={d.src}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute rounded-lg object-cover shadow-lg"
          style={{
            width: size,
            height: size * 1.25,
            left: d.x - size / 2,
            top: d.y - size * 0.625,
            ["--tilt" as string]: `${d.tilt}deg`,
            animation: `trail-pop ${life}ms cubic-bezier(0.22,1,0.36,1) both`,
          }}
        />
      ))}
      <div className="pointer-events-none relative z-10 size-full">{children}</div>
    </div>
  );
}
