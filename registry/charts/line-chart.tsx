"use client";

import * as React from "react";
import { compactFa, fullFa, labelStride, linePath, linearScale, pointScale, segments, textWidth, type Curve } from "@/lib/chart-utils";
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

export interface LineChartProps {
  data: Row[];
  /** Field holding the category or date of each row. */
  x: string;
  series: Series[];
  /** Accessible name and caption of the hidden data table. */
  title: string;
  description?: string;
  height?: number;
  curve?: Curve;
  /** Tooltip and table format. Default: full Persian number. */
  format?: ValueFormat;
  /** Value-axis ticks. Default: compact «۱۲ میلیون». */
  axisFormat?: ValueFormat;
  xFormat?: (value: unknown, index: number) => string;
  /** "auto" fits the data, "zero" starts at 0, or a fixed [min, max]. */
  domain?: DomainOption;
  /** Dots on every point; "auto" shows them up to 16 points. */
  dots?: boolean | "auto";
  references?: Reference[];
  /** Index to emphasise, e.g. today. */
  highlight?: number;
  legend?: boolean;
  grid?: boolean;
  yAxis?: boolean;
  xAxis?: boolean;
  animate?: boolean;
  onSelect?: (row: Row, index: number) => void;
  className?: string;
}

/**
 * نمودار خطی. Time runs right to left, the value axis sits on the right,
 * missing values break the line, and dashed series read as forecasts.
 */
export function LineChart({
  data,
  x,
  series,
  title,
  description,
  height = 260,
  curve = "monotone",
  format = (n) => fullFa(n, 2),
  axisFormat = compactFa,
  xFormat = defaultLabel,
  domain = "auto",
  dots = "auto",
  references,
  highlight,
  legend = series.length > 1,
  grid = true,
  yAxis = true,
  xAxis = true,
  animate = true,
  onSelect,
  className,
}: LineChartProps) {
  const { hidden, toggle } = useHidden(series);
  const kb = useActive(data.length);
  const active = kb.active;
  const all = series.map((s, i) => ({ ...s, color: colorAt(i, s.color) }));
  const visible = all.filter((s) => !hidden.has(s.key));
  const labels = data.map((r, i) => xFormat(r[x], i));

  const values = visible.flatMap((s) => data.map((r) => num(r, s.key)).filter((v): v is number => v !== null));
  references?.forEach((r) => values.push(r.value));
  const { domain: dom, ticks } = valueTicks(values, domain, height);
  const showDots = dots === "auto" ? data.length <= 16 : dots;

  const rowsAt = (i: number) =>
    visible.map((s) => {
      const v = num(data[i], s.key);
      return { key: s.key, label: s.label, color: s.color, dashed: s.dashed, value: v === null ? "—" : format(v) };
    });

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
        const box = plotBox(width, height, { yLabels: ticks.map(axisFormat), xAxis, yAxis });
        const px = pointScale(data.length, box.left + 6, box.right - 6);
        const y = linearScale(dom, [box.bottom, box.top]);
        const stride = labelStride(data.length, box.right - box.left, Math.max(0, ...labels.map((l) => textWidth(l))) + 8);
        const ax = active !== null ? px.x(active) : 0;
        const ay = active !== null ? Math.min(box.bottom, ...visible.map((s) => num(data[active], s.key)).filter((v): v is number => v !== null).map(y)) : 0;

        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <ValueGrid box={box} ticks={ticks} y={y} format={axisFormat} grid={grid} axis={yAxis} />
              <References box={box} refs={references} y={y} />
              {highlight !== undefined && highlight < data.length && (
                <line x1={px.x(highlight)} x2={px.x(highlight)} y1={box.top} y2={box.bottom} stroke="var(--foreground)" strokeOpacity={0.15} />
              )}
              {visible.map((s) => {
                const segs = segments(data.map((r) => num(r, s.key)), px.x, y);
                return (
                  <g key={s.key}>
                    {segs.map((seg, j) => (
                      <path
                        key={j}
                        d={linePath(seg.pts, curve)}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={s.dashed ? "5 4" : undefined}
                        pathLength={animate && !s.dashed ? 1 : undefined}
                        className={animate ? (s.dashed ? "vf-fade" : "vf-draw") : undefined}
                      />
                    ))}
                    {segs.flatMap((seg) =>
                      seg.idx.map((i, k) => {
                        const on = i === active || i === highlight;
                        if (!showDots && !on && seg.idx.length > 1) return null;
                        return <circle key={i} cx={seg.pts[k][0]} cy={seg.pts[k][1]} r={on ? 4.5 : 3} fill="var(--background)" stroke={s.color} strokeWidth={2} />;
                      }),
                    )}
                  </g>
                );
              })}
              {active !== null && <line x1={ax} x2={ax} y1={box.top} y2={box.bottom} stroke="var(--foreground)" strokeOpacity={0.3} strokeDasharray="2 3" />}
              {xAxis && <CategoryAxis box={box} labels={labels} x={px.x} stride={stride} highlight={active ?? highlight} />}
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
            {active !== null && <ChartTooltip state={{ x: ax, y: ay, title: labels[active], rows: rowsAt(active) }} width={width} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
