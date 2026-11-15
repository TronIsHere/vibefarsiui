"use client";

import * as React from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

const noop = () => () => {};

/* ---------- color math ---------- */

export type Hsv = { h: number; s: number; v: number };

export function hexToHsv(hex: string): Hsv | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const full = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const n = parseInt(full, 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}

export function hsvToHex({ h, s, v }: Hsv) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255).toString(16).padStart(2, "0");
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

/** WCAG relative-luminance contrast between two hex colors. */
export function contrastRatio(a: string, b: string) {
  const lum = (hex: string) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map((x) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const DEFAULT_SWATCHES = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#71717a", "#18181b", "#ffffff"];

/* ---------- panel ---------- */

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  swatches?: string[];
  /** Show the contrast of the color against white and black text. Default true. */
  contrast?: boolean;
  className?: string;
}

/**
 * انتخاب رنگ. A saturation and brightness square, a hue strip, a hex field, swatches and
 * the screen eyedropper where the browser has one. Color spaces don't mirror: the square
 * and the strip stay left to right in RTL. Everything works with the arrow keys.
 */
export function ColorPicker({ value, defaultValue = "#6366f1", onChange, swatches = DEFAULT_SWATCHES, contrast = true, className }: ColorPickerProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const hex = (value ?? internal).toLowerCase();
  // Keep hue across gray and black, where the hex alone loses it.
  const [hsv, setHsv] = React.useState<Hsv>(() => hexToHsv(hex) ?? { h: 0, s: 0, v: 0 });
  const [seen, setSeen] = React.useState(hex);
  if (seen !== hex) {
    setSeen(hex);
    const next = hexToHsv(hex);
    if (next && hsvToHex(hsv) !== hex) setHsv(next.s === 0 || next.v === 0 ? { ...next, h: hsv.h } : next);
  }
  const [draft, setDraft] = React.useState<string | null>(null);

  const emit = (next: Hsv) => {
    setHsv(next);
    const h = hsvToHex(next);
    setSeen(h);
    if (value === undefined) setInternal(h);
    onChange?.(h);
  };
  const setHex = (h: string) => {
    const p = hexToHsv(h);
    if (!p) return;
    emit(p.s === 0 || p.v === 0 ? { ...p, h: hsv.h } : p);
  };

  const area = React.useRef<HTMLDivElement>(null);
  const strip = React.useRef<HTMLDivElement>(null);
  const drag = (el: HTMLElement | null, e: React.PointerEvent, fn: (x: number, y: number) => void) => {
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const at = (ev: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect();
      fn(Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height)));
    };
    at(e);
    const move = (ev: PointerEvent) => at(ev);
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  // Read after hydration so the server and first client render agree.
  const hasDropper = React.useSyncExternalStore(noop, () => "EyeDropper" in window, () => false);
  async function pick() {
    try {
      const ED = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const res = await new ED().open();
      setHex(res.sRGBHex);
    } catch {
      /* cancelled */
    }
  }

  const step = (e: React.KeyboardEvent) => (e.shiftKey ? 0.1 : 0.01);
  const white = contrastRatio(hex, "#ffffff");
  const black = contrastRatio(hex, "#000000");

  return (
    <div className={cn("w-64 space-y-3", className)}>
      <div
        ref={area}
        dir="ltr"
        role="slider"
        tabIndex={0}
        aria-label="اشباع و روشنایی"
        aria-valuetext={`اشباع ${Math.round(hsv.s * 100)}٪، روشنایی ${Math.round(hsv.v * 100)}٪`}
        aria-valuenow={Math.round(hsv.s * 100)}
        onPointerDown={(e) => drag(area.current, e, (x, y) => emit({ ...hsv, s: x, v: 1 - y }))}
        onKeyDown={(e) => {
          const d = step(e);
          const k = { ArrowRight: [d, 0], ArrowLeft: [-d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] }[e.key];
          if (!k) return;
          e.preventDefault();
          emit({ ...hsv, s: Math.min(1, Math.max(0, hsv.s + k[0])), v: Math.min(1, Math.max(0, hsv.v + k[1])) });
        }}
        className="relative h-40 cursor-crosshair touch-none rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))` }}
      >
        <span aria-hidden className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }} />
      </div>
      <div
        ref={strip}
        dir="ltr"
        role="slider"
        tabIndex={0}
        aria-label="رنگ‌مایه"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        aria-valuetext={`${Math.round(hsv.h)} درجه`}
        onPointerDown={(e) => drag(strip.current, e, (x) => emit({ ...hsv, h: x * 359.9 }))}
        onKeyDown={(e) => {
          const d = e.shiftKey ? 30 : 3;
          const k = e.key === "ArrowRight" || e.key === "ArrowUp" ? d : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -d : 0;
          if (!k) return;
          e.preventDefault();
          emit({ ...hsv, h: (hsv.h + k + 360) % 360 });
        }}
        className="relative h-3 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
      >
        <span aria-hidden className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]" style={{ left: `${(hsv.h / 360) * 100}%`, background: `hsl(${hsv.h} 100% 50%)` }} />
      </div>
      <div className="flex items-center gap-2">
        <span aria-hidden className="size-9 shrink-0 rounded-control border border-border" style={{ background: hex }} />
        <label className="relative flex-1">
          <span className="sr-only">کد رنگ</span>
          <input
            dir="ltr"
            value={draft ?? hex.toUpperCase()}
            onChange={(e) => { setDraft(e.target.value); if (/^#?[0-9a-f]{6}$/i.test(e.target.value.trim())) setHex(e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`); }}
            onBlur={() => setDraft(null)}
            spellCheck={false}
            className="h-9 w-full rounded-field border-line-field border-input bg-field px-2.5 font-mono text-sm uppercase shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          />
        </label>
        {hasDropper && (
          <button type="button" onClick={pick} aria-label="برداشتن رنگ از صفحه" className="flex size-9 shrink-0 items-center justify-center rounded-control border-line border-border hover:bg-accent"><Pipette className="size-4" /></button>
        )}
      </div>
      {swatches.length > 0 && (
        <div role="radiogroup" aria-label="رنگ‌های آماده" className="grid grid-cols-6 gap-1.5">
          {swatches.map((s) => {
            const on = s.toLowerCase() === hex;
            return (
              <button key={s} type="button" role="radio" aria-checked={on} aria-label={s} onClick={() => setHex(s)} className="relative aspect-square rounded-md border border-black/10 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1" style={{ background: s }}>
                {on && <Check className="absolute inset-0 m-auto size-3.5" style={{ color: contrastRatio(s, "#fff") > 3 ? "#fff" : "#000" }} />}
              </button>
            );
          })}
        </div>
      )}
      {contrast && (
        <dl className="grid grid-cols-2 gap-1.5 text-[11px]">
          {([["متن سفید", white, "#fff"], ["متن مشکی", black, "#000"]] as const).map(([k, r, fg]) => (
            <div key={k} className="flex items-center justify-between rounded-md px-2 py-1" style={{ background: hex, color: fg }}>
              <dt>{k}</dt>
              <dd dir="ltr" className="font-mono">{r.toFixed(1)} {r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA درشت" : "✕"}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ---------- trigger + popover ---------- */

export interface ColorInputProps extends Omit<ColorPickerProps, "className"> {
  label?: string;
  className?: string;
}

/** A swatch button with the hex that opens the picker in a popover. */
export function ColorInput({ label = "رنگ", className, value, defaultValue = "#6366f1", onChange, ...rest }: ColorInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const hex = value ?? internal;
  const [open, setOpen] = React.useState(false);
  const btn = React.useRef<HTMLButtonElement>(null);
  const f = useFloat(open, btn, { align: "start" });

  React.useEffect(() => {
    if (!open) return;
    const close = (e: Event) => { if (!eventInside(e, btn.current, f.panel.current)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", esc); };
  }, [open, f.panel]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}: ${hex}`}
        onClick={() => setOpen((o) => !o)}
        className={cn("inline-flex h-10 items-center gap-2 rounded-field border-line-field border-input bg-field ps-1.5 pe-3 shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60", className)}
      >
        <span aria-hidden className="size-7 rounded-md border border-black/10" style={{ background: hex }} />
        <bdi dir="ltr" className="font-mono text-sm uppercase">{hex}</bdi>
      </button>
      <FloatPortal open={open} mounted={f.mounted} style={{ ...f.style, position: "fixed" }} theme={f.theme} panelRef={f.panel} role="dialog" aria-label={label} className="z-50 rounded-overlay border border-border bg-popover p-3 text-popover-foreground shadow-overlay">
        <ColorPicker {...rest} value={hex} onChange={(h) => { if (value === undefined) setInternal(h); onChange?.(h); }} />
      </FloatPortal>
    </>
  );
}
