"use client";

import * as React from "react";
import { ArrowRight, Building2, CalendarCheck, Check, MapPin, Search, Star, Video } from "lucide-react";
import { SlotPicker, type SlotValue } from "@/registry/calendar/slot-picker";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { NationalIdInput } from "@/registry/ui/national-id-input";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { formatJalali } from "@/lib/jalali";
import { formatTimeRange } from "@/lib/calendar-utils";
import { cn, fa, formatToman } from "@/lib/utils";

type Doctor = { id: string; name: string; specialty: string; code: string; rating: number; reviews: number; area: string; fee: number; online: boolean; next: string; insurances: string[]; bio: string };

const doctors: Doctor[] = [
  { id: "d1", name: "دکتر سمیرا نوری", specialty: "متخصص پوست و مو", code: "۱۲۳۴۵۶", rating: 4.8, reviews: 412, area: "سعادت‌آباد", fee: 450_000, online: true, next: "فردا ۱۰:۳۰", insurances: ["تأمین اجتماعی", "سلامت", "تکمیلی"], bio: "فارغ‌التحصیل دانشگاه علوم پزشکی تهران با ۱۲ سال سابقه در درمان آکنه و ریزش مو." },
  { id: "d2", name: "دکتر رضا محمدی", specialty: "متخصص قلب و عروق", code: "۲۳۴۵۶۷", rating: 4.9, reviews: 287, area: "ونک", fee: 520_000, online: false, next: "شنبه ۹:۰۰", insurances: ["تأمین اجتماعی", "نیروهای مسلح"], bio: "فلوشیپ اکوکاردیوگرافی. ویزیت، نوار قلب و اکو در مطب انجام میشه." },
  { id: "d3", name: "دکتر مریم کاظمی", specialty: "متخصص کودکان", code: "۳۴۵۶۷۸", rating: 4.7, reviews: 530, area: "پاسداران", fee: 380_000, online: true, next: "امروز ۱۷:۱۵", insurances: ["سلامت", "تکمیلی"], bio: "پیگیری رشد کودک، واکسیناسیون و مشاوره‌ی تغذیه." },
  { id: "d4", name: "دکتر علی رضایی", specialty: "دندان‌پزشک", code: "۴۵۶۷۸۹", rating: 4.6, reviews: 198, area: "تجریش", fee: 300_000, online: false, next: "یکشنبه ۱۶:۰۰", insurances: ["تکمیلی"], bio: "ترمیم، عصب‌کشی و جرم‌گیری. نوبت‌های عصر هم داره." },
];

const specialties = ["همه", "پوست و مو", "قلب", "کودکان", "دندان"];

