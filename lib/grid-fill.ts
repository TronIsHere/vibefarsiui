/**
 * Catalog grids never leave holes. Given each card's preferred width (1 or 2
 * columns) and the column count at every breakpoint, this returns a col-span
 * class per card so each row is full: when the next card doesn't fit, the card
 * before it stretches to the row end, and the last card fills the final row.
 */

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
export type GridLayout = Partial<Record<Breakpoint, number>>;

const ORDER: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

// Literal class names so Tailwind's scanner sees every one of them.
const SPAN: Record<Breakpoint, string[]> = {
  base: ["", "col-span-1", "col-span-2", "col-span-3", "col-span-4"],
  sm: ["", "sm:col-span-1", "sm:col-span-2", "sm:col-span-3", "sm:col-span-4"],
  md: ["", "md:col-span-1", "md:col-span-2", "md:col-span-3", "md:col-span-4"],
  lg: ["", "lg:col-span-1", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4"],
  xl: ["", "xl:col-span-1", "xl:col-span-2", "xl:col-span-3", "xl:col-span-4"],
};

/** Column spans for `widths` packed in row order into `cols` columns with no empty cells. */
export function packSpans(widths: number[], cols: number): number[] {
  const out = widths.map((w) => Math.min(Math.max(1, w), cols));
  let used = 0;
  let last = -1;
  out.forEach((w, i) => {
    if (used + w > cols) {
      out[last] += cols - used;
      used = 0;
    }
    used = (used + w) % cols;
    last = i;
  });
  if (used > 0 && last >= 0) out[last] += cols - used;
  return out;
}

/**
 * One className per card for a grid whose columns change by breakpoint, e.g.
 * fillGrid(widths, { base: 1, sm: 2, xl: 3 }) for "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3".
 */
export function fillGrid(widths: number[], layout: GridLayout): string[] {
  const steps = ORDER.filter((bp) => layout[bp]).map((bp) => [bp, packSpans(widths, layout[bp]!)] as const);
  return widths.map((_, i) => steps.map(([bp, spans]) => SPAN[bp][spans[i]]).join(" "));
}
