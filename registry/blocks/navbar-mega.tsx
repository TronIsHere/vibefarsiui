"use client";

import * as React from "react";
import { ChevronDown, Menu, type LucideIcon } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn } from "@/lib/utils";

export interface MegaLink { label: string; href: string; description?: string; icon?: LucideIcon }

export interface MegaItem {
  label: string;
  /** A plain link when there are no groups. */
  href?: string;
  /** Columns of the panel. */
  groups?: { title: string; links: MegaLink[] }[];
  /** A highlighted card at the end of the panel. */
  feature?: { title: string; description: string; href: string; cta?: string };
}

export interface NavbarMegaProps {
  logo: React.ReactNode;
  homeHref?: string;
  items: MegaItem[];
  primary?: { label: string; href?: string };
  secondary?: { label: string; href?: string };
  sticky?: boolean;
  className?: string;
}

/** نوار با مگامنو. Top-level buttons open a full-width panel of grouped links; Escape and outside clicks close it. */
export function NavbarMega({ logo, homeHref = "/", items, primary = { label: "شروع رایگان" }, secondary = { label: "ورود" }, sticky = true, className }: NavbarMegaProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [mobile, setMobile] = React.useState(false);
  const root = React.useRef<HTMLElement>(null);
  const base = React.useId();

  React.useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      document.getElementById(`${base}-btn-${openIndex}`)?.focus();
      setOpenIndex(null);
    };
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpenIndex(null); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [openIndex, base]);

  const open = openIndex === null ? null : items[openIndex];

  return (
    <>
      <header ref={root} className={cn("relative z-40 border-b border-border bg-background", sticky && "sticky top-0", className)}>
        <nav aria-label="اصلی" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
          <a href={homeHref} className="flex items-center gap-2 text-base font-bold">{logo}</a>
          <ul className="hidden items-center gap-1 md:flex">
            {items.map((item, i) => (
              <li key={item.label}>
                {item.groups ? (
                  <button
                    id={`${base}-btn-${i}`}
                    type="button"
                    aria-expanded={openIndex === i}
                    aria-controls={`${base}-panel`}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className={cn("flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", openIndex === i ? "bg-accent text-foreground" : "text-muted-foreground")}
                  >
                    {item.label}
                    <ChevronDown className={cn("size-3.5 transition-transform", openIndex === i && "rotate-180")} />
                  </button>
                ) : (
                  <a href={item.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{item.label}</a>
                )}
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">{secondary.label}</Button>
            <Button size="sm">{primary.label}</Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="باز کردن منو" onClick={() => setMobile(true)}><Menu /></Button>
        </nav>

        {open?.groups && (
          <div id={`${base}-panel`} className="absolute inset-x-0 top-full hidden border-b border-border bg-background shadow-[0_30px_60px_-30px_oklch(0_0_0/50%)] md:block">
            <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
              <div className="grid flex-1 gap-8" style={{ gridTemplateColumns: `repeat(${open.groups.length}, minmax(0, 1fr))` }}>
                {open.groups.map((g) => (
                  <div key={g.title}>
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground">{g.title}</h3>
                    <ul className="mt-2 space-y-0.5">
                      {g.links.map((l) => (
                        <li key={l.label}>
                          <a href={l.href} onClick={() => setOpenIndex(null)} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent">
                            {l.icon && <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card"><l.icon className="size-4" /></span>}
                            <span className="flex flex-col">
                              <span className="text-sm font-medium">{l.label}</span>
                              {l.description && <span className="mt-0.5 text-xs leading-6 text-muted-foreground">{l.description}</span>}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {open.feature && (
                <a href={open.feature.href} onClick={() => setOpenIndex(null)} className="flex w-64 shrink-0 flex-col justify-end rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent" style={{ backgroundImage: "radial-gradient(120% 80% at 100% 0%, oklch(from var(--brand) l c h / 18%), transparent 60%)" }}>
                  <span className="text-sm font-semibold">{open.feature.title}</span>
                  <span className="mt-1 text-xs leading-6 text-muted-foreground">{open.feature.description}</span>
                  <span className="mt-3 text-xs font-medium text-brand">{open.feature.cta ?? "بیشتر بخوانید"} ←</span>
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      <Sheet open={mobile} onOpenChange={setMobile} title={logo}>
        <div className="flex flex-col gap-4 overflow-y-auto p-2">
          {items.map((item) =>
            item.groups ? (
              <details key={item.label} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent [&::-webkit-details-marker]:hidden">
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-1 border-s border-border ps-2 ms-3">
                  {item.groups.flatMap((g) => g.links).map((l) => (
                    <li key={l.label}><a href={l.href} onClick={() => setMobile(false)} className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{l.label}</a></li>
                  ))}
                </ul>
              </details>
            ) : (
              <a key={item.label} href={item.href} onClick={() => setMobile(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent">{item.label}</a>
            ),
          )}
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          <Button>{primary.label}</Button>
          <Button variant="outline">{secondary.label}</Button>
        </div>
      </Sheet>
    </>
  );
}
