"use client";

import * as React from "react";
import { fullFa, percentFa, textWidth } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Label, announceRows, colorAt, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type FunnelStep = { label: string; value: number };

export interface FunnelChartProps {
  data: FunnelStep[];
  title: string;
  description?: string;
  format?: ValueFormat;
  /** Row height in px. */
  row?: number;
  color?: string;
  /** "centered" funnel or "aligned" bars that start from the label edge. */
  shape?: "centered" | "aligned";
  animate?: boolean;
  onSelect?: (step: FunnelStep, index: number) => void;
  className?: string;
}

/**
 * نمودار قیف. Conversion through steps (visit → cart → pay). Each row shows its
 * count and share of the first step, and the gap between rows shows the
 * step-to-step conversion and drop-off.
 */
export function FunnelChart({ data, title, description, format = (n) => fullFa(n), row = 44, color = colorAt(0), shape = "centered", animate = true, onSelect, className }: FunnelChartProps) {
  const kb = useActive(data.length);
  const active = kb.active;
  const first = data[0]?.value || 1;
  const conv = (i: number) => (i === 0 ? 100 : (data[i].value / (data[i - 1].value || 1)) * 100);
  const rows = (i: number) => [
    { key: "v", label: "تعداد", value: format(data[i].value) },
    { key: "a", label: "از مرحله‌ی اول", value: percentFa((data[i].value / first) * 100, 1) },
    ...(i > 0 ? [{ key: "c", label: "از مرحله‌ی قبل", value: percentFa(conv(i), 1) }, { key: "d", label: "ریزش", value: format(data[i - 1].value - data[i].value) }] : []),
  ];
  const gapH = 18;
  const h = data.length * row + (data.length - 1) * gapH;

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
      table={{ head: ["مرحله", "تعداد", "از مرحله‌ی اول", "از مرحله‌ی قبل"], rows: data.map((d, i) => [d.label, format(d.value), percentFa((d.value / first) * 100, 1), i ? percentFa(conv(i), 1) : "—"]) }}
    >
      {(width) => {
        const labelW = Math.min(width * 0.3, Math.max(...data.map((d) => textWidth(d.label, 12))) + 14);
        const valueW = Math.min(width * 0.25, Math.max(...data.map((d) => textWidth(format(d.value), 12))) + 50);
        const right = width - labelW, left = valueW;
        const span = right - left;
        const y = (i: number) => i * (row + gapH);
        const wOf = (v: number) => Math.max(4, (v / first) * span);
        const xOf = (v: number) => (shape === "centered" ? left + (span - wOf(v)) / 2 : right - wOf(v));
        return (
          <>
            <svg width={width} height={h} className="block overflow-visible" aria-hidden>
              {data.map((d, i) => {
                const on = active === i;
                const x0 = xOf(d.value), w = wOf(d.value);
                const next = data[i + 1];
                return (
                  <g key={i} onPointerEnter={() => kb.setActive(i)} onClick={() => onSelect?.(d, i)} style={{ cursor: onSelect ? "pointer" : undefined }}>
                    <rect x={0} y={y(i)} width={width} height={row} fill={on ? "var(--foreground)" : "transparent"} fillOpacity={0.04} rx={6} />
                    <rect
                      x={x0}
                      y={y(i)}
                      width={w}
                      height={row}
                      rx={6}
                      fill={color}
                      fillOpacity={1 - (i / Math.max(1, data.length)) * 0.55}
                      className={animate ? "vf-grow" : undefined}
                      style={animate ? ({ transformOrigin: shape === "centered" ? "center" : "right", "--vf-sx": 0, "--vf-sy": 1 } as React.CSSProperties) : undefined}
                    />
                    {next && (
                      <path
                        d={`M${x0},${y(i) + row} L${x0 + w},${y(i) + row} L${xOf(next.value) + wOf(next.value)},${y(i + 1)} L${xOf(next.value)},${y(i + 1)} Z`}
                        fill={color}
                        fillOpacity={0.12}
                      />
                    )}
                    <Label anchor="right" x={width - 2} y={y(i) + row / 2} dy="0.35em" size={12} muted={!on} fontWeight={on ? 600 : undefined}>
                      {d.label}
                    </Label>
                    <Label anchor="left" x={2} y={y(i) + row / 2 - 7} dy="0.35em" size={12} muted={false} fontWeight={600}>
                      {format(d.value)}
                    </Label>
                    <Label anchor="left" x={2} y={y(i) + row / 2 + 9} dy="0.35em" size={10}>
                      {percentFa((d.value / first) * 100, 1)}
                    </Label>
                    {next && (
                      <Label x={left + span / 2} y={y(i) + row + gapH / 2} dy="0.35em" size={10} muted={false}>
                        {`↓ ${percentFa(conv(i + 1), 1)}`}
                      </Label>
                    )}
                  </g>
                );
              })}
            </svg>
            {active !== null && <ChartTooltip width={width} state={{ x: xOf(data[active].value), y: y(active) + row / 2, title: data[active].label, rows: rows(active) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
