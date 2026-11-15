"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * هیروی ورودی. A hero section that assembles itself in sequence: the eyebrow
 * pops, the headline rises line by line out of masks, the description
 * clears from blur and the actions float up. Behind it a soft spotlight
 * tracks the pointer over a faint grid. Needs the `pop`, `line-rise`,
 * `blur-in` and `fade-up` keyframes.
 */
export function HeroIntro({
  eyebrow,
  title,
  description,
  actions,
  spotlight = true,
  className,
}: {
  eyebrow?: React.ReactNode;
  /** One entry per headline line. */
  title: React.ReactNode[];
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Pointer-following glow behind the content. */
  spotlight?: boolean;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [glow, setGlow] = React.useState<{ x: number; y: number } | null>(null);
  const ease = "cubic-bezier(0.16,1,0.3,1)";
  const t = (step: number) => 150 + step * 120;
  const titleEnd = t(1) + (title.length - 1) * 110;

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (!spotlight || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        setGlow({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setGlow(null)}
      className={cn("relative isolate flex flex-col items-center overflow-hidden px-6 py-16 text-center", className)}
    >
      {/* Faint grid that fades out toward the edges. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          animation: "fade-in 1.2s ease both",
        }}
      />
      {spotlight && (
        <div
          aria-hidden
          className="absolute -z-10 size-[420px] rounded-full transition-opacity duration-500"
          style={{
            left: (glow?.x ?? 0) - 210,
            top: (glow?.y ?? 0) - 210,
            opacity: glow ? 1 : 0,
            background: "radial-gradient(circle, color-mix(in oklab, var(--foreground) 12%, transparent), transparent 65%)",
          }}
        />
      )}

      {eyebrow != null && (
        <div className="mb-5" style={{ animation: `pop 500ms ${ease} ${t(0)}ms both` }}>
          {eyebrow}
        </div>
      )}

      <h1 className="max-w-3xl text-balance font-display text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl">
        {title.map((line, i) => (
          <span key={i} className="-my-[0.12em] block overflow-hidden py-[0.12em]">
            <span className="block" style={{ animation: `line-rise 900ms ${ease} ${t(1) + i * 110}ms both` }}>
              {line}
            </span>
          </span>
        ))}
      </h1>

      {description != null && (
        <p
          className="mt-5 max-w-xl text-pretty text-base leading-8 text-muted-foreground"
          style={{ animation: `blur-in 800ms ${ease} ${titleEnd + 250}ms both` }}
        >
          {description}
        </p>
      )}

      {actions != null && (
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animation: `fade-up 700ms ${ease} ${titleEnd + 450}ms both` }}
        >
          {actions}
        </div>
      )}
    </section>
  );
}
