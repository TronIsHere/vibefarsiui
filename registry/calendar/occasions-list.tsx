"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS, jalaliMonthLength, jalaliWeekday, toGregorian, toJalali } from "@/lib/jalali";
import { formatHijri } from "@/lib/hijri";
import type { Occasion } from "@/lib/iran-holidays";
import { addDays, dayKey, dayLabel, diffDays, startOfJalaliWeek } from "@/lib/calendar-utils";
import { CalendarEmpty, useCalendar, useToday } from "@/registry/calendar/calendar-core";

/** «تعطیل» pill; with `approximate`, adds «تقریبی» so a guessed lunar date is never shown as certain. */
export function HolidayBadge({ approximate, className }: { approximate?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 text-[10px] font-medium leading-5 text-destructive", className)}>
      تعطیل
      {approximate && <span className="text-destructive/70">· تقریبی</span>}
    </span>
  );
}

export type OccasionsRange = "today" | "week" | "month" | "upcoming";

export interface OccasionsListProps {
  /** Which days to list. «upcoming» shows the next `limit` from today. Default "month". */
  range?: OccasionsRange;
  /** Day the range is built around. Default today. */
  date?: Date;
  holidaysOnly?: boolean;
  /** Max rows. Default 6 for «upcoming», unlimited otherwise. */
  limit?: number;
  title?: React.ReactNode;
  /** Show the Hijri date of each row. Default true. */
  showHijri?: boolean;
  emptyText?: React.ReactNode;
  className?: string;
}

const TITLES: Record<OccasionsRange, string> = { today: "مناسبت‌های امروز", week: "مناسبت‌های این هفته", month: "مناسبت‌های این ماه", upcoming: "تعطیلات و مناسبت‌های پیش رو" };

function daysOf(range: OccasionsRange, anchor: Date): Date[] {
  if (range === "today") return [anchor];
  if (range === "week") {
    const s = startOfJalaliWeek(anchor);
    return Array.from({ length: 7 }, (_, i) => addDays(s, i));
  }
  if (range === "month") {
    const { jy, jm } = toJalali(anchor);
    return Array.from({ length: jalaliMonthLength(jy, jm) }, (_, i) => toGregorian(jy, jm, i + 1));
  }
  return Array.from({ length: 400 }, (_, i) => addDays(anchor, i));
}

/**
 * فهرست مناسبت‌ها. Holidays and occasions for today, this week, this month
 * or the next few, each with its Jalali and Hijri date and how far away it
 * is. Lunar dates outside the official table are marked «تقریبی».
 */
export function OccasionsList({ range = "month", date, holidaysOnly, limit, title, showHijri = true, emptyText = "مناسبتی در این بازه نیست.", className }: OccasionsListProps) {
  const { occasions } = useCalendar();
  const today = useToday();
  const anchor = date ?? today;
  const max = limit ?? (range === "upcoming" ? 6 : Infinity);

  const rows = React.useMemo(() => {
    if (!occasions) return [];
    const out: Occasion[] = [];
    for (const d of daysOf(range, anchor)) {
      for (const o of occasions(dayKey(d))) if (!holidaysOnly || o.holiday) out.push(o);
      if (out.length >= max) break;
    }
    return out.slice(0, max);
  }, [occasions, range, anchor, holidaysOnly, max]);

  return (
    <section className={cn("rounded-surface border-line bg-card p-4", className)}>
      <h3 className="mb-3 text-sm font-bold">{title ?? TITLES[range]}</h3>
      {rows.length === 0 ? (
        <CalendarEmpty>{emptyText}</CalendarEmpty>
      ) : (
        <ul className="space-y-2">
          {rows.map((o) => {
            const { jm, jd } = toJalali(o.date);
            const away = diffDays(today, o.date);
            return (
              <li key={o.key + o.title} className="flex items-center gap-3">
                <span className={cn("flex w-12 shrink-0 flex-col items-center rounded-control border py-1 leading-tight", o.holiday ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-border")}>
                  <span className="text-base font-bold tabular-nums">{fa(jd)}</span>
                  <span className="text-[10px]">{JALALI_MONTHS[jm - 1]}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{o.title}</span>
                    {o.holiday && <HolidayBadge approximate={o.approximate} />}
                    {!o.holiday && o.approximate && <span className="text-[10px] text-muted-foreground">تقریبی</span>}
                  </span>
                  <span className="flex flex-wrap gap-x-1.5 text-[11px] text-muted-foreground [&>span]:whitespace-nowrap [&>span+span]:before:me-1.5 [&>span+span]:before:content-['·']">
                    <span>{JALALI_WEEKDAYS[jalaliWeekday(o.date)]}</span>
                    {showHijri && o.kind === "lunar" && <span>{formatHijri(o.date)}</span>}
                    {away > 1 && <span>{fa(away)} روز دیگر</span>}
                    {away >= -1 && away <= 1 && <span>{dayLabel(o.date, today)}</span>}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
