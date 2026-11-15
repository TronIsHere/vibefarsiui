"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Heights as a share of the viewport, smallest first. Default [0.5, 0.92]. */
  snapPoints?: number[];
  /** Index into snapPoints to open at. Default 0. */
  defaultSnap?: number;
  /** Sticky area under the content, e.g. a submit button. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const noop = () => () => {};
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * کشوی پایین. A mobile bottom sheet you drag by its handle: it snaps between heights,
 * closes when flung down, keeps focus inside while open and returns it on close.
 * The handle is a button too, so the keyboard can switch heights.
 */
export function Drawer({ open, onOpenChange, title, description, snapPoints = [0.5, 0.92], defaultSnap = 0, footer, children, className }: DrawerProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const panel = React.useRef<HTMLDivElement>(null);
  const restore = React.useRef<HTMLElement | null>(null);
  const drag = React.useRef<{ y0: number; t0: number; h0: number } | null>(null);
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);
  const [present, setPresent] = React.useState(open);
  const [snap, setSnap] = React.useState(defaultSnap);
  const [offset, setOffset] = React.useState<number | null>(null);
  const [shown, setShown] = React.useState(false);
  const [vh, setVh] = React.useState(800);
  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) { setPresent(true); setSnap(defaultSnap); }
    else setShown(false);
  }

  React.useEffect(() => {
    if (open) {
      restore.current = document.activeElement as HTMLElement | null;
      let inner = 0;
      const id = requestAnimationFrame(() => {
        setVh(window.innerHeight);
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => { cancelAnimationFrame(id); cancelAnimationFrame(inner); };
    }
    const t = window.setTimeout(() => {
      setPresent(false);
      restore.current?.focus?.();
    }, 280);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!present) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel.current)?.focus();
    return () => { document.body.style.overflow = prev; };
  }, [present]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.stopPropagation(); onOpenChange(false); return; }
    if (e.key !== "Tab" || !panel.current) return;
    const f = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }

  const height = snapPoints[snap] * vh;

  function down(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { y0: e.clientY, t0: performance.now(), h0: height };
    setOffset(0);
  }
  function move(e: React.PointerEvent) {
    if (!drag.current) return;
    setOffset(e.clientY - drag.current.y0);
  }
  function up(e: React.PointerEvent) {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dy = e.clientY - d.y0;
    const speed = dy / Math.max(1, performance.now() - d.t0);
    setOffset(null);
    const h = d.h0 - dy;
    // A quick fling or dragging below the smallest snap closes it.
    if (speed > 0.6 || h < snapPoints[0] * vh * 0.6) { onOpenChange(false); return; }
    if (speed < -0.6) { setSnap(snapPoints.length - 1); return; }
    let best = 0;
    snapPoints.forEach((p, i) => { if (Math.abs(p * vh - h) < Math.abs(snapPoints[best] * vh - h)) best = i; });
    setSnap(best);
  }

  if (!mounted || !present) return null;
  const dragging = offset !== null;
  const translate = shown ? Math.max(0, offset ?? 0) : height;
  const extra = shown && offset !== null && offset < 0 ? -offset : 0;

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      <div aria-hidden onClick={() => onOpenChange(false)} className={cn("absolute inset-0 bg-black/50 transition-opacity duration-300", shown ? "opacity-100" : "opacity-0")} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn("absolute inset-x-0 bottom-0 mx-auto flex max-w-xl flex-col rounded-t-overlay border-t border-border bg-popover text-popover-foreground shadow-overlay outline-none", className)}
        style={{
          height: Math.min(vh - 8, height + extra),
          transform: `translateY(${translate}px)`,
          transition: dragging ? "none" : "transform 280ms cubic-bezier(0.32,0.72,0,1), height 280ms cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <button
          type="button"
          aria-label={snap < snapPoints.length - 1 ? "باز کردن کامل" : "کوچک کردن"}
          onClick={() => setSnap((s) => (s < snapPoints.length - 1 ? s + 1 : 0))}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className="flex w-full shrink-0 cursor-grab touch-none justify-center pb-2 pt-3 outline-none active:cursor-grabbing focus-visible:[&>span]:bg-ring"
        >
          <span className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        </button>
        {(title || description) && (
          <div className="shrink-0 px-5 pb-3">
            {title && <h2 id={titleId} className="font-display text-base font-bold">{title}</h2>}
            {description && <p id={descId} className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
        {footer && <div className="shrink-0 border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
