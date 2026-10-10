"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { toGregorian, toJalali } from "@/lib/jalali";
import { addJalaliMonths, dayKey, eventColor, formatTime, fromKey, layoutSpans, monthGrid, monthTitle, shortDay, type CalendarEvent } from "@/lib/calendar-utils";
import { Popover } from "@/registry/ui/popover";
import {
  CalendarToolbar,
  DayNumber,
  EventChip,
  OccasionLine,
  WeekdayHeader,
  dayInfo,
  secondaryMonthTitle,
  useCalendar,
  useControllable,
  useRovingDays,
  useToday,
  useWidth,
  type DayInfo,
} from "@/registry/calendar/calendar-core";

export interface MonthViewProps {
  events?: CalendarEvent[];
  /** Any day in the month to show (controlled). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Selected day key "YYYY-MM-DD". */
  selected?: string;
  onDayClick?: (date: Date, info: DayInfo) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** Event rows per week before «+۲ مورد دیگر». Default 3. */
  maxLanes?: number;
  /** Always six weeks, so the height never jumps. Default true. */
  fixedWeeks?: boolean;
  /** Show the built-in title and arrows. EventCalendar turns this off. */
  toolbar?: boolean;
  className?: string;
}

const HEAD = 46;
const LANE = 22;

/**
 * نمای ماه. A Jalali month with multi-day events drawn as bars across the
 * week (right to left), holidays named in their cell and overflow behind
 * «+۲ مورد دیگر». Below ~560px the bars turn into colored dots.
 */
