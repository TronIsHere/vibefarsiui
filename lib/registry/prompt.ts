import type { DocBase, SiteDoc, ThemeDoc } from "./types";

export const SHARED_RULES = [
  "RTL layout with dir=\"rtl\". Use logical properties (ms/me/ps/pe/start/end), never left/right.",
  "Font from the project (IRANSans or Vazirmatn). Never apply letter-spacing on Persian text.",
  "Visible numbers use Persian digits (۰–۹), thousands separator «٬» (U+066C), and the unit «تومان» after the number.",
  "Colors only from theme tokens: bg-background, text-foreground, bg-primary, text-muted-foreground, border-border, and similar. Do not invent colors.",
  "Icons from lucide-react. Directional icons (arrows, chevrons) flip in RTL: \"next\" points left.",
  "Accessibility: correct ARIA roles, a visible focus ring, and full keyboard support.",
  "Form controls (input, textarea, select) must compute to at least 16px on iOS, or Safari zooms the page on focus; keep text-sm on desktop and raise it under @supports (-webkit-touch-callout: none).",
  "Motion is short (150–300ms) and disabled under prefers-reduced-motion.",
  "All visible UI copy (labels, placeholders, empty states, errors) is Persian (Farsi). Code identifiers stay English.",
];

/** Shared rules every chart prompt carries, on top of the general Persian RTL rules. */
export const CHART_RULES = [
  "Pure SVG + React, no chart library. Measure the container with ResizeObserver and draw in real pixels (no viewBox stretching, so text never scales).",
  "RTL geometry: the first category or oldest date sits on the right and time flows leftward; the value axis is on the right edge; horizontal bars grow right-to-left from labels on the right.",
  "SVG <text> gets direction=\"rtl\" so «۱۲ میلیون» keeps the number on the right; under rtl, text-anchor start anchors at the right edge.",
  "Persian digits everywhere; compact axis ticks (هزار، میلیون، میلیارد) and full numbers with «٬» in tooltips; «٪» after the number; Jalali labels for dates («۱۲ مهر»).",
  "Colors come from var(--chart-N, fallback) so each design system can set its own palette; never hardcode a hex per series.",
  "Keyboard: the plot is focusable, ArrowLeft goes to the next item (it is on the left), ArrowRight to the previous, Home/End jump, Escape clears; the active item is read through an aria-live region.",
  "Every chart renders an sr-only <table> with the raw numbers and a legend whose buttons toggle series (aria-pressed); the last visible series cannot be hidden.",
  "Entry motion uses the theme's --motion and --motion-ease and is disabled under prefers-reduced-motion.",
];

/** Shared rules every calendar prompt carries. */
export const CALENDAR_RULES = [
  "Jalali (Solar Hijri) calendar with weeks from شنبه to جمعه; شنبه is the rightmost column and time flows right to left in timelines.",
  "A calendar day is a key \"YYYY-MM-DD\"; timed events are Date instants placed in a time zone (default Asia/Tehran) through Intl, never by adding +03:30 by hand.",
  "Holidays and occasions come from a provider (Iranian official holidays by rule: solar by Jalali date, religious by the Iranian lunar Hijri table); lunar dates outside the official table are marked «تقریبی».",
  "Holidays and the weekend are shown with color plus text or a dot, never color alone; today is a ring and the selected day is filled.",
  "Keyboard: day grids use roving tabindex, ArrowLeft = next day, ArrowRight = previous, Up/Down = a week, PageUp/PageDown = a month; prev/next chevrons point right/left.",
  "Event colors use the chart palette var(--chart-N, fallback) so a design system sets them once.",
  "Persian digits for every visible date and time («۱۴:۳۰»، «۱۲ مهر»); Hijri month names from a table.",
];

const KIND_LABEL = {
  component: "component",
  chart: "chart",
  calendar: "calendar component",
  animation: "animation",
  background: "background",
  template: "template",
  lib: "module",
  block: "block",
} as const;

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Builds the English prompt a user pastes into Cursor / Claude Code for an item. */
export function buildPrompt(
  item: DocBase,
  kind: keyof typeof KIND_LABEL = "component",
) {
  const what = KIND_LABEL[kind];
  const name = titleFromSlug(item.slug);
  const lines = [
    `Build a React + Tailwind CSS ${what} named "${name}" (${item.slug}).`,
    "",
    "This item requires:",
    ...item.promptBullets.map((b) => `• ${b}`),
    "",
    ...(kind === "chart" ? ["Chart rules:", ...CHART_RULES.map((b) => `• ${b}`), ""] : []),
    ...(kind === "calendar" ? ["Calendar rules:", ...CALENDAR_RULES.map((b) => `• ${b}`), ""] : []),
    "Persian / RTL rules for all output:",
    ...SHARED_RULES.map((b) => `• ${b}`),
    "",
    `Output: ${item.file.split("/").pop()} in TypeScript, no extra dependencies except lucide-react, plus a short usage example.`,
  ];
  return lines.join("\n");
}

/** Builds the English prompt for applying a theme. Pass CSS for the docs page. */
export function buildThemePrompt(item: ThemeDoc, css?: string) {
  const lines = [
    `Apply the "${item.nameEn}" (${item.slug}) design system to my project.`,
    "",
  ];
  if (css) {
    lines.push("Put these tokens in globals.css exactly:", "", css, "");
  }
  lines.push(
    "Rules:",
    ...item.promptBullets.map((b) => `• ${b}`),
    "• A design system is a design language, not a palette. Components read color AND shape (--shape-control/field/surface/overlay), border width (--line, --line-field), shadows (--depth-*), press transform (--press), motion (--motion, --motion-ease), fonts (--type-display, --type-body) and density (--spacing) from these tokens.",
    "• No hardcoded hex, radius, shadow, border width or duration inside components. Use the mapped utilities: rounded-control, rounded-field, rounded-surface, border-line, shadow-control, shadow-surface, active:shadow-press, active:[transform:var(--press)], duration-(--motion) ease-motion, font-display.",
  );
  return lines.join("\n");
}

/** Builds the English prompt for a whole multi-page site. */
export function buildSitePrompt(site: SiteDoc) {
  const lines = [
    `Build a complete multi-page React + Tailwind CSS website named "${site.nameEn}" (${site.slug}) for the Next.js App Router.`,
    "",
    "Routes:",
    ...site.pages.map((p) => `• /${p.path} (${p.label}): ${p.export} in components/sites/${site.slug}/${p.file}`),
    "",
    "This site requires:",
    ...site.promptBullets.map((b) => `• ${b}`),
    "• Internal links go through a useHref() helper from shell.tsx so the whole site can be mounted under a base path; use plain <a> tags, not next/link.",
    `• Photos live in public/sites/${site.slug}/ and render through a small Photo helper (plain <img>, lazy-loaded, object-cover, meaningful Persian alt). Decorative art uses theme tokens only, so every page follows the active theme.`,
    "",
    "Persian / RTL rules for all output:",
    ...SHARED_RULES.map((b) => `• ${b}`),
    "",
    `Output: shell.tsx plus one file per page in TypeScript, and a tiny app/<route>/page.tsx for each route that renders the page and sets metadata.title. No extra dependencies except lucide-react.`,
  ];
  return lines.join("\n");
}
