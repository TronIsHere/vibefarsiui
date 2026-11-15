"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";

/** Keeps the resize cursor while the pointer is outside the thin separator. */
function bodyCursor(cursor: string) {
  document.body.style.cursor = cursor;
}

export interface ResizablePanelsProps {
  /** «horizontal» puts panels side by side; the first one is on the right in RTL. */
  direction?: "horizontal" | "vertical";
  /** Starting sizes in percent, one per child. Defaults to equal. */
  defaultSizes?: number[];
  sizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
  /** Smallest size of any panel in percent. Default 15. */
  min?: number;
  /** Panels below this size snap closed, like a collapsible sidebar. Off by default. */
  collapseBelow?: number;
  /** Names of the panels for the separators' labels. */
  labels?: string[];
  /** Height for horizontal groups. Default 100%. */
  className?: string;
  children: React.ReactNode;
}

/**
 * پنل‌های قابل تغییر اندازه. Split a view into panels with draggable separators. Each
 * separator is a focusable role=separator: arrows resize by 2%, Shift by 10%, Home and End
 * jump to the limits, and Enter collapses and restores the panel before it.
 */
export function ResizablePanels({ direction = "horizontal", defaultSizes, sizes, onSizesChange, min = 15, collapseBelow, labels, className, children }: ResizablePanelsProps) {
  const panels = React.Children.toArray(children);
  const count = panels.length;
  const [internal, setInternal] = React.useState<number[]>(() => defaultSizes ?? panels.map(() => 100 / count));
  const current = sizes ?? internal;
  const root = React.useRef<HTMLDivElement>(null);
  const memory = React.useRef<Record<number, number>>({});
  const horizontal = direction === "horizontal";

  const commit = React.useCallback((next: number[]) => {
    if (sizes === undefined) setInternal(next);
    onSizesChange?.(next);
  }, [sizes, onSizesChange]);

  /** Move the separator after panel `i` by `delta` percent toward panel i+1 (growing panel i). */
  const resize = React.useCallback((i: number, delta: number, base = current) => {
    const pair = base[i] + base[i + 1];
    let a = Math.min(pair - min, Math.max(min, base[i] + delta));
    if (collapseBelow !== undefined && base[i] + delta < collapseBelow) a = 0;
    if (collapseBelow !== undefined && pair - (base[i] + delta) < collapseBelow) a = pair;
    const next = [...base];
    next[i] = a;
    next[i + 1] = pair - a;
    commit(next);
  }, [current, min, collapseBelow, commit]);

  function onPointerDown(e: React.PointerEvent, i: number) {
    e.preventDefault();
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === "rtl";
    const total = horizontal ? rect.width : rect.height;
    const p0 = horizontal ? e.clientX : e.clientY;
    const base = current;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      let d = ((horizontal ? ev.clientX : ev.clientY) - p0) / total * 100;
      if (horizontal && rtl) d = -d;
      resize(i, d, base);
    };
    const up = () => { target.removeEventListener("pointermove", move); target.removeEventListener("pointerup", up); bodyCursor(""); };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", up);
    bodyCursor(horizontal ? "col-resize" : "row-resize");
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const step = e.shiftKey ? 10 : 2;
    const rtl = root.current ? getComputedStyle(root.current).direction === "rtl" : true;
    // Toward the next panel grows this one: left in RTL, right in LTR, down when vertical.
    const grow = horizontal ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
    const shrink = horizontal ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
    if (e.key === grow) resize(i, step);
    else if (e.key === shrink) resize(i, -step);
    else if (e.key === "Home") resize(i, -100);
    else if (e.key === "End") resize(i, 100);
    else if (e.key === "Enter") {
      if (current[i] > 0) { memory.current[i] = current[i]; commit(Object.assign([...current], { [i]: 0, [i + 1]: current[i] + current[i + 1] })); }
      else { const back = memory.current[i] ?? 30; commit(Object.assign([...current], { [i]: back, [i + 1]: current[i + 1] - back })); }
    } else return;
    e.preventDefault();
  }

  return (
    <div ref={root} className={cn("flex min-h-0 overflow-hidden", horizontal ? "h-full flex-row" : "h-full flex-col", className)}>
      {panels.map((child, i) => (
        <React.Fragment key={i}>
          <div className="min-h-0 min-w-0 overflow-auto" style={{ flexBasis: `${current[i]}%`, flexGrow: 0, flexShrink: 0, display: current[i] === 0 ? "none" : undefined }}>
            {child}
          </div>
          {i < count - 1 && (
            <div
              role="separator"
              tabIndex={0}
              aria-orientation={horizontal ? "vertical" : "horizontal"}
              aria-valuenow={Math.round(current[i])}
              aria-valuemin={collapseBelow !== undefined ? 0 : min}
              aria-valuemax={100 - min}
              aria-valuetext={`${fa(Math.round(current[i]))}٪`}
              aria-label={`اندازه‌ی ${labels?.[i] ?? `پنل ${fa(i + 1)}`}`}
              onPointerDown={(e) => onPointerDown(e, i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onDoubleClick={() => { const even = (current[i] + current[i + 1]) / 2; commit(Object.assign([...current], { [i]: even, [i + 1]: even })); }}
              className={cn(
                "group relative z-10 flex shrink-0 touch-none items-center justify-center outline-none",
                horizontal ? "w-px cursor-col-resize bg-border" : "h-px cursor-row-resize bg-border",
                "after:absolute after:content-[''] focus-visible:bg-ring",
                horizontal ? "after:inset-y-0 after:-inset-x-2" : "after:inset-x-0 after:-inset-y-2",
              )}
            >
              <span aria-hidden className={cn("rounded-full border border-border bg-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100", horizontal ? "h-6 w-1.5" : "h-1.5 w-6")} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
