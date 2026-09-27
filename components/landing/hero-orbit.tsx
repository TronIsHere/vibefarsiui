"use client";

import * as React from "react";
import Link from "next/link";
import { Command } from "lucide-react";
import { AvatarGroup } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Kbd } from "@/registry/ui/kbd";
import { OtpField } from "@/registry/ui/otp-field";
import { Progress } from "@/registry/ui/progress";
import { Rating } from "@/registry/ui/rating";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Sparkline } from "@/registry/ui/chart";
import { Switch } from "@/registry/ui/switch";
import { ToastCard } from "@/registry/ui/toast";
import { LikeButton } from "@/registry/animations/like-button";
import { Marquee } from "@/registry/animations/marquee";
import { cn, fa, faNumber } from "@/lib/utils";

const PEOPLE = [
  { name: "مریم احمدی" },
  { name: "علی رضایی" },
  { name: "نگار کریمی" },
  { name: "رضا موسوی" },
  { name: "سارا نوری" },
];

function Card({ slug, href, className, children }: { slug: string; href?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card/90 p-3 shadow-[0_18px_50px_-24px_oklch(0_0_0/0.45)] backdrop-blur-sm", className)}>
      {children}
      <Link
        href={href ?? `/components/${slug}`}
        dir="ltr"
        className="mt-2 block w-fit font-mono text-[10px] text-muted-foreground/70 transition-colors hover:text-brand"
      >
        {slug}
      </Link>
    </div>
  );
}

function StatChip() {
  return (
    <Card slug="stat" className="w-[208px]">
      <p className="text-[11px] text-muted-foreground">فروش امروز</p>
      <p className="mt-1 text-lg font-bold">
        {faNumber(12_450_000)} <span className="text-xs font-normal text-muted-foreground">تومان</span>
      </p>
      <div className="mt-1 flex items-center justify-between">
        <Badge variant="success">+{fa(18)}٪</Badge>
        <Sparkline data={[4, 6, 5, 8, 7, 10, 9, 13]} className="h-7 w-24" />
      </div>
    </Card>
  );
}

function OtpChip() {
  return (
    <Card slug="otp-field" className="w-fit">
      <p className="mb-2 text-[11px] text-muted-foreground">کد تأیید پیامکی</p>
      <OtpField size="sm" length={4} defaultValue="48" aria-label="کد تأیید" />
    </Card>
  );
}

function ToastChip() {
  return (
    <Card slug="toast" className="w-[236px] p-2">
      <ToastCard
        className="animate-none shadow-none"
        toast={{ variant: "success", title: "پرداخت انجام شد", description: `${faNumber(2_890_000)} تومان، سفارش #${fa(14052)}` }}
      />
    </Card>
  );
}

function SwitchChip() {
  return (
    <Card slug="switch" className="w-[200px]">
      <div className="space-y-2.5">
        <label className="flex items-center justify-between gap-3 text-[13px]">
          اعلان‌های پیامکی
          <Switch defaultChecked aria-label="اعلان‌های پیامکی" />
        </label>
        <label className="flex items-center justify-between gap-3 text-[13px]">
          حالت تاریک
          <Switch aria-label="حالت تاریک" />
        </label>
      </div>
    </Card>
  );
}

function RatingChip() {
  return (
    <Card slug="rating" className="w-[196px]">
      <p className="text-[11px] text-muted-foreground">از خریدتون راضی بودید؟</p>
      <Rating className="mt-1.5" defaultValue={4} showValue />
    </Card>
  );
}

function PresenceChip() {
  return (
    <Card slug="avatar" className="w-[214px]">
      <div className="flex items-center justify-between gap-2">
        <AvatarGroup people={PEOPLE} max={4} size="sm" />
        <Badge variant="success">آنلاین</Badge>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{fa(12)} نفر دارن این صفحه را ویرایش می‌کنن</p>
    </Card>
  );
}

function LikeChip() {
  return (
    <Card slug="like-button" href="/animations/like-button" className="w-fit px-2.5 py-2">
      <LikeButton defaultLiked count={128} />
    </Card>
  );
}

function KbdChip() {
  return (
    <Card slug="kbd" className="w-fit py-2">
      <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Command className="size-3.5" />
        جست‌وجو
        <Kbd keys={["⌘", "K"]} />
      </span>
    </Card>
  );
}

function SegmentChip() {
  return (
    <Card slug="segmented-control" className="w-fit">
      <SegmentedControl
        size="sm"
        aria-label="بازه"
        defaultValue="week"
        options={[
          { value: "day", label: "امروز" },
          { value: "week", label: "این هفته" },
          { value: "month", label: "این ماه" },
        ]}
      />
    </Card>
  );
}

