"use client";

import * as React from "react";
import { AlertTriangle, Check, Plus } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { JALALI_WEEKDAYS, jalaliWeekday } from "@/lib/jalali";
import { addDays, dayKey, eventColor, formatDuration, parseHm, shortDay, startOfJalaliWeek, weekDates, type Resource } from "@/lib/calendar-utils";
import { Popover } from "@/registry/ui/popover";
import { CalendarToolbar, dayInfo, useCalendar, useControllable, useToday } from "@/registry/calendar/calendar-core";

export type ShiftType = { id: string; label: string; start: string; end: string; color?: number | string };
export type Shift = { id: string; resourceId: string; date: Date; type: string };

export const DEFAULT_SHIFTS: ShiftType[] = [
  { id: "morning", label: "صبح", start: "07:00", end: "15:00", color: 3 },
  { id: "evening", label: "عصر", start: "15:00", end: "23:00", color: 2 },
  { id: "night", label: "شب", start: "23:00", end: "07:00", color: 5 },
];

export interface ShiftSchedulerProps {
  resources: Resource[];
  shifts?: Shift[];
  defaultShifts?: Shift[];
  onShiftsChange?: (shifts: Shift[]) => void;
  shiftTypes?: ShiftType[];
  /** Any day in the week to show (controlled). */
  week?: Date;
  defaultWeek?: Date;
  onWeekChange?: (week: Date) => void;
  /** Weekly hours before a warning. Default 44, the Iranian labour-law week. */
  maxHours?: number;
  /** Minimum rest between two shifts, in hours. Default 12. */
  minRest?: number;
  /** Replace the built-in shift menu, e.g. to open your own dialog. */
  onCellClick?: (resourceId: string, date: Date) => void;
  className?: string;
}

/** Enter and Space click a span that acts as a button. */
const pressOnKey = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.currentTarget.click();
};

const mins = (t: ShiftType) => {
  const a = parseHm(t.start);
  let b = parseHm(t.end);
  if (b <= a) b += 1440;
  return [a, b] as const;
};

/** Per person: hours this week, and cells where rest is too short or shifts overlap. */
function analyse(resourceId: string, shifts: Shift[], types: Map<string, ShiftType>, weekStart: Date, minRest: number) {
  const items = shifts
    .filter((s) => s.resourceId === resourceId && types.has(s.type))
    .map((s) => {
      const [a, b] = mins(types.get(s.type)!);
      const base = Math.round((s.date.getTime() - weekStart.getTime()) / 86_400_000) * 1440;
      return { s, a: base + a, b: base + b };
    })
    .sort((x, y) => x.a - y.a);
  const minutes = items.reduce((n, i) => n + (i.b - i.a), 0);
  const flags = new Map<string, string>();
  for (let i = 1; i < items.length; i += 1) {
    const gap = items[i].a - items[i - 1].b;
    const k = dayKey(items[i].s.date);
    if (gap < 0) flags.set(k, "دو شیفت هم‌پوشانی دارند");
    else if (gap < minRest * 60) flags.set(k, `فقط ${formatDuration(gap)} استراحت بین دو شیفت`);
  }
  return { minutes, flags };
}

/**
 * برنامه‌ی شیفت. People down the right, شنبه to جمعه across, shift chips in
 * each cell, weekly hours per person with a warning past the limit, and a
 * flag when rest between shifts is too short. Holidays are tinted so you can
 * see who works on them.
 */
