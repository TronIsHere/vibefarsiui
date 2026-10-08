"use client";

import * as React from "react";
import { fullFa, percentFa, squarify, textWidth } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Legend, announceRows, colorAt, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type TreemapItem = { label: string; value: number; group?: string; color?: string };

export interface TreemapChartProps {
  data: TreemapItem[];
  title: string;
  description?: string;
  height?: number;
  format?: ValueFormat;
  /** Colour by `group` (with a legend) instead of one colour per item. */
  colorBy?: "item" | "group";
  animate?: boolean;
  onSelect?: (item: TreemapItem, index: number) => void;
  className?: string;
}

/**
 * نقشه‌ی درختی. Area is proportional to value (squarified layout). The largest
 * tile lands top-right where Persian reading starts; labels show only when they fit.
 */
export function TreemapChart({ data, title, description, height = 300, format = (n) => fullFa(n), colorBy = data.some((d) => d.group) ? "group" : "item", animate = true, onSelect, className }: TreemapChartProps) {
  const kb = useActive(data.length);
  const active = kb.active;
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1;
  const groups = Array.from(new Set(data.map((d) => d.group ?? "")));
  const colorOf = (d: TreemapItem, i: number) => d.color ?? (colorBy === "group" ? colorAt(groups.indexOf(d.group ?? "")) : colorAt(i));
  const rows = (i: number) => [
    { key: "v", label: "مقدار", value: format(data[i].value), color: colorOf(data[i], i) },
    { key: "s", label: "سهم", value: percentFa((data[i].value / total) * 100, 1) },
    ...(data[i].group ? [{ key: "g", label: "گروه", value: data[i].group! }] : []),
  ];

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      empty={data.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(data[active].label, rows(active)) : ""}
      legend={colorBy === "group" && groups.length > 1 ? <Legend items={groups.map((g, i) => ({ key: g, label: g, color: colorAt(i) }))} /> : undefined}
      table={{ head: ["", "مقدار", "سهم"], rows: data.map((d) => [d.label, format(d.value), percentFa((d.value / total) * 100, 1)]) }}
    >
      {(width) => {
        const rects = squarify(data.map((d) => d.value), { x: 0, y: 0, w: width, h: height });
        return (
          <>
            <svg width={width} height={height} className="block" aria-hidden>
              {data.map((d, i) => {
                const r = rects[i];
                if (!r || r.w < 1 || r.h < 1) return null;
                const on = active === i;
                const fits = r.w > textWidth(d.label, 12) + 12 && r.h > 38;
                const tiny = !fits && r.w > textWidth(d.label, 10) + 8 && r.h > 18;
                return (
                  <g key={i} onPointerEnter={() => kb.setActive(i)} onClick={() => onSelect?.(d, i)} style={{ cursor: onSelect ? "pointer" : undefined }} className={animate ? "vf-fade" : undefined}>
                    <rect
                      x={r.x + 1}
                      y={r.y + 1}
                      width={Math.max(0, r.w - 2)}
                      height={Math.max(0, r.h - 2)}
                      rx={6}
                      fill={colorOf(d, i)}
                      fillOpacity={active === null ? 0.85 : on ? 1 : 0.45}
                      stroke={on ? "var(--foreground)" : "none"}
                      strokeWidth={2}
                      className="vf-mark"
                    />
                    {(fits || tiny) && (
                      <text direction="rtl" textAnchor="start" x={r.x + r.w - 8} y={r.y + (fits ? 20 : r.h / 2 + 4)} fontSize={fits ? 12 : 10} fontWeight={600} fill="var(--background)" pointerEvents="none">
                        {d.label}
                      </text>
                    )}
                    {fits && (
                      <text direction="rtl" textAnchor="start" x={r.x + r.w - 8} y={r.y + 36} fontSize={11} fill="var(--background)" fillOpacity={0.85} pointerEvents="none">
                        {percentFa((d.value / total) * 100, 1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            {active !== null && rects[active] && <ChartTooltip width={width} state={{ x: rects[active].x + rects[active].w / 2, y: rects[active].y + rects[active].h / 2, title: data[active].label, rows: rows(active) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
