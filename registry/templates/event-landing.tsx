"use client";

import * as React from "react";
import { CalendarDays, Check, Clock, MapPin, Mic2, Minus, Plus, Ticket, Users } from "lucide-react";
import { Accordion } from "@/registry/ui/accordion";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Countdown } from "@/registry/ui/countdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { toGregorian } from "@/lib/jalali";
import { atMinutes, dayKey } from "@/lib/calendar-utils";
import { cn, fa, formatToman } from "@/lib/utils";

const EVENT_DAY = toGregorian(1405, 9, 18);
const START = atMinutes(dayKey(EVENT_DAY), 9 * 60);

const speakers = [
  { name: "سارا محمدی", role: "مدیر محصول، فروشگاه آنلاین", topic: "محصول در بازار تحریم" },
  { name: "امیر حسینی", role: "مهندس ارشد زیرساخت", topic: "مقیاس‌پذیری در شب یلدا" },
  { name: "نگار رحیمی", role: "پژوهشگر تجربه‌ی کاربر", topic: "کاربر ایرانی چه می‌خواد؟" },
  { name: "کیان مرادی", role: "بنیان‌گذار استارتاپ هوش مصنوعی", topic: "مدل‌های زبانی فارسی" },
  { name: "مریم کاظمی", role: "سرمایه‌گذار خطرپذیر", topic: "جذب سرمایه در ۱۴۰۵" },
  { name: "رضا نوری", role: "طراح سیستم طراحی", topic: "راست‌چین از روز اول" },
];

const agenda: Record<string, { time: string; title: string; who?: string; hall: string; kind?: "break" }[]> = {
  d1: [
    { time: "۰۹:۰۰", title: "ثبت‌نام و پذیرایی", hall: "لابی", kind: "break" },
    { time: "۱۰:۰۰", title: "محصول در بازار تحریم", who: "سارا محمدی", hall: "سالن اصلی" },
    { time: "۱۱:۰۰", title: "مقیاس‌پذیری در شب یلدا", who: "امیر حسینی", hall: "سالن اصلی" },
    { time: "۱۲:۳۰", title: "ناهار و شبکه‌سازی", hall: "حیاط", kind: "break" },
    { time: "۱۴:۰۰", title: "کاربر ایرانی چه می‌خواد؟", who: "نگار رحیمی", hall: "سالن ۲" },
  ],
  d2: [
    { time: "۰۹:۳۰", title: "مدل‌های زبانی فارسی", who: "کیان مرادی", hall: "سالن اصلی" },
    { time: "۱۱:۰۰", title: "جذب سرمایه در ۱۴۰۵", who: "مریم کاظمی", hall: "سالن اصلی" },
    { time: "۱۲:۳۰", title: "ناهار", hall: "حیاط", kind: "break" },
    { time: "۱۴:۰۰", title: "راست‌چین از روز اول", who: "رضا نوری", hall: "سالن ۲" },
    { time: "۱۶:۰۰", title: "پنل پایانی و اختتامیه", hall: "سالن اصلی" },
  ],
};

const tickets = [
  { id: "student", name: "دانشجویی", price: 950_000, perks: ["ورود هر دو روز", "پذیرایی"], note: "با کارت دانشجویی معتبر" },
  { id: "regular", name: "عادی", price: 1_900_000, perks: ["ورود هر دو روز", "پذیرایی و ناهار", "گواهی حضور"], popular: true },
  { id: "vip", name: "ویژه", price: 4_500_000, perks: ["همه‌ی امکانات عادی", "صندلی ردیف اول", "شام با سخنران‌ها"], left: 12 },
];

const faq = [
  { id: "a", title: "بلیت قابل استرداد هست؟", content: "تا ۷ روز قبل از رویداد با کسر ۱۰٪ کامل برمی‌گرده. بعد از اون می‌تونید به اسم کس دیگه‌ای منتقلش کنید." },
  { id: "b", title: "ویدئوی ارائه‌ها منتشر میشه؟", content: "بله، دو هفته بعد برای همه‌ی خریدارها فرستاده میشه." },
  { id: "c", title: "پارکینگ داره؟", content: "پارکینگ عمومی کنار سالن هست، ولی با مترو راحت‌ترید: ایستگاه دانشگاه، ۵ دقیقه پیاده." },
];