function ProgressChip() {
  return (
    <Card slug="progress" className="w-[180px]">
      <Progress size="sm" value={72} label="هدف ماه" showValue />
    </Card>
  );
}

type Orbiter = {
  pos: React.CSSProperties;
  /** Parallax travel in px at full pointer offset. */
  depth: number;
  tilt: number;
  drift: number;
  node: React.ReactNode;
};

/* Positions are physical (left/right) so the scatter reads the same in either direction. */
const ORBITERS: Orbiter[] = [
  { pos: { right: "3%", top: "9%" }, depth: 18, tilt: 2, drift: 9, node: <SwitchChip /> },
  { pos: { left: "3%", top: "8%" }, depth: 22, tilt: -2.5, drift: 11, node: <StatChip /> },
  { pos: { right: "27%", top: "6%" }, depth: 34, tilt: -4, drift: 7, node: <LikeChip /> },
  { pos: { left: "1.5%", top: "39%" }, depth: 14, tilt: 1.5, drift: 10, node: <OtpChip /> },
  { pos: { right: "1.5%", top: "41%" }, depth: 16, tilt: 3, drift: 12, node: <RatingChip /> },
  { pos: { left: "26%", top: "5%" }, depth: 30, tilt: 5, drift: 8, node: <KbdChip /> },
  { pos: { left: "4%", top: "69%" }, depth: 24, tilt: -1.5, drift: 13, node: <ToastChip /> },
  { pos: { right: "4%", top: "71%" }, depth: 20, tilt: -2, drift: 10, node: <PresenceChip /> },
  { pos: { left: "30%", bottom: "5%" }, depth: 12, tilt: 1, drift: 11, node: <ProgressChip /> },
  { pos: { right: "26%", bottom: "4%" }, depth: 26, tilt: -1, drift: 9, node: <SegmentChip /> },
];

/** Start offset for the fly-out: each card begins near the headline and travels to its slot. */
function launch(pos: React.CSSProperties) {
  const fromLeft = pos.left !== undefined;
  const x = parseFloat(String(fromLeft ? pos.left : pos.right));
  const y = pos.top !== undefined ? parseFloat(String(pos.top)) : 100 - parseFloat(String(pos.bottom)) - 8;
  const dx = (50 - x) * 7 * (fromLeft ? 1 : -1);
  const dy = (46 - y) * 5;
  return { "--fx": `${dx}px`, "--fy": `${dy}px` } as React.CSSProperties;
}

/**
 * Real registry components scattered around the hero copy. They fly out on
 * load, drift on their own and lean with the pointer — every one stays usable.
 */
export function HeroOrbit({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const my = ((e.clientY - r.top) / r.height) * 2 - 1;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
    });
  }

  function onPointerLeave() {
    cancelAnimationFrame(frame.current);
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  }

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className="relative isolate">
      <Rings />
      <div className="relative z-10">{children}</div>

      <div aria-label="چند کامپوننت زنده" className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        {ORBITERS.map((o, i) => (
          <div
            key={i}
            className="pointer-events-auto absolute transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10"
            style={{
              ...o.pos,
              transform: `translate3d(calc(var(--mx, 0) * ${-o.depth}px), calc(var(--my, 0) * ${-o.depth}px), 0)`,
            }}
          >
            <div style={{ "--tilt": `${o.tilt}deg`, animation: `hero-drift ${o.drift}s ease-in-out ${-i * 1.3}s infinite` } as React.CSSProperties}>
              <div
                className="transition-transform duration-300 hover:scale-[1.04]"
                style={{ ...launch(o.pos), animation: `hero-fly 1.2s cubic-bezier(0.16,1,0.3,1) ${260 + i * 80}ms both` }}
              >
                {o.node}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Below lg the same cards ride a slow marquee under the copy instead of orbiting it. */
export function HeroMobileStrip() {
  return (
    <Marquee duration={36} className="py-3 lg:hidden">
      <StatChip />
      <RatingChip />
      <ToastChip />
      <PresenceChip />
      <ProgressChip />
    </Marquee>
  );
}

function Rings() {
  const rings = [
    { size: 520, dur: 70, dot: "top-0 left-1/2" },
    { size: 820, dur: 110, dot: "top-[85.4%] left-[14.6%]", reverse: true },
    { size: 1120, dur: 150, dot: "top-[14.6%] left-[85.4%]" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]">
      {rings.map((r) => (
        <div
          key={r.size}
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-foreground/12"
          style={{
            width: r.size,
            height: r.size,
            marginLeft: -r.size / 2,
            marginTop: -r.size / 2,
            animation: `spin-slow ${r.dur}s linear infinite${r.reverse ? " reverse" : ""}`,
          }}
        >
          <span className={cn("absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_14px_2px_var(--brand)]", r.dot)} />
        </div>
      ))}
    </div>
  );
}
