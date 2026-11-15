"use client";

import * as React from "react";
import { ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { NumberField } from "@/registry/ui/number-field";
import { Sheet } from "@/registry/ui/sheet";
import { fa, faNumber } from "@/lib/utils";

export interface CartItem {
  id: string;
  name: string;
  /** Unit price in toman. */
  price: number;
  /** Unit price before discount. */
  original?: number;
  quantity: number;
  /** Chosen options, e.g. «مشکی، ۲۵۶ گیگ». */
  variant?: string;
  /** Stock ceiling for the quantity field. */
  max?: number;
  image?: React.ReactNode;
}

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onCheckout?: () => void;
  /** Orders at or above this total ship free; a progress line shows how much is left. */
  freeShippingFrom?: number;
  /** Which edge it slides from. "end" is the left edge in RTL, where shop carts usually sit. */
  side?: "start" | "end";
}

/** Totals of a cart: what is paid, what it would have cost, and the saving. */
export function cartTotals(items: CartItem[]) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const full = items.reduce((s, i) => s + (i.original ?? i.price) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return { total, full, saving: full - total, count };
}

/** سبد کشویی. Line items with a quantity stepper, a free-shipping progress line and a sticky total. */
export function CartDrawer({ open, onOpenChange, items, onQuantityChange, onRemove, onCheckout, freeShippingFrom, side = "end" }: CartDrawerProps) {
  const { total, saving, count } = cartTotals(items);
  const left = freeShippingFrom ? Math.max(0, freeShippingFrom - total) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side={side} title={<span className="flex items-center gap-2">سبد خرید{count > 0 && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-normal text-muted-foreground">{fa(count)} کالا</span>}</span>}>
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary"><ShoppingBag className="size-6 text-muted-foreground" /></span>
          <p className="font-medium">سبد شما خالی است</p>
          <p className="text-sm leading-7 text-muted-foreground">هر کالایی که اضافه کنید همین‌جا می‌بینید.</p>
          <Button variant="outline" className="mt-2" onClick={() => onOpenChange(false)}>ادامه‌ی خرید</Button>
        </div>
      ) : (
        <>
          {freeShippingFrom !== undefined && (
            <div className="border-b border-border px-4 py-3">
              <p className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
                <Truck className="size-4 shrink-0" />
                {left > 0 ? <span><span className="font-medium text-foreground">{faNumber(left)} تومان</span> دیگر تا ارسال رایگان</span> : <span className="font-medium text-success">ارسال این سفارش رایگان است</span>}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${Math.min(100, (total / freeShippingFrom) * 100)}%` }} />
              </div>
            </div>
          )}
          <ul className="flex-1 divide-y divide-border overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 p-4">
                <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  {item.image ?? <div aria-hidden className="size-full" style={{ background: "radial-gradient(70% 70% at 50% 40%, oklch(from var(--foreground) l c h / 12%), transparent 70%)" }} />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="line-clamp-2 text-sm font-medium leading-6">{item.name}</p>
                  {item.variant && <p className="mt-0.5 text-xs text-muted-foreground">{item.variant}</p>}
                  {/* Price gets its own line: beside a 136px stepper a seven-digit total would clip in a narrow drawer. */}
                  <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
                    <span className="whitespace-nowrap text-sm font-bold tabular-nums">{faNumber(item.price * item.quantity)} <span className="text-xs font-normal text-muted-foreground">تومان</span></span>
                    {item.original && item.original > item.price && <span className="text-xs text-muted-foreground line-through tabular-nums"><span className="sr-only">قیمت قبلی </span>{faNumber(item.original * item.quantity)}</span>}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <NumberField value={item.quantity} min={1} max={item.max ?? 99} onChange={(q) => onQuantityChange?.(item.id, q)} aria-label={`تعداد ${item.name}`} className="h-8" />
                    <Button variant="ghost" size="icon" className="ms-auto size-8 text-muted-foreground hover:text-destructive" aria-label={`حذف ${item.name}`} onClick={() => onRemove?.(item.id)}><Trash2 /></Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-4">
            {saving > 0 && <p className="flex items-center justify-between text-sm text-success"><span>سود شما از این خرید</span><span className="tabular-nums">{faNumber(saving)} تومان</span></p>}
            <p className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">جمع سبد</span>
              <span className="text-lg font-bold tabular-nums">{faNumber(total)} <span className="text-xs font-normal text-muted-foreground">تومان</span></span>
            </p>
            <Button size="lg" className="mt-4 w-full" onClick={onCheckout}>ادامه‌ی فرایند خرید</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">هزینه‌ی ارسال در مرحله‌ی بعد حساب میشه.</p>
          </div>
        </>
      )}
    </Sheet>
  );
}
