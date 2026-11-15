"use client";

import * as React from "react";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Folder,
  Home,
  ImageIcon,
  Menu,
  MessageSquare,
  Package,
  PenLine,
  Search,
  Settings,
  Sparkles,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { TextShimmer } from "@/registry/animations/text-shimmer";
import { Typewriter } from "@/registry/animations/typewriter";
import { Counter } from "@/registry/animations/counter";
import { BlurText } from "@/registry/animations/blur-text";
import { AnimatedTabs } from "@/registry/animations/animated-tabs";
import { BorderBeam } from "@/registry/animations/border-beam";
import { ShineButton } from "@/registry/animations/shine-button";
import { Dock } from "@/registry/animations/dock";
import { AnimatedList } from "@/registry/animations/animated-list";
import { Orbit } from "@/registry/animations/orbit";
import { TiltCard } from "@/registry/animations/tilt-card";
import { LoadingDots } from "@/registry/animations/loading-dots";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { WordRotate } from "@/registry/animations/word-rotate";
import { TextScramble } from "@/registry/animations/text-scramble";
import { Odometer } from "@/registry/animations/odometer";
import { RippleButton } from "@/registry/animations/ripple-button";
import { MagneticButton } from "@/registry/animations/magnetic-button";
import { ProgressRing } from "@/registry/animations/progress-ring";
import { SuccessCheck } from "@/registry/animations/success-check";
import { Meteors } from "@/registry/animations/meteors";
import { SpotlightCard } from "@/registry/animations/spotlight-card";
import { GridReveal } from "@/registry/animations/grid-reveal";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Skeleton } from "@/registry/ui/skeleton";
import { TextReveal } from "@/registry/animations/text-reveal";
import { HighlightText } from "@/registry/animations/highlight-text";
import { GradientText } from "@/registry/animations/gradient-text";
import { FlipCard } from "@/registry/animations/flip-card";
import { AnimatedBeam } from "@/registry/animations/animated-beam";
import { Confetti } from "@/registry/animations/confetti";
import { SwipeToConfirm } from "@/registry/animations/swipe-to-confirm";
import { Terminal } from "@/registry/animations/terminal";
import { CardStack } from "@/registry/animations/card-stack";
import { MorphButton } from "@/registry/animations/morph-button";
import { CompareSlider } from "@/registry/animations/compare-slider";
import { ScratchCard } from "@/registry/animations/scratch-card";
import { Sparkles as SparklesFx } from "@/registry/animations/sparkles";
import { ScrollProgress } from "@/registry/animations/scroll-progress";
import { PulseButton } from "@/registry/animations/pulse-button";
import { CursorFollow } from "@/registry/animations/cursor-follow";
import { NumberWheel } from "@/registry/animations/number-wheel";
import { PinList } from "@/registry/animations/pin-list";
import { RadialIntro } from "@/registry/animations/radial-intro";
import { TextLoop } from "@/registry/animations/text-loop";
import { CurvedLoop } from "@/registry/animations/curved-loop";
import { NumberPop } from "@/registry/animations/number-pop";
import { NotificationBadge } from "@/registry/animations/notification-badge";
import { TextSwap } from "@/registry/animations/text-swap";
import { PanelReveal } from "@/registry/animations/panel-reveal";
import { PageSlide } from "@/registry/animations/page-slide";
import { IconSwap } from "@/registry/animations/icon-swap";
import { AvatarHover } from "@/registry/animations/avatar-hover";
import { ErrorShake } from "@/registry/animations/error-shake";
import { ClearInput } from "@/registry/animations/clear-input";
import { SkeletonReveal } from "@/registry/animations/skeleton-reveal";
import { FabMorph } from "@/registry/animations/fab-morph";
import { LikeButton } from "@/registry/animations/like-button";
import { ArrowLink } from "@/registry/animations/arrow-link";
import { ThinkingStates } from "@/registry/animations/thinking-states";
import { ReasoningStream } from "@/registry/animations/reasoning-stream";
import { StreamingText } from "@/registry/animations/streaming-text";
import { MatrixLoader } from "@/registry/animations/matrix-loader";
import { BannerStack, type StackBanner } from "@/registry/animations/banner-stack";
import { LineRise } from "@/registry/animations/line-rise";
import { ScrollFillText } from "@/registry/animations/scroll-fill-text";
import { GlitchText } from "@/registry/animations/glitch-text";
import { ImageReveal } from "@/registry/animations/image-reveal";
import { KenBurns } from "@/registry/animations/ken-burns";
import { ImageTrail } from "@/registry/animations/image-trail";
import { ImageLens } from "@/registry/animations/image-lens";
import { FillButton } from "@/registry/animations/fill-button";
import { RollButton } from "@/registry/animations/roll-button";
import { CursorRing } from "@/registry/animations/cursor-ring";
import { HeroIntro } from "@/registry/animations/hero-intro";
import { HeroParallax } from "@/registry/animations/hero-parallax";
import { Input } from "@/registry/ui/input";
import { SkeletonRow } from "@/registry/ui/skeleton";
import { Avatar } from "@/registry/ui/avatar";
import { cn, fa, faNumber } from "@/lib/utils";

