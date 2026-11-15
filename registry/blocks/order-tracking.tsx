"use client";

import * as React from "react";
import { Check, Copy, MapPin, PackageCheck } from "lucide-react";
import { cn, fa, faNumber } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

export interface TrackingStep {
  title: string;
  /** When this step happened. Leave empty for steps that are still ahead. */
  at?: Date;
  /** Extra line, e.g. «مرکز پردازش تهران». */
  note?: string;
}

export interface OrderTrackingProps {
  /** Order number, shown left-to-right. */
  orderId: string;
  steps: TrackingStep[];
  /** Index of the step the order is in right now. */
  current: number;
  /** Shipping company and its tracking code. */
  carrier?: { name: string; code: string; href?: string };
  /** Expected delivery day. */
  eta?: Date;
  recipient?: { name: string; address: string };
  items?: { name: string; quantity: number }[];
  total?: number;
}

const time = (d: Date) => fa(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);

/** پیگیری سفارش. Steps with Jalali date and time, a copyable postal tracking code and the delivery address. */
export function OrderTracking({ orderId, steps, current, carrier, eta, recipient, items, total }: OrderTrackingProps) {
  const [copied, setCopied] = React.useState(false);
  const done = current >= steps.length - 1;

  async function copy() {
    if (!carrier) return;
    try {
      await navigator.clipboard.writeText(carrier.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; the code is still selectable */
    }
  }

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card">
        <header className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">سفارش <bdi dir="ltr" className="font-mono font-medium text-foreground">{orderId}</bdi></p>
            <h1 className="mt-1 flex items-center gap-2 text-xl font-bold">
              {done && <PackageCheck className="size-5 text-success" />}
              {steps[current]?.title}
            </h1>
          </div>
          {eta && !done && (
            <div className="rounded-2xl bg-secondary px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">تحویل تا </span>
              <span className="font-semibold">{formatJalali(eta, { weekday: true })}</span>
            </div>
          )}
        </header>

        <ol className="flex flex-col gap-0 p-6 md:flex-row">
          {steps.map((s, i) => {
            const state = i < current || (done && i === current) ? "done" : i === current ? "current" : "todo";
            return (
              <li key={s.title} aria-current={state === "current" ? "step" : undefined} className="relative flex flex-1 gap-3 pb-6 last:pb-0 md:flex-col md:items-center md:gap-0 md:pb-0 md:text-center">
                {i < steps.length - 1 && (
                  <span aria-hidden className={cn("absolute start-[15px] top-8 h-[calc(100%-2rem)] w-0.5 md:start-auto md:end-1/2 md:top-[15px] md:h-0.5 md:w-full md:translate-x-0", i < current ? "bg-brand" : "bg-border")} />
                )}
                <span className={cn("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold", state === "done" && "border-brand bg-brand text-brand-foreground", state === "current" && "border-brand bg-card text-brand", state === "todo" && "border-border bg-card text-muted-foreground")}>
                  {state === "done" ? <Check className="size-4" /> : fa(i + 1)}
                  {state === "current" && <span aria-hidden className="absolute inset-0 rounded-full border-2 border-brand motion-safe:animate-ping" />}
                </span>
                <div className="md:mt-3 md:px-2">
                  <p className={cn("text-sm font-medium", state === "todo" && "text-muted-foreground")}>{s.title}</p>
                  {s.at && <p className="mt-1 text-xs text-muted-foreground">{formatJalali(s.at)}، ساعت {time(s.at)}</p>}
                  {s.note && <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
          {carrier && (
            <div className="bg-card p-6">
              <h2 className="text-xs font-semibold text-muted-foreground">کد رهگیری {carrier.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" onClick={copy} dir="ltr" className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-1.5 font-mono text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`کپی کد رهگیری ${carrier.code}`}>
                  {carrier.code}
                  {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5 text-muted-foreground" />}
                </button>
                <span role="status" className="text-xs text-success">{copied ? "کپی شد" : ""}</span>
              </div>
              {carrier.href && <a href={carrier.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">پیگیری در سایت {carrier.name}</a>}
            </div>
          )}
          {recipient && (
            <div className="bg-card p-6">
              <h2 className="text-xs font-semibold text-muted-foreground">تحویل‌گیرنده</h2>
              <p className="mt-2 text-sm font-medium">{recipient.name}</p>
              <p className="mt-1 flex items-start gap-1.5 text-sm leading-7 text-muted-foreground"><MapPin className="mt-1.5 size-3.5 shrink-0" />{recipient.address}</p>
            </div>
          )}
        </div>

        {items && (
          <div className="border-t border-border p-6">
            <h2 className="text-xs font-semibold text-muted-foreground">اقلام سفارش</h2>
            <ul className="mt-3 divide-y divide-border text-sm">
              {items.map((it) => (
                <li key={it.name} className="flex items-center justify-between gap-4 py-2.5">
                  <span>{it.name}</span>
                  <span className="shrink-0 text-muted-foreground">{fa(it.quantity)} عدد</span>
                </li>
              ))}
            </ul>
            {total !== undefined && <p className="mt-3 flex items-center justify-between border-t border-border pt-4 text-sm"><span className="text-muted-foreground">مبلغ پرداخت‌شده</span><span className="font-bold tabular-nums">{faNumber(total)} تومان</span></p>}
          </div>
        )}
      </div>
    </section>
  );
}
