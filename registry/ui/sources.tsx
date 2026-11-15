"use client";

import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface Source {
  title: string;
  url: string;
  /** A sentence from the page that backs the claim. */
  snippet?: string;
  /** Your own favicon element. A globe is drawn without it. */
  icon?: React.ReactNode;
}

/** Host of a URL without "www.", or the raw string when it is not a URL. */
export function sourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export interface CitationProps {
  /** 1-based number of the source. */
  index: number;
  source?: Source;
  className?: string;
}

/** ارجاع درون‌متنی. A small numbered chip placed after a sentence; it links to the source and to its row in the list. */
export function Citation({ index, source, className }: CitationProps) {
  const label = source ? `منبع ${fa(index)}: ${source.title}` : `منبع ${fa(index)}`;
  return (
    <a
      href={source?.url ?? `#source-${index}`}
      target={source ? "_blank" : undefined}
      rel={source ? "noopener noreferrer" : undefined}
      aria-label={label}
      title={source?.title}
      className={cn("mx-0.5 inline-flex h-5 min-w-5 -translate-y-px items-center justify-center rounded-full bg-secondary px-1.5 align-middle text-[11px] font-medium leading-none text-muted-foreground no-underline transition-colors hover:bg-brand hover:text-brand-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      {fa(index)}
    </a>
  );
}

export interface SourcesProps {
  sources: Source[];
  /** "list" shows every source with its snippet; "chips" is a compact wrapping row. */
  variant?: "list" | "chips";
  /** Starts folded behind a «۴ منبع» button. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  title?: string;
  className?: string;
}

/** منابع. The numbered sources of an answer; titles follow their own language and hosts stay left-to-right. */
export function Sources({ sources, variant = "list", collapsible = false, defaultOpen = false, title = "منابع", className }: SourcesProps) {
  const [open, setOpen] = React.useState(!collapsible || defaultOpen);
  const id = React.useId();
  if (sources.length === 0) return null;

  const body =
    variant === "chips" ? (
      <ol className="flex flex-wrap gap-2">
        {sources.map((s, i) => (
          <li key={s.url} id={`source-${i + 1}`}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" title={s.title} className="flex h-8 max-w-56 items-center gap-2 rounded-full border border-border bg-card ps-1 pe-3 text-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-medium text-muted-foreground">{fa(i + 1)}</span>
              <bdi dir="ltr" className="truncate text-muted-foreground">{sourceHost(s.url)}</bdi>
            </a>
          </li>
        ))}
      </ol>
    ) : (
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sources.map((s, i) => (
          <li key={s.url} id={`source-${i + 1}`}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex h-full gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-medium text-muted-foreground">{fa(i + 1)}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span dir="auto" className="line-clamp-2 text-sm font-medium leading-6">{s.title}</span>
                {s.snippet && <span dir="auto" className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{s.snippet}</span>}
                <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="flex size-3.5 items-center justify-center [&_img]:size-full [&_svg]:size-full">{s.icon ?? <Globe />}</span>
                  <bdi dir="ltr" className="truncate">{sourceHost(s.url)}</bdi>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    );

  if (!collapsible) {
    return (
      <section aria-label={title} className={className}>
        <h3 className="mb-2 text-xs font-semibold text-muted-foreground">{title}</h3>
        {body}
      </section>
    );
  }
  return (
    <section aria-label={title} className={className}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex h-8 cursor-pointer items-center gap-2 rounded-full border border-border ps-1.5 pe-3 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex -space-x-1.5 space-x-reverse">
          {sources.slice(0, 3).map((s) => <span key={s.url} className="flex size-5 items-center justify-center rounded-full border border-background bg-secondary [&_img]:size-full [&_img]:rounded-full [&_svg]:size-3">{s.icon ?? <Globe />}</span>)}
        </span>
        {fa(sources.length)} منبع
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <div id={id} className={cn("grid transition-[grid-template-rows] duration-200 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden" inert={!open}><div className="pt-3">{body}</div></div>
      </div>
    </section>
  );
}
