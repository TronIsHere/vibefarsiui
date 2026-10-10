"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS_SHORT, jalaliMonthLength, toGregorian, toJalali } from "@/lib/jalali";
import { addDays, dayKey, eventColor, eventDayRange, fromKey, monthGrid, type CalendarEvent } from "@/lib/calendar-utils";
import { CalendarToolbar, dayInfo, useCalendar, useControllable, useRovingDays, useToday, type CalendarSettings, type DayInfo } from "@/registry/calendar/calendar-core";

export interface YearViewProps {
  /** Jalali year (controlled). Default this year. */
  year?: number;
  defaultYear?: number;
  onYearChange?: (year: number) => void;
  /** Days with events get a dot. */
  events?: CalendarEvent[];
  selected?: string;
  onDayClick?: (date: Date, info: DayInfo) => void;
  /** Months per row on wide screens. Default 4. */
  columns?: 3 | 4 | 6;
  toolbar?: boolean;
  className?: string;
}

/** First event color of every day an event covers. */
function eventDots(events: CalendarEvent[], tz: string) {
  const map = new Map<string, string>();
  events.forEach((e, i) => {
    const [a, b] = eventDayRange(e, tz);
    for (let d = fromKey(a); dayKey(d) <= b; d = addDays(d, 1)) {
      const k = dayKey(d);
      if (!map.has(k)) map.set(k, eventColor(e.color, i));
    }
  });
  return map;
}

/** Official holidays of a Jalali year, Fridays aside. */
function countHolidays(jy: number, settings: CalendarSettings, today: Date) {
  let n = 0;
  for (let jm = 1; jm <= 12; jm += 1) {
    for (let jd = 1; jd <= jalaliMonthLength(jy, jm); jd += 1) if (dayInfo(toGregorian(jy, jm, jd), settings, today).holiday) n += 1;
  }
  return n;
}

const COLS = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 6: "lg:grid-cols-6" } as const;

/**
 * نمای سال. Twelve Jalali months at a glance with every holiday marked, so
 * planning a trip or a release around تعطیلات takes one look. Arrow keys move
 * across days and months.
 */
export function YearView({ year, defaultYear, onYearChange, events = [], selected, onDayClick, columns = 4, toolbar = true, className }: YearViewProps) {
  const settings = useCalendar();
  const today = useToday();
  const [jy, setYear] = useControllable(year, defaultYear ?? toJalali(today).jy, onYearChange);

  const dots = React.useMemo(() => eventDots(events, settings.timeZone), [events, settings.timeZone]);

  const { container: gridRef, focusKey, setFocusKey, onKeyDown: onGridKey } = useRovingDays(selected ?? dayKey(toJalali(today).jy === jy ? today : toGregorian(jy, 1, 1)), (k) => {
    const y = toJalali(fromKey(k)).jy;
    if (y !== jy) setYear(y);
  });
  const holidays = React.useMemo(() => countHolidays(jy, settings, today), [jy, settings, today]);
  const inYear = toJalali(fromKey(focusKey)).jy === jy;
  const tabKey = inYear ? focusKey : dayKey(toGregorian(jy, 1, 1));

  return (
    <div className={cn("w-full", className)}>
      {toolbar && (
        <CalendarToolbar
          className="mb-3"
          title={`سال ${fa(jy)}`}
          subtitle={settings.occasions ? `${fa(holidays)} روز تعطیل رسمی به‌علاوه‌ی جمعه‌ها` : undefined}
          onPrev={() => setYear(jy - 1)}
          onNext={() => setYear(jy + 1)}
          onToday={() => setYear(toJalali(today).jy)}
          prevLabel="سال قبل"
          nextLabel="سال بعد"
        />
      )}
      <div ref={gridRef} onKeyDown={onGridKey} className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3", COLS[columns])}>
        {JALALI_MONTHS.map((name, i) => {
          const jm = i + 1;
          const weeks = monthGrid(jy, jm);
          return (
            <section key={name} className="rounded-surface border-line bg-card p-3" aria-label={`${name} ${fa(jy)}`}>
              <h3 className="mb-2 px-1 text-sm font-bold">{name}</h3>
              <div className="grid grid-cols-7 text-center text-[10px] text-muted-foreground" aria-hidden>
                {JALALI_WEEKDAYS_SHORT.map((d, c) => (
                  <span key={d} className={cn("py-0.5", settings.weekend.includes(c) && "text-destructive/70")}>
                    {d}
                  </span>
                ))}
              </div>
              <div role="grid" aria-label={name}>
                {weeks.map((week) => (
                  <div key={dayKey(week[0])} role="row" className="grid grid-cols-7">
                    {week.map((d) => {
                      if (toJalali(d).jm !== jm) return <span key={dayKey(d)} role="presentation" className="h-7" />;
                      const info = dayInfo(d, settings, today);
                      const off = info.holiday || info.isWeekend;
                      const dot = dots.get(info.key);
                      return (
                        <button
                          key={info.key}
                          type="button"
                          role="gridcell"
                          data-key={info.key}
                          tabIndex={info.key === tabKey ? 0 : -1}
                          aria-selected={selected === info.key}
                          aria-label={info.label}
                          title={info.occasions.map((o) => o.title).join("، ") || undefined}
                          onClick={() => {
                            setFocusKey(info.key);
                            onDayClick?.(d, info);
                          }}
                          className={cn(
                            "relative flex h-7 cursor-pointer items-center justify-center rounded-control text-[11px] tabular-nums transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
                            off && "text-destructive",
                            info.holiday && "bg-destructive/10 font-semibold",
                            info.isToday && "ring-2 ring-inset ring-foreground/70",
                            selected === info.key && "bg-primary text-primary-foreground",
                          )}
                        >
                          {fa(toJalali(d).jd)}
                          {dot && <span aria-hidden className="absolute bottom-0.5 size-1 rounded-full" style={{ background: dot }} />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
