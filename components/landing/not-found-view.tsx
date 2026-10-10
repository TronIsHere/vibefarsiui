import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  ArrowLeft,
  Boxes,
  CalendarDays,
  ChartLine,
  Image,
  LayoutTemplate,
  Palette,
  PanelsTopLeft,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Frame, HatchBand, Section } from "@/components/landing/frame";
import { TopBar } from "@/components/landing/top-bar";
import { MonoFooter } from "@/components/landing/footer";
import { sections, type SectionKey } from "@/lib/registry";
import { cn, fa } from "@/lib/utils";

const ICONS: Record<SectionKey, LucideIcon> = {
  components: Boxes,
  blocks: PanelsTopLeft,
  charts: ChartLine,
  calendar: CalendarDays,
  animations: Sparkles,
  backgrounds: Image,
  templates: LayoutTemplate,
  sites: AppWindow,
  themes: Palette,
  skills: WandSparkles,
};

const DIGITS = ["۴", "۰", "۴"] as const;

export function NotFoundView() {
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col">
      <TopBar />
      <main className="min-w-0 flex-1 overflow-x-clip">
        <Frame>
          <Section>
            <div className="px-5 py-12 sm:px-10 sm:py-16 lg:py-20">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11.5px] text-muted-foreground">
                  <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
                  خطای {fa(404)}
                </span>
              </div>

              <h1
                className="mt-6 max-w-xl text-[2.5rem] font-bold leading-[1.18] sm:text-[3.2rem] sm:leading-[1.14] animate-fade-up"
                style={{ animationDelay: "60ms" }}
              >
                این صفحه وجود نداره
              </h1>

              <p
                className="mt-5 max-w-lg text-base text-muted-foreground sm:text-[17px] animate-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                شاید لینک قدیمی باشه یا آدرس اشتباه تایپ شده. از جست‌وجوی بالای
                صفحه یا یکی از بخش‌های زیر ادامه بدید.
              </p>

              <div
                className="mt-8 flex flex-wrap items-center gap-2.5 animate-fade-up"
                style={{ animationDelay: "180ms" }}
              >
                <Link
                  href="/"
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  صفحه‌ی اصلی
                  <ArrowLeft className="size-4" />
                </Link>
                <Link
                  href="/components"
                  className="inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  کامپوننت‌ها را ببینید
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden border-t border-border">
              <div aria-hidden className="absolute inset-0 bg-blueprint opacity-80" />
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl sm:size-72"
              />
              <div
                className="relative mx-auto grid max-w-xl grid-cols-3 gap-2 p-5 sm:gap-3 sm:p-8 lg:max-w-2xl lg:p-10"
                aria-hidden
              >
                {DIGITS.map((digit, i) => (
                  <div
                    key={`${digit}-${i}`}
                    className="flex min-h-29 items-center justify-center rounded-xl border border-dashed border-foreground/20 bg-card/50 animate-fade-up sm:min-h-38"
                    style={{ animationDelay: `${220 + i * 80}ms` }}
                  >
                    <span
                      className={cn(
                        "text-5xl font-bold sm:text-7xl",
                        i === 1 ? "text-brand/55" : "text-foreground/25",
                      )}
                    >
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <HatchBand />

          <Section>
            <div className="border-b border-border px-5 py-8 sm:px-8">
              <p className="text-xs text-muted-foreground">کاتالوگ</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">از این‌جا ادامه بدید</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
                کامپوننت‌ها، بلاک‌ها و بقیه سر جاشون هستن.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((item, i) => {
                const Icon = ICONS[item.key];
                return (
                  <li
                    key={item.key}
                    className={cn(
                      "border-b border-border",
                      i % 2 === 0 ? "sm:border-e" : "",
                      "lg:border-e lg:nth-[3n]:border-e-0",
                      i >= sections.length - 3 && "lg:border-b-0",
                    )}
                  >
                    <Link
                      href={`/${item.key}`}
                      className="group flex h-full cursor-pointer gap-4 px-5 py-6 transition-colors hover:bg-accent/40 sm:px-8"
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground/80 transition-colors group-hover:border-foreground/25">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="text-[15px] font-semibold">{item.label}</span>
                          <span className="text-xs text-muted-foreground">{fa(item.count)}</span>
                        </span>
                        <span className="mt-1 block text-[13px] leading-6 text-muted-foreground">
                          {item.desc}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Section>

          <HatchBand />
          <MonoFooter />
        </Frame>
      </main>
    </div>
  );
}
