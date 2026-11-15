"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, [role=button], input, textarea, select, label, [data-cursor]";

/**
 * نشانگر حلقه‌ای. Inside the zone a small dot sits on the pointer and a ring
 * trails it with a soft lag. Over links and buttons the ring swells and
 * tints; over an element with `data-cursor="متن"` it grows into a label
 * bubble; pressing squeezes it. Only on fine pointers; touch keeps the
 * normal behaviour.
 */
export function CursorRing({
  children,
  className,
  lag = 0.18,
  size = 34,
  hideCursor = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** 0–1, how quickly the ring catches up per frame. */
  lag?: number;
  /** Ring diameter at rest, px. */
  size?: number;
  /** Hide the system cursor inside the zone. */
  hideCursor?: boolean;
}) {
  const zone = React.useRef<HTMLDivElement>(null);
  const dot = React.useRef<HTMLDivElement>(null);
  const ring = React.useRef<HTMLDivElement>(null);
  const [fine, setFine] = React.useState(false);
  const [state, setState] = React.useState<{ on: boolean; hot: boolean; down: boolean; label: string | null }>({ on: false, hot: false, down: false, label: null });

  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    const el = zone.current;
    if (!fine || !el) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let first = true;

    const frame = () => {
      pos.x += (target.x - pos.x) * lag;
      pos.y += (target.y - pos.y) * lag;
      if (ring.current) ring.current.style.translate = `${pos.x}px ${pos.y}px`;
      raf = Math.hypot(target.x - pos.x, target.y - pos.y) > 0.1 ? requestAnimationFrame(frame) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (first) {
        pos.x = target.x;
        pos.y = target.y;
        first = false;
      }
      if (dot.current) dot.current.style.translate = `${target.x}px ${target.y}px`;
      if (!raf) raf = requestAnimationFrame(frame);
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      const label = hit?.getAttribute("data-cursor") || null;
      setState((s) => (s.on && s.hot === !!hit && s.label === label ? s : { ...s, on: true, hot: !!hit, label }));
    };
    const leave = () => {
      first = true;
      setState((s) => ({ ...s, on: false, down: false }));
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      cancelAnimationFrame(raf);
    };
  }, [fine, lag]);

  const grow = state.label ? 2.4 : state.hot ? 1.7 : 1;
  const d = Math.round(size * grow * (state.down ? 0.8 : 1));
  return (
    <div
      ref={zone}
      className={cn("relative", fine && hideCursor && "cursor-none [&_*]:cursor-none", className)}
    >
      {children}
      {fine && (
        <>
          <div
            ref={ring}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-50"
            style={{ opacity: state.on ? 1 : 0, transition: "opacity 200ms" }}
          >
            {/* Size, not scale, changes so the label text stays crisp. */}
            <div
              className={cn(
                "flex items-center justify-center overflow-hidden rounded-full border transition-[width,height,margin,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                state.label ? "border-transparent bg-foreground" : state.hot ? "border-foreground/30 bg-foreground/10" : "border-foreground/60 bg-transparent",
              )}
              style={{ width: d, height: d, margin: -d / 2 }}
            >
              {state.label && (
                <span className="whitespace-nowrap text-xs font-semibold text-background" style={{ animation: "fade-in 200ms 120ms both" }}>
                  {state.label}
                </span>
              )}
            </div>
          </div>
          <div
            ref={dot}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-50"
            style={{ opacity: state.on && !state.label ? 1 : 0, transition: "opacity 150ms" }}
          >
            <div className="-m-[3px] size-1.5 rounded-full bg-foreground" />
          </div>
        </>
      )}
    </div>
  );
}
