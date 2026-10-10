"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS, JALALI_WEEKDAYS_SHORT, jalaliMonthLength, jalaliWeekday, toGregorian, toJalali } from "@/lib/jalali";
import { HIJRI_MONTHS, toHijri } from "@/lib/hijri";
import { iranOccasions, type Occasion, type OccasionProvider } from "@/lib/iran-holidays";
import { addDays, addJalaliMonths, dayKey, eventColor, formatTimeRange, fromKey, startOfJalaliWeek, TEHRAN, type CalendarEvent } from "@/lib/calendar-utils";

/* ---------- context ---------- */

export type CalendarView = "month" | "week" | "day" | "agenda";
/** Second date shown under each Jalali day. */
export type Secondary = "hijri" | "gregorian" | null;

export type CalendarSettings = {
  /** IANA zone used to place timed events. Default Asia/Tehran. */
  timeZone: string;
  /** Holiday and occasion lookup; null hides them. */
  occasions: OccasionProvider | null;
  secondary: Secondary;
  /** Weekdays off, 0 = شنبه … 6 = جمعه. */
  weekend: number[];
};

const Ctx = React.createContext<CalendarSettings>({ timeZone: TEHRAN, occasions: iranOccasions, secondary: "hijri", weekend: [6] });

export interface CalendarProviderProps extends Partial<Omit<CalendarSettings, "occasions">> {
  /** Built-in Iranian holidays by default; pass your own provider, or false to hide them. */
  occasions?: OccasionProvider | false;
  children: React.ReactNode;
}

/**
 * Shared settings for every calendar view below it: time zone, holidays,
 * the secondary date and the weekend. Every view also works without it.
 */
export function CalendarProvider({ timeZone = TEHRAN, occasions = iranOccasions, secondary = "hijri", weekend = [6], children }: CalendarProviderProps) {
  const weekendKey = weekend.join(",");
  const value = React.useMemo(
    () => ({ timeZone, occasions: occasions || null, secondary, weekend: weekendKey ? weekendKey.split(",").map(Number) : [] }),
    [timeZone, occasions, secondary, weekendKey],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCalendar() {
  return React.useContext(Ctx);
}

/** Today as a local calendar day, fixed for the life of the component. */
export function useToday() {
  const [today] = React.useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  });
  return today;
}

const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
};
const minuteSnapshot = () => Math.floor(Date.now() / 60_000);
const noMinute = () => null;

/** The current minute, updated every 30 seconds. Null during server render so "now" lines never mismatch. */
export function useNow() {
  const m = React.useSyncExternalStore(subscribeMinute, minuteSnapshot, noMinute);
  return React.useMemo(() => (m === null ? null : new Date(m * 60_000)), [m]);
}

/** Controlled or uncontrolled state with one setter. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value === undefined ? internal : value;
  const set = React.useCallback(
    (v: T) => {
      if (value === undefined) setInternal(v);
      onChange?.(v);
    },
    [value, onChange],
  );
  return [current, set];
}

/* ---------- day facts ---------- */

export type DayInfo = {
  key: string;
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  occasions: Occasion[];
  holiday: Occasion | undefined;
  /** Accessible name: «چهارشنبه ۲۳ مهر ۱۴۰۵، تعطیل: …». */
  label: string;
};

export function dayInfo(date: Date, settings: CalendarSettings, today: Date): DayInfo {
  const key = dayKey(date);
  const occasions = settings.occasions?.(key) ?? [];
  const holiday = occasions.find((o) => o.holiday);
  const { jy, jm, jd } = toJalali(date);
  const isToday = key === dayKey(today);
  let label = `${JALALI_WEEKDAYS[jalaliWeekday(date)]} ${fa(jd)} ${JALALI_MONTHS[jm - 1]} ${fa(jy)}`;
  if (isToday) label += "، امروز";
  if (holiday) label += `، تعطیل: ${occasions.filter((o) => o.holiday).map((o) => o.title).join("، ")}`;
  return { key, date, isToday, isWeekend: settings.weekend.includes(jalaliWeekday(date)), occasions, holiday, label };
}

export function useDayInfo(date: Date) {
  const settings = useCalendar();
  const today = useToday();
  return dayInfo(date, settings, today);
}

const GREGORIAN_MONTHS = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];

/** Small second date for a day cell: Hijri or Gregorian day in Persian digits. */
export function secondaryDay(date: Date, secondary: Secondary) {
  if (secondary === "hijri") return fa(toHijri(date).hd);
  if (secondary === "gregorian") return fa(date.getDate());
  return null;
}