const LODGE = ["hero", "room-badgir", "stars", "camel", "room-hoz", "sand"].map((n) => `/sites/lodge-site/${n}.webp`);

function ScrollFillDemo() {
  const box = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative h-44 w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card px-5 [scrollbar-width:thin]">
      <p className="sticky top-0 bg-card/90 py-2 text-center text-[11px] text-muted-foreground backdrop-blur">این کادر را اسکرول کنید</p>
      <div className="h-24" />
      <ScrollFillText
        scrollRef={box}
        className="text-lg font-bold"
        text="ما باور داریم ابزار خوب باید زبان کاربرش را بفهمد؛ از جهت نوشتن تا تقویم و اعداد. هر کامپوننت این‌جا از روز اول برای فارسی ساخته شده است."
      />
      <div className="h-32" />
    </div>
  );
}

function HeroParallaxDemo() {
  const chip = "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium shadow-lg";
  const photo = (src: string, w: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={cn("aspect-[4/5] rounded-xl border-4 border-card object-cover shadow-xl", w)} />
  );
  return (
    <HeroParallax
      className="h-80 w-full rounded-xl border border-border bg-muted/40"
      layers={[
        { node: photo(LODGE[0], "w-24"), depth: 1.3, className: "top-5 start-6", tilt: -7 },
        { node: photo(LODGE[2], "w-20"), depth: 0.8, className: "bottom-6 end-8", tilt: 6 },
        { node: photo(LODGE[1], "w-16"), depth: -0.6, className: "top-8 end-16 opacity-80", tilt: 4 },
        { node: <div className={chip}><Check className="size-3.5 text-success" />رزرو قطعی شد</div>, depth: 0.5, className: "bottom-10 start-10" },
        { node: <div className={chip}><Calendar className="size-3.5" />{fa(3)} شب، از {fa(12)} فروردین</div>, depth: 1, className: "top-4 start-[34%] hidden sm:block" },
      ]}
    >
      <div className="px-6 text-center">
        <p className="text-xs text-muted-foreground">اقامتگاه بومی</p>
        <h3 className="mt-1 text-3xl font-black">یک شب زیر آسمان کویر</h3>
        <Button size="sm" className="mt-4">رزرو کنید</Button>
      </div>
    </HeroParallax>
  );
}

function OdometerDemo() {
  const prices = [12_450_000, 12_980_000, 9_870_000, 13_120_000];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % prices.length), 2200);
    return () => window.clearInterval(id);
  }, [prices.length]);
  return <Odometer value={prices[i]} unit="تومان" className="text-3xl font-bold" />;
}

function BeamDemo() {
  const box = React.useRef<HTMLDivElement>(null);
  const hub = React.useRef<HTMLDivElement>(null);
  const a = React.useRef<HTMLDivElement>(null);
  const b = React.useRef<HTMLDivElement>(null);
  const c = React.useRef<HTMLDivElement>(null);
  const node = "flex size-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm";
  return (
    <div ref={box} className="relative isolate flex h-40 w-full max-w-xs items-center justify-between">
      <div className="flex flex-col gap-5">
        <div ref={a} className={node}><Bell className="size-4" /></div>
        <div ref={b} className={node}><MessageSquare className="size-4" /></div>
        <div ref={c} className={node}><Calendar className="size-4" /></div>
      </div>
      <div ref={hub} className="flex size-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg"><Sparkles className="size-5" /></div>
      <AnimatedBeam containerRef={box} fromRef={a} toRef={hub} curvature={-30} />
      <AnimatedBeam containerRef={box} fromRef={b} toRef={hub} delay={0.7} />
      <AnimatedBeam containerRef={box} fromRef={c} toRef={hub} curvature={30} delay={1.4} />
    </div>
  );
}

function ConfettiDemo() {
  const [n, setN] = React.useState(0);
  return (
    <div className="flex h-40 w-full items-end justify-center overflow-hidden rounded-xl border border-border bg-card pb-5">
      <div className="relative isolate">
        {n > 0 && <Confetti key={n} />}
        <Button onClick={() => setN((x) => x + 1)}>پرداخت انجام شد</Button>
      </div>
    </div>
  );
}

