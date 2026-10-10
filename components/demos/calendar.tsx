"use client";

import * as React from "react";
import { addDays, atMinutes, dayKey, formatTimeRange, fromKey, monthTitle, startOfJalaliWeek, type CalendarEvent, type Resource } from "@/lib/calendar-utils";
import { toJalali } from "@/lib/jalali";
import { fa } from "@/lib/utils";
import { EventCalendar } from "@/registry/calendar/event-calendar";
import { MonthView } from "@/registry/calendar/month-view";
import { TimeGrid } from "@/registry/calendar/time-grid";
import { AgendaView } from "@/registry/calendar/agenda-view";
import { YearView } from "@/registry/calendar/year-view";
import { OccasionsList } from "@/registry/calendar/occasions-list";
import { SlotPicker, type SlotValue } from "@/registry/calendar/slot-picker";
import { GanttChart, type GanttTask } from "@/registry/calendar/gantt-chart";
import { ShiftScheduler, type Shift } from "@/registry/calendar/shift-scheduler";
import { CalendarToolbar, DayNumber, OccasionLine, WeekdayHeader, dayInfo, useCalendar, useToday } from "@/registry/calendar/calendar-core";

/* ---------- sample data, built around this week so it always looks current ---------- */

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const sat = startOfJalaliWeek(today);
const key = (offset: number) => dayKey(addDays(sat, offset));
const at = (offset: number, hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return atMinutes(key(offset), h * 60 + m);
};
const ev = (id: string, title: string, day: number, from: string, to: string, color?: number, location?: string): CalendarEvent => ({ id, title, start: at(day, from), end: at(day, to), color, location });
const allDay = (id: string, title: string, from: number, days: number, color?: number): CalendarEvent => ({ id, title, allDay: true, start: addDays(sat, from), end: addDays(sat, from + days), color });

export const sampleEvents: CalendarEvent[] = [
  ev("e1", "جلسه‌ی هفتگی تیم", 0, "10:00", "11:00", 1, "اتاق جلسه‌ی ۲"),
  ev("e2", "دمو برای مشتری", 0, "10:30", "11:30", 4, "گوگل میت"),
  ev("e3", "ناهار کاری", 1, "13:00", "14:00", 3, "کافه‌ی نارنج"),
  ev("e4", "بازبینی کد", 2, "15:00", "16:30", 2),
  allDay("e5", "کارگاه طراحی", 3, 2, 5),
  allDay("e6", "سفر کاری مشهد", 4, 3, 6),
  ev("e7", "تماس با سرمایه‌گذار", 4, "09:00", "09:30", 1),
  ev("e8", "انتشار نسخه‌ی ۲", 5, "11:00", "12:00", 4),
  ev("e9", "گزارش ماهانه", -4, "10:00", "11:00", 2),
  ev("e10", "برنامه‌ریزی فصل", 7, "09:30", "11:00", 1, "دفتر مرکزی"),
  ev("e11", "مصاحبه‌ی استخدام", 9, "14:00", "15:00", 3),
  ev("e12", "دورهمی تیم", 12, "18:00", "21:00", 5, "باغ کتاب"),
  ev("e13", "آموزش ابزار جدید", 8, "16:00", "17:00", 2),
  ev("e14", "پرداخت حقوق", 15, "09:00", "09:30", 7),
  ev("e15", "جمع‌بندی اسپرینت", 14, "11:00", "12:00", 1),
  ev("e16", "مشاوره‌ی حقوقی", -6, "12:00", "13:00", 6),
];

/** Minutes past midnight → booked intervals that look random but are stable per day. */
function busyFor(k: string) {
  const seed = Number(k.slice(-2)) + Number(k.slice(5, 7)) * 3;
  return [600, 690, 960, 1080]
    .filter((_, i) => (seed + i) % 3 === 0)
    .map((m) => ({ start: atMinutes(k, m), end: atMinutes(k, m + 45) }));
}