export function MonthView({ events = [], month, defaultMonth, onMonthChange, selected, onDayClick, onEventClick, maxLanes = 3, fixedWeeks = true, toolbar = true, className }: MonthViewProps) {
  const settings = useCalendar();
  const today = useToday();
  const [cursor, setCursor] = useControllable(month, defaultMonth ?? today, onMonthChange);
  const { jy, jm } = toJalali(cursor);
  const weeks = React.useMemo(() => monthGrid(jy, jm, { fixedWeeks }), [jy, jm, fixedWeeks]);
  const [box, width] = useWidth<HTMLDivElement>();
  const compact = width > 0 && width < 560;
  const indexOf = React.useMemo(() => new Map(events.map((e, i) => [e, i])), [events]);

  const { container: gridRef, focusKey, setFocusKey, onKeyDown: onGridKey } = useRovingDays(selected ?? dayKey(today), (k) => {
    const j = toJalali(fromKey(k));
    if (j.jy !== jy || j.jm !== jm) setCursor(fromKey(k));
  });
  const firstKey = dayKey(toGregorian(jy, jm, 1));
  // Below ~560px cells have no room for names, so the month's occasions are listed under the grid.
  const monthOccasions = compact && settings.occasions ? weeks.flat().filter((d) => toJalali(d).jm === jm).flatMap((d) => settings.occasions!(dayKey(d))) : [];
  const visible = new Set(weeks.flat().map(dayKey));
  const tabKey = visible.has(focusKey) && toJalali(fromKey(focusKey)).jm === jm ? focusKey : selected && visible.has(selected) ? selected : firstKey;

  return (
    <div ref={box} className={cn("w-full", className)}>
      {toolbar && (
        <CalendarToolbar
          className="mb-3"
          title={monthTitle(jy, jm)}
          subtitle={secondaryMonthTitle(jy, jm, settings.secondary)}
          onPrev={() => setCursor(addJalaliMonths(cursor, -1))}
          onNext={() => setCursor(addJalaliMonths(cursor, 1))}
          onToday={() => setCursor(today)}
          prevLabel="ماه قبل"
          nextLabel="ماه بعد"
        />
      )}
      <div className="overflow-hidden rounded-surface border-line bg-card">
        <WeekdayHeader short={compact} className="border-b bg-muted/40" />
        <div ref={gridRef} role="grid" aria-label={monthTitle(jy, jm)} onKeyDown={onGridKey}>
          {weeks.map((week, r) => {
            const keys = week.map(dayKey);
            const bars = layoutSpans(events, keys, settings.timeZone);
            const lanes = compact ? 0 : maxLanes;
            const hidden = keys.map((_, c) => bars.filter((b) => b.lane >= lanes && b.from <= c && b.to >= c));
            return (
              <div key={keys[0]} role="row" className={cn("relative grid grid-cols-7", r > 0 && "border-t")}>
                {week.map((date, c) => {
                  const info = dayInfo(date, settings, today);
                  const outside = toJalali(date).jm !== jm;
                  const dayBars = bars.filter((b) => b.from <= c && b.to >= c);
                  return (
                    <div
                      key={info.key}
                      className={cn("relative flex flex-col", c > 0 && "border-s", (info.holiday || info.isWeekend) && "bg-destructive/[0.04]")}
                      style={{ minHeight: compact ? 64 : HEAD + lanes * LANE + 20 }}
                    >
                      <button
                        type="button"
                        role="gridcell"
                        data-key={info.key}
                        tabIndex={info.key === tabKey ? 0 : -1}
                        aria-selected={selected === info.key}
                        aria-label={info.label + (dayBars.length ? `، ${fa(dayBars.length)} رویداد` : "")}
                        onClick={() => {
                          setFocusKey(info.key);
                          onDayClick?.(date, info);
                        }}
                        className="absolute inset-0 cursor-pointer outline-none transition-colors hover:bg-accent/50 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      />
                      <div className="pointer-events-none relative flex flex-col items-center px-1 pt-1.5" style={{ height: compact ? undefined : HEAD }}>
                        <DayNumber info={info} outside={outside} selected={selected === info.key} size={compact ? "sm" : "md"} />
                        {!compact && <OccasionLine info={info} className={cn("w-full text-center", outside && "opacity-40")} />}
                      </div>
                      {compact && dayBars.length > 0 && (
                        <div className="pointer-events-none relative mt-1 flex justify-center gap-0.5" aria-hidden>
                          {dayBars.slice(0, 3).map((b) => (
                            <span key={b.event.id} className="size-1.5 rounded-full" style={{ background: eventColor(b.event.color, indexOf.get(b.event) ?? 0) }} />
                          ))}
                        </div>
                      )}
                      {hidden[c].length > 0 && !compact && (
                        <div className="relative mt-auto px-1 pb-1 [&>div]:block [&>div>span]:flex">
                          <Popover
                            align="start"
                            trigger={
                              <span
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key !== "Enter" && e.key !== " ") return;
                                  e.preventDefault();
                                  e.currentTarget.click();
                                }}
                                className="block w-full cursor-pointer truncate rounded-control px-1 text-start text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground">
                                +{fa(hidden[c].length)} مورد دیگر
                              </span>
                            }
                          >
                            <div className="w-56 space-y-1">
                              <p className="px-1 pb-1 text-xs font-semibold">{info.label.split("،")[0]}</p>
                              {dayBars.map((b) => (
                                <EventChip key={b.event.id} event={b.event} index={indexOf.get(b.event)} showTime timeZone={settings.timeZone} onClick={() => onEventClick?.(b.event)} />
                              ))}
                            </div>
                          </Popover>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!compact && (
                  <div className="pointer-events-none absolute inset-x-0" style={{ top: HEAD }}>
                    {bars
                      .filter((b) => b.lane < lanes)
                      .map((b) => {
                        const timed = !b.event.allDay && b.from === b.to && !b.continuesBefore && !b.continuesAfter;
                        return (
                          <div
                            key={b.event.id}
                            className="pointer-events-auto absolute px-0.5"
                            style={{ insetInlineStart: `${(b.from / 7) * 100}%`, width: `${((b.to - b.from + 1) / 7) * 100}%`, top: b.lane * LANE, height: LANE - 2 }}
                          >
                            <EventChip
                              event={b.event}
                              index={indexOf.get(b.event)}
                              compact
                              tabIndex={-1}
                              aria-label={`${b.event.title}${timed ? `، ساعت ${formatTime(b.event.start, settings.timeZone)}` : ""}`}
                              onClick={() => onEventClick?.(b.event)}
                              lead={timed ? formatTime(b.event.start, settings.timeZone) : undefined}
                              className={cn("h-full justify-center", b.continuesBefore && "rounded-s-none", b.continuesAfter && "rounded-e-none")}
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {compact && monthOccasions.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-[11px]">
          {monthOccasions.map((o) => (
            <li key={o.key + o.title} className={cn("flex gap-2", o.holiday ? "text-destructive" : "text-muted-foreground")}>
              <span className="w-12 shrink-0 tabular-nums">{shortDay(o.date)}</span>
              <span className="truncate">
                {o.title}
                {o.approximate && " (تقریبی)"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