function ScrollProgressDemo() {
  const box = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative h-40 w-full max-w-xs overflow-auto rounded-xl border border-border bg-card text-xs leading-6 text-muted-foreground">
      <ScrollProgress targetRef={box} className="sticky inset-x-auto top-0 h-1" />
      <div className="space-y-3 p-4">
        <p className="font-semibold text-foreground">برای دیدن نوار، این جعبه را اسکرول کنید.</p>
        {Array.from({ length: 6 }, (_, i) => <p key={i}>بند {fa(i + 1)}: متن نمونه برای پر کردن جعبه. تا پایین که برسید نوار بالای جعبه کامل می‌شود و از راست پر شده است.</p>)}
      </div>
    </div>
  );
}

const mockCard = (filled: boolean) => (
  <div className="h-44 w-full bg-card p-4">
    <div className="flex items-center gap-3">
      {filled ? <Avatar name="سارا محمدی" size="sm" /> : <Skeleton className="size-7 rounded-full" />}
      <div className="flex-1 space-y-1.5">{filled ? <><p className="text-sm font-semibold">سارا محمدی</p><p className="text-xs text-muted-foreground">۲ دقیقه پیش</p></> : <><Skeleton className="h-3 w-24" /><Skeleton className="h-2.5 w-14" /></>}</div>
    </div>
    <div className="mt-4 space-y-2">{filled ? <><p className="text-sm">سفارش #{fa(14052)} پرداخت شد.</p><p className="text-xs text-muted-foreground">{faNumber(2_480_000)} تومان · درگاه زرین‌پال</p></> : <><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" /></>}</div>
    <div className="mt-4 flex gap-2">{filled ? <><Button size="sm">مشاهده</Button><Button size="sm" variant="outline">رسید</Button></> : <><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></>}</div>
  </div>
);

function NumberPopDemo() {
  const prices = [12_450_000, 12_980_000, 9_870_000, 13_120_000];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % prices.length), 2200);
    return () => window.clearInterval(id);
  }, [prices.length]);
  return <NumberPop value={prices[i]} unit="تومان" className="text-3xl font-bold" />;
}

function BadgeDemo() {
  const [n, setN] = React.useState(3);
  return (
    <div className="flex items-center gap-6">
      <NotificationBadge show={n > 0} count={n}>
        <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-card"><Bell className="size-5" /></span>
      </NotificationBadge>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setN((x) => x + 1)}>اعلان جدید</Button>
        <Button size="sm" variant="ghost" onClick={() => setN(0)}>خواندم</Button>
      </div>
    </div>
  );
}

const SAVE_LABELS = ["ذخیره", "در حال ذخیره…", "ذخیره شد"];
function TextSwapDemo() {
  const [step, setStep] = React.useState(0);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const run = () => {
    if (step !== 0) return;
    setStep(1);
    timer.current = window.setTimeout(() => {
      setStep(2);
      timer.current = window.setTimeout(() => setStep(0), 1600);
    }, 1200);
  };
  return (
    <Button onClick={run} className={step === 2 ? "bg-success hover:bg-success" : undefined}>
      <TextSwap value={SAVE_LABELS[step]} options={SAVE_LABELS} />
    </Button>
  );
}

function PanelDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>{open ? "بستن فیلترها" : "نمایش فیلترها"}</Button>
      <PanelReveal open={open} from="start" className="w-full rounded-xl border border-border bg-card p-3 text-sm">
        <p className="font-medium">فیلترها</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{["ارزان‌ترین", "پرفروش", "موجود", "تخفیف‌دار"].map((t) => <Badge key={t} variant="outline">{t}</Badge>)}</div>
      </PanelReveal>
    </div>
  );
}

function PageSlideDemo() {
  const [i, setI] = React.useState(0);
  const orders = [["سفارش #۱۴۰۵۲", "۲٬۴۸۰٬۰۰۰ تومان"], ["سفارش #۱۴۰۵۳", "۹۸۰٬۰۰۰ تومان"], ["سفارش #۱۴۰۵۴", "۱۲٬۴۵۰٬۰۰۰ تومان"]];
  const card = "w-full rounded-xl border border-border bg-card p-4 text-sm";
  return (
    <div className="w-full max-w-sm">
      <PageSlide
        index={i}
        pages={[
          <ul key="list" className={cn(card, "divide-y divide-border p-0")}>
            {orders.map(([t, p]) => (
              <li key={t}>
                <button type="button" onClick={() => setI(1)} className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-start hover:bg-accent/60">
                  <span>{t}</span><span className="flex items-center gap-1 text-xs text-muted-foreground">{p}<ChevronRight className="size-3.5 rtl:-scale-x-100" /></span>
                </button>
              </li>
            ))}
          </ul>,
          <div key="detail" className={card}>
            <div className="flex items-center justify-between"><p className="font-semibold">سفارش #۱۴۰۵۲</p><Badge>پرداخت شد</Badge></div>
            <p className="mt-2 text-muted-foreground">۳ قلم · ارسال با پست پیشتاز · تحویل تا سه‌شنبه</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setI(0)}>بازگشت به فهرست</Button>
          </div>,
        ]}
      />
    </div>
  );
}

function IconSwapDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Button variant="outline" size="icon" aria-label={open ? "بستن" : "منو"} onClick={() => setOpen((o) => !o)}>
      <IconSwap state={open ? "b" : "a"} a={<Menu className="size-5" />} b={<X className="size-5" />} rotate />
    </Button>
  );
}

function ErrorShakeDemo() {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  return (
    <form
      className="flex w-full max-w-xs items-start gap-2"
      onSubmit={(e) => { e.preventDefault(); setError(code === "1234" ? null : "کد تخفیف معتبر نیست."); }}
    >
      <ErrorShake error={error} onRevert={() => setError(null)} className="flex-1">
        <Input value={code} onChange={(e) => { setCode(e.target.value); setError(null); }} placeholder="کد تخفیف (۱۲۳۴ درسته)" dir="ltr" className="text-center" />
      </ErrorShake>
      <Button type="submit" variant="outline">اعمال</Button>
    </form>
  );
}

function ClearInputDemo() {
  const [q, setQ] = React.useState("کفش ورزشی مردانه سایز ۴۲");
  return <ClearInput value={q} onChange={setQ} placeholder="جستجوی محصول…" />;
}

function SkeletonRevealDemo() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 1400);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="w-full max-w-xs rounded-xl border border-border bg-card p-4">
      <SkeletonReveal loading={loading} skeleton={<SkeletonRow />}>
        <div className="flex items-center gap-3">
          <Avatar name="سارا محمدی" src="/avatars/sara.jpg" size="lg" />
          <div><p className="text-sm font-semibold">سارا محمدی</p><p className="text-xs text-muted-foreground">طراح محصول · تهران</p></div>
        </div>
      </SkeletonReveal>
    </div>
  );
}

function LikeDemo() {
  return (
    <div className="flex items-center gap-3">
      <LikeButton count={127} />
      <LikeButton defaultLiked count={8} />
    </div>
  );
}

function BannerStackDemo() {
  const seed = React.useRef(0);
  const samples: Omit<StackBanner, "id">[] = [
    { title: "پرداخت انجام شد", description: "۲٬۴۸۰٬۰۰۰ تومان از کارت شما کم شد.", icon: <Check /> },
    { title: "سفارش ارسال شد", description: "کد رهگیری به شماره‌تون پیامک شد.", icon: <Package /> },
    { title: "پیام جدید", description: "سارا: فاکتور را دیدم، ممنون.", icon: <MessageSquare /> },
    { title: "آپلود کامل شد", description: "۴ عکس به گالری اضافه شد.", icon: <Upload /> },
  ];
  const [items, setItems] = React.useState<StackBanner[]>(() => [{ id: 0, ...samples[0] }]);
  const push = () => {
    seed.current += 1;
    setItems((s) => [{ id: seed.current, ...samples[seed.current % samples.length] }, ...s].slice(0, 5));
  };
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <Button size="sm" variant="outline" onClick={push}>اعلان جدید</Button>
      <BannerStack items={items} />
    </div>
  );
}

