/**
 * Calendar math for the VibeFarsi calendar kit: Jalali day arithmetic, month
 * grids, time-zone parts, Persian time formats, overlap layout for events,
 * multi-day lanes, booking slots and a right-to-left time scale.
 *
 * Two kinds of value: a calendar day is a key "YYYY-MM-DD" (Gregorian, Latin
 * digits, from the local y/m/d of a Date); a timed event is an instant shown
 * in a time zone (default Asia/Tehran) through Intl. Dependency-free and
 * framework-free, so it is easy to test.
 */
import { fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS, jalaliMonthLength, jalaliWeekday, toGregorian, toJalali } from "@/lib/jalali";

export const TEHRAN = "Asia/Tehran";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  /** 1–7 picks var(--chart-N); any other string is used as a CSS color. */
  color?: number | string;
  resourceId?: string;
  location?: string;
};

export type Resource = { id: string; title: string; subtitle?: string; avatar?: string };

/* ---------- calendar days ---------- */

const pad = (n: number) => String(n).padStart(2, "0");
const DAY = 86_400_000;

/** "2026-10-12" for the local calendar day of `date`. */
export function dayKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight of a day key. */
export function fromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
}

/** Whole calendar days from `a` to `b` (positive when b is later). */
export function diffDays(a: Date, b: Date) {
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  return !!a && !!b && dayKey(a) === dayKey(b);
}

/** The شنبه that starts the week of `date`. */
export function startOfJalaliWeek(date: Date) {
  return addDays(date, -jalaliWeekday(date));
}

/** Seven days, شنبه to جمعه. */
export function weekDates(date: Date) {
  const s = startOfJalaliWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(s, i));
}

/** Moves by Jalali months; day 31 clamps to the month's last day. */
export function addJalaliMonths(date: Date, n: number) {
  const { jy, jm, jd } = toJalali(date);
  const total = jy * 12 + (jm - 1) + n;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return toGregorian(y, m, Math.min(jd, jalaliMonthLength(y, m)));
}

/** Weeks (rows of 7 dates, شنبه first) covering a Jalali month, with neighbour days filling the edges. */
export function monthGrid(jy: number, jm: number, { fixedWeeks = false } = {}) {
  const first = toGregorian(jy, jm, 1);
  const start = startOfJalaliWeek(first);
  const used = jalaliWeekday(first) + jalaliMonthLength(jy, jm);
  const rows = fixedWeeks ? 6 : Math.ceil(used / 7);
  return Array.from({ length: rows }, (_, r) => Array.from({ length: 7 }, (_, c) => addDays(start, r * 7 + c)));
}

/** «مهر ۱۴۰۵» */
export function monthTitle(jy: number, jm: number) {
  return `${JALALI_MONTHS[jm - 1]} ${fa(jy)}`;
}

/** «۱۲ مهر» */
export function shortDay(date: Date) {
  const { jm, jd } = toJalali(date);
  return `${fa(jd)} ${JALALI_MONTHS[jm - 1]}`;
}

/** «امروز»، «فردا»، «دیروز» or «چهارشنبه ۲۳ مهر». */
export function dayLabel(date: Date, today = new Date()) {
  const d = diffDays(today, date);
  if (d === 0) return "امروز";
  if (d === 1) return "فردا";
  if (d === -1) return "دیروز";
  return `${JALALI_WEEKDAYS[jalaliWeekday(date)]} ${shortDay(date)}`;
}

/* ---------- time zones ---------- */

const formatters = new Map<string, Intl.DateTimeFormat>();
function formatter(tz: string) {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" });
    formatters.set(tz, f);
  }
  return f;
}

export type ZonedParts = { y: number; m: number; d: number; h: number; min: number };

/** Wall-clock parts of an instant in a time zone. */
export function zonedParts(date: Date, tz = TEHRAN): ZonedParts {
  const p: Record<string, number> = {};
  for (const { type, value } of formatter(tz).formatToParts(date)) if (type !== "literal") p[type] = Number(value);
  return { y: p.year, m: p.month, d: p.day, h: p.hour % 24, min: p.minute };
}

function offsetAt(ms: number, tz: string) {
  const p = zonedParts(new Date(ms), tz);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - Math.floor(ms / 60_000) * 60_000;
}

/** The instant whose wall clock in `tz` reads y-m-d h:min. Handles past DST rules. */
export function zonedDate(y: number, m: number, d: number, h = 0, min = 0, tz = TEHRAN) {
  const guess = Date.UTC(y, m - 1, d, h, min);
  let ms = guess - offsetAt(guess, tz);
  const again = guess - offsetAt(ms, tz);
  if (again !== ms) ms = again;
  return new Date(ms);
}

