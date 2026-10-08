"use client";

import * as React from "react";
import { compactFa, extent, fullFa, linearScale, niceTicks, textWidth } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Label, Legend, ValueGrid, announceRows, colorAt, num, plotBox, useActive, useHidden, type Reference, type Row, type ValueFormat } from "@/registry/charts/chart-core";

export interface ScatterChartProps {
  data: Row[];
  /** Numeric field on the horizontal axis (grows right to left). */
  x: string;
  /** Numeric field on the vertical axis. */
  y: string;
  /** Optional numeric field that sets bubble area. */
  size?: string;
  /** Optional field that groups points into colours and legend entries. */
  group?: string;
  /** Field shown as the tooltip title, e.g. a product or city name. */
  name?: string;
  title: string;
  description?: string;
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
  height?: number;
  xFormat?: ValueFormat;
  yFormat?: ValueFormat;
  sizeFormat?: ValueFormat;
  /** Vertical / horizontal reference lines, e.g. the averages that split a quadrant chart. */
  xReferences?: Reference[];
  yReferences?: Reference[];
  legend?: boolean;
  animate?: boolean;
  onSelect?: (row: Row, index: number) => void;
  className?: string;
}

/**
 * نمودار پراکندگی و حبابی. Origin at the bottom-right like every chart here:
 * x grows to the left, y grows up, the optional third value sets bubble area.
 */
export function ScatterChart({
  data,
  x,
  y,
  size,
  group,
  name,
  title,
  description,
  xLabel,
  yLabel,
  sizeLabel = "اندازه",
  height = 300,
  xFormat = compactFa,
  yFormat = compactFa,
  sizeFormat = (n) => fullFa(n),
  xReferences,
  yReferences,
  legend,
  animate = true,
  onSelect,
  className,
}: ScatterChartProps) {
  const groups = React.useMemo(() => (group ? Array.from(new Set(data.map((r) => String(r[group])))) : ["all"]), [data, group]);
  const groupSeries = groups.map((g, i) => ({ key: g, label: g, color: colorAt(i) }));
  const { hidden, toggle } = useHidden(groupSeries);
  const pts = data
    .map((r, i) => ({ r, i, xv: num(r, x), yv: num(r, y), sv: size ? num(r, size) ?? 0 : 0, g: group ? String(r[group]) : "all" }))
    .filter((p) => p.xv !== null && p.yv !== null && !hidden.has(p.g)) as { r: Row; i: number; xv: number; yv: number; sv: number; g: string }[];
  const kb = useActive(pts.length);
  const active = kb.active;
  const xt = niceTicks(...extent(pts.map((p) => p.xv), false), 6);
  const yt = niceTicks(...extent(pts.map((p) => p.yv), false), Math.max(3, Math.floor((height - 40) / 50)));
  const sMax = Math.max(1, ...pts.map((p) => p.sv));
  const colorOf = (g: string) => groupSeries[groups.indexOf(g)]?.color ?? colorAt(0);
  const rowsOf = (p: (typeof pts)[number]) => [
    { key: "x", label: xLabel ?? x, value: xFormat(p.xv) },
    { key: "y", label: yLabel ?? y, value: yFormat(p.yv) },
    ...(size ? [{ key: "s", label: sizeLabel, value: sizeFormat(p.sv) }] : []),
  ];
  const titleOf = (p: (typeof pts)[number]) => (name ? String(p.r[name]) : group ? p.g : "");

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      empty={pts.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null && pts[active] ? announceRows(titleOf(pts[active]), rowsOf(pts[active])) : ""}
      legend={(legend ?? !!group) ? <Legend items={groupSeries} hidden={hidden} onToggle={toggle} /> : undefined}
      table={{ head: [name ?? "", xLabel ?? x, yLabel ?? y, ...(size ? [sizeLabel] : [])], rows: pts.map((p) => [titleOf(p), xFormat(p.xv), yFormat(p.yv), ...(size ? [sizeFormat(p.sv)] : [])]) }}
    >
      {(width) => {
        const box = plotBox(width, height, { yLabels: yt.ticks.map(yFormat), top: 14 });
        box.bottom -= yLabel || xLabel ? 14 : 0;
        const sx = linearScale(xt.domain, [box.right - 4, box.left + 4]);
        const sy = linearScale(yt.domain, [box.bottom, box.top]);
        const maxR = Math.max(10, Math.min(34, (box.right - box.left) / 16));
        const rad = (v: number) => (size ? 3 + Math.sqrt(v / sMax) * maxR : 5);
        const stride = Math.max(1, Math.ceil((xt.ticks.length * Math.max(...xt.ticks.map((t) => textWidth(xFormat(t), 10)))) / (box.right - box.left)));
        const order = pts.map((_, k) => k).sort((a, b) => pts[b].sv - pts[a].sv);
        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <ValueGrid box={box} ticks={yt.ticks} y={sy} format={yFormat} />
              {xt.ticks.map((t, k) => (
                <g key={t}>
                  <line x1={sx(t)} x2={sx(t)} y1={box.top} y2={box.bottom} stroke="var(--border)" strokeOpacity={0.5} strokeDasharray="3 3" />
                  {k % stride === 0 && <Label x={sx(t)} y={box.bottom + 16} size={10}>{xFormat(t)}</Label>}
                </g>
              ))}
              {xLabel && <Label anchor="left" x={box.left} y={height - 2} size={10}>{`← ${xLabel}`}</Label>}
              {yLabel && <Label anchor="right" x={box.right - 2} y={box.top - 4} size={10}>{yLabel}</Label>}
              {xReferences?.map((r, k) => (
                <g key={`x${k}`}>
                  <line x1={sx(r.value)} x2={sx(r.value)} y1={box.top} y2={box.bottom} stroke={r.color ?? "var(--foreground)"} strokeOpacity={0.5} strokeDasharray="6 4" />
                  {r.label && <Label anchor="left" x={sx(r.value) + 4} y={box.top + 10} size={10}>{r.label}</Label>}
                </g>
              ))}
              {yReferences?.map((r, k) => (
                <g key={`y${k}`}>
                  <line x1={box.left} x2={box.right} y1={sy(r.value)} y2={sy(r.value)} stroke={r.color ?? "var(--foreground)"} strokeOpacity={0.5} strokeDasharray="6 4" />
                  {r.label && <Label anchor="left" x={box.left + 2} y={sy(r.value) - 5} size={10}>{r.label}</Label>}
                </g>
              ))}
              <g className={animate ? "vf-fade" : undefined}>
                {order.map((k) => {
                  const p = pts[k];
                  const on = active === k;
                  const c = colorOf(p.g);
                  return (
                    <circle
                      key={p.i}
                      cx={sx(p.xv)}
                      cy={sy(p.yv)}
                      r={rad(p.sv) + (on ? 2 : 0)}
                      fill={c}
                      fillOpacity={active === null ? (size ? 0.55 : 0.8) : on ? 0.95 : 0.25}
                      stroke={on ? "var(--foreground)" : c}
                      strokeWidth={on ? 2 : 1}
                      className="vf-mark"
                      style={{ cursor: onSelect ? "pointer" : undefined }}
                      onPointerEnter={() => kb.setActive(k)}
                      onClick={() => onSelect?.(p.r, p.i)}
                    />
                  );
                })}
              </g>
            </svg>
            {active !== null && pts[active] && (
              <ChartTooltip width={width} state={{ x: sx(pts[active].xv), y: sy(pts[active].yv), title: titleOf(pts[active]) || undefined, rows: rowsOf(pts[active]) }} />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
