"use client";

import * as React from "react";
import { bandScale, compactFa, fullFa, labelStride, linearScale, percentFa, roundedRect, stackRows, textWidth, type StackMode } from "@/lib/chart-utils";
import {
  CategoryAxis,
  ChartFrame,
  ChartTooltip,
  Label,
  Legend,
  References,
  ValueGrid,
  announceRows,
  colorAt,
  defaultLabel,
  num,
  plotBox,
  useActive,
  useHidden,
  valueTicks,
  type Reference,
  type Row,
  type Series,
  type ValueFormat,
} from "@/registry/charts/chart-core";

export interface BarChartProps {
  data: Row[];
  x: string;
  series: Series[];
  title: string;
  description?: string;
  height?: number;
  /** "vertical" columns, or "horizontal" bars that grow right-to-left from the labels. */
  orientation?: "vertical" | "horizontal";
  /** "none" groups series side by side, "stacked" piles them, "percent" fills to 100٪. */
  stack?: StackMode;
  format?: ValueFormat;
  axisFormat?: ValueFormat;
  xFormat?: (value: unknown, index: number) => string;
  /** Print each bar's value at its end (stack total in stacked modes). */
  showValues?: boolean;
  /** One color per category when there is a single series, e.g. one per bank. */
  colors?: string[];
  /** Index drawn in full color while the rest fade, e.g. the current month. */
  highlight?: number;
  radius?: number;
  references?: Reference[];
  legend?: boolean;
  grid?: boolean;
  animate?: boolean;
  onSelect?: (row: Row, index: number) => void;
  className?: string;
}

/**
 * نمودار میله‌ای. Columns run right to left; horizontal bars start at the
 * category labels on the right and grow leftward. Negative values hang below
 * (or to the right of) zero, and only the far end of each bar is rounded.
 */
