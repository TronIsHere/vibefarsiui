"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";
import { JALALI_MONTHS, formatJalali, toJalali } from "@/lib/jalali";
import { addDays, dayKey, diffDays, eventColor, shortDay, timeTicks, type Zoom } from "@/lib/calendar-utils";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { SrOnly, dayInfo, useCalendar, useControllable, useToday } from "@/registry/calendar/calendar-core";

export type GanttTask = {
  id: string;
  title: string;
  /** First day (local calendar day). */
  start: Date;
  /** Last day, included. Same as start for a one-day task or a milestone. */
  end: Date;
  /** 0–1 */
  progress?: number;
  /** 1–7 palette slot or a CSS color. */
  color?: number | string;
  /** Tasks that must finish before this one starts (drawn as arrows). */
  dependsOn?: string[];
  milestone?: boolean;
  /** Optional group label shown above its first task. */
  group?: string;
};

export interface GanttChartProps {
  tasks: GanttTask[];
  zoom?: Zoom;
  defaultZoom?: Zoom;
  onZoomChange?: (zoom: Zoom) => void;
  /** Visible range. Defaults to the tasks' span plus a few days. */
  from?: Date;
  to?: Date;
  onTaskClick?: (task: GanttTask) => void;
  /** Turns on drag to move, drag the edges to resize, and Alt+arrows on a focused bar. */
  onTaskChange?: (task: GanttTask, start: Date, end: Date) => void;
  /** Width of the task list on the right. Default 200. */
  listWidth?: number;
  rowHeight?: number;
  /** Tint holidays (and the weekend at day zoom). Default true. */
  showHolidays?: boolean;
  className?: string;
}

const DAY_WIDTH: Record<Zoom, number> = { day: 34, week: 16, month: 5 };
const ZOOM_LABELS: Record<Zoom, string> = { day: "روز", week: "هفته", month: "ماه" };
const HEAD = 48;

type Drag = { id: string; mode: "move" | "start" | "end"; x0: number; delta: number };

/**
 * گانت. Tasks on a Jalali time axis that runs right to left, with the list
 * on the right, progress inside each bar, dependency arrows, milestones, a
 * today line and holidays tinted. Zoom by day, week or month.
 */
