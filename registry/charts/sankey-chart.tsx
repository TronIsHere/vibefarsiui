"use client";

import * as React from "react";
import { fullFa, percentFa, textWidth } from "@/lib/chart-utils";
import { ChartFrame, ChartTooltip, Label, announceRows, colorAt, useActive, type ValueFormat } from "@/registry/charts/chart-core";

export type SankeyNode = { id: string; label: string; color?: string };
export type SankeyLink = { source: string; target: string; value: number };

export interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  title: string;
  description?: string;
  height?: number;
  format?: ValueFormat;
  /** Node bar thickness in px. */
  nodeWidth?: number;
  /** Vertical gap between nodes in a column. */
  nodePadding?: number;
  animate?: boolean;
  className?: string;
}

type Placed = SankeyNode & { col: number; value: number; x: number; y: number; h: number; color: string; inOff: number; outOff: number };
type Band = SankeyLink & { from: Placed; to: Placed; y0: number; y1: number; w: number };

/** Column of each node: its longest distance from a source. Cycles are cut at the first repeat. */
function columns(nodes: SankeyNode[], links: SankeyLink[]) {
  const col = new Map(nodes.map((n) => [n.id, 0]));
  for (let pass = 0; pass < nodes.length; pass++) {
    let changed = false;
    for (const l of links) {
      const next = (col.get(l.source) ?? 0) + 1;
      if (next > (col.get(l.target) ?? 0) && next < nodes.length) { col.set(l.target, next); changed = true; }
    }
    if (!changed) break;
  }
  return col;
}

/**
 * نمودار سنکی. Flow between stages (traffic source → page → outcome, budget → department
 * → expense). Sources sit on the right and the flow runs leftward, like the text.
 * Band width is proportional to the value.
 */
export function SankeyChart({ nodes, links, title, description, height = 320, format = (n) => fullFa(n), nodeWidth = 12, nodePadding = 14, animate = true, className }: SankeyChartProps) {
  const valid = links.filter((l) => l.value > 0 && nodes.some((n) => n.id === l.source) && nodes.some((n) => n.id === l.target));
  const kb = useActive(valid.length);
  const active = kb.active;
  const total = (id: string) => Math.max(valid.filter((l) => l.source === id).reduce((s, l) => s + l.value, 0), valid.filter((l) => l.target === id).reduce((s, l) => s + l.value, 0));
  const label = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;
  const rows = (i: number) => {
    const l = valid[i];
    return [
      { key: "v", label: "مقدار", value: format(l.value) },
      { key: "s", label: `از کل ${label(l.source)}`, value: percentFa((l.value / (total(l.source) || 1)) * 100, 1) },
    ];
  };

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      empty={valid.length === 0}
      keyboard={kb}
      onPointerLeave={() => kb.setActive(null)}
      announce={active !== null ? announceRows(`${label(valid[active].source)} به ${label(valid[active].target)}`, rows(active)) : ""}
      table={{ head: ["از", "به", "مقدار"], rows: valid.map((l) => [label(l.source), label(l.target), format(l.value)]) }}
    >
      {(width) => {
        const col = columns(nodes, valid);
        const cols = Math.max(...col.values()) + 1;
        const labelW = Math.min(width * 0.22, Math.max(...nodes.map((n) => textWidth(n.label, 11))) + 10);
        // Labels of the first column sit right of their bars, all others left, so inset both edges.
        const innerRight = width - labelW;
        const innerLeft = labelW;
        const xOf = (c: number) => (cols === 1 ? innerRight - nodeWidth : innerRight - nodeWidth - (c / (cols - 1)) * (innerRight - innerLeft - nodeWidth));

        const byCol: Placed[][] = Array.from({ length: cols }, () => []);
        nodes.forEach((n, i) => {
          const v = total(n.id);
          if (!v) return;
          const c = col.get(n.id) ?? 0;
          byCol[c].push({ ...n, col: c, value: v, x: xOf(c), y: 0, h: 0, color: n.color ?? colorAt(i), inOff: 0, outOff: 0 });
        });
        const scale = Math.min(...byCol.filter((c) => c.length).map((c) => (height - nodePadding * (c.length - 1)) / c.reduce((s, n) => s + n.value, 0)));
        for (const list of byCol) {
          const used = list.reduce((s, n) => s + n.value * scale, 0) + nodePadding * (list.length - 1);
          let y = (height - used) / 2;
          for (const n of list) { n.h = Math.max(1, n.value * scale); n.y = y; y += n.h + nodePadding; }
        }
        const placed = new Map(byCol.flat().map((n) => [n.id, n]));
        const bands: Band[] = [];
        // Keep bands in the order of their far end so they do not cross needlessly.
        const order = [...valid].map((l, i) => ({ l, i })).sort((a, b) => (placed.get(a.l.target)?.y ?? 0) - (placed.get(b.l.target)?.y ?? 0));
        const tmp = new Map<number, Band>();
        for (const { l, i } of order) {
          const from = placed.get(l.source), to = placed.get(l.target);
          if (!from || !to) continue;
          const w = l.value * scale;
          tmp.set(i, { ...l, from, to, w, y0: from.y + from.outOff + w / 2, y1: 0 });
          from.outOff += w;
        }
        const order2 = [...tmp.entries()].sort((a, b) => a[1].from.y - b[1].from.y);
        for (const [, b] of order2) { b.y1 = b.to.y + b.to.inOff + b.w / 2; b.to.inOff += b.w; }
        valid.forEach((_, i) => { const b = tmp.get(i); if (b) bands[i] = b; });

        const path = (b: Band) => {
          const x0 = b.from.x, x1 = b.to.x + nodeWidth;
          const mid = (x0 + x1) / 2;
          return `M${x0},${b.y0} C${mid},${b.y0} ${mid},${b.y1} ${x1},${b.y1}`;
        };
        const tip = active !== null && bands[active] ? bands[active] : null;

        return (
          <>
            <svg width={width} height={height} className="block overflow-visible" aria-hidden>
              <g fill="none">
                {bands.map((b, i) => b && (
                  <path
                    key={i}
                    d={path(b)}
                    stroke={b.from.color}
                    strokeOpacity={active === null ? 0.32 : active === i ? 0.6 : 0.1}
                    strokeWidth={Math.max(1, b.w)}
                    onPointerEnter={() => kb.setActive(i)}
                    className={animate ? "vf-mark vf-fade" : "vf-mark"}
                  />
                ))}
              </g>
              {[...placed.values()].map((n) => (
                <g key={n.id}>
                  <rect x={n.x} y={n.y} width={nodeWidth} height={n.h} rx={2} fill={n.color} />
                  {/* Sources label on their right edge; every other column labels to the left of its bar. */}
                  <Label anchor="right" x={n.col === 0 ? width - 2 : n.x - 6} y={n.y + n.h / 2 - (n.h > 26 ? 6 : 0)} dy="0.35em" muted={false} fontWeight={500}>{n.label}</Label>
                  {n.h > 26 && <Label anchor="right" x={n.col === 0 ? width - 2 : n.x - 6} y={n.y + n.h / 2 + 8} dy="0.35em" size={10}>{format(n.value)}</Label>}
                </g>
              ))}
            </svg>
            {tip && <ChartTooltip width={width} state={{ x: (tip.from.x + tip.to.x + nodeWidth) / 2, y: (tip.y0 + tip.y1) / 2, title: `${tip.from.label} ← ${tip.to.label}`, rows: rows(active!) }} />}
          </>
        );
      }}
    </ChartFrame>
  );
}
