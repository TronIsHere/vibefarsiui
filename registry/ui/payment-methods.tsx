"use client";

import * as React from "react";
import { ArrowLeftRight, Banknote, CalendarClock, CreditCard, Wallet, type LucideIcon } from "lucide-react";
import { cn, faNumber } from "@/lib/utils";

export type PaymentKind = "gateway" | "wallet" | "card-to-card" | "installment" | "cod";

const KIND: Record<PaymentKind, { icon: LucideIcon; hint: string }> = {
  gateway: { icon: CreditCard, hint: "پرداخت با همه‌ی کارت‌های عضو شتاب" },
  wallet: { icon: Wallet, hint: "پرداخت از موجودی کیف پول" },
  "card-to-card": { icon: ArrowLeftRight, hint: "واریز و ثبت رسید" },
  installment: { icon: CalendarClock, hint: "خرید قسطی" },
  cod: { icon: Banknote, hint: "پرداخت هنگام تحویل" },
};

export interface PaymentMethod {
  id: string;
  kind: PaymentKind;
  /** e.g. «درگاه زرین‌پال», «به‌پرداخت ملت», «کیف پول». */
  name: string;
  description?: string;
  /** Your own copy of the provider's logo. A neutral icon is drawn without it. */
  logo?: React.ReactNode;
  /** Wallet balance in toman. Shown on the card and compared with `amount`. */
  balance?: number;
  /** Short tag such as «پیشنهادی». */
  badge?: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface PaymentMethodsProps {
  methods: PaymentMethod[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Payable amount in toman. A wallet with less than this is disabled with the shortfall shown. */
  amount?: number;
  /** "grid" puts two cards per row from sm up. */
  layout?: "list" | "grid";
  name?: string;
  className?: string;
}

/** روش پرداخت. Radio cards for bank gateways, wallet, card-to-card, instalments and pay on delivery. */
export function PaymentMethods({ methods, value, defaultValue, onChange, amount, layout = "list", name, className }: PaymentMethodsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const selected = value ?? internal;
  const autoName = React.useId();

  function select(id: string) {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  }

  return (
    <fieldset className={cn("min-w-0", layout === "grid" ? "grid grid-cols-1 gap-2 sm:grid-cols-2" : "space-y-2", className)}>
      <legend className="sr-only">روش پرداخت</legend>
      {methods.map((m) => {
        const k = KIND[m.kind];
        const short = m.kind === "wallet" && m.balance !== undefined && amount !== undefined && m.balance < amount ? amount - m.balance : 0;
        const disabled = m.disabled || short > 0;
        const on = selected === m.id && !disabled;
        const line = m.disabled && m.disabledReason ? m.disabledReason : short > 0 ? `${faNumber(short)} تومان کم دارید` : m.description ?? k.hint;
        return (
          <label key={m.id} className={cn("flex items-center gap-3 rounded-control border-line p-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring", disabled ? "cursor-not-allowed border-border opacity-55" : "cursor-pointer", on ? "border-foreground/50 bg-accent/60" : !disabled && "border-border hover:bg-accent/40")}>
            <input type="radio" name={name ?? autoName} value={m.id} checked={on} disabled={disabled} onChange={() => select(m.id)} className="sr-only" />
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary [&_img]:size-full [&_img]:object-contain">{m.logo ?? <k.icon className="size-5" />}</span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {m.name}
                {m.badge && <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-brand">{m.badge}</span>}
              </span>
              <span className={cn("mt-0.5 text-xs", short > 0 ? "text-destructive" : "text-muted-foreground")}>{line}</span>
            </span>
            {m.kind === "wallet" && m.balance !== undefined && (
              <span className="shrink-0 text-end text-xs text-muted-foreground">
                موجودی
                <span className="block text-sm font-semibold tabular-nums text-foreground">{faNumber(m.balance)}</span>
              </span>
            )}
            <span aria-hidden className={cn("flex size-4 shrink-0 items-center justify-center rounded-full border", on ? "border-primary" : "border-input")}>{on && <span className="size-2 rounded-full bg-primary" />}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
