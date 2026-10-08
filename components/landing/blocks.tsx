import Link from "next/link";
import { cn, fa } from "@/lib/utils";
import { blocks } from "@/lib/registry";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";
import { CatalogShot } from "./catalog-shot";
import { fillGrid } from "@/lib/grid-fill";

export function Blocks({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{fa(blocks.length)} بلاک</>}
      title={standalone ? "بلاک‌ها" : "بلاک‌ها، بخش‌های آماده‌ی صفحه"}
      desc={standalone
        ? "از نوار بالا و هیرو تا جدول قیمت، شبکه‌ی محصول، مقالات، تماس با ما و پابرگ، هر کدام یک بخش کامل از صفحه هستن. چندتا را پشت هم بگذارید و صفحه‌تون آماده‌ست."
        : "از نوار بالا و هیرو تا جدول قیمت، شبکه‌ی محصول، مقالات، تماس با ما و پابرگ، هر کدام یک بخش کامل از صفحه هستن. چندتا را پشت هم بگذارید و صفحه‌تون آماده‌ست."}
      href="/blocks"
      standalone={standalone}
    />
  );
  const spans = fillGrid(blocks.map(() => 1), { base: 1, sm: 2 });
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "" : "p-3 sm:p-4")}>
      {blocks.map((b, i) => (
        <li key={b.slug} className={spans[i]}>
          <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/60">
            <div className="relative h-56 overflow-hidden bg-background">
              <CatalogShot
                kind="blocks"
                slug={b.slug}
                name={b.name}
                cover
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
              <Link href={`/blocks/${b.slug}`} aria-label={`باز کردن بلاک ${b.name}`} className="absolute inset-0" />
            </div>
            <Link href={`/blocks/${b.slug}`} className="block border-t border-border px-4 py-3 outline-none">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{b.name}</h3>
                <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{b.slug}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{b.desc}</p>
              <div className="mt-2 flex flex-wrap gap-1">{b.tags.map((t) => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>)}</div>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="blocks">
      {head}
      {grid}
      <SectionFoot href="/blocks" label="همه‌ی بلاک‌ها" note="هر بلاک کد و پرامپت خودش را داره." />
    </Section>
  );
}
