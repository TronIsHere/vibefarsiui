"use client";

import * as React from "react";
import { ArrowRight, Bookmark, Camera, ChevronLeft, MapPin, MessageSquare, Phone, Plus, Search, Share2, ShieldAlert } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Switch } from "@/registry/ui/switch";
import { cn, fa, faNumber } from "@/lib/utils";

type Ad = {
  id: number;
  title: string;
  price: number | null;
  cat: string;
  area: string;
  minutes: number;
  photos: number;
  urgent?: boolean;
  bumped?: boolean;
  hue: number;
  specs: [string, string][];
  body: string;
};

const ads: Ad[] = [
  { id: 1, title: "پژو ۲۰۷ دنده‌ای مدل ۱۴۰۱", price: 785_000_000, cat: "خودرو", area: "پونک", minutes: 4, photos: 8, bumped: true, hue: 220, specs: [["کارکرد", "۳۲٬۰۰۰ کیلومتر"], ["رنگ", "سفید"], ["بدنه", "بی‌رنگ"]], body: "تک‌برگ، بیمه تا اسفند. فقط خریدار واقعی تماس بگیره." },
  { id: 2, title: "آیفون ۱۳ ۱۲۸ گیگ در حد نو", price: 41_500_000, cat: "موبایل", area: "ونک", minutes: 12, photos: 5, urgent: true, hue: 280, specs: [["سلامت باتری", "۸۹٪"], ["رجیستری", "شده"], ["رنگ", "آبی"]], body: "با جعبه و شارژر اصلی. بدون خط و خش، همیشه با قاب بوده." },
  { id: 3, title: "اجاره‌ی آپارتمان ۷۵ متری", price: null, cat: "املاک", area: "سعادت‌آباد", minutes: 35, photos: 11, hue: 30, specs: [["متراژ", "۷۵ متر"], ["اتاق", "۲"], ["طبقه", "۳ از ۵"]], body: "ودیعه و اجاره قابل تبدیل. پارکینگ و انباری داره. مناسب خانواده‌ی کم‌جمعیت." },
  { id: 4, title: "مبل راحتی ۷ نفره", price: 18_000_000, cat: "خانه", area: "تهرانپارس", minutes: 60, photos: 3, hue: 40, specs: [["جنس", "پارچه"], ["وضعیت", "در حد نو"]], body: "به خاطر اسباب‌کشی می‌فروشم. فقط دو سال استفاده شده." },
  { id: 5, title: "دوچرخه‌ی کوهستان سایز ۲۶", price: 9_200_000, cat: "ورزش", area: "شهرک غرب", minutes: 95, photos: 4, hue: 150, specs: [["دنده", "۲۱"], ["ترمز", "دیسکی"]], body: "سرویس کامل شده، لاستیک‌ها نو." },
  { id: 6, title: "لپ‌تاپ برای برنامه‌نویسی", price: 52_000_000, cat: "موبایل", area: "ونک", minutes: 180, photos: 0, hue: 260, specs: [["رم", "۱۶ گیگ"], ["حافظه", "۵۱۲ گیگ SSD"]], body: "پردازنده‌ی نسل ۱۲. باتری تا ۶ ساعت." },
];

const cats = ["همه", "خودرو", "موبایل", "املاک", "خانه", "ورزش"];
const ago = (m: number) => (m < 60 ? `${fa(m)} دقیقه پیش` : `${fa(Math.round(m / 60))} ساعت پیش`);
const priceText = (p: number | null) => (p === null ? "توافقی" : `${faNumber(p)} تومان`);

