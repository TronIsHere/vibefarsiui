"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_WEEKDAYS, jalaliWeekday, toJalali } from "@/lib/jalali";
import {
  addDays,
  atMinutes,
  dayKey,
  eventColor,
  formatMinutes,
  formatTimeRange,
  isSpanning,
  layoutSpans,
  layoutTimed,
  minutesOfDay,
  monthTitle,
  shortDay,
  weekDates,
  zonedKey,
  type CalendarEvent,
} from "@/lib/calendar-utils";
import {
  CalendarToolbar,
  DayNumber,
  EventChip,
  OccasionLine,
  dayInfo,
  secondaryMonthTitle,
  useCalendar,
  useControllable,
  useNow,
  useToday,
} from "@/registry/calendar/calendar-core";

export interface TimeGridProps {
  events?: CalendarEvent[];
  /** Any day in the week (or the day) to show (controlled). */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** 7 = week (شنبه to جمعه), 1 = one day. */
  days?: 1 | 7;
  /** Visible hours, 0–24. Default 7 to 22. */
  startHour?: number;
  endHour?: number;
  /** Snap step for selecting and dragging. Default 30. */
  slotMinutes?: number;
  /** Pixels per hour. Default 48. */
  hourHeight?: number;
  /** Max height of the scrolling body. Default 560. */
  maxHeight?: number;
  /** Fired after dragging over empty time. */
  onSlotSelect?: (start: Date, end: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** Turns on drag to move and resize (and Alt+arrows on a focused event). */
  onEventChange?: (event: CalendarEvent, start: Date, end: Date) => void;
  toolbar?: boolean;
  className?: string;
}

type Drag =
  | { kind: "select"; col: number; a: number; b: number }
  | { kind: "move" | "resize"; event: CalendarEvent; col: number; grab: number; start: number; end: number; moved: boolean };

const GUTTER = 52;

/**
 * نمای هفته و روز. Hours run down the right edge, شنبه is the rightmost
 * column, overlapping events sit side by side and a line marks now. Drag over
 * empty time to create; with onEventChange, drag an event to move it or its
 * bottom edge to resize it.
 */
export function TimeGrid({
  events = [],
  date,
  defaultDate,
  onDateChange,
  days = 7,
  startHour = 7,
  endHour = 22,
  slotMinutes = 30,
  hourHeight = 48,
  maxHeight = 560,
  onSlotSelect,
  onEventClick,
  onEventChange,
  toolbar = true,
  className,
}: TimeGridProps) {
  const settings = useCalendar();
  const tz = settings.timeZone;
  const today = useToday();
  const now = useNow();
  const [cursor, setCursor] = useControllable(date, defaultDate ?? today, onDateChange);
  const dates = days === 7 ? weekDates(cursor) : [new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())];
  const keys = dates.map(dayKey);
  const total = (endHour - startHour) * hourHeight;
  const toMin = (y: number) => startHour * 60 + (y / hourHeight) * 60;
  const snap = (m: number) => Math.round(m / slotMinutes) * slotMinutes;
  const indexOf = React.useMemo(() => new Map(events.map((e, i) => [e, i])), [events]);

  const spanning = events.filter((e) => isSpanning(e, tz));
  const timed = events.filter((e) => !isSpanning(e, tz));
  const bars = layoutSpans(spanning, keys, tz);
  const lanes = bars.reduce((n, b) => Math.max(n, b.lane + 1), 0);

  const body = React.useRef<HTMLDivElement>(null);
  const cols = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState<Drag | null>(null);

  React.useEffect(() => {
    const el = body.current;
    if (!el) return;
    const n = new Date();
    const target = (minutesOfDay(n, tz) / 60 - startHour - 1) * hourHeight;
    el.scrollTop = Math.max(0, Math.min(target, total));
    // Only on mount and when the visible hours change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startHour, hourHeight]);

  function pointAt(e: React.PointerEvent) {
    const rect = cols.current!.getBoundingClientRect();
    const colW = rect.width / dates.length;
    // RTL: column 0 is on the right.
    const col = Math.max(0, Math.min(dates.length - 1, Math.floor((rect.right - e.clientX) / colW)));
    const min = Math.max(startHour * 60, Math.min(endHour * 60, toMin(e.clientY - rect.top)));
    return { col, min };
  }

  function onDown(e: React.PointerEvent) {
    if (e.button !== 0 || !onSlotSelect) return;
    const { col, min } = pointAt(e);
    const a = Math.floor(min / slotMinutes) * slotMinutes;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ kind: "select", col, a, b: a + slotMinutes });
  }

