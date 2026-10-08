"use client";

import * as React from "react";
import { arcPath, fullFa, percentFa } from "@/lib/chart-utils";
import { ChartFrame, Label, Legend, announceRows, colorAt, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type Ring = { label: string; value: number; max?: number; color?: string };

export interface RadialChartProps {
  data: Ring[];
  title: string;
  description?: string;
  size?: number;
  /** Total sweep in degrees: 360 for full rings, 270 for an open «C». */
  sweep?: number;
  format?: ValueFormat;
  /** Big number in the middle, e.g. the overall score. */
  centerValue?: string;
  centerLabel?: string;
  legend?: boolean;
  animate?: boolean;
  className?: string;
}

/**
 * نمودار شعاعی. Concentric progress rings, one per metric (goal, quota,
 * storage), each against its own max. Rings fill clockwise from 12 o'clock.
 */
export function RadialChart({
  data,
  title,
  description,
  size = 220,
  sweep = 360,
  format = (n) => fullFa(n),
  centerValue,
  centerLabel,
  legend = true,
  animate = true,
  className,
}: RadialChartProps) {
  const kb = useActive(data.length);
  const active = kb.active;
  const rings = data.map((d, i) => ({ ...d, color: colorAt(i, d.color), max: d.max ?? 100 }));
  const pct = (d: (typeof rings)[number]) => Math.max(0, Math.min(1, d.value / (d.max || 1)));
  const row = (i: number) => [{ key: "v", label: rings[i].label, color: rings[i].color, value: `${format(rings[i].value)} از ${format(rings[i].max)} · ${percentFa(pct(rings[i]) * 100)}` }];
  const span = (Math.min(360, sweep) / 180) * Math.PI;
  const start = -span / 2;
  const h = size + 12;

  return (
    <ChartFrame
      title={title}
      description={description}
      height={h}
      className={className}
      empty={rings.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows("", row(active)) : ""}
      legendPosition="bottom"
      legend={legend ? <Legend className="justify-center" items={rings.map((d, i) => ({ key: String(i), label: d.label, color: d.color, value: percentFa(pct(d) * 100) }))} /> : undefined}
      table={{ head: ["", "مقدار", "سقف", "درصد"], rows: rings.map((d) => [d.label, format(d.value), format(d.max), percentFa(pct(d) * 100)]) }}
    >
      {(width) => {
        const cx = width / 2, cy = h / 2, outer = size / 2;
        const inner = centerValue ? outer * 0.42 : outer * 0.3;
        const step = (outer - inner) / Math.max(1, rings.length);
        const thick = step * 0.72;
        const a0 = sweep >= 360 ? 0 : start;
        return (
          <svg width={width} height={h} className="block overflow-visible" aria-hidden>
            {rings.map((d, i) => {
              const r1 = outer - i * step, r0 = r1 - thick;
              const end = a0 + (sweep >= 360 ? Math.PI * 2 : span) * pct(d);
              const dim = active !== null && active !== i;
              const cap = thick / 2;
              const [ex, ey] = [cx + ((r0 + r1) / 2) * Math.sin(end), cy - ((r0 + r1) / 2) * Math.cos(end)];
              const [sx, sy] = [cx + ((r0 + r1) / 2) * Math.sin(a0), cy - ((r0 + r1) / 2) * Math.cos(a0)];
              return (
                <g key={i} onPointerEnter={() => kb.setActive(i)} opacity={dim ? 0.4 : 1} className="vf-mark">
                  <path d={arcPath(cx, cy, r0, r1, a0, a0 + (sweep >= 360 ? Math.PI * 2 : span))} fill="var(--foreground)" fillOpacity={0.07} />
                  {pct(d) > 0 && (
                    <g className={animate ? "vf-fade" : undefined}>
                      <path d={arcPath(cx, cy, r0, r1, a0, end)} fill={d.color} />
                      <circle cx={sx} cy={sy} r={cap} fill={d.color} />
                      <circle cx={ex} cy={ey} r={cap} fill={d.color} />
                    </g>
                  )}
                </g>
              );
            })}
            {(centerValue || active !== null) && (
              <g pointerEvents="none">
                <Label x={cx} y={cy - 2} size={Math.max(13, inner / 2.6)} muted={false} fontWeight={700}>
                  {active !== null ? percentFa(pct(rings[active]) * 100) : centerValue}
                </Label>
                <Label x={cx} y={cy + 16} size={10}>
                  {active !== null ? rings[active].label : centerLabel}
                </Label>
              </g>
            )}
          </svg>
        );
      }}
    </ChartFrame>
  );
}

export type GaugeBand = { to: number; color: string; label?: string };

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title: string;
  description?: string;
  /** Coloured zones up to each `to`, e.g. bad / ok / good. */
  bands?: GaugeBand[];
  format?: ValueFormat;
  /** Line under the value, e.g. «رضایت مشتری». */
  label?: string;
  size?: number;
  animate?: boolean;
  className?: string;
}