/** نیازمندی‌ها: فهرست آگهی با فیلتر دسته و قیمت، آگهی فوری و نردبان، و صفحه‌ی جزئیات با نمایش شماره بعد از هشدار. */
export function ClassifiedsPage() {
  const [cat, setCat] = React.useState("همه");
  const [q, setQ] = React.useState("");
  const [withPhoto, setWithPhoto] = React.useState(false);
  const [urgentOnly, setUrgentOnly] = React.useState(false);
  const [open, setOpen] = React.useState<Ad | null>(null);
  const [showPhone, setShowPhone] = React.useState(false);
  const [saved, setSaved] = React.useState<number[]>([]);

  const list = ads.filter((a) => (cat === "همه" || a.cat === cat) && (!withPhoto || a.photos > 0) && (!urgentOnly || a.urgent) && (!q || a.title.includes(q)));

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <span className="font-display text-xl font-black text-destructive">بازارچه</span>
          <button type="button" className="hidden items-center gap-1 rounded-control px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent sm:flex">
            <MapPin className="size-4" />تهران
          </button>
          <label className="relative flex-1">
            <span className="sr-only">جست‌وجو در آگهی‌ها</span>
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو در همه‌ی آگهی‌ها" className="h-10 w-full rounded-field border-line-field border-input bg-field ps-9 pe-3 text-sm shadow-field outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
          </label>
          <Button variant="destructive" className="shrink-0"><Plus />ثبت آگهی</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start" aria-label="فیلترها">
          <div>
            <p className="mb-2 text-sm font-semibold">دسته‌بندی</p>
            <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
              {cats.map((c) => (
                <li key={c}>
                  <button type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("w-full rounded-control px-3 py-1.5 text-start text-sm transition-colors", cat === c ? "bg-destructive/10 font-medium text-destructive" : "text-muted-foreground hover:bg-accent")}>{c}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 border-t border-border pt-4 text-sm">
            <label className="flex items-center justify-between gap-3">فقط عکس‌دار<Switch checked={withPhoto} onCheckedChange={setWithPhoto} /></label>
            <label className="flex items-center justify-between gap-3">فقط فوری<Switch checked={urgentOnly} onCheckedChange={setUrgentOnly} /></label>
          </div>
        </aside>

        <main>
          <p className="mb-3 text-xs text-muted-foreground" aria-live="polite">{fa(list.length)} آگهی {cat !== "همه" && `در ${cat}`}</p>
          {list.length === 0 ? (
            <p className="rounded-surface border-line border-dashed border-border py-16 text-center text-sm text-muted-foreground">آگهی‌ای با این فیلترها نیست. یکی از فیلترها را بردارید.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {list.map((a) => (
                <li key={a.id}>
                  <button type="button" onClick={() => { setOpen(a); setShowPhone(false); }} className="flex w-full gap-3 rounded-surface border-line border-border bg-card p-3 text-start transition-colors hover:bg-accent/50 focus-visible:outline-2 focus-visible:outline-ring">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h2 className="line-clamp-2 font-semibold leading-7">{a.title}</h2>
                      <p className="mt-auto pt-3 text-sm">{priceText(a.price)}</p>
                      <p className="text-[11px] text-muted-foreground">{ago(a.minutes)} در {a.area}</p>
                    </div>
                    <span className="relative size-28 shrink-0 overflow-hidden rounded-control" style={{ background: a.photos ? `linear-gradient(135deg, oklch(0.8 0.06 ${a.hue}), oklch(0.5 0.1 ${a.hue}))` : "var(--secondary)" }}>
                      {!a.photos && <Camera className="absolute inset-0 m-auto size-6 text-muted-foreground/50" aria-label="بدون عکس" />}
                      {a.urgent && <span className="absolute start-1.5 top-1.5 rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">فوری</span>}
                      {a.bumped && <span className="absolute bottom-1.5 start-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">نردبان</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="ad-title" className="fixed inset-0 z-30 overflow-y-auto bg-background" onKeyDown={(e) => e.key === "Escape" && setOpen(null)}>
          <div className="mx-auto max-w-5xl px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setOpen(null)} autoFocus><ArrowRight />بازگشت</Button>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" aria-label="ذخیره" aria-pressed={saved.includes(open.id)} onClick={() => setSaved((s) => (s.includes(open.id) ? s.filter((x) => x !== open.id) : [...s, open.id]))}>
                  <Bookmark className={cn(saved.includes(open.id) && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon" aria-label="اشتراک‌گذاری"><Share2 /></Button>
              </div>
            </div>
            <div className="mt-4 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <nav aria-label="مسیر" className="flex items-center gap-1 text-xs text-muted-foreground">بازارچه<ChevronLeft className="size-3" />{open.cat}</nav>
                <h1 id="ad-title" className="font-display text-2xl font-bold leading-10">{open.title}</h1>
                <p className="text-sm text-muted-foreground">{ago(open.minutes)} در تهران، {open.area}</p>
                <div className="flex gap-2">
                  <Button variant="destructive" className="flex-1" onClick={() => setShowPhone(true)}><Phone />اطلاعات تماس</Button>
                  <Button variant="outline" className="flex-1"><MessageSquare />چت</Button>
                </div>
                {showPhone && (
                  <div role="status" className="space-y-2 rounded-surface border-line border-warning/40 bg-warning/10 p-3 text-sm">
                    <p className="flex items-start gap-2 text-xs"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />پیش از دیدن کالا هیچ پولی واریز نکنید. بیعانه دادن یعنی ریسک کلاهبرداری.</p>
                    <p className="flex items-center justify-between font-bold"><span>شماره‌ی موبایل</span><bdi dir="ltr" className="font-mono">0912 ••• 4581</bdi></p>
                  </div>
                )}
                <dl className="divide-y divide-border border-y border-border text-sm">
                  <div className="flex justify-between py-3"><dt className="text-muted-foreground">قیمت</dt><dd className="font-medium">{priceText(open.price)}</dd></div>
                  {open.specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between py-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
                  ))}
                </dl>
                <div>
                  <h2 className="mb-1 font-semibold">توضیحات</h2>
                  <p className="text-sm leading-8">{open.body}</p>
                </div>
                <Badge variant="outline">کد آگهی <bdi dir="ltr" className="ms-1 font-mono">gZ{open.id}k7Lq</bdi></Badge>
              </div>
              <div className="order-first md:order-none">
                <div className="aspect-[4/3] rounded-surface" style={{ background: open.photos ? `linear-gradient(135deg, oklch(0.82 0.06 ${open.hue}), oklch(0.45 0.1 ${open.hue}))` : "var(--secondary)" }} aria-label={open.photos ? `${fa(open.photos)} عکس` : "بدون عکس"} role="img" />
                {open.photos > 1 && (
                  <div className="mt-2 grid grid-cols-4 gap-2" aria-hidden>
                    {[0, 1, 2, 3].map((i) => <span key={i} className="aspect-square rounded-control" style={{ background: `oklch(${0.55 + i * 0.08} 0.08 ${open.hue + i * 12})` }} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
