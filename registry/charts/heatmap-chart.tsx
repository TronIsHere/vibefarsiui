"use client";

import * as React from "react";
import { fa } from "@/lib/utils";
import { addDays, dayKey, fullFa, satWeekday, textWidth } from "@/lib/chart-utils";
import { JALALI_MONTHS, JALALI_WEEKDAYS, JALALI_WEEKDAYS_SHORT, toJalali } from "@/lib/jalali";
import { ChartFrame, ChartTooltip, Label, colorAt, type ValueFormat } from "@/registry/charts/chart-core";

/** 0 → empty cell, then four steps of the colour. */
const LEVELS = [0.07, 0.3, 0.5, 0.75, 1];

function levelOf(v: number, max: number) {
  if (!v || v <= 0) return 0;
  return Math.min(4, 1 + Math.floor((v / (max || 1)) * 3.999));
}

function ScaleLegend({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground" aria-hidden>
      <span>کمتر</span>
      {LEVELS.map((o, i) => (
        <span key={i} className="size-2.5 rounded-[3px]" style={{ background: i === 0 ? "var(--foreground)" : color, opacity: o }} />
      ))}
      <span>بیشتر</span>
    </div>
  );
}

export type DayValue = { date: Date | string; value: number };

export interface CalendarHeatmapProps {
  data: DayValue[];
  title: string;
  description?: string;
  /** Last day shown. Default: today. */
  end?: Date;
  /** How many days back from `end`. Default: one year. */
  days?: number;
  /** Days to ring as official holidays (تعطیل رسمی). */
  holidays?: (Date | string)[];
  /** Unit after the number in the tooltip, e.g. «سفارش». */
  unit?: string;
  format?: ValueFormat;
  color?: string;
  legend?: boolean;
  onSelect?: (date: Date, value: number) => void;
  className?: string;
}

const toKey = (d: Date | string) => (typeof d === "string" ? d.slice(0, 10) : dayKey(d));

/**
 * نقشه‌ی حرارتی تقویم شمسی. A year of days as a week grid: weeks run right to
 * left, rows go شنبه to جمعه, months are labelled in Jalali, and holidays get a ring.
 * Arrow keys move by day (up/down) and by week (left = next week).
 */
