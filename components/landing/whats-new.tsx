"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { BankCard } from "@/registry/ui/card-to-card";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { aiCardDemos } from "@/components/demos/components-ai";
import { extraChartCardDemos } from "@/components/demos/charts-extra";
import { extraCalendarCardDemos } from "@/components/demos/calendar-extra";
import { RELEASE, whatsNew, whatsNewTotal, type NewGroup } from "@/lib/registry/whats-new";
import { fa } from "@/lib/utils";
import { CatalogShot } from "./catalog-shot";
import { Section } from "./frame";

const group = (kind: NewGroup["kind"]) => whatsNew.find((g) => g.kind === kind)!;

/** A valid (Luhn) demo card number for a bank BIN, so the card face shows the right bank. */
function demoCard(bin: string) {
  const body = bin + "791234567";
  for (let c = 0; c < 10; c++) {
    const d = body + c;
    let sum = 0;
    for (let i = 0; i < 16; i++) {
      let n = Number(d[i]);
      if (i % 2 === 0) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    if (sum % 10 === 0) return d;
  }
  return body + "0";
}

function CardStack() {
  return (
    <div className="relative h-40 w-56">
      {["610433", "603799", "621986"].map((bin, i) => (
        <div
          key={bin}
          className="absolute inset-x-0 top-0"
          style={{ transform: `translate(${(i - 1) * -18}px, ${i * 14}px) rotate(${(i - 1) * -6}deg)`, zIndex: i }}
        >
          <BankCard number={demoCard(bin)} holder="سارا محمدی" masked />
        </div>
      ))}
    </div>
  );
}

const noop = () => () => {};

/** The chat demo stamps times relative to now, so it renders on the client only to avoid a hydration mismatch. */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const mounted = React.useSyncExternalStore(noop, () => true, () => false);
  return mounted ? children : <div className="h-64 w-full animate-pulse rounded-lg bg-muted/60" />;
}

const HIGHLIGHTS: { slug: string; href: string; name: string; note: string; demo: React.ReactNode }[] = [
  { slug: "card-to-card", href: "/components/card-to-card", name: "کارت به کارت", note: "روی کارت رنگ و طرح همون بانک می‌آد", demo: <CardStack /> },
  { slug: "chat-message", href: "/components/chat-message", name: "پیام چت", note: "با مارک‌داون، ابزار و جواب در حال تایپ", demo: <ClientOnly>{aiCardDemos["chat-message"]}</ClientOnly> },
  { slug: "iran-map-chart", href: "/charts/iran-map-chart", name: "نقشه‌ی استان‌ها", note: "۳۱ استان، رنگ‌شده با داده‌ی خودتون", demo: extraChartCardDemos["iran-map-chart"] },
  { slug: "prayer-times", href: "/calendar/prayer-times", name: "اوقات شرعی", note: "محاسبه‌ی محلی، بدون هیچ API", demo: extraCalendarCardDemos["prayer-times"] },
];

function Highlight({ h, delay }: { h: (typeof HIGHLIGHTS)[number]; delay: number }) {
  return (
    <Reveal delay={delay} className="min-w-0">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25">
        <div className="flex h-72 min-w-0 items-center justify-center overflow-hidden p-4">{h.demo}</div>
        <Link href={h.href} className="block border-t border-border px-4 py-3 outline-none">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold transition-colors group-hover:text-brand">{h.name}</h3>
            <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{h.slug}</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{h.note}</p>
        </Link>
      </div>
    </Reveal>
  );
}

function Shot({ kind, slug, name, href }: { kind: "blocks" | "templates"; slug: string; name: string; href: string }) {
  return (
    <Link
      href={href}
      className="group block w-56 shrink-0 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/30"
    >
      <div className="relative h-32 overflow-hidden bg-background">
        <CatalogShot kind={kind} slug={slug} name={name} cover sizes="224px" />
      </div>
      <p className="truncate border-t border-border px-3 py-2 text-xs transition-colors group-hover:text-brand">{name}</p>
    </Link>
  );
}

