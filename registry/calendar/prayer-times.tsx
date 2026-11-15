"use client";

import * as React from "react";
import { MapPin, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import { formatHijri } from "@/lib/hijri";
import { addDays, formatDuration, formatTime, TEHRAN } from "@/lib/calendar-utils";
import { CalendarToolbar, useNow, useToday } from "@/registry/calendar/calendar-core";

export type PrayerLocation = { name: string; lat: number; lng: number; /** Meters above sea level. Official Iranian tables leave it out, so only pass it to match a sea-level-corrected source. */ elevation?: number };

/** Provincial capitals and big cities. Coordinates of the city center. */
export const IRAN_CITIES: PrayerLocation[] = [
  { name: "تهران", lat: 35.6892, lng: 51.389 },
  { name: "مشهد", lat: 36.297, lng: 59.6062 },
  { name: "اصفهان", lat: 32.6539, lng: 51.666 },
  { name: "شیراز", lat: 29.5918, lng: 52.5837 },
  { name: "تبریز", lat: 38.08, lng: 46.2919 },
  { name: "کرج", lat: 35.84, lng: 50.9391 },
  { name: "قم", lat: 34.6399, lng: 50.8759 },
  { name: "اهواز", lat: 31.3183, lng: 48.6706 },
  { name: "کرمانشاه", lat: 34.3142, lng: 47.065 },
  { name: "ارومیه", lat: 37.5527, lng: 45.0761 },
  { name: "رشت", lat: 37.2808, lng: 49.5832 },
  { name: "ساری", lat: 36.5633, lng: 53.0601 },
  { name: "همدان", lat: 34.7983, lng: 48.5148 },
  { name: "یزد", lat: 31.8974, lng: 54.3569 },
  { name: "کرمان", lat: 30.2839, lng: 57.0834 },
  { name: "زاهدان", lat: 29.4963, lng: 60.8629 },
  { name: "بندرعباس", lat: 27.1832, lng: 56.2666 },
  { name: "بوشهر", lat: 28.9234, lng: 50.8203 },
];

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "sunset" | "maghrib" | "midnight";
export type PrayerTimesResult = Record<PrayerKey, Date>;

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: "اذان صبح",
  sunrise: "طلوع آفتاب",
  dhuhr: "اذان ظهر",
  sunset: "غروب آفتاب",
  maghrib: "اذان مغرب",
  midnight: "نیمه‌شب شرعی",
};

/** Sun depression angles of the Institute of Geophysics, University of Tehran. */
export type PrayerMethod = { fajr: number; maghrib: number };
export const TEHRAN_METHOD: PrayerMethod = { fajr: 17.7, maghrib: 4.5 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fix = (a: number, b: number) => ((a % b) + b) % b;

/** Declination and equation of time for a Julian date. */
function sun(jd: number) {
  const D = jd - 2451545;
  const g = fix(357.529 + 0.98560028 * D, 360);
  const q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * D;
  const ra = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15, 24);
  return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - ra };
}

function julian(y: number, m: number, d: number) {
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + (2 - a + Math.floor(a / 4)) - 1524.5;
}

/**
 * Prayer times of one calendar day (the local day of `date`) at a place, as instants.
 * Shia times as published in Iran: Maghrib at 4.5° below the horizon and midnight halfway
 * from sunset to the next Fajr. Accurate to about a minute; official tables may round.
 */
export function prayerTimes(date: Date, loc: PrayerLocation, method: PrayerMethod = TEHRAN_METHOD): PrayerTimesResult {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const jd = julian(y, m, d) - loc.lng / 360;
  const lat = rad(loc.lat);
  const noon = (t: number) => fix(12 - sun(jd + t).eqt, 24);
  const angleTime = (angle: number, t: number, before: boolean) => {
    const { decl } = sun(jd + t);
    const cos = (-Math.sin(rad(angle)) - Math.sin(rad(decl)) * Math.sin(lat)) / (Math.cos(rad(decl)) * Math.cos(lat));
    const T = deg(Math.acos(Math.max(-1, Math.min(1, cos)))) / 15;
    return noon(t) + (before ? -T : T);
  };
  const horizon = 0.833 + 0.0347 * Math.sqrt(loc.elevation ?? 0);
  // One refinement pass from rough guesses (hours / 24) is enough for minute accuracy.
  const h = {
    fajr: angleTime(method.fajr, 5 / 24, true),
    sunrise: angleTime(horizon, 6 / 24, true),
    dhuhr: noon(12 / 24),
    sunset: angleTime(horizon, 18 / 24, false),
    maghrib: angleTime(method.maghrib, 18 / 24, false),
  };
  const midnight = h.sunset + (h.fajr + 24 - h.sunset) / 2;
  // Hours here are local mean solar time; shift to UTC and build real instants.
  const at = (hours: number) => new Date(Date.UTC(y, m - 1, d) + (hours - loc.lng / 15) * 3_600_000);
  return { fajr: at(h.fajr), sunrise: at(h.sunrise), dhuhr: at(h.dhuhr), sunset: at(h.sunset), maghrib: at(h.maghrib), midnight: at(midnight) };
}

const ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"];
const ICON: Record<PrayerKey, typeof Sun> = { fajr: Moon, sunrise: Sunrise, dhuhr: Sun, sunset: Sunset, maghrib: Sunset, midnight: Moon };
const AZAN: PrayerKey[] = ["fajr", "dhuhr", "maghrib"];

