import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Marquee } from "@/registry/animations/marquee";
import { animations, backgrounds, blocks, components, templates, themes } from "@/lib/registry";
import { Section } from "./frame";
import { HeroStats } from "./hero-stats";

const facts = [
  { v: components.length, l: "کامپوننت" },
  { v: blocks.length, l: "بلاک" },
  { v: animations.length, l: "انیمیشن" },
  { v: backgrounds.length, l: "پس‌زمینه" },
  { v: templates.length, l: "قالب" },
  { v: themes.length, l: "سیستم طراحی" },
];

function Pill({ href, name }: { href: string; name: string }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      {name}
    </Link>
  );
}

/** Every component name streams past, then one last push to start. */
export function Closing() {
  const half = Math.ceil(components.length / 2);
  return (
    <Section className="overflow-hidden">
      <div className="space-y-3 border-b border-border py-8">
        <Marquee duration={70} gap="0.5rem">
          {components.slice(0, half).map((c) => (
            <Pill key={c.slug} href={`/components/${c.slug}`} name={c.name} />
          ))}
        </Marquee>
        <Marquee duration={80} gap="0.5rem" className="[&>div]:[animation-direction:reverse]">
          {components.slice(half).map((c) => (
            <Pill key={c.slug} href={`/components/${c.slug}`} name={c.name} />
          ))}
          {animations.slice(0, 12).map((a) => (
            <Pill key={a.slug} href={`/animations/${a.slug}`} name={a.name} />
          ))}
        </Marquee>
      </div>

      <div className="relative isolate flex flex-col items-center px-5 py-16 text-center sm:py-20">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
        <h2 className="max-w-2xl text-3xl font-bold leading-snug sm:text-[2.6rem]">
          فایل را کپی کنید، یا پرامپتش را بدید به هوش مصنوعی
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
          همه‌چیز رایگان و متن‌بازه. با MCP هم می‌تونید کل کتابخانه را مستقیم به Cursor یا Claude
          وصل کنید.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link
            href="/docs"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            شروع کنید
            <ArrowLeft className="size-4" />
          </Link>
          <Link
            href="/docs#mcp"
            className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-accent"
          >
            راه‌اندازی MCP
          </Link>
        </div>
        <div className="mt-10">
          <HeroStats items={facts} />
        </div>
      </div>
    </Section>
  );
}
