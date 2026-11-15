"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS, jalaliWeekday, toJalali } from "@/lib/jalali";
import { HIJRI_MONTHS, toHijri } from "@/lib/hijri";
import { addDays } from "@/lib/calendar-utils";
import { CalendarToolbar, useCalendar, useDayInfo, useToday } from "@/registry/calendar/calendar-core";

export const GREGORIAN_MONTHS_FA = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
const GREGORIAN_MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS_AR = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const WEEKDAYS_EN = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export type TripleDateParts = {
  jalali: { y: number; m: number; d: number; month: string; weekday: string };
  hijri: { y: number; m: number; d: number; month: string; weekday: string; approximate: boolean };
  gregorian: { y: number; m: number; d: number; month: string; monthEn: string; weekday: string };
};

/** The same day in all three calendars, with month and weekday names. */
export function tripleDate(date: Date): TripleDateParts {
  const w = jalaliWeekday(date);
  const { jy, jm, jd } = toJalali(date);
  const h = toHijri(date);
  return {
    jalali: { y: jy, m: jm, d: jd, month: JALALI_MONTHS[jm - 1], weekday: JALALI_WEEKDAYS[w] },
    hijri: { y: h.hy, m: h.hm, d: h.hd, month: HIJRI_MONTHS[h.hm - 1], weekday: WEEKDAYS_AR[w], approximate: h.approximate },
    gregorian: { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), month: GREGORIAN_MONTHS_FA[date.getMonth()], monthEn: GREGORIAN_MONTHS_EN[date.getMonth()], weekday: WEEKDAYS_EN[w] },
  };
}

export interface TripleDateProps {
  /** Day shown. Defaults to today. */
  date?: Date;
  /** Previous/next day buttons (only when `date` is not set). */
  navigable?: boolean;
  /** «card» with the Jalali day large, or one «inline» line for headers. */
  variant?: "card" | "inline";
  /** Gregorian in English with Latin digits, the way it's written on documents. Default Persian. */
  latinGregorian?: boolean;
  /** Show today's occasions under the card. Default true. */
  occasions?: boolean;
  className?: string;
}

/**
 * تاریخ سه‌گانه. One day in Jalali, Hijri (Iran's official sighting table) and Gregorian,
 * like the date block on top of Iranian calendars and newspapers, with the day's occasions.
 */
export function TripleDate({ date, navigable, variant = "card", latinGregorian, occasions = true, className }: TripleDateProps) {
  const today = useToday();
  const { occasions: provider } = useCalendar();
  const [offset, setOffset] = React.useState(0);
  const day = date ?? addDays(today, offset);
  const info = useDayInfo(day);
  const p = tripleDate(day);
  const hijriText = `${fa(p.hijri.d)} ${p.hijri.month} ${fa(p.hijri.y)}`;
  const gregText = latinGregorian ? `${p.gregorian.monthEn} ${p.gregorian.d}, ${p.gregorian.y}` : `${fa(p.gregorian.d)} ${p.gregorian.month} ${fa(p.gregorian.y)}`;
  const approx = p.hijri.approximate && <abbr title="خارج از جدول رسمی رؤیت هلال؛ ممکنه یک روز جابه‌جا باشه" className="ms-1 text-[10px] text-muted-foreground no-underline">(تقریبی)</abbr>;

  if (variant === "inline") {
    return (
      <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm", className)}>
        <time dateTime={info.key} className="font-medium">{p.jalali.weekday} {fa(p.jalali.d)} {p.jalali.month} {fa(p.jalali.y)}</time>
        <span aria-hidden className="text-muted-foreground/50">|</span>
        <span className="text-muted-foreground">{hijriText}{approx}</span>
        <span aria-hidden className="text-muted-foreground/50">|</span>
        {latinGregorian ? <bdi dir="ltr" className="text-muted-foreground">{gregText}</bdi> : <span className="text-muted-foreground">{gregText}</span>}
      </p>
    );
  }

  const list = provider && occasions ? info.occasions : [];
  return (
    <section aria-label="تاریخ امروز در سه تقویم" className={cn("overflow-hidden rounded-surface border-line border-border bg-card", className)}>
      {navigable && !date && (
        <CalendarToolbar
          className="border-b border-border px-3 py-2"
          title={offset === 0 ? "امروز" : offset === 1 ? "فردا" : offset === -1 ? "دیروز" : `${fa(Math.abs(offset))} روز ${offset > 0 ? "بعد" : "قبل"}`}
          onPrev={() => setOffset((o) => o - 1)}
          onNext={() => setOffset((o) => o + 1)}
          onToday={offset ? () => setOffset(0) : undefined}
          prevLabel="روز قبل"
          nextLabel="روز بعد"
        />
      )}
      <div className="flex items-stretch">
        <div className={cn("flex w-28 shrink-0 flex-col items-center justify-center gap-0.5 py-4", info.holiday || info.isWeekend ? "bg-destructive/10 text-destructive" : "bg-secondary")}>
          <span className="text-xs font-medium">{p.jalali.weekday}</span>
          <time dateTime={info.key} className="font-display text-5xl font-black leading-none tabular-nums">{fa(p.jalali.d)}</time>
          <span className="text-sm font-semibold">{p.jalali.month}</span>
          <span className="text-[11px] opacity-70">{fa(p.jalali.y)}</span>
        </div>
        <dl className="flex min-w-0 flex-1 flex-col justify-center divide-y divide-border px-4">
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="text-xs text-muted-foreground">قمری</dt>
            <dd className="text-sm font-medium" lang="fa">{hijriText}{approx}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="text-xs text-muted-foreground">میلادی</dt>
            <dd className="text-sm font-medium">{latinGregorian ? <bdi dir="ltr" lang="en">{gregText}</bdi> : gregText}</dd>
          </div>
        </dl>
      </div>
      {list.length > 0 && (
        <ul className="space-y-1 border-t border-border px-4 py-2.5 text-xs">
          {list.map((o) => (
            <li key={o.title} className={cn("flex items-center gap-2", o.holiday ? "text-destructive" : "text-muted-foreground")}>
              <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", o.holiday ? "bg-destructive" : "bg-muted-foreground/50")} />
              {o.title}
              {o.holiday && <span className="sr-only">(تعطیل)</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
