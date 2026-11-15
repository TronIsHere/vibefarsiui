"use client";

import * as React from "react";
import { AtSign, BadgeCheck, BookOpen, Check, Copy, Mail, MessageCircle, Mic, Send, ShoppingBag, Video } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { cn, fa, faNumber } from "@/lib/utils";

const links = [
  { title: "دوره‌ی عکاسی با موبایل", note: "ثبت‌نام دوره‌ی پاییز باز شد", icon: BookOpen, highlight: true },
  { title: "اپیزود تازه‌ی پادکست", note: "قسمت ۳۲: نور طبیعی", icon: Mic },
  { title: "ویدئوهای آموزشی", note: "هر پنجشنبه یک ویدئوی تازه", icon: Video },
  { title: "فروشگاه پریست‌ها", note: "۱۲ پریست لایت‌روم", icon: ShoppingBag },
];

const socials = [
  { label: "تلگرام", icon: Send, handle: "@negar_photo" },
  { label: "ایتا", icon: MessageCircle, handle: "@negar_photo" },
  { label: "ایمیل", icon: Mail, handle: "hi@negar.photo" },
  { label: "اینستاگرام", icon: AtSign, handle: "@negar.photo" },
];

/** لینک در بیو: یک صفحه‌ی موبایلی با پروفایل، لینک‌ها، محصول ویژه، شبکه‌ها و خبرنامه. */
export function LinkInBio() {
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [joined, setJoined] = React.useState(false);

  function copy() {
    navigator.clipboard?.writeText("negar.photo/links").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-0 h-72 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.15_330/45%),transparent_65%),radial-gradient(ellipse_at_top_left,oklch(0.75_0.13_60/40%),transparent_55%)]" />
      <main className="relative mx-auto flex max-w-md flex-col items-center px-5 pb-12 pt-12">
        <div className="flex w-full justify-end">
          <Button size="sm" variant="secondary" onClick={copy} aria-live="polite">
            {copied ? <Check /> : <Copy />}
            {copied ? "کپی شد" : "کپی لینک"}
          </Button>
        </div>
        <span aria-hidden className="mt-2 size-24 rounded-full border-4 border-background bg-[conic-gradient(from_200deg,oklch(0.7_0.17_330),oklch(0.78_0.14_60),oklch(0.65_0.15_280),oklch(0.7_0.17_330))] shadow-overlay" />
        <h1 className="mt-4 flex items-center gap-1.5 font-display text-2xl font-black">
          نگار رحیمی
          <BadgeCheck className="size-5 text-brand" aria-label="تأییدشده" />
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">عکاس و مدرس عکاسی با موبایل · تهران</p>
        <dl className="mt-4 flex gap-6 text-center">
          {[["دنبال‌کننده", 128_000], ["شاگرد", 3_400], ["اپیزود", 32]].map(([k, v]) => (
            <div key={k as string}>
              <dd className="font-display text-lg font-bold">{(v as number) >= 1000 ? `${faNumber(Math.round((v as number) / 100) / 10)} هزار` : fa(v as number)}</dd>
              <dt className="text-[11px] text-muted-foreground">{k}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-7 w-full space-y-3">
          {links.map((l) => (
            <li key={l.title}>
              <a
                href="#"
                className={cn(
                  "group flex items-center gap-3 rounded-surface border-line p-3 shadow-control transition-transform ease-motion hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring",
                  l.highlight ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-card",
                )}
              >
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-control", l.highlight ? "bg-primary-foreground/15" : "bg-secondary")}>
                  <l.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{l.title}</span>
                  <span className={cn("block truncate text-xs", l.highlight ? "opacity-75" : "text-muted-foreground")}>{l.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <article className="mt-6 w-full overflow-hidden rounded-surface border-line border-border bg-card">
          <div aria-hidden className="h-32 bg-[linear-gradient(135deg,oklch(0.72_0.12_200),oklch(0.55_0.14_260))]" />
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-[11px] font-medium text-brand">محصول ویژه</p>
              <h2 className="font-semibold">کتاب الکترونیکی «نور شهر»</h2>
              <p className="text-xs text-muted-foreground">۸۴ صفحه · PDF</p>
            </div>
            <Button size="sm">{faNumber(290)} هزار تومان</Button>
          </div>
        </article>

        <ul className="mt-6 flex gap-2" aria-label="شبکه‌های اجتماعی">
          {socials.map((s) => (
            <li key={s.label}>
              <a href="#" aria-label={`${s.label}: ${s.handle}`} title={s.handle} className="flex size-11 items-center justify-center rounded-full border-line border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
                <s.icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>

        <form
          className="mt-8 w-full rounded-surface border-line border-dashed border-border p-4"
          onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setJoined(true); }}
        >
          <label htmlFor="bio-email" className="text-sm font-semibold">هر ماه یک ایمیل، با بهترین عکس‌های شاگردها</label>
          {joined ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-success" role="status"><Check className="size-4" />عضو شدید. ایمیل اول تا آخر ماه می‌رسه.</p>
          ) : (
            <div className="mt-3 flex gap-2">
              <input
                id="bio-email"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 min-w-0 flex-1 rounded-field border-line-field border-input bg-field px-3 text-sm shadow-field outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/60"
              />
              <Button type="submit">عضویت</Button>
            </div>
          )}
        </form>
        <p className="mt-8 text-[11px] text-muted-foreground">
          <bdi dir="ltr">negar.photo/links</bdi>
        </p>
      </main>
    </div>
  );
}