/** Second title line for a Jalali month: «ربیع‌الثانی – جمادی‌الاول ۱۴۴۸» or «سپتامبر – اکتبر ۲۰۲۶». */
export function secondaryMonthTitle(jy: number, jm: number, secondary: Secondary) {
  if (!secondary) return null;
  const a = toGregorian(jy, jm, 1);
  const b = toGregorian(jy, jm, jalaliMonthLength(jy, jm));
  if (secondary === "gregorian") {
    const ma = GREGORIAN_MONTHS[a.getMonth()];
    const mb = GREGORIAN_MONTHS[b.getMonth()];
    return `${ma === mb ? ma : `${ma} – ${mb}`} ${fa(b.getFullYear())}`;
  }
  const ha = toHijri(a);
  const hb = toHijri(b);
  const names = ha.hm === hb.hm ? HIJRI_MONTHS[ha.hm - 1] : `${HIJRI_MONTHS[ha.hm - 1]} – ${HIJRI_MONTHS[hb.hm - 1]}`;
  return `${names} ${fa(hb.hy)}${ha.approximate || hb.approximate ? " (تقریبی)" : ""}`;
}

/* ---------- toolbar ---------- */

export interface CalendarToolbarProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  /** Extra controls on the far side, e.g. a view switcher. */
  children?: React.ReactNode;
  className?: string;
}

/** Title, «امروز» and previous/next. Previous points right because time runs right to left. */
export function CalendarToolbar({ title, subtitle, onPrev, onNext, onToday, prevLabel = "قبلی", nextLabel = "بعدی", children, className }: CalendarToolbarProps) {
  const nav = "flex size-8 cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <div className="flex items-center gap-1">
        <button type="button" aria-label={prevLabel} onClick={onPrev} className={nav}>
          <ChevronRight className="size-4" />
        </button>
        <button type="button" aria-label={nextLabel} onClick={onNext} className={nav}>
          <ChevronLeft className="size-4" />
        </button>
        {onToday && (
          <button type="button" onClick={onToday} className="h-8 cursor-pointer rounded-control border border-border px-3 text-xs font-medium transition-colors hover:bg-accent">
            امروز
          </button>
        )}
      </div>
      <div className="min-w-0" aria-live="polite">
        <p className="truncate font-display text-base font-bold">{title}</p>
        {subtitle && <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      {children && <div className="ms-auto flex items-center gap-2">{children}</div>}
    </div>
  );
}

/* ---------- day pieces ---------- */

/** شنبه … جمعه header row; the weekend is muted. */
export function WeekdayHeader({ short, className }: { short?: boolean; className?: string }) {
  const { weekend } = useCalendar();
  return (
    <div className={cn("grid grid-cols-7 text-center text-[11px] text-muted-foreground", className)} aria-hidden>
      {(short ? JALALI_WEEKDAYS_SHORT : JALALI_WEEKDAYS).map((d, i) => (
        <span key={d} className={cn("py-1.5", weekend.includes(i) && "text-destructive/80")}>
          {d}
        </span>
      ))}
    </div>
  );
}

export interface DayNumberProps {
  info: DayInfo;
  /** Dim days that belong to the neighbouring month. */
  outside?: boolean;
  selected?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * The Jalali day number with its states: today is a ring, selected is filled,
 * holidays and the weekend are red and also carry a dot so color is not the
 * only cue. The secondary date sits under it.
 */
export function DayNumber({ info, outside, selected, size = "md", className }: DayNumberProps) {
  const { secondary } = useCalendar();
  const off = !!info.holiday || info.isWeekend;
  const second = secondaryDay(info.date, secondary);
  const approx = info.occasions.some((o) => o.approximate);
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", outside && "opacity-40", className)}>
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full tabular-nums",
          size === "sm" ? "size-6 text-[11px]" : "size-7 text-sm",
          selected ? "bg-primary font-bold text-primary-foreground" : info.isToday ? "font-bold ring-2 ring-inset ring-foreground/70" : "",
          !selected && off && "text-destructive",
        )}
      >
        {fa(toJalali(info.date).jd)}
        {info.holiday && <span aria-hidden className="absolute -bottom-0.5 size-1 rounded-full bg-destructive" />}
      </span>
      {second && size === "md" && (
        <span className={cn("mt-0.5 text-[9px] tabular-nums text-muted-foreground", approx && "italic")}>{second}</span>
      )}
    </span>
  );
}

