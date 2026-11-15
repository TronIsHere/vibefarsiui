"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Slider } from "@/registry/ui/slider";
import { faNumber } from "@/lib/utils";

export interface UsageTier {
  /** The tier applies up to and including this many units. */
  upTo: number;
  /** Price of one unit in this tier, in toman. */
  unitPrice: number;
}

export interface PricingUsageProps {
  title?: string;
  description?: string;
  /** What is being counted, e.g. «پیامک» or «سفارش». */
  unit: string;
  min?: number;
  max: number;
  step?: number;
  defaultValue?: number;
  /** Ascending by `upTo`. The whole volume is billed at the tier it lands in. */
  tiers: UsageTier[];
  /** Fixed monthly fee added to the usage cost. */
  base?: number;
  features?: string[];
  cta?: string;
  onSelect?: (volume: number, total: number) => void;
}

/** Tier a volume falls into: the first one whose ceiling covers it. */
export function tierFor(tiers: UsageTier[], volume: number) {
  return tiers.find((t) => volume <= t.upTo) ?? tiers[tiers.length - 1];
}

/** قیمت مصرفی. A slider sets the monthly volume; the unit price drops by tier and the total updates live. */
export function PricingUsage({ title = "به اندازه‌ی مصرف‌تون پرداخت کنید", description, unit, min = 0, max, step = 1, defaultValue, tiers, base = 0, features, cta = "شروع", onSelect }: PricingUsageProps) {
  const [volume, setVolume] = React.useState(defaultValue ?? Math.round(max / 4 / step) * step);
  const tier = tierFor(tiers, volume);
  const total = base + volume * tier.unitPrice;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>}
        </div>
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <Slider
            value={volume}
            onChange={setVolume}
            min={min}
            max={max}
            step={step}
            label={`تعداد ${unit} در ماه`}
            format={(v) => `${faNumber(v)} ${unit}`}
          />
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tiers.map((t) => {
              const active = t === tier;
              return (
                <li key={t.upTo} aria-current={active ? "true" : undefined} className={active ? "rounded-xl border border-foreground/40 bg-secondary p-3" : "rounded-xl border border-border p-3 text-muted-foreground"}>
                  <p className="text-xs">تا {faNumber(t.upTo)}</p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">{faNumber(t.unitPrice)} <span className="text-xs font-normal">تومان</span></p>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div aria-live="polite">
              <p className="text-sm text-muted-foreground">هزینه‌ی ماهانه</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums">{faNumber(total)}</span>
                <span className="text-sm text-muted-foreground">تومان</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {base > 0 && `${faNumber(base)} تومان اشتراک پایه به‌اضافه‌ی `}
                {faNumber(volume)} {unit} با نرخ {faNumber(tier.unitPrice)} تومان
              </p>
            </div>
            <Button size="lg" onClick={() => onSelect?.(volume, total)}>{cta}</Button>
          </div>
        </div>
        {features && (
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="size-4 text-brand" />{f}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
