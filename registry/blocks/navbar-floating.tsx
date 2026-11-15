"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { cn } from "@/lib/utils";

export interface NavbarFloatingProps {
  logo: React.ReactNode;
  homeHref?: string;
  links: { label: string; href: string; active?: boolean }[];
  action?: { label: string; href?: string };
  /** Fixed to the top of the viewport. Turn off inside a preview frame. */
  fixed?: boolean;
  className?: string;
}

/** نوار شناور. A rounded pill detached from the edges; on mobile the links unfold under it. */
export function NavbarFloating({ logo, homeHref = "/", links, action = { label: "شروع" }, fixed = true, className }: NavbarFloatingProps) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={cn("inset-x-0 top-0 z-40 px-4 pt-4", fixed ? "fixed" : "relative", className)}>
      <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-border bg-card/80 shadow-[0_10px_40px_-20px_oklch(0_0_0/60%)] backdrop-blur">
        <nav aria-label="اصلی" className="flex h-14 items-center justify-between gap-4 ps-5 pe-2">
          <a href={homeHref} className="flex items-center gap-2 text-sm font-bold">{logo}</a>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} aria-current={l.active ? "page" : undefined} className={cn("rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-accent", l.active ? "bg-secondary text-foreground" : "text-muted-foreground")}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1">
            <Button size="sm" className="rounded-full px-4">{action.label}</Button>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label={open ? "بستن منو" : "باز کردن منو"} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)}>
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
        <div id={menuId} className={cn("grid transition-[grid-template-rows] duration-300 ease-out md:hidden", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <ul className="min-h-0 overflow-hidden px-2" inert={!open}>
            {links.map((l) => (
              <li key={l.label} className="last:pb-2">
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-accent">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
