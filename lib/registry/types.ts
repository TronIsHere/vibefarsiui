export type PropDoc = { name: string; type: string; default?: string; desc: string };

export type DocBase = {
  slug: string;
  name: string;
  desc: string;
  /** Path of the source file shown on the docs page, relative to the repo root. */
  file: string;
  /** npm packages beyond react/next/tailwind. */
  deps?: string[];
  /** Other registry items this one imports. */
  registryDeps?: string[];
  usage: string;
  props?: PropDoc[];
  notes?: string[];
  /** Component-specific requirements merged into the generated English prompt. */
  promptBullets: string[];
  /** Extra CSS (keyframes/utilities) that must be added to globals.css. */
  css?: string;
  /** Two columns wide on the landing grid. */
  wide?: boolean;
};

export type ComponentCat = "form" | "display" | "feedback" | "nav" | "overlay" | "data" | "education";
export type ComponentDoc = DocBase & { cat: ComponentCat };
export type AnimationDoc = DocBase;
export type BackgroundDoc = DocBase & {
  /** Rendered with WebGL through the `shader` primitive instead of CSS. */
  engine?: "webgl";
};
/** What the chart answers: change over time, comparison, part of a whole, spread, flow, money, or the shared kit. */
export type ChartCat = "kit" | "trend" | "compare" | "part" | "distribution" | "flow" | "finance";
export type ChartDoc = DocBase & { cat: ChartCat; tags: string[] };
/** Shared kit, calendar views, holidays, booking, or planning (Gantt and shifts). */
export type CalendarCat = "kit" | "views" | "occasions" | "booking" | "planning";
export type CalendarDoc = DocBase & { cat: CalendarCat; tags: string[] };
export type TemplateDoc = DocBase & { tags: string[]; pages: number };
export type BlockDoc = DocBase & { tags: string[] };
/** How a design system looks beyond its palette. Short Persian phrases. */
export type ThemeLanguage = {
  type: string;
  shape: string;
  depth: string;
  motion: string;
  density: string;
};

export type ThemeDoc = {
  slug: string;
  name: string;
  nameEn: string;
  /** Name of the design language, e.g. «نئوبروتالیسم». */
  style: string;
  styleEn: string;
  desc: string;
  radius: string;
  swatches: [string, string, string, string];
  light?: boolean;
  file: string;
  language: ThemeLanguage;
  /** Google Fonts families the system needs besides the body font. */
  fonts?: string[];
  promptBullets: string[];
};

export type SkillFormat = "skill" | "guide" | "external";
export type SkillIcon =
  | "chat"
  | "letter"
  | "input"
  | "rtl"
  | "calendar"
  | "shield"
  | "search"
  | "book"
  | "type"
  | "pen"
  | "upload"
  | "wallet"
  | "sms"
  | "ruler";
export type SkillDoc = {
  slug: string;
  name: string;
  nameEn: string;
  desc: string;
  /** skill = SKILL.md folder agents auto-load; guide = plain .md you link from CLAUDE.md; external = lives in another repo. */
  format: SkillFormat;
  icon: SkillIcon;
  /** Markdown source in this repo. Absent for external skills. */
  file?: string;
  tags: string[];
  /** When the skill kicks in, in Persian, for the docs page. */
  useWhen: string[];
  /** Illustrative before/after for one prompt. */
  example?: { prompt: string; without: string; with: string };
  repo?: string;
  author?: { name: string; url: string };
  license?: string;
  /** Install commands for external skills. */
  install?: { label: string; cmd: string }[];
};

/** One route of a multi-page site. `path` is "" for the home page, "about" for /about. */
export type SitePage = {
  path: string;
  /** Short nav label, e.g. «خدمات». */
  label: string;
  /** Component file inside the site folder, e.g. "about.tsx". */
  file: string;
  /** Named export of that file, e.g. "AboutPage". */
  export: string;
  /** Browser tab title written into the generated app/<path>/page.tsx. */
  title: string;
};

/** A whole website: a shared shell plus several pages, copied as one folder. */
export type SiteDoc = DocBase & {
  nameEn: string;
  tags: string[];
  /** Folder of the site in this repo, e.g. registry/sites/agency-site. */
  dir: string;
  pages: SitePage[];
  /** Highlights shown on the card and the docs page. */
  features: string[];
};
