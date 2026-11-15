"use client";

import * as React from "react";
import { Download, Globe, Mail, MapPin, Phone, Printer } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { cn, fa } from "@/lib/utils";

const experience = [
  {
    role: "توسعه‌دهنده‌ی ارشد فرانت‌اند",
    company: "یک فروشگاه اینترنتی بزرگ",
    period: "۱۴۰۱ تا اکنون",
    place: "تهران",
    points: [
      "بازنویسی مسیر پرداخت با React و کاهش ۲۳٪ ریزش سبد خرید.",
      "ساخت کتابخانه‌ی کامپوننت راست‌چین که ۶ تیم از اون استفاده می‌کنن.",
      "منتورینگ ۴ توسعه‌دهنده‌ی جونیور و راه‌اندازی بازبینی کد هفتگی.",
    ],
  },
  {
    role: "توسعه‌دهنده‌ی فرانت‌اند",
    company: "استارتاپ فین‌تک",
    period: "۱۳۹۸ تا ۱۴۰۱",
    place: "تهران، دورکاری",
    points: ["پیاده‌سازی داشبورد کیف پول و نمودارهای تراکنش.", "بهبود امتیاز Lighthouse از ۵۴ به ۹۶."],
  },
  {
    role: "کارآموز طراحی وب",
    company: "آژانس دیجیتال مارکتینگ",
    period: "۱۳۹۷ تا ۱۳۹۸",
    place: "اصفهان",
    points: ["طراحی و ساخت ۱۲ سایت شرکتی با وردپرس."],
  },
];

const skills: [string, number][] = [["React و Next.js", 5], ["TypeScript", 5], ["CSS و Tailwind", 5], ["دسترس‌پذیری", 4], ["Node.js", 3], ["Figma", 4]];
const languages: [string, string][] = [["فارسی", "زبان مادری"], ["انگلیسی", "مسلط (IELTS ۷٫۵)"], ["آلمانی", "مقدماتی"]];

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("break-inside-avoid", className)}>
      <h2 className="mb-3 border-b border-border pb-1.5 text-xs font-bold tracking-wide text-brand">{title}</h2>
      {children}
    </section>
  );
}

/** رزومه: یک صفحه‌ی A4 قابل چاپ با سابقه‌ی کار به سال شمسی، مهارت‌ها، تحصیلات و زبان‌ها، ایمیل و تلفن چپ‌چین. */
export function ResumePage() {
  return (
    <div className="min-h-dvh bg-muted/40 py-8 text-foreground print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] justify-end gap-2 px-4 print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer />چاپ</Button>
        <Button size="sm" onClick={() => window.print()}><Download />ذخیره‌ی PDF</Button>
      </div>
      <article className="mx-auto min-h-[297mm] max-w-[210mm] bg-card px-10 py-12 shadow-overlay print:min-h-0 print:max-w-none print:px-0 print:py-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-foreground pb-6">
          <div>
            <h1 className="font-display text-4xl font-black">پرهام کریمی</h1>
            <p className="mt-1 text-lg text-muted-foreground">توسعه‌دهنده‌ی ارشد فرانت‌اند</p>
            <p className="mt-3 max-w-md text-sm leading-7">هفت سال تجربه در ساخت محصولات وب فارسی با تمرکز روی کارایی، دسترس‌پذیری و رابط‌های راست‌چین.</p>
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /><bdi dir="ltr">parham@example.com</bdi></li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /><bdi dir="ltr">0912 345 6789</bdi></li>
            <li className="flex items-center gap-2"><Globe className="size-4 text-muted-foreground" /><bdi dir="ltr">parham.dev</bdi></li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" />تهران</li>
          </ul>
        </header>

        <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_200px] print:grid-cols-[1fr_200px]">
          <div className="space-y-8">
            <Section title="سابقه‌ی کار">
              <ol className="space-y-6">
                {experience.map((x) => (
                  <li key={x.role + x.period} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-bold">{x.role}</h3>
                      <span className="text-xs tabular-nums text-muted-foreground">{x.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{x.company} · {x.place}</p>
                    <ul className="mt-2 list-disc space-y-1 ps-5 text-sm leading-7 marker:text-muted-foreground">
                      {x.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            </Section>
            <Section title="پروژه‌های شخصی">
              <ul className="space-y-3 text-sm leading-7">
                <li><span className="font-semibold">تقویم شمسی متن‌باز</span>: کتابخانه‌ی تبدیل تاریخ با بیش از ۲ هزار ستاره. <bdi dir="ltr" className="text-xs text-muted-foreground">github.com/parham/jcal</bdi></li>
                <li><span className="font-semibold">افزونه‌ی نیم‌فاصله</span>: افزونه‌ی مرورگر برای اصلاح خودکار نیم‌فاصله‌ها در فرم‌ها.</li>
              </ul>
            </Section>
          </div>

          <div className="space-y-8">
            <Section title="مهارت‌ها">
              <ul className="space-y-2.5">
                {skills.map(([s, lvl]) => (
                  <li key={s} className="text-sm">
                    <span className="flex justify-between"><span>{s}</span><span className="sr-only">سطح {fa(lvl)} از ۵</span></span>
                    <span aria-hidden className="mt-1 flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => <span key={i} className={cn("h-1 flex-1 rounded-full", i < lvl ? "bg-foreground" : "bg-border")} />)}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="تحصیلات">
              <p className="text-sm font-semibold">کارشناسی مهندسی کامپیوتر</p>
              <p className="text-xs text-muted-foreground">دانشگاه صنعتی اصفهان · ۱۳۹۳ تا ۱۳۹۷</p>
            </Section>
            <Section title="زبان‌ها">
              <dl className="space-y-1.5 text-sm">
                {languages.map(([l, v]) => <div key={l}><dt className="font-medium">{l}</dt><dd className="text-xs text-muted-foreground">{v}</dd></div>)}
              </dl>
            </Section>
            <Section title="علاقه‌مندی‌ها">
              <p className="text-sm leading-7 text-muted-foreground">کوه‌نوردی، عکاسی خیابانی، شطرنج</p>
            </Section>
          </div>
        </div>
      </article>
    </div>
  );
}
