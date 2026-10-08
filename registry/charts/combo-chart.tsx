"use client";

import * as React from "react";
import { areaPath, bandScale, compactFa, fullFa, labelStride, linePath, linearScale, roundedRect, segments, textWidth, type Curve, type Pt } from "@/lib/chart-utils";
import {
  CategoryAxis,
  ChartFrame,
  ChartTooltip,
  Legend,
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
  type Row,
  type Series,
  type ValueFormat,
} from "@/registry/charts/chart-core";

export type ComboSeries = Series & {
  type: "bar" | "line" | "area";
  /** "right" is the main axis (RTL); "left" is a second scale, e.g. a percentage. */
  axis?: "right" | "left";
};

export interface ComboChartProps {
  data: Row[];
  x: string;
  series: ComboSeries[];
  title: string;
  description?: string;
  height?: number;
  curve?: Curve;
  /** Per-axis formats for tooltip values and ticks. */
  format?: ValueFormat;
  formatLeft?: ValueFormat;
  axisFormat?: ValueFormat;
  axisFormatLeft?: ValueFormat;
  xFormat?: (value: unknown, index: number) => string;
  legend?: boolean;
  grid?: boolean;
  animate?: boolean;
  onSelect?: (row: Row, index: number) => void;
  className?: string;
}

/**
 * نمودار ترکیبی. Bars, lines and areas on one band scale with two value axes:
 * the main one on the right, a secondary one on the left (e.g. revenue as bars,
 * conversion rate as a line).
 */
