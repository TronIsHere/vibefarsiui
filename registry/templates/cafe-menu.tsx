"use client";

import * as React from "react";
import { BellRing, Check, Flame, Leaf, Minus, Plus, Wifi } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { cn, fa, faNumber, formatToman } from "@/lib/utils";

type Item = { id: string; name: string; desc: string; price: number; tags?: ("hot" | "veg" | "new")[]; soldOut?: boolean; hue: number };
type Section = { id: string; title: string; items: Item[] };

const menu: Section[] = [
  {
    id: "coffee",
    title: "قهوه",
    items: [
      { id: "esp", name: "اسپرسو", desc: "دوبل، عربیکا ۷۰٪", price: 85_000, hue: 40 },
      { id: "lat", name: "لاته", desc: "اسپرسو با شیر بخارداده", price: 125_000, hue: 55 },
      { id: "spl", name: "اسپنیش لاته", desc: "با شیر عسلی، شیرین", price: 145_000, tags: ["new"], hue: 60 },
      { id: "v60", name: "دمی V60", desc: "دانه‌ی تک‌خاستگاه اتیوپی", price: 150_000, hue: 30 },
    ],
  },
  {
    id: "cold",
    title: "نوشیدنی سرد",
    items: [
      { id: "ice", name: "آیس آمریکانو", desc: "اسپرسو روی یخ", price: 95_000, hue: 210 },
      { id: "lem", name: "لیموناد نعناع", desc: "لیموی تازه و نعناع", price: 110_000, tags: ["veg"], hue: 120 },
      { id: "shk", name: "شیک شکلات", desc: "بستنی وانیلی و شکلات تلخ", price: 165_000, soldOut: true, hue: 20 },
    ],
  },
  {
    id: "food",
    title: "صبحانه و غذا",
    items: [
      { id: "omt", name: "املت ایرانی", desc: "گوجه‌ی تازه، با نان سنگک", price: 180_000, tags: ["hot", "veg"], hue: 10 },
      { id: "pan", name: "پنکیک", desc: "با عسل و کره و میوه‌ی فصل", price: 210_000, hue: 35 },
      { id: "snd", name: "ساندویچ مرغ", desc: "مرغ گریل، پستو، نان چاباتا", price: 235_000, tags: ["hot"], hue: 25 },
    ],
  },
  {
    id: "dessert",
    title: "دسر",
    items: [
      { id: "chz", name: "چیزکیک", desc: "نیویورکی با سس توت‌فرنگی", price: 140_000, hue: 350 },
      { id: "brw", name: "براونی", desc: "گرم، با یک اسکوپ بستنی", price: 130_000, tags: ["hot"], hue: 15 },
    ],
  },
];

const TAGS = {
  hot: { label: "گرم", icon: Flame, cls: "text-destructive" },
  veg: { label: "گیاهی", icon: Leaf, cls: "text-success" },
  new: { label: "جدید", icon: null, cls: "text-brand" },
} as const;

