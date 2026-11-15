"use client";

import * as React from "react";
import { BadgeCheck, Minus, Plus, Star, ThumbsUp } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Button } from "@/registry/ui/button";
import { Rating } from "@/registry/ui/rating";
import { cn, fa, faPercent } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: Date;
  title?: string;
  body: string;
  /** «خریدار این محصول». */
  verified?: boolean;
  /** نقاط قوت. */
  pros?: string[];
  /** نقاط ضعف. */
  cons?: string[];
  /** How many people found it useful. */
  helpful?: number;
  /** The shop's answer. */
  reply?: string;
}

export interface ReviewsProps {
  title?: string;
  reviews: Review[];
  onWrite?: () => void;
  onHelpful?: (id: string) => void;
}

type Sort = "new" | "helpful" | "high" | "low";
const SORTS: { key: Sort; label: string }[] = [
  { key: "new", label: "جدیدترین" },
  { key: "helpful", label: "مفیدترین" },
  { key: "high", label: "بیشترین امتیاز" },
  { key: "low", label: "کمترین امتیاز" },
];

/** Average and the share of each star, five first. */
export function reviewStats(reviews: Review[]) {
  const n = reviews.length || 1;
  const average = reviews.reduce((s, r) => s + r.rating, 0) / n;
  const shares = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => Math.round(r.rating) === star).length }));
  return { average, shares, total: reviews.length };
}

/** دیدگاه‌ها. Average with a star breakdown you can filter by, sortable reviews with pros and cons, and a helpful vote. */
export function Reviews({ title = "دیدگاه خریداران", reviews, onWrite, onHelpful }: ReviewsProps) {
  const [sort, setSort] = React.useState<Sort>("new");
  const [star, setStar] = React.useState<number | null>(null);
  const [voted, setVoted] = React.useState<Set<string>>(new Set());
  const { average, shares, total } = reviewStats(reviews);

  const list = React.useMemo(() => {
    const filtered = star === null ? reviews : reviews.filter((r) => Math.round(r.rating) === star);
    return [...filtered].sort((a, b) =>
      sort === "new" ? b.date.getTime() - a.date.getTime() : sort === "helpful" ? (b.helpful ?? 0) - (a.helpful ?? 0) : sort === "high" ? b.rating - a.rating : a.rating - b.rating,
    );
  }, [reviews, sort, star]);

  function vote(id: string) {
    if (voted.has(id)) return;
    setVoted((v) => new Set(v).add(id));
    onHelpful?.(id);
  }

  return (
    <section id="reviews" className="px-6 py-12">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-5xl font-bold tabular-nums">{fa(average.toFixed(1)).replace(".", "٫")}</span>
            <div className="pb-1.5">
              <Rating value={average} readOnly size="sm" />
              <p className="mt-1 text-xs text-muted-foreground">از {fa(total)} دیدگاه</p>
            </div>
          </div>
          <ul className="mt-5 space-y-1.5">
            {shares.map(({ star: s, count }) => {
              const share = total ? (count / total) * 100 : 0;
              const on = star === s;
              return (
                <li key={s}>
                  <button type="button" aria-pressed={on} onClick={() => setStar(on ? null : s)} className={cn("flex w-full cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", on && "bg-secondary")} aria-label={`${fa(s)} ستاره، ${fa(count)} دیدگاه`}>
                    <span className="flex w-7 items-center gap-0.5 tabular-nums">{fa(s)}<Star className="size-3 fill-current" /></span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><span className="block h-full rounded-full bg-foreground/70" style={{ width: `${share}%` }} /></span>
                    <span className="w-9 text-end text-muted-foreground tabular-nums">{faPercent(share)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Button variant="outline" className="mt-6 w-full" onClick={onWrite}>ثبت دیدگاه</Button>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-1 border-b border-border pb-3 text-sm">
            <span className="pe-2 text-muted-foreground">مرتب‌سازی</span>
            {SORTS.map((s) => (
              <button key={s.key} type="button" aria-pressed={sort === s.key} onClick={() => setSort(s.key)} className={cn("cursor-pointer rounded-full px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", sort === s.key ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {s.label}
              </button>
            ))}
          </div>
          {list.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">دیدگاهی با این امتیاز ثبت نشده.</p>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((r) => {
                const mine = voted.has(r.id);
                return (
                  <li key={r.id} className="py-6">
                    <article>
                      <header className="flex items-center gap-3">
                        <Avatar name={r.author} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                            {r.author}
                            {r.verified && <span className="flex items-center gap-1 text-xs font-normal text-success"><BadgeCheck className="size-3.5" />خریدار</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatJalali(r.date, { year: true })}</p>
                        </div>
                        <Rating value={r.rating} readOnly size="sm" />
                      </header>
                      {r.title && <h3 className="mt-4 text-sm font-semibold">{r.title}</h3>}
                      <p className="mt-2 text-sm leading-7 text-foreground/90">{r.body}</p>
                      {(r.pros || r.cons) && (
                        <ul className="mt-3 space-y-1.5 text-sm">
                          {r.pros?.map((p) => <li key={p} className="flex items-center gap-2"><Plus className="size-3.5 shrink-0 text-success" /><span className="sr-only">نقطه‌ی قوت: </span>{p}</li>)}
                          {r.cons?.map((c) => <li key={c} className="flex items-center gap-2"><Minus className="size-3.5 shrink-0 text-destructive" /><span className="sr-only">نقطه‌ی ضعف: </span>{c}</li>)}
                        </ul>
                      )}
                      {r.reply && (
                        <div className="mt-4 rounded-xl border-s-2 border-brand bg-secondary/50 p-3.5">
                          <p className="text-xs font-semibold">پاسخ فروشگاه</p>
                          <p className="mt-1 text-sm leading-7 text-muted-foreground">{r.reply}</p>
                        </div>
                      )}
                      <button type="button" aria-pressed={mine} onClick={() => vote(r.id)} className={cn("mt-4 flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", mine ? "border-foreground/40 bg-secondary text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>
                        <ThumbsUp className="size-3.5" />
                        مفید بود
                        <span className="tabular-nums">{fa((r.helpful ?? 0) + (mine ? 1 : 0))}</span>
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
