"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type BottomNavItem = {
  value: string;
  label: string;
  icon: LucideIcon;
  /** Icon when active, e.g. a filled variant. */
  activeIcon?: LucideIcon;
  /** Number badge; above 99 shows «۹۹+». True shows a dot. */
  badge?: number | boolean;
  href?: string;
};

export interface BottomNavProps {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** A raised center action, like «ثبت آگهی» or a scan button. Sits in the middle of the bar. */
  action?: { label: string; icon: LucideIcon; onClick: () => void };
  /** «fixed» sticks to the viewport bottom (default); «static» flows in the page, for previews. */
  position?: "fixed" | "static";
  /** Hide labels except on the active tab. */
  labels?: "always" | "active";
  className?: string;
}

function NavIcon({ icon, className }: { icon: LucideIcon; className?: string }) {
  return React.createElement(icon, { className, "aria-hidden": true });
}

/**
 * نوار پایین موبایل. The tab bar of Iranian super-apps and shops: up to five items with
 * an active pill, number badges, an optional raised center action and room for the
 * home indicator (safe-area inset). First item on the right.
 */
export function BottomNav({ items, value, defaultValue, onChange, action, position = "fixed", labels = "always", className }: BottomNavProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const current = value ?? internal;
  const half = Math.ceil(items.length / 2);
  const select = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  const render = (it: BottomNavItem) => {
    const on = it.value === current;
    const badge = it.badge === true ? "" : typeof it.badge === "number" && it.badge > 0 ? (it.badge > 99 ? "۹۹+" : fa(it.badge)) : null;
    const content = (
      <>
        <span className={cn("relative flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-(--motion) ease-motion", on ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
          <NavIcon icon={on && it.activeIcon ? it.activeIcon : it.icon} className="size-[22px]" />
          {badge !== null && (
            <span className={cn("absolute top-0.5 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold leading-none text-white ring-2 ring-background", badge ? "end-2 h-4 min-w-4 px-1" : "end-3.5 size-2")}>
              {badge}
            </span>
          )}
        </span>
        <span className={cn("text-[11px] leading-4 transition-opacity", on ? "font-semibold text-foreground" : "text-muted-foreground", labels === "active" && !on && "sr-only")}>
          {it.label}
          {typeof it.badge === "number" && it.badge > 0 && <span className="sr-only">، {fa(it.badge)} مورد جدید</span>}
        </span>
      </>
    );
    const cls = "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-1.5 outline-none focus-visible:[&>span:first-child]:ring-2 focus-visible:[&>span:first-child]:ring-ring";
    return (
      <li key={it.value} className="flex flex-1">
        {it.href ? (
          <a href={it.href} aria-current={on ? "page" : undefined} onClick={() => select(it.value)} className={cls}>{content}</a>
        ) : (
          <button type="button" aria-current={on ? "page" : undefined} onClick={() => select(it.value)} className={cls}>{content}</button>
        )}
      </li>
    );
  };

  return (
    <nav
      aria-label="ناوبری اصلی"
      className={cn(
        "z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur",
        position === "fixed" ? "fixed inset-x-0 bottom-0" : "relative",
        className,
      )}
    >
      <ul className="mx-auto flex max-w-lg items-stretch px-1">
        {items.slice(0, action ? half : items.length).map(render)}
        {action && (
          <li className="flex flex-1 items-start justify-center">
            <button type="button" onClick={action.onClick} aria-label={action.label} title={action.label} className="-mt-5 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-overlay ring-4 ring-background transition-transform ease-motion active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <NavIcon icon={action.icon} className="size-6" />
            </button>
          </li>
        )}
        {action && items.slice(half).map(render)}
      </ul>
    </nav>
  );
}