/** نوبت‌دهی پزشک: جست‌وجوی تخصص، فهرست پزشکان با اولین نوبت خالی، پروفایل با بیمه‌ها و انتخاب ساعت، فرم بیمار با کد ملی و کد پیگیری. */
export function DoctorAppointment() {
  const [spec, setSpec] = React.useState("همه");
  const [q, setQ] = React.useState("");
  const [doc, setDoc] = React.useState<Doctor | null>(null);
  const [mode, setMode] = React.useState("office");
  const [slot, setSlot] = React.useState<SlotValue>(null);
  const [nid, setNid] = React.useState({ v: "", ok: false });
  const [done, setDone] = React.useState(false);

  const list = doctors.filter((d) => (spec === "همه" || d.specialty.includes(spec)) && (!q || d.name.includes(q) || d.specialty.includes(q)));

  if (doc && done && slot) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
        <div className="w-full max-w-sm space-y-5 rounded-surface border-line border-border bg-card p-6 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success"><Check className="size-7" /></span>
          <div>
            <h1 className="font-display text-xl font-bold">نوبت شما ثبت شد</h1>
            <p className="mt-1 text-sm text-muted-foreground">پیامک یادآوری یک روز قبل فرستاده میشه.</p>
          </div>
          <dl className="space-y-2 rounded-control bg-secondary p-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">پزشک</dt><dd className="font-medium">{doc.name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">زمان</dt><dd className="font-medium">{formatJalali(slot.start, { weekday: true, year: false })}، {formatTimeRange(slot.start, slot.end)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">نوع</dt><dd className="font-medium">{mode === "office" ? "حضوری" : "تصویری"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">کد پیگیری</dt><dd><bdi dir="ltr" className="font-mono font-bold">TB-48213</bdi></dd></div>
          </dl>
          <Button variant="outline" className="w-full" onClick={() => { setDoc(null); setDone(false); setSlot(null); }}>بازگشت به فهرست پزشکان</Button>
        </div>
      </div>
    );
  }

  if (doc) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <Button variant="ghost" size="sm" onClick={() => { setDoc(null); setSlot(null); }}><ArrowRight />همه‌ی پزشکان</Button>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              <section className="flex gap-4 rounded-surface border-line border-border bg-card p-5">
                <Avatar name={doc.name.replace("دکتر ", "")} size="lg" className="size-20 text-2xl" />
                <div className="min-w-0 flex-1">
                  <h1 className="font-display text-xl font-bold">{doc.name}</h1>
                  <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                  <p className="mt-1 text-xs text-muted-foreground">کد نظام پزشکی <span className="font-medium text-foreground">{doc.code}</span></p>
                  <p className="mt-2 flex items-center gap-1 text-sm"><Star className="size-4 fill-warning text-warning" /><span className="font-semibold">{fa(doc.rating)}</span><span className="text-muted-foreground">({fa(doc.reviews)} نظر)</span></p>
                </div>
              </section>
              <section className="rounded-surface border-line border-border bg-card p-5">
                <h2 className="font-semibold">درباره‌ی پزشک</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{doc.bio}</p>
                <p className="mt-3 flex items-center gap-1.5 text-sm"><MapPin className="size-4 text-muted-foreground" />تهران، {doc.area}، ساختمان پزشکان سینا، طبقه‌ی ۳</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{doc.insurances.map((i) => <Badge key={i} variant="outline">{i}</Badge>)}</div>
              </section>
              <section className="space-y-3 rounded-surface border-line border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-semibold">انتخاب زمان</h2>
                  <SegmentedControl size="sm" value={mode} onChange={(v) => { setMode(v); setSlot(null); }} aria-label="نوع ویزیت" options={[{ value: "office", label: "حضوری" }, { value: "video", label: "تصویری", disabled: !doc.online }]} />
                </div>
                <SlotPicker key={doc.id + mode} value={slot} onChange={setSlot} duration={mode === "office" ? 20 : 15} days={7} hours={mode === "office" ? [["09:00", "13:00"], ["16:00", "19:00"]] : [["20:00", "22:00"]]} />
              </section>
            </div>

            <aside className="h-fit space-y-4 rounded-surface border-line border-border bg-card p-5 lg:sticky lg:top-5">
              <h2 className="font-semibold">اطلاعات بیمار</h2>
              <div>
                <label htmlFor="patient-nid" className="text-sm font-medium">کد ملی بیمار</label>
                <NationalIdInput id="patient-nid" className="mt-1.5" value={nid.v} onChange={(v, ok) => setNid({ v, ok })} />
              </div>
              <dl className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">زمان</dt><dd className="text-end">{slot ? `${formatJalali(slot.start, { weekday: true, year: false })}، ${formatTimeRange(slot.start, slot.end)}` : "انتخاب نشده"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">نوع</dt><dd className="flex items-center gap-1">{mode === "office" ? <Building2 className="size-3.5" /> : <Video className="size-3.5" />}{mode === "office" ? "حضوری" : "تصویری"}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">هزینه‌ی ویزیت</dt><dd className="font-semibold">{formatToman(doc.fee)}</dd></div>
              </dl>
              <Button className="w-full" size="lg" disabled={!slot || !nid.ok} onClick={() => setDone(true)}><CalendarCheck />ثبت نوبت</Button>
              <p className="text-[11px] text-muted-foreground">لغو رایگان تا ۲۴ ساعت قبل از نوبت.</p>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-[radial-gradient(ellipse_at_top_right,oklch(from_var(--brand)_l_c_h/18%),transparent_60%)]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="font-display text-3xl font-black">نوبت پزشک، بدون صف و تلفن</h1>
          <p className="mt-2 text-muted-foreground">نوبت حضوری یا ویزیت تصویری با پزشک‌های تهران.</p>
          <label className="relative mt-5 block max-w-xl">
            <span className="sr-only">جست‌وجوی پزشک یا تخصص</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="اسم پزشک یا تخصص، مثلاً «پوست»" className="h-12 w-full rounded-field border-line-field border-input bg-field ps-12 pe-4 shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {specialties.map((s) => (
              <button key={s} type="button" aria-pressed={spec === s} onClick={() => setSpec(s)} className={cn("rounded-full border-line px-3.5 py-1.5 text-sm transition-colors", spec === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-accent")}>{s}</button>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">{fa(list.length)} پزشک</p>
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((d) => (
            <li key={d.id} className="flex flex-col gap-4 rounded-surface border-line border-border bg-card p-4">
              <div className="flex gap-3">
                <Avatar name={d.name.replace("دکتر ", "")} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{d.name}</h2>
                  <p className="text-sm text-muted-foreground">{d.specialty} · {d.area}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs"><Star className="size-3.5 fill-warning text-warning" />{fa(d.rating)} <span className="text-muted-foreground">({fa(d.reviews)})</span>{d.online && <Badge variant="brand" className="ms-2 gap-1"><Video className="size-3" />ویزیت تصویری</Badge>}</p>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                <p className="text-xs"><span className="text-muted-foreground">اولین نوبت خالی: </span><span className="font-semibold text-success">{d.next}</span></p>
                <Button size="sm" onClick={() => setDoc(d)}>گرفتن نوبت</Button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
