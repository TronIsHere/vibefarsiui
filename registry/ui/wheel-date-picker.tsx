"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, formatJalali, jalaliMonthLength, toGregorian, toJalali } from "@/lib/jalali";

const ITEM = 40;
const VISIBLE = 5;

export interface WheelOption { value: number; label: string }

export interface WheelPickerProps {
  options: WheelOption[];
  value: number;
  onChange: (value: number) => void;
  "aria-label": string;
  className?: string;
}

/**
 * چرخ انتخاب. One scroll-snap column: the row under the center band is the value.
 * Touch, wheel and trackpad scroll natively; ArrowUp/Down, PageUp/Down, Home and End
 * move it from the keyboard.
 */
export function WheelPicker({ options, value, onChange, className, ...aria }: WheelPickerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const id = React.useId();
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  // Keep the scroll position in step with the value (also when the option list shrinks).
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * ITEM;
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTo({ top: target, behavior: el.dataset.ready ? "smooth" : "auto" });
    el.dataset.ready = "1";
  }, [index, options.length]);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  function onScroll() {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const next = options[Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM)))];
      if (next && next.value !== value) onChange(next.value);
    }, 90);
  }

  function step(delta: number) {
    const next = options[Math.min(options.length - 1, Math.max(0, index + delta))];
    if (next && next.value !== value) onChange(next.value);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const map: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: VISIBLE, PageUp: -VISIBLE, Home: -options.length, End: options.length };
    const delta = map[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    step(delta);
  }

  return (
    <div className={cn("relative flex-1", className)} style={{ height: ITEM * VISIBLE }}>
      <div
        ref={ref}
        role="listbox"
        tabIndex={0}
        aria-label={aria["aria-label"]}
        aria-activedescendant={`${id}-${index}`}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-lg [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
        style={{ paddingBlock: ITEM * ((VISIBLE - 1) / 2), maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)" }}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={`${id}-${i}`}
            role="option"
            aria-selected={i === index}
            onClick={() => onChange(o.value)}
            className={cn("flex cursor-pointer snap-center items-center justify-center text-base tabular-nums transition-colors", i === index ? "font-semibold text-foreground" : "text-muted-foreground")}
            style={{ height: ITEM }}
          >
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface WheelDatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  /** First and last Jalali year on the year wheel. Defaults to 100 years back through 5 ahead. */
  minYear?: number;
  maxYear?: number;
  /** Hides the line that reads the chosen date back. */
  hideSummary?: boolean;
  className?: string;
}

/**
 * تاریخ چرخشی. The three-wheel Jalali picker Iranian apps use for birthdays and
 * appointments: روز on the right, ماه in the middle, سال on the left. The day wheel
 * shortens for 30-day months and for اسفند outside leap years.
 */
export function WheelDatePicker({ value, defaultValue = null, onChange, minYear, maxYear, hideSummary, className }: WheelDatePickerProps) {
  const [internal, setInternal] = React.useState<Date | null>(defaultValue);
  const [today] = React.useState(() => new Date());
  const date = (value !== undefined ? value : internal) ?? today;
  const { jy, jm, jd } = toJalali(date);
  const thisYear = toJalali(today).jy;
  const from = minYear ?? thisYear - 100;
  const to = maxYear ?? thisYear + 5;

  const years = React.useMemo(() => Array.from({ length: to - from + 1 }, (_, i) => ({ value: to - i, label: fa(to - i) })), [from, to]);
  const months = React.useMemo(() => JALALI_MONTHS.map((m, i) => ({ value: i + 1, label: m })), []);
  const dayCount = jalaliMonthLength(jy, jm);
  const days = React.useMemo(() => Array.from({ length: dayCount }, (_, i) => ({ value: i + 1, label: fa(i + 1) })), [dayCount]);

  function set(y: number, m: number, d: number) {
    const next = toGregorian(y, m, Math.min(d, jalaliMonthLength(y, m)));
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <div role="group" aria-label="انتخاب تاریخ" className="relative flex gap-1 rounded-surface border-line border-border bg-card px-2">
        <div aria-hidden className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-lg bg-secondary" style={{ height: ITEM }} />
        <WheelPicker aria-label="روز" options={days} value={Math.min(jd, dayCount)} onChange={(d) => set(jy, jm, d)} />
        <WheelPicker aria-label="ماه" options={months} value={jm} onChange={(m) => set(jy, m, jd)} className="flex-[1.4]" />
        <WheelPicker aria-label="سال" options={years} value={Math.min(to, Math.max(from, jy))} onChange={(y) => set(y, jm, jd)} />
      </div>
      {!hideSummary && <p aria-live="polite" className="mt-3 text-center text-sm text-muted-foreground">{formatJalali(date, { weekday: true, year: true })}</p>}
    </div>
  );
}
