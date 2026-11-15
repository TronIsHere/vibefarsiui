"use client";

import * as React from "react";
import { Eraser, Undo2 } from "lucide-react";
import { cn, fa } from "@/lib/utils";

type Point = { x: number; y: number; p: number };
type Stroke = Point[];

export interface SignaturePadHandle {
  clear: () => void;
  undo: () => void;
  isEmpty: () => boolean;
  /** PNG with a transparent background, trimmed to the ink. */
  toDataURL: (type?: string) => string;
  /** The strokes as an SVG string, which stays sharp when printed. */
  toSVG: () => string;
}

export interface SignaturePadProps {
  /** Height in px; the width fills the container. Default 180. */
  height?: number;
  /** Ink color. Defaults to the text color so it works in dark mode. */
  color?: string;
  /** Pen width in px. Pressure varies it up to ±40%. Default 2.5. */
  penWidth?: number;
  /** Called after each stroke with whether the pad has ink. */
  onChange?: (empty: boolean) => void;
  /** Placeholder on the baseline. Default «این‌جا امضا کنید». */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function path(stroke: Stroke) {
  if (stroke.length < 2) return "";
  let d = `M${stroke[0].x.toFixed(1)},${stroke[0].y.toFixed(1)}`;
  for (let i = 1; i < stroke.length - 1; i++) {
    const a = stroke[i], b = stroke[i + 1];
    d += ` Q${a.x.toFixed(1)},${a.y.toFixed(1)} ${((a.x + b.x) / 2).toFixed(1)},${((a.y + b.y) / 2).toFixed(1)}`;
  }
  const l = stroke[stroke.length - 1];
  return `${d} L${l.x.toFixed(1)},${l.y.toFixed(1)}`;
}

/**
 * امضا. A pad for signing with finger, pen or mouse: smooth curves, pressure from
 * styluses, undo and clear, and export to a trimmed PNG or SVG. The strokes are kept
 * as data, so resizing the page redraws them instead of losing them.
 */
export const SignaturePad = React.forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad(
  { height = 180, color, penWidth = 2.5, onChange, placeholder = "این‌جا امضا کنید", disabled, className },
  ref,
) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = React.useState<Stroke[]>([]);
  const live = React.useRef<Stroke | null>(null);
  const [width, setWidth] = React.useState(0);
  const ink = React.useRef("#000");

  const draw = React.useCallback((list: Stroke[]) => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = ink.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of list) {
      const avg = s.reduce((n, p) => n + p.p, 0) / s.length;
      ctx.lineWidth = penWidth * (0.6 + avg * 0.8);
      if (s.length === 1) { ctx.beginPath(); ctx.arc(s[0].x, s[0].y, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fillStyle = ink.current; ctx.fill(); continue; }
      ctx.stroke(new Path2D(path(s)));
    }
  }, [penWidth]);

  React.useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const c = canvas.current;
    if (!c || !width) return;
    ink.current = color ?? getComputedStyle(c).color;
    const dpr = window.devicePixelRatio || 1;
    c.width = width * dpr;
    c.height = height * dpr;
    draw(strokes);
  }, [width, height, color, strokes, draw]);

  const point = (e: React.PointerEvent): Point => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, p: e.pointerType === "pen" && e.pressure ? e.pressure : 0.5 };
  };

  function down(e: React.PointerEvent) {
    if (disabled || e.button > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    live.current = [point(e)];
  }
  function move(e: React.PointerEvent) {
    if (!live.current) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events) live.current.push(point(ev as unknown as React.PointerEvent));
    draw([...strokes, live.current]);
  }
  function up() {
    if (!live.current) return;
    const next = [...strokes, live.current];
    live.current = null;
    setStrokes(next);
    onChange?.(false);
  }

  const bounds = (list: Stroke[]) => {
    const pts = list.flat();
    const pad = penWidth * 2;
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { x: Math.max(0, Math.min(...xs) - pad), y: Math.max(0, Math.min(...ys) - pad), x2: Math.max(...xs) + pad, y2: Math.max(...ys) + pad };
  };

  React.useImperativeHandle(ref, () => ({
    clear: () => { setStrokes([]); onChange?.(true); },
    undo: () => setStrokes((s) => { const n = s.slice(0, -1); onChange?.(n.length === 0); return n; }),
    isEmpty: () => strokes.length === 0,
    toDataURL: (type = "image/png") => {
      const c = canvas.current;
      if (!c || !strokes.length) return "";
      const b = bounds(strokes);
      const dpr = window.devicePixelRatio || 1;
      const out = document.createElement("canvas");
      out.width = (b.x2 - b.x) * dpr;
      out.height = (b.y2 - b.y) * dpr;
      out.getContext("2d")!.drawImage(c, b.x * dpr, b.y * dpr, out.width, out.height, 0, 0, out.width, out.height);
      return out.toDataURL(type);
    },
    toSVG: () => {
      if (!strokes.length) return "";
      const b = bounds(strokes);
      const paths = strokes.map((s) => `<path d="${path(s.length === 1 ? [s[0], { ...s[0], x: s[0].x + 0.1 }] : s)}"/>`).join("");
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.x.toFixed(1)} ${b.y.toFixed(1)} ${(b.x2 - b.x).toFixed(1)} ${(b.y2 - b.y).toFixed(1)}" fill="none" stroke="${ink.current}" stroke-width="${penWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    },
  }));

  const empty = strokes.length === 0;
  return (
    <div className={cn("space-y-2", className)}>
      <div ref={wrap} className={cn("relative overflow-hidden rounded-surface border-line border-dashed border-border bg-card", disabled && "opacity-60")} style={{ height }}>
        <canvas
          ref={canvas}
          role="img"
          aria-label={empty ? "کادر امضا، خالی" : `کادر امضا، ${fa(strokes.length)} خط کشیده شده`}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className={cn("absolute inset-0 touch-none text-foreground", disabled ? "cursor-not-allowed" : "cursor-crosshair")}
          style={{ width: "100%", height }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-10 flex items-end gap-2 border-b border-border">
          <span className="pb-1 text-lg text-muted-foreground/60">×</span>
          {empty && <span className="pb-1.5 text-xs text-muted-foreground">{placeholder}</span>}
        </div>
      </div>
      <div className="flex justify-end gap-1">
        <button type="button" disabled={empty || disabled} onClick={() => { const n = strokes.slice(0, -1); setStrokes(n); onChange?.(n.length === 0); }} className="inline-flex h-8 items-center gap-1.5 rounded-control px-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"><Undo2 className="size-3.5" />برگشت</button>
        <button type="button" disabled={empty || disabled} onClick={() => { setStrokes([]); onChange?.(true); }} className="inline-flex h-8 items-center gap-1.5 rounded-control px-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"><Eraser className="size-3.5" />پاک کردن</button>
      </div>
    </div>
  );
});
