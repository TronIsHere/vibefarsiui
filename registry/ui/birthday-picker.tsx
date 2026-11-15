"use client";

import * as React from "react";
import { Select } from "@/registry/ui/select";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, jalaliMonthLength, toGregorian, toJalali } from "@/lib/jalali";

export interface BirthdayPickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with a Date once all three parts make a real day, and with null while incomplete or invalid. */
  onChange?: (date: Date | null, age: number | null) => void;
  /** Rejects dates younger than this many full years. */
  minAge?: number;
  /** Oldest age on the year list. */
  maxAge?: number;
  /** Form field name; submits the Gregorian date as YYYY-MM-DD. */
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/** Full years between a birth date and now, counted on the Jalali calendar. */
export function jalaliAge(birth: Date, now = new Date()): number {
  const b = toJalali(birth);
  const n = toJalali(now);
  return n.jy - b.jy - (n.jm < b.jm || (n.jm === b.jm && n.jd < b.jd) ? 1 : 0);
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * تاریخ تولد. Three native selects (روز، ماه، سال) instead of a calendar: nobody wants to
 * page back forty years month by month. Days follow the month length and leap years,
 * and the age is shown as soon as the date is complete.
 */
export function BirthdayPicker({ value, defaultValue = null, onChange, minAge = 0, maxAge = 100, name, id, disabled, className }: BirthdayPickerProps) {
  const initial = value ?? defaultValue;
  const [parts, setParts] = React.useState(() => (initial ? toJalali(initial) : { jy: 0, jm: 0, jd: 0 }));
  const [seen, setSeen] = React.useState(value);
  // Controlled value changed from outside: adopt it during render.
  if (value !== undefined && value !== seen) {
    setSeen(value);
    if (value) setParts(toJalali(value));
  }

  const [thisYear] = React.useState(() => toJalali(new Date()).jy);
  const autoId = React.useId();
  const base = id ?? autoId;

  const dayCount = parts.jy && parts.jm ? jalaliMonthLength(parts.jy, parts.jm) : parts.jm > 6 ? 30 : 31;
  const complete = parts.jy > 0 && parts.jm > 0 && parts.jd > 0;
  const realDay = complete && parts.jd <= jalaliMonthLength(parts.jy, parts.jm);
  const date = realDay ? toGregorian(parts.jy, parts.jm, parts.jd) : null;
  const age = date ? jalaliAge(date) : null;
  const tooYoung = age !== null && age < minAge;
  const inFuture = age !== null && age < 0;
  const error = complete && !realDay ? `${JALALI_MONTHS[parts.jm - 1]} ${fa(parts.jy)} فقط ${fa(jalaliMonthLength(parts.jy, parts.jm))} روز دارد.` : inFuture ? "این تاریخ هنوز نرسیده است." : tooYoung ? `سن باید دست‌کم ${fa(minAge)} سال باشد.` : "";

  function update(next: typeof parts) {
    setParts(next);
    const ok = next.jy > 0 && next.jm > 0 && next.jd > 0 && next.jd <= jalaliMonthLength(next.jy, next.jm);
    const d = ok ? toGregorian(next.jy, next.jm, next.jd) : null;
    const a = d ? jalaliAge(d) : null;
    onChange?.(d && a !== null && a >= Math.max(0, minAge) ? d : null, a);
  }

  const years = React.useMemo(() => Array.from({ length: maxAge + 1 }, (_, i) => ({ value: String(thisYear - i), label: fa(thisYear - i) })), [thisYear, maxAge]);
  const months = JALALI_MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));
  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: fa(i + 1), disabled: i + 1 > dayCount }));

  return (
    <fieldset disabled={disabled} className={cn("min-w-0", className)} aria-describedby={`${base}-hint`}>
      <legend className="sr-only">تاریخ تولد</legend>
      <div className="grid grid-cols-[1fr_1.4fr_1.2fr] gap-2">
        <Select id={`${base}-day`} aria-label="روز" autoComplete="bday-day" placeholder="روز" value={parts.jd ? String(parts.jd) : ""} options={days} aria-invalid={error ? true : undefined} onChange={(e) => update({ ...parts, jd: Number(e.target.value) })} />
        <Select id={`${base}-month`} aria-label="ماه" placeholder="ماه" value={parts.jm ? String(parts.jm) : ""} options={months} onChange={(e) => update({ ...parts, jm: Number(e.target.value) })} />
        <Select id={`${base}-year`} aria-label="سال" placeholder="سال" value={parts.jy ? String(parts.jy) : ""} options={years} onChange={(e) => update({ ...parts, jy: Number(e.target.value) })} />
      </div>
      {name && <input type="hidden" name={name} value={date && !error ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : ""} />}
      <p id={`${base}-hint`} aria-live="polite" className={cn("mt-1.5 min-h-5 text-xs", error ? "text-destructive" : "text-muted-foreground")}>
        {error || (age !== null ? `${fa(age)} ساله` : "")}
      </p>
    </fieldset>
  );
}