/** منوی کافه با QR: دسته‌های چسبان، افزودن به سفارش میز، فراخوان گارسون و رمز وای‌فای. */
export function CafeMenu() {
  const [cart, setCart] = React.useState<Record<string, number>>({ lat: 1 });
  const [active, setActive] = React.useState(menu[0].id);
  const [sent, setSent] = React.useState(false);
  const [called, setCalled] = React.useState(false);
  const items = menu.flatMap((s) => s.items);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((s, [id, n]) => s + (items.find((i) => i.id === id)?.price ?? 0) * n, 0);
  const add = (id: string, d: number) => {
    setSent(false);
    setCart((c) => {
      const n = Math.max(0, (c[id] ?? 0) + d);
      const next = { ...c, [id]: n };
      if (!n) delete next[id];
      return next;
    });
  };

  React.useEffect(() => {
    const els = menu.map((s) => document.getElementById(`menu-${s.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setActive(top.target.id.replace("menu-", ""));
    }, { rootMargin: "-120px 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto max-w-lg">
        <header className="relative overflow-hidden px-5 pb-5 pt-8">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,oklch(0.75_0.12_60/35%),transparent_60%)]" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">خوش اومدید به</p>
              <h1 className="font-display text-3xl font-black">کافه نارنج</h1>
              <p className="mt-1 text-sm text-muted-foreground">هر روز ۸ صبح تا ۱۱ شب</p>
            </div>
            <span className="rounded-surface border-line border-border bg-card px-3 py-2 text-center">
              <span className="block text-[10px] text-muted-foreground">میز</span>
              <span className="block font-display text-2xl font-black leading-none">{fa(7)}</span>
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant={called ? "secondary" : "outline"} onClick={() => setCalled(true)} aria-live="polite">
              {called ? <Check /> : <BellRing />}
              {called ? "گارسون در راهه" : "صدا زدن گارسون"}
            </Button>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-control border-line border-border px-3 text-[13px]">
              <Wifi className="size-4 text-muted-foreground" />
              <bdi dir="ltr" className="font-mono text-xs">naranj-guest · cafe1403</bdi>
            </span>
          </div>
        </header>

        <nav aria-label="دسته‌های منو" className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
          <ul className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
            {menu.map((s) => (
              <li key={s.id}>
                <a
                  href={`#menu-${s.id}`}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn("block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors", active === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {menu.map((s) => (
          <section key={s.id} id={`menu-${s.id}`} aria-labelledby={`h-${s.id}`} className="scroll-mt-14 px-4 pt-6">
            <h2 id={`h-${s.id}`} className="mb-2 font-display text-lg font-bold">{s.title}</h2>
            <ul className="divide-y divide-border">
              {s.items.map((it) => {
                const n = cart[it.id] ?? 0;
                return (
                  <li key={it.id} className={cn("flex gap-3 py-3", it.soldOut && "opacity-50")}>
                    <span aria-hidden className="size-20 shrink-0 rounded-surface" style={{ background: `radial-gradient(circle at 35% 30%, oklch(0.85 0.08 ${it.hue}), oklch(0.55 0.12 ${it.hue}))` }} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-semibold">{it.name}</h3>
                        {it.tags?.map((t) => {
                          const tag = TAGS[t];
                          return (
                            <Badge key={t} variant="outline" className={cn("gap-1", tag.cls)}>
                              {tag.icon && <tag.icon className="size-3" />}
                              {tag.label}
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{it.desc}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="text-sm font-bold">{faNumber(it.price / 1000)} <span className="text-[11px] font-normal text-muted-foreground">هزار تومان</span></span>
                        {it.soldOut ? (
                          <span className="text-xs text-muted-foreground">تموم شده</span>
                        ) : n ? (
                          <div className="flex items-center gap-2" role="group" aria-label={`تعداد ${it.name}`}>
                            <Button size="icon" variant="outline" className="size-8" aria-label="یکی بیشتر" onClick={() => add(it.id, 1)}><Plus /></Button>
                            <span className="w-4 text-center text-sm font-bold tabular-nums" aria-live="polite">{fa(n)}</span>
                            <Button size="icon" variant="outline" className="size-8" aria-label="یکی کمتر" onClick={() => add(it.id, -1)}><Minus /></Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => add(it.id, 1)} aria-label={`افزودن ${it.name}`}><Plus />افزودن</Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <p className="px-4 pt-8 text-center text-xs text-muted-foreground">قیمت‌ها با ۱۰٪ ارزش افزوده است. حساب را سر صندوق تسویه کنید.</p>
      </div>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 p-3">
          <div className="mx-auto flex max-w-lg items-center gap-3 rounded-overlay bg-primary p-2 ps-4 text-primary-foreground shadow-overlay">
            <div className="min-w-0 flex-1" aria-live="polite">
              <p className="text-sm font-bold">{sent ? "سفارش به آشپزخانه رسید" : `${fa(count)} قلم برای میز ${fa(7)}`}</p>
              <p className="text-xs opacity-75">{formatToman(total)}</p>
            </div>
            <Button variant="secondary" onClick={() => setSent(true)} disabled={sent}>{sent ? <><Check />ثبت شد</> : "ارسال سفارش"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
