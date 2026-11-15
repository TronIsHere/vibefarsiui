"use client";

import * as React from "react";
import { fullFa, percentFa } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, announceRows, colorAt, type ValueFormat } from "@/registry/charts/chart-core";
import { cn } from "@/lib/utils";

/**
 * Tile positions [column west→east, row north→south]. Each province is one equal tile placed
 * near where it really is, so Tehran and Sistan-Baluchestan weigh the same: the map shows
 * the numbers, not the land area. Geography is never mirrored for RTL; east stays on the right.
 */
export const IRAN_TILES: Record<string, [number, number]> = {
  "آذربایجان غربی": [0, 0], "آذربایجان شرقی": [1, 0], "اردبیل": [2, 0], "گیلان": [3, 0], "مازندران": [4, 0], "گلستان": [5, 0], "خراسان شمالی": [6, 0],
  "کردستان": [0, 1], "زنجان": [1, 1], "قزوین": [2, 1], "البرز": [3, 1], "تهران": [4, 1], "سمنان": [5, 1], "خراسان رضوی": [6, 1],
  "کرمانشاه": [0, 2], "همدان": [1, 2], "مرکزی": [2, 2], "قم": [3, 2], "اصفهان": [4, 2], "یزد": [5, 2], "خراسان جنوبی": [6, 2],
  "ایلام": [0, 3], "لرستان": [1, 3], "چهارمحال و بختیاری": [2, 3], "کهگیلویه و بویراحمد": [3, 3], "فارس": [4, 3], "کرمان": [5, 3], "سیستان و بلوچستان": [6, 3],
  "خوزستان": [1, 4], "بوشهر": [3, 4], "هرمزگان": [5, 4],
};

/** Short names for narrow tiles. */
export const IRAN_SHORT: Record<string, string> = {
  "آذربایجان غربی": "آذ. غربی", "آذربایجان شرقی": "آذ. شرقی", "خراسان شمالی": "خ. شمالی", "خراسان رضوی": "خ. رضوی", "خراسان جنوبی": "خ. جنوبی",
  "چهارمحال و بختیاری": "چهارمحال", "کهگیلویه و بویراحمد": "کهگیلویه", "سیستان و بلوچستان": "سیستان",
};

const COLS = 7;
const ROWS = 5;

export type ProvinceDatum = { province: string; value: number };

export interface IranMapChartProps {
  data: ProvinceDatum[];
  title: string;
  description?: string;
  format?: ValueFormat;
  /** Number of color steps in the legend. */
  steps?: number;
  color?: string;
  /** Unit after the legend numbers, e.g. «سفارش». */
  unit?: string;
  onSelect?: (province: string, value: number | null) => void;
  className?: string;
}

/** Visit order for the keyboard: north to south, and east to west inside a row (reading order). */
const KEY_ORDER = Object.entries(IRAN_TILES)
  .sort(([, a], [, b]) => a[1] - b[1] || b[0] - a[0])
  .map(([name]) => name);

/**
 * نقشه‌ی استان‌ها. A tile-grid choropleth of Iran's 31 provinces: each tile is shaded by
 * its value in equal steps, with a stepped legend, tooltip, keyboard navigation and a
 * hidden table. Provinces without data are drawn hatched, never as zero.
 */
