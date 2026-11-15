"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import { addDays, atMinutes, dayKey, eventColor, formatDuration, formatMinutes, formatTimeRange, minutesOfDay, zonedKey, type CalendarEvent, type Resource } from "@/lib/calendar-utils";
import { CalendarToolbar, useCalendar, useControllable, useDayInfo, useNow, useToday } from "@/registry/calendar/calendar-core";

export interface ResourceTimelineProps {
  /** Rooms, people, cars, tables: each one is a row. */
  resources: Resource[];
  /** Events with a `resourceId`. Events of other days are ignored. */
  events: CalendarEvent[];
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Visible hours. Default 8 to 20. */
  startHour?: number;
  endHour?: number;
  /** Width of one hour in px. Default 88. */
  hourWidth?: number;
  /** Width of the resource column on the right. Default 180. */
  resourceWidth?: number;
  onEventClick?: (event: CalendarEvent) => void;
  /** Turns empty time into buttons, one per `slotMinutes`. */
  onSlotClick?: (resourceId: string, start: Date, end: Date) => void;
  slotMinutes?: number;
  /** Booked hours and share of the day under each resource. Default true. */
  showLoad?: boolean;
  toolbar?: boolean;
  className?: string;
}

type Placed = { event: CalendarEvent; from: number; to: number; lane: number; index: number };

/** Clips events to the visible hours of the day and stacks overlaps into lanes. */
function place(events: CalendarEvent[], key: string, startMin: number, endMin: number, tz: string): { items: Placed[]; lanes: number } {
  const lo = atMinutes(key, startMin, tz).getTime();
  const hi = atMinutes(key, endMin, tz).getTime();
  const items = events
    .map((event, index) => ({ event, index, s: Math.max(lo, event.start.getTime()), e: Math.min(hi, event.end.getTime()) }))
    .filter((x) => !x.event.allDay && x.e > x.s)
    .sort((a, b) => a.s - b.s || b.e - a.e);
  const ends: number[] = [];
  const out: Placed[] = [];
  for (const x of items) {
    let lane = ends.findIndex((end) => end <= x.s);
    if (lane < 0) { lane = ends.length; ends.push(0); }
    ends[lane] = x.e;
    out.push({ event: x.event, index: x.index, lane, from: startMin + (x.s - lo) / 60_000, to: startMin + (x.e - lo) / 60_000 });
  }
  return { items: out, lanes: Math.max(1, ends.length) };
}

/**
 * تایم‌لاین منابع. One day for many rooms, people or cars: resources down the right,
 * hours running right to left, bookings as bars with overlaps stacked, free time
 * clickable, a now line and each resource's load for the day.
 */
