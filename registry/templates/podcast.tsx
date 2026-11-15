"use client";

import * as React from "react";
import { Bell, Check, Download, ListMusic, Pause, Play, RotateCcw, RotateCw, Share2 } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { cn, fa } from "@/lib/utils";

type Episode = { n: number; title: string; desc: string; minutes: number; date: string; guest?: string };

const episodes: Episode[] = [
  { n: 32, title: "نور طبیعی، دوست یا دشمن؟", desc: "چرا ساعت طلایی همیشه طلایی نیست و چطور با نور ظهر هم عکس خوب بگیریم.", minutes: 48, date: "۲۲ آبان", guest: "نگار رحیمی" },
  { n: 31, title: "از ایده تا اپ در دو هفته", desc: "داستان ساخت یک اپ کوچک با تیم دو نفره و اشتباه‌هایی که تکرار نمی‌کنیم.", minutes: 62, date: "۱۵ آبان", guest: "کیان محمدی" },
  { n: 30, title: "خواب، بهره‌وری و قهوه", desc: "گفت‌وگو با یک پژوهشگر خواب درباره‌ی چیزهایی که درباره‌ی خستگی اشتباه فکر می‌کنیم.", minutes: 55, date: "۸ آبان", guest: "دکتر سمیرا نوری" },
  { n: 29, title: "کتاب‌هایی که دوباره خوندیم", desc: "فهرست پاییزی ما و این‌که چرا بعضی کتاب‌ها بار دوم بهترن.", minutes: 41, date: "۱ آبان" },
  { n: 28, title: "کار از راه دور، سه سال بعد", desc: "تیم‌های ایرانی که دورکار موندن و تیم‌هایی که برگشتن به دفتر.", minutes: 58, date: "۲۴ مهر", guest: "مریم کاظمی" },
];

const SPEEDS = [1, 1.25, 1.5, 2];
const clock = (s: number) => fa(`${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`);

/** پادکست: صفحه‌ی برنامه با فهرست اپیزودها و پخش‌کننده‌ی پایین صفحه با جلو و عقب ۱۵ ثانیه، سرعت پخش و نوار پیشرفت. */
export function PodcastPage() {
  const [current, setCurrent] = React.useState(episodes[0]);
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(312);
  const [speed, setSpeed] = React.useState(1);
  const [subscribed, setSubscribed] = React.useState(false);
  const [done, setDone] = React.useState<number[]>([30]);
  const len = current.minutes * 60;

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setPos((p) => Math.min(len, p + speed)), 1000);
    return () => clearInterval(id);
  }, [playing, speed, len]);

  function play(e: Episode) {
    if (e.n === current.n) { setPlaying((p) => !p); return; }
    setCurrent(e);
    setPos(0);
    setPlaying(true);
  }

  return (
    <div className="min-h-dvh bg-background pb-32 text-foreground">
      <header className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.6_0.17_25/40%),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.15_280/30%),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end">
          <div aria-hidden className="flex size-44 shrink-0 items-end rounded-surface bg-[linear-gradient(145deg,oklch(0.62_0.18_25),oklch(0.35_0.12_300))] p-4 shadow-overlay">
            <span className="font-display text-3xl font-black leading-tight text-white">رادیو<br />پاییز</span>
          </div>
          <div className="min-w-0 flex-1">
            <Badge variant="brand">پادکست · فرهنگ و جامعه</Badge>
            <h1 className="mt-2 font-display text-4xl font-black">رادیو پاییز</h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">هر چهارشنبه یک گفت‌وگوی بی‌عجله با آدم‌هایی که کارشون را دوست دارن. میزبان: آرش صادقی.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => play(episodes[0])}>{playing && current.n === episodes[0].n ? <Pause /> : <Play />}پخش آخرین قسمت</Button>
              <Button variant={subscribed ? "secondary" : "outline"} onClick={() => setSubscribed((s) => !s)} aria-pressed={subscribed}>{subscribed ? <Check /> : <Bell />}{subscribed ? "دنبال می‌کنید" : "دنبال کردن"}</Button>
              <Button variant="ghost" size="icon" aria-label="اشتراک‌گذاری"><Share2 /></Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><ListMusic className="size-4" />همه‌ی قسمت‌ها <span className="text-sm font-normal text-muted-foreground">({fa(32)})</span></h2>
        <ol className="divide-y divide-border">
          {episodes.map((e) => {
            const on = e.n === current.n;
            const heard = done.includes(e.n);
            return (
              <li key={e.n} className="flex gap-4 py-4">
                <button type="button" onClick={() => play(e)} aria-label={`${on && playing ? "توقف" : "پخش"} قسمت ${fa(e.n)}`} className={cn("flex size-12 shrink-0 items-center justify-center rounded-full border-line transition-colors", on ? "border-transparent bg-primary text-primary-foreground" : "border-border hover:bg-accent")}>
                  {on && playing ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">قسمت {fa(e.n)} · {e.date} · {fa(e.minutes)} دقیقه</p>
                  <h3 className={cn("mt-0.5 font-semibold", on && "text-brand")}>{e.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-7 text-muted-foreground">{e.desc}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    {e.guest && <span className="text-muted-foreground">مهمان: {e.guest}</span>}
                    {heard && <span className="flex items-center gap-1 text-success"><Check className="size-3.5" />شنیده‌اید</span>}
                    <button type="button" onClick={() => setDone((d) => (heard ? d.filter((x) => x !== e.n) : [...d, e.n]))} className="text-muted-foreground underline-offset-4 hover:underline">{heard ? "علامت نشنیده" : "علامت شنیده"}</button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label={`دانلود قسمت ${fa(e.n)}`} className="shrink-0"><Download /></Button>
              </li>
            );
          })}
        </ol>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur" role="region" aria-label="پخش‌کننده">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-3">
          {/* Media time runs left to right everywhere, the same as the video player. */}
          <div dir="ltr" className="flex items-center gap-3 text-[11px] tabular-nums text-muted-foreground">
            <span>{clock(pos)}</span>
            <input
              type="range"
              min={0}
              max={len}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="جای پخش"
              aria-valuetext={`${clock(pos)} از ${clock(len)}`}
              className="h-1 flex-1 cursor-pointer accent-[var(--brand)]"
            />
            <span>-{clock(len - pos)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="size-11 shrink-0 rounded-control bg-[linear-gradient(145deg,oklch(0.62_0.18_25),oklch(0.35_0.12_300))]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{current.title}</p>
              <p className="truncate text-xs text-muted-foreground">رادیو پاییز · قسمت {fa(current.n)}</p>
            </div>
            <div dir="ltr" className="flex items-center gap-1">
              <button type="button" aria-label="۱۵ ثانیه عقب" onClick={() => setPos((p) => Math.max(0, p - 15))} className="rounded-full p-2 hover:bg-accent"><RotateCcw className="size-5" /></button>
              <button type="button" aria-label={playing ? "توقف" : "پخش"} onClick={() => setPlaying((p) => !p)} className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">{playing ? <Pause className="size-5" /> : <Play className="size-5" />}</button>
              <button type="button" aria-label="۱۵ ثانیه جلو" onClick={() => setPos((p) => Math.min(len, p + 15))} className="rounded-full p-2 hover:bg-accent"><RotateCw className="size-5" /></button>
            </div>
            <button type="button" onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])} aria-label={`سرعت پخش ${fa(speed)} برابر`} className="w-12 rounded-control border-line border-border py-1 text-xs font-semibold tabular-nums hover:bg-accent">
              {fa(speed)}×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
