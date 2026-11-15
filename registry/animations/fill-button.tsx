"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * دکمه‌ی پرشونده. On hover a circle of ink grows from the exact point where
 * the pointer came in and floods the button; on leave it drains back out
 * through the point where the pointer left. Keyboard focus fills from the
 * centre. No keyframes needed, just a transition.
 */
export function FillButton({
  children,
  className,
  fillClassName = "bg-foreground",
  activeTextClassName = "text-background",
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Colour of the flood. */
  fillClassName?: string;
  /** Text colour while filled. */
  activeTextClassName?: string;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [fill, setFill] = React.useState({ x: 50, y: 50, on: false });

  const at = (e: React.PointerEvent, on: boolean) => {
    const r = ref.current!.getBoundingClientRect();
    setFill({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on });
  };

  return (
    <button
      ref={ref}
      type="button"
      {...props}
      onPointerEnter={(e) => { at(e, true); onPointerEnter?.(e); }}
      onPointerLeave={(e) => { at(e, false); onPointerLeave?.(e); }}
      onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) setFill({ x: 50, y: 50, on: true }); onFocus?.(e); }}
      onBlur={(e) => { setFill((f) => ({ ...f, on: false })); onBlur?.(e); }}
      className={cn(
        "relative isolate inline-flex h-11 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-foreground px-6 text-sm font-semibold transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4",
        fill.on && activeTextClassName,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("pointer-events-none absolute -z-10 aspect-square w-[250%] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", fillClassName)}
        style={{ left: `${fill.x}%`, top: `${fill.y}%`, transform: `translate(-50%, -50%) scale(${fill.on ? 1 : 0})` }}
      />
      {children}
    </button>
  );
}