export function ComboChart({
  data,
  x,
  series,
  title,
  description,
  height = 280,
  curve = "monotone",
  format = (n) => fullFa(n, 2),
  formatLeft,
  axisFormat = compactFa,
  axisFormatLeft,
  xFormat = defaultLabel,
  legend = true,
  grid = true,
  animate = true,
  onSelect,
  className,
}: ComboChartProps) {
  const { hidden, toggle } = useHidden(series);
  const kb = useActive(data.length);
  const active = kb.active;
  const gid = React.useId().replace(/:/g, "");
  const all = series.map((s, i) => ({ ...s, color: colorAt(i, s.color) }));
  const visible = all.filter((s) => !hidden.has(s.key));
  const labels = data.map((r, i) => xFormat(r[x], i));
  const fmtL = formatLeft ?? format;
  const axisL = axisFormatLeft ?? axisFormat;

  const side = (s: ComboSeries) => s.axis ?? "right";
  const valuesOn = (ax: "right" | "left") => visible.filter((s) => side(s) === ax).flatMap((s) => data.map((r) => num(r, s.key)).filter((v): v is number => v !== null));
  const right = valueTicks(valuesOn("right"), "zero", height);
  const hasLeft = visible.some((s) => side(s) === "left");
  const left = valueTicks(valuesOn("left"), "zero", height);
  // Align the left axis to the same number of grid lines as the right one.
  const leftTicks = hasLeft ? right.ticks.map((_, i) => left.domain[0] + ((left.domain[1] - left.domain[0]) * i) / (right.ticks.length - 1)) : [];
  const bars = visible.filter((s) => s.type === "bar");

  const rowsAt = (i: number) =>
    visible.map((s) => {
      const v = num(data[i], s.key);
      return { key: s.key, label: s.label, color: s.color, dashed: s.dashed, value: v === null ? "—" : (side(s) === "left" ? fmtL : format)(v) };
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
      table={{ head: ["", ...series.map((s) => s.label)], rows: data.map((r, i) => [labels[i], ...series.map((s) => { const v = num(r, s.key); return v === null ? "—" : (side(s) === "left" ? fmtL : format)(v); })]) }}
    >
      {(width) => {
        const box = plotBox(width, height, { yLabels: right.ticks.map(axisFormat), y2Labels: hasLeft ? leftTicks.map(axisL) : undefined });
        const bs = bandScale(data.length, box.left, box.right, 0.3);
        const yR = linearScale(right.domain, [box.bottom, box.top]);
        const yL = linearScale(hasLeft ? [leftTicks[0], leftTicks[leftTicks.length - 1]] : right.domain, [box.bottom, box.top]);
        const yOf = (s: ComboSeries) => (side(s) === "left" ? yL : yR);
        const sub = bs.band / Math.max(1, bars.length);
        const stride = labelStride(data.length, box.right - box.left, Math.max(0, ...labels.map((l) => textWidth(l))) + 8);
        const ax = active !== null ? bs.center(active) : 0;

        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <ValueGrid box={box} ticks={right.ticks} y={yR} format={axisFormat} grid={grid} />
              {hasLeft && <ValueGrid box={box} ticks={leftTicks} y={yL} format={axisL} grid={false} side="left" />}
              {active !== null && <rect x={bs.x(active) - (bs.step - bs.band) / 2} y={box.top} width={bs.step} height={box.bottom - box.top} fill="var(--foreground)" fillOpacity={0.05} rx={4} />}
              {bars.map((s, j) =>
                data.map((r, i) => {
                  const v = num(r, s.key);
                  if (v === null) return null;
                  const y = yOf(s), top = y(Math.max(0, v)), bottom = y(Math.min(0, v));
                  return (
                    <path
                      key={`${s.key}-${i}`}
                      d={roundedRect(bs.x(i) + (bars.length - 1 - j) * sub + 1, top, Math.max(0, sub - 2), Math.max(0, bottom - top), 4, v >= 0 ? { tl: true, tr: true } : { bl: true, br: true })}
                      fill={s.color}
                      className={animate ? "vf-grow" : undefined}
                      style={animate ? ({ transformOrigin: v >= 0 ? "bottom" : "top", "--vf-sx": 1, "--vf-sy": 0 } as React.CSSProperties) : undefined}
                    />
                  );
                }),
              )}
              {visible
                .filter((s) => s.type !== "bar")
                .map((s, k) => {
                  const y = yOf(s);
                  const segs = segments(data.map((r) => num(r, s.key)), bs.center, y);
                  const base = y(Math.max(y.domain[0], Math.min(0, y.domain[1])));
                  return (
                    <g key={s.key}>
                      {s.type === "area" && (
                        <>
                          <defs>
                            <linearGradient id={`${gid}-${k}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0" stopColor={s.color} stopOpacity={0.3} />
                              <stop offset="1" stopColor={s.color} stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          {segs.map((seg, j) => (
                            <path key={j} d={areaPath(seg.pts, seg.pts.map(([px]) => [px, base] as Pt), curve)} fill={`url(#${gid}-${k})`} className={animate ? "vf-fade" : undefined} />
                          ))}
                        </>
                      )}
                      {segs.map((seg, j) => (
                        <path
                          key={j}
                          d={linePath(seg.pts, curve)}
                          fill="none"
                          stroke={s.color}
                          strokeWidth={2.25}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeDasharray={s.dashed ? "5 4" : undefined}
                          pathLength={animate && !s.dashed ? 1 : undefined}
                          className={animate ? (s.dashed ? "vf-fade" : "vf-draw") : undefined}
                        />
                      ))}
                      {segs.flatMap((seg) => seg.idx.map((i, n) => (data.length <= 16 || i === active ? <circle key={i} cx={seg.pts[n][0]} cy={seg.pts[n][1]} r={i === active ? 4.5 : 3} fill="var(--background)" stroke={s.color} strokeWidth={2} /> : null)))}
                    </g>
                  );
                })}
              <CategoryAxis box={box} labels={labels} x={bs.center} stride={stride} highlight={active} />
              <rect
                x={box.left}
                y={box.top}
                width={Math.max(0, box.right - box.left)}
                height={Math.max(0, box.bottom - box.top)}
                fill="transparent"
                style={{ cursor: onSelect ? "pointer" : undefined }}
                onPointerMove={(e) => kb.setActive(bs.index(pointerX(e).x))}
                onClick={() => active !== null && onSelect?.(data[active], active)}
              />
            </svg>
            {active !== null && (
              <ChartTooltip
                width={width}
                state={{
                  x: ax,
                  y: Math.min(box.bottom, ...visible.map((s) => num(data[active], s.key)).map((v, k) => (v === null ? box.bottom : yOf(visible[k])(Math.max(0, v))))),
                  title: labels[active],
                  rows: rowsAt(active),
                }}
              />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
