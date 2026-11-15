"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface SortableListProps<T> {
  items: T[];
  /** Stable key of an item. */
  getKey: (item: T) => string;
  /** Spoken name of an item for the announcements. */
  getLabel: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, state: { dragging: boolean; index: number }) => React.ReactNode;
  /** Name of the list, e.g. «ترتیب منو». */
  label: string;
  className?: string;
}

const moveItem = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
};

/**
 * فهرست مرتب‌شدنی. Drag rows by the handle with mouse or touch, or from the keyboard:
 * Space picks a row up, Up/Down move it, Space drops it and Escape puts it back.
 * Every step is announced, like «برداشته شد، جای ۲ از ۵».
 */
export function SortableList<T>({ items, getKey, getLabel, onReorder, renderItem, label, className }: SortableListProps<T>) {
  const [drag, setDrag] = React.useState<{ key: string; from: number; dy: number; h: number } | null>(null);
  const [over, setOver] = React.useState<number | null>(null);
  const [grabbed, setGrabbed] = React.useState<{ key: string; origin: T[] } | null>(null);
  const [announce, setAnnounce] = React.useState("");
  const rowRefs = React.useRef(new Map<string, HTMLLIElement>());
  const handleRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const start = React.useRef({ y: 0, mids: [] as number[] });
  const n = items.length;

  function pointerDown(e: React.PointerEvent, key: string, index: number) {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const rects = items.map((it) => rowRefs.current.get(getKey(it))!.getBoundingClientRect());
    start.current = { y: e.clientY, mids: rects.map((r) => r.top + r.height / 2) };
    setDrag({ key, from: index, dy: 0, h: rects[index].height });
    setOver(index);
  }
  function pointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const dy = e.clientY - start.current.y;
    const y = start.current.mids[drag.from] + dy;
    let to = drag.from;
    start.current.mids.forEach((m, i) => { if (i < drag.from && y < m) to = Math.min(to, i); if (i > drag.from && y > m) to = Math.max(to, i); });
    setDrag({ ...drag, dy });
    setOver(to);
  }
  function pointerUp() {
    if (drag && over !== null && over !== drag.from) {
      onReorder(moveItem(items, drag.from, over));
      setAnnounce(`${getLabel(items[drag.from])} به جای ${fa(over + 1)} از ${fa(n)} رفت.`);
    }
    setDrag(null);
    setOver(null);
  }

  function keyDown(e: React.KeyboardEvent, item: T, index: number) {
    const key = getKey(item);
    const name = getLabel(item);
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (grabbed?.key === key) { setGrabbed(null); setAnnounce(`${name} در جای ${fa(index + 1)} گذاشته شد.`); }
      else { setGrabbed({ key, origin: items }); setAnnounce(`${name} برداشته شد، جای ${fa(index + 1)} از ${fa(n)}. با بالا و پایین جابه‌جا کنید و با فاصله رها کنید.`); }
    } else if (grabbed?.key === key && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const to = e.key === "ArrowUp" ? index - 1 : index + 1;
      if (to < 0 || to >= n) return;
      onReorder(moveItem(items, index, to));
      setAnnounce(`جای ${fa(to + 1)} از ${fa(n)}`);
      requestAnimationFrame(() => handleRefs.current.get(key)?.focus());
    } else if (e.key === "Escape" && grabbed?.key === key) {
      e.preventDefault();
      onReorder(grabbed.origin);
      setGrabbed(null);
      setAnnounce(`جابه‌جایی ${name} لغو شد.`);
      requestAnimationFrame(() => handleRefs.current.get(key)?.focus());
    }
  }

  return (
    <div className={className}>
      <ul aria-label={label} className="space-y-2">
        {items.map((item, i) => {
          const key = getKey(item);
          const dragging = drag?.key === key;
          const lifted = dragging || grabbed?.key === key;
          // Neighbours slide out of the way while a row is dragged across them.
          let shift = 0;
          if (drag && over !== null && !dragging) {
            if (drag.from < over && i > drag.from && i <= over) shift = -drag.h - 8;
            if (drag.from > over && i < drag.from && i >= over) shift = drag.h + 8;
          }
          return (
            <li
              key={key}
              ref={(el) => { if (el) rowRefs.current.set(key, el); else rowRefs.current.delete(key); }}
              className={cn("relative flex items-center gap-2 rounded-surface border-line bg-card p-2 pe-3", lifted ? "z-10 border-primary shadow-overlay" : "border-border", !dragging && "transition-transform duration-200 ease-motion")}
              style={{ transform: dragging ? `translateY(${drag.dy}px) scale(1.02)` : shift ? `translateY(${shift}px)` : undefined }}
            >
              <button
                type="button"
                ref={(el) => { if (el) handleRefs.current.set(key, el); else handleRefs.current.delete(key); }}
                aria-label={`جابه‌جا کردن ${getLabel(item)}`}
                aria-pressed={grabbed?.key === key}
                aria-describedby={undefined}
                onPointerDown={(e) => pointerDown(e, key, i)}
                onPointerMove={pointerMove}
                onPointerUp={pointerUp}
                onPointerCancel={pointerUp}
                onKeyDown={(e) => keyDown(e, item, i)}
                onBlur={() => grabbed?.key === key && setGrabbed(null)}
                className={cn("flex size-8 shrink-0 touch-none items-center justify-center rounded-control text-muted-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring", drag ? "cursor-grabbing" : "cursor-grab")}
              >
                <GripVertical className="size-4" />
              </button>
              <div className="min-w-0 flex-1">{renderItem(item, { dragging: lifted, index: i })}</div>
            </li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="assertive">{announce}</p>
    </div>
  );
}
