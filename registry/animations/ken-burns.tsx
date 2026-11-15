"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DRIFT = [
  { x: "-4%", y: "-3%", o: "right top" },
  { x: "4%", y: "2%", o: "left center" },
  { x: "-2%", y: "4%", o: "center bottom" },
  { x: "3%", y: "-4%", o: "right bottom" },
];

/**
 * اسلایدشوی کن‌برنز. Photos cross-fade while each one slowly zooms and pans
 * in its own direction. The outgoing slide keeps drifting while it fades,
 * so nothing snaps. Needs the `ken-burns` keyframes.
 */
export function KenBurns({
  images,
  interval = 5000,
  fade = 1200,
  className,
  children,
}: {
  images: { src: string; alt: string }[];
  /** ms each photo stays in front. */
  interval?: number;
  /** ms of the cross-fade. */
  fade?: number;
  className?: string;
  /** Overlay content (title, buttons) drawn above the photos. */
  children?: React.ReactNode;
}) {
  // `starts[i]` is the round in which slide i was last brought forward:
  // changing its key restarts that slide's drift without touching the one
  // fading out.
  const [{ index, starts }, setState] = React.useState({ index: 0, round: 0, starts: [] as number[] });

  React.useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setState(({ index, round, starts }) => {
        const next = (index + 1) % images.length;
        const s = [...starts];
        s[next] = round + 1;
        return { index: next, round: round + 1, starts: s };
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className={cn("relative isolate overflow-hidden bg-muted", className)}>
      {images.map((img, i) => {
        const d = DRIFT[i % DRIFT.length];
        return (
          <div
            key={i}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{ opacity: i === index ? 1 : 0, transitionDuration: `${fade}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- registry items stay framework-agnostic */}
            <img
              key={starts[i] ?? 0}
              src={img.src}
              alt={img.alt}
              className="size-full object-cover"
              style={{
                transformOrigin: d.o,
                ["--kx" as string]: d.x,
                ["--ky" as string]: d.y,
                animation: `ken-burns ${interval + fade}ms linear both`,
              }}
            />
          </div>
        );
      })}
      {children != null && <div className="relative z-10 size-full">{children}</div>}
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn("h-1 rounded-full bg-white transition-all duration-500", i === index ? "w-5 opacity-100" : "w-1.5 opacity-50")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