export function GanttChart({ tasks, zoom, defaultZoom = "day", onZoomChange, from, to, onTaskClick, onTaskChange, listWidth = 200, rowHeight = 36, showHolidays = true, className }: GanttChartProps) {
  const settings = useCalendar();
  const today = useToday();
  const [z, setZoom] = useControllable(zoom, defaultZoom, onZoomChange);
  const [drag, setDrag] = React.useState<Drag | null>(null);
  const dw = DAY_WIDTH[z];

  const range = React.useMemo(() => {
    if (from && to) return { start: from, end: to };
    const s = tasks.reduce((m, t) => (t.start < m ? t.start : m), tasks[0]?.start ?? today);
    const e = tasks.reduce((m, t) => (t.end > m ? t.end : m), tasks[0]?.end ?? today);
    const pad = z === "day" ? 3 : z === "week" ? 7 : 20;
    return { start: from ?? addDays(s, -pad), end: to ?? addDays(e, pad) };
  }, [tasks, from, to, z, today]);

  const days = diffDays(range.start, range.end) + 1;
  const width = days * dw;
  const off = (d: Date) => diffDays(range.start, d) * dw;

  // Apply an in-progress drag to a task's days.
  const shown = (t: GanttTask) => {
    if (!drag || drag.id !== t.id) return { start: t.start, end: t.end };
    const s = drag.mode === "end" ? t.start : addDays(t.start, drag.delta);
    const e = drag.mode === "start" ? t.end : addDays(t.end, drag.delta);
    return s > e ? { start: e, end: e } : { start: s, end: e };
  };

  const rows: ({ kind: "group"; label: string } | { kind: "task"; task: GanttTask; index: number })[] = [];
  tasks.forEach((task, index) => {
    if (task.group && task.group !== tasks[index - 1]?.group) rows.push({ kind: "group", label: task.group });
    rows.push({ kind: "task", task, index });
  });
  const rowOf = new Map(rows.map((r, i) => [r.kind === "task" ? r.task.id : `g${i}`, i]));
  const height = rows.length * rowHeight;

  const dayTicks = timeTicks(range.start, addDays(range.end, 1), z === "day" ? "day" : z === "week" ? "week" : "month");
  const monthTicks = timeTicks(range.start, addDays(range.end, 1), "month");
  // Name the month the range starts in, unless it starts on the 1st.
  if (toJalali(range.start).jd > 1 && toJalali(range.start).jd < 25) monthTicks.unshift({ date: range.start, label: JALALI_MONTHS[toJalali(range.start).jm - 1], major: false });
  const offDays = showHolidays
    ? Array.from({ length: days }, (_, i) => addDays(range.start, i)).filter((d) => {
        const info = dayInfo(d, settings, today);
        return info.holiday || (z === "day" && info.isWeekend);
      })
    : [];

  function onDown(e: React.PointerEvent, task: GanttTask, mode: Drag["mode"]) {
    e.stopPropagation();
    if (e.button !== 0) return;
    if (!onTaskChange) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id: task.id, mode, x0: e.clientX, delta: 0 });
  }
  function onMove(e: React.PointerEvent) {
    if (!drag) return;
    // Moving left is later in time.
    setDrag({ ...drag, delta: -Math.round((e.clientX - drag.x0) / dw) });
  }
  function onUp(task: GanttTask) {
    if (!drag) return onTaskClick?.(task);
    const s = shown(task);
    if (drag.delta) onTaskChange?.(task, s.start, s.end);
    else onTaskClick?.(task);
    setDrag(null);
  }
  function onKey(e: React.KeyboardEvent, task: GanttTask) {
    if (e.key === "Enter") return onTaskClick?.(task);
    if (!onTaskChange || !e.altKey) return;
    const dir = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    if (e.shiftKey) onTaskChange(task, task.start, addDays(task.end, dir) < task.start ? task.start : addDays(task.end, dir));
    else onTaskChange(task, addDays(task.start, dir), addDays(task.end, dir));
  }

  const todayOff = diffDays(range.start, today);
  const scroller = React.useRef<HTMLDivElement>(null);
  // Open with today in view. In RTL, scrollLeft runs from 0 (right edge) to negative.
  React.useEffect(() => {
    const el = scroller.current;
    if (!el || todayOff < 0 || todayOff >= days) return;
    el.scrollLeft = -Math.max(0, todayOff * dw - el.clientWidth / 2);
    // Only when the zoom or range changes, not while dragging.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dw, range.start.getTime()]);
  const byId = new Map(tasks.map((t) => [t.id, t]));

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {formatJalali(range.start, { year: toJalali(range.start).jy !== toJalali(range.end).jy })} تا {formatJalali(range.end)}
        </p>
        <SegmentedControl size="sm" aria-label="بزرگ‌نمایی" value={z} onChange={(v) => setZoom(v as Zoom)} options={(["day", "week", "month"] as Zoom[]).map((v) => ({ value: v, label: ZOOM_LABELS[v] }))} />
      </div>
      <div className="flex overflow-hidden rounded-surface border-line bg-card">
        {/* task list (right) */}
        <div className="shrink-0 border-e" style={{ width: listWidth }}>
          <div className="flex items-end border-b px-3 pb-1.5 text-[11px] text-muted-foreground" style={{ height: HEAD }}>
            کار
          </div>
          {rows.map((r, i) =>
            r.kind === "group" ? (
              <div key={`g${i}`} className="flex items-center bg-muted/40 px-3 text-xs font-bold" style={{ height: rowHeight }}>
                {r.label}
              </div>
            ) : (
              <div key={r.task.id} className="flex items-center gap-2 border-b border-border/60 px-3" style={{ height: rowHeight }}>
                <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: eventColor(r.task.color, r.index) }} />
                <span className="min-w-0 flex-1 truncate text-sm">{r.task.title}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">{r.task.milestone ? "نقطه" : `${fa(diffDays(r.task.start, r.task.end) + 1)} روز`}</span>
              </div>
            ),
          )}
        </div>
        {/* timeline (scrolls) */}
        <div ref={scroller} className="min-w-0 flex-1 overflow-x-auto">
          <div className="relative" style={{ width, height: HEAD + height }}>
            {/* header */}
            <div className="absolute inset-x-0 top-0 border-b" style={{ height: HEAD }}>
              {monthTicks.map((t) => (
                <span key={`m${dayKey(t.date)}`} className="absolute top-1 border-s px-1.5 text-[11px] font-semibold whitespace-nowrap" style={{ insetInlineStart: off(t.date) }}>
                  {t.label} {fa(toJalali(t.date).jy)}
                </span>
              ))}
              {z !== "month" &&
                dayTicks.map((t) => (
                  <span
                    key={`d${dayKey(t.date)}`}
                    className={cn("absolute bottom-1 text-center text-[10px] tabular-nums text-muted-foreground", t.major && "font-semibold text-foreground")}
                    style={{ insetInlineStart: off(t.date), width: z === "day" ? dw : undefined, paddingInlineStart: z === "week" ? 4 : undefined }}
                  >
                    {t.label}
                  </span>
                ))}
            </div>
            {/* grid, holidays, today */}
            <div className="absolute inset-x-0 bottom-0" style={{ top: HEAD }}>
              {offDays.map((d) => (
                <span key={dayKey(d)} className="absolute inset-y-0 bg-destructive/[0.06]" style={{ insetInlineStart: off(d), width: Math.max(dw, 2) }} />
              ))}
              {(z === "day" ? dayTicks : monthTicks).map((t) => (
                <span key={`l${dayKey(t.date)}`} className={cn("absolute inset-y-0 border-s", t.major ? "border-border" : "border-border/40")} style={{ insetInlineStart: off(t.date) }} />
              ))}
              {rows.map((r, i) => (
                <span key={`r${i}`} className={cn("absolute inset-x-0 border-b border-border/60", r.kind === "group" && "bg-muted/40")} style={{ top: i * rowHeight, height: rowHeight }} />
              ))}
              {todayOff >= 0 && todayOff < days && (
                <span className="absolute inset-y-0 z-10 w-0.5 bg-destructive" style={{ insetInlineStart: todayOff * dw + dw / 2 }} title={`امروز، ${shortDay(today)}`} />
              )}
            </div>
            {/* dependency arrows (physical coords: x = width - offset) */}
            <svg className="pointer-events-none absolute inset-x-0 z-10 overflow-visible" style={{ top: HEAD }} width={width} height={height} aria-hidden>
              <defs>
                <marker id="gantt-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--color-muted-foreground)" />
                </marker>
              </defs>
              {tasks.flatMap((t) =>
                (t.dependsOn ?? []).map((id) => {
                  const p = byId.get(id);
                  if (!p) return null;
                  const ps = shown(p);
                  const ts = shown(t);
                  const x1 = width - (off(ps.end) + dw);
                  const y1 = rowOf.get(p.id)! * rowHeight + rowHeight / 2;
                  const x2 = width - off(ts.start);
                  const y2 = rowOf.get(t.id)! * rowHeight + rowHeight / 2;
                  return <path key={`${id}-${t.id}`} d={`M${x1},${y1} H${x1 - 6} V${y2} H${x2 + 2}`} fill="none" stroke="var(--color-muted-foreground)" strokeWidth={1.25} markerEnd="url(#gantt-arrow)" opacity={0.7} />;
                }),
              )}
            </svg>
            {/* bars */}
            <div className="absolute inset-x-0 z-20" style={{ top: HEAD, height }} onPointerMove={onMove} onPointerCancel={() => setDrag(null)}>
              {rows.map((r) => {
                if (r.kind !== "task") return null;
                const t = r.task;
                const s = shown(t);
                const color = eventColor(t.color, r.index);
                const top = rowOf.get(t.id)! * rowHeight;
                const label = `${t.title}، ${formatJalali(s.start, { year: false })} تا ${formatJalali(s.end, { year: false })}${t.progress != null ? `، ${fa(Math.round(t.progress * 100))}٪ انجام شده` : ""}`;
                if (t.milestone) {
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-label={`نقطه‌ی عطف: ${label}`}
                      onPointerDown={(e) => onDown(e, t, "move")}
                      onPointerUp={() => onUp(t)}
                      onKeyDown={(e) => onKey(e, t)}
                      className="absolute flex cursor-pointer items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-ring"
                      style={{ insetInlineStart: off(s.start) + dw / 2 - 7, top: top + rowHeight / 2 - 7, height: 14 }}
                    >
                      <span className="size-3.5 rotate-45 rounded-[2px]" style={{ background: color }} />
                      <span className="text-[11px] font-medium whitespace-nowrap">{t.title}</span>
                    </button>
                  );
                }
                const w = (diffDays(s.start, s.end) + 1) * dw;
                return (
                  <div key={t.id} className="absolute" style={{ insetInlineStart: off(s.start), width: w, top: top + 6, height: rowHeight - 12 }}>
                    <button
                      type="button"
                      aria-label={label}
                      onPointerDown={(e) => onDown(e, t, "move")}
                      onPointerUp={() => onUp(t)}
                      onKeyDown={(e) => onKey(e, t)}
                      className={cn("relative flex size-full items-center overflow-hidden rounded-control text-start focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring", onTaskChange ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-pointer")}
                      style={{ background: `color-mix(in oklch, ${color} 28%, var(--color-card))` }}
                    >
                      <span className="absolute inset-y-0 start-0" style={{ width: `${(t.progress ?? 0) * 100}%`, background: color }} />
                      {w > 56 && <span className="relative truncate px-2 text-[11px] font-medium mix-blend-normal">{t.title}</span>}
                    </button>
                    {onTaskChange && (
                      <>
                        <span aria-hidden onPointerDown={(e) => onDown(e, t, "start")} onPointerUp={() => onUp(t)} className="absolute inset-y-0 start-0 w-1.5 cursor-ew-resize" />
                        <span aria-hidden onPointerDown={(e) => onDown(e, t, "end")} onPointerUp={() => onUp(t)} className="absolute inset-y-0 end-0 w-1.5 cursor-ew-resize" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <SrOnly>
        <table>
          <caption>برنامه‌ی کارها</caption>
          <thead>
            <tr>
              <th>کار</th>
              <th>شروع</th>
              <th>پایان</th>
              <th>پیشرفت</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{formatJalali(t.start)}</td>
                <td>{formatJalali(t.end)}</td>
                <td>{t.progress != null ? `${fa(Math.round(t.progress * 100))}٪` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SrOnly>
    </div>
  );
}
