"use client";

import * as React from "react";
import { bandScale, compactFa, fullFa, labelStride, linePath, linearScale, niceTicks, percentFa, segments, textWidth } from "@/lib/chart-utils";
import { CategoryAxis, ChartFrame, ChartTooltip, Legend, ValueGrid, announceRows, colorAt, defaultLabel, plotBox, pointerX, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type Candle = { date: Date | string; open: number; high: number; low: number; close: number; volume?: number };

export interface CandlestickChartProps {
  data: Candle[];
  title: string;
  description?: string;
  height?: number;
  /** Price format for the tooltip; default full Persian number. */
  format?: ValueFormat;
  axisFormat?: ValueFormat;
  xFormat?: (value: unknown, index: number) => string;
  /** Moving averages to overlay, in candles, e.g. [7, 21]. */
  movingAverages?: number[];
  /** Volume bars under the candles when the data has `volume`. */
  volume?: boolean;
  colors?: { up?: string; down?: string };
  animate?: boolean;
  className?: string;
}

function sma(values: number[], n: number) {
  return values.map((_, i) => (i + 1 < n ? null : values.slice(i + 1 - n, i + 1).reduce((a, b) => a + b, 0) / n));
}

/**
 * نمودار شمعی. Daily prices like the Tehran exchange: green when the close is
 * above the open, red when below, newest candle on the left, optional volume
 * and moving averages.
 */
export function CandlestickChart({
  data,
  title,
  description,
  height = 320,
  format = (n) => fullFa(n),
  axisFormat = compactFa,
  xFormat = defaultLabel,
  movingAverages = [],
  volume = true,
  colors,
  animate = true,
  className,
}: CandlestickChartProps) {
  const kb = useActive(data.length);
  const active = kb.active;
  const up = colors?.up ?? "var(--success)", down = colors?.down ?? "var(--destructive)";
  const hasVol = volume && data.some((d) => d.volume);
  const closes = data.map((d) => d.close);
  // Blue and purple slots, so averages never read as the green/red candle colours.
  const mas = movingAverages.map((n, k) => ({ n, values: sma(closes, n), color: colorAt([1, 4, 5, 6][k % 4]) }));
  const lo = Math.min(...data.map((d) => d.low)), hi = Math.max(...data.map((d) => d.high));
  const { domain, ticks } = niceTicks(lo - (hi - lo) * 0.04, hi + (hi - lo) * 0.04, Math.max(3, Math.floor((height - 60) / 50)));
  const labels = data.map((d, i) => xFormat(typeof d.date === "string" ? new Date(d.date) : d.date, i));
  const vMax = Math.max(1, ...data.map((d) => d.volume ?? 0));

  const rows = (i: number) => {
    const d = data[i];
    const prev = data[i - 1]?.close ?? d.open;
    const ch = ((d.close - prev) / (prev || 1)) * 100;
    return [
      { key: "o", label: "باز شدن", value: format(d.open) },
      { key: "h", label: "بیشترین", value: format(d.high) },
      { key: "l", label: "کمترین", value: format(d.low) },
      { key: "c", label: "پایانی", value: format(d.close), color: d.close >= d.open ? up : down },
      { key: "p", label: "تغییر", value: `${ch >= 0 ? "+" : "−"}${percentFa(Math.abs(ch), 2)}` },
      ...(d.volume ? [{ key: "v", label: "حجم", value: compactFa(d.volume) }] : []),
    ];
  };

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      empty={data.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(labels[active], rows(active)) : ""}
      legend={
        mas.length ? (
          <Legend
            items={[
              { key: "up", label: "مثبت", color: up },
              { key: "down", label: "منفی", color: down },
              ...mas.map((m) => ({ key: `ma${m.n}`, label: `میانگین ${fullFa(m.n)} روزه`, color: m.color, dashed: true })),
            ]}
          />
        ) : undefined
      }
      table={{ head: ["", "باز شدن", "بیشترین", "کمترین", "پایانی"], rows: data.map((d, i) => [labels[i], format(d.open), format(d.high), format(d.low), format(d.close)]) }}
    >
      {(width) => {
        const box = plotBox(width, height, { yLabels: ticks.map(axisFormat) });
        const volH = hasVol ? Math.round((box.bottom - box.top) * 0.18) : 0;
        const priceBottom = box.bottom - volH - (hasVol ? 6 : 0);
        const bs = bandScale(data.length, box.left, box.right, data.length > 60 ? 0.2 : 0.35);
        const y = linearScale(domain, [priceBottom, box.top]);
        const yv = linearScale([0, vMax], [box.bottom, box.bottom - volH]);
        const priceBox = { ...box, bottom: priceBottom };
        const stride = labelStride(data.length, box.right - box.left, Math.max(0, ...labels.map((l) => textWidth(l))) + 10);
        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <ValueGrid box={priceBox} ticks={ticks} y={y} format={axisFormat} />
              {active !== null && <rect x={bs.x(active) - (bs.step - bs.band) / 2} y={box.top} width={bs.step} height={box.bottom - box.top} fill="var(--foreground)" fillOpacity={0.06} />}
              <g className={animate ? "vf-fade" : undefined}>
                {data.map((d, i) => {
                  const c = d.close >= d.open ? up : down;
                  const cx = bs.center(i);
                  const top = y(Math.max(d.open, d.close)), bottom = y(Math.min(d.open, d.close));
                  return (
                    <g key={i}>
                      {hasVol && d.volume ? <rect x={bs.x(i)} y={yv(d.volume)} width={bs.band} height={box.bottom - yv(d.volume)} fill={c} fillOpacity={0.3} /> : null}
                      <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} stroke={c} strokeWidth={1} />
                      <rect x={bs.x(i)} y={top} width={bs.band} height={Math.max(1, bottom - top)} fill={c} rx={Math.min(1.5, bs.band / 4)} />
                    </g>
                  );
                })}
              </g>
              {mas.map((m) =>
                segments(m.values, bs.center, y).map((seg, j) => (
                  <path key={`${m.n}-${j}`} d={linePath(seg.pts, "monotone")} fill="none" stroke={m.color} strokeWidth={1.5} strokeDasharray="4 3" />
                )),
              )}
              {active !== null && <line x1={box.left} x2={box.right} y1={y(data[active].close)} y2={y(data[active].close)} stroke="var(--foreground)" strokeOpacity={0.35} strokeDasharray="2 3" />}
              <CategoryAxis box={box} labels={labels} x={bs.center} stride={stride} highlight={active} />
              <rect
                x={box.left}
                y={box.top}
                width={Math.max(0, box.right - box.left)}
                height={Math.max(0, box.bottom - box.top)}
                fill="transparent"
                style={{ cursor: "crosshair" }}
                onPointerMove={(e) => kb.setActive(bs.index(pointerX(e).x))}
              />
            </svg>
            {active !== null && <ChartTooltip width={width} state={{ x: bs.center(active), y: y(data[active].high), title: labels[active], rows: rows(active) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
