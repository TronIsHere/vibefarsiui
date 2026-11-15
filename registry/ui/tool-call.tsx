"use client";

import * as React from "react";
import { Check, ChevronDown, CircleDashed, LoaderCircle, Wrench, X } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type ToolStatus = "pending" | "running" | "success" | "error";

export interface ToolCallProps {
  /** Function name as the model called it, e.g. "search_orders". Shown left-to-right. */
  name: string;
  /** What it does in Persian, e.g. «جست‌وجو در سفارش‌ها». */
  label?: string;
  status: ToolStatus;
  /** Arguments the model sent. Objects are printed as JSON. */
  input?: unknown;
  /** What the tool returned. */
  output?: unknown;
  /** Error message when status is "error". */
  error?: string;
  /** Run time in milliseconds. */
  duration?: number;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const STATUS: Record<ToolStatus, { label: string; tone: string }> = {
  pending: { label: "در صف", tone: "text-muted-foreground" },
  running: { label: "در حال اجرا", tone: "text-brand" },
  success: { label: "انجام شد", tone: "text-success" },
  error: { label: "ناموفق", tone: "text-destructive" },
};

function StatusIcon({ status }: { status: ToolStatus }) {
  if (status === "running") return <LoaderCircle className="size-4 motion-safe:animate-spin" />;
  if (status === "success") return <Check className="size-4" />;
  if (status === "error") return <X className="size-4" />;
  return <CircleDashed className="size-4" />;
}

const print = (value: unknown) => (typeof value === "string" ? value : JSON.stringify(value, null, 2));

/** Seconds with one decimal under ten seconds: 1240 -> «۱٫۲ ثانیه». */
function formatDuration(ms: number) {
  if (ms < 1000) return `${fa(Math.round(ms))} میلی‌ثانیه`;
  return `${fa((ms / 1000).toFixed(ms < 10_000 ? 1 : 0)).replace(".", "٫")} ثانیه`;
}

/** فراخوانی ابزار. One tool call of an agent: what ran, its state, and the raw input and output on demand. */
export function ToolCall({ name, label, status, input, output, error, duration, icon, defaultOpen = false, className }: ToolCallProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  const hasBody = input !== undefined || output !== undefined || Boolean(error);
  const s = STATUS[status];

  return (
    <div className={cn("overflow-hidden rounded-surface border-line border-border bg-card text-sm", status === "error" && "border-destructive/40", className)}>
      <button
        type="button"
        disabled={!hasBody}
        aria-expanded={hasBody ? open : undefined}
        aria-controls={hasBody ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors enabled:cursor-pointer enabled:hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground [&_svg]:size-4">{icon ?? <Wrench />}</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{label ?? name}</span>
          {label && <bdi dir="ltr" className="truncate text-end font-mono text-[11px] text-muted-foreground">{name}</bdi>}
        </span>
        <span className={cn("flex shrink-0 items-center gap-1.5 text-xs", s.tone)}>
          <StatusIcon status={status} />
          <span>{s.label}</span>
          {duration !== undefined && status !== "running" && status !== "pending" && <span className="text-muted-foreground">· {formatDuration(duration)}</span>}
        </span>
        {hasBody && <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />}
      </button>
      {hasBody && (
        <div id={id} className={cn("grid transition-[grid-template-rows] duration-200 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="min-h-0 overflow-hidden" inert={!open}>
            <div className="space-y-3 border-t border-border p-3">
              {input !== undefined && (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">ورودی</p>
                  <pre dir="ltr" tabIndex={0} className="max-h-48 overflow-auto rounded-lg bg-secondary/60 p-3 text-start font-mono text-xs leading-6">{print(input)}</pre>
                </div>
              )}
              {output !== undefined && (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">خروجی</p>
                  <pre dir="ltr" tabIndex={0} className="max-h-64 overflow-auto rounded-lg bg-secondary/60 p-3 text-start font-mono text-xs leading-6">{print(output)}</pre>
                </div>
              )}
              {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-xs leading-6 text-destructive">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Groups consecutive tool calls under one caption such as «۳ ابزار اجرا شد». */
export function ToolCallGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const count = React.Children.count(children);
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground">{fa(count)} ابزار اجرا شد</p>
      {children}
    </div>
  );
}
