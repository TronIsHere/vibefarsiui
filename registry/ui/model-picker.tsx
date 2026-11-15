"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

export interface ModelOption {
  id: string;
  /** Display name. Latin model names are isolated so they do not reorder Persian text around them. */
  name: string;
  /** One line on what it is good at. */
  description?: string;
  /** Short tag such as «سریع» or «جدید». */
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Why it is disabled, e.g. «در پلن حرفه‌ای». */
  disabledReason?: string;
}

export interface ModelPickerProps {
  models: ModelOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Where the panel opens. A picker in a bottom composer usually wants "top". */
  side?: "top" | "bottom";
  align?: "start" | "end";
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

/** Index of the next enabled model from `from` in steps of `delta`, wrapping around. */
function stepEnabled(models: ModelOption[], from: number, delta: number) {
  let next = from;
  for (let n = 0; n < models.length; n++) {
    next = (next + delta + models.length) % models.length;
    if (!models[next].disabled) break;
  }
  return next;
}

/** Arrow, Home and End handling shared by the popover and the inline list. Returns true when handled. */
function listKeys(e: React.KeyboardEvent, models: ModelOption[], active: number, setActive: (i: number) => void) {
  if (e.key === "ArrowDown") setActive(stepEnabled(models, active, 1));
  else if (e.key === "ArrowUp") setActive(stepEnabled(models, active, -1));
  else if (e.key === "Home") setActive(models.findIndex((m) => !m.disabled));
  else if (e.key === "End") setActive(models.length - 1 - [...models].reverse().findIndex((m) => !m.disabled));
  else return false;
  e.preventDefault();
  return true;
}

function ModelRows({ models, selected, active, setActive, choose, id }: { models: ModelOption[]; selected: string; active: number; setActive: (i: number) => void; choose: (m: ModelOption) => void; id: string }) {
  return models.map((m, i) => {
    const on = m.id === selected;
    return (
      <div
        key={m.id}
        id={`${id}-${i}`}
        role="option"
        aria-selected={on}
        aria-disabled={m.disabled || undefined}
        onMouseEnter={() => !m.disabled && setActive(i)}
        onClick={() => choose(m)}
        className={cn("flex items-start gap-3 rounded-lg px-2.5 py-2", m.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", i === active && !m.disabled && "bg-accent")}
      >
        {m.icon && <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">{m.icon}</span>}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-2">
            <bdi className="font-medium">{m.name}</bdi>
            {m.badge && <span className="rounded-full bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-brand">{m.badge}</span>}
          </span>
          {(m.description || (m.disabled && m.disabledReason)) && <span className="mt-0.5 text-xs leading-5 text-muted-foreground">{m.disabled && m.disabledReason ? m.disabledReason : m.description}</span>}
        </span>
        {on && <Check className="mt-1 size-4 shrink-0 text-brand" />}
      </div>
    );
  });
}

export type ModelListProps = Omit<ModelPickerProps, "side" | "align" | "size">;

/**
 * The picker's list on its own, always open: a focusable listbox for a settings page or a
 * model step in onboarding. Arrows move, Enter or Space picks.
 */
export function ModelList({ models, value, defaultValue, onChange, className, "aria-label": ariaLabel = "انتخاب مدل" }: ModelListProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? models.find((m) => !m.disabled)?.id ?? "");
  const selected = value ?? internal;
  const [active, setActive] = React.useState(() => Math.max(0, models.findIndex((m) => m.id === selected)));
  const id = React.useId();
  const choose = (m: ModelOption) => {
    if (m.disabled) return;
    if (value === undefined) setInternal(m.id);
    onChange?.(m.id);
  };
  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-activedescendant={`${id}-${active}`}
      onKeyDown={(e) => {
        if (listKeys(e, models, active, setActive)) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(models[active]); }
      }}
      className={cn("rounded-overlay border-line border-border bg-popover p-1.5 text-sm text-popover-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <ModelRows models={models} selected={selected} active={active} setActive={setActive} choose={choose} id={id} />
    </div>
  );
}

/** انتخاب مدل. A compact trigger that opens a listbox of models with a description and a tag each. */
export function ModelPicker({ models, value, defaultValue, onChange, side = "top", align = "start", size = "sm", className, "aria-label": ariaLabel = "انتخاب مدل" }: ModelPickerProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? models.find((m) => !m.disabled)?.id ?? "");
  const selected = value ?? internal;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const id = React.useId();
  const { mounted, style, theme, panel, update } = useFloat(open, root, { side, align });
  const current = models.find((m) => m.id === selected);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, root.current, panel.current)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, panel]);

  // Once the panel has its real height, re-place it (it may need to flip) and move focus in.
  React.useEffect(() => {
    if (!open) return;
    update();
    panel.current?.focus();
  }, [open, update, panel]);

  function show() {
    setActive(Math.max(0, models.findIndex((m) => m.id === selected)));
    update();
    setOpen(true);
  }

  function close(focusTrigger = true) {
    setOpen(false);
    if (focusTrigger) trigger.current?.focus();
  }

  function choose(m: ModelOption) {
    if (m.disabled) return;
    if (value === undefined) setInternal(m.id);
    onChange?.(m.id);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (listKeys(e, models, active, setActive)) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(models[active]); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") close(false);
  }

  return (
    <div ref={root} className={cn("inline-block", className)}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={`${ariaLabel}: ${current?.name ?? ""}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={(e) => { if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); show(); } }}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-control text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 border-line border-input px-3 text-sm",
        )}
      >
        {current?.icon && <span className="flex size-4 items-center justify-center [&_svg]:size-4">{current.icon}</span>}
        <bdi>{current?.name ?? "انتخاب مدل"}</bdi>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <FloatPortal
        open={open}
        mounted={mounted}
        style={style}
        theme={theme}
        panelRef={panel}
        id={id}
        role="listbox"
        tabIndex={-1}
        aria-label={ariaLabel}
        aria-activedescendant={`${id}-${active}`}
        onKeyDown={onKeyDown}
        className="fixed z-50 w-72 max-w-[calc(100vw-1rem)] rounded-overlay border-line border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-overlay outline-none [backdrop-filter:var(--surface-filter)] animate-fade-up [animation-duration:180ms]"
      >
        <ModelRows models={models} selected={selected} active={active} setActive={setActive} choose={choose} id={id} />
      </FloatPortal>
    </div>
  );
}
