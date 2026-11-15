"use client";

import * as React from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavLink = { title: string; href: string; description?: string; icon?: LucideIcon };

export type NavMenuEntry = {
  label: string;
  /** A plain link at the top level. */
  href?: string;
  /** Links in the dropdown panel. */
  links?: NavLink[];
  /** A highlighted card on the start side of the panel. */
  featured?: { title: string; description: string; href: string; cta?: string };
  /** Columns for the links. Default 2. */
  columns?: 1 | 2 | 3;
};

export interface NavigationMenuProps {
  items: NavMenuEntry[];
  /** ms before a hovered trigger opens and before leaving closes. Default 120 / 220. */
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

function LinkIcon({ icon }: { icon: LucideIcon }) {
  return React.createElement(icon, { className: "size-4", "aria-hidden": true });
}

/**
 * منوی ناوبری سایت. Header links where some entries open a wide panel of links with
 * descriptions and a featured card. Hover with a short delay so the panel doesn't flicker,
 * or click; moving between triggers while open slides the panel over. It's a disclosure
 * nav (not role=menu): Tab moves through links, Escape closes and returns focus.
 */
export function NavigationMenu({ items, openDelay = 120, closeDelay = 220, className }: NavigationMenuProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  const [hoverOpened, setHoverOpened] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const triggers = React.useRef<(HTMLButtonElement | null)[]>([]);
  const root = React.useRef<HTMLElement>(null);
  const [x, setX] = React.useState<{ start: number } | null>(null);
  const id = React.useId();

  const schedule = (fn: () => void, ms: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(fn, ms); };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  React.useEffect(() => {
    if (open === null) return;
    const t = triggers.current[open];
    const r = root.current;
    if (t && r) {
      const rr = r.getBoundingClientRect(), tr = t.getBoundingClientRect();
      // Inline-start offset of the trigger inside the bar (from the right in RTL).
      const rtl = getComputedStyle(r).direction === "rtl";
      setX({ start: rtl ? rr.right - tr.right : tr.left - rr.left });
    }
    const close = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const entry = open !== null ? items[open] : null;

  return (
    <nav
      ref={root}
      aria-label="اصلی"
      className={cn("relative", className)}
      onPointerLeave={() => hoverOpened && schedule(() => setOpen(null), closeDelay)}
      onPointerEnter={() => window.clearTimeout(timer.current)}
      onKeyDown={(e) => { if (e.key === "Escape" && open !== null) { triggers.current[open]?.focus(); setOpen(null); } }}
    >
      <ul className="flex items-center gap-1">
        {items.map((it, i) => (
          <li key={it.label}>
            {it.links ? (
              <button
                ref={(el) => { triggers.current[i] = el; }}
                type="button"
                aria-expanded={open === i}
                aria-controls={`${id}-panel`}
                onClick={() => { setHoverOpened(false); setOpen(open === i ? null : i); }}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  if (open !== null) { window.clearTimeout(timer.current); setOpen(i); }
                  else schedule(() => { setHoverOpened(true); setOpen(i); }, openDelay);
                }}
                className={cn("flex h-9 items-center gap-1 rounded-control px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60", open === i ? "bg-accent" : "hover:bg-accent/60")}
              >
                {it.label}
                <ChevronDown aria-hidden className={cn("size-3.5 text-muted-foreground transition-transform duration-(--motion) ease-motion", open === i && "rotate-180")} />
              </button>
            ) : (
              <a href={it.href} className="flex h-9 items-center rounded-control px-3 text-sm font-medium outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring/60">{it.label}</a>
            )}
          </li>
        ))}
      </ul>

      <div
        id={`${id}-panel`}
        hidden={!entry}
        className="absolute top-full z-40 pt-2 transition-[inset-inline-start] duration-200 ease-motion"
        style={{ insetInlineStart: Math.max(0, (x?.start ?? 0) - 8) }}
      >
        {entry && (
          <div className="flex gap-2 rounded-overlay border border-border bg-popover p-2 text-popover-foreground shadow-overlay">
            {entry.featured && (
              <a href={entry.featured.href} className="flex w-52 shrink-0 flex-col justify-end rounded-surface bg-[linear-gradient(160deg,oklch(from_var(--brand)_l_c_h/22%),oklch(from_var(--brand)_l_c_h/6%))] p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="font-display text-base font-bold">{entry.featured.title}</span>
                <span className="mt-1 text-xs leading-6 text-muted-foreground">{entry.featured.description}</span>
                {entry.featured.cta && <span className="mt-3 text-xs font-semibold text-brand">{entry.featured.cta} ←</span>}
              </a>
            )}
            <ul className={cn("grid gap-0.5", (entry.columns ?? 2) === 1 ? "w-64 grid-cols-1" : (entry.columns ?? 2) === 2 ? "w-[30rem] grid-cols-2" : "w-[42rem] grid-cols-3")}>
              {entry.links!.map((l) => (
                <li key={l.href + l.title}>
                  <a href={l.href} onClick={() => setOpen(null)} className="flex gap-3 rounded-control p-2.5 outline-none transition-colors hover:bg-accent focus-visible:bg-accent">
                    {l.icon && <span className="flex size-8 shrink-0 items-center justify-center rounded-control border-line border-border bg-background text-muted-foreground"><LinkIcon icon={l.icon} /></span>}
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{l.title}</span>
                      {l.description && <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">{l.description}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
