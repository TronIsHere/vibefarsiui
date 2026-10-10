---
name: jalali-calendar
description: >
  Handle dates and times for Iranian users: the Jalali / Solar Hijri calendar
  (تقویم شمسی، هجری خورشیدی), Saturday-first weeks, Tehran time (+03:30, no
  DST), Persian month and weekday names, formatting, storage, ranges, reports
  and holidays. Use whenever a date, time, calendar, date picker, deadline,
  booking, report period or age appears in a Persian (Farsi) product, or the
  user says تاریخ شمسی، تقویم فارسی، jalali، شنبه، نوروز.
---

# Jalali calendar (تقویم شمسی)

Iran runs on the Solar Hijri (Jalali) calendar. Users think in it, laws and
invoices use it, fiscal years follow it. Gregorian is for storage and APIs
only. Getting this wrong is visible on every screen with a date.

## 1. The calendar in one table

| Month | Name | Days |
|---|---|---|
| 1 | فروردین | 31 |
| 2 | اردیبهشت | 31 |
| 3 | خرداد | 31 |
| 4 | تیر | 31 |
| 5 | مرداد | 31 |
| 6 | شهریور | 31 |
| 7 | مهر | 30 |
| 8 | آبان | 30 |
| 9 | آذر | 30 |
| 10 | دی | 30 |
| 11 | بهمن | 30 |
| 12 | اسفند | 29, or 30 in a leap year |

- The year starts at Nowruz (نوروز), the March equinox, on 20 or 21 March.
- Year 1405 began on 21 March 2026. As a sanity anchor: 20 September 2026 is
  ۲۹ شهریور ۱۴۰۵.
- Leap years do not follow a simple `% 4` rule; use a tested conversion
  algorithm (VibeFarsi ships `lib/jalali.ts`, dependency-free and verified).
  Do not implement leap logic from memory.

## 2. Week and weekend

- The week starts on **Saturday (شنبه)**. Calendars, date pickers, weekly
  charts and "this week" ranges all start on Saturday, never Monday.
- Weekday order: شنبه، یکشنبه، دوشنبه، سه‌شنبه، چهارشنبه، پنجشنبه، جمعه.
- Friday is the weekend. Many offices close Thursday afternoon or all day.
  "Business days" means Saturday–Wednesday (or Thursday, ask the user).
- `Intl` locales for `fa-IR` already report Saturday as the first day; do not
  override it with a Monday-first library default.

## 3. Time zone

- Iran is UTC+03:30 all year. Daylight saving was abolished; do not apply a
  summer offset.
- IANA zone: `Asia/Tehran`. Store instants in UTC (ISO 8601) and convert to
  `Asia/Tehran` for display.
- Half-hour offset means naive "round to the hour" logic breaks; always convert
  through the zone, never by adding hours.

## 4. Storage and transport

- Database and API: ISO 8601 / Unix time, Gregorian, UTC. Never store a Jalali
  string as the source of truth.
- Convert to Jalali at the edge (server render or client display).
- If a Jalali date must travel (a filter param, a form field), send it as
  `1405-06-29` with Latin digits, and validate it with a converter round-trip.
- Birth dates and contract dates entered in Jalali are converted once on
  input; keep the original Jalali string only for display audit if needed.

## 5. Display formats

| Context | Format | Example |
|---|---|---|
| Short numeric | `yyyy/mm/dd` with Persian digits | ۱۴۰۵/۰۶/۲۹ |
| Long | day, month name, year | ۲۹ شهریور ۱۴۰۵ |
| With weekday | weekday first | یکشنبه ۲۹ شهریور ۱۴۰۵ |
| Time | 24-hour, Persian digits | ۱۴:۳۰ |
| Date and time | date، ساعت time | ۲۹ شهریور ۱۴۰۵، ساعت ۱۴:۳۰ |
| Relative | Persian words | «۲ ساعت پیش»، «دیروز»، «فردا»، «۳ روز دیگر» |
| Range | «از … تا …» | از ۱ مهر تا ۱۵ مهر ۱۴۰۵ |
| Month label in charts | month name (+ year if it changes) | مهر، آبان، آذر ۱۴۰۵ |

- Persian digits everywhere the user reads; Latin digits in values.
- Month names are never translated or transliterated; take them from a table.
- Never show «Sep 20, 2026» to an Iranian user, even as a secondary line,
  unless the product is bilingual by design.

## 6. Using `Intl` correctly

`Intl.DateTimeFormat` with the Persian calendar is fine for labels:

```ts
new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  dateStyle: "long",
  timeZone: "Asia/Tehran",
}).format(date); // «۲۹ شهریور ۱۴۰۵»

// Latin digits when you need them (inputs, logs):
new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", { dateStyle: "short" }).format(date);
```

Limits: `Intl` formats but does not give you year/month/day integers for
arithmetic, month grids or validation. For a date picker, ranges, "add one
month", leap checks and age, use a converter (`toJalali` / `toGregorian`).

## 7. Date pickers and ranges

- Grid starts on Saturday; header shows «مهر ۱۴۰۵»; navigation arrows flip
  in RTL (previous month points right, next points left).
- Today, selected and disabled states are visible without color alone.
- Range picker: start and end inclusive, «از تاریخ / تا تاریخ» labels,
  presets like «۷ روز گذشته»، «این ماه»، «ماه گذشته» computed in Jalali.
- Typing is allowed with Persian or Latin digits and `/` or `-` separators;
  normalize before parsing.
- Min/max and disabled days (Fridays, holidays) are data, not hard-coded.

## 8. Reports, fiscal periods, age

- Monthly reports group by Jalali month, not Gregorian; quarterly = بهار،
  تابستان، پاییز، زمستان.
- Fiscal year for most Iranian companies is the Jalali year (1 فروردین to
  29/30 اسفند). Ask before assuming otherwise.
- Age and durations: compute from the Gregorian instants, then say it in
  Persian: «۲۴ سال»، «۳ ماه و ۱۰ روز».
- «سال ۱۴۰۵» in prose, «۱۴۰۵» in tables; never «۰۵».

## 9. Holidays

- Fixed Jalali holidays exist (Nowruz 1–4 فروردین, 12 and 13 فروردین,
  14 and 15 خرداد, 22 بهمن, 29 اسفند), but most public holidays are religious
  and follow the **lunar** calendar, so they move ~11 days earlier every year.
- Never hard-code a full holiday list from memory. Load it from an official
  calendar source the user provides or an API, keyed by Gregorian date, and
  cache per year.
- VibeFarsi ships this as data you can audit: the `hijri` lib holds Iran's
  official lunar month starts (moon sighting, so no formula is exact) and the
  `iran-holidays` lib derives every holiday from rules on top of it. Jalali
  1404 and 1405 match the official calendar day for day; other years are
  computed and lunar days are flagged `approximate`, so show «تقریبی».
- Mark holidays in the picker as data (`disabled` + a tooltip with the name).

## 10. Checklist

1. Storage Gregorian/UTC; display Jalali via a converter.
2. Week starts Saturday; Friday is the weekend.
3. `Asia/Tehran`, +03:30, no DST.
4. Persian digits and month names in every visible date.
5. Formats from section 5; no English month names.
6. Leap years from the algorithm, not `% 4`.
7. Holidays from data, not memory.
