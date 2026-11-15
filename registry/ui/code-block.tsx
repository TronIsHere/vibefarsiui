"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  /** Shown in the header, e.g. "tsx". */
  language?: string;
  /** File name shown instead of the language. */
  filename?: string;
  lineNumbers?: boolean;
  /** 1-based line numbers to tint. */
  highlight?: number[];
  /** CSS max height; the block scrolls beyond it. */
  maxHeight?: string;
  /** Pre-highlighted markup (e.g. from shiki) rendered instead of the plain text. `code` is still what gets copied. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * بلوک کد. Always left-to-right, whatever the page direction: code is never mirrored.
 * The copy button sits at the physical top-right corner of the header, which is where
 * a Persian reader's eye starts.
 */
export function CodeBlock({ code, language, filename, lineNumbers, highlight = [], maxHeight, children, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const marked = React.useMemo(() => new Set(highlight), [highlight]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; the text stays selectable */
    }
  }

  return (
    <figure dir="ltr" className={cn("my-0 overflow-hidden rounded-surface border-line border-border bg-card text-start", className)}>
      <figcaption className="flex h-10 items-center justify-between gap-3 border-b border-border ps-4 pe-1.5">
        <span className="truncate font-mono text-xs text-muted-foreground">{filename ?? language ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          dir="rtl"
          className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          <span aria-live="polite">{copied ? "کپی شد" : "کپی"}</span>
        </button>
      </figcaption>
      <pre tabIndex={0} className="overflow-auto py-3 font-mono text-[13px] leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" style={{ maxHeight }}>
        {children ? (
          <code className="block px-4">{children}</code>
        ) : (
          <code className="block w-max min-w-full">
            {lines.map((line, i) => (
              <span key={i} className={cn("flex px-4", marked.has(i + 1) && "bg-brand/10 shadow-[inset_2px_0_0_var(--brand)]")}>
                {lineNumbers && <span aria-hidden className="w-8 shrink-0 select-none pe-4 text-end text-muted-foreground/60">{i + 1}</span>}
                <span className="whitespace-pre">{line || " "}</span>
              </span>
            ))}
          </code>
        )}
      </pre>
      <span className="sr-only" dir="rtl">{fa(lines.length)} خط کد</span>
    </figure>
  );
}
