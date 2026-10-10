"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS, JALALI_WEEKDAYS_SHORT, jalaliWeekday, toJalali } from "@/lib/jalali";
import { addDays, formatTime, formatTimeRange, fromKey, generateSlots, minutesOfDay, shortDay, zonedKey, type Slot } from "@/lib/calendar-utils";
import { CalendarEmpty, dayInfo, useCalendar, useControllable, useNow, useToday } from "@/registry/calendar/calendar-core";

export type SlotValue = { start: Date; end: Date } | null;
type Hours = [string, string][];

export interface SlotPickerProps {
  value?: SlotValue;
  defaultValue?: SlotValue;
  onChange?: (slot: SlotValue) => void;
  /** First day of the strip. Default today. */
  from?: Date;
  /** Days in the strip. Default 14. */
  days?: number;
  /** Opening hours for every day, or per weekday (0 = شنبه). Default 09–13 and 16–20. */
  hours?: Hours | Partial<Record<number, Hours>>;
  /** Weekdays closed. Default [6] (جمعه). */
  closedWeekdays?: number[];
  /** Close on official holidays. Default true. */
  closeOnHolidays?: boolean;
  /** Extra closed days, "YYYY-MM-DD". */
  closedDays?: string[];
  /** Your own reason a day is closed, e.g. «دکتر سه‌شنبه‌ها نیستن»; return null to fall back to the rules above. */
  closedReason?: (date: Date) => string | null;
  /** Minutes per appointment. Default 30. */
  duration?: number;
  /** Minutes between starts. Default = duration. */
  step?: number;
  /** Seats per slot. Default 1; above 1 shows seats left. */
  capacity?: number;
  /** Booked intervals, or a function per day key. */
  busy?: { start: Date; end: Date }[] | ((key: string) => { start: Date; end: Date }[]);
  className?: string;
}

const DEFAULT_HOURS: Hours = [["09:00", "13:00"], ["16:00", "20:00"]];

function hoursFor(hours: SlotPickerProps["hours"], weekday: number): Hours {
  if (!hours) return DEFAULT_HOURS;
  if (Array.isArray(hours)) return hours;
  return hours[weekday] ?? [];
}

function part(min: number) {
  return min < 12 * 60 ? "صبح" : min < 17 * 60 ? "بعدازظهر" : "عصر";
}

/**
 * انتخاب نوبت. A strip of days (Fridays, holidays and closed days disabled,
 * with the reason) above the free times of the chosen day, grouped into
 * صبح، بعدازظهر and عصر. Past and full slots stay visible but disabled.
 */
