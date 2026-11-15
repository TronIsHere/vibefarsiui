"use client";

import * as React from "react";
import { Slider } from "@/registry/ui/slider";
import { cn, fa, faNumber, faPercent } from "@/lib/utils";

export interface InstallmentPlan {
  /** Amount financed after the down payment. */
  principal: number;
  downPayment: number;
  /** One instalment, rounded up to the nearest 1,000 toman. */
  monthly: number;
  /** Everything paid: down payment plus all instalments. */
  total: number;
  /** Total minus the cash price. */
  interest: number;
  months: number;
}

/**
 * Equal instalments on a reducing balance (the formula Iranian banks publish):
 * monthly = P·r·(1+r)^n / ((1+r)^n − 1), with r the yearly rate divided by 1200.
 * A zero rate simply divides the principal.
 */
export function calculateInstallments(price: number, downPayment: number, months: number, yearlyRate: number): InstallmentPlan {
  const principal = Math.max(0, price - downPayment);
  const r = yearlyRate / 1200;
  const raw = months <= 0 ? 0 : r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const monthly = Math.ceil(raw / 1000) * 1000;
  const total = downPayment + monthly * months;
  return { principal, downPayment, monthly, total, interest: Math.max(0, total - price), months };
}

export interface InstallmentCalculatorProps {
  /** Cash price in toman. */
  price: number;
  /** Offered terms in months. */
  terms?: number[];
  defaultTerm?: number;
  /** Yearly rate in percent. Pass a function to charge longer terms more. */
  rate?: number | ((months: number) => number);
  /** Down payment bounds as a share of the price, 0 to 1. */
  minDownPayment?: number;
  maxDownPayment?: number;
  defaultDownPayment?: number;
  onChange?: (plan: InstallmentPlan) => void;
  /** Slot under the result, e.g. a «ثبت درخواست» button. */
  footer?: React.ReactNode;
  className?: string;
}

/** محاسبه‌گر اقساط. Down payment and term on top, the monthly instalment and the cost of credit underneath. */
export function InstallmentCalculator({ price, terms = [6, 12, 18, 24], defaultTerm, rate = 23, minDownPayment = 0.2, maxDownPayment = 0.8, defaultDownPayment = 0.3, onChange, footer, className }: InstallmentCalculatorProps) {
  const [share, setShare] = React.useState(Math.round(defaultDownPayment * 100));
  const [months, setMonths] = React.useState(defaultTerm ?? terms[Math.min(1, terms.length - 1)]);
  const name = React.useId();

  const yearly = typeof rate === "function" ? rate(months) : rate;
  const downPayment = Math.round((price * share) / 100 / 1000) * 1000;
  const plan = calculateInstallments(price, downPayment, months, yearly);

  function update(nextShare: number, nextMonths: number) {
    setShare(nextShare);
    setMonths(nextMonths);
    const y = typeof rate === "function" ? rate(nextMonths) : rate;
    onChange?.(calculateInstallments(price, Math.round((price * nextShare) / 100 / 1000) * 1000, nextMonths, y));
  }

  return (
    <div className={cn("w-full rounded-surface border-line border-border bg-card p-5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">قیمت نقدی</span>
        <span className="text-sm font-semibold tabular-nums">{faNumber(price)} تومان</span>
      </div>

      <Slider
        className="mt-5"
        label="پیش‌پرداخت"
        value={share}
        onChange={(v) => update(v, months)}
        min={Math.round(minDownPayment * 100)}
        max={Math.round(maxDownPayment * 100)}
        step={5}
        format={(v) => `${faNumber(Math.round((price * v) / 100 / 1000) * 1000)} تومان (${faPercent(v)})`}
      />

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">مدت بازپرداخت</legend>
        <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(terms.length, 4)}, minmax(0, 1fr))` }}>
          {terms.map((t) => (
            <label key={t} className={cn("flex h-10 cursor-pointer items-center justify-center rounded-control border-line text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring", t === months ? "border-foreground/50 bg-secondary font-semibold" : "border-border text-muted-foreground hover:bg-accent")}>
              <input type="radio" name={name} value={t} checked={t === months} onChange={() => update(share, t)} className="sr-only" />
              {fa(t)} ماهه
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-5 rounded-xl bg-secondary/60 p-4">
        <p className="text-xs text-muted-foreground">مبلغ هر قسط</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">{faNumber(plan.monthly)}</span>
          <span className="text-sm text-muted-foreground">تومان در ماه</span>
        </p>
        <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">مبلغ تسهیلات</dt><dd className="tabular-nums">{faNumber(plan.principal)} تومان</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">نرخ سود سالانه</dt><dd className="tabular-nums">{faPercent(yearly)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">سود کل دوره</dt><dd className="tabular-nums">{faNumber(plan.interest)} تومان</dd></div>
          <div className="flex justify-between gap-3 font-semibold"><dt>جمع پرداختی</dt><dd className="tabular-nums">{faNumber(plan.total)} تومان</dd></div>
        </dl>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
