"use client";

import * as React from "react";
import { areaPath, compactFa, fullFa, labelStride, linePath, linearScale, percentFa, pointScale, stackRows, textWidth, type Curve, type Pt, type StackMode } from "@/lib/chart-utils";
import {
  CategoryAxis,
  ChartFrame,
  ChartTooltip,
  Legend,
  References,
  ValueGrid,
  announceRows,
  colorAt,
  defaultLabel,
  num,
  plotBox,
  pointerX,
  useActive,
  useHidden,
  valueTicks,
  type DomainOption,
  type Reference,
  type Row,
  type Series,
  type ValueFormat,
} from "@/registry/charts/chart-core";

export interface AreaChartProps {
  data: Row[];
  x: string;
  series: Series[];
  title: string;
  description?: string;
  height?: number;
  curve?: Curve;
  /** "none" overlaps the areas, "stacked" piles them, "percent" shows each one's share of 100٪. */
  stack?: StackMode;
  format?: ValueFormat;
  axisFormat?: ValueFormat;
  xFormat?: (value: unknown, index: number) => string;
  domain?: DomainOption;
  /** Fill style: soft vertical gradient or flat tint. */
  fill?: "gradient" | "solid";
  references?: Reference[];
  legend?: boolean;
  grid?: boolean;
  yAxis?: boolean;
  xAxis?: boolean;
  animate?: boolean;
  onSelect?: (row: Row, index: number) => void;
  className?: string;
}

/**
 * نمودار ناحیه‌ای. Same RTL geometry as the line chart, with overlap, stacked and
 * 100٪ modes. In stacked modes the tooltip also shows the total.
 */
export function AreaChart({
  data,
  x,
  series,
  title,
  description,
  height = 260,
  curve = "monotone",
  stack = "none",
  format = (n) => fullFa(n, 2),
  axisFormat,
  xFormat = defaultLabel,
  domain = "zero",
  fill = "gradient",
  references,
  legend = series.length > 1,
  grid = true,
  yAxis = true,
  xAxis = true,
  animate = true,
  onSelect,
  className,
}: AreaChartProps) {
  const { hidden, toggle } = useHidden(series);
  const kb = useActive(data.length);
  const active = kb.active;
  const gid = React.useId().replace(/:/g, "");
  const all = series.map((s, i) => ({ ...s, color: colorAt(i, s.color) }));
  const visible = all.filter((s) => !hidden.has(s.key));
  const labels = data.map((r, i) => xFormat(r[x], i));
  const percent = stack === "percent";
  const axisFmt = axisFormat ?? (percent ? (n: number) => percentFa(n) : compactFa);

  const raw = data.map((r) => visible.map((s) => num(r, s.key) ?? 0));
  const stacked = stackRows(raw, stack);
  const values = stacked.flatMap((col) => col.flatMap(([a, b]) => [a, b]));
  references?.forEach((r) => values.push(r.value));
  const { domain: dom, ticks } = percent ? { domain: [0, 100] as [number, number], ticks: [0, 25, 50, 75, 100] } : valueTicks(values, domain, height);

  const rowsAt = (i: number) => {
    const rows = visible.map((s, j) => {
      const v = num(data[i], s.key);
      const share = percent && v !== null ? ` (${percentFa(stacked[j][i][1] - stacked[j][i][0], 1)})` : "";
      return { key: s.key, label: s.label, color: s.color, value: v === null ? "—" : format(v) + share };
    });
    return rows;
  };
  const totalAt = (i: number) => raw[i].reduce((a, b) => a + b, 0);

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      empty={data.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(labels[active], rowsAt(active)) : ""}
      legend={legend ? <Legend items={all} hidden={hidden} onToggle={toggle} /> : undefined}
      table={{ head: ["", ...series.map((s) => s.label)], rows: data.map((r, i) => [labels[i], ...series.map((s) => { const v = num(r, s.key); return v === null ? "—" : format(v); })]) }}
    >
      {(width) => {
        const box = plotBox(width, height, { yLabels: ticks.map(axisFmt), xAxis, yAxis });
        const px = pointScale(data.length, box.left + 2, box.right - 2);
        const y = linearScale(dom, [box.bottom, box.top]);
        const stride = labelStride(data.length, box.right - box.left, Math.max(0, ...labels.map((l) => textWidth(l))) + 8);
        const ax = active !== null ? px.x(active) : 0;
        const tops = visible.map((_, j) => data.map((_, i) => [px.x(i), y(stacked[j][i][1])] as Pt));
        const bottoms = visible.map((_, j) => data.map((_, i) => [px.x(i), y(stack === "none" ? Math.max(dom[0], Math.min(0, dom[1])) : stacked[j][i][0])] as Pt));
        // Draw the last stacked layer first so its line isn't covered by the next fill.
        const order = visible.map((_, j) => j);
        if (stack === "none") order.reverse();

        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <defs>
                {visible.map((s, j) => (
                  <linearGradient key={s.key} id={`${gid}-${j}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={s.color} stopOpacity={stack === "none" ? 0.32 : 0.55} />
                    <stop offset="1" stopColor={s.color} stopOpacity={stack === "none" ? 0.02 : 0.2} />
                  </linearGradient>
                ))}
              </defs>
              <ValueGrid box={box} ticks={ticks} y={y} format={axisFmt} grid={grid} axis={yAxis} />
              {order.map((j) => {
                const s = visible[j];
                return (
                  <g key={s.key}>
                    <path
                      d={areaPath(tops[j], bottoms[j], curve)}
                      fill={fill === "gradient" ? `url(#${gid}-${j})` : s.color}
                      fillOpacity={fill === "gradient" ? 1 : stack === "none" ? 0.18 : 0.4}
                      className={animate ? "vf-fade" : undefined}
                    />
                    <path
                      d={linePath(tops[j], curve)}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeDasharray={s.dashed ? "5 4" : undefined}
                      pathLength={animate && !s.dashed ? 1 : undefined}
                      className={animate ? (s.dashed ? "vf-fade" : "vf-draw") : undefined}
                    />
                  </g>
                );
              })}
              <References box={box} refs={references} y={y} />
              {active !== null && (
                <>
                  <line x1={ax} x2={ax} y1={box.top} y2={box.bottom} stroke="var(--foreground)" strokeOpacity={0.3} strokeDasharray="2 3" />
                  {visible.map((s, j) => (
                    <circle key={s.key} cx={ax} cy={tops[j][active][1]} r={4} fill="var(--background)" stroke={s.color} strokeWidth={2} />
                  ))}
                </>
              )}
              {xAxis && <CategoryAxis box={box} labels={labels} x={px.x} stride={stride} highlight={active} />}
              <rect
                x={box.left}
                y={box.top}
                width={Math.max(0, box.right - box.left)}
                height={Math.max(0, box.bottom - box.top)}
                fill="transparent"
                style={{ cursor: onSelect ? "pointer" : "crosshair" }}
                onPointerMove={(e) => kb.setActive(px.index(pointerX(e).x))}
                onClick={() => active !== null && onSelect?.(data[active], active)}
              />
            </svg>
            {active !== null && (
              <ChartTooltip
                width={width}
                state={{
                  x: ax,
                  y: Math.min(...tops.map((t) => t[active][1])),
                  title: labels[active],
                  rows: [...rowsAt(active)].reverse(),
                  footer: stack !== "none" && visible.length > 1 ? `جمع: ${format(totalAt(active))}` : undefined,
                }}
              />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