/** First holiday or occasion name of a day, clipped to one line. */
export function OccasionLine({ info, className }: { info: DayInfo; className?: string }) {
  const o = info.holiday ?? info.occasions[0];
  if (!o) return null;
  return (
    <span title={info.occasions.map((x) => x.title + (x.approximate ? " (تقریبی)" : "")).join("، ")} className={cn("block truncate text-[10px] leading-4", o.holiday ? "text-destructive" : "text-muted-foreground", className)}>
      {o.title}
      {o.approximate && " ؟"}
    </span>
  );
}

/* ---------- events ---------- */

export interface EventChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  event: CalendarEvent;
  /** Palette slot when the event has no color. */
  index?: number;
  /** Show «۱۰:۰۰ تا ۱۱:۰۰» under the title. */
  showTime?: boolean;
  timeZone?: string;
  compact?: boolean;
  /** Short text before the title, e.g. the start time. */
  lead?: string;
}

/** A tinted event pill with a colored edge on the start (right) side. */
export function EventChip({ event, index = 0, showTime, timeZone = TEHRAN, compact, lead, className, style, ...props }: EventChipProps) {
  const color = eventColor(event.color, index);
  return (
    <button
      type="button"
      {...props}
      style={{ ...style, "--ev": color } as React.CSSProperties}
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col items-start overflow-hidden rounded-control border-s-[3px] border-[var(--ev)] bg-[color-mix(in_oklch,var(--ev)_16%,transparent)] text-start text-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--ev)_26%,transparent)] focus-visible:outline-2 focus-visible:outline-ring",
        compact ? "px-1.5 py-0.5 text-[11px] leading-4" : "px-2 py-1 text-xs",
        className,
      )}
    >
      <span className="w-full truncate font-medium">
        {lead && <span className="me-1 font-normal text-muted-foreground tabular-nums">{lead}</span>}
        {event.title}
      </span>
      {showTime && !event.allDay && <span className="w-full truncate text-[10px] text-muted-foreground tabular-nums">{formatTimeRange(event.start, event.end, timeZone)}</span>}
    </button>
  );
}

/* ---------- keyboard ---------- */

/**
 * Roving focus over day cells marked with `data-key`. ArrowLeft is the next
 * day (it sits to the left in RTL), ArrowRight the previous, Up/Down a week,
 * PageUp/PageDown a month, Home/End the week's شنبه/جمعه.
 */
export function useRovingDays(activeKey: string, onMove?: (key: string) => void) {
  const container = React.useRef<HTMLDivElement>(null);
  const [focusKey, setFocusKey] = React.useState(activeKey);
  const [prev, setPrev] = React.useState(activeKey);
  if (prev !== activeKey) {
    setPrev(activeKey);
    setFocusKey(activeKey);
  }
  const pending = React.useRef(false);
  React.useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    container.current?.querySelector<HTMLElement>(`[data-key="${focusKey}"]`)?.focus();
  }, [focusKey]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const d = fromKey(focusKey);
    const next =
      e.key === "ArrowLeft" ? addDays(d, 1)
      : e.key === "ArrowRight" ? addDays(d, -1)
      : e.key === "ArrowDown" ? addDays(d, 7)
      : e.key === "ArrowUp" ? addDays(d, -7)
      : e.key === "PageDown" ? addJalaliMonths(d, 1)
      : e.key === "PageUp" ? addJalaliMonths(d, -1)
      : e.key === "Home" ? startOfJalaliWeek(d)
      : e.key === "End" ? addDays(startOfJalaliWeek(d), 6)
      : null;
    if (!next) return;
    e.preventDefault();
    const k = dayKey(next);
    pending.current = true;
    setFocusKey(k);
    onMove?.(k);
  };
  return { container, focusKey, setFocusKey, onKeyDown };
}

/* ---------- layout helpers ---------- */

/** Width of an element, kept current with ResizeObserver. 0 until mounted. */
export function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T>(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/** Screen-reader-only block. Wraps tables in a div so they cannot widen the page. */
export function SrOnly({ children }: { children: React.ReactNode }) {
  return <div className="sr-only">{children}</div>;
}

/** Empty-state line for views with nothing to show. */
export function CalendarEmpty({ children = "رویدادی نیست.", className }: { children?: React.ReactNode; className?: string }) {
  return <p className={cn("rounded-control border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground", className)}>{children}</p>;
}