export function ShiftScheduler({
  resources,
  shifts,
  defaultShifts = [],
  onShiftsChange,
  shiftTypes = DEFAULT_SHIFTS,
  week,
  defaultWeek,
  onWeekChange,
  maxHours = 44,
  minRest = 12,
  onCellClick,
  className,
}: ShiftSchedulerProps) {
  const settings = useCalendar();
  const today = useToday();
  const [list, setList] = useControllable(shifts, defaultShifts, onShiftsChange);
  const [cursor, setCursor] = useControllable(week, defaultWeek ?? today, onWeekChange);
  const days = weekDates(cursor);
  const keys = days.map(dayKey);
  const start = startOfJalaliWeek(cursor);
  const types = React.useMemo(() => new Map(shiftTypes.map((t) => [t.id, t])), [shiftTypes]);
  const typeIndex = new Map(shiftTypes.map((t, i) => [t.id, i]));

  const cell = (rid: string, key: string) => list.filter((s) => s.resourceId === rid && dayKey(s.date) === key).sort((a, b) => (typeIndex.get(a.type) ?? 0) - (typeIndex.get(b.type) ?? 0));
  const toggle = (rid: string, date: Date, type: string) => {
    const k = dayKey(date);
    const hit = list.find((s) => s.resourceId === rid && dayKey(s.date) === k && s.type === type);
    setList(hit ? list.filter((s) => s !== hit) : [...list, { id: `${rid}-${k}-${type}`, resourceId: rid, date, type }]);
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <CalendarToolbar
        title={`${shortDay(days[0])} تا ${shortDay(days[6])}`}
        subtitle={`${fa(list.filter((s) => keys.includes(dayKey(s.date))).length)} شیفت این هفته`}
        onPrev={() => setCursor(addDays(cursor, -7))}
        onNext={() => setCursor(addDays(cursor, 7))}
        onToday={() => setCursor(today)}
        prevLabel="هفته‌ی قبل"
        nextLabel="هفته‌ی بعد"
      >
        <ul className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          {shiftTypes.map((t, i) => (
            <li key={t.id} className="flex items-center gap-1">
              <span aria-hidden className="size-2 rounded-full" style={{ background: eventColor(t.color, i) }} />
              {t.label} <span className="tabular-nums">{fa(t.start)}–{fa(t.end)}</span>
            </li>
          ))}
        </ul>
      </CalendarToolbar>
      <div className="overflow-x-auto rounded-surface border-line bg-card">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th scope="col" className="w-44 px-3 py-2 text-start text-[11px] font-medium text-muted-foreground">
                نفر
              </th>
              {days.map((d) => {
                const info = dayInfo(d, settings, today);
                const off = info.holiday || info.isWeekend;
                return (
                  <th key={info.key} scope="col" title={info.holiday?.title} className={cn("border-s px-1 py-2 text-center font-medium", off && "bg-destructive/[0.05] text-destructive", info.isToday && "bg-accent")}>
                    <span className="block text-[11px]">{JALALI_WEEKDAYS[jalaliWeekday(d)]}</span>
                    <span className="block text-xs tabular-nums">{shortDay(d)}</span>
                    {info.holiday && <span className="block truncate text-[9px] font-normal">{info.holiday.title}</span>}
                  </th>
                );
              })}
              <th scope="col" className="w-20 border-s px-2 py-2 text-center text-[11px] font-medium text-muted-foreground">
                ساعت
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => {
              const { minutes, flags } = analyse(r.id, list.filter((s) => keys.includes(dayKey(s.date))), types, start, minRest);
              const over = minutes > maxHours * 60;
              return (
                <tr key={r.id} className="border-b last:border-b-0">
                  <th scope="row" className="px-3 py-2 text-start font-normal">
                    <span className="block truncate text-sm font-medium">{r.title}</span>
                    {r.subtitle && <span className="block truncate text-[11px] text-muted-foreground">{r.subtitle}</span>}
                  </th>
                  {days.map((d) => {
                    const info = dayInfo(d, settings, today);
                    const items = cell(r.id, info.key);
                    const flag = flags.get(info.key);
                    const label = `${r.title}، ${info.label}، ${items.length ? items.map((s) => types.get(s.type)?.label).join(" و ") : "بدون شیفت"}${flag ? `، هشدار: ${flag}` : ""}`;
                    const chips = (
                      <span className="flex min-h-14 w-full flex-col items-stretch justify-center gap-1 p-1">
                        {items.map((s) => {
                          const t = types.get(s.type);
                          if (!t) return null;
                          const color = eventColor(t.color, typeIndex.get(t.id) ?? 0);
                          return (
                            <span key={s.id} className="truncate rounded-control border-s-[3px] px-1.5 py-0.5 text-start text-[11px] font-medium" style={{ borderColor: color, background: `color-mix(in oklch, ${color} 16%, transparent)` }}>
                              {t.label}
                            </span>
                          );
                        })}
                        {!items.length && <Plus aria-hidden className="mx-auto size-3.5 text-muted-foreground/40" />}
                      </span>
                    );
                    return (
                      <td key={info.key} className={cn("relative border-s p-0 align-middle [&>div]:block [&>div>span]:flex", (info.holiday || info.isWeekend) && "bg-destructive/[0.04]", flag && "ring-2 ring-inset ring-warning/70")}>
                        {flag && <AlertTriangle aria-hidden className="absolute top-1 end-1 size-3 text-warning" />}
                        {onCellClick ? (
                          <button type="button" aria-label={label} title={flag} onClick={() => onCellClick(r.id, d)} className="block w-full cursor-pointer transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-ring">
                            {chips}
                          </button>
                        ) : (
                          <Popover
                            align="center"
                            trigger={
                              <span role="button" tabIndex={0} aria-label={label} title={flag} onKeyDown={pressOnKey} className="block w-full cursor-pointer transition-colors hover:bg-accent/60 focus-visible:outline-2 focus-visible:outline-ring">
                                {chips}
                              </span>
                            }
                          >
                            <div className="w-48" role="menu" aria-label={`شیفت ${r.title}، ${shortDay(d)}`}>
                              <p className="px-2 pb-1 pt-0.5 text-[11px] text-muted-foreground">
                                {r.title} · {shortDay(d)}
                              </p>
                              {shiftTypes.map((t, i) => {
                                const on = items.some((s) => s.type === t.id);
                                return (
                                  <button
                                    key={t.id}
                                    type="button"
                                    role="menuitemcheckbox"
                                    aria-checked={on}
                                    onClick={() => toggle(r.id, d, t.id)}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-control px-2 py-1.5 text-start text-sm hover:bg-accent"
                                  >
                                    <span aria-hidden className="size-2 rounded-full" style={{ background: eventColor(t.color, i) }} />
                                    <span className="flex-1">{t.label}</span>
                                    <span className="text-[10px] tabular-nums text-muted-foreground">
                                      {fa(t.start)}–{fa(t.end)}
                                    </span>
                                    <Check className={cn("size-3.5", on ? "opacity-100" : "opacity-0")} />
                                  </button>
                                );
                              })}
                            </div>
                          </Popover>
                        )}
                      </td>
                    );
                  })}
                  <td className={cn("border-s px-2 text-center text-xs tabular-nums", over && "font-bold text-warning")} title={over ? `بیشتر از ${fa(maxHours)} ساعت در هفته` : undefined}>
                    {fa(Math.round((minutes / 60) * 10) / 10).replace(".", "٫")}
                    {over && <AlertTriangle aria-label="بیش از حد مجاز" className="mx-auto mt-0.5 size-3" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t bg-muted/40 text-[11px] text-muted-foreground">
              <th scope="row" className="px-3 py-1.5 text-start font-medium">
                پوشش
              </th>
              {keys.map((k) => (
                <td key={k} className="border-s px-1 py-1.5 text-center">
                  {shiftTypes.map((t) => {
                    const n = list.filter((s) => dayKey(s.date) === k && s.type === t.id).length;
                    return (
                      <span key={t.id} className={cn("block tabular-nums", !n && "text-destructive/80")}>
                        {t.label} {fa(n)}
                      </span>
                    );
                  })}
                </td>
              ))}
              <td className="border-s" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