/** لندینگ رویداد: هیرو با شمارش معکوس، سخنران‌ها، برنامه‌ی دو روزه در تب، بلیت با تعداد، سؤال‌های متداول و جای حامی‌ها. */
export function EventLanding() {
  const [ticket, setTicket] = React.useState("regular");
  const [qty, setQty] = React.useState(1);
  const chosen = tickets.find((t) => t.id === ticket)!;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,oklch(0.55_0.2_290/45%),transparent),radial-gradient(ellipse_60%_50%_at_10%_100%,oklch(0.65_0.18_200/35%),transparent)]" />
        <div aria-hidden className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center">
          <Badge variant="brand">ششمین دوره</Badge>
          <h1 className="mt-4 font-display text-5xl font-black sm:text-7xl">همایش وب فارسی</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">دو روز گفت‌وگو درباره‌ی ساختن محصول برای کاربر فارسی‌زبان، با ۱۸ سخنران و هزار شرکت‌کننده.</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <li className="flex items-center gap-1.5"><CalendarDays className="size-4 text-muted-foreground" />۱۸ و ۱۹ آذر ۱۴۰۵</li>
            <li className="flex items-center gap-1.5"><MapPin className="size-4 text-muted-foreground" />تهران، مرکز همایش‌ها</li>
            <li className="flex items-center gap-1.5"><Users className="size-4 text-muted-foreground" />{fa(1000)} نفر</li>
          </ul>
          <div className="mx-auto mt-10 max-w-md"><Countdown target={START} size="md" /></div>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" onClick={() => document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" })}><Ticket />خرید بلیت</Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" })}>برنامه</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16" aria-labelledby="speakers-h">
        <h2 id="speakers-h" className="font-display text-3xl font-bold">سخنران‌ها</h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {speakers.map((s) => (
            <li key={s.name} className="rounded-surface border-line border-border bg-card p-5">
              <Avatar name={s.name} size="lg" />
              <p className="mt-3 font-semibold">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.role}</p>
              <p className="mt-3 flex items-start gap-1.5 text-sm"><Mic2 className="mt-0.5 size-3.5 shrink-0 text-brand" />{s.topic}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="agenda" className="scroll-mt-4 border-y border-border bg-muted/30" aria-labelledby="agenda-h">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 id="agenda-h" className="font-display text-3xl font-bold">برنامه</h2>
          <Tabs defaultValue="d1" className="mt-6">
            <TabsList>
              <TabsTrigger value="d1">روز اول · سه‌شنبه</TabsTrigger>
              <TabsTrigger value="d2">روز دوم · چهارشنبه</TabsTrigger>
            </TabsList>
            {Object.entries(agenda).map(([k, rows]) => (
              <TabsContent key={k} value={k}>
                <ol className="mt-4 divide-y divide-border rounded-surface border-line border-border bg-card">
                  {rows.map((r) => (
                    <li key={r.time} className={cn("flex gap-4 p-4", r.kind === "break" && "bg-muted/40")}>
                      <span className="flex w-14 shrink-0 items-center gap-1 text-sm font-semibold tabular-nums"><Clock className="size-3.5 text-muted-foreground" />{r.time}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-medium", r.kind === "break" && "text-muted-foreground")}>{r.title}</p>
                        {r.who && <p className="text-sm text-muted-foreground">{r.who}</p>}
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{r.hall}</span>
                    </li>
                  ))}
                </ol>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="tickets" className="mx-auto max-w-5xl scroll-mt-4 px-4 py-16" aria-labelledby="tickets-h">
        <h2 id="tickets-h" className="font-display text-3xl font-bold">بلیت</h2>
        <div role="radiogroup" aria-label="نوع بلیت" className="mt-8 grid gap-4 md:grid-cols-3">
          {tickets.map((t) => {
            const on = ticket === t.id;
            return (
              <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => setTicket(t.id)} className={cn("relative flex flex-col rounded-surface border-line bg-card p-5 text-start transition-colors", on ? "border-primary ring-2 ring-primary" : "border-border hover:border-foreground/30")}>
                {t.popular && <Badge variant="brand" className="absolute end-4 top-4">پرطرفدار</Badge>}
                <span className="font-semibold">{t.name}</span>
                <span className="mt-2 font-display text-2xl font-black">{formatToman(t.price)}</span>
                {t.note && <span className="text-xs text-muted-foreground">{t.note}</span>}
                <ul className="mt-4 space-y-1.5 text-sm">
                  {t.perks.map((p) => <li key={p} className="flex items-center gap-2"><Check className="size-4 text-success" />{p}</li>)}
                </ul>
                {t.left && <span className="mt-4 text-xs font-medium text-destructive">فقط {fa(t.left)} بلیت مونده</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-surface border-line border-border bg-card p-4">
          <div className="flex items-center gap-3" role="group" aria-label="تعداد بلیت">
            <span className="text-sm">تعداد</span>
            <Button size="icon" variant="outline" className="size-9" aria-label="یکی بیشتر" onClick={() => setQty((q) => Math.min(10, q + 1))}><Plus /></Button>
            <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">{fa(qty)}</span>
            <Button size="icon" variant="outline" className="size-9" aria-label="یکی کمتر" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus /></Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">جمع: <span className="font-display text-lg font-bold text-foreground">{formatToman(chosen.price * qty)}</span></span>
            <Button size="lg">پرداخت</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 pb-20 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">سؤال‌های متداول</h2>
          <Accordion items={faq} className="mt-4" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">حامی‌ها</h2>
          <p className="mt-2 text-sm text-muted-foreground">لوگوی حامی‌ها را این‌جا بگذارید.</p>
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="flex aspect-[3/2] items-center justify-center rounded-control border-line border-dashed border-border text-xs text-muted-foreground">حامی {fa(i + 1)}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
