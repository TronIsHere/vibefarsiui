"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * پر شدن متن با اسکرول. A paragraph that starts faint and lights up word by
 * word, right to left, as it scrolls through the viewport (or through a
 * scroll container you pass). Progress is tied to scroll position, so
 * scrolling back dims it again.
 */
export function ScrollFillText({
  text,
  scrollRef,
  dim = 0.18,
  className,
}: {
  text: string;
  /** Scrollable ancestor; defaults to the window. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** Opacity of words that are not lit yet. */
  dim?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = React.useState(0);
  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = scrollRef?.current ?? null;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const view = root ? root.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      // 0 when the top of the text reaches 85% of the view, 1 when its bottom passes 40%.
      const start = view.top + view.height * 0.85;
      const end = view.top + view.height * 0.4;
      const p = (start - r.top) / (start - end + r.height);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    const target: HTMLElement | Window = root ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollRef]);

  const lit = progress * words.length;
  return (
    <p ref={ref} aria-label={text} className={cn("leading-relaxed", className)}>
      {words.map((w, i) => {
        const v = Math.min(1, Math.max(0, lit - i));
        return (
          <React.Fragment key={i}>
            <span aria-hidden className="transition-opacity duration-150" style={{ opacity: dim + (1 - dim) * v }}>
              {w}
            </span>
            {i < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </p>
  );
}
