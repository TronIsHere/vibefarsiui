"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * بالا آمدن خطوط. Each line sits in its own overflow-hidden row and rises
 * from below its baseline, one after another, when the block enters view.
 * Works per line, never per letter, so Persian joining stays intact.
 * Needs the `line-rise` keyframes.
 */
export function LineRise({
  lines,
  stagger = 110,
  duration = 900,
  as: Tag = "span",
  className,
  lineClassName,
}: {
  /** One string or node per visual line. */
  lines: React.ReactNode[];
  /** ms between lines. */
  stagger?: number;
  /** ms per line. */
  duration?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setShown(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("block", className)}>
      {lines.map((line, i) => (
        // Padding + negative margin give descenders and dots room inside the clip.
        <span key={i} className="-my-[0.12em] block overflow-hidden py-[0.12em]">
          <span
            className={cn("block will-change-transform", lineClassName)}
            style={
              shown
                ? { animation: `line-rise ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms both` }
                : { transform: "translateY(110%)" }
            }
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