const sampleTasks: GanttTask[] = [
  { id: "t1", title: "پژوهش کاربران", start: addDays(sat, -10), end: addDays(sat, -4), progress: 1, color: 2, group: "فاز ۱: کشف" },
  { id: "t2", title: "نقشه‌ی سفر کاربر", start: addDays(sat, -3), end: addDays(sat, 0), progress: 1, color: 2, dependsOn: ["t1"], group: "فاز ۱: کشف" },
  { id: "t3", title: "طراحی رابط", start: addDays(sat, 1), end: addDays(sat, 8), progress: 0.55, color: 5, dependsOn: ["t2"], group: "فاز ۲: ساخت" },
  { id: "t4", title: "پیاده‌سازی فرانت", start: addDays(sat, 5), end: addDays(sat, 17), progress: 0.2, color: 1, dependsOn: ["t3"], group: "فاز ۲: ساخت" },
  { id: "t5", title: "API و درگاه پرداخت", start: addDays(sat, 3), end: addDays(sat, 14), progress: 0.35, color: 3, group: "فاز ۲: ساخت" },
  { id: "t6", title: "تست و رفع اشکال", start: addDays(sat, 15), end: addDays(sat, 20), progress: 0, color: 4, dependsOn: ["t4", "t5"], group: "فاز ۳: انتشار" },
  { id: "t7", title: "انتشار", start: addDays(sat, 21), end: addDays(sat, 21), milestone: true, color: 4, dependsOn: ["t6"], group: "فاز ۳: انتشار" },
];

const staff: Resource[] = [
  { id: "s1", title: "سارا احمدی", subtitle: "سرپرستار" },
  { id: "s2", title: "رضا کریمی", subtitle: "پرستار" },
  { id: "s3", title: "مریم حسینی", subtitle: "پرستار" },
  { id: "s4", title: "علی رضایی", subtitle: "بهیار" },
];

const pattern: [string, number, string][] = [
  ["s1", 0, "morning"], ["s1", 1, "morning"], ["s1", 2, "morning"], ["s1", 3, "morning"], ["s1", 4, "morning"],
  ["s2", 0, "evening"], ["s2", 1, "evening"], ["s2", 2, "night"], ["s2", 3, "morning"], ["s2", 5, "evening"], ["s2", 6, "evening"],
  ["s3", 0, "night"], ["s3", 1, "night"], ["s3", 3, "evening"], ["s3", 4, "evening"], ["s3", 5, "night"], ["s3", 6, "night"],
  ["s4", 1, "morning"], ["s4", 1, "evening"], ["s4", 2, "evening"], ["s4", 4, "night"], ["s4", 5, "morning"], ["s4", 6, "morning"],
];
const sampleShifts: Shift[] = pattern.map(([rid, d, type]) => ({ id: `${rid}-${d}-${type}`, resourceId: rid, date: addDays(sat, d), type }));

/* ---------- interactive wrappers ---------- */

function useEvents() {
  const [events, setEvents] = React.useState(sampleEvents);
  const change = (e: CalendarEvent, start: Date, end: Date) => setEvents((list) => list.map((x) => (x.id === e.id ? { ...x, start, end } : x)));
  const create = (start: Date, end: Date) => setEvents((list) => [...list, { id: `new-${start.getTime()}`, title: "رویداد جدید", start, end, color: 1 }]);
  return { events, change, create };
}

function EventCalendarDemo({ view = "month" as const }: { view?: "month" | "week" }) {
  const { events, change, create } = useEvents();
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div className="w-full space-y-2">
      <EventCalendar defaultView={view} events={events} onEventChange={change} onSlotSelect={create} onEventClick={(e) => setLast(`${e.title}، ${formatTimeRange(e.start, e.end)}`)} />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {last ?? "روی زمان خالی در نمای هفته بکشید تا رویداد بسازید، یا رویدادی را جابه‌جا کنید."}
      </p>
    </div>
  );
}

function MonthDemo() {
  const [selected, setSelected] = React.useState(dayKey(today));
  return <MonthView events={sampleEvents} selected={selected} onDayClick={(d) => setSelected(dayKey(d))} />;
}

function TimeGridDemo() {
  const { events, change, create } = useEvents();
  return <TimeGrid events={events} onEventChange={change} onSlotSelect={create} startHour={8} endHour={20} maxHeight={460} />;
}

function YearDemo() {
  const [selected, setSelected] = React.useState<string | undefined>();
  return <YearView events={sampleEvents} selected={selected} onDayClick={(d) => setSelected(dayKey(d))} />;
}

function SlotDemo() {
  const [slot, setSlot] = React.useState<SlotValue>(null);
  return (
    <div className="mx-auto w-full max-w-xl">
      <SlotPicker value={slot} onChange={setSlot} duration={45} hours={{ 0: [["09:00", "13:00"], ["16:00", "20:00"]], 1: [["09:00", "13:00"], ["16:00", "20:00"]], 2: [["09:00", "13:00"], ["16:00", "20:00"]], 3: [["09:00", "13:00"], ["16:00", "20:00"]], 4: [["09:00", "13:00"], ["16:00", "20:00"]], 5: [["09:00", "13:00"]] }} busy={busyFor} />
    </div>
  );
}

