"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Headphones, Lock, Phone } from "lucide-react";
import { AmountInput } from "@/registry/ui/amount-input";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { CardNumberInput } from "@/registry/ui/card-number-input";
import { BarChart, jalaliWeekLabels } from "@/registry/ui/chart";
import { NationalIdInput } from "@/registry/ui/national-id-input";
import { OtpField } from "@/registry/ui/otp-field";
import { PhoneInput } from "@/registry/ui/phone-input";
import { PlateInput } from "@/registry/ui/plate-input";
import { Price } from "@/registry/ui/price";
import { Progress } from "@/registry/ui/progress";
import { PromptInput } from "@/registry/ui/prompt-input";
import { Stat } from "@/registry/ui/stat";
import { Stepper } from "@/registry/ui/stepper";
import { TimePicker } from "@/registry/ui/time-picker";
import { Timeline } from "@/registry/ui/timeline";
import { Typewriter } from "@/registry/animations/typewriter";
import { Reveal } from "@/registry/animations/reveal";
import { animations, components } from "@/lib/registry";
import { cn, fa, faNumber } from "@/lib/utils";
import { Section } from "./frame";

function used(slug: string) {
  const c = components.find((x) => x.slug === slug);
  if (c) return { href: `/components/${slug}`, name: c.name };
  const a = animations.find((x) => x.slug === slug);
  return { href: `/animations/${slug}`, name: a?.name ?? slug };
}

function Tile({
  title,
  desc,
  uses,
  className,
  bodyClass,
  delay = 0,
  children,
}: {
  title: string;
  desc: string;
  uses: string[];
  className?: string;
  bodyClass?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className={cn("min-w-0", className)}>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25">
        <div className="px-5 pt-5">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{desc}</p>
        </div>
        <div className={cn("flex min-w-0 flex-1 flex-col justify-center p-5", bodyClass)}>{children}</div>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-muted/40 px-5 py-3">
          <span className="me-1 text-[11px] text-muted-foreground">ساخته‌شده با</span>
          {uses.map((s) => {
            const u = used(s);
            return (
              <Link
                key={s}
                href={u.href}
                className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] transition-colors hover:border-foreground/30 hover:text-brand"
              >
                {u.name}
              </Link>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

const WEEK_SALES = [42, 61, 55, 78, 70, 96, 64];

function Checkout() {
  const [amount, setAmount] = React.useState<number | null>(1_250_000);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Headphones className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">هدفون بی‌سیم نویزگیر</p>
          <p className="text-[11px] text-muted-foreground">ارسال رایگان تا ۳ روز کاری</p>
        </div>
        <Price amount={1_250_000} original={1_600_000} size="sm" />
      </div>
      <div>
        <p className="mb-1.5 text-[13px] font-medium">شماره‌ی کارت</p>
        <CardNumberInput id="sc-card" />
      </div>
      <div>
        <p className="mb-1.5 text-[13px] font-medium">مبلغ</p>
        <AmountInput id="sc-amount" value={amount} onChange={setAmount} quick={[500_000, 1_000_000, 5_000_000]} />
      </div>
      <Button className="w-full" size="lg">
        <Lock />
        پرداخت {amount ? `${faNumber(amount)} تومان` : ""}
      </Button>
    </div>
  );
}

function Assistant() {
  return (
    <div className="space-y-3">
      <div className="max-w-[85%] rounded-2xl rounded-ss-sm bg-muted px-3.5 py-2.5 text-[13px] leading-6">
        <Typewriter
          text="یک فرم ثبت‌نام با شماره‌ی موبایل، کد تأیید و تقویم شمسی ساختم. کدش آماده‌ست."
          speed={45}
          loopDelay={4000}
        />
      </div>
      <PromptInput placeholder="یک صفحه‌ی پرداخت فارسی بساز…" />
    </div>
  );
}

function Login() {
  const [phone, setPhone] = React.useState("9123456789");
  return (
    <div className="space-y-4">
      <Stepper current={1} steps={[{ label: "موبایل" }, { label: "کد تأیید" }, { label: "تمام" }]} />
      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <PhoneInput id="sc-phone" value={phone} onChange={(d) => setPhone(d)} />
        <OtpField size="sm" length={5} defaultValue="731" aria-label="کد تأیید" />
      </div>
    </div>
  );
}

function Sales() {
  const labels = jalaliWeekLabels();
  return (
    <div className="space-y-3">
      <Stat size="sm" label="فروش این هفته" value={faNumber(86_400_000)} unit="تومان" delta={23} />
      <BarChart data={labels.map((label, i) => ({ label, value: WEEK_SALES[i] * 1_000_000 }))} highlight={5} height={120} />
    </div>
  );
}

function Booking() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar compact defaultValue={new Date()} className="bg-background" />
      <div className="flex w-full max-w-[280px] items-center gap-2">
        <div className="min-w-0 flex-1">
          <TimePicker defaultValue="16:30" step={15} min="09:00" max="21:00" />
        </div>
        <Button size="md" variant="brand" className="shrink-0">
          <CalendarCheck />
          رزرو
        </Button>
      </div>
    </div>
  );
}

function Tracking() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">سفارش #{fa(14052)}</p>
          <p className="text-[11px] text-muted-foreground">مریم احمدی، تهران</p>
        </div>
        <Badge variant="warning">در راه</Badge>
      </div>
      <Progress size="sm" value={75} label="تا رسیدن" showValue />
      <Timeline
        items={[
          { date: "امروز، ساعت ۱۰:۲۰", title: "تحویل پیک شد", description: "پیک: رضا موسوی" },
          { date: "دیروز، ساعت ۱۸:۴۵", title: "بسته‌بندی شد" },
          { date: "دیروز، ساعت ۱۴:۰۵", title: "پرداخت تأیید شد" },
        ]}
      />
      <Button variant="outline" size="sm" className="w-full">
        <Phone />
        تماس با پیک
      </Button>
    </div>
  );
}

