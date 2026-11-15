"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ذره‌بین تصویر. A round lens follows the pointer and shows the photo
 * magnified underneath it, for product shots and detailed images. The lens
 * grows in on enter and shrinks away on leave; it is decorative, so the
 * image's alt text carries the meaning.
 */
export function ImageLens({
  src,
  alt,
  zoom = 2.2,
  lens = 128,
  className,
}: {
  src: string;
  alt: string;
  /** Magnification inside the lens. */
  zoom?: number;
  /** Lens diameter in px. */
  lens?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [p, setP] = React.useState({ x: 0, y: 0, w: 1, h: 1, on: false });

  const track = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setP({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height, on: true });
  };

  return (
    <div
      ref={ref}
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={() => setP((s) => ({ ...s, on: false }))}
      className={cn("relative cursor-crosshair touch-none overflow-hidden", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- registry items stay framework-agnostic */}
      <img src={src} alt={alt} draggable={false} className="size-full select-none object-cover" />
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full border-2 border-white/90 shadow-[0_8px_30px_rgb(0_0_0/0.35)] transition-[opacity,scale] duration-200 ease-out"
        style={{
          width: lens,
          height: lens,
          left: p.x - lens / 2,
          top: p.y - lens / 2,
          opacity: p.on ? 1 : 0,
          scale: p.on ? "1" : "0.4",
          backgroundImage: `url("${src}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${p.w * zoom}px ${p.h * zoom}px`,
          backgroundPosition: `${lens / 2 - p.x * zoom}px ${lens / 2 - p.y * zoom}px`,
        }}
      />
    </div>
  );
}