export function BarChart({
  data,
  x,
  series,
  title,
  description,
  height,
  orientation = "vertical",
  stack = "none",
  format = (n) => fullFa(n, 2),
  axisFormat,
  xFormat = defaultLabel,
  showValues = false,
  colors,
  highlight,
  radius = 4,
  references,
  legend = series.length > 1,
  grid = true,
  animate = true,
  onSelect,
  className,
}: BarChartProps) {
  const horizontal = orientation === "horizontal";
  const h = height ?? (horizontal ? Math.max(160, data.length * (stack === "none" ? 18 * series.length + 14 : 34) + 40) : 260);
  const { hidden, toggle } = useHidden(series);
  const kb = useActive(data.length);
  const active = kb.active;
  const all = series.map((s, i) => ({ ...s, color: colorAt(i, s.color) }));
  const visible = all.filter((s) => !hidden.has(s.key));
  const labels = data.map((r, i) => xFormat(r[x], i));
  const percent = stack === "percent";
  const axisFmt = axisFormat ?? (percent ? (n: number) => percentFa(n) : compactFa);

  const raw = data.map((r) => visible.map((s) => num(r, s.key) ?? 0));
  const stacked = stackRows(raw, stack);
  const values = stacked.flatMap((col) => col.flatMap(([a, b]) => [a, b]));
  references?.forEach((r) => values.push(r.value));
  const { domain: dom, ticks } = percent ? { domain: [0, 100] as [number, number], ticks: [0, 25, 50, 75, 100] } : valueTicks(values, "zero", horizontal ? 300 : h);

  const colorOf = (j: number, i: number) => (visible.length === 1 && colors?.[i]) || visible[j].color;
  const rowsAt = (i: number) =>
    visible.map((s, j) => {
      const v = num(data[i], s.key);
      return { key: s.key, label: s.label, color: colorOf(j, i), value: v === null ? "—" : format(v) + (percent ? ` (${percentFa(stacked[j][i][1] - stacked[j][i][0], 1)})` : "") };
    });
  /** Only the outermost segment of a stack gets rounded corners. */
  const outer = (j: number, i: number) => {
    if (stack === "none") return true;
    const v = raw[i][j];
    for (let k = j + 1; k < visible.length; k++) if (raw[i][k] !== 0 && Math.sign(raw[i][k]) === Math.sign(v)) return false;
    return true;
  };
  const totalAt = (i: number) => raw[i].reduce((a, b) => a + b, 0);

  return (
    <ChartFrame
      title={title}
      description={description}
      height={h}
      className={className}
      empty={data.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(labels[active], rowsAt(active)) : ""}
      legend={legend ? <Legend items={all} hidden={hidden} onToggle={toggle} /> : undefined}
      table={{ head: ["", ...series.map((s) => s.label)], rows: data.map((r, i) => [labels[i], ...series.map((s) => { const v = num(r, s.key); return v === null ? "—" : format(v); })]) }}
    >
      {(width) => {
        if (horizontal) {
          const labelW = Math.min(width * 0.35, Math.max(...labels.map((l) => textWidth(l, 12))) + 12);
          const box = { left: 8, right: width - labelW, top: 4, bottom: h - 24, width, height: h };
          const vx = linearScale(dom, [box.right, box.left]);
          const band = (() => {
            const step = (box.bottom - box.top) / Math.max(1, data.length);
            const bw = step * 0.72;
            return { step, bw, y: (i: number) => box.top + i * step + (step - bw) / 2 };
          })();
          const sub = stack === "none" ? band.bw / Math.max(1, visible.length) : band.bw;
          const z = vx(0);
          return (
            <>
              <svg width={width} height={h} className="block overflow-visible" aria-hidden>
                <g aria-hidden>
                  {ticks.map((t) => (
                    <g key={t}>
                      {grid && <line x1={vx(t)} x2={vx(t)} y1={box.top} y2={box.bottom} stroke="var(--border)" strokeOpacity={t === 0 ? 1 : 0.6} strokeDasharray={t === 0 ? undefined : "3 3"} />}
                      <Label x={vx(t)} y={box.bottom + 16} size={10}>{axisFmt(t)}</Label>
                    </g>
                  ))}
                </g>
                {data.map((_, i) => (
                  <g key={i} onPointerEnter={() => kb.setActive(i)} onClick={() => onSelect?.(data[i], i)} style={{ cursor: onSelect ? "pointer" : undefined }}>
                    <rect x={0} y={box.top + i * band.step} width={width} height={band.step} fill={active === i ? "var(--foreground)" : "transparent"} fillOpacity={0.04} />
                    <Label anchor="right" x={width - 2} y={band.y(i) + band.bw / 2} dy="0.35em" size={12} muted={active !== i}>
                      {labels[i]}
                    </Label>
                    {visible.map((s, j) => {
                      const [a, b] = stacked[j][i];
                      const x0 = vx(Math.max(a, b)), x1 = vx(Math.min(a, b));
                      const yy = stack === "none" ? band.y(i) + j * sub : band.y(i);
                      const neg = b < a || (stack === "none" && b < 0);
                      const r = outer(j, i) ? radius : 0;
                      const dim = highlight !== undefined && highlight !== i;
                      return (
                        <path
                          key={s.key}
                          d={roundedRect(x0, yy + (stack === "none" ? 1 : 0), Math.max(0, x1 - x0), Math.max(0, sub - (stack === "none" ? 2 : 0)), r, neg ? { tr: true, br: true } : { tl: true, bl: true })}
                          fill={colorOf(j, i)}
                          fillOpacity={dim ? 0.35 : 1}
                          className={animate ? "vf-grow vf-mark" : "vf-mark"}
                          style={animate ? ({ transformOrigin: neg ? "left" : "right", "--vf-sx": 0, "--vf-sy": 1 } as React.CSSProperties) : undefined}
                        />
                      );
                    })}
                    {showValues && (
                      <Label anchor="right" x={vx(stack === "none" ? Math.max(0, ...raw[i]) : Math.max(...stacked.map((c) => c[i][1]))) - 4} y={band.y(i) + band.bw / 2} dy="0.35em" size={10}>
                        {stack === "none" && visible.length > 1 ? "" : percent ? "" : axisFmt(stack === "none" ? raw[i][0] : totalAt(i))}
                      </Label>
                    )}
                  </g>
                ))}
                <line x1={z} x2={z} y1={box.top} y2={box.bottom} stroke="var(--border)" />
              </svg>
              {active !== null && (
                <ChartTooltip
                  width={width}
                  state={{
                    x: Math.min(...visible.map((_, j) => vx(Math.max(...stacked[j][active])))),
                    y: band.y(active) + band.bw / 2,
                    title: labels[active],
                    rows: rowsAt(active),
                    footer: stack !== "none" && visible.length > 1 ? `جمع: ${format(totalAt(active))}` : undefined,
                  }}
                />
              )}
            </>
          );
        }

        const box = plotBox(width, h, { yLabels: ticks.map(axisFmt), top: showValues ? 18 : 10 });
        const bs = bandScale(data.length, box.left, box.right, data.length > 20 ? 0.18 : 0.3);
        const y = linearScale(dom, [box.bottom, box.top]);
        const sub = stack === "none" ? bs.band / Math.max(1, visible.length) : bs.band;
        const stride = labelStride(data.length, box.right - box.left, Math.max(0, ...labels.map((l) => textWidth(l))) + 8);
        const z = y(0);
        return (
          <>
            <svg width={width} height={h} className="block overflow-visible" aria-hidden>
              <ValueGrid box={box} ticks={ticks} y={y} format={axisFmt} grid={grid} />
              {data.map((_, i) => (
                <g key={i} onPointerEnter={() => kb.setActive(i)} onClick={() => onSelect?.(data[i], i)} style={{ cursor: onSelect ? "pointer" : undefined }}>
                  <rect x={bs.x(i) - (bs.step - bs.band) / 2} y={box.top} width={bs.step} height={box.bottom - box.top} fill={active === i ? "var(--foreground)" : "transparent"} fillOpacity={0.05} rx={4} />
                  {visible.map((s, j) => {
                    const [a, b] = stacked[j][i];
                    const top = y(Math.max(a, b)), bottom = y(Math.min(a, b));
                    // Grouped bars keep series order right-to-left inside the band.
                    const xx = stack === "none" ? bs.x(i) + (visible.length - 1 - j) * sub : bs.x(i);
                    const neg = b < a || (stack === "none" && b < 0);
                    const r = outer(j, i) ? radius : 0;
                    const dim = highlight !== undefined && highlight !== i;
                    const gap = stack === "none" && visible.length > 1 ? Math.min(2, sub * 0.15) : 0;
                    return (
                      <path
                        key={s.key}
                        d={roundedRect(xx + gap / 2, top, Math.max(0, sub - gap), Math.max(0, bottom - top), r, neg ? { bl: true, br: true } : { tl: true, tr: true })}
                        fill={colorOf(j, i)}
                        fillOpacity={dim ? 0.35 : 1}
                        className={animate ? "vf-grow vf-mark" : "vf-mark"}
                        style={animate ? ({ transformOrigin: neg ? "top" : "bottom", "--vf-sx": 1, "--vf-sy": 0 } as React.CSSProperties) : undefined}
                      />
                    );
                  })}
                  {showValues &&
                    (stack === "none"
                      ? visible.map((s, j) => {
                          const v = raw[i][j];
                          return (
                            <Label key={s.key} x={bs.x(i) + (visible.length - 1 - j) * sub + sub / 2} y={v >= 0 ? y(v) - 5 : y(v) + 12} size={10} muted={false}>
                              {visible.length > 3 || v === 0 ? "" : axisFmt(v)}
                            </Label>
                          );
                        })
                      : !percent && (
                          <Label x={bs.center(i)} y={y(Math.max(0, ...stacked.map((c) => c[i][1]))) - 5} size={10} muted={false}>
                            {axisFmt(totalAt(i))}
                          </Label>
                        ))}
                </g>
              ))}
              {dom[0] < 0 && <line x1={box.left} x2={box.right} y1={z} y2={z} stroke="var(--foreground)" strokeOpacity={0.3} />}
              <References box={box} refs={references} y={y} />
              <CategoryAxis box={box} labels={labels} x={bs.center} stride={stride} highlight={active ?? highlight} />
            </svg>
            {active !== null && (
              <ChartTooltip
                width={width}
                state={{
                  x: bs.center(active),
                  y: Math.min(box.bottom, ...visible.map((_, j) => y(Math.max(...stacked[j][active])))),
                  title: labels[active],
                  rows: stack === "none" ? rowsAt(active) : [...rowsAt(active)].reverse(),
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
