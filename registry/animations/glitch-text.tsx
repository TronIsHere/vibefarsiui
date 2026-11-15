"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * متن گلیچ. Two tinted copies of the text sit on top of it and flicker in
 * horizontal slices, like a broken signal. The whole string is copied, never
 * split, so Persian letters stay joined. Needs the `glitch-a` and `glitch-b`
 * keyframes.
 */
export function GlitchText({
  children,
  trigger = "always",
  duration = 2.4,
  colors = ["#ff2d55", "#00b8e6"],
  className,
}: {
  children: string;
  /** "hover" only glitches while the pointer is over it (or it has focus). */
  trigger?: "always" | "hover";
  /** Seconds per glitch cycle. */
  duration?: number;
  colors?: [string, string];
  className?: string;
}) {
  const [hot, setHot] = React.useState(false);
  const on = trigger === "always" || hot;
  const layer = "pointer-events-none absolute inset-0 select-none whitespace-nowrap";
  const hover = trigger === "hover"
    ? { tabIndex: 0, onPointerEnter: () => setHot(true), onPointerLeave: () => setHot(false), onFocus: () => setHot(true), onBlur: () => setHot(false) }
    : {};
  return (
    <span className={cn("relative inline-block whitespace-nowrap outline-none", className)} {...hover}>
      {children}
      {on && (
        <>
          <span aria-hidden className={layer} style={{ color: colors[0], animation: `glitch-a ${duration}s steps(1, end) infinite` }}>
            {children}
          </span>
          <span aria-hidden className={layer} style={{ color: colors[1], animation: `glitch-b ${duration * 0.85}s steps(1, end) infinite` }}>
            {children}
          </span>
        </>
      )}
    </span>
  );
}
