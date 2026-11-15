"use client";

import * as React from "react";
import { Accessibility, Clock, MapPin, Ticket, X } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { cn, fa, formatToman } from "@/lib/utils";

type Tier = "vip" | "normal" | "balcony";
const TIERS: Record<Tier, { label: string; price: number; cls: string }> = {
  vip: { label: "ویژه", price: 450_000, cls: "bg-brand/20 border-brand text-brand" },
  normal: { label: "عادی", price: 280_000, cls: "bg-secondary border-border text-foreground" },
  balcony: { label: "بالکن", price: 190_000, cls: "bg-success/15 border-success text-foreground" },
};

const ROWS = 10;
const SEATS = 14;
const AISLE_AFTER = [4, 10];
const MAX = 6;
const shows = ["۱۶:۳۰", "۱۹:۰۰", "۲۱:۴۵"];

const tierOf = (row: number): Tier => (row < 3 ? "vip" : row < 8 ? "normal" : "balcony");
/** Deterministic sold seats so the map looks lived-in without randomness at render. */
const isSold = (row: number, seat: number, show: number) => ((row * 7 + seat * 3 + show * 5) % 11 === 0) || (row === 4 && seat > 5 && seat < 9 && show === 1);
const isWheel = (row: number, seat: number) => row === 7 && (seat === 1 || seat === SEATS);

type Seat = { row: number; seat: number };
const keyOf = (s: Seat) => `${s.row}-${s.seat}`;

