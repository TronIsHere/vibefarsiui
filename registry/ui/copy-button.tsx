"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Copies text, with a textarea fallback for http pages and older WebViews where the Clipboard API is missing. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;inset-block-start:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onCopy" | "children"> {
  /** Text to copy, or a function that returns it at click time. */
  value: string | (() => string);
  /** Visible label. Without it the button is icon-only and uses `label` as its name. */
  children?: React.ReactNode;
  /** Accessible name of the icon-only button. Default «کپی». */
  label?: string;
  /** Text shown and announced after copying. Default «کپی شد». */
  copiedLabel?: string;
  /** ms before the check mark goes back. Default 1800. */
  timeout?: number;
  variant?: "ghost" | "outline" | "secondary";
  size?: "sm" | "md";
  onCopy?: (ok: boolean) => void;
}

const variants = {
  ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
  outline: "border-line border-input hover:bg-accent shadow-control",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
};

/**
 * دکمه‌ی کپی. Icon-only or with a label; swaps to a check mark and announces «کپی شد»
 * through a polite live region. Falls back to execCommand where the Clipboard API is blocked.
 */
export function CopyButton({ value, children, label = "کپی", copiedLabel = "کپی شد", timeout = 1800, variant = "ghost", size = "md", onCopy, className, onClick, ...props }: CopyButtonProps) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const ok = await copyText(typeof value === "function" ? value() : value);
    setState(ok ? "copied" : "failed");
    onCopy?.(ok);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), timeout);
  }

  const icon = state === "copied" ? <Check className="text-success" /> : <Copy />;
  const iconOnly = children === undefined;
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={iconOnly ? (state === "copied" ? copiedLabel : label) : undefined}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-control font-medium transition-colors ease-motion focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        iconOnly ? (size === "sm" ? "size-7" : "size-9") : size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
        className,
      )}
      {...props}
    >
      {icon}
      {!iconOnly && <span>{state === "copied" ? copiedLabel : state === "failed" ? "کپی نشد" : children}</span>}
      <span className="sr-only" aria-live="polite">{state === "copied" ? copiedLabel : state === "failed" ? "کپی نشد" : ""}</span>
    </button>
  );
}
