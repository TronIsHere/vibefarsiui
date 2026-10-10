"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_WEEKDAYS, jalaliWeekday, toJalali } from "@/lib/jalali";
import { addDays, addJalaliMonths, monthTitle, shortDay, weekDates, type CalendarEvent } from "@/lib/calendar-utils";
import type { OccasionProvider } from "@/lib/iran-holidays";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { CalendarProvider, CalendarToolbar, secondaryMonthTitle, useControllable, useToday, type CalendarView, type Secondary } from "@/registry/calendar/calendar-core";
import { MonthView } from "@/registry/calendar/month-view";
import { TimeGrid } from "@/registry/calendar/time-grid";
import { AgendaView } from "@/registry/calendar/agenda-view";

const VIEW_LABELS: Record<CalendarView, string> = { month: "ماه", week: "هفته", day: "روز", agenda: "فهرست" };
const AGENDA_DAYS = 14;

export interface EventCalendarProps {
  events?: CalendarEvent[];
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** The day the views are centred on (controlled). */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** Which views the switcher offers, in order. */
  views?: CalendarView[];
  timeZone?: string;
  /** Built-in Iranian holidays by default; your own provider, or false. */
  occasions?: OccasionProvider | false;
  secondary?: Secondary;
  weekend?: number[];
  startHour?: number;
  endHour?: number;
  slotMinutes?: number;
  onSlotSelect?: (start: Date, end: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventChange?: (event: CalendarEvent, start: Date, end: Date) => void;
  /** Clicking a day in the month view. Default: open that day. */
  onDayClick?: (date: Date) => void;
  className?: string;
}

/**
 * تقویم رویدادها. One component with month, week, day and list views, a
 * shared toolbar and Iranian holidays. Every view is also its own component
 * (MonthView, TimeGrid, AgendaView) if you only need one.
 */
export function EventCalendar({
  events = [],
  view,
  defaultView = "month",
  onViewChange,
  date,
  defaultDate,
  onDateChange,
  views = ["month", "week", "day", "agenda"],
  timeZone,
  occasions,
  secondary = "hijri",
  weekend,
  startHour,
  endHour,
  slotMinutes,
  onSlotSelect,
  onEventClick,
  onEventChange,
  onDayClick,
  className,
}: EventCalendarProps) {
  const today = useToday();
  const [current, setView] = useControllable(view, defaultView, onViewChange);
  const [cursor, setCursor] = useControllable(date, defaultDate ?? today, onDateChange);

  const step = (dir: 1 | -1) =>
    setCursor(current === "month" ? addJalaliMonths(cursor, dir) : addDays(cursor, dir * (current === "week" ? 7 : current === "day" ? 1 : AGENDA_DAYS)));

  const { jy, jm } = toJalali(cursor);
  const week = weekDates(cursor);
  const title =
    current === "month" ? monthTitle(jy, jm)
    : current === "week" ? `${shortDay(week[0])} تا ${shortDay(week[6])} ${fa(toJalali(week[6]).jy)}`
    : current === "day" ? `${JALALI_WEEKDAYS[jalaliWeekday(cursor)]} ${shortDay(cursor)} ${fa(jy)}`
    : `${shortDay(cursor)} تا ${shortDay(addDays(cursor, AGENDA_DAYS - 1))}`;
  const subtitle = current === "month" || current === "day" ? secondaryMonthTitle(jy, jm, secondary) : monthTitle(jy, jm);

  const shared = { events, date: cursor, onDateChange: setCursor, toolbar: false, onEventClick };
  const grid = { startHour, endHour, slotMinutes, onSlotSelect, onEventChange };

  return (
    <CalendarProvider timeZone={timeZone} occasions={occasions} secondary={secondary} weekend={weekend}>
      <div className={cn("w-full space-y-3", className)}>
        <CalendarToolbar
          title={title}
          subtitle={subtitle}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToday={() => setCursor(today)}
          prevLabel="قبلی"
          nextLabel="بعدی"
        >
          {views.length > 1 && (
            <SegmentedControl size="sm" aria-label="نما" value={current} onChange={(v) => setView(v as CalendarView)} options={views.map((v) => ({ value: v, label: VIEW_LABELS[v] }))} />
          )}
        </CalendarToolbar>
        {current === "month" && (
          <MonthView
            events={events}
            month={cursor}
            onMonthChange={setCursor}
            toolbar={false}
            onEventClick={onEventClick}
            onDayClick={(d) => {
              if (onDayClick) onDayClick(d);
              else if (views.includes("day")) {
                setCursor(d);
                setView("day");
              }
            }}
          />
        )}
        {current === "week" && <TimeGrid {...shared} {...grid} days={7} />}
        {current === "day" && <TimeGrid {...shared} {...grid} days={1} />}
        {current === "agenda" && <AgendaView {...shared} days={AGENDA_DAYS} />}
      </div>
    </CalendarProvider>
  );
}