/**
 * گیج. A half circle that reads right to left: the minimum sits on the right
 * end, the maximum on the left, with optional coloured zones and a needle.
 */
export function GaugeChart({ value, min = 0, max = 100, title, description, bands, format = (n) => fullFa(n), label, size = 240, animate = true, className }: GaugeChartProps) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  // Angle 0 = up; +90° = right (min), −90° = left (max).
  const ang = (v: number) => Math.PI / 2 - ((v - min) / (max - min || 1)) * Math.PI;
  const h = size / 2 + 40;
  const zones = bands?.length ? bands : [{ to: max, color: colorAt(0) }];
  const current = zones.find((b) => value <= b.to) ?? zones[zones.length - 1];

  return (
    <ChartFrame
      title={title}
      description={description}
      height={h}
      className={className}
      announce=""
      table={{ head: ["", "مقدار"], rows: [[label ?? title, format(value)], ["کمینه", format(min)], ["بیشینه", format(max)]] }}
    >
      {(width) => {
        const cx = width / 2, cy = size / 2 + 8, r1 = size / 2, r0 = r1 * 0.74;
        let from = min;
        const needle = ang(min + t * (max - min));
        return (
          <svg width={width} height={h} className="block overflow-visible" aria-hidden>
            <path d={arcPath(cx, cy, r0, r1, -Math.PI / 2, Math.PI / 2)} fill="var(--foreground)" fillOpacity={0.07} />
            {zones.map((b, i) => {
              const a = ang(Math.min(max, b.to)), z = ang(from);
              from = b.to;
              return <path key={i} d={arcPath(cx, cy, r1 + 4, r1 + 8, a, z)} fill={b.color} fillOpacity={0.55} />;
            })}
            <path d={arcPath(cx, cy, r0, r1, needle, Math.PI / 2)} fill={current.color} className={animate ? "vf-fade" : undefined} />
            <g
              style={{ transform: `rotate(${(needle * 180) / Math.PI}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "transform calc(var(--motion,200ms)*3) var(--motion-ease,ease)" }}
            >
              <path d={`M${cx - 4},${cy} L${cx},${cy - r0 + 6} L${cx + 4},${cy} Z`} fill="var(--foreground)" />
            </g>
            <circle cx={cx} cy={cy} r={7} fill="var(--background)" stroke="var(--foreground)" strokeWidth={2} />
            <Label anchor="right" x={cx + r1} y={cy + 18} size={10}>{format(min)}</Label>
            <Label anchor="left" x={cx - r1} y={cy + 18} size={10}>{format(max)}</Label>
            <Label x={cx} y={cy - r0 * 0.38} size={Math.max(18, size / 9)} muted={false} fontWeight={700}>
              {format(value)}
            </Label>
            {(label || current.label) && (
              <Label x={cx} y={cy + 24} size={11}>
                {current.label ?? label}
              </Label>
            )}
          </svg>
        );
      }}
    </ChartFrame>
  );
}