/** انتخاب صندلی سینما و کنسرت: نقشه‌ی سالن با ردیف‌ها و قیمت طبقه‌ها، سانس‌ها، سقف ۶ صندلی و خلاصه‌ی خرید. */
export function SeatPickerPage() {
  const [show, setShow] = React.useState(1);
  const [picked, setPicked] = React.useState<Seat[]>([]);
  const [warn, setWarn] = React.useState("");
  const total = picked.reduce((s, p) => s + TIERS[tierOf(p.row)].price, 0);

  function toggle(s: Seat) {
    const k = keyOf(s);
    if (picked.some((p) => keyOf(p) === k)) {
      setPicked(picked.filter((p) => keyOf(p) !== k));
      setWarn("");
    } else if (picked.length >= MAX) {
      setWarn(`هر خرید حداکثر ${fa(MAX)} صندلی میشه.`);
    } else {
      setPicked([...picked, s].sort((a, b) => a.row - b.row || a.seat - b.seat));
      setWarn("");
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-6">
          <div className="flex gap-4">
            <span aria-hidden className="h-28 w-20 shrink-0 rounded-control bg-[linear-gradient(160deg,oklch(0.45_0.12_25),oklch(0.2_0.05_280))] shadow-overlay" />
            <div>
              <p className="text-xs text-muted-foreground">درام · ۱۱۸ دقیقه · رده‌ی سنی ۱۲+</p>
              <h1 className="mt-1 font-display text-2xl font-black">شب‌های روشن شهر</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4" />پردیس سینمایی آزادی، سالن ۲</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="size-4" />پنجشنبه ۲۷ آبان</p>
            </div>
          </div>
          <div role="radiogroup" aria-label="سانس" className="flex gap-2">
            {shows.map((s, i) => (
              <button key={s} type="button" role="radio" aria-checked={show === i} onClick={() => { setShow(i); setPicked([]); }} className={cn("rounded-control border-line px-4 py-2 text-sm font-semibold tabular-nums transition-colors", show === i ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent")}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
        <section aria-label="نقشه‌ی سالن" className="overflow-x-auto rounded-surface border-line border-border bg-card p-4 sm:p-6">
          <div className="mx-auto min-w-[560px] max-w-[720px]">
            <div aria-hidden className="mx-auto mb-1 h-2 w-4/5 rounded-[50%] bg-gradient-to-b from-foreground/40 to-transparent" />
            <p className="mb-8 text-center text-[11px] tracking-widest text-muted-foreground">پرده</p>
            <div className="space-y-1.5">
              {Array.from({ length: ROWS }, (_, r) => (
                <div key={r} className={cn("flex items-center gap-2", r === 3 || r === 8 ? "mt-4" : "")}>
                  <span className="w-6 text-center text-[11px] tabular-nums text-muted-foreground" aria-hidden>{fa(r + 1)}</span>
                  {/* Seat 1 sits on the right, like the numbering on Iranian tickets. */}
                  <div className="flex flex-1 justify-center gap-1" role="group" aria-label={`ردیف ${fa(r + 1)}، ${TIERS[tierOf(r)].label}`}>
                    {Array.from({ length: SEATS }, (_, i) => {
                      const s = { row: r, seat: i + 1 };
                      const sold = isSold(r, s.seat, show);
                      const on = picked.some((p) => keyOf(p) === keyOf(s));
                      const wheel = isWheel(r, s.seat);
                      return (
                        <React.Fragment key={i}>
                          <button
                            type="button"
                            disabled={sold}
                            aria-pressed={on}
                            aria-label={`ردیف ${fa(r + 1)}، صندلی ${fa(s.seat)}${wheel ? "، ویلچر" : ""}${sold ? "، فروخته شده" : ""}`}
                            onClick={() => toggle(s)}
                            className={cn(
                              "flex size-7 items-center justify-center rounded-t-lg rounded-b-sm border text-[10px] tabular-nums transition-transform ease-motion focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                              sold ? "cursor-not-allowed border-transparent bg-muted text-muted-foreground/40" : on ? "scale-110 border-primary bg-primary text-primary-foreground" : cn(TIERS[tierOf(r)].cls, "hover:scale-110"),
                            )}
                          >
                            {sold ? <X className="size-3" /> : wheel ? <Accessibility className="size-3.5" /> : fa(s.seat)}
                          </button>
                          {AISLE_AFTER.includes(i + 1) && <span aria-hidden className="w-4" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <span className="w-6 text-center text-[11px] tabular-nums text-muted-foreground" aria-hidden>{fa(r + 1)}</span>
                </div>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {(Object.keys(TIERS) as Tier[]).map((t) => (
                <li key={t} className="flex items-center gap-1.5"><span className={cn("size-3.5 rounded-sm border", TIERS[t].cls)} />{TIERS[t].label} · {formatToman(TIERS[t].price)}</li>
              ))}
              <li className="flex items-center gap-1.5"><span className="size-3.5 rounded-sm bg-muted" />فروخته شده</li>
              <li className="flex items-center gap-1.5"><span className="size-3.5 rounded-sm bg-primary" />انتخاب شما</li>
            </ul>
          </div>
        </section>

        <aside className="h-fit space-y-4 rounded-surface border-line border-border bg-card p-4 lg:sticky lg:top-4">
          <h2 className="flex items-center gap-2 font-semibold"><Ticket className="size-4" />بلیت‌های شما</h2>
          {picked.length === 0 ? (
            <p className="text-sm text-muted-foreground">روی صندلی‌های خالی بزنید. تا {fa(MAX)} صندلی می‌تونید انتخاب کنید.</p>
          ) : (
            <ul className="divide-y divide-border text-sm" aria-live="polite">
              {picked.map((p) => (
                <li key={keyOf(p)} className="flex items-center justify-between gap-2 py-2">
                  <span>ردیف {fa(p.row + 1)}، صندلی {fa(p.seat)} <span className="text-xs text-muted-foreground">({TIERS[tierOf(p.row)].label})</span></span>
                  <button type="button" aria-label={`حذف ردیف ${fa(p.row + 1)} صندلی ${fa(p.seat)}`} onClick={() => toggle(p)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
          {warn && <p role="alert" className="text-xs text-destructive">{warn}</p>}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">جمع</span>
            <span className="font-display text-lg font-bold">{formatToman(total)}</span>
          </div>
          <Button className="w-full" size="lg" disabled={!picked.length}>ادامه و پرداخت</Button>
          <p className="text-[11px] text-muted-foreground">صندلی‌ها تا ۱۰ دقیقه برای شما نگه داشته میشن.</p>
        </aside>
      </div>
    </div>
  );
}
