"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Boxes,
  Handshake,
  Image,
  LayoutTemplate,
  Palette,
  PanelsTopLeft,
  Search,
  Sparkles,
  WandSparkles,
  ChartLine,
  CalendarDays,
} from "lucide-react";
import { CommandDialog, type CommandItem } from "@/registry/ui/command";
import {
  EXTRA_ALIASES,
  animations,
  backgrounds,
  blocks,
  calendar,
  charts,
  components,
  sections,
  skills,
  templates,
  themes,
} from "@/lib/registry";

const TYPE_META = {
  component: { href: (slug: string) => `/components/${slug}`, group: "کامپوننت‌ها", icon: Boxes },
  block: { href: (slug: string) => `/blocks/${slug}`, group: "بلاک‌ها", icon: PanelsTopLeft },
  chart: { href: (slug: string) => `/charts/${slug}`, group: "نمودارها", icon: ChartLine },
  calendar: { href: (slug: string) => `/calendar/${slug}`, group: "تقویم", icon: CalendarDays },
  animation: { href: (slug: string) => `/animations/${slug}`, group: "انیمیشن‌ها", icon: Sparkles },
  background: { href: (slug: string) => `/backgrounds/${slug}`, group: "پس‌زمینه‌ها", icon: Image },
  template: { href: (slug: string) => `/templates/${slug}`, group: "قالب‌ها", icon: LayoutTemplate },
  theme: { href: (slug: string) => `/themes/${slug}`, group: "سیستم‌های طراحی", icon: Palette },
  skill: { href: (slug: string) => `/skills/${slug}`, group: "مهارت‌ها", icon: WandSparkles },
} as const;

type SearchDoc = {
  slug: string;
  name: string;
  desc?: string;
  tags?: string[];
  nameEn?: string;
};

function keywordsFor(item: SearchDoc): string[] {
  return Array.from(
    new Set(
      [
        item.slug,
        item.name,
        item.nameEn,
        item.desc,
        item.slug.replace(/-/g, " "),
        ...(item.tags ?? []),
        ...(EXTRA_ALIASES[item.slug] ?? []),
      ].filter(Boolean) as string[],
    ),
  );
}

export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const items = React.useMemo<CommandItem[]>(() => {
    const go = (href: string) => () => router.push(href);
    const pages: CommandItem[] = [
      { id: "page-home", label: "خانه", group: "صفحات", icon: BookOpen, keywords: ["home", "index"], onSelect: go("/") },
      { id: "page-docs", label: "شروع سریع", group: "صفحات", icon: BookOpen, keywords: ["docs", "مستندات", "نصب", "cli", "mcp"], onSelect: go("/docs") },
      { id: "page-icons", label: "نشان‌ها", group: "صفحات", icon: Sparkles, keywords: ["icons", "logo", "نشان", "آیکون", "شمسه", "favicon", "فاویکون", "png", "svg"], onSelect: go("/icons") },
      { id: "page-sponsors", label: "حامیان", group: "صفحات", icon: Handshake, keywords: ["sponsors", "حامی", "اسپانسر", "حمایت", "sponsor"], onSelect: go("/#sponsors") },
      ...sections.map((s) => ({
        id: `page-${s.key}`,
        label: s.label,
        group: "صفحات",
        icon: BookOpen,
        keywords: [s.key, s.desc],
        onSelect: go(`/${s.key}`),
      })),
    ];

    const collections: [keyof typeof TYPE_META, SearchDoc[]][] = [
      ["component", components.map((c) => ({ ...c, tags: [c.cat] }))],
      ["block", blocks],
      ["chart", charts.map((c) => ({ ...c, tags: [...c.tags] }))],
      ["calendar", calendar.map((c) => ({ ...c, tags: [...c.tags] }))],
      ["animation", animations],
      ["background", backgrounds],
      ["template", templates],
      ["theme", themes],
      ["skill", skills],
    ];

    const catalog = collections.flatMap(([type, list]) => {
      const meta = TYPE_META[type];
      return list.map((item) => ({
        id: `${type}/${item.slug}`,
        label: item.name,
        group: meta.group,
        icon: meta.icon,
        shortcut: item.slug,
        keywords: keywordsFor(item),
        onSelect: go(meta.href(item.slug)),
      }));
    });

    return [...pages, ...catalog];
  }, [router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="جست‌وجو"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[13px] text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:text-foreground"
      >
        <Search className="size-3.5" />
        <span className="hidden sm:inline">جست‌وجو</span>
        <kbd className="ms-1 hidden rounded border border-border px-1 text-[10px] leading-4 text-muted-foreground/80 sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        items={items}
        placeholder="جست‌وجو در قطعه‌ها…"
        emptyText="چیزی پیدا نشد"
      />
    </>
  );
}