function PrayerIcon({ k, className }: { k: PrayerKey; className?: string }) {
  return React.createElement(ICON[k], { className, "aria-hidden": true });
}

export interface PrayerTimesProps {
  /** A city from IRAN_CITIES by name, or any place. Default تهران. */
  location?: string | PrayerLocation;
  /** Lets the user pick another city. Pass a list or true for IRAN_CITIES. */
  cities?: PrayerLocation[] | boolean;
  onLocationChange?: (loc: PrayerLocation) => void;
  /** Day shown. Defaults to today; previous/next buttons move it. */
  date?: Date;
  method?: PrayerMethod;
  timeZone?: string;
  /** Show only the three azan times. */
  azanOnly?: boolean;
  /** «list» rows or a compact «strip» of tiles. */
  variant?: "list" | "strip";
  className?: string;
}

/**
 * اوقات شرعی. Today's azan and sun times for an Iranian city, computed in the browser
 * with the Tehran University method, with the next one highlighted and a live countdown.
 */
export function PrayerTimes({ location = "تهران", cities, onLocationChange, date, method, timeZone = TEHRAN, azanOnly, variant = "list", className }: PrayerTimesProps) {
  const today = useToday();
  const now = useNow();
  const [offset, setOffset] = React.useState(0);
  const list = cities === true ? IRAN_CITIES : cities || null;
  const initial = typeof location === "string" ? IRAN_CITIES.find((c) => c.name === location) ?? IRAN_CITIES[0] : location;
  const [picked, setPicked] = React.useState<PrayerLocation>(initial);
  const loc = list ? picked : initial;
  const day = date ?? addDays(today, offset);
  const times = React.useMemo(() => prayerTimes(day, loc, method), [day, loc, method]);
  const keys = azanOnly ? AZAN : ORDER;
  const next = now ? keys.find((k) => times[k] > now) : undefined;
  const left = next && now ? Math.max(1, Math.ceil((times[next].getTime() - now.getTime()) / 60_000)) : 0;
  const selectId = React.useId();

  const head = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {date ? (
        <div>
          <p className="font-display text-base font-bold">{formatJalali(day, { weekday: true })}</p>
          <p className="text-[11px] text-muted-foreground">{formatHijri(day)}</p>
        </div>
      ) : (
        <CalendarToolbar
          title={formatJalali(day, { weekday: true })}
          subtitle={formatHijri(day)}
          onPrev={() => setOffset((o) => o - 1)}
          onNext={() => setOffset((o) => o + 1)}
          onToday={offset ? () => setOffset(0) : undefined}
          prevLabel="روز قبل"
          nextLabel="روز بعد"
        />
      )}
      {list ? (
        <label htmlFor={selectId} className="flex items-center gap-1.5 text-sm">
          <MapPin className="size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">شهر</span>
          <select
            id={selectId}
            value={loc.name}
            onChange={(e) => {
              const c = list.find((x) => x.name === e.target.value);
              if (c) { setPicked(c); onLocationChange?.(c); }
            }}
            className="h-8 cursor-pointer rounded-field border-line-field border-input bg-field px-2 text-sm shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {list.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </label>
      ) : (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden />{loc.name}</span>
      )}
    </div>
  );

  const countdown = next && offset === 0 && !date && (
    <p className="text-xs text-muted-foreground" aria-live="polite">
      <span className="font-medium text-foreground">{PRAYER_LABELS[next]}</span> {left < 60 ? `${fa(left)} دقیقه` : formatDuration(left)} دیگه
    </p>
  );

  return (
    <section aria-label={`اوقات شرعی ${loc.name}`} className={cn("space-y-3 rounded-surface border-line border-border bg-card p-4", className)}>
      {head}
      {variant === "strip" ? (
        <ol className={cn("grid gap-2", keys.length === 3 ? "grid-cols-3" : "grid-cols-3 sm:grid-cols-6")}>
          {keys.map((k) => {
            const on = k === next && offset === 0 && !date;
            return (
              <li key={k} aria-current={on ? "time" : undefined} className={cn("flex flex-col items-center gap-1 rounded-control border px-2 py-2.5 text-center", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                <PrayerIcon k={k} className={cn("size-4", !on && "text-muted-foreground")} />
                <span className={cn("text-[11px]", !on && "text-muted-foreground")}>{PRAYER_LABELS[k]}</span>
                <span className="text-sm font-bold tabular-nums">{formatTime(times[k], timeZone)}</span>
              </li>
            );
          })}
        </ol>
      ) : (
        <ol className="divide-y divide-border">
          {keys.map((k) => {
            const on = k === next && offset === 0 && !date;
            const past = !!now && offset === 0 && !date && times[k] <= now;
            return (
              <li key={k} aria-current={on ? "time" : undefined} className={cn("flex items-center gap-3 py-2.5", past && "text-muted-foreground")}>
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", on ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                  <PrayerIcon k={k} className="size-4" />
                </span>
                <span className={cn("flex-1 text-sm", AZAN.includes(k) && "font-medium")}>{PRAYER_LABELS[k]}</span>
                {on && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">بعدی</span>}
                <span className="text-sm font-semibold tabular-nums">{formatTime(times[k], timeZone)}</span>
              </li>
            );
          })}
        </ol>
      )}
      {countdown}
    </section>
  );
}
