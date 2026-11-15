"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const UNITS: [limit: number, seconds: number, name: string][] = [
  [60, 1, "ثانیه"],
  [3600, 60, "دقیقه"],
  [86400, 3600, "ساعت"],
  [86400 * 30, 86400, "روز"],
  [86400 * 365, 86400 * 30, "ماه"],
  [Infinity, 86400 * 365, "سال"],
];

/**
 * Persian relative time in both directions: «همین حالا»، «۵ دقیقه پیش»، «دیروز»،
 * «۳ روز دیگر»، «فردا». Past uses «پیش» and future uses «دیگر».
 */
export function relativeTime(date: Date, now = new Date()): string {
  const diff = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diff);
  if (abs < 45) return "همین حالا";
  const [, size, name] = UNITS.find(([limit]) => abs < limit)!;
  const n = Math.max(1, Math.round(abs / size));
  if (name === "روز" && n === 1) return diff < 0 ? "دیروز" : "فردا";
  if (name === "روز" && n === 2) return diff < 0 ? "پریروز" : "پس‌فردا";
  return `${fa(n)} ${name} ${diff < 0 ? "پیش" : "دیگر"}`;
}

/** Seconds until the label would change, so the timer wakes only when it has to. */
function nextTick(date: Date, now: Date) {
  const abs = Math.abs(date.getTime() - now.getTime()) / 1000;
  if (abs < 60) return 10;
  if (abs < 3600) return 30;
  if (abs < 86400) return 300;
  return 3600;
}

export interface RelativeTimeProps extends Omit<React.TimeHTMLAttributes<HTMLTimeElement>, "dateTime"> {
  date: Date | string | number;
  /** Keep the label fresh while the page is open. */
  live?: boolean;
  /** After this many days the full Jalali date is shown instead of «… پیش». */
  absoluteAfterDays?: number;
}

/**
 * زمان نسبی. A <time> element that says «۳ دقیقه پیش» and keeps itself up to date. The exact
 * Jalali date and time are in the tooltip and in `dateTime` for machines. It renders the
 * absolute date on the server and switches after mount, so hydration never mismatches.
 */
export function RelativeTime({ date, live = true, absoluteAfterDays = 30, className, ...props }: RelativeTimeProps) {
  const d = React.useMemo(() => new Date(date), [date]);
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    let id: number;
    const tick = () => {
      const current = new Date();
      setNow(current);
      if (live) id = window.setTimeout(tick, nextTick(d, current) * 1000);
    };
    id = window.setTimeout(tick, 0);
    return () => window.clearTimeout(id);
  }, [d, live]);

  const clock = fa(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
  const full = `${formatJalali(d, { weekday: true, year: true })}، ساعت ${clock}`;
  const absolute = formatJalali(d, { year: true });
  const old = now ? Math.abs(now.getTime() - d.getTime()) > absoluteAfterDays * 864e5 : true;

  return (
    <time dateTime={d.toISOString()} title={full} className={cn("whitespace-nowrap", className)} {...props}>
      {now && !old ? relativeTime(d, now) : absolute}
    </time>
  );
}
