"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpLeft, Search, Star } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { cn, fa, faNumber, faPercent } from "@/lib/utils";

type Market = { sym: string; name: string; price: number; change: number; volume: number; decimals: number };

const markets: Market[] = [
  { sym: "BTC", name: "بیت‌کوین", price: 6_420_000_000, change: 2.4, volume: 182_000_000_000, decimals: 6 },
  { sym: "ETH", name: "اتریوم", price: 238_500_000, change: -1.2, volume: 96_000_000_000, decimals: 4 },
  { sym: "USDT", name: "تتر", price: 72_350, change: 0.3, volume: 410_000_000_000, decimals: 2 },
  { sym: "TON", name: "تون‌کوین", price: 395_000, change: 5.8, volume: 24_000_000_000, decimals: 2 },
  { sym: "SOL", name: "سولانا", price: 11_200_000, change: -3.6, volume: 31_000_000_000, decimals: 3 },
  { sym: "DOGE", name: "دوج‌کوین", price: 12_400, change: 1.1, volume: 8_000_000_000, decimals: 0 },
];

/** Deterministic walk so the chart is the same on server and client. */
function series(seed: number, n = 64) {
  let v = 100, s = seed;
  return Array.from({ length: n }, () => {
    s = (s * 9301 + 49297) % 233280;
    v += (s / 233280 - 0.48) * 3;
    return v;
  });
}

const compact = (n: number) => (n >= 1e9 ? `${faNumber(Math.round(n / 1e8) / 10)} میلیارد` : n >= 1e6 ? `${faNumber(Math.round(n / 1e5) / 10)} میلیون` : faNumber(n));

