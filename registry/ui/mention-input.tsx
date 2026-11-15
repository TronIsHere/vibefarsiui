"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MentionUser = { id: string; name: string; handle: string; subtitle?: string; avatar?: string };

export interface MentionInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, mentions: MentionUser[]) => void;
  users: MentionUser[];
  /** Character that opens the list. Default "@". */
  trigger?: string;
  placeholder?: string;
  rows?: number;
  /** Most suggestions shown. Default 6. */
  limit?: number;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

/** Folds Arabic ي/ك into Persian ی/ک and drops ZWNJ so «علی» matches «علي». */
const fold = (s: string) => s.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/‌/g, "");

/** The users mentioned as @handle in `text`. */
export function parseMentions(text: string, users: MentionUser[], trigger = "@") {
  const found = new Map<string, MentionUser>();
  for (const u of users) if (new RegExp(`(^|\\s)${trigger}${u.handle}(?![\\w\\u0600-\\u06FF])`, "u").test(text)) found.set(u.id, u);
  return [...found.values()];
}

/**
 * منشن. A textarea that suggests people after @, matching Persian or Latin names and
 * handles (ي and ک fold to ی and ک). The list is an ARIA combobox: Up/Down to choose,
 * Enter or Tab to insert «@handle», Escape to close. Handles are Latin and stay LTR.
 */
export function MentionInput({ value, defaultValue = "", onChange, users, trigger = "@", placeholder, rows = 3, limit = 6, id, className, ...aria }: MentionInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const text = value ?? internal;
  const ta = React.useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = React.useState<{ at: number; q: string } | null>(null);
  const [active, setActive] = React.useState(0);
  const autoId = React.useId();
  const base = id ?? autoId;

  const matches = query
    ? users.filter((u) => fold(u.name).includes(fold(query.q)) || u.handle.toLowerCase().startsWith(query.q.toLowerCase())).slice(0, limit)
    : [];
  const open = !!query && matches.length > 0;

  const set = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next, parseMentions(next, users, trigger));
  };

  /** Find an open «@query» that ends at the caret. */
  const scan = (el: HTMLTextAreaElement) => {
    const upto = el.value.slice(0, el.selectionStart ?? 0);
    const at = upto.lastIndexOf(trigger);
    if (at < 0 || (at > 0 && !/\s/.test(upto[at - 1]))) return setQuery(null);
    const q = upto.slice(at + trigger.length);
    if (/\s/.test(q) || q.length > 24) return setQuery(null);
    setQuery({ at, q });
    setActive(0);
  };

  function insert(u: MentionUser) {
    if (!query || !ta.current) return;
    const caret = ta.current.selectionStart ?? text.length;
    const token = `${trigger}${u.handle} `;
    const next = text.slice(0, query.at) + token + text.slice(caret);
    set(next);
    setQuery(null);
    const pos = query.at + token.length;
    requestAnimationFrame(() => { ta.current?.focus(); ta.current?.setSelectionRange(pos, pos); });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % matches.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + matches.length) % matches.length); }
    else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insert(matches[active]); }
    else if (e.key === "Escape") { e.preventDefault(); setQuery(null); }
  }

  return (
    <div className={cn("relative", className)}>
      <textarea
        ref={ta}
        id={base}
        rows={rows}
        value={text}
        placeholder={placeholder}
        aria-label={aria["aria-label"]}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${base}-list`}
        aria-activedescendant={open ? `${base}-opt-${matches[active]?.id}` : undefined}
        onChange={(e) => { set(e.target.value); scan(e.target); }}
        onKeyDown={onKeyDown}
        onClick={(e) => scan(e.currentTarget)}
        onBlur={() => setTimeout(() => setQuery(null), 120)}
        className="w-full resize-y rounded-field border-line-field border-input bg-field px-3 py-2.5 text-sm leading-7 shadow-field outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/60"
      />
      <ul
        id={`${base}-list`}
        role="listbox"
        aria-label="پیشنهاد افراد"
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-overlay border border-border bg-popover p-1 text-popover-foreground shadow-overlay"
      >
        {matches.map((u, i) => (
          <li
            key={u.id}
            id={`${base}-opt-${u.id}`}
            role="option"
            aria-selected={i === active}
            onPointerDown={(e) => { e.preventDefault(); insert(u); }}
            onPointerEnter={() => setActive(i)}
            className={cn("flex cursor-pointer items-center gap-2.5 rounded-control px-2 py-1.5", i === active && "bg-accent")}
          >
            {u.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.avatar} alt="" className="size-7 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">{u.name.charAt(0)}</span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{u.name}</span>
              {u.subtitle && <span className="block truncate text-[11px] text-muted-foreground">{u.subtitle}</span>}
            </span>
            <bdi dir="ltr" className="shrink-0 text-xs text-muted-foreground">{trigger}{u.handle}</bdi>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Renders text with each @handle as a highlighted chip, for showing a sent message. */
export function MentionText({ children, users, trigger = "@", className }: { children: string; users: MentionUser[]; trigger?: string; className?: string }) {
  const handles = new Map(users.map((u) => [u.handle.toLowerCase(), u]));
  const parts = children.split(new RegExp(`(${trigger}[A-Za-z0-9_.]+)`, "g"));
  return (
    <p className={cn("whitespace-pre-wrap leading-7", className)}>
      {parts.map((p, i) => {
        const u = p.startsWith(trigger) ? handles.get(p.slice(trigger.length).toLowerCase()) : undefined;
        return u ? (
          <bdi key={i} dir="ltr" title={u.name} className="rounded bg-brand/10 px-1 font-medium text-brand">{p}</bdi>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        );
      })}
    </p>
  );
}
