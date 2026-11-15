import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * دکمه‌ی غلتان. On hover each word of the label rolls up out of view and a
 * copy rolls in from below, word after word from the right, so the label
 * reads as if a drum turned. Splits on words only, never letters, so Persian
 * stays joined. Pure CSS, no keyframes.
 */
export function RollButton({
  children,
  icon,
  stagger = 35,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: string;
  /** Optional trailing icon that rolls with the label. */
  icon?: React.ReactNode;
  /** ms between words. */
  stagger?: number;
}) {
  const words = children.split(/\s+/).filter(Boolean);
  const roll = (node: React.ReactNode, i: number, key: React.Key) => (
    <span key={key} className="relative inline-flex overflow-hidden">
      <span
        className="inline-flex transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full"
        style={{ transitionDelay: `${i * stagger}ms` }}
      >
        {node}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 inline-flex translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        style={{ transitionDelay: `${i * stagger}ms` }}
      >
        {node}
      </span>
    </span>
  );
  return (
    <button
      type="button"
      aria-label={children}
      {...props}
      className={cn(
        "group inline-flex h-11 cursor-pointer items-center justify-center gap-[0.3em] rounded-control bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4",
        className,
      )}
    >
      <span aria-hidden className="inline-flex gap-[0.3em]">{words.map((w, i) => roll(w, i, i))}</span>
      {icon != null && <span aria-hidden className="ms-1 inline-flex">{roll(icon, words.length, "icon")}</span>}
    </button>
  );
}