  function onEventDown(e: React.PointerEvent, ev: CalendarEvent, col: number, kind: "move" | "resize") {
    e.stopPropagation();
    if (e.button !== 0 || !onEventChange) return;
    const start = minutesOfDay(ev.start, tz);
    const end = start + Math.round((ev.end.getTime() - ev.start.getTime()) / 60_000);
    (cols.current as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ kind, event: ev, col, grab: pointAt(e).min - start, start, end, moved: false });
  }

  function onMove(e: React.PointerEvent) {
    if (!drag) return;
    const { col, min } = pointAt(e);
    if (drag.kind === "select") {
      const b = Math.ceil(min / slotMinutes) * slotMinutes;
      setDrag({ ...drag, b: Math.max(b, drag.a + slotMinutes) });
    } else if (drag.kind === "move") {
      const len = drag.end - drag.start;
      const start = Math.max(startHour * 60, Math.min(endHour * 60 - len, snap(min - drag.grab)));
      setDrag({ ...drag, col, start, end: start + len, moved: true });
    } else {
      setDrag({ ...drag, end: Math.max(drag.start + slotMinutes, snap(min)), moved: true });
    }
  }

  function onUp() {
    if (!drag) return;
    if (drag.kind === "select") onSlotSelect?.(atMinutes(keys[drag.col], drag.a, tz), atMinutes(keys[drag.col], drag.b, tz));
    else if (drag.moved) onEventChange?.(drag.event, atMinutes(keys[drag.col], drag.start, tz), atMinutes(keys[drag.col], drag.end, tz));
    else onEventClick?.(drag.event);
    setDrag(null);
  }

  function onEventKey(e: React.KeyboardEvent, ev: CalendarEvent) {
    if (!onEventChange || !e.altKey) return;
    const ms = e.key === "ArrowDown" ? slotMinutes : e.key === "ArrowUp" ? -slotMinutes : e.key === "ArrowLeft" ? 1440 : e.key === "ArrowRight" ? -1440 : 0;
    if (!ms) return;
    e.preventDefault();
    const d = ms * 60_000;
    onEventChange(ev, new Date(ev.start.getTime() + d), new Date(ev.end.getTime() + d));
  }

  const { jy, jm } = toJalali(dates[0]);
  const title = days === 7 ? `${shortDay(dates[0])} تا ${shortDay(dates[6])} ${fa(toJalali(dates[6]).jy)}` : `${JALALI_WEEKDAYS[jalaliWeekday(dates[0])]} ${shortDay(dates[0])} ${fa(jy)}`;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const nowKey = now ? zonedKey(now, tz) : null;
  const nowMin = now ? minutesOfDay(now, tz) : 0;

  return (
    <div className={cn("w-full", className)}>
      {toolbar && (
        <CalendarToolbar
          className="mb-3"
          title={title}
          subtitle={days === 7 ? monthTitle(jy, jm) : secondaryMonthTitle(jy, jm, settings.secondary)}
          onPrev={() => setCursor(addDays(cursor, -days))}
          onNext={() => setCursor(addDays(cursor, days))}
          onToday={() => setCursor(today)}
          prevLabel={days === 7 ? "هفته‌ی قبل" : "روز قبل"}
          nextLabel={days === 7 ? "هفته‌ی بعد" : "روز بعد"}
        />
      )}
      <div className="overflow-x-auto rounded-surface border-line bg-card">
        <div style={{ minWidth: days === 7 ? 640 : undefined }}>
          {/* day headers */}
          <div className="flex border-b">
            <div className="shrink-0" style={{ width: GUTTER }} />
            <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))` }}>
              {dates.map((d) => {
                const info = dayInfo(d, settings, today);
                return (
                  <div key={info.key} className={cn("flex min-w-0 flex-col items-center gap-0.5 border-s px-1 py-1.5", (info.holiday || info.isWeekend) && "bg-destructive/[0.04]")}>
                    <span className={cn("text-[11px] text-muted-foreground", (info.holiday || info.isWeekend) && "text-destructive/80")}>{JALALI_WEEKDAYS[jalaliWeekday(d)]}</span>
                    <DayNumber info={info} />
                    <OccasionLine info={info} className="w-full text-center" />
                  </div>
                );
              })}
            </div>
          </div>
          {/* all-day lane */}
          {lanes > 0 && (
            <div className="flex border-b">
              <div className="shrink-0 self-center px-1 text-center text-[10px] text-muted-foreground" style={{ width: GUTTER }}>
                تمام روز
              </div>
              <div className="relative flex-1 border-s" style={{ height: lanes * 24 + 4 }}>
                {bars.map((b) => (
                  <div key={b.event.id} className="absolute px-0.5" style={{ insetInlineStart: `${(b.from / dates.length) * 100}%`, width: `${((b.to - b.from + 1) / dates.length) * 100}%`, top: 2 + b.lane * 24, height: 22 }}>
                    <EventChip event={b.event} index={indexOf.get(b.event)} compact onClick={() => onEventClick?.(b.event)} className={cn("h-full justify-center", b.continuesBefore && "rounded-s-none", b.continuesAfter && "rounded-e-none")} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* timed body */}
          <div ref={body} className="overflow-y-auto" style={{ maxHeight }}>
            <div className="flex" style={{ height: total }}>
              <div className="relative shrink-0" style={{ width: GUTTER }} aria-hidden>
                {hours.map((h, i) => (
                  <span key={h} className="absolute inset-x-0 -translate-y-1/2 text-center text-[10px] text-muted-foreground tabular-nums" style={{ top: i * hourHeight }}>
                    {i === 0 ? "" : formatMinutes(h * 60)}
                  </span>
                ))}
              </div>
              <div
                ref={cols}
                className={cn("relative grid flex-1 touch-none select-none", onSlotSelect && "cursor-crosshair")}
                style={{ gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`, backgroundImage: `repeating-linear-gradient(to bottom, var(--color-border) 0 1px, transparent 1px ${hourHeight}px)` }}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={() => setDrag(null)}
              >
                {dates.map((d, c) => {
                  const key = keys[c];
                  const info = dayInfo(d, settings, today);
                  const boxes = layoutTimed(timed, key, tz, { startHour, endHour });
                  return (
                    <div key={key} className={cn("relative border-s", (info.holiday || info.isWeekend) && "bg-destructive/[0.04]")} aria-label={info.label}>
                      {boxes.map((b) => {
                        const dragging = drag && drag.kind !== "select" && drag.event.id === b.event.id;
                        return (
                          <div
                            key={b.event.id}
                            className={cn("absolute px-px", dragging && "opacity-40")}
                            style={{ top: b.top * total, height: Math.max(18, b.height * total - 2), insetInlineStart: `${(b.col / b.cols) * 100}%`, width: `${100 / b.cols}%` }}
                          >
                            <EventChip
                              event={b.event}
                              index={indexOf.get(b.event)}
                              showTime={b.height * total > 36}
                              timeZone={tz}
                              compact={b.height * total < 36}
                              aria-label={`${b.event.title}، ${formatTimeRange(b.event.start, b.event.end, tz)}`}
                              onPointerDown={(e) => onEventDown(e, b.event, c, "move")}
                              onClick={onEventChange ? undefined : () => onEventClick?.(b.event)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && onEventChange) onEventClick?.(b.event);
                                onEventKey(e, b.event);
                              }}
                              className={cn("h-full justify-start", onEventChange && "cursor-grab active:cursor-grabbing")}
                            />
                            {onEventChange && (
                              <span
                                aria-hidden
                                onPointerDown={(e) => onEventDown(e, b.event, c, "resize")}
                                className="absolute inset-x-1 bottom-0 h-1.5 cursor-ns-resize rounded-full hover:bg-foreground/20"
                              />
                            )}
                          </div>
                        );
                      })}
                      {nowKey === key && nowMin >= startHour * 60 && nowMin <= endHour * 60 && (
                        <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: ((nowMin - startHour * 60) / 60) * hourHeight }}>
                          <span className="size-2 -translate-x-1/2 rounded-full bg-destructive rtl:translate-x-1/2" />
                          <span className="h-px flex-1 bg-destructive" />
                        </div>
                      )}
                    </div>
                  );
                })}
                {drag && drag.kind === "select" && (
                  <div
                    className="pointer-events-none absolute rounded-control border-2 border-dashed border-primary bg-primary/10 px-1 text-[10px] tabular-nums"
                    style={{ insetInlineStart: `${(drag.col / dates.length) * 100}%`, width: `${100 / dates.length}%`, top: ((drag.a - startHour * 60) / 60) * hourHeight, height: ((drag.b - drag.a) / 60) * hourHeight }}
                  >
                    {formatMinutes(drag.a)} تا {formatMinutes(drag.b)}
                  </div>
                )}
                {drag && drag.kind !== "select" && drag.moved && (
                  <div
                    className="pointer-events-none absolute z-20 px-px"
                    style={{ insetInlineStart: `${(drag.col / dates.length) * 100}%`, width: `${100 / dates.length}%`, top: ((drag.start - startHour * 60) / 60) * hourHeight, height: ((drag.end - drag.start) / 60) * hourHeight }}
                  >
                    <div className="flex h-full flex-col rounded-control border-s-[3px] px-2 py-1 text-xs shadow-overlay" style={{ borderColor: eventColor(drag.event.color, indexOf.get(drag.event) ?? 0), background: `color-mix(in oklch, ${eventColor(drag.event.color, indexOf.get(drag.event) ?? 0)} 30%, var(--color-card))` }}>
                      <span className="truncate font-medium">{drag.event.title}</span>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        {formatMinutes(drag.start)} تا {formatMinutes(drag.end)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
