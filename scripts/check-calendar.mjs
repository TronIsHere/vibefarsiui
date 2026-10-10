// Checks the calendar libs (hijri, iran-holidays, calendar-utils).
// Run: node --experimental-strip-types scripts/check-calendar.mjs
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const root = pathToFileURL(process.cwd() + "/").href;
const hook = `
export async function resolve(spec, ctx, next) {
  if (spec.startsWith("@/")) return next(${JSON.stringify(root)} + spec.slice(2) + ".ts", ctx);
  return next(spec, ctx);
}`;
register("data:text/javascript," + encodeURIComponent(hook));

const { toGregorian, toJalali } = await import("../lib/jalali.ts");
const hijri = await import("../lib/hijri.ts");
const holidays = await import("../lib/iran-holidays.ts");
const cal = await import("../lib/calendar-utils.ts");

let passed = 0;
const check = (name, fn) => {
  fn();
  passed += 1;
  console.log("✓", name);
};

/*
 * Official holidays (day off), as Jalali [month, day].
 * 1404: nabzebourse.com/fa/news/103795 (26 days, matches the official calendar)
 * 1405: nabzebourse.com/fa/news/125689 (26 days), Hijri month starts cross-checked on bahesab.ir/time/140407, 140408, 140507
 */
const OFFICIAL = {
  1404: [[1, 1], [1, 2], [1, 3], [1, 4], [1, 11], [1, 12], [1, 13], [2, 4], [3, 14], [3, 15], [3, 16], [3, 24], [4, 14], [4, 15], [5, 23], [5, 31], [6, 2], [6, 10], [6, 19], [9, 3], [10, 13], [10, 27], [11, 15], [11, 22], [12, 20], [12, 29]],
  1405: [[1, 1], [1, 2], [1, 3], [1, 4], [1, 12], [1, 13], [1, 25], [3, 6], [3, 14], [3, 15], [4, 3], [4, 4], [5, 13], [5, 21], [5, 22], [5, 30], [6, 8], [8, 22], [10, 2], [10, 16], [11, 4], [11, 22], [12, 9], [12, 19], [12, 20], [12, 29]],
};

check("Hijri table months are 29 or 30 days and round-trip", () => {
  for (const k of Object.keys(hijri.IRAN_HIJRI_MONTH_STARTS)) {
    const [hy, hm] = k.split("-").map(Number);
    const len = hijri.hijriMonthLength(hy, hm);
    assert.ok(len === 29 || len === 30, `${k} has ${len} days`);
    for (const hd of [1, 15, 29]) {
      const { date, approximate } = hijri.fromHijri(hy, hm, hd);
      assert.equal(approximate, false);
      const back = hijri.toHijri(date);
      assert.deepEqual([back.hy, back.hm, back.hd, back.approximate], [hy, hm, hd, false], `${k}-${hd}`);
    }
  }
});

check("Known anchors: 1 Mehr 1405 = 11 ربیع‌الثانی 1448, 20 Mehr 1405 = 1 جمادی‌الاول", () => {
  const a = hijri.toHijri(toGregorian(1405, 7, 1));
  assert.deepEqual([a.hy, a.hm, a.hd], [1448, 4, 11]);
  const b = hijri.toHijri(toGregorian(1405, 7, 20));
  assert.deepEqual([b.hy, b.hm, b.hd], [1448, 5, 1]);
  assert.equal(hijri.formatHijri(toGregorian(1405, 7, 1)), "۱۱ ربیع‌الثانی ۱۴۴۸");
});

check("Tabular fallback is within a day outside the table", () => {
  const d = toGregorian(1400, 1, 1);
  const h = hijri.toHijri(d);
  assert.equal(h.approximate, true);
  assert.deepEqual([h.hy, h.hm], [1442, 8]); // 21 Mar 2021 ≈ 7–8 Sha'ban 1442
  assert.ok(Math.abs(h.hd - 8) <= 1);
});

for (const jy of holidays.VERIFIED_JALALI_YEARS) {
  check(`Derived holidays of ${jy} match the official list exactly`, () => {
    const got = [...new Set(holidays.occasionsOf(jy).filter((o) => o.holiday).map((o) => o.key))].map((k) => {
      const { jm, jd } = toJalali(cal.fromKey(k));
      return `${jm}/${jd}`;
    });
    const want = OFFICIAL[jy].map(([m, d]) => `${m}/${d}`);
    assert.deepEqual(got, want);
    assert.ok(holidays.occasionsOf(jy).every((o) => !o.approximate), "no approximate days in a verified year");
  });
}