/** Demos that restart when `k` changes (the docs page passes a replay counter). */
export const animationDemos: Record<string, (k: number) => React.ReactNode> = {
  "text-shimmer": () => (
    <TextShimmer className="text-lg font-semibold">
      در حال فکر کردن…
    </TextShimmer>
  ),
  typewriter: (k) => (
    <Typewriter
      key={k}
      text="یک فرم ثبت‌نام فارسی بساز."
      className="text-base"
    />
  ),
  counter: (k) => (
    <div key={k} className="text-center">
      <Counter to={12_450_000} unit="تومان" className="text-4xl font-bold" />
      <p className="text-xs text-muted-foreground">فروش امروز</p>
    </div>
  ),
  "blur-text": (k) => (
    <p key={k} className="text-center text-xl font-bold leading-relaxed">
      <BlurText text="کامپوننت‌هایی که فارسی را می‌فهمند" />
    </p>
  ),
  "animated-tabs": () => <AnimatedTabs items={["همه", "فعال", "بایگانی"]} />,
  "border-beam": () => (
    <BorderBeam className="w-full max-w-[240px]">
      <div className="p-4">
        <p className="text-sm font-semibold">پلن حرفه‌ای</p>
        <p className="mt-1 text-xs text-muted-foreground">
          همه‌ی کامپوننت‌ها، تم‌ها و قالب‌ها
        </p>
      </div>
    </BorderBeam>
  ),
  "shine-button": () => (
    <ShineButton>
      <Sparkles />
      ارتقا به پرو
    </ShineButton>
  ),
  dock: () => (
    <Dock
      items={[
        { icon: Home, label: "خانه" },
        { icon: Search, label: "جست‌وجو" },
        { icon: MessageSquare, label: "پیام‌ها" },
        { icon: Calendar, label: "تقویم" },
        { icon: Folder, label: "فایل‌ها" },
        { icon: Settings, label: "تنظیمات" },
      ]}
    />
  ),
  "animated-list": (k) => (
    <AnimatedList key={k} className="w-full max-w-[250px]">
      {[
        { i: Check, t: "پرداخت تأیید شد", s: "همین حالا" },
        { i: Bell, t: "سفارش جدید #۱۴۰۵۳", s: "۲ دقیقه پیش" },
        { i: MessageSquare, t: "پیام از مریم احمدی", s: "۵ دقیقه پیش" },
      ].map((it) => (
        <div
          key={it.t}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-secondary">
            <it.i className="size-3.5" />
          </span>
          <span className="flex-1 text-xs">
            <span className="block font-medium">{it.t}</span>
            <span className="text-muted-foreground">{it.s}</span>
          </span>
        </div>
      ))}
    </AnimatedList>
  ),
  orbit: () => {
    const dot = (I: React.ComponentType<{ className?: string }>) => (
      <span className="flex size-6 items-center justify-center rounded-full border border-border bg-card">
        <I className="size-3" />
      </span>
    );
    return (
      <Orbit
        size={150}
        center={
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
            <Sparkles className="size-4" />
          </span>
        }
        items={[
          { node: dot(Home), radius: 62, duration: 9 },
          { node: dot(Settings), radius: 62, duration: 9, delay: -4.5 },
          { node: dot(Bell), radius: 42, duration: 6, delay: -2 },
        ]}
      />
    );
  },
  "tilt-card": () => (
    <TiltCard className="w-full max-w-[220px] cursor-pointer p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">کارت بانکی</span>
        <span className="size-5 rounded-full bg-secondary" />
      </div>
      <p className="mt-5   text-sm tracking-wider" dir="ltr">
        •••• •••• •••• ۴۸۲۱
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">
        سارا محمدی · ۰۸/۰۷
      </p>
    </TiltCard>
  ),
  "loading-dots": () => <LoadingDots label="در حال دریافت پاسخ" />,
  marquee: () => (
    <Marquee duration={18} className="max-w-full">
      {[
        "راست‌چین",
        "تقویم شمسی",
        "ارقام فارسی",
        "تومان",
        "IRANSans",
        "Vazirmatn",
        "MCP",
        "Tailwind",
      ].map((t) => (
        <Badge key={t} variant="outline">
          {t}
        </Badge>
      ))}
    </Marquee>
  ),
  "word-rotate": () => (
    <p className="text-center text-xl font-bold">
      برای <WordRotate words={["توسعه‌دهنده", "طراح", "وایب‌کدر", "فروشگاه"]} className="text-brand" /> ساخته شده
    </p>
  ),
  "text-scramble": (k) => <TextScramble key={k} text="کامپوننت‌هایی که فارسی را می‌فهمند" className="text-center text-lg font-bold" />,
  odometer: () => <OdometerDemo />,
  "ripple-button": () => <RippleButton size="lg">پرداخت ۲٬۴۸۰٬۰۰۰ تومان</RippleButton>,
  "magnetic-button": () => <MagneticButton>شروع کنید</MagneticButton>,
  "progress-ring": (k) => <ProgressRing key={k} value={72} label="هدف ماهانه" />,
  "success-check": (k) => <SuccessCheck key={k} label="پرداخت انجام شد" />,
  meteors: () => (
    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border bg-background">
      <Meteors count={10} />
      <div className="relative flex h-full items-center justify-center text-sm font-semibold">شب یلدا مبارک</div>
    </div>
  ),
  "spotlight-card": () => (
    <SpotlightCard className="w-full max-w-[260px]">
      <div className="p-4"><p className="text-sm font-semibold">پلن حرفه‌ای</p><p className="mt-1 text-xs text-muted-foreground">ماوس را روی کارت بچرخانید</p></div>
    </SpotlightCard>
  ),
  "grid-reveal": (k) => <GridReveal key={k} className="w-full max-w-[240px]" />,
  reveal: (k) => (
    <div key={k} className="w-full max-w-[260px] space-y-2">
      {["راست‌چین از پایه", "ارقام فارسی", "توکن‌های تم"].map((t, i) => (
        <Reveal key={t} delay={i * 120}>
          <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {t}
          </div>
        </Reveal>
      ))}
    </div>
  ),
  "text-reveal": (k) => (
    <h2 key={k} className="text-center text-2xl font-bold leading-snug">
      <TextReveal lines={["زیرساخت پرداخت", "برای محصول دیجیتال شما"]} />
    </h2>
  ),
  "highlight-text": (k) => (
    <p key={k} className="text-center text-xl font-bold">قیمت‌ها <HighlightText>ساده و شفاف</HighlightText> هستند</p>
  ),
  "gradient-text": () => <p className="text-center text-2xl font-bold"><GradientText>به‌زودی راه می‌افتیم</GradientText></p>,
  "flip-card": () => (
    <FlipCard
      className="h-36 w-full max-w-[240px]"
      front={<div className="flex h-36 flex-col justify-between rounded-xl border border-border bg-card p-4"><span className="text-sm font-semibold">پلن حرفه‌ای</span><span className="text-xs text-muted-foreground">برای دیدن قیمت، ماوس را روی کارت ببرید</span></div>}
      back={<div className="flex h-36 flex-col justify-between rounded-xl border border-foreground/30 bg-foreground p-4 text-background"><span className="text-sm font-semibold">{faNumber(290_000)} تومان / ماه</span><span className="text-xs opacity-70">همه‌ی کامپوننت‌ها و قالب‌ها</span></div>}
    />
  ),
  "animated-beam": () => <BeamDemo />,
  confetti: () => <ConfettiDemo />,
  "swipe-to-confirm": (k) => <SwipeToConfirm key={k} />,
  terminal: (k) => (
    <Terminal
      key={k}
      className="max-w-xs"
      lines={[
        { type: "cmd", text: "npx vibefarsi add otp-field" },
        { type: "out", text: "در حال دریافت از رجیستری…" },
        { type: "ok", text: "otp-field به components/ui اضافه شد" },
        { type: "ok", text: "وابستگی input از قبل بود" },
      ]}
    />
  ),
  "card-stack": () => (
    <CardStack
      className="h-40 max-w-[280px]"
      items={[
        { name: "مریم احمدی", role: "مدیر محصول", text: "مهاجرت یک بعدازظهر طول کشید و تقویم شمسی از روز اول درست بود." },
        { name: "علی رضایی", role: "بنیان‌گذار", text: "اولین کامپوننتی که دیدم اعداد را فارسی می‌نویسد بدون این‌که خودم چیزی بنویسم." },
        { name: "نگار کریمی", role: "طراح", text: "توکن‌ها را عوض کردم و همه‌ی صفحه‌ها با هم عوض شدند." },
      ].map((r) => (
        <div key={r.name} className="flex h-full flex-col justify-between p-4">
          <p className="text-sm leading-6">«{r.text}»</p>
          <div className="flex items-center gap-2"><Avatar name={r.name} size="sm" /><div className="text-xs"><p className="font-semibold">{r.name}</p><p className="text-muted-foreground">{r.role}</p></div></div>
        </div>
      ))}
    />
  ),
  "morph-button": () => <MorphButton loadingText="در حال ثبت…" doneText="ثبت شد">خبرم کن</MorphButton>,
  "compare-slider": () => <CompareSlider className="max-w-sm" before={mockCard(false)} after={mockCard(true)} beforeLabel="اسکلت" afterLabel="محتوا" />,
  "scratch-card": (k) => (
    <ScratchCard key={k} className="w-full max-w-[260px]" coverText="برای دیدن کد تخفیف، بخراشید">
      <div className="p-6 text-center"><p className="text-xs text-muted-foreground">کد تخفیف نوروزی</p><p className="mt-1 text-xl font-bold tracking-wider" dir="ltr">NOWRUZ40</p><p className="mt-1 text-xs text-success">{fa(40)}٪ تخفیف</p></div>
    </ScratchCard>
  ),
  sparkles: () => (
    <SparklesFx count={8}><Badge variant="brand" className="rounded-full border border-brand/30 px-3 text-sm">جدید</Badge></SparklesFx>
  ),
  "scroll-progress": () => <ScrollProgressDemo />,
  "pulse-button": () => <PulseButton size="lg">شروع رایگان</PulseButton>,
  "cursor-follow": () => (
    <CursorFollow label="مشاهده جزئیات" className="flex h-40 w-full max-w-[280px] items-center justify-center">
      <p className="text-sm text-muted-foreground">ماوس را روی این ناحیه بیاورید</p>
    </CursorFollow>
  ),
  "number-wheel": (k) => <NumberWheel key={k} value={2400} step={100} className="mx-auto" />,
  "pin-list": () => (
    <PinList
      className="w-full max-w-[280px]"
      items={[
        { id: "1", name: "خانه", info: "داشبورد اصلی", icon: Home, pinned: true },
        { id: "2", name: "کیف پول", info: "موجودی و تراکنش‌ها", icon: Wallet, pinned: false },
        { id: "3", name: "پیام‌ها", info: "۳ خوانده‌نشده", icon: MessageSquare, pinned: false },
        { id: "4", name: "تنظیمات", info: "حساب و اعلان‌ها", icon: Settings, pinned: false },
      ]}
    />
  ),
  "radial-intro": (k) => (
    <RadialIntro
      key={k}
      stageSize={200}
      imageSize={44}
      items={[
        { id: "1", name: "سارا", src: "/avatars/sara.jpg" },
        { id: "2", name: "علی", src: "/avatars/ali.jpg" },
        { id: "3", name: "مینا", src: "/avatars/mina.jpg" },
        { id: "4", name: "رضا", src: "/avatars/reza.jpg" },
        { id: "5", name: "نگار", src: "/avatars/negar.jpg" },
      ]}
    />
  ),
  "text-loop": () => (
    <TextLoop
      text="وایب‌فارسی"
      shape="wave"
      fontSize={34}
      ribbonWidth={60}
      curviness={60}
      className="max-w-full"
    />
  ),
  "curved-loop": () => (
    <CurvedLoop
      text="وایب‌فارسی · راست‌چین · فارسی · MCP"
      curveAmount={120}
      className="max-w-full"
    />
  ),
  "number-pop": () => <NumberPopDemo />,
  "notification-badge": () => <BadgeDemo />,
  "text-swap": () => <TextSwapDemo />,
  "panel-reveal": () => <PanelDemo />,
  "page-slide": () => <PageSlideDemo />,
  "icon-swap": () => <IconSwapDemo />,
  "avatar-hover": () => (
    <AvatarHover
      size="lg"
      people={[
        { name: "سارا", src: "/avatars/sara.jpg" },
        { name: "علی", src: "/avatars/ali.jpg" },
        { name: "مینا", src: "/avatars/mina.jpg" },
        { name: "رضا", src: "/avatars/reza.jpg" },
        { name: "نگار", src: "/avatars/negar.jpg" },
      ]}
    />
  ),
  "error-shake": () => <ErrorShakeDemo />,
  "clear-input": () => <ClearInputDemo />,
  "skeleton-reveal": (k) => <SkeletonRevealDemo key={k} />,
  "fab-morph": () => (
    <FabMorph
      items={[
        { label: "پست جدید", icon: <PenLine /> },
        { label: "آپلود عکس", icon: <ImageIcon /> },
        { label: "پوشه‌ی جدید", icon: <Folder /> },
      ]}
    />
  ),
  "like-button": () => <LikeDemo />,
  "arrow-link": () => (
    <div className="flex flex-col items-start gap-3">
      <ArrowLink href="#">بیشتر بخوانید</ArrowLink>
      <ArrowLink href="#" className="text-muted-foreground hover:text-foreground">همه‌ی سفارش‌ها</ArrowLink>
    </div>
  ),
  "thinking-states": () => <ThinkingStates states={["در حال خواندن فایل‌ها", "در حال اجرای دستور", "در حال نوشتن پاسخ"]} />,
  "reasoning-stream": () => (
    <ReasoningStream
      text={[
        "اول فایل تنظیمات را می‌خوانم تا ببینم مسیر خروجی کجاست.",
        "به نظر می‌رسد مسیر نسبی است و از ریشه‌ی پروژه حساب نمی‌شود.",
        "پس باید قبل از ساخت، مسیر را با ریشه ترکیب کنم.",
        "تست‌ها را اجرا می‌کنم تا مطمئن شوم چیزی نشکسته.",
        "همه‌ی تست‌ها سبز شدند؛ تغییر را خلاصه می‌کنم.",
      ]}
    />
  ),
  "streaming-text": (k) => <StreamingText key={k} text="این متن مثل پاسخ یک مدل زبانی، کلمه‌به‌کلمه از دل تاری بیرون می‌آید و در جای خودش می‌نشیند؛ نه مثل تایپ کردن، بیشتر مثل شکل گرفتن." className="max-w-sm text-sm" />,
  "matrix-loader": () => (
    <div className="flex items-center gap-6">
      <MatrixLoader variant="scan" />
      <MatrixLoader variant="twinkle" />
      <MatrixLoader variant="orbit" rounded />
      <MatrixLoader variant="pulse" rounded />
      <MatrixLoader variant="wave" />
    </div>
  ),
  "banner-stack": () => <BannerStackDemo />,
  "line-rise": (k) => (
    <LineRise key={k} as="h3" className="text-center text-3xl font-black leading-tight" lines={["طراحی که دیده می‌شود،", "کدی که می‌ماند."]} />
  ),
  "scroll-fill-text": () => <ScrollFillDemo />,
  "glitch-text": () => (
    <div className="flex flex-col items-center gap-3">
      <GlitchText className="text-4xl font-black">خطای ۴۰۴</GlitchText>
      <GlitchText trigger="hover" className="text-sm text-muted-foreground">این یکی فقط با هاور</GlitchText>
    </div>
  ),
  "image-reveal": (k) => (
    <div key={k} className="grid w-full max-w-md grid-cols-2 gap-3">
      <ImageReveal src="/sites/restaurant-site/courtyard.webp" alt="حیاط رستوران" className="aspect-[4/5] rounded-xl" />
      <ImageReveal src="/sites/restaurant-site/fesenjan.webp" alt="فسنجان" from="bottom" delay={200} className="aspect-[4/5] rounded-xl">
        <span className="absolute bottom-2 start-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] text-white backdrop-blur">فسنجان</span>
      </ImageReveal>
    </div>
  ),
  "ken-burns": () => (
    <KenBurns
      className="h-48 w-full max-w-md rounded-xl"
      interval={3500}
      images={[0, 1, 2, 4].map((i) => ({ src: LODGE[i], alt: "اقامتگاه کویری" }))}
    >
      <div className="flex size-full flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 pb-7 text-white">
        <p className="text-lg font-black">یک شب در کویر</p>
        <p className="text-xs opacity-80">اقامتگاه بومی، مصر</p>
      </div>
    </KenBurns>
  ),
  "image-trail": () => (
    <ImageTrail className="h-48 w-full max-w-md rounded-xl border border-border bg-card" images={LODGE} size={72}>
      <div className="grid size-full place-items-center text-center">
        <div>
          <p className="text-2xl font-black">نمونه‌کارها</p>
          <p className="mt-1 text-xs text-muted-foreground">ماوس را این‌جا حرکت بدید</p>
        </div>
      </div>
    </ImageTrail>
  ),
  "image-lens": () => (
    <ImageLens src="/sites/restaurant-site/kebab.webp" alt="کباب" zoom={2.4} lens={110} className="aspect-square w-full max-w-[220px] rounded-xl" />
  ),
  "fill-button": () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <FillButton>شروع همکاری</FillButton>
      <FillButton className="border-transparent bg-muted" fillClassName="bg-brand" activeTextClassName="text-brand-foreground">نمونه‌کارها</FillButton>
    </div>
  ),
  "roll-button": () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <RollButton icon={<ArrowLeft />}>مشاهده‌ی پروژه‌ها</RollButton>
      <RollButton className="bg-transparent text-foreground shadow-none ring-1 ring-border">تماس با ما</RollButton>
    </div>
  ),
  "cursor-ring": () => (
    <CursorRing className="flex h-44 w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card">
      <p className="text-xs text-muted-foreground">ماوس را این‌جا بیاورید و روی دکمه‌ها ببرید</p>
      <div className="flex items-center gap-3">
        <Button size="sm">دکمه</Button>
        <a href="#" onClick={(e) => e.preventDefault()} className="text-sm underline underline-offset-4">لینک</a>
        <div data-cursor="ببینید" className="grid size-16 place-items-center rounded-lg bg-muted text-[11px] text-muted-foreground">با متن</div>
      </div>
    </CursorRing>
  ),
  "hero-intro": (k) => (
    <HeroIntro
      key={k}
      className="w-full rounded-xl border border-border bg-background py-10"
      eyebrow={<Badge variant="outline" className="rounded-full px-3">نسخه‌ی {fa(3)} منتشر شد</Badge>}
      title={["رابط کاربری فارسی،", "بدون دردسر راست‌چین"]}
      description="کامپوننت‌هایی که از روز اول برای فارسی ساخته شده‌اند."
      actions={
        <>
          <Button size="sm">شروع کنید</Button>
          <Button size="sm" variant="outline">مستندات</Button>
        </>
      }
    />
  ),
  "hero-parallax": () => <HeroParallaxDemo />,
};

export const replayable = new Set([
  "typewriter",
  "counter",
  "blur-text",
  "animated-list",
  "reveal",
  "text-reveal",
  "highlight-text",
  "swipe-to-confirm",
  "terminal",
  "scratch-card",
  "number-wheel",
  "radial-intro",
  "skeleton-reveal",
  "streaming-text",
  "line-rise",
  "image-reveal",
  "hero-intro",
]);
