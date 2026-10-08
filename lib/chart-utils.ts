/**
 * Chart math for the VibeFarsi chart kit: nice ticks, scales, stacking,
 * curve and arc paths, squarified treemaps, Jalali time ticks and Persian
 * number formats. Dependency-free and framework-free, so it is easy to test.
 */
import { fa, faNumber } from "@/lib/utils";
import { JALALI_MONTHS, jalaliMonthLength, toGregorian, toJalali } from "@/lib/jalali";

/* ---------- formats ---------- */

/** Compact Persian number: ۱۲٫۵ میلیون / ۸۰۰ هزار / ۹۵۰ / −۳٫۲ هزار */
export function compactFa(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  const one = (v: number) => fa(String(+v.toFixed(1)).replace(".", "٫"));
  if (abs >= 1e12) return `${sign}${one(abs / 1e12)} هزار میلیارد`;
  if (abs >= 1e9) return `${sign}${one(abs / 1e9)} میلیارد`;
  if (abs >= 1e6) return `${sign}${one(abs / 1e6)} میلیون`;
  if (abs >= 1e4) return `${sign}${one(abs / 1e3)} هزار`;
  return fullFa(n, 2);
}

/** Full Persian number with «٬» separators and up to `digits` decimals. */
export function fullFa(n: number, digits = 0): string {
  if (digits === 0) return (n < 0 ? "−" : "") + faNumber(Math.abs(n));
  const [i, d] = Math.abs(n).toFixed(digits).split(".");
  return (n < 0 ? "−" : "") + faNumber(+i) + (+d ? "٫" + fa(d.replace(/0+$/, "")) : "");
}

/** ۴۲٪ — the percent sign follows the number in Persian. */
export function percentFa(n: number, digits = 0): string {
  return `${fullFa(n, digits)}٪`;
}

/** Short Jalali day label «۱۲ مهر», or «مهر ۱۴۰۵» with `month`. */
export function jalaliLabel(date: Date, unit: "day" | "month" | "year" = "day"): string {
  const { jy, jm, jd } = toJalali(date);
  if (unit === "year") return fa(jy);
  if (unit === "month") return `${JALALI_MONTHS[jm - 1]} ${fa(jy)}`;
  return `${fa(jd)} ${JALALI_MONTHS[jm - 1]}`;
}

/* ---------- ticks and scales ---------- */

export type Domain = [number, number];

/** Round ticks covering [min, max]: steps of 1, 2, 2.5 or 5 × 10ⁿ. Always includes 0 when the range crosses it. */
export function niceTicks(min: number, max: number, count = 5): { domain: Domain; ticks: number[] } {
  if (!isFinite(min) || !isFinite(max)) return { domain: [0, 1], ticks: [0, 1] };
  if (min === max) {
    if (min === 0) return { domain: [0, 1], ticks: [0, 0.25, 0.5, 0.75, 1] };
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  const raw = (max - min) / Math.max(1, count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  const lo = Math.floor(min / step + 1e-9) * step;
  const hi = Math.ceil(max / step - 1e-9) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10));
  return { domain: [lo, hi], ticks };
}

/** Value domain for series data; bars want 0 in the domain, lines don't have to. */
export function extent(values: number[], includeZero = true): Domain {
  let lo = Infinity, hi = -Infinity;
  for (const v of values) if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  if (lo === Infinity) return [0, 1];
  if (includeZero) { lo = Math.min(0, lo); hi = Math.max(0, hi); }
  else if (lo !== hi) {
    // Pad so points don't sit on the frame, but never push all-positive data below zero.
    const pad = (hi - lo) * 0.08;
    lo = lo >= 0 ? Math.max(0, lo - pad) : lo - pad;
    hi = hi <= 0 ? Math.min(0, hi + pad) : hi + pad;
  }
  return [lo, hi];
}

export type Scale = ((v: number) => number) & { domain: Domain; range: Domain; invert: (px: number) => number };

