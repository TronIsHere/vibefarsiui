"use client";

import * as React from "react";
import { fullFa, niceTicks, polar } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Label, Legend, announceRows, colorAt, num, useActive, useHidden, type Row, type Series, type ValueFormat } from "@/registry/charts/chart-core";

export interface RadarChartProps {
  data: Row[];
  /** Field with each axis name, e.g. «سرعت». */
  axis: string;
  series: Series[];
  title: string;
  description?: string;
  size?: number;
  /** Fixed outer value; default is a round number above the data. */
  max?: number;
  /** Grid shape: polygon rings or circles. */
  grid?: "polygon" | "circle";
  /** Number of grid rings. */
  levels?: number;
  format?: ValueFormat;
  legend?: boolean;
  animate?: boolean;
  className?: string;
}

/**
 * نمودار راداری. Compares several series over the same axes (product specs,
 * skill profiles). The first axis points up and the rest follow clockwise.
 */
export function RadarChart({
  data,
  axis,
  series,
  title,
  description,
  size = 280,
  max,
  grid = "polygon",
  levels = 4,
  format = (n) => fullFa(n, 1),
  legend = series.length > 1,
  animate = true,
  className,
}: RadarChartProps) {
  const { hidden, toggle } = useHidden(series);
  const kb = useActive(data.length);
  const active = kb.active;
  const all = series.map((s, i) => ({ ...s, color: colorAt(i, s.color) }));
  const visible = all.filter((s) => !hidden.has(s.key));
  const values = visible.flatMap((s) => data.map((r) => num(r, s.key) ?? 0));
  const top = max ?? niceTicks(0, Math.max(1, ...values), levels + 1).domain[1];
  const n = data.length;
  const angle = (i: number) => (i / n) * Math.PI * 2;
  const rowsAt = (i: number) => visible.map((s) => ({ key: s.key, label: s.label, color: s.color, value: format(num(data[i], s.key) ?? 0) }));
  const h = size + 40;

  return (
    <ChartFrame
      title={title}
      description={description}
      height={h}
      className={className}
      empty={n < 3}
      emptyText="نمودار راداری دست‌کم سه محور لازم داره"
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(String(data[active][axis]), rowsAt(active)) : ""}
      legendPosition="bottom"
      legend={legend ? <Legend className="justify-center" items={all} hidden={hidden} onToggle={toggle} /> : undefined}
      table={{ head: ["", ...series.map((s) => s.label)], rows: data.map((r) => [String(r[axis]), ...series.map((s) => format(num(r, s.key) ?? 0))]) }}
    >
      {(width) => {
        const cx = width / 2, cy = h / 2, R = size / 2 - 8;
        const ring = (f: number) =>
          grid === "circle" ? null : data.map((_, i) => polar(cx, cy, R * f, angle(i)).join(",")).join(" ");
        return (
          <>
            <svg width={width} height={h} className="block overflow-visible" aria-hidden>
              {Array.from({ length: levels }, (_, k) => {
                const f = (k + 1) / levels;
                return grid === "circle" ? (
                  <circle key={k} cx={cx} cy={cy} r={R * f} fill="none" stroke="var(--border)" />
                ) : (
                  <polygon key={k} points={ring(f)!} fill={k === levels - 1 ? "var(--foreground)" : "none"} fillOpacity={0.02} stroke="var(--border)" />
                );
              })}
              {data.map((r, i) => {
                const [x2, y2] = polar(cx, cy, R, angle(i));
                const [lx, ly] = polar(cx, cy, R + 16, angle(i));
                const s = Math.sin(angle(i));
                return (
                  <g key={i} onPointerEnter={() => kb.setActive(i)}>
                    <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="var(--border)" />
                    <Label x={lx} y={ly} dy="0.35em" anchor={Math.abs(s) < 0.2 ? "middle" : s > 0 ? "left" : "right"} size={11} muted={active !== i} fontWeight={active === i ? 600 : undefined}>
                      {String(r[axis])}
                    </Label>
                    <circle cx={x2} cy={y2} r={14} fill="transparent" />
                  </g>
                );
              })}
              {Array.from({ length: levels }, (_, k) => (
                <Label key={k} anchor="right" x={cx - 5} y={cy - (R * (k + 1)) / levels} dy="0.35em" size={9}>
                  {format((top * (k + 1)) / levels)}
                </Label>
              ))}
              {visible.map((s) => {
                const pts = data.map((r, i) => polar(cx, cy, (R * Math.min(top, Math.max(0, num(r, s.key) ?? 0))) / top, angle(i)));
                return (
                  <g key={s.key} className={animate ? "vf-pop" : undefined}>
                    <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={s.color} fillOpacity={0.16} stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeDasharray={s.dashed ? "5 4" : undefined} />
                    {pts.map(([px, py], i) => (
                      <circle key={i} cx={px} cy={py} r={active === i ? 4.5 : 2.5} fill={active === i ? "var(--background)" : s.color} stroke={s.color} strokeWidth={2} />
                    ))}
                  </g>
                );
              })}
            </svg>
            {active !== null && (() => {
              const [tx, ty] = polar(cx, cy, R * 0.55, angle(active));
              return <ChartTooltip width={width} state={{ x: tx, y: ty, title: String(data[active][axis]), rows: rowsAt(active) }} />;
            })()}
          </>
        );
      }}
    </ChartFrame>
  );
}
