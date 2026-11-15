"use client";

import * as React from "react";
import { Bike, Mailbox, Package, Store, Truck, type LucideIcon } from "lucide-react";
import { cn, faNumber } from "@/lib/utils";

export type ShippingKind = "post" | "express" | "courier" | "freight" | "pickup";

const KIND_ICON: Record<ShippingKind, LucideIcon> = { post: Mailbox, express: Package, courier: Bike, freight: Truck, pickup: Store };

export interface ShippingMethod {
  id: string;
  /** e.g. «پست پیشتاز», «تیپاکس», «پیک موتوری». */
  name: string;
  /** Picks the icon. */
  kind?: ShippingKind;
  /** Delivery estimate, e.g. «۲ تا ۴ روز کاری». */
  eta: string;
  /** Fee in toman. 0 reads «رایگان». Leave undefined for «پس‌کرایه». */
  price?: number;
  /** Orders at or above this total ship free with this method. */
  freeFrom?: number;
  description?: string;
  disabled?: boolean;
  /** Why it is unavailable, e.g. «فقط در تهران». */
  disabledReason?: string;
}

export interface ShippingMethodsProps {
  methods: ShippingMethod[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string, fee: number) => void;
  /** Cart total in toman, used to apply `freeFrom`. */
  orderTotal?: number;
  name?: string;
  className?: string;
}

/** Fee of a method for a given cart total; undefined means paid on delivery. */
export function shippingFee(method: ShippingMethod, orderTotal = 0): number | undefined {
  if (method.price === undefined) return undefined;
  return method.freeFrom !== undefined && orderTotal >= method.freeFrom ? 0 : method.price;
}

/** روش ارسال. Radio cards for post, Tipax, courier and pickup with the delivery estimate and the fee. */
export function ShippingMethods({ methods, value, defaultValue, onChange, orderTotal = 0, name, className }: ShippingMethodsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const selected = value ?? internal;
  const autoName = React.useId();

  function select(m: ShippingMethod) {
    if (value === undefined) setInternal(m.id);
    onChange?.(m.id, shippingFee(m, orderTotal) ?? 0);
  }

  return (
    <fieldset className={cn("min-w-0 space-y-2", className)}>
      <legend className="sr-only">روش ارسال</legend>
      {methods.map((m) => {
        const on = selected === m.id;
        const fee = shippingFee(m, orderTotal);
        const Icon = KIND_ICON[m.kind ?? "post"];
        const becameFree = fee === 0 && m.price !== undefined && m.price > 0;
        return (
          <label key={m.id} className={cn("flex items-center gap-3 rounded-control border-line p-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring", m.disabled ? "cursor-not-allowed border-border opacity-55" : "cursor-pointer", on ? "border-foreground/50 bg-accent/60" : !m.disabled && "border-border hover:bg-accent/40")}>
            <input type="radio" name={name ?? autoName} value={m.id} checked={on} disabled={m.disabled} onChange={() => select(m)} className="sr-only" />
            <span aria-hidden className={cn("flex size-4 shrink-0 items-center justify-center rounded-full border", on ? "border-primary" : "border-input")}>{on && <span className="size-2 rounded-full bg-primary" />}</span>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><Icon className="size-5" /></span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium">{m.name}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{m.disabled && m.disabledReason ? m.disabledReason : m.eta}</span>
              {m.description && !m.disabled && <span className="mt-0.5 text-xs text-muted-foreground">{m.description}</span>}
            </span>
            <span className="flex shrink-0 flex-col items-end text-sm">
              {fee === undefined ? (
                <span className="text-muted-foreground">پس‌کرایه</span>
              ) : fee === 0 ? (
                <span className="font-semibold text-success">رایگان</span>
              ) : (
                <span className="font-semibold tabular-nums">{faNumber(fee)} <span className="text-xs font-normal text-muted-foreground">تومان</span></span>
              )}
              {becameFree && <span className="text-xs text-muted-foreground line-through tabular-nums">{faNumber(m.price!)}</span>}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
