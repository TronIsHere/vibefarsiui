"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

export type MenubarItem =
  | { type?: "item"; label: string; shortcut?: string; disabled?: boolean; danger?: boolean; onSelect?: () => void }
  | { type: "checkbox"; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void; shortcut?: string }
  | { type: "separator" };

export type MenubarMenu = { label: string; items: MenubarItem[] };

export interface MenubarProps {
  menus: MenubarMenu[];
  className?: string;
}

const actionable = (it: MenubarItem) => it.type !== "separator" && !(it.type !== "checkbox" && it.disabled);

/**
 * نوار منو. The «فایل، ویرایش، نما» bar of desktop-style apps: role=menubar, the first
 * menu on the right. ArrowLeft goes to the next menu (RTL), Down opens it, and once one
 * menu is open hovering another switches to it. Shortcuts show as LTR kbd on the far side.
 */
export function Menubar({ menus, className }: MenubarProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  const [focusTop, setFocusTop] = React.useState(0);
  const [active, setActive] = React.useState(-1);
  const tops = React.useRef<(HTMLButtonElement | null)[]>([]);
  const anchor = React.useRef<HTMLButtonElement | null>(null);
  // Point the float anchor at the open menu's button before useFloat measures it.
  React.useLayoutEffect(() => {
    anchor.current = open !== null ? tops.current[open] : null;
  }, [open]);
  const f = useFloat(open !== null, anchor, { align: "start", gap: 4 });
  const bar = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open === null) return;
    f.update();
    const close = (e: Event) => { if (!eventInside(e, bar.current, f.panel.current)) setOpen(null); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open, f]);

  const items = open !== null ? menus[open].items : [];
  const moveTop = (to: number, keepOpen: boolean) => {
    const n = (to + menus.length) % menus.length;
    setFocusTop(n);
    tops.current[n]?.focus();
    if (keepOpen) { setOpen(n); setActive(menus[n].items.findIndex(actionable)); }
  };
  const step = (dir: 1 | -1) => {
    if (!items.length) return;
    let k = active;
    for (let t = 0; t < items.length; t++) {
      k = (k + dir + items.length) % items.length;
      if (actionable(items[k])) { setActive(k); return; }
    }
  };
  const run = (it: MenubarItem) => {
    if (it.type === "separator") return;
    if (it.type === "checkbox") it.onCheckedChange(!it.checked);
    else if (!it.disabled) it.onSelect?.();
    setOpen(null);
    tops.current[focusTop]?.focus();
  };

  function onKeyDown(e: React.KeyboardEvent) {
    const k = e.key;
    if (k === "ArrowLeft") moveTop(focusTop + 1, open !== null);
    else if (k === "ArrowRight") moveTop(focusTop - 1, open !== null);
    else if (k === "ArrowDown") { if (open === null) { setOpen(focusTop); setActive(menus[focusTop].items.findIndex(actionable)); } else step(1); }
    else if (k === "ArrowUp") { if (open === null) { setOpen(focusTop); setActive(menus[focusTop].items.map(actionable).lastIndexOf(true)); } else step(-1); }
    else if ((k === "Enter" || k === " ") && open !== null && active >= 0) run(items[active]);
    else if ((k === "Enter" || k === " ") && open === null) { setOpen(focusTop); setActive(menus[focusTop].items.findIndex(actionable)); }
    else if (k === "Escape") setOpen(null);
    else if (k === "Home") moveTop(0, open !== null);
    else if (k === "End") moveTop(menus.length - 1, open !== null);
    else return;
    e.preventDefault();
  }

  const menuId = (i: number) => `menubar-${i}`;
  return (
    <div ref={bar} role="menubar" aria-orientation="horizontal" onKeyDown={onKeyDown} className={cn("flex h-10 items-center gap-0.5 rounded-control border-line border-border bg-background p-1", className)}>
      {menus.map((m, i) => (
        <button
          key={m.label}
          ref={(el) => { tops.current[i] = el; }}
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          aria-expanded={open === i}
          aria-controls={open === i ? menuId(i) : undefined}
          tabIndex={i === focusTop ? 0 : -1}
          onClick={() => { setFocusTop(i); setOpen(open === i ? null : i); setActive(-1); }}
          onPointerEnter={() => { if (open !== null && open !== i) { setOpen(i); setFocusTop(i); setActive(-1); } }}
          className={cn("h-8 cursor-default rounded-[calc(var(--radius-control,8px)-2px)] px-3 text-sm outline-none transition-colors focus-visible:bg-accent", open === i ? "bg-accent" : "hover:bg-accent/60")}
        >
          {m.label}
        </button>
      ))}
      <FloatPortal
        open={open !== null}
        mounted={f.mounted}
        style={{ ...f.style, position: "fixed" }}
        theme={f.theme}
        panelRef={f.panel}
        id={open !== null ? menuId(open) : undefined}
        role="menu"
        aria-label={open !== null ? menus[open].label : undefined}
        aria-activedescendant={open !== null && active >= 0 ? `${menuId(open)}-${active}` : undefined}
        dir="rtl"
        className="z-50 min-w-52 rounded-overlay border border-border bg-popover p-1 text-sm text-popover-foreground shadow-overlay"
      >
        {items.map((it, k) => {
          if (it.type === "separator") return <div key={k} role="separator" className="-mx-1 my-1 h-px bg-border" />;
          const disabled = it.type !== "checkbox" && it.disabled;
          return (
            <div
              key={k}
              id={`${menuId(open!)}-${k}`}
              role={it.type === "checkbox" ? "menuitemcheckbox" : "menuitem"}
              aria-checked={it.type === "checkbox" ? it.checked : undefined}
              aria-disabled={disabled || undefined}
              onPointerEnter={() => !disabled && setActive(k)}
              onClick={() => !disabled && run(it)}
              className={cn(
                "flex h-8 cursor-default items-center gap-2 rounded-control ps-7 pe-2",
                k === active && "bg-accent",
                disabled && "opacity-45",
                it.type !== "checkbox" && it.danger && "text-destructive",
                "relative",
              )}
            >
              {it.type === "checkbox" && it.checked && <Check className="absolute start-2 size-3.5" />}
              <span className="flex-1">{it.label}</span>
              {it.shortcut && <kbd dir="ltr" className="font-sans text-[11px] tracking-wider text-muted-foreground">{it.shortcut}</kbd>}
            </div>
          );
        })}
      </FloatPortal>
    </div>
  );
}