check("Holiday helpers", () => {
  assert.equal(holidays.isHoliday(toGregorian(1405, 5, 22)), true); // شهادت امام رضا
  assert.equal(holidays.occasionsOn(toGregorian(1405, 5, 22))[0].title, "شهادت امام رضا");
  assert.equal(holidays.isHoliday(toGregorian(1405, 7, 20)), false);
  assert.equal(holidays.isOffDay(toGregorian(1405, 7, 17)), true); // a Friday
  // 1–7 Mehr 1405: Wed..Tue, one Friday → 6 working days.
  assert.equal(holidays.businessDaysBetween(toGregorian(1405, 7, 1), toGregorian(1405, 7, 7)), 6);
  const suri = holidays.occasionsOf(1405).find((o) => o.title === "چهارشنبه‌سوری");
  assert.equal(cal.dayKey(suri.date), cal.dayKey(toGregorian(1405, 12, 25)));
  assert.equal(holidays.iranOccasions(cal.dayKey(toGregorian(1405, 1, 1))).length >= 2, true); // Nowruz + Fetr
  assert.equal(holidays.occasionsOf(1407).some((o) => o.approximate), true);
});

check("Jalali day math", () => {
  const d = cal.addJalaliMonths(toGregorian(1405, 6, 31), 1);
  assert.deepEqual(toJalali(d), { jy: 1405, jm: 7, jd: 30 });
  const e = cal.addJalaliMonths(toGregorian(1405, 1, 31), -2);
  assert.deepEqual(toJalali(e), { jy: 1404, jm: 11, jd: 30 });
  assert.equal(cal.dayKey(cal.startOfJalaliWeek(toGregorian(1405, 7, 17))), cal.dayKey(toGregorian(1405, 7, 11)));
  const grid = cal.monthGrid(1405, 7);
  assert.equal(cal.dayKey(grid[0][0]), cal.dayKey(toGregorian(1405, 6, 28))); // 1 Mehr 1405 is a Wednesday
  assert.equal(cal.monthGrid(1405, 7, { fixedWeeks: true }).length, 6);
  assert.equal(cal.dayLabel(cal.addDays(new Date(), 1)), "فردا");
});

check("Time zone: Tehran is +03:30 now and was +04:30 in summer 2021", () => {
  const t = cal.zonedDate(2026, 10, 12, 9, 30);
  assert.equal(t.toISOString(), "2026-10-12T06:00:00.000Z");
  assert.equal(cal.formatTime(t), "۰۹:۳۰");
  assert.equal(cal.zonedDate(2021, 7, 1, 12, 0).toISOString(), "2021-07-01T07:30:00.000Z");
  assert.equal(cal.minutesOfDay(t), 570);
  assert.equal(cal.formatDuration(90), "۱ ساعت و ۳۰ دقیقه");
});

check("layoutTimed puts overlapping events in columns", () => {
  const key = "2026-10-12";
  const ev = (id, a, b) => ({ id, title: id, start: cal.atMinutes(key, a), end: cal.atMinutes(key, b) });
  const boxes = cal.layoutTimed([ev("a", 540, 600), ev("b", 570, 630), ev("c", 600, 660), ev("d", 720, 780)], key, undefined, { startHour: 8, endHour: 20 });
  const by = Object.fromEntries(boxes.map((b) => [b.event.id, b]));
  assert.equal(by.a.cols, 2);
  assert.equal(by.b.col, 1);
  assert.equal(by.c.col, 0); // reuses a's column
  assert.equal(by.d.cols, 1);
  assert.equal(by.a.top, (540 - 480) / 720);
});

check("layoutSpans stacks multi-day bars", () => {
  const days = cal.weekDates(toGregorian(1405, 7, 12)).map(cal.dayKey);
  const all = (id, a, b) => ({ id, title: id, allDay: true, start: cal.fromKey(days[a]), end: cal.addDays(cal.fromKey(days[b]), 1) });
  const bars = cal.layoutSpans([all("x", 0, 2), all("y", 1, 3), all("z", 3, 4)], days);
  const by = Object.fromEntries(bars.map((b) => [b.event.id, b]));
  assert.deepEqual([by.x.from, by.x.to, by.x.lane], [0, 2, 0]);
  assert.equal(by.y.lane, 1);
  assert.equal(by.z.lane, 0);
});

check("generateSlots respects busy, capacity and past", () => {
  const key = "2026-10-12";
  const now = cal.atMinutes(key, 600);
  const slots = cal.generateSlots({ key, open: [["09:00", "12:00"]], duration: 60, busy: [{ start: cal.atMinutes(key, 660), end: cal.atMinutes(key, 720) }], capacity: 1, now });
  assert.deepEqual(slots.map((s) => s.state), ["past", "free", "full"]);
  const two = cal.generateSlots({ key, open: [["09:00", "10:00"]], duration: 30, capacity: 2, busy: [{ start: cal.atMinutes(key, 540), end: cal.atMinutes(key, 570) }], now: cal.atMinutes(key, 0) });
  assert.deepEqual(two.map((s) => s.left), [1, 2]);
});

check("timeScale runs right to left", () => {
  const s = cal.timeScale(new Date(2026, 0, 1), new Date(2026, 0, 11), 1000);
  assert.equal(s.x(new Date(2026, 0, 1)), 1000);
  assert.equal(s.x(new Date(2026, 0, 11)), 0);
  assert.equal(Math.round(s.perDay), 100);
});

console.log(`\n${passed} checks passed`);