function GanttDemo() {
  const [tasks, setTasks] = React.useState(sampleTasks);
  return <GanttChart tasks={tasks} onTaskChange={(t, start, end) => setTasks((list) => list.map((x) => (x.id === t.id ? { ...x, start, end } : x)))} />;
}

function ShiftDemo() {
  const [shifts, setShifts] = React.useState(sampleShifts);
  return <ShiftScheduler resources={staff} shifts={shifts} onShiftsChange={setShifts} />;
}

/** The core's pieces on their own: toolbar, weekday header, day numbers with holidays. */
function CoreDemo() {
  const settings = useCalendar();
  const t = useToday();
  const [week, setWeek] = React.useState(startOfJalaliWeek(t));
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const { jy, jm } = toJalali(days[0]);
  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <CalendarToolbar title={`هفته‌ی ${fa(toJalali(days[0]).jd)} تا ${fa(toJalali(days[6]).jd)}`} subtitle={monthTitle(jy, jm)} onPrev={() => setWeek(addDays(week, -7))} onNext={() => setWeek(addDays(week, 7))} onToday={() => setWeek(startOfJalaliWeek(t))} />
      <div className="rounded-surface border-line bg-card">
        <WeekdayHeader className="border-b" />
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const info = dayInfo(d, settings, t);
            return (
              <div key={info.key} className="flex min-w-0 flex-col items-center gap-1 border-s px-1 py-2 first:border-s-0">
                <DayNumber info={info} />
                <OccasionLine info={info} className="w-full text-center" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const calendarDemos: Record<string, React.ReactNode> = {
  "calendar-core": <CoreDemo />,
  "event-calendar": <EventCalendarDemo />,
  "month-view": <MonthDemo />,
  "time-grid": <TimeGridDemo />,
  "agenda-view": (
    <div className="mx-auto w-full max-w-2xl">
      <AgendaView events={sampleEvents} days={14} />
    </div>
  ),
  "year-view": <YearDemo />,
  "occasions-list": (
    <div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <OccasionsList range="upcoming" limit={6} />
      <OccasionsList range="month" />
    </div>
  ),
  "slot-picker": <SlotDemo />,
  "gantt-chart": <GanttDemo />,
  "shift-scheduler": <ShiftDemo />,
};

/* ---------- card previews: the real components, scaled down ---------- */

function Mini({ children, scale = 0.55 }: { children: React.ReactNode; scale?: number }) {
  return (
    <div className="origin-top-right" style={{ width: `${100 / scale}%`, transform: `scale(${scale})` }}>
      {children}
    </div>
  );
}

const nextWeek = fromKey(key(7));

export const calendarCardDemos: Record<string, React.ReactNode> = {
  "calendar-core": (
    <Mini scale={0.8}>
      <CoreDemo />
    </Mini>
  ),
  "event-calendar": (
    <Mini scale={0.5}>
      <EventCalendar events={sampleEvents} defaultView="week" startHour={9} endHour={14} />
    </Mini>
  ),
  "month-view": (
    <Mini scale={0.5}>
      <MonthView events={sampleEvents} toolbar={false} maxLanes={2} />
    </Mini>
  ),
  "time-grid": (
    <Mini scale={0.5}>
      <TimeGrid events={sampleEvents} toolbar={false} startHour={9} endHour={17} hourHeight={40} />
    </Mini>
  ),
  "agenda-view": (
    <Mini scale={0.7}>
      <AgendaView events={sampleEvents} toolbar={false} days={5} />
    </Mini>
  ),
  "year-view": (
    <Mini scale={0.42}>
      <YearView toolbar={false} events={sampleEvents} columns={6} />
    </Mini>
  ),
  "occasions-list": (
    <Mini scale={0.75}>
      <OccasionsList range="upcoming" limit={4} />
    </Mini>
  ),
  "slot-picker": (
    <Mini scale={0.62}>
      <SlotPicker from={nextWeek} duration={45} busy={busyFor} />
    </Mini>
  ),
  "gantt-chart": (
    <Mini scale={0.5}>
      <GanttChart tasks={sampleTasks} />
    </Mini>
  ),
  "shift-scheduler": (
    <Mini scale={0.5}>
      <ShiftScheduler resources={staff} defaultShifts={sampleShifts} />
    </Mini>
  ),
};
