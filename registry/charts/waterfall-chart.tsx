"use client";

import * as React from "react";
import { bandScale, compactFa, fullFa, labelStride, linearScale, roundedRect, textWidth } from "@/lib/chart-utils";
import { CategoryAxis, ChartFrame, ChartTooltip, Label, Legend, ValueGrid, announceRows, plotBox, useActive, valueTicks, type ValueFormat } from "@/registry/charts/chart-core";

export type WaterfallStep = {
  label: string;
  /** Change for normal steps; ignored for totals. */
  value: number;
  /** Draw the running total here (e.g. «سود ناخالص») instead of a change. */
  total?: boolean;
};

export interface WaterfallChartProps {
  data: WaterfallStep[];
  title: string;
  description?: string;
  height?: number;
  format?: ValueFormat;
  axisFormat?: ValueFormat;
  /** Value printed above or below each bar. */
  showValues?: boolean;
  colors?: { up?: string; down?: string; total?: string };
  legend?: boolean;
  animate?: boolean;
  className?: string;
}

/**
 * نمودار آبشاری. How a starting amount turns into a final one: rises in green,
 * falls in red, totals in the neutral colour, joined by dashed connectors.
 * Steps run right to left like a Persian income statement.
 */
export function WaterfallChart({
  data,
  title,
  description,
  height = 280,
  format = (n) => fullFa(n),
  axisFormat = compactFa,
  showValues = true,
  colors,
  legend = true,
  animate = true,
  className,
}: WaterfallChartProps) {
  const kb = useActive(data.length);
  const active = kb.active;
  const up = colors?.up ?? "var(--success)", down = colors?.down ?? "var(--destructive)", tot = colors?.total ?? "var(--chart-1, var(--brand))";

  const bars = React.useMemo(() => {
    const out: { from: number; to: number; kind: "up" | "down" | "total"; delta: number }[] = [];
    for (const d of data) {
      const run = out.length ? out[out.length - 1].to : 0;
      if (d.total) out.push({ from: 0, to: run, kind: "total", delta: run });
      else out.push({ from: run, to: run + d.value, kind: d.value >= 0 ? "up" : "down", delta: d.value });
    }
    return out;
  }, [data]);
  const { domain, ticks } = valueTicks(bars.flatMap((b) => [b.from, b.to]), "zero", height);
  const colorOf = (k: "up" | "down" | "total") => (k === "up" ? up : k === "down" ? down : tot);
  const sign = (b: (typeof bars)[number]) => (b.kind === "total" ? format(b.to) : `${b.delta >= 0 ? "+" : "−"}${format(Math.abs(b.delta))}`);
  const rows = (i: number) => [
    { key: "d", label: bars[i].kind === "total" ? "جمع" : "تغییر", value: sign(bars[i]), color: colorOf(bars[i].kind) },
    ...(bars[i].kind !== "total" ? [{ key: "r", label: "مانده", value: format(bars[i].to) }] : []),
  ];
  const labels = data.map((d) => d.label);

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
        legend ? (
          <Legend
            items={[
              { key: "up", label: "افزایش", color: up },
              { key: "down", label: "کاهش", color: down },
              { key: "total", label: "جمع", color: tot },
            ]}
          />
        ) : undefined
      }
      table={{ head: ["", "تغییر", "مانده"], rows: data.map((d, i) => [d.label, sign(bars[i]), format(bars[i].to)]) }}
    >
      {(width) => {
        const box = plotBox(width, height, { yLabels: ticks.map(axisFormat), top: showValues ? 20 : 10 });
        const bs = bandScale(data.length, box.left, box.right, 0.28);
        const y = linearScale(domain, [box.bottom, box.top]);
        const stride = labelStride(data.length, box.right - box.left, Math.max(0, ...labels.map((l) => textWidth(l))) + 8);
        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <ValueGrid box={box} ticks={ticks} y={y} format={axisFormat} />
              {bars.map((b, i) => {
                const top = y(Math.max(b.from, b.to)), bottom = y(Math.min(b.from, b.to));
                const on = active === i;
                const next = bars[i + 1];
                return (
                  <g key={i} onPointerEnter={() => kb.setActive(i)}>
                    <rect x={bs.x(i) - (bs.step - bs.band) / 2} y={box.top} width={bs.step} height={box.bottom - box.top} fill={on ? "var(--foreground)" : "transparent"} fillOpacity={0.05} rx={4} />
                    <path
                      d={roundedRect(bs.x(i), top, bs.band, Math.max(1, bottom - top), 3, { tl: true, tr: true, bl: true, br: true })}
                      fill={colorOf(b.kind)}
                      fillOpacity={b.kind === "total" ? 1 : 0.85}
                      className={animate ? "vf-fade" : undefined}
                    />
                    {next && <line x1={bs.x(i)} x2={bs.x(i + 1) + bs.band} y1={y(b.to)} y2={y(b.to)} stroke="var(--muted-foreground)" strokeDasharray="3 3" strokeOpacity={0.7} />}
                    {showValues && (
                      <Label x={bs.center(i)} y={b.kind !== "down" ? top - 6 : bottom + 13} size={10} muted={false} fill={b.kind === "total" ? "var(--foreground)" : colorOf(b.kind)}>
                        {b.kind === "total" ? axisFormat(b.to) : `${b.delta >= 0 ? "+" : "−"}${axisFormat(Math.abs(b.delta))}`}
                      </Label>
                    )}
                  </g>
                );
              })}
              <CategoryAxis box={box} labels={labels} x={bs.center} stride={stride} highlight={active} />
            </svg>
            {active !== null && <ChartTooltip width={width} state={{ x: bs.center(active), y: y(Math.max(bars[active].from, bars[active].to)), title: labels[active], rows: rows(active) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