export function ResourceTimeline({
  resources,
  events,
  date,
  defaultDate,
  onDateChange,
  startHour = 8,
  endHour = 20,
  hourWidth = 88,
  resourceWidth = 180,
  onEventClick,
  onSlotClick,
  slotMinutes = 30,
  showLoad = true,
  toolbar = true,
  className,
}: ResourceTimelineProps) {
  const { timeZone } = useCalendar();
  const today = useToday();
  const now = useNow();
  const [day, setDay] = useControllable(date, defaultDate ?? today, onDateChange);
  const key = dayKey(day);
  const info = useDayInfo(day);
  const startMin = startHour * 60;
  const endMin = endHour * 60;
  const span = endMin - startMin;
  const trackW = (span / 60) * hourWidth;
  const px = (min: number) => ((min - startMin) / 60) * hourWidth;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const nowMin = now && zonedKey(now, timeZone) === key ? minutesOfDay(now, timeZone) : null;
  const laneH = 34;

  /** Start of the first slot that is neither past nor booked, in minutes. */
  const firstFree = (items: Placed[]) => {
    for (let a = startMin; a + slotMinutes <= endMin; a += slotMinutes) {
      if (now && atMinutes(key, a + slotMinutes, timeZone) < now) continue;
      if (!items.some((p) => p.from < a + slotMinutes && p.to > a)) return a;
    }
    return null;
  };

  const rows = resources.map((r) => {
    const mine = events.filter((e) => e.resourceId === r.id);
    const { items, lanes } = place(mine, key, startMin, endMin, timeZone);
    // Busy minutes without double counting overlaps.
    let busy = 0, edge = -Infinity;
    for (const p of [...items].sort((a, b) => a.from - b.from)) {
      if (p.to > edge) { busy += p.to - Math.max(p.from, edge); edge = p.to; }
    }
    return { r, items, lanes, busy };
  });
  const total = rows.reduce((n, x) => n + x.items.length, 0);

  return (
    <div className={cn("w-full space-y-3", className)}>
      {toolbar && (
        <CalendarToolbar
          title={formatJalali(day, { weekday: true })}
          subtitle={info.holiday ? `تعطیل: ${info.holiday.title}` : `${fa(total)} رزرو در ${fa(resources.length)} منبع`}
          onPrev={() => setDay(addDays(day, -1))}
          onNext={() => setDay(addDays(day, 1))}
          onToday={() => setDay(today)}
          prevLabel="روز قبل"
          nextLabel="روز بعد"
        />
      )}
      <div className="overflow-x-auto rounded-surface border-line border-border bg-card">
        <div style={{ width: resourceWidth + trackW }} className="relative">
          {/* hours header */}
          <div aria-hidden className="sticky top-0 z-20 flex border-b border-border bg-card">
            <div style={{ width: resourceWidth }} className="sticky start-0 z-10 shrink-0 border-e border-border bg-card px-3 py-2 text-[11px] font-medium text-muted-foreground">منبع</div>
            {hours.map((h) => (
              <div key={h} style={{ width: hourWidth }} className="shrink-0 border-e border-border/60 px-1.5 py-2 text-[11px] tabular-nums text-muted-foreground">
                {formatMinutes(h * 60)}
              </div>
            ))}
          </div>

          {rows.map(({ r, items, lanes, busy }) => {
            const h = Math.max(52, lanes * laneH + 12);
            const free = onSlotClick ? firstFree(items) : null;
            return (
              <div key={r.id} role="group" aria-label={`${r.title}، ${items.length ? `${formatDuration(Math.round(busy))} رزرو` : "بدون رزرو"}`} className="flex border-b border-border last:border-b-0">
                <div style={{ width: resourceWidth, height: h }} className="sticky start-0 z-10 flex shrink-0 items-center gap-2.5 border-e border-border bg-card px-3">
                  {r.avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    {showLoad ? (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                          <span className="block h-full rounded-full bg-primary" style={{ width: `${(busy / span) * 100}%` }} />
                        </span>
                        <span className="text-[10px] tabular-nums text-muted-foreground">{fa(Math.round((busy / span) * 100))}٪</span>
                      </div>
                    ) : r.subtitle && <p className="truncate text-[11px] text-muted-foreground">{r.subtitle}</p>}
                  </div>
                  {free !== null && (
                    <button
                      type="button"
                      aria-label={`رزرو ${r.title} از ساعت ${formatMinutes(free)}`}
                      title={`اولین زمان آزاد: ${formatMinutes(free)}`}
                      onClick={() => onSlotClick?.(r.id, atMinutes(key, free, timeZone), atMinutes(key, free + slotMinutes, timeZone))}
                      className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative shrink-0" style={{ width: trackW, height: h }}>
                  {/* hour lines, and free slots as buttons when booking is on */}
                  <div className="absolute inset-0 flex">
                    {onSlotClick
                      ? Array.from({ length: span / slotMinutes }, (_, i) => {
                          const a = startMin + i * slotMinutes;
                          const past = now ? atMinutes(key, a + slotMinutes, timeZone) < now : false;
                          return (
                            <button
                              key={a}
                              type="button"
                              tabIndex={-1}
                              aria-hidden
                              disabled={past}
                              onClick={() => onSlotClick(r.id, atMinutes(key, a, timeZone), atMinutes(key, a + slotMinutes, timeZone))}
                              style={{ width: (slotMinutes / 60) * hourWidth }}
                              className={cn("h-full shrink-0 border-border/60 transition-colors", (a + slotMinutes) % 60 === 0 ? "border-e" : "border-e border-dashed border-e-border/30", past ? "cursor-not-allowed bg-muted/40" : "cursor-pointer hover:bg-primary/5")}
                            />
                          );
                        })
                      : hours.map((hh) => <div key={hh} style={{ width: hourWidth }} className="h-full shrink-0 border-e border-border/60" />)}
                  </div>

                  {items.map(({ event, from, to, lane, index }) => {
                    const color = eventColor(event.color, index);
                    const wide = px(to) - px(from) > 70;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onEventClick?.(event)}
                        aria-label={`${event.title}، ${formatTimeRange(event.start, event.end, timeZone)}`}
                        title={`${event.title}، ${formatTimeRange(event.start, event.end, timeZone)}`}
                        style={{ insetInlineStart: px(from) + 1, width: Math.max(6, px(to) - px(from) - 2), top: 6 + lane * laneH, height: laneH - 4, "--ev": color } as React.CSSProperties}
                        className="absolute z-[1] flex min-w-0 cursor-pointer flex-col justify-center overflow-hidden rounded-control border-s-[3px] border-[var(--ev)] bg-[color-mix(in_oklch,var(--ev)_18%,var(--card))] px-1.5 text-start text-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--ev)_28%,var(--card))] focus-visible:z-[3] focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="w-full truncate text-[11px] font-medium leading-4">{event.title}</span>
                        {wide && <span className="w-full truncate text-[10px] leading-3 tabular-nums text-muted-foreground">{formatTimeRange(event.start, event.end, timeZone)}</span>}
                      </button>
                    );
                  })}

                  {nowMin !== null && nowMin >= startMin && nowMin <= endMin && (
                    <div className="pointer-events-none absolute inset-y-0 z-[2] w-0.5 bg-destructive" style={{ insetInlineStart: px(nowMin) - 1 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
