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
  id?: string;
  /** Hidden input with the picked value, for a plain <form>. */
  name?: string;
  disabled?: boolean;
  /** Only values from `options`: on blur, free text snaps to a matching option or reverts. */
  strict?: boolean;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

/** Arabic ي/ك, alef-madda, ZWNJ and spaces don't break a match: «علي اباد» finds «علی‌آباد». */
function fold(s: string) {
  return s.replace(/ي/g, "ی").replace(/ى/g, "ی").replace(/ك/g, "ک").replace(/[آأإ]/g, "ا").replace(/[\s‌]+/g, "");
}

/**
 * کمبوباکس: an input with live suggestions. Typing filters by prefix first,
 * then by substring; arrow keys move, Enter picks, Escape closes.
 */
export function Combobox({
  options,
  value = "",
  onChange,
  placeholder = "جست‌وجو…",
  emptyText = "چیزی پیدا نشد",
  className,
  id,
  name,
  disabled,
  strict,
  ...aria
}: ComboboxProps) {
  const [query, setQuery] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const listId = React.useId();
  const root = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const { mounted, style, theme, panel } = useFloat(open, root, { matchWidth: true, gap: 4 });

  // The parent changed the value (reset, swap, dependent field): show it.
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  const q = query.trim();
  const filtered = React.useMemo(() => {
    const f = fold(q);
    if (!f || q === value) return options;
    const starts = options.filter((o) => fold(o).startsWith(f));
    const contains = options.filter((o) => !fold(o).startsWith(f) && fold(o).includes(f));
    return [...starts, ...contains];
  }, [options, q, value]);

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

  function commit() {
    setOpen(false);
    if (!strict || query === value) return;
    const f = fold(query.trim());
    const exact = f ? options.find((o) => fold(o) === f) : undefined;
    if (exact) pick(exact);
    else if (!f && value) pick("");
    else setQuery(value);
  }

  return (
    <div ref={root} className={cn("relative", className)}>
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-field border-line-field bg-field shadow-field pe-2 ps-3 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60",
          aria["aria-invalid"] ? "border-destructive/60" : "border-input",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          {...aria}
          disabled={disabled}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setIndex(0);
          }}
          onFocus={(e) => {
            setOpen(true);
            if (query === value) e.currentTarget.select();
          }}
          onBlur={() => setTimeout(commit, 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setIndex((i) => Math.min(filtered.length - 1, i + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
            if (e.key === "Enter" && open && filtered[index]) { e.preventDefault(); pick(filtered[index]); }
            if (e.key === "Escape") setOpen(false);
          }}
          className="h-full min-w-0 flex-1 bg-transparent pe-1 text-sm leading-8 outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
        />
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </div>
      {name && <input type="hidden" name={name} value={value} />}
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
                {q && q !== value && o.startsWith(q) ? (<><span className="font-semibold">{q}</span>{o.slice(q.length)}</>) : o}
              </span>
              {o === value && <Check className="size-3.5 shrink-0" />}
            </li>
          ))}
        </ul>
      </FloatPortal>
    </div>
  );
}
