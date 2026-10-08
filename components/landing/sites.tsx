import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { sites } from "@/lib/registry";
import { cn, fa } from "@/lib/utils";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";
import { fillGrid } from "@/lib/grid-fill";

/** Showcase of whole multi-page sites: a browser-framed shot, the page list and highlights. */
export function Sites({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={
        <span className="inline-flex items-center gap-1.5">
          <Crown className="size-3.5 text-brand" />
          {fa(sites.length)} سایت کامل
        </span>
      }
      title={standalone ? "سایت‌های کامل" : "یک سایت کامل، نه فقط یک صفحه"}
      desc="هر کدوم یک وب‌سایت چندصفحه‌ای آماده‌ست، با هدر و فوتر مشترک، منوی موبایل، فرم‌های واقعی و صفحه‌هایی که به هم لینک شدن. با یک دستور کل سایت را در پروژه‌تون بریزید و فقط متن‌ها را عوض کنید."
      href="/sites"
      standalone={standalone}
    />
  );

  const spans = fillGrid(sites.map(() => 1), { base: 1, lg: 2 });
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", !standalone && "p-3 sm:p-4")}>
      {sites.map((s, i) => (
        <li key={s.slug} className={spans[i]}>
          <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/60">
            <div className="relative bg-background p-3 pb-0 sm:p-4 sm:pb-0">
              <div className="overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-[0_24px_48px_-24px_rgb(0_0_0/0.5)]">
                <div className="flex h-7 items-center gap-1.5 border-b border-border px-3" dir="ltr">
                  <span className="size-2 rounded-full bg-foreground/15" />
                  <span className="size-2 rounded-full bg-foreground/15" />
                  <span className="size-2 rounded-full bg-foreground/15" />
                  <span className="mx-auto truncate rounded bg-secondary px-6 py-0.5 font-mono text-[10px] text-muted-foreground">{s.slug}.ir</span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={`/previews/sites/${s.slug}.webp`}
                    alt={`پیش‌نمایش ${s.name}`}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                  />
                </div>
              </div>
              <span className="absolute top-5 start-5 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground sm:top-6 sm:start-6">
                <Crown className="size-3" />
                ویژه
              </span>
            </div>
            <Link href={`/sites/${s.slug}`} className="flex flex-1 flex-col border-t border-border px-5 py-4 outline-none after:absolute after:inset-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{s.name}</h3>
                <span className="text-xs text-muted-foreground">{fa(s.pages.length)} صفحه</span>
              </div>
              <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{s.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {s.pages.map((p) => (
                  <span key={p.path} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-foreground/80">
                    {p.label}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );

  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="sites">
      {head}
      {grid}
      <SectionFoot href="/sites" label="همه‌ی سایت‌ها" note="هر سایت پیش‌نمایش زنده، کد همه‌ی صفحه‌ها و پرامپت داره." />
    </Section>
  );
}
