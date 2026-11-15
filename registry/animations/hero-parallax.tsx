"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ParallaxLayer = {
  node: React.ReactNode;
  /** How far the layer travels: 0 is pinned, 1 is a lot. Negative moves toward the pointer. */
  depth: number;
  /** Position classes, e.g. "top-6 start-8". */
  className?: string;
  /** Resting tilt in degrees. */
  tilt?: number;
};

/**
 * هیروی عمق‌دار. Floating cards and photos around the hero copy shift with
 * the pointer by different amounts, so the scene reads as layers at
 * different depths. Each layer also grows in out of a blur on load. On
 * touch devices the layers simply bob in place. Needs the `hero-fly` and
 * `float` keyframes.
 */
export function HeroParallax({
  layers,
  children,
  strength = 28,
  className,
}: {
  layers: ParallaxLayer[];
  /** Pixels a depth-1 layer moves at the edge of the section. */
  strength?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [p, setP] = React.useState({ x: 0, y: 0 });

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        setP({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      onPointerLeave={() => setP({ x: 0, y: 0 })}
      className={cn("relative isolate flex items-center justify-center overflow-hidden", className)}
    >
      {layers.map((l, i) => (
        <div
          key={i}
          aria-hidden
          className={cn("pointer-events-none absolute", l.className)}
          style={{
            // Each layer grows out of a blur in place, one after another.
            animation: `hero-fly 900ms cubic-bezier(0.16,1,0.3,1) ${200 + i * 90}ms both`,
          }}
        >
          <div
            className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translate3d(${-p.x * strength * l.depth}px, ${-p.y * strength * l.depth}px, 0)` }}
          >
            <div style={{ rotate: `${l.tilt ?? 0}deg`, animation: `float ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}>
              {l.node}
            </div>
          </div>
        </div>
      ))}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
