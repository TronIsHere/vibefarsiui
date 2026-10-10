"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS_SHORT, jalaliMonthLength, jalaliWeekday, toGregorian, toJalali } from "@/lib/jalali";

export interface CalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  /** Disable dates before/after these. */
  min?: Date;
  max?: Date;
  /** Grey out Fridays (default true). */
  markWeekend?: boolean;
  /** Holiday name for a day, or null. Named days turn red and show the name on hover; pass occasionsOn from the iran-holidays lib. */
  occasion?: (date: Date) => string | null;
  compact?: boolean;
  className?: string;
}

const sameDay = (a: Date | null | undefined, b: Date) =>
  !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * تقویم شمسی. Renders a Jalali month; weeks start on شنبه, Fridays are
 * marked, today gets a ring. Values are plain JS Dates so the rest of your
 * app stays Gregorian-agnostic.
 */
export function Calendar({ value, defaultValue = null, onChange, min, max, markWeekend = true, occasion, compact, className }: CalendarProps) {
  const [internal, setInternal] = React.useState<Date | null>(defaultValue);
  const selected = value === undefined ? internal : value;
  const today = React.useMemo(() => new Date(), []);
  const initial = toJalali(selected ?? today);
  const [view, setView] = React.useState({ jy: initial.jy, jm: initial.jm });

  const first = toGregorian(view.jy, view.jm, 1);
  const offset = jalaliWeekday(first);
  const days = jalaliMonthLength(view.jy, view.jm);
  const cells = Array.from({ length: offset + days }, (_, i) => (i < offset ? null : i - offset + 1));

  function move(delta: number) {
    setView((v) => {
      let jm = v.jm + delta;
      let jy = v.jy;
      if (jm < 1) { jm = 12; jy -= 1; }
      if (jm > 12) { jm = 1; jy += 1; }
      return { jy, jm };
    });
  }

  function pick(d: number) {
    const date = toGregorian(view.jy, view.jm, d);
    if (value === undefined) setInternal(date);
    onChange?.(date);
  }

  const nav = "flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  return (
    <div className={cn("rounded-xl border border-border bg-card p-3", compact ? "w-[220px]" : "w-[260px]", className)}>
      <div className="flex items-center justify-between px-1">
        <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>
          {JALALI_MONTHS[view.jm - 1]} {fa(view.jy)}
        </span>
        <div className="flex gap-0.5">
          <button type="button" aria-label="ماه قبل" onClick={() => move(-1)} className={nav}><ChevronRight className="size-4" /></button>
          <button type="button" aria-label="ماه بعد" onClick={() => move(1)} className={nav}><ChevronLeft className="size-4" /></button>
        </div>
      </div>
      <div className={cn("mt-2 grid grid-cols-7 overflow-hidden text-center", compact ? "gap-px text-[10px]" : "gap-0.5 text-[11px]")} role="grid">
        {JALALI_WEEKDAYS_SHORT.map((d) => (
          <span key={d} className="py-1 text-muted-foreground/80" aria-hidden>{d}</span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} className={compact ? "h-6" : "h-8"} />;
          const date = toGregorian(view.jy, view.jm, d);
          const isSel = sameDay(selected, date);
          const isToday = sameDay(today, date);
          const fri = i % 7 === 6;
          const disabled = (min && date < min) || (max && date > max);
          const holiday = occasion?.(date) ?? null;
          return (
            <button
              key={d}
              type="button"
              role="gridcell"
              aria-selected={isSel}
              aria-label={`${fa(d)} ${JALALI_MONTHS[view.jm - 1]}${holiday ? `، تعطیل: ${holiday}` : ""}`}
              title={holiday ?? undefined}
              disabled={!!disabled}
              onClick={() => pick(d)}
              className={cn(
                "flex w-full min-w-0 items-center justify-center rounded-md leading-none whitespace-nowrap tabular-nums transition-colors",
                compact ? "h-6" : "h-8",
                isSel && "bg-primary font-semibold text-primary-foreground",
                !isSel && isToday && "ring-1 ring-inset ring-foreground/40",
                !isSel && markWeekend && fri && "text-muted-foreground/60",
                !isSel && holiday && "font-semibold text-destructive underline decoration-dotted underline-offset-4",
                !isSel && !disabled && "cursor-pointer hover:bg-accent",
                disabled && "cursor-not-allowed opacity-30",
              )}
            >
              {fa(d)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
