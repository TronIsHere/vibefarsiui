"use client";

import * as React from "react";
import { Check, Droplets, Flame, Landmark, Phone, Receipt, Smartphone, TrafficCone, Zap, type LucideIcon } from "lucide-react";
import { cn, fa, faNumber } from "@/lib/utils";
import { billAmountRial, billType, isBillId, isPaymentId, normalizeBillId } from "@/lib/persian";

export type BillValue = { billId: string; paymentId: string };

export interface BillInputProps {
  value?: BillValue;
  defaultValue?: BillValue;
  /** `valid` is true only when both ids pass their check digits together. `amount` is in toman. */
  onChange?: (value: BillValue, info: { valid: boolean; type: string | null; amount: number }) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const ICONS: Record<string, LucideIcon> = {
  "آب": Droplets,
  "برق": Zap,
  "گاز": Flame,
  "تلفن ثابت": Phone,
  "تلفن همراه": Smartphone,
  "عوارض شهرداری": Landmark,
  "مالیات": Landmark,
  "جریمه‌ی رانندگی": TrafficCone,
};

/** Icon for a bill kind, with a receipt for unknown kinds. */
function BillIcon({ type, className }: { type: string | null; className?: string }) {
  return React.createElement((type && ICONS[type]) || Receipt, { className });
}

const field = "h-10 w-full rounded-field border-line-field bg-field shadow-field px-3 font-mono text-sm tracking-wide outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50";

/**
 * شناسه‌ی قبض و پرداخت. Both ids are checked with the bill check-digit algorithm; the
 * bill kind (آب، برق، گاز، …) and the amount are read out of the numbers themselves,
 * so the user sees what they are about to pay before any request is made.
 */
export function BillInput({ value, defaultValue, onChange, disabled, className, id }: BillInputProps) {
  const [internal, setInternal] = React.useState<BillValue>(defaultValue ?? { billId: "", paymentId: "" });
  const v = value ?? internal;
  const autoId = React.useId();
  const base = id ?? autoId;

  const billOk = isBillId(v.billId);
  const type = billOk ? billType(v.billId) : null;
  const payOk = billOk && isPaymentId(v.billId, v.paymentId);
  const amount = payOk ? billAmountRial(v.paymentId) / 10 : 0;
  const billError = v.billId.length >= 6 && !billOk;
  const payError = billOk && v.paymentId.length >= 6 && !payOk;

  function set(patch: Partial<BillValue>) {
    const next = { ...v, ...patch };
    if (value === undefined) setInternal(next);
    const ok = isBillId(next.billId) && isPaymentId(next.billId, next.paymentId);
    onChange?.(next, { valid: ok, type: isBillId(next.billId) ? billType(next.billId) : null, amount: ok ? billAmountRial(next.paymentId) / 10 : 0 });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <label htmlFor={`${base}-bill`} className="text-sm font-medium">شناسه‌ی قبض</label>
        <div className="relative mt-1.5" dir="ltr">
          <input
            id={`${base}-bill`}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            value={v.billId}
            onChange={(e) => set({ billId: normalizeBillId(e.target.value) })}
            placeholder="0000000000000"
            aria-invalid={billError || undefined}
            aria-describedby={`${base}-bill-hint`}
            className={cn(field, "pe-9", billError ? "border-destructive/60" : "border-input")}
          />
          {billOk && <Check className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-success" />}
        </div>
        <p id={`${base}-bill-hint`} className={cn("mt-1.5 flex items-center gap-1.5 text-[11px]", billError ? "text-destructive" : "text-muted-foreground")}>
          {billError ? "شناسه‌ی قبض درست نیست." : type ? (<><BillIcon type={type} className="size-3" />قبض {type}</>) : "تا ۱۳ رقم، روی قبض چاپ شده"}
        </p>
      </div>
      <div>
        <label htmlFor={`${base}-pay`} className="text-sm font-medium">شناسه‌ی پرداخت</label>
        <div className="relative mt-1.5" dir="ltr">
          <input
            id={`${base}-pay`}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            value={v.paymentId}
            onChange={(e) => set({ paymentId: normalizeBillId(e.target.value) })}
            placeholder="0000000000000"
            aria-invalid={payError || undefined}
            aria-describedby={`${base}-pay-hint`}
            className={cn(field, "pe-9", payError ? "border-destructive/60" : "border-input")}
          />
          {payOk && <Check className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-success" />}
        </div>
        <p id={`${base}-pay-hint`} className={cn("mt-1.5 text-[11px]", payError ? "text-destructive" : "text-muted-foreground")}>
          {payError ? "شناسه‌ی پرداخت با این قبض جور نیست." : "با هر دوره‌ی قبض عوض میشه"}
        </p>
      </div>
      <div aria-live="polite">
        {payOk && (
          <div className="flex items-center gap-3 rounded-surface border-line border-border bg-card p-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary"><BillIcon type={type} className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">قبض {type ?? "خدمات"}</p>
              <p className="text-xs text-muted-foreground">شناسه‌ی {fa(v.billId)}</p>
            </div>
            <p className="text-end">
              <span className="text-base font-bold tabular-nums">{faNumber(amount)}</span>{" "}
              <span className="text-xs text-muted-foreground">تومان</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
