"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import { formatHijri } from "@/lib/hijri";
import { addDays, dayKey, dayLabel, eventColor, eventDayRange, formatTimeRange, type CalendarEvent } from "@/lib/calendar-utils";
import { CalendarEmpty, CalendarToolbar, dayInfo, useCalendar, useControllable, useToday } from "@/registry/calendar/calendar-core";

const RELATIVE = ["امروز", "فردا", "دیروز"];

export interface AgendaViewProps {
  events?: CalendarEvent[];
  /** First day of the list (controlled). Default today. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Days covered. Default 14. */
  days?: number;
  /** Also list holidays and occasions on their days. Default true. */
  showOccasions?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  emptyText?: React.ReactNode;
  toolbar?: boolean;
  className?: string;
}

/**
 * فهرست رویدادها. Days with something on them, labelled «امروز»، «فردا» or
 * by weekday, each event with its time, color and place. Holidays show up as
 * their own line, so a quiet day off is not mistaken for an empty one.
 */
export function AgendaView({ events = [], date, defaultDate, onDateChange, days = 14, showOccasions = true, onEventClick, emptyText = "در این بازه رویدادی نیست.", toolbar = true, className }: AgendaViewProps) {
  const settings = useCalendar();
  const today = useToday();
  const [from, setFrom] = useControllable(date, defaultDate ?? today, onDateChange);
  const indexOf = React.useMemo(() => new Map(events.map((e, i) => [e, i])), [events]);
  const ranges = React.useMemo(() => events.map((e) => [e, ...eventDayRange(e, settings.timeZone)] as const), [events, settings.timeZone]);

  const groups = Array.from({ length: days }, (_, i) => {
    const d = addDays(from, i);
    const key = dayKey(d);
    const info = dayInfo(d, settings, today);
    const list = ranges
      .filter(([, a, b]) => a <= key && b >= key)
      .map(([e]) => e)
      .sort((x, y) => Number(!!y.allDay) - Number(!!x.allDay) || x.start.getTime() - y.start.getTime());
    const label = dayLabel(d, today);
    return { d, key, info, list, label, relative: RELATIVE.includes(label), occasions: showOccasions ? info.occasions : [] };
  }).filter((g) => g.list.length || g.occasions.length);

  const last = addDays(from, days - 1);
  return (
    <div className={cn("w-full", className)}>
      {toolbar && (
        <CalendarToolbar
          className="mb-3"
          title={`${formatJalali(from, { year: false })} تا ${formatJalali(last)}`}
          onPrev={() => setFrom(addDays(from, -days))}
          onNext={() => setFrom(addDays(from, days))}
          onToday={() => setFrom(today)}
          prevLabel="بازه‌ی قبل"
          nextLabel="بازه‌ی بعد"
        />
      )}
      {!groups.length ? (
        <CalendarEmpty>{emptyText}</CalendarEmpty>
      ) : (
        <ol className="divide-y overflow-hidden rounded-surface border-line bg-card">
          {groups.map((g) => (
            <li key={g.key} className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <div>
                <p className={cn("text-sm font-bold", g.info.isToday && "text-primary", (g.info.holiday || g.info.isWeekend) && "text-destructive")}>{g.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {g.relative ? formatJalali(g.d, { weekday: true }) : formatJalali(g.d)}
                  {settings.secondary === "hijri" && <span className="block">{formatHijri(g.d)}</span>}
                </p>
              </div>
              <ul className="space-y-1.5">
                {g.occasions.map((o) => (
                  <li key={o.title} className={cn("flex items-center gap-2 text-xs", o.holiday ? "text-destructive" : "text-muted-foreground")}>
                    <span aria-hidden className={cn("size-1.5 rounded-full", o.holiday ? "bg-destructive" : "bg-muted-foreground/50")} />
                    {o.title}
                    {o.holiday && <span className="rounded-full border border-destructive/30 px-1.5 text-[10px]">تعطیل</span>}
                    {o.approximate && <span className="text-[10px] text-muted-foreground">تقریبی</span>}
                  </li>
                ))}
                {g.list.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => onEventClick?.(e)}
                      className="flex w-full cursor-pointer items-start gap-3 rounded-control px-2 py-1.5 text-start transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span className="w-24 shrink-0 pt-0.5 text-xs text-muted-foreground tabular-nums">{e.allDay ? "تمام روز" : formatTimeRange(e.start, e.end, settings.timeZone)}</span>
                      <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: eventColor(e.color, indexOf.get(e) ?? 0) }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{e.title}</span>
                        {e.location && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin className="size-3" />
                            {e.location}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
      <p className="sr-only" aria-live="polite">
        {fa(groups.reduce((n, g) => n + g.list.length, 0))} رویداد در این بازه
      </p>
    </div>
  );
}
