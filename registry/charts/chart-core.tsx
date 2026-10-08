"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { compactFa, extent, jalaliLabel, niceTicks, textWidth, type Domain } from "@/lib/chart-utils";

/* ---------- data model ---------- */

/** One row of chart data, e.g. { month: "فروردین", sales: 120, cost: 80 }. */
export type Row = Record<string, unknown>;

export type Series = {
  /** Field of each row that holds this series' number. */
  key: string;
  /** Persian name for the legend and tooltip. */
  label: string;
  /** Any CSS color; defaults to the palette slot of this series. */
  color?: string;
  /** Dashed stroke, e.g. a forecast or last year. */
  dashed?: boolean;
};

export type Reference = { value: number; label?: string; color?: string };

/**
 * Series colors. Each slot reads `--chart-N` first, so a design system can set
 * its own palette; the fallbacks are hue-separated and work on light and dark.
 */
export const CHART_COLORS = [
  "var(--chart-1, var(--brand))",
  "var(--chart-2, oklch(0.66 0.14 250))",
  "var(--chart-3, oklch(0.7 0.14 165))",
  "var(--chart-4, oklch(0.65 0.19 20))",
  "var(--chart-5, oklch(0.62 0.16 300))",
  "var(--chart-6, oklch(0.75 0.11 200))",
  "var(--chart-7, oklch(0.6 0.03 260))",
];

export function colorAt(i: number, own?: string) {
  return own ?? CHART_COLORS[i % CHART_COLORS.length];
}

/** Number at `key`, or null for missing/NaN so lines can break instead of falling to zero. */
export function num(row: Row | undefined, key: string): number | null {
  const v = row?.[key];
  if (typeof v === "number") return isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "" && isFinite(+v)) return +v;
  return null;
}

/** Default category label: Date → «۱۲ مهر», number → Persian digits, anything else as text. */
export function defaultLabel(v: unknown): string {
  if (v instanceof Date) return jalaliLabel(v);
  if (typeof v === "number") return fa(v);
  return String(v ?? "");
}

export type ValueFormat = (n: number) => string;
export const defaultFormat: ValueFormat = compactFa;

/* ---------- hooks ---------- */

/** Width of an element, kept current with ResizeObserver. 0 until mounted. */
export function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T>(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/** Hidden series keys, toggled from the legend. Never hides the last visible one. */
export function useHidden(series: { key: string }[]) {
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set());
  const toggle = React.useCallback(
    (key: string) =>
      setHidden((h) => {
        const next = new Set(h);
        if (next.has(key)) next.delete(key);
        else if (series.length - next.size > 1) next.add(key);
        return next;
      }),
    [series.length],
  );
  return { hidden, toggle };
}

/**
 * Active item for hover and keyboard. In RTL the next item is on the left,
 * so ArrowLeft moves forward and ArrowRight moves back; Home/End jump.
 */
export function useActive(count: number) {
  const [active, setActive] = React.useState<number | null>(null);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!count) return;
    const cur = active ?? -1;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.min(count - 1, cur + 1);
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.max(0, cur < 0 ? 0 : cur - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else if (e.key === "Escape") { setActive(null); return; }
    if (next !== null) { e.preventDefault(); setActive(next); }
  };
  return { active, setActive, onKeyDown, onBlur: () => setActive(null) };
}

/* ---------- styles ---------- */

const CSS = `
.vf-chart{--vf-ease:var(--motion-ease,cubic-bezier(.2,0,0,1));--vf-dur:calc(var(--motion,200ms)*4)}
.vf-chart text{font-family:inherit}
@keyframes vf-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes vf-grow{from{transform:scale(var(--vf-sx,1),var(--vf-sy,0))}}
@keyframes vf-fade{from{opacity:0}}
@keyframes vf-pop{from{opacity:0;transform:scale(.85)}}
.vf-draw{stroke-dasharray:1;animation:vf-draw var(--vf-dur) var(--vf-ease) both}
.vf-grow{transform-box:fill-box;animation:vf-grow var(--vf-dur) var(--vf-ease) both}
.vf-fade{animation:vf-fade var(--vf-dur) var(--vf-ease) both}
.vf-pop{transform-box:fill-box;transform-origin:center;animation:vf-pop var(--vf-dur) var(--vf-ease) both}
.vf-mark{transition:opacity var(--motion,200ms) var(--vf-ease)}
@media (prefers-reduced-motion:reduce){.vf-draw,.vf-grow,.vf-fade,.vf-pop{animation:none}}
`;

/** Keyframes shared by every chart, hoisted and de-duplicated by React 19. */
export function ChartStyles() {
  return (
    <style href="vf-chart" precedence="default">
      {CSS}
    </style>
  );
}

/* ---------- svg text ---------- */

/**
 * Persian label in SVG. `anchor` is the physical edge at `x`: "right" means the
 * text ends at x and runs leftward. The text is always laid out RTL so «۱۲ میلیون»
 * keeps the number on the right.
 */
