"use client";

import Link from "next/link";
import { cn, fa as faN } from "@/lib/utils";
import { templates } from "@/lib/registry";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";
import { CatalogShot, CENTERED_TEMPLATE_PEEKS } from "./catalog-shot";
import { fillGrid } from "@/lib/grid-fill";

const PEEK_H = "h-64";

export function Templates({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{faN(templates.length)} قالب</>}
      title={standalone ? "قالب‌ها" : "صفحه‌های کامل، از همین کامپوننت‌ها"}
      desc="قالب‌ها با همین کامپوننت‌ها و توکن‌ها ساخته شدن، پس اگر تم را عوض کنید همه‌ی صفحه‌ها با هم عوض میشن. هر قالب را می‌تونید تمام‌صفحه باز کنید و کدش را بردارید."
      href="/templates"
      standalone={standalone}
    />
  );
  const spans = fillGrid(templates.map(() => 1), standalone ? { base: 1, sm: 2, xl: 3 } : { base: 1, sm: 2, xl: 4 });
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "xl:grid-cols-3" : "p-3 sm:p-4 xl:grid-cols-4")}>
      {templates.map((t, i) => {
        const centered = CENTERED_TEMPLATE_PEEKS.has(t.slug);
        return (
          <li key={t.slug} className={spans[i]}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/60">
              <div className={cn("relative overflow-hidden bg-background", PEEK_H)}>
                <CatalogShot
                  kind="templates"
                  slug={t.slug}
                  name={t.name}
                  peek
                  sizes={
                    standalone
                      ? "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  }
                />
                {!centered && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent" />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
              </div>
              <Link href={`/templates/${t.slug}`} aria-label={`باز کردن قالب ${t.name}`} className={cn("absolute inset-x-0 top-0 outline-none", PEEK_H)} />
              <Link href={`/templates/${t.slug}`} className="block border-t border-border px-4 py-3 outline-none">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{t.slug}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.desc}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="templates">
      {head}
      {grid}
      <SectionFoot href="/templates" label="همه‌ی قالب‌ها" note="هر صفحه پیش‌نمایش زنده و کد کامل داره." />
    </Section>
  );
}
