"use client";

import * as React from "react";
import { Check, RotateCcw, ShieldCheck, ShoppingCart, Store, Truck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { NumberField } from "@/registry/ui/number-field";
import { Price } from "@/registry/ui/price";
import { Rating } from "@/registry/ui/rating";
import { cn, fa } from "@/lib/utils";

export interface ProductOption {
  /** e.g. «رنگ» or «حافظه». */
  name: string;
  values: { id: string; label: string; /** CSS color for a swatch. */ color?: string; disabled?: boolean }[];
}

export interface ProductDetailProps {
  title: string;
  /** Latin model name under the title, shown left-to-right. */
  subtitle?: string;
  /** Gallery slides: images or any node. Placeholders are drawn when empty. */
  images?: React.ReactNode[];
  price: number;
  original?: number;
  rating?: { value: number; count: number };
  options?: ProductOption[];
  /** Key specs as label/value pairs. */
  specs?: { label: string; value: string }[];
  seller?: string;
  warranty?: string;
  shipping?: string;
  returns?: string;
  /** Units left; a low number shows a warning and caps the quantity. */
  stock?: number;
  onAddToCart?: (selection: Record<string, string>, quantity: number) => void;
}

/** جزئیات محصول. Gallery, options, key specs and a seller box with warranty, shipping and the add-to-cart row. */
export function ProductDetail({ title, subtitle, images = [], price, original, rating, options = [], specs, seller, warranty, shipping, returns, stock, onAddToCart }: ProductDetailProps) {
  const slides = images.length ? images : [null, null, null, null];
  const [active, setActive] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selection, setSelection] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((o) => [o.name, o.values.find((v) => !v.disabled)?.id ?? ""])),
  );
  const soldOut = stock === 0;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
            {slides[active] ?? <div aria-hidden className="size-full" style={{ background: "radial-gradient(60% 60% at 50% 45%, oklch(from var(--foreground) l c h / 14%), transparent 70%)" }} />}
          </div>
          <ul className="mt-3 flex gap-2">
            {slides.map((s, i) => (
              <li key={i}>
                <button type="button" aria-label={`عکس ${fa(i + 1)}`} aria-current={i === active ? "true" : undefined} onClick={() => setActive(i)} className={cn("size-16 cursor-pointer overflow-hidden rounded-xl border bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", i === active ? "border-foreground" : "border-border opacity-70 hover:opacity-100")}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h1 className="text-xl font-bold leading-9">{title}</h1>
          {subtitle && <p dir="ltr" className="mt-1 text-end text-xs text-muted-foreground">{subtitle}</p>}
          {rating && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Rating value={rating.value} readOnly size="sm" />
              <span className="font-medium text-foreground">{fa(rating.value)}</span>
              <a href="#reviews" className="hover:text-foreground">({fa(rating.count)} دیدگاه)</a>
            </div>
          )}

          {options.map((o) => (
            <fieldset key={o.name} className="mt-6">
              <legend className="text-sm font-medium">{o.name}: <span className="font-normal text-muted-foreground">{o.values.find((v) => v.id === selection[o.name])?.label}</span></legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {o.values.map((v) => {
                  const on = selection[o.name] === v.id;
                  return (
                    <label key={v.id} className={cn("flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring", v.disabled ? "cursor-not-allowed border-dashed border-border text-muted-foreground/50 line-through" : "cursor-pointer", on ? "border-foreground bg-secondary" : !v.disabled && "border-border hover:bg-accent")}>
                      <input type="radio" name={`option-${o.name}`} value={v.id} checked={on} disabled={v.disabled} onChange={() => setSelection((s) => ({ ...s, [o.name]: v.id }))} className="sr-only" />
                      {v.color && <span aria-hidden className="size-4 rounded-full border border-border" style={{ background: v.color }} />}
                      {v.label}
                      {on && <Check className="size-3.5" />}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {specs && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold">ویژگی‌های اصلی</h2>
              <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/60 p-3">
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="mt-1 text-sm font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20">
            <ul className="space-y-3 border-b border-border pb-4 text-sm">
              {seller && <li className="flex items-center gap-2.5"><Store className="size-4 shrink-0 text-muted-foreground" /><span>فروشنده: <span className="font-medium">{seller}</span></span></li>}
              {warranty && <li className="flex items-center gap-2.5"><ShieldCheck className="size-4 shrink-0 text-muted-foreground" />{warranty}</li>}
              {shipping && <li className="flex items-center gap-2.5"><Truck className="size-4 shrink-0 text-muted-foreground" />{shipping}</li>}
              {returns && <li className="flex items-center gap-2.5"><RotateCcw className="size-4 shrink-0 text-muted-foreground" />{returns}</li>}
            </ul>
            <div className="flex justify-end pt-4"><Price amount={price} original={original} className="items-end" /></div>
            {stock !== undefined && stock > 0 && stock <= 5 && <p className="mt-2 text-end text-xs font-medium text-destructive">تنها {fa(stock)} عدد در انبار باقی مانده</p>}
            {soldOut ? (
              <Button className="mt-4 w-full" variant="outline" disabled>ناموجود</Button>
            ) : (
              <div className="mt-4 flex items-center gap-2">
                <NumberField value={quantity} onChange={setQuantity} min={1} max={stock ?? 99} aria-label="تعداد" />
                <Button className="flex-1" onClick={() => onAddToCart?.(selection, quantity)}><ShoppingCart />افزودن به سبد</Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
