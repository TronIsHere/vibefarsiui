"use client";

import * as React from "react";
import { Avatar } from "@/registry/ui/avatar";
import { cn } from "@/lib/utils";

export interface SpotlightTestimonial {
  name: string;
  role: string;
  quote: string;
  /** A headline figure for the case, e.g. «۳ برابر» with «فروش در شش ماه». */
  metric?: { value: string; label: string };
}

export interface TestimonialSpotlightProps {
  eyebrow?: string;
  items: SpotlightTestimonial[];
  /** Seconds between automatic changes. 0 turns it off. Pauses on hover and focus. */
  interval?: number;
}

/** نظر برجسته. One large quote at a time; the avatars underneath are the tabs. */
export function TestimonialSpotlight({ eyebrow = "داستان مشتری‌ها", items, interval = 0 }: TestimonialSpotlightProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const base = React.useId();
  const current = items[index];

  React.useEffect(() => {
    if (!interval || paused || items.length < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), interval * 1000);
    return () => window.clearTimeout(id);
  }, [interval, paused, index, items.length]);

  function onKeyDown(e: React.KeyboardEvent) {
    // RTL: the next person sits to the left.
    const delta = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + items.length) % items.length;
    setIndex(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  }

  if (!current) return null;
  return (
    <section className="px-6 py-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-brand">{eyebrow}</p>
        <figure id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${index}`} key={index} className="mt-6 motion-safe:animate-[spotlight-in_.4s_ease-out]">
          <blockquote className="text-2xl font-medium leading-[1.9] sm:text-3xl sm:leading-[1.8]">«{current.quote}»</blockquote>
          {current.metric && (
            <p className="mt-8 inline-flex items-baseline gap-2 rounded-full border border-border px-4 py-1.5 text-sm">
              <span className="text-lg font-bold text-brand">{current.metric.value}</span>
              <span className="text-muted-foreground">{current.metric.label}</span>
            </p>
          )}
          <figcaption className="mt-6">
            <p className="font-semibold">{current.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{current.role}</p>
          </figcaption>
        </figure>
        <div role="tablist" aria-label="مشتری‌ها" className="mt-8 flex items-center justify-center gap-3" onKeyDown={onKeyDown}>
          {items.map((t, i) => (
            <button
              key={t.name}
              id={`${base}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls={`${base}-panel`}
              aria-label={t.name}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn("cursor-pointer rounded-full p-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", i === index ? "ring-2 ring-foreground" : "opacity-50 hover:opacity-100")}
            >
              <Avatar name={t.name} />
            </button>
          ))}
        </div>
      </div>
      <style>{"@keyframes spotlight-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}"}</style>
    </section>
  );
}
