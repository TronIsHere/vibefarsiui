"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatPortal, useFloat } from "@/lib/float";

export interface AsyncOption { value: string; label: string; hint?: string }

export interface ComboboxAsyncProps {
  /** Fetch options for a query. Use the signal to drop stale requests. */
  loadOptions: (query: string, signal: AbortSignal) => Promise<AsyncOption[]>;
  value?: AsyncOption | null;
  onChange?: (option: AsyncOption | null) => void;
  placeholder?: string;
  minChars?: number;
  debounce?: number;
  emptyText?: string;
  errorText?: string;
  className?: string;
}

/** کمبوباکس آنلاین. Debounced remote search with loading, empty and error states; stale responses are aborted. */
export function ComboboxAsync({ loadOptions, value = null, onChange, placeholder = "جست‌وجو…", minChars = 1, debounce = 250, emptyText = "چیزی پیدا نشد", errorText = "خطا در دریافت نتایج", className }: ComboboxAsyncProps) {
  const [q, setQ] = React.useState(value?.label ?? "");
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<AsyncOption[]>([]);
  const [state, setState] = React.useState<"idle" | "loading" | "error">("idle");
  const [index, setIndex] = React.useState(0);
  const listId = React.useId();
  const root = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listOpen = open && q.trim().length >= minChars;
  const { mounted, style, theme, panel } = useFloat(listOpen, root, { matchWidth: true, gap: 4 });

  React.useEffect(() => {
    if (!open || q.trim().length < minChars) return;
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      setState("loading");
      try {
        const res = await loadOptions(q.trim(), ctrl.signal);
        if (!ctrl.signal.aborted) { setItems(res); setIndex(0); setState("idle"); }
      } catch (e) {
        if (!ctrl.signal.aborted) setState(e instanceof DOMException && e.name === "AbortError" ? "idle" : "error");
      }
    }, debounce);
    return () => { window.clearTimeout(t); ctrl.abort(); };
  }, [q, open, minChars, debounce, loadOptions]);

  function pick(o: AsyncOption) { setQ(o.label); onChange?.(o); setOpen(false); }

  // Keep the keyboard-active option in view (scrolls only when needed).
  React.useEffect(() => {
    if (!listOpen) return;
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [listOpen, index]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <div className="flex h-10 items-center overflow-visible rounded-field border-line-field border-input bg-field shadow-field pe-2 ps-3 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60">
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          value={q}
          placeholder={placeholder}
          onChange={(e) => { setQ(e.target.value); setOpen(true); if (e.target.value.trim().length < minChars) setItems([]); if (value) onChange?.(null); }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(items.length - 1, i + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
            if (e.key === "Enter" && open && items[index]) { e.preventDefault(); pick(items[index]); }
            if (e.key === "Escape") setOpen(false);
          }}
          className="h-full min-w-0 flex-1 bg-transparent pe-2 text-sm/8 outline-none placeholder:text-muted-foreground/70"
        />
        {state === "loading" ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />}
      </div>
      <FloatPortal open={listOpen} mounted={mounted} style={style} theme={theme} panelRef={panel} className="fixed z-50">
        <ul id={listId} ref={listRef} role="listbox" className="max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1.5 text-sm/8 shadow-lg">
          {state === "error" && <li className="px-2.5 py-2 text-destructive">{errorText}</li>}
          {state === "loading" && items.length === 0 && <li className="px-2.5 py-2 text-muted-foreground">در حال جست‌وجو…</li>}
          {state === "idle" && items.length === 0 && <li className="px-2.5 py-2 text-muted-foreground">{emptyText}</li>}
          {items.map((o, i) => (
            <li
              key={o.value}
              role="option"
              data-index={i}
              aria-selected={o.value === value?.value}
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              onMouseEnter={() => setIndex(i)}
              className={cn("flex cursor-pointer items-center justify-between overflow-visible rounded-md px-2.5 py-2", i === index && "bg-accent")}
            >
              <span className="flex min-w-0 items-baseline overflow-visible">
                <span className="pb-[0.2em] pe-[0.45em]">{o.label}</span>
                {o.hint && <span className="text-xs text-muted-foreground">{o.hint}</span>}
              </span>
              {o.value === value?.value && <Check className="size-3.5 shrink-0" />}
            </li>
          ))}
        </ul>
      </FloatPortal>
    </div>
  );
}
