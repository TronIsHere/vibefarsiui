"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { cn, faNumber, faPercent } from "@/lib/utils";

export interface PricingRow {
  id: string;
  /** e.g. «یک‌ماهه», «سه‌ماهه», «سالانه». */
  name: string;
  /** Number of months this plan covers; used for the per-month price and the saving. */
  months: number;
  /** Total price of the period in toman. */
  price: number;
  /** Short tag such as «محبوب». */
  tag?: string;
  description?: string;
}

export interface PricingRowsProps {
  title?: string;
  description?: string;
  rows: PricingRow[];
  defaultValue?: string;
  cta?: string;
  onSelect?: (row: PricingRow) => void;
}

/** قیمت ردیفی. Subscription periods as selectable rows; the saving is computed against the shortest period. */
export function PricingRows({ title = "اشتراک‌تون را انتخاب کنید", description, rows, defaultValue, cta = "ادامه و پرداخت", onSelect }: PricingRowsProps) {
  const [selected, setSelected] = React.useState(defaultValue ?? rows[0]?.id);
  const name = React.useId();
  const reference = rows.reduce((a, b) => (b.months < a.months ? b : a), rows[0]);
  const perMonthRef = reference.price / reference.months;
  const current = rows.find((r) => r.id === selected) ?? rows[0];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>}
        </div>
        <fieldset className="mt-8 space-y-3">
          <legend className="sr-only">دوره‌ی اشتراک</legend>
          {rows.map((r) => {
            const perMonth = r.price / r.months;
            const saving = Math.round((1 - perMonth / perMonthRef) * 100);
            const active = r.id === selected;
            return (
              <label key={r.id} className={cn("flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-4 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring", active ? "border-foreground/50 shadow-[0_0_0_1px_var(--foreground)_inset]" : "border-border hover:bg-accent")}>
                <input type="radio" name={name} value={r.id} checked={active} onChange={() => setSelected(r.id)} className="sr-only" />
                <span aria-hidden className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", active ? "border-foreground" : "border-input")}>
                  {active && <span className="size-2.5 rounded-full bg-foreground" />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    {r.name}
                    {r.tag && <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-brand-foreground">{r.tag}</span>}
                    {saving > 0 && <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">{faPercent(saving)} صرفه‌جویی</span>}
                  </span>
                  {r.description && <span className="mt-1 text-xs text-muted-foreground">{r.description}</span>}
                </span>
                <span className="flex flex-col items-end">
                  <span className="text-base font-bold tabular-nums">{faNumber(r.price)} <span className="text-xs font-normal text-muted-foreground">تومان</span></span>
                  {r.months > 1 && <span className="text-xs text-muted-foreground tabular-nums">ماهی {faNumber(Math.round(perMonth))}</span>}
                </span>
              </label>
            );
          })}
        </fieldset>
        <Button size="lg" className="mt-6 w-full" onClick={() => current && onSelect?.(current)}>{cta}</Button>
      </div>
    </section>
  );
}
