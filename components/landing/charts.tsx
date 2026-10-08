"use client";

import Link from "next/link";
import { fa } from "@/lib/utils";
import { fillGrid } from "@/lib/grid-fill";
import { chartCats, charts } from "@/lib/registry";
import { chartCardDemos } from "@/components/demos/charts";
import { SectionHead } from "./section-head";

const PRINCIPLES = [
  ["راست به چپ از پایه", "زمان از راست شروع میشه، محور عدد سمت راسته و میله‌های افقی از برچسب به چپ رشد می‌کنن."],
  ["اعداد و تاریخ فارسی", "تیک‌های کوتاه مثل «۱۲ میلیون»، تومان کامل در تولتیپ و تاریخ شمسی مثل «۱۲ مهر»."],
  ["بدون کتابخانه", "SVG خالص با React. فقط فایل‌ها کپی میشن و هیچ بسته‌ای به پروژه اضافه نمیشه."],
  ["قابل دسترس", "کیبورد، اعلام صوتی نقطه‌ی فعال، جدول مخفی برای صفحه‌خوان و راهنمایی که سری‌ها را خاموش می‌کنه."],
] as const;

export function Charts({ standalone }: { standalone?: boolean }) {
  return (
    <div>
      <SectionHead
        eyebrow={<>{fa(charts.length)} نمودار</>}
        title="نمودارها"
        desc="یک کتابخانه‌ی نمودار کامل که از اول برای فارسی ساخته شده. همه‌ی نمودارها یک هسته‌ی مشترک دارن، پس راهنما، تولتیپ، کیبورد و رنگ‌ها همه‌جا یکسان رفتار می‌کنن و رنگشون را از سیستم طراحی می‌گیرن."
        href="/charts"
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
        {chartCats.map((cat) => {
          const items = charts.filter((c) => c.cat === cat.key);
          if (!items.length) return null;
          const spans = fillGrid(items.map((c) => (c.wide ? 2 : 1)), { base: 1, sm: 2, lg: 3 });
          return (
            <section key={cat.key} aria-labelledby={`cat-${cat.key}`}>
              <h2 id={`cat-${cat.key}`} className="mb-3 text-sm font-semibold text-muted-foreground">
                {cat.label}
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {items.map((c, i) => (
                  <li key={c.slug} className={spans[i]}>
                    <Link
                      href={`/charts/${c.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <div className="pointer-events-none h-44 overflow-hidden px-4 pt-4" aria-hidden>
                        {chartCardDemos[c.slug]}
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