function PillGroup({ g }: { g: NewGroup }) {
  return (
    <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:gap-6 sm:px-8">
      <Link href={g.href} className="w-32 shrink-0 text-sm font-semibold transition-colors hover:text-brand">
        {fa(g.items.length)} {g.label} تازه
      </Link>
      <ul className="flex flex-wrap gap-1.5">
        {g.items.map((it) => (
          <li key={it.slug}>
            <Link
              href={it.href}
              title={it.desc}
              className="block rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {it.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Release notes as a section: counts per kind, a few live headliners, then every new item by name. */
export function WhatsNew() {
  const blocks = group("blocks");
  const templates = group("templates");
  const backgrounds = group("backgrounds");
  const half = Math.ceil(blocks.items.length / 2);

  return (
    <Section id="new" className="overflow-hidden">
      <div className="px-5 pb-8 pt-14 text-center sm:px-8 sm:pt-16">
        <Badge variant="brand" className="mx-auto">
          {`تازه‌های ${RELEASE.version}`}
        </Badge>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-snug sm:text-4xl">
          {RELEASE.label} با {fa(whatsNewTotal)} آیتم تازه اومده
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
          از کارت به کارت و کامپوننت‌های چت هوش مصنوعی تا نقشه‌ی استان‌های ایران، اوقات شرعی و{" "}
          {fa(backgrounds.items.length)} پس‌زمینه‌ی WebGL برای هیرو. همه مثل قبل کد، پرامپت و راهنمای
          راست‌چین خودشون را دارن و با CLI و MCP هم در دسترس هستن.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-px border-y border-border bg-border sm:grid-cols-4 lg:grid-cols-8">
        <li className="flex flex-col items-center justify-center gap-0.5 bg-muted px-3 py-4">
          <span className="text-xl font-bold text-brand">+{fa(whatsNewTotal)}</span>
          <span className="text-xs text-muted-foreground">همه‌ی تازه‌ها</span>
        </li>
        {whatsNew.map((g) => (
          <li key={g.kind}>
            <Link
              href={g.href}
              className="flex h-full flex-col items-center justify-center gap-0.5 bg-background px-3 py-4 transition-colors hover:bg-accent"
            >
              <span className="text-xl font-bold">+{fa(g.items.length)}</span>
              <span className="text-xs text-muted-foreground">{g.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4 lg:gap-4">
        {HIGHLIGHTS.map((h, i) => (
          <Highlight key={h.slug} h={h} delay={i * 70} />
        ))}
      </div>

      <div className="space-y-3 border-t border-border py-6">
        <p className="px-5 text-xs text-muted-foreground sm:px-8">
          {fa(blocks.items.length)} بلاک و {fa(templates.items.length)} قالب تازه
        </p>
        <Marquee duration={90} gap="0.75rem">
          {blocks.items.slice(0, half).map((b) => (
            <Shot key={b.slug} kind="blocks" slug={b.slug} name={b.name} href={b.href} />
          ))}
        </Marquee>
        <Marquee duration={100} gap="0.75rem" className="[&>div]:[animation-direction:reverse]">
          {templates.items.map((t) => (
            <Shot key={t.slug} kind="templates" slug={t.slug} name={t.name} href={t.href} />
          ))}
          {blocks.items.slice(half).map((b) => (
            <Shot key={b.slug} kind="blocks" slug={b.slug} name={b.name} href={b.href} />
          ))}
        </Marquee>
      </div>

      <div className="divide-y divide-border border-t border-border">
        {whatsNew
          .filter((g) => g.kind !== "blocks" && g.kind !== "templates")
          .map((g) => (
            <PillGroup key={g.kind} g={g} />
          ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row sm:px-8">
        <p className="text-xs text-muted-foreground">روی اسم هر کدام بزنید تا پیش‌نمایش، کد و پرامپتش را ببینید.</p>
        <Link href="/components" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand">
          همه‌ی کامپوننت‌ها
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
