/**
 * Iran's official holidays and a few well-known occasions, built from rules:
 * solar ones by Jalali date, religious ones by lunar Hijri date through
 * `@/lib/hijri`. Years in VERIFIED_JALALI_YEARS match the published official
 * calendar day for day; other years are computed and lunar days in them carry
 * `approximate: true`. Apps with their own source plug it in as an
 * OccasionProvider.
 */
import { jalaliMonthLength, jalaliWeekday, toGregorian, toJalali } from "@/lib/jalali";
import { fromHijri, hijriMonthLength, toHijri, type HijriDate } from "@/lib/hijri";

export type Occasion = {
  /** Calendar day, "YYYY-MM-DD" (Gregorian, Latin digits). */
  key: string;
  date: Date;
  title: string;
  /** Official day off. */
  holiday: boolean;
  kind: "solar" | "lunar";
  /** Lunar date outside the official table; may be one day off. */
  approximate: boolean;
  hijri?: HijriDate;
};

/** Looks up the occasions of one calendar day ("YYYY-MM-DD"). */
export type OccasionProvider = (key: string) => Occasion[];

/** Jalali years checked against the official holiday list. */
export const VERIFIED_JALALI_YEARS = [1404, 1405];

type SolarRule = [jm: number, jd: number, title: string, holiday: boolean];
type LunarRule = [hm: number, hd: number | "last", title: string, holiday: boolean];

const SOLAR: SolarRule[] = [
  [1, 1, "نوروز", true],
  [1, 2, "نوروز", true],
  [1, 3, "نوروز", true],
  [1, 4, "نوروز", true],
  [1, 12, "روز جمهوری اسلامی", true],
  [1, 13, "روز طبیعت", true],
  [2, 12, "روز معلم", false],
  [3, 14, "رحلت امام خمینی", true],
  [3, 15, "قیام ۱۵ خرداد", true],
  [9, 16, "روز دانشجو", false],
  [9, 30, "شب یلدا", false],
  [11, 22, "پیروزی انقلاب اسلامی", true],
  [12, 29, "روز ملی شدن صنعت نفت", true],
];

const LUNAR: LunarRule[] = [
  [1, 9, "تاسوعای حسینی", true],
  [1, 10, "عاشورای حسینی", true],
  [2, 20, "اربعین حسینی", true],
  [2, 28, "رحلت پیامبر و شهادت امام حسن مجتبی", true],
  [2, "last", "شهادت امام رضا", true],
  [3, 8, "شهادت امام حسن عسکری", true],
  [3, 17, "میلاد پیامبر و امام جعفر صادق", true],
  [6, 3, "شهادت حضرت فاطمه", true],
  [6, 20, "روز زن و مادر", false],
  [7, 13, "ولادت امام علی و روز پدر", true],
  [7, 27, "مبعث", true],
  [8, 15, "نیمه‌ی شعبان", true],
  [9, 21, "شهادت امام علی", true],
  [10, 1, "عید فطر", true],
  [10, 2, "تعطیل به مناسبت عید فطر", true],
  [10, 25, "شهادت امام جعفر صادق", true],
  [12, 10, "عید قربان", true],
  [12, 18, "عید غدیر", true],
];

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const cache = new Map<number, Occasion[]>();
const byKey = new Map<number, Map<string, Occasion[]>>();

/** Every occasion of a Jalali year, sorted by date (holidays first on a shared day). */
export function occasionsOf(jy: number): Occasion[] {
  const hit = cache.get(jy);
  if (hit) return hit;
  const first = toGregorian(jy, 1, 1);
  const last = toGregorian(jy, 12, jalaliMonthLength(jy, 12));
  const inYear = (d: Date) => d >= first && d <= last;
  const out: Occasion[] = [];
  const push = (date: Date, title: string, holiday: boolean, kind: Occasion["kind"], approximate: boolean, hijri?: HijriDate) =>
    out.push({ key: keyOf(date), date, title, holiday, kind, approximate, hijri });

  for (const [jm, jd, title, holiday] of SOLAR) push(toGregorian(jy, jm, jd), title, holiday, "solar", false);

  // چهارشنبه‌سوری: the evening before the last Wednesday of the year.
  let wed = last;
  while (jalaliWeekday(wed) !== 4) wed = addDays(wed, -1);
  push(addDays(wed, -1), "چهارشنبه‌سوری", false, "solar", false);

  const hyFirst = toHijri(first).hy;
  const hyLast = toHijri(last).hy;
  for (let hy = hyFirst; hy <= hyLast; hy += 1) {
    for (const [hm, rule, title, holiday] of LUNAR) {
      const hd = rule === "last" ? hijriMonthLength(hy, hm) : rule;
      const { date, approximate } = fromHijri(hy, hm, hd);
      if (!inYear(date)) continue;
      const exact = !approximate && !toHijri(date).approximate;
      push(date, title, holiday, "lunar", !exact, { hy, hm, hd, approximate: !exact });
    }
  }

  out.sort((a, b) => a.date.getTime() - b.date.getTime() || Number(b.holiday) - Number(a.holiday));
  cache.set(jy, out);
  return out;
}

function indexOf(jy: number) {
  let map = byKey.get(jy);
  if (!map) {
    map = new Map();
    for (const o of occasionsOf(jy)) map.set(o.key, [...(map.get(o.key) ?? []), o]);
    byKey.set(jy, map);
  }
  return map;
}

/** Occasions of one calendar day. */
export function occasionsOn(date: Date): Occasion[] {
  return indexOf(toJalali(date).jy).get(keyOf(date)) ?? [];
}

/** The built-in provider, keyed by "YYYY-MM-DD". */
export const iranOccasions: OccasionProvider = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return occasionsOn(new Date(y, m - 1, d));
};

/** Official day off (not counting Fridays). */
export function isHoliday(date: Date) {
  return occasionsOn(date).some((o) => o.holiday);
}

export type OffDayOptions = {
  /** Weekdays off, 0 = شنبه … 6 = جمعه. Default [6]. */
  weekend?: number[];
  /** Extra closed days as "YYYY-MM-DD". */
  extra?: string[];
};

/** Weekend, official holiday, or one of `extra`. */
export function isOffDay(date: Date, { weekend = [6], extra = [] }: OffDayOptions = {}) {
  return weekend.includes(jalaliWeekday(date)) || isHoliday(date) || extra.includes(keyOf(date));
}

/** Working days from `a` to `b`, both included. */
export function businessDaysBetween(a: Date, b: Date, opts?: OffDayOptions) {
  let n = 0;
  const [from, to] = a <= b ? [a, b] : [b, a];
  for (let d = new Date(from.getFullYear(), from.getMonth(), from.getDate()); d <= to; d = addDays(d, 1)) {
    if (!isOffDay(d, opts)) n += 1;
  }
  return n;
}

/** Occasions of several years merged into one lookup, for calendar grids. */
export function occasionMap(years: number[]): Map<string, Occasion[]> {
  const map = new Map<string, Occasion[]>();
  for (const jy of years) for (const [k, v] of indexOf(jy)) map.set(k, v);
  return map;
}
