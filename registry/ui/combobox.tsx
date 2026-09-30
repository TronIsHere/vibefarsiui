"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatPortal, useFloat } from "@/lib/float";

export interface ComboboxProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

/**
 * کمبوباکس: an input with live suggestions. Typing filters by prefix first,
 * then by substring; arrow keys move, Enter picks, Escape closes.
 */
export function Combobox({ options, value = "", onChange, placeholder = "جست‌وجو…", emptyText = "چیزی پیدا نشد", className }: ComboboxProps) {
  const [query, setQuery] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const listId = React.useId();
  const root = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const { mounted, style, theme, panel } = useFloat(open, root, { matchWidth: true, gap: 4 });

  const q = query.trim();
  const filtered = React.useMemo(() => {
    if (!q) return options;
    const starts = options.filter((o) => o.startsWith(q));
    const contains = options.filter((o) => !o.startsWith(q) && o.includes(q));
    return [...starts, ...contains];
  }, [options, q]);

  // Keep the keyboard-active option in view (scrolls only when needed).
  React.useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, index]);

  function pick(v: string) {
    setQuery(v);
    onChange?.(v);
    setOpen(false);
  }

  return (
    <div ref={root} className={cn("relative", className)}>
      <div className="flex h-10 w-full items-center rounded-field border-line-field border-input bg-field shadow-field pe-2 ps-3 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60">
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setIndex((i) => Math.min(filtered.length - 1, i + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
            if (e.key === "Enter" && open && filtered[index]) { e.preventDefault(); pick(filtered[index]); }
            if (e.key === "Escape") setOpen(false);
          }}
          className="h-full min-w-0 flex-1 bg-transparent pe-1 text-sm leading-8 outline-none placeholder:text-muted-foreground/70"
        />
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </div>
      <FloatPortal open={open} mounted={mounted} style={style} theme={theme} panelRef={panel} className="fixed z-50">
        <ul id={listId} ref={listRef} role="listbox" className="max-h-56 overflow-auto rounded-lg border border-border bg-popover p-1 text-sm leading-7 shadow-lg">
          {filtered.length === 0 && <li className="px-2.5 py-2 text-muted-foreground">{emptyText}</li>}
          {filtered.map((o, i) => (
            <li
              key={o}
              role="option"
              data-index={i}
              aria-selected={o === value}
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              onMouseEnter={() => setIndex(i)}
              className={cn("flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2", i === index && "bg-accent")}
            >
              <span className="inline-block pe-[0.2em]">
                {q && o.startsWith(q) ? (<><span className="font-semibold">{q}</span>{o.slice(q.length)}</>) : o}
              </span>
              {o === value && <Check className="size-3.5 shrink-0" />}
            </li>
          ))}
        </ul>
      </FloatPortal>
    </div>
  );
}
