/**
 * Lunar Hijri (هجری قمری) dates as Iran observes them. Iran starts each lunar
 * month by sighting the moon, so no formula gives the official date. Months
 * in IRAN_HIJRI_MONTH_STARTS come from the official calendar (holiday lists
 * of 1404 and 1405, cross-checked against bahesab.ir); outside that table the
 * tabular (civil) algorithm is used and results carry `approximate: true`,
 * which may be one day off. Dependency-free apart from the Jalali converter.
 */
import { fa } from "@/lib/utils";
import { toGregorian } from "@/lib/jalali";

export type HijriDate = { hy: number; hm: number; hd: number; approximate: boolean };

export const HIJRI_MONTHS = ["محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی", "جمادی‌الاول", "جمادی‌الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذی‌القعده", "ذی‌الحجه"];

/**
 * First day of each Hijri month, as a Jalali date [jy, jm, jd], per Iran's
 * official calendar. Extend this table when a new official calendar is out.
 * Sources: the official 1404 and 1405 holiday lists, bahesab.ir month pages.
 */
export const IRAN_HIJRI_MONTH_STARTS: Record<string, [number, number, number]> = {
  "1446-09": [1403, 12, 12],
  "1446-10": [1404, 1, 11],
  "1446-11": [1404, 2, 9],
  "1446-12": [1404, 3, 7],
  "1447-01": [1404, 4, 6],
  "1447-02": [1404, 5, 4],
  "1447-03": [1404, 6, 3],
  "1447-04": [1404, 7, 2],
  "1447-05": [1404, 8, 1],
  "1447-06": [1404, 9, 1],
  "1447-07": [1404, 10, 1],
  "1447-08": [1404, 11, 1],
  "1447-09": [1404, 11, 30],
  "1447-10": [1405, 1, 1],
  "1447-11": [1405, 1, 30],
  "1447-12": [1405, 2, 28],
  "1448-01": [1405, 3, 26],
  "1448-02": [1405, 4, 25],
  "1448-03": [1405, 5, 23],
  "1448-04": [1405, 6, 22],
  "1448-05": [1405, 7, 20],
  "1448-06": [1405, 8, 20],
  "1448-07": [1405, 9, 20],
  "1448-08": [1405, 10, 20],
  "1448-09": [1405, 11, 19],
  "1448-10": [1405, 12, 19],
};

const DAY = 86_400_000;
/** Whole days since 1970-01-01 for the local calendar day of `date`. */
const dayNumber = (date: Date) => Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY);
const fromDayNumber = (n: number) => {
  const u = new Date(n * DAY);
  return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
};

/* ---------- tabular (civil) Hijri, the fallback ---------- */

/** 1 Muharram 1 AH in the civil reckoning (16 July 622, Julian) as a day number. */
const EPOCH = 1948440 - 2440588;

function tabularToDay(hy: number, hm: number, hd: number) {
  return EPOCH + hd - 1 + Math.ceil(29.5 * (hm - 1)) + (hy - 1) * 354 + Math.floor((3 + 11 * hy) / 30);
}

function tabularFromDay(n: number) {
  const hy = Math.floor((30 * (n - EPOCH) + 10646) / 10631);
  const hm = Math.min(12, Math.ceil((n - 29 - tabularToDay(hy, 1, 1)) / 29.5) + 1);
  const hd = n - tabularToDay(hy, hm, 1) + 1;
  return { hy, hm, hd };
}

/* ---------- the official table ---------- */

type Start = { hy: number; hm: number; day: number };

const STARTS: Start[] = Object.entries(IRAN_HIJRI_MONTH_STARTS)
  .map(([k, [jy, jm, jd]]) => {
    const [hy, hm] = k.split("-").map(Number);
    return { hy, hm, day: dayNumber(toGregorian(jy, jm, jd)) };
  })
  .sort((a, b) => a.day - b.day);

const startIndex = (hy: number, hm: number) => STARTS.findIndex((s) => s.hy === hy && s.hm === hm);

/** Hijri date of a calendar day. `approximate` is true outside the official table. */
export function toHijri(date: Date): HijriDate {
  const n = dayNumber(date);
  for (let i = STARTS.length - 1; i >= 0; i -= 1) {
    const s = STARTS[i];
    if (n < s.day) continue;
    const hd = n - s.day + 1;
    // Inside a month whose end we know, or within the first 29 days of the last listed month.
    const end = STARTS[i + 1]?.day;
    if ((end !== undefined && n < end) || (end === undefined && hd <= 29)) return { hy: s.hy, hm: s.hm, hd, approximate: false };
    break;
  }
  return { ...tabularFromDay(n), approximate: true };
}

/** Calendar day of a Hijri date. */
export function fromHijri(hy: number, hm: number, hd: number): { date: Date; approximate: boolean } {
  const i = startIndex(hy, hm);
  if (i >= 0) {
    const known = STARTS[i + 1] ? STARTS[i + 1].day - STARTS[i].day : 29;
    return { date: fromDayNumber(STARTS[i].day + hd - 1), approximate: hd > known };
  }
  return { date: fromDayNumber(tabularToDay(hy, hm, hd)), approximate: true };
}

/** 29 or 30. Exact when the month and the next one are both in the official table. */
export function hijriMonthLength(hy: number, hm: number): number {
  const i = startIndex(hy, hm);
  if (i >= 0 && STARTS[i + 1]) return STARTS[i + 1].day - STARTS[i].day;
  const [ny, nm] = hm === 12 ? [hy + 1, 1] : [hy, hm + 1];
  return tabularToDay(ny, nm, 1) - tabularToDay(hy, hm, 1);
}

/** Whether the official table covers this calendar day. */
export function isHijriVerified(date: Date) {
  return !toHijri(date).approximate;
}

/** «۱۸ ربیع‌الثانی ۱۴۴۸», or without the year. */
export function formatHijri(date: Date, opts: { year?: boolean } = {}) {
  const { hy, hm, hd } = toHijri(date);
  return `${fa(hd)} ${HIJRI_MONTHS[hm - 1]}${opts.year === false ? "" : ` ${fa(hy)}`}`;
}
