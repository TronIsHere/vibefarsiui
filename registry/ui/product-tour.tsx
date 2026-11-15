"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type TourStep = {
  /** CSS selector of the element to highlight. Without one the step is a centered card. */
  target?: string;
  title: string;
  body: React.ReactNode;
  /** Card side relative to the target. Default "bottom". */
  side?: "top" | "bottom";
};

export interface ProductTourProps {
  steps: TourStep[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after the last step's «تموم». Skipping only calls onOpenChange(false). */
  onFinish?: () => void;
  /** Space around the highlighted element in px. Default 8. */
  padding?: number;
}

const noop = () => () => {};

type Box = { top: number; left: number; width: number; height: number };

/**
 * تور معرفی. Walks a new user through the page: dims everything except one element,
 * places a card next to it with «بعدی» and «قبلی», and scrolls each target into view.
 * The card is a dialog that takes focus; Escape skips, and arrows move in RTL order.
 */
export function ProductTour({ steps, open, onOpenChange, onFinish, padding = 8 }: ProductTourProps) {
  const [i, setI] = React.useState(0);
  const [box, setBox] = React.useState<Box | null>(null);
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);
  const card = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const step = steps[i];
  const last = i === steps.length - 1;

  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) { setWasOpen(open); if (open) setI(0); }

  const measure = React.useCallback(() => {
    const el = step?.target ? document.querySelector<HTMLElement>(step.target) : null;
    if (!el) return setBox(null);
    const r = el.getBoundingClientRect();
    setBox({ top: r.top - padding, left: r.left - padding, width: r.width + padding * 2, height: r.height + padding * 2 });
  }, [step, padding]);

  React.useLayoutEffect(() => {
    if (!open || !step) return;
    const el = step.target ? document.querySelector<HTMLElement>(step.target) : null;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    const raf = requestAnimationFrame(measure);
    const t = window.setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    card.current?.focus();
    return () => { cancelAnimationFrame(raf); window.clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [open, step, measure]);

  if (!mounted || !open || !step) return null;

  const close = () => onOpenChange(false);
  const next = () => { if (last) { onFinish?.(); close(); } else setI(i + 1); };
  const prev = () => i > 0 && setI(i - 1);

  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const cardW = Math.min(320, vw - 24);
  const side = step.side ?? (box && box.top + box.height + 220 > vh ? "top" : "bottom");
  const style: React.CSSProperties = box
    ? {
        width: cardW,
        left: Math.min(vw - cardW - 12, Math.max(12, box.left + box.width / 2 - cardW / 2)),
        ...(side === "bottom" ? { top: Math.min(vh - 12, box.top + box.height + 12) } : { bottom: Math.max(12, vh - box.top + 12) }),
      }
    : { width: cardW, left: "50%", top: "50%", transform: "translate(-50%, -50%)" };

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="presentation">
      {/* The spotlight: one transparent box whose huge shadow dims the page around it. */}
      <div
        aria-hidden
        onClick={close}
        className="fixed rounded-surface transition-all duration-300 ease-motion"
        style={box ? { ...box, boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.55)" } : { inset: 0, background: "rgb(0 0 0 / 0.55)" }}
      />
      {box && <div aria-hidden className="pointer-events-none fixed rounded-surface ring-2 ring-white/80 transition-all duration-300 ease-motion" style={box} />}
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
          else if (e.key === "ArrowLeft") next();
          else if (e.key === "ArrowRight") prev();
        }}
        className="fixed rounded-overlay border border-border bg-popover p-4 text-popover-foreground shadow-overlay outline-none"
        style={style}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="font-semibold">{step.title}</h2>
          <button type="button" aria-label="رد کردن تور" onClick={close} className="-me-1 -mt-1 rounded-control p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="mt-1.5 text-sm leading-7 text-muted-foreground">{step.body}</div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1" aria-label={`مرحله‌ی ${fa(i + 1)} از ${fa(steps.length)}`} role="img">
            {steps.map((_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-4 bg-primary" : "w-1.5 bg-border")} />)}
          </div>
          <div className="flex gap-2">
            {i > 0 && <button type="button" onClick={prev} className="h-8 rounded-control px-3 text-sm text-muted-foreground hover:bg-accent">قبلی</button>}
            <button type="button" onClick={next} className="h-8 rounded-control bg-primary px-3.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">{last ? "تموم" : "بعدی"}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