function Identity() {
  return (
    <div className="space-y-4">
      <PlateInput defaultValue={{ left: "12", letter: "ب", middle: "345", region: "11" }} />
      <NationalIdInput id="sc-nid" />
    </div>
  );
}

/** Bento of small real-world blocks, each assembled only from registry parts. */
export function Showcase() {
  return (
    <Section id="blocks">
      <div className="px-5 pb-8 pt-14 text-center sm:px-8 sm:pt-16">
        <Badge variant="brand" className="mx-auto">همه زنده، همه قابل کپی</Badge>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-snug sm:text-4xl">
          با همین کامپوننت‌ها، این بلاک‌ها را ساختیم
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
          پایین هر کارت نوشته از کدام کامپوننت‌ها ساخته شده. روی اسمشون بزنید تا کد، پرامپت و
          راهنماشون را ببینید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-3 pb-3 sm:px-4 sm:pb-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-4">
        <Tile
          className="lg:col-span-3 lg:row-span-2"
          title="پرداخت با کارت بانکی"
          desc="بانک را از شش رقم اول تشخیص میده و مبلغ را به حروف هم می‌نویسه."
          uses={["price", "card-number-input", "amount-input", "button"]}
        >
          <Checkout />
        </Tile>
        <Tile
          className="lg:col-span-3"
          delay={80}
          title="دستیار هوش مصنوعی"
          desc="ورودی چت با پیوست، انتخاب مدل و جوابی که حرف‌به‌حرف تایپ میشه."
          uses={["prompt-input", "typewriter"]}
        >
          <Assistant />
        </Tile>
        <Tile
          className="lg:col-span-3"
          delay={140}
          title="ورود با کد پیامکی"
          desc="پیش‌شماره‌ی ایران، مراحل ورود و کدی که با کیبورد فارسی هم تایپ میشه."
          uses={["stepper", "phone-input", "otp-field"]}
        >
          <Login />
        </Tile>
        <Tile
          className="lg:col-span-2"
          title="داشبورد فروش"
          desc="هفته از شنبه شروع میشه و اعداد فارسی و تومانی هستن."
          uses={["stat", "chart"]}
        >
          <Sales />
        </Tile>
        <Tile
          className="lg:col-span-2 lg:row-span-2"
          delay={80}
          title="نوبت‌دهی آنلاین"
          desc="تقویم شمسی با تعطیلی جمعه، کنار انتخاب ساعت."
          uses={["calendar", "time-picker", "button"]}
        >
          <Booking />
        </Tile>
        <Tile
          className="md:col-span-2 lg:col-span-2 lg:row-span-2"
          delay={140}
          title="پیگیری سفارش"
          desc="خط زمان راست‌چین، نوار پیشرفت و وضعیت سفارش."
          uses={["timeline", "progress", "badge", "button"]}
        >
          <Tracking />
        </Tile>
        <Tile
          className="lg:col-span-2"
          delay={60}
          title="فرم احراز هویت"
          desc="پلاک خودرو و کد ملی با بررسی رقم کنترل."
          uses={["plate-input", "national-id-input"]}
        >
          <Identity />
        </Tile>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row sm:px-8">
        <p className="text-xs text-muted-foreground">
          {fa(components.length)} کامپوننت داریم و هر کدام کد، پرامپت و راهنمای راست‌چین خودش را داره.
        </p>
        <Link href="/blocks" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand">
          بلاک‌های کامل صفحه
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