export function linearScale(domain: Domain, range: Domain): Scale {
  const [d0, d1] = domain, [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const s = ((v: number) => r0 + (v - d0) * k) as Scale;
  s.domain = domain;
  s.range = range;
  s.invert = (px) => (k === 0 ? d0 : d0 + (px - r0) / k);
  return s;
}

/**
 * Band positions for `n` categories laid out right-to-left: index 0 sits at the
 * right edge (`right`), the last one at `left`. Returns the start x (left edge)
 * of each band, the band width and the step between bands.
 */
export function bandScale(n: number, left: number, right: number, padding = 0.2) {
  const step = (right - left) / Math.max(1, n);
  const band = step * (1 - padding);
  const x = (i: number) => right - (i + 1) * step + (step - band) / 2;
  return { x, band, step, center: (i: number) => x(i) + band / 2, index: (px: number) => Math.min(n - 1, Math.max(0, Math.floor((right - px) / step))) };
}

/** Point positions for `n` items right-to-left, first point on `right`. */
export function pointScale(n: number, left: number, right: number) {
  const step = n > 1 ? (right - left) / (n - 1) : 0;
  return {
    x: (i: number) => (n > 1 ? right - i * step : (left + right) / 2),
    step,
    index: (px: number) => (n > 1 ? Math.min(n - 1, Math.max(0, Math.round((right - px) / step))) : 0),
  };
}

/** Show every k-th label so labels of `labelWidth` px never collide in `span` px. */
export function labelStride(n: number, span: number, labelWidth: number): number {
  if (n <= 1 || span <= 0) return 1;
  return Math.max(1, Math.ceil((n * labelWidth) / span));
}

/** Rough width of a Persian label at `size` px, for layout before the DOM exists. */
export function textWidth(s: string, size = 11): number {
  return s.length * size * 0.58 + 4;
}

/* ---------- stacking ---------- */

export type StackMode = "none" | "stacked" | "percent";

/**
 * Stacks `keys` over rows. Positive and negative values stack away from zero
 * separately. Returns [y0, y1] per key per row.
 */
export function stackRows(rows: number[][], mode: StackMode): [number, number][][] {
  const k = rows[0]?.length ?? 0;
  const out: [number, number][][] = Array.from({ length: k }, () => []);
  rows.forEach((vals) => {
    const total = mode === "percent" ? vals.reduce((s, v) => s + Math.abs(v || 0), 0) || 1 : 1;
    let pos = 0, neg = 0;
    vals.forEach((raw, j) => {
      const v = mode === "percent" ? ((raw || 0) / total) * 100 : raw || 0;
      if (mode === "none") { out[j].push([0, v]); return; }
      if (v >= 0) { out[j].push([pos, pos + v]); pos += v; }
      else { out[j].push([neg, neg + v]); neg += v; }
    });
  });
  return out;
}

/* ---------- paths ---------- */

export type Pt = [number, number];
export type Curve = "linear" | "monotone" | "step";

/** SVG path through points. `monotone` never overshoots (Fritsch–Carlson), so a line never dips below 0 between two positive points. */
export function linePath(pts: Pt[], curve: Curve = "monotone"): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${pts[0][0]},${pts[0][1]}`;
  if (curve === "linear") return "M" + pts.map((p) => `${p[0]},${p[1]}`).join("L");
  if (curve === "step") {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1][0] + pts[i][0]) / 2;
      d += `H${mx}V${pts[i][1]}H${pts[i][0]}`;
    }
    return d;
  }
  const n = pts.length;
  const dx: number[] = [], m: number[] = [], t: number[] = new Array(n);
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = dx[i] === 0 ? 0 : (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1] * m[i] <= 0) t[i] = 0;
    else {
      const w1 = 2 * dx[i] + dx[i - 1], w2 = dx[i] + 2 * dx[i - 1];
      t[i] = (w1 + w2) / (w1 / m[i - 1] + w2 / m[i]);
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

/** Closed area between a top line and a bottom line (same x positions). */
export function areaPath(top: Pt[], bottom: Pt[], curve: Curve = "monotone"): string {
  if (!top.length) return "";
  const back = linePath([...bottom].reverse(), curve).replace(/^M/, "L");
  return `${linePath(top, curve)}${back}Z`;
}

/** Splits points at nulls so a missing value breaks the line instead of dropping to zero. */
export function segments(values: (number | null | undefined)[], x: (i: number) => number, y: (v: number) => number): { pts: Pt[]; idx: number[] }[] {
  const out: { pts: Pt[]; idx: number[] }[] = [];
  let cur: { pts: Pt[]; idx: number[] } | null = null;
  values.forEach((v, i) => {
    if (v == null || !isFinite(v)) { cur = null; return; }
    if (!cur) { cur = { pts: [], idx: [] }; out.push(cur); }
    cur.pts.push([x(i), y(v)]);
    cur.idx.push(i);
  });
  return out;
}

/** Point on a circle. Angle 0 is 12 o'clock and grows clockwise. */
export function polar(cx: number, cy: number, r: number, a: number): Pt {
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

/** Ring segment from angle a0 to a1 (radians, clockwise from 12 o'clock). r0 = 0 draws a pie slice. */
export function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const sweep = a1 - a0;
  if (sweep <= 0) return "";
  if (sweep >= Math.PI * 2 - 1e-6) {
    const outer = `M${cx},${cy - r1}A${r1},${r1} 0 1 1 ${cx},${cy + r1}A${r1},${r1} 0 1 1 ${cx},${cy - r1}Z`;
    return r0 > 0 ? `${outer}M${cx},${cy - r0}A${r0},${r0} 0 1 0 ${cx},${cy + r0}A${r0},${r0} 0 1 0 ${cx},${cy - r0}Z` : outer;
  }
  const large = sweep > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0), [x1, y1] = polar(cx, cy, r1, a1);
  if (r0 <= 0) return `M${cx},${cy}L${x0},${y0}A${r1},${r1} 0 ${large} 1 ${x1},${y1}Z`;
  const [x2, y2] = polar(cx, cy, r0, a1), [x3, y3] = polar(cx, cy, r0, a0);
  return `M${x0},${y0}A${r1},${r1} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${r0},${r0} 0 ${large} 0 ${x3},${y3}Z`;
}

/** Rectangle with only some corners rounded, e.g. just the far end of a bar. */
export function roundedRect(x: number, y: number, w: number, h: number, r: number, corners: { tl?: boolean; tr?: boolean; br?: boolean; bl?: boolean }): string {
  if (w <= 0 || h <= 0) return "";
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  const tl = corners.tl ? k : 0, tr = corners.tr ? k : 0, br = corners.br ? k : 0, bl = corners.bl ? k : 0;
  return `M${x + tl},${y}H${x + w - tr}${tr ? `A${tr},${tr} 0 0 1 ${x + w},${y + tr}` : ""}V${y + h - br}${br ? `A${br},${br} 0 0 1 ${x + w - br},${y + h}` : ""}H${x + bl}${bl ? `A${bl},${bl} 0 0 1 ${x},${y + h - bl}` : ""}V${y + tl}${tl ? `A${tl},${tl} 0 0 1 ${x + tl},${y}` : ""}Z`;
}

/* ---------- treemap ---------- */

export type Rect = { x: number; y: number; w: number; h: number };

/** Squarified treemap (Bruls et al.). Largest item lands top-right so the eye starts where Persian reading starts. */
export function squarify(values: number[], rect: Rect): Rect[] {
  const order = values.map((v, i) => [Math.max(0, v), i] as const).sort((a, b) => b[0] - a[0]);
  const total = order.reduce((s, [v]) => s + v, 0) || 1;
  const scale = (rect.w * rect.h) / total;
  const out: Rect[] = new Array(values.length);
  const { x } = rect;
  let { y, w, h } = rect;
  let row: (readonly [number, number])[] = [];
  const worst = (r: (readonly [number, number])[], side: number) => {
    const s = r.reduce((a, [v]) => a + v * scale, 0);
    const max = Math.max(...r.map(([v]) => v * scale)), min = Math.min(...r.map(([v]) => v * scale));
    return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
  };
  const layout = (r: (readonly [number, number])[]) => {
    const s = r.reduce((a, [v]) => a + v * scale, 0);
    if (w >= h) {
      // Column on the right edge, filled top to bottom.
      const cw = s / h;
      let cy = y;
      for (const [v, i] of r) { const ch = (v * scale) / cw; out[i] = { x: x + w - cw, y: cy, w: cw, h: ch }; cy += ch; }
      w -= cw;
    } else {
      // Row on the top edge, filled right to left.
      const rh = s / w;
      let cx = x + w;
      for (const [v, i] of r) { const rw = (v * scale) / rh; cx -= rw; out[i] = { x: cx, y, w: rw, h: rh }; }
      y += rh; h -= rh;
    }
  };
  for (const item of order) {
    if (item[0] === 0) { out[item[1]] = { x, y, w: 0, h: 0 }; continue; }
    const side = Math.min(w, h);
    if (row.length === 0 || worst([...row, item], side) <= worst(row, side)) row.push(item);
    else { layout(row); row = [item]; }
  }
  if (row.length) layout(row);
  return out;
}

/* ---------- Jalali calendar ---------- */

/** Saturday = 0 … Friday = 6. */
export function satWeekday(d: Date): number {
  return (d.getDay() + 1) % 7;
}

/** Midnight local date `days` after `d`. */
export function addDays(d: Date, days: number): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
  return r;
}

/** «YYYY-MM-DD» key in local time, for joining data to calendar cells. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Start of the Jalali month containing `d`, and the first day of the next one. */
export function jalaliMonthBounds(d: Date): [Date, Date] {
  const { jy, jm } = toJalali(d);
  const start = toGregorian(jy, jm, 1);
  return [start, addDays(start, jalaliMonthLength(jy, jm))];
}

/** Indices where a new Jalali month begins in a run of daily dates. */
export function jalaliMonthStarts(dates: Date[]): number[] {
  const out: number[] = [];
  let prev = -1;
  dates.forEach((d, i) => {
    const m = toJalali(d).jm;
    if (m !== prev) { out.push(i); prev = m; }
  });
  return out;
}