/** صرافی رمزارز: فهرست بازارها، نمودار قیمت که زمانش از راست به چپ میره، دفتر سفارش و فرم خرید و فروش تومانی. */
export function CryptoExchange() {
  const [sym, setSym] = React.useState("BTC");
  const [side, setSide] = React.useState("buy");
  const [q, setQ] = React.useState("");
  const [fav, setFav] = React.useState<string[]>(["BTC", "USDT"]);
  const [amount, setAmount] = React.useState("");
  const [placed, setPlaced] = React.useState<string | null>(null);
  const m = markets.find((x) => x.sym === sym)!;
  const balance = side === "buy" ? 48_500_000 : 0.0125;
  const pts = React.useMemo(() => series(m.sym.charCodeAt(0) * 17 + m.sym.length), [m.sym]);
  const min = Math.min(...pts), max = Math.max(...pts);
  // Newest point on the left: time runs right to left like the rest of the chart kit.
  const path = pts.map((v, i) => `${i ? "L" : "M"}${100 - (i / (pts.length - 1)) * 100},${40 - ((v - min) / (max - min || 1)) * 36 - 2}`).join(" ");
  const up = m.change >= 0;
  const amt = Number(amount.replace(/[^\d.]/g, "")) || 0;
  const total = side === "buy" ? amt : amt * m.price;
  const fee = total * 0.0035;

  const book = (dir: 1 | -1) => Array.from({ length: 7 }, (_, i) => {
    const price = Math.round(m.price * (1 + dir * (i + 1) * 0.0007));
    const size = ((i * 37 + m.sym.length * 13) % 50) / 10 + 0.4;
    return { price, size };
  });
  const asks = book(1).reverse();
  const bids = book(-1);
  const maxSize = Math.max(...[...asks, ...bids].map((r) => r.size));

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="font-display text-lg font-black">صرافی نوین</span>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-muted-foreground sm:inline">موجودی:</span>
          <span className="font-semibold">{faNumber(48_500_000)} تومان</span>
          <Button size="sm" variant="secondary">واریز</Button>
        </div>
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-[260px_1fr_300px]">
        <aside className="rounded-surface border-line border-border bg-card" aria-label="بازارها">
          <label className="relative block border-b border-border p-2">
            <span className="sr-only">جست‌وجوی بازار</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو" className="h-9 w-full rounded-field bg-secondary ps-8 pe-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
          </label>
          <ul className="max-h-[420px] overflow-y-auto">
            {markets.filter((x) => !q || x.name.includes(q) || x.sym.toLowerCase().includes(q.toLowerCase())).map((x) => (
              <li key={x.sym} className={cn("flex items-center gap-1 pe-3", x.sym === sym && "bg-accent")}>
                <button type="button" aria-label={fav.includes(x.sym) ? "حذف از نشان‌شده‌ها" : "نشان کردن"} aria-pressed={fav.includes(x.sym)} onClick={() => setFav((f) => (f.includes(x.sym) ? f.filter((s) => s !== x.sym) : [...f, x.sym]))} className="p-2 text-muted-foreground">
                  <Star className={cn("size-3.5", fav.includes(x.sym) && "fill-warning text-warning")} />
                </button>
                <button type="button" onClick={() => { setSym(x.sym); setPlaced(null); }} aria-current={x.sym === sym ? "true" : undefined} className="flex min-w-0 flex-1 items-center justify-between gap-2 py-2.5 text-start">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{x.name}</span>
                    <bdi dir="ltr" className="block text-[11px] text-muted-foreground">{x.sym}/IRT</bdi>
                  </span>
                  <span className="text-end">
                    <span className="block text-xs tabular-nums">{faNumber(x.price)}</span>
                    <span dir="ltr" className={cn("block text-[11px] tabular-nums", x.change >= 0 ? "text-success" : "text-destructive")}>{x.change >= 0 ? "+" : ""}{faPercent(x.change, 1)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="space-y-4">
          <section className="rounded-surface border-line border-border bg-card p-4" aria-label={`نمودار ${m.name}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-sm text-muted-foreground">{m.name} <bdi dir="ltr">{m.sym}/IRT</bdi></h1>
                <p className="font-display text-3xl font-black tabular-nums">{faNumber(m.price)} <span className="text-sm font-normal text-muted-foreground">تومان</span></p>
              </div>
              <dl className="flex gap-5 text-xs">
                <div><dt className="text-muted-foreground">تغییر ۲۴ ساعت</dt><dd dir="ltr" className={cn("text-end font-semibold tabular-nums", up ? "text-success" : "text-destructive")}>{up ? "+" : ""}{faPercent(m.change, 1)}</dd></div>
                <div><dt className="text-muted-foreground">حجم ۲۴ ساعت</dt><dd className="font-semibold">{compact(m.volume)} تومان</dd></div>
              </dl>
            </div>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-4 h-56 w-full" role="img" aria-label={`قیمت ${m.name} در ۲۴ ساعت گذشته، ${up ? "رو به بالا" : "رو به پایین"}`}>
              <defs>
                <linearGradient id="cx-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={up ? "var(--success)" : "var(--destructive)"} stopOpacity="0.3" />
                  <stop offset="1" stopColor={up ? "var(--success)" : "var(--destructive)"} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${path} L0,40 L100,40 Z`} fill="url(#cx-fill)" />
              <path d={path} fill="none" stroke={up ? "var(--success)" : "var(--destructive)"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>۲۴ ساعت پیش</span><span>الان</span></div>
          </section>

          <section className="rounded-surface border-line border-border bg-card p-4" aria-label="دفتر سفارش">
            <div className="mb-2 grid grid-cols-2 text-[11px] text-muted-foreground"><span>قیمت (تومان)</span><span className="text-end">مقدار ({m.sym})</span></div>
            <ul className="space-y-px text-xs tabular-nums">
              {asks.map((r) => (
                <li key={r.price} className="relative grid grid-cols-2 py-1">
                  <span aria-hidden className="absolute inset-y-0 end-0 bg-destructive/10" style={{ width: `${(r.size / maxSize) * 100}%` }} />
                  <span className="relative text-destructive">{faNumber(r.price)}</span><span className="relative text-end">{fa(r.size.toFixed(2))}</span>
                </li>
              ))}
              <li className={cn("py-2 text-center text-sm font-bold", up ? "text-success" : "text-destructive")}>{faNumber(m.price)}</li>
              {bids.map((r) => (
                <li key={r.price} className="relative grid grid-cols-2 py-1">
                  <span aria-hidden className="absolute inset-y-0 end-0 bg-success/10" style={{ width: `${(r.size / maxSize) * 100}%` }} />
                  <span className="relative text-success">{faNumber(r.price)}</span><span className="relative text-end">{fa(r.size.toFixed(2))}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <aside className="h-fit space-y-4 rounded-surface border-line border-border bg-card p-4" aria-label="ثبت سفارش">
          <SegmentedControl fullWidth value={side} onChange={(v) => { setSide(v); setAmount(""); setPlaced(null); }} options={[{ value: "buy", label: "خرید" }, { value: "sell", label: "فروش" }]} aria-label="نوع سفارش" />
          <div>
            <label htmlFor="cx-amount" className="text-sm font-medium">{side === "buy" ? "مبلغ (تومان)" : `مقدار (${m.sym})`}</label>
            <input id="cx-amount" inputMode="decimal" dir="ltr" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="mt-1.5 h-11 w-full rounded-field border-line-field border-input bg-field px-3 text-end font-mono shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
            <p className="mt-1.5 text-xs text-muted-foreground">موجودی: {side === "buy" ? `${faNumber(balance)} تومان` : `${fa(balance)} ${m.sym}`}</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[25, 50, 75, 100].map((p) => (
              <button key={p} type="button" onClick={() => setAmount(String(side === "buy" ? Math.floor((balance * p) / 100) : +((balance * p) / 100).toFixed(m.decimals)))} className="rounded-control border-line border-border py-1.5 text-xs hover:bg-accent">{faPercent(p)}</button>
            ))}
          </div>
          <dl className="space-y-1.5 border-t border-border pt-3 text-xs">
            <div className="flex justify-between"><dt className="text-muted-foreground">{side === "buy" ? "دریافتی تقریبی" : "دریافتی (تومان)"}</dt><dd className="font-semibold tabular-nums">{side === "buy" ? `${fa((amt / m.price).toFixed(m.decimals))} ${m.sym}` : faNumber(Math.round(total - fee))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">کارمزد (۰٫۳۵٪)</dt><dd className="tabular-nums">{faNumber(Math.round(fee))} تومان</dd></div>
          </dl>
          <Button className={cn("w-full", side === "buy" ? "bg-success text-white hover:bg-success/90" : "")} variant={side === "buy" ? "default" : "destructive"} size="lg" disabled={!amt} onClick={() => setPlaced(side === "buy" ? `سفارش خرید ${m.name} ثبت شد.` : `سفارش فروش ${m.name} ثبت شد.`)}>
            {side === "buy" ? <ArrowDownLeft /> : <ArrowUpLeft />}
            {side === "buy" ? `خرید ${m.name}` : `فروش ${m.name}`}
          </Button>
          {placed && <p role="status" className="text-xs text-success">{placed}</p>}
          <p className="text-[11px] leading-5 text-muted-foreground">قیمت‌ها نمونه هستن. معامله‌ی رمزارز ریسک بالایی داره.</p>
        </aside>
      </div>
    </div>
  );
}