/** Day key of an instant as seen in `tz`. */
export function zonedKey(date: Date, tz = TEHRAN) {
  const p = zonedParts(date, tz);
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

/** Minutes since midnight in `tz`. */
export function minutesOfDay(date: Date, tz = TEHRAN) {
  const p = zonedParts(date, tz);
  return p.h * 60 + p.min;
}

/** Instant at `minutes` past midnight of a day key in `tz`. Minutes may exceed 1440. */
export function atMinutes(key: string, minutes: number, tz = TEHRAN) {
  const [y, m, d] = key.split("-").map(Number);
  return zonedDate(y, m, d + Math.floor(minutes / 1440), Math.floor((minutes % 1440) / 60), minutes % 60, tz);
}

/** "09:30" → 570 */
export function parseHm(hm: string) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/* ---------- formats ---------- */

/** «۰۹:۳۰» from minutes since midnight. */
export function formatMinutes(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return fa(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
}

/** «۱۴:۳۰» */
export function formatTime(date: Date, tz = TEHRAN) {
  return formatMinutes(minutesOfDay(date, tz));
}

/** «۱۰:۰۰ تا ۱۱:۳۰» */
export function formatTimeRange(start: Date, end: Date, tz = TEHRAN) {
  return `${formatTime(start, tz)} تا ${formatTime(end, tz)}`;
}

/** «۱ ساعت و ۳۰ دقیقه»، «۴۵ دقیقه»، «۲ ساعت» */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${fa(m)} دقیقه`;
  return m ? `${fa(h)} ساعت و ${fa(m)} دقیقه` : `${fa(h)} ساعت`;
}

/** Same slots as the chart kit, so events and charts share a design system's palette. */
export const EVENT_COLORS = [
  "var(--chart-1, var(--brand))",
  "var(--chart-2, oklch(0.66 0.14 250))",
  "var(--chart-3, oklch(0.7 0.14 165))",
  "var(--chart-4, oklch(0.65 0.19 20))",
  "var(--chart-5, oklch(0.62 0.16 300))",
  "var(--chart-6, oklch(0.75 0.11 200))",
  "var(--chart-7, oklch(0.6 0.03 260))",
];

/** CSS color for an event: 1–7 → palette slot; strings pass through; missing → slot by index. */
export function eventColor(color: CalendarEvent["color"], fallbackIndex = 0) {
  if (typeof color === "string") return color;
  const n = typeof color === "number" ? color - 1 : fallbackIndex;
  return EVENT_COLORS[((n % 7) + 7) % 7];
}

/* ---------- layout: timed events in a day column ---------- */

export type TimedBox<T> = {
  event: T;
  /** Minutes since midnight, clipped to the visible range. */
  start: number;
  end: number;
  /** 0–1 fractions of the visible range. */
  top: number;
  height: number;
  col: number;
  cols: number;
  /** Starts before or ends after this day. */
  clippedStart: boolean;
  clippedEnd: boolean;
};

/**
 * Places the timed events of one day side by side where they overlap. Each
 * cluster of transitively overlapping events shares a column count.
 */
export function layoutTimed<T extends Pick<CalendarEvent, "start" | "end" | "allDay">>(
  events: T[],
  key: string,
  tz = TEHRAN,
  { startHour = 0, endHour = 24, minMinutes = 15 } = {},
): TimedBox<T>[] {
  const lo = startHour * 60;
  const hi = endHour * 60;
  const dayStart = atMinutes(key, 0, tz).getTime();
  const dayEnd = atMinutes(key, 1440, tz).getTime();
  const items = events
    .filter((e) => !e.allDay && e.start.getTime() < dayEnd && e.end.getTime() > dayStart)
    .map((event) => {
      const s = event.start.getTime() < dayStart ? 0 : minutesOfDay(event.start, tz);
      const rawEnd = event.end.getTime() >= dayEnd ? 1440 : minutesOfDay(event.end, tz);
      const start = Math.max(lo, Math.min(s, hi));
      const end = Math.max(start + minMinutes, Math.min(Math.max(rawEnd, s + minMinutes), hi));
      return { event, start, end, clippedStart: event.start.getTime() < dayStart, clippedEnd: event.end.getTime() > dayEnd };
    })
    .filter((i) => i.start < hi)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const out: TimedBox<T>[] = [];
  let cluster: { item: (typeof items)[number]; col: number }[] = [];
  let colEnds: number[] = [];
  let clusterEnd = -1;
  const flush = () => {
    for (const { item, col } of cluster) {
      out.push({ ...item, col, cols: colEnds.length, top: (item.start - lo) / (hi - lo), height: (item.end - item.start) / (hi - lo) });
    }
    cluster = [];
    colEnds = [];
  };
  for (const item of items) {
    if (item.start >= clusterEnd) flush();
    let col = colEnds.findIndex((end) => end <= item.start);
    if (col < 0) {
      col = colEnds.length;
      colEnds.push(item.end);
    } else colEnds[col] = item.end;
    cluster.push({ item, col });
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  flush();
  return out;
}

/* ---------- layout: multi-day bars in a week row ---------- */

export type SpanBar<T> = {
  event: T;
  /** Column indexes in `days`, from ≤ to. */
  from: number;
  to: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
};

/** First and last day keys an event covers. An all-day event ending at midnight does not cover that day. */
export function eventDayRange(e: Pick<CalendarEvent, "start" | "end" | "allDay">, tz = TEHRAN): [string, string] {
  const startKey = e.allDay ? dayKey(e.start) : zonedKey(e.start, tz);
  const endInstant = new Date(Math.max(e.start.getTime(), e.end.getTime() - 1));
  const endKey = e.allDay ? dayKey(endInstant) : zonedKey(endInstant, tz);
  return [startKey, endKey < startKey ? startKey : endKey];
}

/** Whether an event belongs in an all-day lane: all-day or spanning more than one day. */
export function isSpanning(e: Pick<CalendarEvent, "start" | "end" | "allDay">, tz = TEHRAN) {
  if (e.allDay) return true;
  const [a, b] = eventDayRange(e, tz);
  return a !== b;
}

/** Stacks events over a row of consecutive day keys into lanes, longest first. */
export function layoutSpans<T extends Pick<CalendarEvent, "start" | "end" | "allDay">>(events: T[], days: string[], tz = TEHRAN): SpanBar<T>[] {
  const first = days[0];
  const last = days[days.length - 1];
  const bars = events
    .map((event) => {
      const [a, b] = eventDayRange(event, tz);
      if (b < first || a > last) return null;
      const from = a < first ? 0 : days.indexOf(a);
      const to = b > last ? days.length - 1 : days.indexOf(b);
      return { event, from, to, continuesBefore: a < first, continuesAfter: b > last };
    })
    .filter((b): b is NonNullable<typeof b> => !!b && b.from >= 0 && b.to >= 0)
    .sort((x, y) => x.from - y.from || y.to - y.from - (x.to - x.from));
  const lanes: number[] = [];
  return bars.map((b) => {
    let lane = lanes.findIndex((end) => end < b.from);
    if (lane < 0) {
      lane = lanes.length;
      lanes.push(b.to);
    } else lanes[lane] = b.to;
    return { ...b, lane };
  });
}

/* ---------- booking slots ---------- */

export type Slot = { start: Date; end: Date; left: number; state: "free" | "full" | "past" };

export type SlotOptions = {
  key: string;
  /** Opening windows as ["09:00", "13:00"]. */
  open: [string, string][];
  /** Minutes per appointment. */
  duration: number;
  /** Minutes between slot starts. Defaults to duration. */
  step?: number;
  /** Booked intervals; each overlap uses one seat. */
  busy?: { start: Date; end: Date }[];
  /** Seats per slot. Default 1. */
  capacity?: number;
  tz?: string;
  now?: Date;
};

/** Slots of one day with seats left and a state; slots starting before `now` are past. */
export function generateSlots({ key, open, duration, step = duration, busy = [], capacity = 1, tz = TEHRAN, now = new Date() }: SlotOptions): Slot[] {
  const out: Slot[] = [];
  for (const [a, b] of open) {
    const close = parseHm(b);
    for (let t = parseHm(a); t + duration <= close; t += step) {
      const start = atMinutes(key, t, tz);
      const end = atMinutes(key, t + duration, tz);
      const used = busy.filter((x) => x.start < end && x.end > start).length;
      const left = Math.max(0, capacity - used);
      out.push({ start, end, left, state: start < now ? "past" : left === 0 ? "full" : "free" });
    }
  }
  return out;
}

/* ---------- right-to-left time scale ---------- */

export type Zoom = "day" | "week" | "month";

/** Maps instants to x pixels with the start on the right edge and time flowing left. */
export function timeScale(start: Date, end: Date, width: number) {
  const s = start.getTime();
  const span = Math.max(1, end.getTime() - s);
  const x = (d: Date) => width - ((d.getTime() - s) / span) * width;
  const invert = (px: number) => new Date(s + ((width - px) / width) * span);
  return { x, invert, perDay: (width * DAY) / span };
}

export type Tick = { date: Date; label: string; major: boolean };

/** Day, week (each شنبه) or month (each 1st) ticks over local calendar days in [start, end). */
export function timeTicks(start: Date, end: Date, zoom: Zoom): Tick[] {
  const out: Tick[] = [];
  for (let d = new Date(start.getFullYear(), start.getMonth(), start.getDate()); d < end; d = addDays(d, 1)) {
    const { jm, jd } = toJalali(d);
    if (zoom === "day") out.push({ date: d, label: fa(jd), major: jd === 1 });
    else if (zoom === "week" && jalaliWeekday(d) === 0) out.push({ date: d, label: shortDay(d), major: jd <= 7 });
    else if (zoom === "month" && jd === 1) out.push({ date: d, label: JALALI_MONTHS[jm - 1], major: jm === 1 });
  }
  return out;
}
