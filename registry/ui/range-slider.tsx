"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";

export type RangeValue = [number, number];

export interface RangeSliderProps {
  value?: RangeValue;
  defaultValue?: RangeValue;
  onChange?: (value: RangeValue) => void;
  /**
   * Fires once when an interaction ends (thumb or track released, or a key
   * press) and only if the value actually changed. Use it for fetches or
   * scroll-to-results; use onChange for the live preview.
   */
  onCommit?: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats each end label, e.g. formatToman. Defaults to Persian digits. */
  format?: (value: number) => string;
  label?: React.ReactNode;
  showValue?: boolean;
  /** Shown instead of the two values while the range covers [min, max], e.g. «همه قیمت‌ها». */
  fullRangeLabel?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  /** Accessible name for the lower (کف) thumb. */
  minThumbLabel?: string;
  /** Accessible name for the upper (سقف) thumb. */
  maxThumbLabel?: string;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function snap(n: number, min: number, step: number) {
  const snapped = min + Math.round((n - min) / step) * step;
  // Guard float drift on large toman steps.
  const decimals = String(step).includes(".") ? (String(step).split(".")[1]?.length ?? 0) : 0;
  return Number(snapped.toFixed(decimals));
}

function pctOf(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

type Thumb = "min" | "max";

/**
 * اسلایدر بازه. Two thumbs on one track; the active band fills from
 * inline-start (right in RTL) via logical inset, never left/right.
 */
export function RangeSlider({
  value,
  defaultValue = [0, 100],
  onChange,
  onCommit,
  min = 0,
  max = 100,
  step = 1,
  format = (v) => fa(v),
  label,
  showValue = true,
  fullRangeLabel,
  disabled,
  className,
  minThumbLabel = "کف",
  maxThumbLabel = "سقف",
}: RangeSliderProps) {
  const [internal, setInternal] = React.useState<RangeValue>(defaultValue);
  const controlled = value !== undefined;
  const [lo, hi] = controlled ? value : internal;
  const loRef = React.useRef(lo);
  const hiRef = React.useRef(hi);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const activeThumb = React.useRef<Thumb | null>(null);
  // Value when the current interaction began; null when none is in progress.
  const startValue = React.useRef<RangeValue | null>(null);
  const [dragging, setDragging] = React.useState<Thumb | null>(null);
  const labelId = React.useId();

  React.useLayoutEffect(() => {
    loRef.current = lo;
    hiRef.current = hi;
  }, [lo, hi]);

  const loPct = pctOf(lo, min, max);
  const hiPct = pctOf(hi, min, max);

  function commit(next: RangeValue) {
    const ordered: RangeValue = next[0] <= next[1] ? next : [next[1], next[0]];
    // Most pointer moves snap to the same step; don't re-render or notify.
    if (ordered[0] === loRef.current && ordered[1] === hiRef.current) return;
    loRef.current = ordered[0];
    hiRef.current = ordered[1];
    if (!controlled) setInternal(ordered);
    onChange?.(ordered);
  }

  function beginInteraction() {
    startValue.current = [loRef.current, hiRef.current];
  }

  // Thumb pointerup bubbles to the track too; the null guard makes the
  // second call a no-op so onCommit fires once per interaction.
  function endInteraction() {
    const start = startValue.current;
    if (!start) return;
    startValue.current = null;
    if (start[0] !== loRef.current || start[1] !== hiRef.current) {
      onCommit?.([loRef.current, hiRef.current]);
    }
  }

  function setThumb(thumb: Thumb, raw: number) {
    const curLo = loRef.current;
    const curHi = hiRef.current;
    const snapped = snap(raw, min, step);
    if (thumb === "min") {
      commit([clamp(snapped, min, curHi), curHi]);
    } else {
      commit([curLo, clamp(snapped, curLo, max)]);
    }
  }

  function clientXToValue(clientX: number) {
    const el = trackRef.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return min;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    // Value grows toward inline-end: left in RTL, right in LTR.
    const rtl = getComputedStyle(el).direction === "rtl";
    const t = rtl ? 1 - ratio : ratio;
    return snap(min + t * (max - min), min, step);
  }

  function nearestThumb(v: number): Thumb {
    const curLo = loRef.current;
    const curHi = hiRef.current;
    const dMin = Math.abs(v - curLo);
    const dMax = Math.abs(v - curHi);
    if (dMin !== dMax) return dMin < dMax ? "min" : "max";
    return v < (curLo + curHi) / 2 ? "min" : "max";
  }

  function onPointerDownTrack(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    const v = clientXToValue(e.clientX);
    const thumb = nearestThumb(v);
    activeThumb.current = thumb;
    setDragging(thumb);
    beginInteraction();
    setThumb(thumb, v);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMoveTrack(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled || activeThumb.current === null) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setThumb(activeThumb.current, clientXToValue(e.clientX));
  }

  function onPointerUpTrack(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activeThumb.current = null;
    setDragging(null);
    endInteraction();
  }

  function handleKey(thumb: Thumb, e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    const el = trackRef.current;
    const rtl = el ? getComputedStyle(el).direction === "rtl" : true;
    const current = thumb === "min" ? loRef.current : hiRef.current;
    let next: number | null = null;
    const big = step * 10;

    switch (e.key) {
      case "ArrowRight":
        next = current + (rtl ? -step : step);
        break;
      case "ArrowLeft":
        next = current + (rtl ? step : -step);
        break;
      case "ArrowUp":
        next = current + step;
        break;
      case "ArrowDown":
        next = current - step;
        break;
      case "PageUp":
        next = current + big;
        break;
      case "PageDown":
        next = current - big;
        break;
      case "Home":
        next = thumb === "min" ? min : loRef.current;
        break;
      case "End":
        next = thumb === "max" ? max : hiRef.current;
        break;
      default:
        return;
    }
    e.preventDefault();
    beginInteraction();
    setThumb(thumb, next);
    endInteraction();
  }

  function startThumbDrag(thumb: Thumb, e: React.PointerEvent<HTMLButtonElement>) {
    if (disabled) return;
    e.stopPropagation();
    activeThumb.current = thumb;
    setDragging(thumb);
    beginInteraction();
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function moveThumbDrag(thumb: Thumb, e: React.PointerEvent<HTMLButtonElement>) {
    if (activeThumb.current !== thumb) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setThumb(thumb, clientXToValue(e.clientX));
  }

  function endThumbDrag(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activeThumb.current = null;
    setDragging(null);
    endInteraction();
  }

  const thumbClass = cn(
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center",
    "cursor-grab touch-none outline-none active:cursor-grabbing",
    "disabled:cursor-not-allowed",
    "focus-visible:[&>span]:ring-2 focus-visible:[&>span]:ring-ring/60",
  );

  const knobClass = cn(
    "block size-4 rounded-full border-2 border-primary bg-background shadow",
    "transition-[box-shadow,transform] duration-150 motion-reduce:transition-none",
  );

  const fullRange = fullRangeLabel != null && lo <= min && hi >= max;

  return (
    // overflow-x-clip: the 44px hit areas reach past the track ends; clipping
    // them keeps a padded, scrollable parent (e.g. Sheet) from scrolling sideways.
    <div className={cn("space-y-2 overflow-x-clip", className)}>
      {(label || showValue) && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
          {label && (
            <span id={labelId} className="text-muted-foreground">
              {label}
            </span>
          )}
          {showValue && (
            <span
              className="ms-auto flex flex-wrap items-center gap-x-1.5 font-medium tabular-nums"
              aria-live="polite"
            >
              {fullRange ? (
                fullRangeLabel
              ) : (
                <>
                  <span className="whitespace-nowrap">{format(lo)}</span>
                  <span className="font-normal text-muted-foreground" aria-hidden>
                    تا
                  </span>
                  <span className="whitespace-nowrap">{format(hi)}</span>
                </>
              )}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : "محدوده"}
        onPointerDown={onPointerDownTrack}
        onPointerMove={onPointerMoveTrack}
        onPointerUp={onPointerUpTrack}
        onPointerCancel={onPointerUpTrack}
        className={cn(
          // mx-2 = half the visible knob, so the knob sits inside at min/max.
          "relative mx-2 flex h-11 items-center select-none",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div
          aria-hidden
          className="h-1.5 w-full rounded-full"
          style={{
            background: `linear-gradient(to left, var(--input) 0%, var(--input) ${loPct}%, var(--primary) ${loPct}%, var(--primary) ${hiPct}%, var(--input) ${hiPct}%, var(--input) 100%)`,
          }}
        />

        <button
          type="button"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={hi}
          aria-valuenow={lo}
          aria-valuetext={format(lo)}
          aria-label={minThumbLabel}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(thumbClass, dragging === "min" && "z-30")}
          style={{ insetInlineStart: `calc(${loPct}% - 1.375rem)` }}
          onKeyDown={(e) => handleKey("min", e)}
          onPointerDown={(e) => startThumbDrag("min", e)}
          onPointerMove={(e) => moveThumbDrag("min", e)}
          onPointerUp={endThumbDrag}
          onPointerCancel={endThumbDrag}
        >
          <span className={knobClass} />
        </button>

        <button
          type="button"
          role="slider"
          aria-valuemin={lo}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-valuetext={format(hi)}
          aria-label={maxThumbLabel}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(thumbClass, "z-20", dragging === "max" && "z-30")}
          style={{ insetInlineStart: `calc(${hiPct}% - 1.375rem)` }}
          onKeyDown={(e) => handleKey("max", e)}
          onPointerDown={(e) => startThumbDrag("max", e)}
          onPointerMove={(e) => moveThumbDrag("max", e)}
          onPointerUp={endThumbDrag}
          onPointerCancel={endThumbDrag}
        >
          <span className={knobClass} />
        </button>
      </div>
    </div>
  );
}