export function CalendarHeatmap({
  data,
  title,
  description,
  end,
  days = 365,
  holidays,
  unit = "",
  format = (n) => fullFa(n),
  color = colorAt(0),
  legend = true,
  onSelect,
  className,
}: CalendarHeatmapProps) {
  const last = React.useMemo(() => { const e = end ?? new Date(); return new Date(e.getFullYear(), e.getMonth(), e.getDate()); }, [end]);
  const { cells, weeks, max, total } = React.useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => map.set(toKey(d.date), (map.get(toKey(d.date)) ?? 0) + d.value));
    let first = addDays(last, -(days - 1));
    first = addDays(first, -satWeekday(first));
    const out: { date: Date; key: string; value: number; week: number; dow: number; inRange: boolean }[] = [];
    for (let d = first, i = 0; d <= last; d = addDays(d, 1), i++) {
      const key = dayKey(d);
      out.push({ date: d, key, value: map.get(key) ?? 0, week: Math.floor(i / 7), dow: satWeekday(d), inRange: i >= satWeekday(addDays(last, -(days - 1))) });
    }
    const vals = out.filter((c) => c.inRange).map((c) => c.value);
    return { cells: out, weeks: Math.ceil(out.length / 7), max: Math.max(1, ...vals), total: vals.reduce((a, b) => a + b, 0) };
  }, [data, last, days]);
  const holidaySet = React.useMemo(() => new Set((holidays ?? []).map(toKey)), [holidays]);
  const [active, setActive] = React.useState<number | null>(null);

  const describe = (c: (typeof cells)[number]) => {
    const { jy, jm, jd } = toJalali(c.date);
    return `${JALALI_WEEKDAYS[c.dow]} ${fa(jd)} ${JALALI_MONTHS[jm - 1]} ${fa(jy)}${holidaySet.has(c.key) ? " (تعطیل)" : ""}`;
  };
  const valueText = (v: number) => (v ? `${format(v)}${unit ? ` ${unit}` : ""}` : `بدون ${unit || "داده"}`);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, ArrowLeft: 7, ArrowRight: -7 };
    if (e.key === "Escape") return setActive(null);
    if (e.key === "Enter" && active !== null) return onSelect?.(cells[active].date, cells[active].value);
    if (e.key === "End") { e.preventDefault(); return setActive(cells.length - 1); }
    if (e.key === "Home") { e.preventDefault(); return setActive(cells.findIndex((c) => c.inRange)); }
    if (!(e.key in step)) return;
    e.preventDefault();
    setActive((a) => Math.max(0, Math.min(cells.length - 1, (a ?? cells.length - 1) + (a === null ? 0 : step[e.key]))));
  };

  const head = 18, side = 22, gap = 3;
  /** Cell size for this width; on narrow screens the oldest weeks drop off instead of cells shrinking below 10px. */
  const fit = (width: number) => {
    const ideal = (width - side) / weeks - gap;
    if (ideal >= 10) return { cell: Math.min(18, ideal), skip: 0 };
    const shown = Math.max(1, Math.floor((width - side) / (10 + gap)));
    return { cell: 10, skip: weeks - shown };
  };
  return (
    <ChartFrame
      title={title}
      description={description ?? `جمع ${valueText(total)} در ${fa(days)} روز`}
      height={0}
      className={className}
      keyboard={{ onKeyDown, onBlur: () => setActive(null) }}
      onPointerLeave={() => setActive(null)}
      announce={active !== null ? `${describe(cells[active])}، ${valueText(cells[active].value)}` : ""}
      legendPosition="bottom"
      legend={legend ? <ScaleLegend color={color} /> : undefined}
      table={{ head: ["روز", "مقدار"], rows: cells.filter((c) => c.inRange && c.value).map((c) => [describe(c), format(c.value)]) }}
      autoHeight={(width) => head + 7 * (fit(width).cell + gap)}
    >
      {(width) => {
        const { cell, skip } = fit(width);
        const pitch = cell + gap;
        const h = head + 7 * pitch;
        const gridRight = width - side;
        const cx = (w: number) => gridRight - (w - skip + 1) * pitch + gap / 2;
        const cy = (dow: number) => head + dow * pitch;
        // A month label goes over the first week that contains day 1 of that month.
        const months: { week: number; label: string }[] = [];
        cells.forEach((c) => {
          if (!c.inRange || c.week < skip) return;
          const { jd, jm } = toJalali(c.date);
          if (jd === 1 || (months.length === 0 && c.dow === 0)) months.push({ week: c.week, label: JALALI_MONTHS[jm - 1] });
        });
        // Drop the partial first month when the next label would collide with it, then any later collision.
        if (months.length > 1 && (months[1].week - months[0].week) * pitch < textWidth(months[0].label, 10) + 6) months.shift();
        for (let k = 1; k < months.length; k++) {
          if ((months[k].week - months[k - 1].week) * pitch < textWidth(months[k - 1].label, 10) + 6) months.splice(k--, 1);
        }
        const ac = active !== null ? cells[active] : null;
        return (
          <>
            <svg width={width} height={h} className="block" aria-hidden>
              {months.map((m, i) => (
                <Label key={i} anchor="right" x={cx(m.week) + cell} y={11} size={10}>
                  {m.label}
                </Label>
              ))}
              {JALALI_WEEKDAYS_SHORT.map((d, i) => (cell < 11 && i % 2 === 1 ? null :
                <Label key={d} anchor="right" x={width - 2} y={cy(i) + cell / 2} dy="0.35em" size={9} muted={i !== 6}>
                  {d}
                </Label>
              ))}
              {cells.map((c, i) =>
                c.inRange && c.week >= skip ? (
                  <rect
                    key={c.key}
                    x={cx(c.week)}
                    y={cy(c.dow)}
                    width={cell}
                    height={cell}
                    rx={Math.min(4, cell / 4)}
                    fill={levelOf(c.value, max) === 0 ? "var(--foreground)" : color}
                    fillOpacity={LEVELS[levelOf(c.value, max)]}
                    stroke={active === i ? "var(--foreground)" : holidaySet.has(c.key) ? "var(--destructive)" : "none"}
                    strokeWidth={active === i ? 2 : 1.25}
                    style={{ cursor: onSelect ? "pointer" : undefined }}
                    onPointerEnter={() => setActive(i)}
                    onClick={() => onSelect?.(c.date, c.value)}
                  />
                ) : null,
              )}
            </svg>
            {ac && ac.week >= skip && <ChartTooltip width={width} state={{ x: cx(ac.week) + cell / 2, y: cy(ac.dow) + cell / 2, title: describe(ac), rows: [{ key: "v", label: unit || "مقدار", value: ac.value ? format(ac.value) : "—", color }] }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}

export interface MatrixHeatmapProps {
  /** Row names top to bottom, e.g. weekdays. */
  rows: string[];
  /** Column names right to left, e.g. hours. */
  cols: string[];
  /** values[row][col]. */
  values: number[][];
  title: string;
  description?: string;
  format?: ValueFormat;
  /** Show every n-th column label. Default: as many as fit. */
  colStride?: number;
  /** Write each value inside its cell when there is room. */
  showValues?: boolean;
  color?: string;
  legend?: boolean;
  className?: string;
}

/**
 * نقشه‌ی حرارتی جدولی. Any rows × columns grid, such as weekday × hour traffic
 * or city × month sales. Column 0 is on the right; arrow keys move between cells.
 */
export function MatrixHeatmap({ rows, cols, values, title, description, format = (n) => fullFa(n), colStride, showValues = false, color = colorAt(1), legend = true, className }: MatrixHeatmapProps) {
  const [active, setActive] = React.useState<[number, number] | null>(null);
  const max = Math.max(1, ...values.flat());
  const sideW = Math.max(...rows.map((r) => r.length * 7 + 10));
  const onKeyDown = (e: React.KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowLeft: [0, 1], ArrowRight: [0, -1] };
    if (e.key === "Escape") return setActive(null);
    if (!(e.key in d)) return;
    e.preventDefault();
    setActive((a) => (a === null ? [0, 0] : [Math.max(0, Math.min(rows.length - 1, a[0] + d[e.key][0])), Math.max(0, Math.min(cols.length - 1, a[1] + d[e.key][1]))]));
  };
  const head = 18, gap = 2;
  return (
    <ChartFrame
      title={title}
      description={description}
      height={0}
      className={className}
      keyboard={{ onKeyDown, onBlur: () => setActive(null) }}
      onPointerLeave={() => setActive(null)}
      announce={active ? `${rows[active[0]]}، ${cols[active[1]]}: ${format(values[active[0]]?.[active[1]] ?? 0)}` : ""}
      legendPosition="bottom"
      legend={legend ? <ScaleLegend color={color} /> : undefined}
      table={{ head: ["", ...cols], rows: rows.map((r, i) => [r, ...cols.map((_, j) => format(values[i]?.[j] ?? 0))]) }}
      autoHeight={(width) => {
        const cw = (width - sideW) / cols.length;
        return head + rows.length * Math.max(14, Math.min(34, cw * 0.8));
      }}
    >
      {(width) => {
        const cw = (width - sideW) / cols.length;
        const ch = Math.max(14, Math.min(34, cw * 0.8));
        const right = width - sideW;
        const stride = colStride ?? Math.max(1, Math.ceil(28 / cw));
        const x = (j: number) => right - (j + 1) * cw;
        const y = (i: number) => head + i * ch;
        return (
          <>
            <svg width={width} height={head + rows.length * ch} className="block" aria-hidden>
              {cols.map((c, j) => (j % stride === 0 ? <Label key={j} x={x(j) + cw / 2} y={11} size={10}>{c}</Label> : null))}
              {rows.map((r, i) => (
                <Label key={r} anchor="right" x={width - 2} y={y(i) + ch / 2} dy="0.35em" size={11} muted={active?.[0] !== i}>
                  {r}
                </Label>
              ))}
              {rows.map((_, i) =>
                cols.map((_, j) => {
                  const v = values[i]?.[j] ?? 0;
                  const on = active?.[0] === i && active?.[1] === j;
                  const lvl = v / max;
                  return (
                    <g key={`${i}-${j}`} onPointerEnter={() => setActive([i, j])}>
                      <rect x={x(j) + gap / 2} y={y(i) + gap / 2} width={cw - gap} height={ch - gap} rx={3} fill={v ? color : "var(--foreground)"} fillOpacity={v ? 0.12 + lvl * 0.88 : 0.05} stroke={on ? "var(--foreground)" : "none"} strokeWidth={2} />
                      {showValues && cw > 26 && v > 0 && (
                        <Label x={x(j) + cw / 2} y={y(i) + ch / 2} dy="0.35em" size={9} muted={false} fill={lvl > 0.55 ? "var(--background)" : "var(--foreground)"} pointerEvents="none">
                          {format(v)}
                        </Label>
                      )}
                    </g>
                  );
                }),
              )}
            </svg>
            {active && <ChartTooltip width={width} state={{ x: x(active[1]) + cw / 2, y: y(active[0]) + ch / 2, title: `${rows[active[0]]}، ${cols[active[1]]}`, rows: [{ key: "v", label: "مقدار", value: format(values[active[0]]?.[active[1]] ?? 0), color }] }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
