"use client";

import Link from "next/link";
import { fa } from "@/lib/utils";
import { fillGrid } from "@/lib/grid-fill";
import { calendar, calendarCats } from "@/lib/registry";
import { calendarCardDemos } from "@/components/demos/calendar";
import { SectionHead } from "./section-head";

const PRINCIPLES = [
  ["تعطیلات رسمی، درست", "تعطیلی‌های مذهبی از جدول رسمی ماه‌های قمری ایران حساب میشن و سال‌های ۱۴۰۴ و ۱۴۰۵ روزبه‌روز با تقویم رسمی یکی هستن."],
  ["شنبه سمت راست", "هفته از شنبه شروع میشه، روز بعد سمت چپه و کلید جهت چپ هم به روز بعد می‌ره."],
  ["ساعت تهران", "رویدادها با منطقه‌ی زمانی چیده میشن، پس حتی اگه کاربر خارج از ایران باشه ساعت جلسه جابه‌جا نمیشه."],
  ["بدون کتابخانه", "فقط React و Tailwind. تبدیل شمسی و قمری و تعطیلات در سه فایل کوچک کنار پروژه‌تون می‌مونن."],
] as const;

export function CalendarSection({ standalone }: { standalone?: boolean }) {
  return (
    <div>
      <SectionHead
        eyebrow={<>{fa(calendar.length)} کامپوننت تقویم</>}
        title="تقویم"
        desc="تقویم رویداد، نمای سال، فهرست مناسبت‌ها، انتخاب نوبت، گانت و برنامه‌ی شیفت که همه روی یک هسته‌ی مشترک ساخته شدن. تقویم شمسیه، تعطیلات رسمی ایران و تاریخ قمری را می‌شناسه و رنگ‌هاش را از سیستم طراحی می‌گیره."
        href="/calendar"
        standalone={standalone}
      />
      <ul className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map(([t, d]) => (
          <li key={t} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-sm font-semibold">{t}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{d}</p>
          </li>
        ))}
      </ul>
      <div className="space-y-10">
        {calendarCats.map((cat) => {
          const items = calendar.filter((c) => c.cat === cat.key);
          if (!items.length) return null;
          const spans = fillGrid(items.map((c) => (c.wide ? 2 : 1)), { base: 1, sm: 2, lg: 3 });
          return (
            <section key={cat.key} aria-labelledby={`cal-${cat.key}`}>
              <h2 id={`cal-${cat.key}`} className="mb-3 text-sm font-semibold text-muted-foreground">
                {cat.label}
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {items.map((c, i) => (
                  <li key={c.slug} className={spans[i]}>
                    <Link
                      href={`/calendar/${c.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <div className="pointer-events-none h-52 overflow-hidden px-4 pt-4" aria-hidden inert>
                        {calendarCardDemos[c.slug]}
                      </div>
                      <div className="mt-auto border-t border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{c.name}</h3>
                          <span className="text-[11px] text-muted-foreground" dir="ltr">
                            {c.slug}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{c.desc}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
