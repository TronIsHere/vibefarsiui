"use client";

import * as React from "react";
import { fullFa, percentFa, textWidth } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Label, announceRows, colorAt, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type BulletRow = {
  label: string;
  /** Small line under the label, e.g. «میلیون تومان». */
  sublabel?: string;
  value: number;
  /** The goal; drawn as a vertical tick. */
  target?: number;
  /** Ascending band edges from poor to good, e.g. [60, 85, 100]. The last one is the scale max unless `max` is set. */
  ranges?: number[];
  max?: number;
};

export interface BulletChartProps {
  data: BulletRow[];
  title: string;
  description?: string;
  format?: ValueFormat;
  /** Row height in px. */
  row?: number;
  color?: string;
  /** Names of the bands for the tooltip, poor to good. */
  rangeLabels?: string[];
  animate?: boolean;
  className?: string;
}

/**
 * نمودار گلوله‌ای. A compact KPI bar: the measure, a target tick and qualitative bands
 * behind it. Bars start at the labels on the right and grow leftward.
 */
export function BulletChart({ data, title, description, format = (n) => fullFa(n), row = 34, color = colorAt(0), rangeLabels = ["ضعیف", "قابل قبول", "خوب"], animate = true, className }: BulletChartProps) {
  const kb = useActive(data.length);
  const active = kb.active;
  const gap = 14;
  const h = data.length * row + Math.max(0, data.length - 1) * gap;
  const maxOf = (d: BulletRow) => d.max ?? Math.max(d.value, d.target ?? 0, ...(d.ranges ?? [0])) * (d.ranges?.length ? 1 : 1.15);
  const band = (d: BulletRow) => {
    const i = (d.ranges ?? []).findIndex((r) => d.value <= r);
    return i < 0 ? undefined : rangeLabels[i];
  };
  const rows = (i: number) => {
    const d = data[i];
    return [
      { key: "v", label: "مقدار", value: format(d.value), color },
      ...(d.target !== undefined ? [{ key: "t", label: "هدف", value: format(d.target) }, { key: "p", label: "تحقق هدف", value: percentFa((d.value / (d.target || 1)) * 100) }] : []),
      ...(band(d) ? [{ key: "b", label: "وضعیت", value: band(d)! }] : []),
    ];
  };

  return (
    <ChartFrame
      title={title}
      description={description}
      height={h}
      className={className}
      empty={data.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(data[active].label, rows(active)) : ""}
      table={{ head: ["شاخص", "مقدار", "هدف", "درصد هدف"], rows: data.map((d) => [d.label, format(d.value), d.target !== undefined ? format(d.target) : "—", d.target ? percentFa((d.value / d.target) * 100) : "—"]) }}
    >
      {(width) => {
        const labelW = Math.min(width * 0.32, Math.max(...data.map((d) => Math.max(textWidth(d.label, 12), textWidth(d.sublabel ?? "", 10)))) + 16);
        const valueW = Math.min(width * 0.18, Math.max(...data.map((d) => textWidth(format(d.value), 12))) + 12);
        const right = width - labelW;
        const left = valueW;
        const span = Math.max(10, right - left);
        const y = (i: number) => i * (row + gap);
        return (
          <>
            <svg width={width} height={h} className="block overflow-visible" aria-hidden>
              {data.map((d, i) => {
                const max = maxOf(d) || 1;
                const px = (v: number) => (Math.max(0, Math.min(max, v)) / max) * span;
                const on = active === i;
                const ranges = d.ranges ?? [max];
                const barH = row * 0.36;
                return (
                  <g key={d.label} onPointerEnter={() => kb.setActive(i)} opacity={active === null || on ? 1 : 0.55} className="vf-mark">
                    {ranges.map((r, k) => {
                      const from = k === 0 ? 0 : ranges[k - 1];
                      return <rect key={k} x={right - px(r)} y={y(i)} width={px(r) - px(from)} height={row} fill="var(--foreground)" fillOpacity={0.05 + (ranges.length - 1 - k) * 0.05} rx={k === ranges.length - 1 ? 4 : 0} />;
                    })}
                    <rect
                      x={right - px(d.value)}
                      y={y(i) + (row - barH) / 2}
                      width={px(d.value)}
                      height={barH}
                      rx={2}
                      fill={color}
                      className={animate ? "vf-grow" : undefined}
                      style={animate ? ({ transformOrigin: "right", "--vf-sx": 0, "--vf-sy": 1 } as React.CSSProperties) : undefined}
                    />
                    {d.target !== undefined && <rect x={right - px(d.target) - 1.5} y={y(i) + row * 0.16} width={3} height={row * 0.68} rx={1} fill="var(--foreground)" />}
                    <Label anchor="right" x={width - 2} y={y(i) + (d.sublabel ? row / 2 - 6 : row / 2)} dy="0.35em" size={12} muted={!on} fontWeight={on ? 600 : 500}>{d.label}</Label>
                    {d.sublabel && <Label anchor="right" x={width - 2} y={y(i) + row / 2 + 9} dy="0.35em" size={10}>{d.sublabel}</Label>}
                    <Label anchor="left" x={2} y={y(i) + row / 2} dy="0.35em" size={12} muted={false} fontWeight={600}>{format(d.value)}</Label>
                  </g>
                );
              })}
            </svg>
            {active !== null && <ChartTooltip width={width} state={{ x: right - ((Math.min(maxOf(data[active]), data[active].value) / (maxOf(data[active]) || 1)) * span), y: y(active) + row / 2, title: data[active].label, rows: rows(active) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
