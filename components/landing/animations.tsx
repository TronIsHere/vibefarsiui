"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { animations } from "@/lib/registry";
import { animationDemos, replayable } from "@/components/demos/animations";
import { Section } from "./frame";
import { ItemCard, SectionFoot, SectionHead } from "./section-head";
import { fillGrid } from "@/lib/grid-fill";

function AnimationCard({ slug, name, desc }: { slug: string; name: string; desc: string }) {
  const [k, setK] = useState(0);
  return (
    <ItemCard href={`/animations/${slug}`} name={name} slug={slug} desc={desc}>
      {replayable.has(slug) && (
        <button
          type="button"
          onClick={() => setK((x) => x + 1)}
          aria-label="پخش دوباره"
          className="absolute start-2 top-2 z-10 flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent hover:text-foreground focus-visible:opacity-100"
        >
          <RotateCcw className="size-3.5" />
        </button>
      )}
      <div className="flex w-full items-center justify-center">{animationDemos[slug]?.(k)}</div>
    </ItemCard>
  );
}

export function Animations({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{fa(animations.length)} انیمیشن</>}
      title={standalone ? "انیمیشن‌ها" : "انیمیشن‌هایی که از راست شروع میشن"}
      desc="همه با CSS و React ساخته شدن و به هیچ کتابخانه‌ی اضافه‌ای نیاز ندارن. جهتشون با فارسی هماهنگه و اگر کاربر «کاهش حرکت» را فعال کرده باشه، خودشون خاموش میشن."
      href="/animations"
      standalone={standalone}
    />
  );
  const spans = fillGrid(animations.map((a) => (a.wide ? 2 : 1)), standalone ? { base: 1, sm: 2, xl: 3 } : { base: 1, sm: 2, xl: 4 });
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "xl:grid-cols-3" : "p-3 sm:p-4 xl:grid-cols-4")}>
      {animations.map((a, i) => (
        <li key={a.slug} className={spans[i]}><AnimationCard {...a} /></li>
      ))}
    </ul>
  );
  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="animations">
      {head}
      {grid}
      <SectionFoot href="/animations" label="همه‌ی انیمیشن‌ها" note="هر کدام یک فایل کوچک با چند خط keyframe هست." />
    </Section>
  );
}
