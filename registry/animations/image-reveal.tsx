"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ظهور تصویر. When the image scrolls into view a curtain wipes it open from
 * the reading start (right in Persian) or from below, while the photo itself
 * settles from a slight zoom. Needs the `image-wipe` and `image-settle`
 * keyframes.
 */
export function ImageReveal({
  src,
  alt,
  from = "start",
  delay = 0,
  duration = 1100,
  className,
  imgClassName,
  children,
}: {
  src: string;
  alt: string;
  /** "start" wipes along the reading direction; "bottom" wipes upward. */
  from?: "start" | "bottom";
  delay?: number;
  duration?: number;
  className?: string;
  imgClassName?: string;
  /** Optional overlay (caption, badge) that fades in after the wipe. */
  children?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setShown(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ease = "cubic-bezier(0.77,0,0.18,1)";
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        // The hidden pose per direction; the keyframe animates from it to inset(0).
        from === "bottom" ? "[--wipe:inset(100%_0_0_0)]" : "ltr:[--wipe:inset(0_100%_0_0)] rtl:[--wipe:inset(0_0_0_100%)]",
        className,
      )}
      style={shown ? { animation: `image-wipe ${duration}ms ${ease} ${delay}ms both` } : { clipPath: "var(--wipe)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- registry items stay framework-agnostic */}
      <img
        src={src}
        alt={alt}
        className={cn("size-full object-cover", imgClassName)}
        style={shown ? { animation: `image-settle ${duration * 1.4}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both` } : { transform: "scale(1.25)" }}
      />
      {children != null && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: shown ? 1 : 0, transitionDelay: `${delay + duration * 0.7}ms` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