export function Label({
  anchor = "middle",
  size = 11,
  muted = true,
  className,
  ...rest
}: Omit<React.SVGProps<SVGTextElement>, "textAnchor"> & { anchor?: "right" | "left" | "middle"; size?: number; muted?: boolean }) {
  return (
    <text
      direction="rtl"
      textAnchor={anchor === "right" ? "start" : anchor === "left" ? "end" : "middle"}
      fontSize={size}
      fill={muted ? "var(--muted-foreground)" : "var(--foreground)"}
      className={className}
      {...rest}
    />
  );
}

/* ---------- legend ---------- */

export function Legend({
  items,
  hidden,
  onToggle,
  className,
}: {
  items: { key: string; label: string; color: string; dashed?: boolean; value?: string }[];
  hidden?: Set<string>;
  onToggle?: (key: string) => void;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs", className)}>
      {items.map((s) => {
        const off = hidden?.has(s.key);
        const body = (
          <>
            <span
              aria-hidden
              className={cn("inline-block shrink-0", s.dashed ? "h-0 w-3.5 border-t-2 border-dashed" : "size-2.5 rounded-[3px]")}
              style={s.dashed ? { borderColor: s.color } : { background: s.color }}
            />
            <span className={cn("text-muted-foreground", off && "line-through opacity-60")}>{s.label}</span>
            {s.value && <span className="font-medium tabular-nums text-foreground">{s.value}</span>}
          </>
        );
        return (
          <li key={s.key}>
            {onToggle ? (
              <button
                type="button"
                aria-pressed={!off}
                onClick={() => onToggle(s.key)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                {body}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-1 py-0.5">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- tooltip ---------- */

export type TooltipRow = { key: string; label: string; value: string; color?: string; dashed?: boolean };
export type TooltipState = { x: number; y: number; title?: React.ReactNode; rows: TooltipRow[]; footer?: React.ReactNode };

/** HTML tooltip over the chart. Sits on the left of the point (reading direction) and flips near the left edge. */
export function ChartTooltip({ state, width }: { state: TooltipState | null; width: number }) {
  if (!state) return null;
  const flip = state.x < Math.min(220, width / 2);
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 min-w-36 max-w-64 rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
      style={{
        left: state.x,
        top: state.y,
        transform: `translate(${flip ? "12px" : "calc(-100% - 12px)"}, -50%)`,
      }}
    >
      {state.title && <div className="mb-1.5 font-medium text-foreground">{state.title}</div>}
      <ul className="space-y-1">
        {state.rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2">
            {r.color && (
              <span
                aria-hidden
                className={cn("inline-block shrink-0", r.dashed ? "h-0 w-3 border-t-2 border-dashed" : "size-2 rounded-[2px]")}
                style={r.dashed ? { borderColor: r.color } : { background: r.color }}
              />
            )}
            <span className="text-muted-foreground">{r.label}</span>
            <span className="ms-auto ps-3 font-medium tabular-nums text-foreground">{r.value}</span>
          </li>
        ))}
      </ul>
      {state.footer && <div className="mt-1.5 border-t border-border pt-1.5 text-muted-foreground">{state.footer}</div>}
    </div>
  );
}

/** «فروردین، فروش ۱۲۰، هزینه ۸۰» for the live region. */
export function announceRows(title: string, rows: TooltipRow[]) {
  return [title, ...rows.map((r) => `${r.label} ${r.value}`)].filter(Boolean).join("، ");
}

/* ---------- frame ---------- */

export type ChartFrameProps = {
  /** Accessible name, e.g. «فروش ماهانه». Also the caption of the hidden data table. */
  title: string;
  description?: string;
  height: number;
  /** Height that depends on the measured width (grids whose cells stay square). Wins over `height`. */
  autoHeight?: (width: number) => number;
  /** Rendered with the measured width once the box is on screen. */
  children: (width: number) => React.ReactNode;
  legend?: React.ReactNode;
  legendPosition?: "top" | "bottom";
  /** Text for the polite live region, e.g. the active point read aloud for keyboard users. */
  announce?: string;
  /** Hidden table read by screen readers: header row plus body rows. */
  table?: { head: string[]; rows: (string | number)[][] };
  keyboard?: { onKeyDown: (e: React.KeyboardEvent) => void; onBlur: () => void };
  onPointerLeave?: () => void;
  empty?: boolean;
  emptyText?: string;
  className?: string;
};

/**
 * Shared shell: measures width, hosts the legend, a polite live region for
 * keyboard users, and an sr-only table with the raw numbers. Charts render
 * their own <ChartTooltip> inside `children`, where the geometry is known.
 */
export function ChartFrame({
  title,
  description,
  height,
  autoHeight,
  children,
  legend,
  legendPosition = "top",
  announce,
  table,
  keyboard,
  onPointerLeave,
  empty,
  emptyText = "داده‌ای برای نمایش نیست",
  className,
}: ChartFrameProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  return (
    <figure className={cn("vf-chart m-0 flex w-full min-w-0 flex-col gap-3", className)}>
      <ChartStyles />
      {legend && legendPosition === "top" && legend}
      <div
        ref={ref}
        className="relative w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        style={{ height: autoHeight ? (width > 0 ? autoHeight(width) : 140) : height }}
        tabIndex={keyboard && !empty ? 0 : undefined}
        role="group"
        aria-label={title}
        aria-roledescription="نمودار"
        onKeyDown={keyboard?.onKeyDown}
        onBlur={keyboard?.onBlur}
        onPointerLeave={onPointerLeave}
      >
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">{emptyText}</div>
        ) : (
          width > 0 && children(width)
        )}
        <div className="sr-only" aria-live="polite">{announce}</div>
      </div>
      {legend && legendPosition === "bottom" && legend}
      {description && <figcaption className="sr-only">{description}</figcaption>}
      {table && (
        // Wrapped: a <table> ignores the 1px box of sr-only and would widen the page.
        <div className="sr-only">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>{table.head.map((h, j) => <th key={j} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}

/* ---------- cartesian pieces ---------- */

export type Box = { left: number; right: number; top: number; bottom: number; width: number; height: number };

/** Plot rectangle after reserving room for the right value axis, an optional left axis, and the category axis. */
export function plotBox(width: number, height: number, opts: { yLabels?: string[]; y2Labels?: string[]; xAxis?: boolean; yAxis?: boolean; top?: number }): Box {
  const yw = opts.yAxis === false ? 4 : Math.max(24, ...(opts.yLabels ?? []).map((l) => textWidth(l, 10))) + 10;
  const y2w = opts.y2Labels?.length ? Math.max(24, ...opts.y2Labels.map((l) => textWidth(l, 10))) + 10 : 6;
  const top = opts.top ?? 10;
  const bottom = height - (opts.xAxis === false ? 6 : 26);
  return { left: y2w, right: width - yw, top, bottom, width, height };
}

/** Horizontal grid lines with value labels on the right edge (and the zero line a little stronger). */
export function ValueGrid({ box, ticks, y, format, grid = true, axis = true, side = "right" }: { box: Box; ticks: number[]; y: (v: number) => number; format: ValueFormat; grid?: boolean; axis?: boolean; side?: "right" | "left" }) {
  return (
    <g aria-hidden>
      {ticks.map((t) => (
        <g key={t}>
          {grid && side === "right" && (
            <line x1={box.left} x2={box.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeOpacity={t === 0 ? 1 : 0.6} strokeDasharray={t === 0 ? undefined : "3 3"} />
          )}
          {axis && (
            <Label anchor={side === "right" ? "right" : "left"} x={side === "right" ? box.width - 2 : 2} y={y(t)} dy="0.35em" size={10}>
              {format(t)}
            </Label>
          )}
        </g>
      ))}
    </g>
  );
}

/** Category labels under the plot, thinned so they never overlap. */
export function CategoryAxis({ box, labels, x, stride = 1, highlight }: { box: Box; labels: string[]; x: (i: number) => number; stride?: number; highlight?: number | null }) {
  return (
    <g aria-hidden>
      {labels.map((l, i) =>
        i % stride === 0 || i === highlight ? (
          <Label key={i} x={x(i)} y={box.bottom + 17} muted={i !== highlight} size={11}>
            {l}
          </Label>
        ) : null,
      )}
    </g>
  );
}

/** Dashed horizontal reference lines, e.g. a target or an average, labelled at the left end. */
export function References({ box, refs, y }: { box: Box; refs?: Reference[]; y: (v: number) => number }) {
  if (!refs?.length) return null;
  return (
    <g aria-hidden>
      {refs.map((r, i) => {
        const yy = y(r.value);
        if (yy < box.top - 1 || yy > box.bottom + 1) return null;
        const c = r.color ?? "var(--foreground)";
        return (
          <g key={i}>
            <line x1={box.left} x2={box.right} y1={yy} y2={yy} stroke={c} strokeOpacity={0.55} strokeDasharray="6 4" />
            {r.label && (
              <Label anchor="right" x={box.left + textWidth(r.label, 10) + 6} y={yy - 5} size={10} fill={c}>
                {r.label}
              </Label>
            )}
          </g>
        );
      })}
    </g>
  );
}

export type DomainOption = "auto" | "zero" | [number, number];

/** Round ticks for the values on screen. "zero" keeps 0 in range (bars, areas); a fixed pair is used as is. */
export function valueTicks(values: number[], domain: DomainOption, height: number): { domain: Domain; ticks: number[] } {
  const count = Math.max(3, Math.min(7, Math.floor((height - 40) / 48)));
  if (Array.isArray(domain)) {
    return { domain, ticks: niceTicks(domain[0], domain[1], count).ticks.filter((t) => t >= domain[0] - 1e-9 && t <= domain[1] + 1e-9) };
  }
  const [lo, hi] = extent(values, domain === "zero");
  return niceTicks(lo, hi, count);
}

/** Pointer x → nearest index, using the plot box's own coordinates. */
export function pointerX(e: React.PointerEvent<SVGElement>) {
  const r = (e.currentTarget.ownerSVGElement ?? (e.currentTarget as SVGSVGElement)).getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