export function IranMapChart({ data, title, description, format = (n) => fullFa(n), steps = 5, color = colorAt(0), unit, onSelect, className }: IranMapChartProps) {
  const values = React.useMemo(() => new Map(data.map((d) => [d.province, d.value])), [data]);
  const [active, setActive] = React.useState<string | null>(null);
  const known = data.filter((d) => IRAN_TILES[d.province]);
  const min = known.length ? Math.min(...known.map((d) => d.value)) : 0;
  const max = known.length ? Math.max(...known.map((d) => d.value)) : 1;
  const total = known.reduce((s, d) => s + d.value, 0);
  const step = (v: number) => (max === min ? steps - 1 : Math.min(steps - 1, Math.floor(((v - min) / (max - min)) * steps)));
  const shade = (k: number) => `color-mix(in oklab, ${color} ${Math.round(18 + (k / Math.max(1, steps - 1)) * 82)}%, var(--card))`;

  const rows = (name: string) => {
    const v = values.get(name);
    return v === undefined
      ? [{ key: "n", label: "مقدار", value: "داده‌ای ثبت نشده" }]
      : [{ key: "v", label: unit ?? "مقدار", value: format(v), color: shade(step(v)) }, { key: "s", label: "سهم از کل", value: percentFa((v / (total || 1)) * 100, 1) }];
  };

  function onKeyDown(e: React.KeyboardEvent) {
    const i = active ? KEY_ORDER.indexOf(active) : -1;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.min(KEY_ORDER.length - 1, i + 1);
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.max(0, i < 0 ? 0 : i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = KEY_ORDER.length - 1;
    else if (e.key === "Escape") { setActive(null); return; }
    else if (e.key === "Enter" && active) { onSelect?.(active, values.get(active) ?? null); return; }
    if (next !== null) { e.preventDefault(); setActive(KEY_ORDER[next]); }
  }

  const legend = (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span>{format(min)}</span>
        <span className="flex overflow-hidden rounded-[3px]">{Array.from({ length: steps }, (_, k) => <span key={k} className="h-2.5 w-6" style={{ background: shade(k) }} />)}</span>
        <span>{format(max)}</span>
        {unit && <span>{unit}</span>}
      </div>
      <span className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-[3px] border border-border" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--border) 0 2px, transparent 2px 5px)" }} />بدون داده</span>
    </div>
  );

  return (
    <ChartFrame
      title={title}
      description={description}
      height={0}
      autoHeight={(w) => (w / COLS) * ROWS * 0.82}
      className={className}
      empty={data.length === 0}
      keyboard={{ onKeyDown, onBlur: () => setActive(null) }}
      onPointerLeave={() => setActive(null)}
      legend={legend}
      legendPosition="bottom"
      announce={active ? announceRows(active, rows(active)) : ""}
      table={{ head: ["استان", unit ?? "مقدار", "سهم از کل"], rows: Object.keys(IRAN_TILES).map((p) => { const v = values.get(p); return [p, v === undefined ? "—" : format(v), v === undefined ? "—" : percentFa((v / (total || 1)) * 100, 1)]; }) }}
    >
      {(width) => {
        const gap = Math.max(3, width * 0.008);
        const cellW = (width - gap * (COLS - 1)) / COLS;
        const cellH = cellW * 0.82 - gap * 0.18;
        const narrow = cellW < 92;
        const pos = (name: string) => { const [c, r] = IRAN_TILES[name]; return { left: c * (cellW + gap), top: r * (cellH + gap) }; };
        return (
          <>
            {/* The map keeps compass order (east on the right) whatever the page direction. */}
            <div dir="ltr" className="absolute inset-0" aria-hidden>
              {Object.keys(IRAN_TILES).map((name) => {
                const v = values.get(name);
                const k = v === undefined ? -1 : step(v);
                const on = active === name;
                const dark = k >= Math.ceil(steps / 2);
                const { left, top } = pos(name);
                return (
                  <div
                    key={name}
                    onPointerEnter={() => setActive(name)}
                    onClick={() => onSelect?.(name, v ?? null)}
                    dir="rtl"
                    className={cn("vf-mark absolute flex flex-col items-center justify-center rounded-md border px-1 text-center leading-tight transition-[opacity,box-shadow]", onSelect && "cursor-pointer", on ? "z-10 border-foreground shadow-[0_0_0_1px_var(--foreground)]" : "border-transparent", active && !on && "opacity-60")}
                    style={{ left, top, width: cellW, height: cellH, background: k < 0 ? "repeating-linear-gradient(45deg, var(--border) 0 2px, transparent 2px 6px)" : shade(k), color: dark ? "var(--primary-foreground, white)" : "var(--foreground)" }}
                  >
                    <span className="truncate font-medium" style={{ fontSize: narrow ? 10 : 12, maxWidth: "100%" }}>{narrow ? IRAN_SHORT[name] ?? name : name}</span>
                    {v !== undefined && cellH > 38 && <span className="mt-0.5 tabular-nums opacity-80" style={{ fontSize: narrow ? 9 : 11 }}>{format(v)}</span>}
                  </div>
                );
              })}
            </div>
            {active && <ChartTooltip width={width} state={{ x: pos(active).left + cellW / 2, y: pos(active).top + cellH / 2, title: active, rows: rows(active) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}

/** Edges of each legend step, for building your own legend or a table. */
export function iranMapSteps(values: number[], steps = 5) {
  const min = Math.min(...values), max = Math.max(...values);
  return Array.from({ length: steps + 1 }, (_, i) => min + ((max - min) * i) / steps);
}
