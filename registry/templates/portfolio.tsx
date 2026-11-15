"use client";

import * as React from "react";
import { ArrowLeft, ArrowUpLeft, Check, Download, Mail, MapPin, Send } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { cn, fa } from "@/lib/utils";

type Project = { title: string; kind: "اپ" | "وب" | "برند"; year: number; summary: string; result: string; hues: [number, number]; wide?: boolean };

const projects: Project[] = [
  { title: "اپ کیف پول پرداخت", kind: "اپ", year: 1403, summary: "طراحی دوباره‌ی جریان انتقال وجه برای ۲ میلیون کاربر", result: "۴۰٪ تیکت پشتیبانی کمتر", hues: [250, 200], wide: true },
  { title: "سامانه‌ی نوبت‌دهی کلینیک", kind: "وب", year: 1403, summary: "از تقویم کاغذی تا رزرو آنلاین در سه هفته", result: "۶۵٪ نوبت‌ها آنلاین", hues: [160, 120] },
  { title: "هویت بصری کافه نارنج", kind: "برند", year: 1402, summary: "لوگو، منو و بسته‌بندی برای یک کافه‌ی محلی", result: "۳ شعبه‌ی جدید", hues: [50, 20] },
  { title: "داشبورد فروش فروشگاه", kind: "وب", year: 1402, summary: "نمودارهای راست‌چین و گزارش روزانه برای مدیران", result: "۲ ساعت صرفه‌جویی در روز", hues: [290, 330] },
  { title: "اپ یادگیری زبان", kind: "اپ", year: 1401, summary: "تمرین روزانه‌ی پنج‌دقیقه‌ای با بازی‌وارسازی", result: "نگهداشت ۳۰ روزه ۴۲٪", hues: [20, 350], wide: true },
];

const kinds = ["همه", "اپ", "وب", "برند"] as const;

const timeline = [
  { years: "۱۴۰۲ تا اکنون", role: "طراح ارشد محصول", place: "یک فین‌تک" },
  { years: "۱۴۰۰ تا ۱۴۰۲", role: "طراح رابط کاربری", place: "استودیو طراحی" },
  { years: "۱۳۹۸ تا ۱۴۰۰", role: "طراح گرافیک فریلنسر", place: "پروژه‌ای" },
];

