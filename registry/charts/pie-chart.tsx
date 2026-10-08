"use client";

import * as React from "react";
import { arcPath, fullFa, percentFa, polar } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Label, Legend, announceRows, colorAt, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type Slice = { label: string; value: number; color?: string };

export interface PieChartProps {
  data: Slice[];
  title: string;
  description?: string;
  /** "donut" leaves room for a total in the middle. */
  variant?: "pie" | "donut";
  /** Diameter in px; the chart is centred in its box. */
  size?: number;
  format?: ValueFormat;
  /** Text under the number in the donut hole. Default «جمع». */
  centerLabel?: string;
  /** Number in the hole. Default: the sum of all slices. */
  centerValue?: string;
  /** Slices under this share (%) merge into «سایر». 0 keeps them all. */
  minShare?: number;
  /** Largest first; turn off to keep your own order. */
  sort?: boolean;
  /** Write the percentage on slices big enough to hold it. */
  showPercent?: boolean;
  legend?: boolean;
  animate?: boolean;
  onSelect?: (slice: Slice, index: number) => void;
  className?: string;
}

/**
 * نمودار دایره‌ای و دونات. Slices start at 12 o'clock, the hovered slice
 * slides out, small ones fold into «سایر», and the legend lists value and share.
 */
export function PieChart({
  data,
  title,
  description,
  variant = "donut",
  size = 220,
  format = (n) => fullFa(n),
  centerLabel = "جمع",
  centerValue,
  minShare = 0,
  sort = true,
  showPercent = variant === "pie",
  legend = true,
  animate = true,
  onSelect,
  className,
}: PieChartProps) {
  const slices = React.useMemo(() => {
    const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
    let list = data.map((d, i) => ({ ...d, color: colorAt(i, d.color) })).filter((d) => d.value > 0);
    if (sort) list = [...list].sort((a, b) => b.value - a.value);
    if (minShare > 0) {
      const small = list.filter((d) => (d.value / total) * 100 < minShare);
      if (small.length > 1) {
        list = list.filter((d) => !small.includes(d));
        list.push({ label: "سایر", value: small.reduce((s, d) => s + d.value, 0), color: "var(--chart-other, var(--muted-foreground))" });
      }
    }
    return { list, total };
  }, [data, sort, minShare]);

  const kb = useActive(slices.list.length);
  const active = kb.active;
  const { list, total } = slices;
  const share = (v: number) => (v / total) * 100;
  const row = (i: number) => [{ key: "v", label: list[i].label, color: list[i].color, value: `${format(list[i].value)} · ${percentFa(share(list[i].value), 1)}` }];
  const pad = 10;
  const h = size + pad * 2;

  return (
    <ChartFrame
      title={title}
      description={description}
      height={h}
      className={className}
      empty={list.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows("", row(active)) : ""}
      legendPosition="bottom"
      legend={
        legend ? (
          <Legend className="justify-center" items={list.map((d, i) => ({ key: String(i), label: d.label, color: d.color, value: percentFa(share(d.value)) }))} />
        ) : undefined
      }
      table={{ head: ["", "مقدار", "سهم"], rows: list.map((d) => [d.label, format(d.value), percentFa(share(d.value), 1)]) }}
    >
      {(width) => {
        const cx = width / 2, cy = h / 2, r = size / 2;
        const inner = variant === "donut" ? r * 0.62 : 0;
        let a = 0;
        const arcs = list.map((d) => {
          const sweep = (d.value / total) * Math.PI * 2;
          const arc = { a0: a, a1: a + sweep, mid: a + sweep / 2 };
          a += sweep;
          return arc;
        });
        const gap = list.length > 1 ? 0.012 : 0;
        return (
          <>
            <svg width={width} height={h} className="block overflow-visible" aria-hidden>
              <g className={animate ? "vf-pop" : undefined}>
                {list.map((d, i) => {
                  const { a0, a1, mid } = arcs[i];
                  const on = active === i;
                  const [dx, dy] = on ? polar(0, 0, 6, mid) : [0, 0];
                  return (
                    <path
                      key={i}
                      d={arcPath(cx, cy, inner, r, a0 + gap, a1 - gap)}
                      fill={d.color}
                      fillOpacity={active === null || on ? 1 : 0.45}
                      transform={`translate(${dx} ${dy})`}
                      className="vf-mark"
                      style={{ cursor: onSelect ? "pointer" : undefined, transition: "transform var(--motion,200ms) var(--vf-ease), fill-opacity var(--motion,200ms)" }}
                      onPointerEnter={() => kb.setActive(i)}
                      onClick={() => onSelect?.(list[i], i)}
                    />
                  );
                })}
                {showPercent &&
                  list.map((d, i) => {
                    const { a0, a1, mid } = arcs[i];
                    if (a1 - a0 < 0.35) return null;
                    const [lx, ly] = polar(cx, cy, inner ? (inner + r) / 2 : r * 0.64, mid);
                    return (
                      <Label key={i} x={lx} y={ly} dy="0.35em" size={11} muted={false} fill="var(--background)" fontWeight={600} pointerEvents="none">
                        {percentFa(share(d.value))}
                      </Label>
                    );
                  })}
              </g>
              {variant === "donut" && (
                <g pointerEvents="none">
                  <Label x={cx} y={cy - 2} size={Math.max(14, Math.min(22, inner / 3.2))} muted={false} fontWeight={700}>
                    {active !== null ? percentFa(share(list[active].value), 1) : (centerValue ?? format(total))}
                  </Label>
                  <Label x={cx} y={cy + 18} size={11}>
                    {active !== null ? list[active].label : centerLabel}
                  </Label>
                </g>
              )}
            </svg>
            {active !== null && variant === "pie" && (
              <ChartTooltip width={width} state={{ x: polar(cx, cy, r * 0.7, arcs[active].mid)[0], y: polar(cx, cy, r * 0.7, arcs[active].mid)[1], rows: row(active) }} />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