export function SlotPicker({
  value,
  defaultValue = null,
  onChange,
  from,
  days = 14,
  hours,
  closedWeekdays = [6],
  closeOnHolidays = true,
  closedDays = [],
  closedReason,
  duration = 30,
  step,
  capacity = 1,
  busy = [],
  className,
}: SlotPickerProps) {
  const settings = useCalendar();
  const tz = settings.timeZone;
  const today = useToday();
  const now = useNow();
  const start = from ?? today;
  const [slot, setSlot] = useControllable<SlotValue>(value, defaultValue, onChange);

  const strip = Array.from({ length: days }, (_, i) => {
    const d = addDays(start, i);
    const info = dayInfo(d, settings, today);
    const wd = jalaliWeekday(d);
    const reason =
      closedReason?.(d) ??
      (closedWeekdays.includes(wd) ? `${JALALI_WEEKDAYS[wd]}‌ها تعطیل است`
      : closeOnHolidays && info.holiday ? `تعطیل رسمی: ${info.holiday.title}`
      : closedDays.includes(info.key) ? "این روز تعطیل است"
      : hoursFor(hours, wd).length === 0 ? "این روز نوبت‌دهی نداریم"
      : null);
    return { d, info, wd, reason };
  });

  const firstOpen = strip.find((s) => !s.reason)?.info.key ?? strip[0].info.key;
  const [day, setDay] = React.useState(() => (slot ? zonedKey(slot.start, tz) : firstOpen));
  const current = strip.find((s) => s.info.key === day) ?? strip[0];

  const slots: Slot[] = current.reason
    ? []
    : generateSlots({
        key: current.info.key,
        open: hoursFor(hours, current.wd),
        duration,
        step,
        capacity,
        busy: typeof busy === "function" ? busy(current.info.key) : busy,
        tz,
        now: now ?? new Date(0),
      });
  const groups = ["صبح", "بعدازظهر", "عصر"].map((name) => ({ name, items: slots.filter((s) => part(minutesOfDay(s.start, tz)) === name) })).filter((g) => g.items.length);
  const free = slots.filter((s) => s.state === "free").length;
  const nextOpen = strip.find((s) => s.info.key > current.info.key && !s.reason);

  const stripRef = React.useRef<HTMLDivElement>(null);
  function onStripKey(e: React.KeyboardEvent) {
    const dir = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const i = strip.findIndex((s) => s.info.key === day);
    const n = strip[Math.max(0, Math.min(strip.length - 1, i + dir))];
    setDay(n.info.key);
    stripRef.current?.querySelector<HTMLElement>(`[data-key="${n.info.key}"]`)?.focus();
  }

  const selectedKey = slot ? slot.start.getTime() : null;
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div ref={stripRef} role="listbox" aria-label="روز" onKeyDown={onStripKey} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {strip.map(({ d, info, reason }) => {
          const { jm, jd } = toJalali(d);
          const active = info.key === day;
          return (
            <button
              key={info.key}
              type="button"
              role="option"
              data-key={info.key}
              aria-selected={active}
              aria-disabled={!!reason}
              tabIndex={active ? 0 : -1}
              title={reason ?? info.holiday?.title}
              aria-label={`${info.label}${reason ? `، ${reason}` : ""}`}
              onClick={() => !reason && setDay(info.key)}
              className={cn(
                "flex w-14 shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-control border-line border-border py-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent",
                reason && "cursor-not-allowed opacity-45 hover:bg-transparent",
                !active && info.holiday && "text-destructive",
              )}
            >
              <span className="text-[10px] opacity-80">{info.isToday ? "امروز" : JALALI_WEEKDAYS_SHORT[jalaliWeekday(d)]}</span>
              <span className="text-base font-bold tabular-nums leading-none">{fa(jd)}</span>
              <span className="text-[10px] opacity-80">{JALALI_MONTHS[jm - 1]}</span>
              {reason && <span aria-hidden className="h-0.5 w-5 rounded-full bg-current opacity-60" />}
            </button>
          );
        })}
      </div>

      {current.reason ? (
        <CalendarEmpty>{current.reason}</CalendarEmpty>
      ) : groups.length === 0 || free === 0 ? (
        <div className="space-y-2">
          <CalendarEmpty>برای {shortDay(fromKey(current.info.key))} وقت خالی نمانده.</CalendarEmpty>
          {nextOpen && (
            <button type="button" onClick={() => setDay(nextOpen.info.key)} className="w-full cursor-pointer rounded-control border-line border-border py-2 text-sm transition-colors hover:bg-accent">
              اولین روز بعدی: {nextOpen.info.label.split("،")[0]}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.name}>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">{g.name}</p>
              <div role="radiogroup" aria-label={g.name} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {g.items.map((s) => {
                  const on = selectedKey === s.start.getTime();
                  const off = s.state !== "free";
                  return (
                    <button
                      key={s.start.getTime()}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      disabled={off}
                      aria-label={`${formatTimeRange(s.start, s.end, tz)}${s.state === "full" ? "، پر شده" : s.state === "past" ? "، گذشته" : capacity > 1 ? `، ${fa(s.left)} جای خالی` : ""}`}
                      onClick={() => setSlot(on ? null : { start: s.start, end: s.end })}
                      className={cn(
                        "flex h-11 cursor-pointer flex-col items-center justify-center rounded-control border-line border-border text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                        on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent",
                        off && "cursor-not-allowed line-through opacity-40 hover:bg-transparent",
                      )}
                    >
                      {formatTime(s.start, tz)}
                      {capacity > 1 && !off && <span className={cn("text-[10px] no-underline", on ? "opacity-80" : "text-muted-foreground")}>{fa(s.left)} جای خالی</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {slot ? `${dayInfo(fromKey(zonedKey(slot.start, tz)), settings, today).label.split("،")[0]}، ساعت ${formatTimeRange(slot.start, slot.end, tz)}` : `${fa(free)} وقت خالی در ${shortDay(fromKey(current.info.key))}`}
      </p>
    </div>
  );
}