/** پورتفولیو: هیرو با وضعیت همکاری، پروژه‌ها با فیلتر و چیدمان بدون جای خالی، سابقه، نظر کارفرماها و فرم تماس. */
export function PortfolioPage() {
  const [kind, setKind] = React.useState<(typeof kinds)[number]>("همه");
  const [sent, setSent] = React.useState(false);
  const list = projects.filter((p) => kind === "همه" || p.kind === kind);
  // Two-column grid: a wide card takes the whole row, so pair the narrow ones and let a lone narrow one stretch.
  const spans = (() => {
    const out: boolean[] = [];
    let open = false;
    list.forEach((p, i) => {
      if (p.wide) { if (open) out[i - 1] = true; out.push(true); open = false; }
      else { out.push(false); open = !open; }
    });
    if (open) out[out.length - 1] = true;
    return out;
  })();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-sm">
          <span className="font-display text-base font-black">لیلا.</span>
          <ul className="flex gap-5 text-muted-foreground">
            <li><a href="#work" className="hover:text-foreground">نمونه‌کارها</a></li>
            <li><a href="#about" className="hover:text-foreground">درباره</a></li>
            <li><a href="#contact" className="hover:text-foreground">تماس</a></li>
          </ul>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20">
        <Badge variant="success" className="gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-success" />برای پروژه‌ی جدید از دی آزادم</Badge>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[1.35] sm:text-6xl sm:leading-[1.3]">
          محصول‌هایی طراحی می‌کنم که <span className="text-brand">آدم‌ها راحت</span> باهاشون کار کنن.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">لیلا امیری، طراح محصول با ۷ سال تجربه در فین‌تک و سلامت. تهران، و دورکار برای همه‌جا.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>شروع همکاری<ArrowLeft /></Button>
          <Button size="lg" variant="outline"><Download />رزومه</Button>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-12" aria-labelledby="work-h">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 id="work-h" className="font-display text-2xl font-bold">نمونه‌کارها</h2>
          <div className="flex gap-1" role="group" aria-label="فیلتر نوع پروژه">
            {kinds.map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={cn("rounded-full px-3.5 py-1.5 text-sm transition-colors", kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}>{k}</button>
            ))}
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((p, i) => (
            <li key={p.title} className={cn(spans[i] && "sm:col-span-2")}>
              <a href="#" className="group block overflow-hidden rounded-surface border-line border-border bg-card focus-visible:outline-2 focus-visible:outline-ring">
                <div aria-hidden className={cn("relative overflow-hidden", spans[i] ? "aspect-[21/9]" : "aspect-[4/3]")} style={{ background: `linear-gradient(135deg, oklch(0.72 0.13 ${p.hues[0]}), oklch(0.45 0.14 ${p.hues[1]}))` }}>
                  <span className="absolute inset-x-[12%] bottom-0 top-[18%] rounded-t-xl bg-background/85 shadow-overlay transition-transform duration-(--motion) ease-motion group-hover:-translate-y-2" />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{p.kind} · {fa(p.year)}</p>
                    <h3 className="mt-0.5 font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
                    <p className="mt-2 text-sm font-medium text-success">{p.result}</p>
                  </div>
                  <ArrowUpLeft className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className="mx-auto grid max-w-5xl scroll-mt-16 gap-10 px-4 py-12 md:grid-cols-2" aria-labelledby="about-h">
        <div>
          <h2 id="about-h" className="font-display text-2xl font-bold">درباره‌ی من</h2>
          <p className="mt-4 leading-8 text-muted-foreground">از گرافیک شروع کردم و کم‌کم فهمیدم چیزی که دوست دارم حل کردن مسئله است، نه فقط زیبا کردنش. حالا بیشتر وقتم صرف پژوهش کاربر، نمونه‌سازی و کار نزدیک با تیم فنی میشه.</p>
          <ul className="mt-5 flex flex-wrap gap-2">{["پژوهش کاربر", "Figma", "سیستم طراحی", "نمونه‌سازی", "راست‌چین"].map((s) => <li key={s}><Badge variant="outline">{s}</Badge></li>)}</ul>
        </div>
        <ol className="relative space-y-6 border-s border-border ps-6">
          {timeline.map((t) => (
            <li key={t.years} className="relative">
              <span aria-hidden className="absolute -start-[29px] top-1.5 size-2.5 rounded-full border-2 border-background bg-brand" />
              <p className="text-xs tabular-nums text-muted-foreground">{t.years}</p>
              <p className="font-semibold">{t.role}</p>
              <p className="text-sm text-muted-foreground">{t.place}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12" aria-label="نظر کارفرماها">
        <figure className="rounded-surface border-line border-border bg-card p-8 text-center">
          <blockquote className="mx-auto max-w-2xl font-display text-xl leading-10">«لیلا اول سؤال می‌پرسه، بعد طراحی می‌کنه. خروجی کارش هم برای کاربر روشن بود، هم برای تیم فنی.»</blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">مدیر محصول یک فین‌تک</figcaption>
        </figure>
      </section>

      <section id="contact" className="mx-auto max-w-5xl scroll-mt-16 px-4 pb-20 pt-12" aria-labelledby="contact-h">
        <div className="grid gap-8 rounded-surface border-line border-border bg-card p-6 md:grid-cols-[1fr_1.4fr] md:p-10">
          <div>
            <h2 id="contact-h" className="font-display text-2xl font-bold">یه پروژه دارید؟</h2>
            <p className="mt-3 text-muted-foreground">معمولاً تا یک روز کاری جواب میدم.</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /><bdi dir="ltr">hello@leila.design</bdi></li>
              <li className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" />تهران</li>
            </ul>
          </div>
          {sent ? (
            <p role="status" className="flex items-center gap-2 self-center text-success"><Check className="size-5" />پیام‌تون رسید. به‌زودی جواب میدم.</p>
          ) : (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required aria-label="اسم" placeholder="اسم" className="h-11 rounded-field border-line-field border-input bg-field px-3 text-sm shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
                <input required type="email" dir="ltr" aria-label="ایمیل" placeholder="you@example.com" className="h-11 rounded-field border-line-field border-input bg-field px-3 text-sm shadow-field outline-none placeholder:text-end focus-visible:ring-2 focus-visible:ring-ring/60" />
              </div>
              <textarea required aria-label="درباره‌ی پروژه" placeholder="چند خط درباره‌ی پروژه، بودجه و زمان‌بندی" rows={4} className="w-full rounded-field border-line-field border-input bg-field px-3 py-2.5 text-sm shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
              <Button type="submit" size="lg"><Send className="-scale-x-100" />ارسال پیام</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
