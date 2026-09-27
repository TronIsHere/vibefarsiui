import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WordRotate } from "@/registry/animations/word-rotate";
import { GridBackground } from "@/registry/backgrounds/grid";
import { Section } from "./frame";
import { HeroMobileStrip, HeroOrbit } from "./hero-orbit";

export function Hero() {
  return (
    <Section className="overflow-hidden">
      <GridBackground
        size={44}
        className="opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <HeroOrbit>
        <div className="mx-auto flex max-w-[30rem] flex-col items-center px-5 pb-10 pt-16 text-center sm:max-w-2xl sm:pt-20 lg:min-h-[780px] lg:max-w-[30rem] lg:justify-center lg:py-0 xl:max-w-[34rem]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11.5px] text-muted-foreground">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
              v1 · رایگان و متن‌باز
            </span>
          </div>

          <h1
            className="mt-6 text-[2.05rem] font-bold min-[400px]:text-[2.4rem] leading-[1.2] sm:text-[3.2rem] sm:leading-[1.15] animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            کامپوننت‌های <span className="text-brand">فارسی</span>،
            <br />
            برای{" "}
            <WordRotate
              words={["توسعه‌دهنده‌ها", "وایب‌کدرها", "طراح‌ها", "هوش مصنوعی"]}
              interval={2600}
              className="text-start text-foreground"
            />
          </h1>

          <p
            className="mt-5 text-base text-muted-foreground sm:text-[17px] animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            کارت‌هایی که این اطراف می‌بینید عکس نیستن، خود کامپوننت هستن.
            باهاشون کار کنید، بعد کدشون را کپی کنید یا پرامپتش را بدید به Cursor،
            Claude یا Codex.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href="/components"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              کامپوننت‌ها را ببینید
              <ArrowLeft className="size-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-accent"
            >
              در دو دقیقه شروع کنید
            </Link>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground animate-fade-up"
            style={{ animationDelay: "220ms" }}
          >
            {["Next.js و Vite", "Tailwind v4", "کد + پرامپت + MCP"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-foreground/40" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </HeroOrbit>
      <div className="relative pb-6 lg:hidden">
        <HeroMobileStrip />
      </div>
    </Section>
  );
}
