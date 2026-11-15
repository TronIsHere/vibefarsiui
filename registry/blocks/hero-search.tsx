"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/registry/ui/button";

export interface HeroSearchProps {
  title: React.ReactNode;
  description?: string;
  placeholder?: string;
  /** Frequent searches shown as chips; clicking one fills the field and submits. */
  popular?: string[];
  /** Small facts under the chips, e.g. «۱۲ هزار آگهی فعال». */
  facts?: string[];
  onSearch?: (query: string) => void;
}

/** هیروی جست‌وجو. For marketplaces and directories: one large search field is the call to action. */
export function HeroSearch({ title, description, placeholder = "دنبال چه چیزی می‌گردید؟", popular, facts, onSearch }: HeroSearchProps) {
  const [query, setQuery] = React.useState("");
  const id = React.useId();

  function submit(q: string) {
    const trimmed = q.trim();
    if (trimmed) onSearch?.(trimmed);
  }

  return (
    <section className="relative overflow-hidden px-6 py-20 text-center sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72" style={{ background: "radial-gradient(60% 100% at 50% 0%, oklch(from var(--brand) l c h / 14%), transparent 70%)" }} />
      <div className="relative mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.2]">{title}</h1>
        {description && <p className="mx-auto mt-4 max-w-xl leading-8 text-muted-foreground sm:text-lg">{description}</p>}
        <form
          role="search"
          className="mt-8 flex h-14 items-center gap-2 rounded-full border border-border bg-card ps-5 pe-2 shadow-[0_20px_60px_-30px_oklch(0_0_0/60%)] focus-within:ring-2 focus-within:ring-ring/60"
          onSubmit={(e) => { e.preventDefault(); submit(query); }}
        >
          <Search aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <label htmlFor={id} className="sr-only">جست‌وجو</label>
          <input
            id={id}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden"
          />
          <Button type="submit" className="rounded-full px-6">جست‌وجو</Button>
        </form>
        {popular && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">پرجست‌وجوها</span>
            {popular.map((p) => (
              <button key={p} type="button" onClick={() => { setQuery(p); submit(p); }} className="cursor-pointer rounded-full border border-border px-3 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                {p}
              </button>
            ))}
          </div>
        )}
        {facts && (
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {facts.map((f) => <li key={f} className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-brand" />{f}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}
