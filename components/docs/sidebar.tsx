"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { COMMUNITY_ENABLED } from "@/lib/site";
import {
  animations,
  backgrounds,
  blocks,
  components,
  sections,
  sites,
  skills,
  templates,
  themes,
  type SectionKey,
} from "@/lib/registry";

const lists = { components, blocks, animations, backgrounds, templates, sites, themes, skills } as const;

const DOCS_SECTION_IDS = ["cli", "manual", "prompts", "mcp", "faq"] as const;

type GroupKey = SectionKey | "community";

function sectionOpenForPath(pathname: string): GroupKey | null {
  if (pathname.startsWith("/community") || pathname.startsWith("/showcase")) return "community";
  for (const s of sections) {
    if (pathname === `/${s.key}` || pathname.startsWith(`/${s.key}/`)) return s.key;
  }
  return null;
}

function NavGroup({
  id,
  open,
  onToggle,
  title,
  count,
  href,
  titleActive,
  onNavigate,
  children,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  title: string;
  count?: number;
  href: string;
  titleActive: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const panelId = `nav-${id}`;

  return (
    <div>
      <div className="flex items-center gap-0.5">
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={titleActive ? "page" : undefined}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
            titleActive
              ? "bg-accent font-medium text-foreground"
              : "font-semibold text-foreground hover:bg-accent/50",
          )}
        >
          <span className="truncate">{title}</span>
          {count !== undefined && (
            <span className="ms-2 shrink-0 text-[10px] font-normal text-muted-foreground">
              {fa(count)}
            </span>
          )}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `بستن ${title}` : `باز کردن ${title}`}
          onClick={onToggle}
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </div>
      <div
        id={panelId}
        role="region"
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div inert={!open} className="min-h-0 overflow-hidden">
          <ul className="mt-1 space-y-0.5 border-s border-border ps-2">
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [openGroups, setOpenGroups] = useState<Partial<Record<GroupKey, boolean>>>(() => {
    const active = sectionOpenForPath(pathname);
    return active ? { [active]: true } : {};
  });

  useEffect(() => {
    const sync = () => setHash(window.location.hash.replace(/^#/, ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    const active = sectionOpenForPath(pathname);
    if (!active) return;
    setOpenGroups((prev) => (prev[active] ? prev : { ...prev, [active]: true }));
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/docs") return;

    const elements = DOCS_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!elements.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) {
          if (window.scrollY < 120) setHash("");
          return;
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (top) setHash(top[0]);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  const docsSection = pathname === "/docs" ? hash : "";
  const isDocsTop = pathname === "/docs" && !DOCS_SECTION_IDS.includes(docsSection as (typeof DOCS_SECTION_IDS)[number]);

  const toggle = (key: GroupKey) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const link = (
    href: string,
    label: React.ReactNode,
    active: boolean,
    extra?: React.ReactNode,
  ) => (
    <Link
      href={href}
      onClick={() => {
        const nextHash = href.includes("#") ? href.split("#")[1] ?? "" : "";
        if (href === "/docs" || href.startsWith("/docs#")) setHash(nextHash);
        onNavigate?.();
      }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
        active
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {extra}
    </Link>
  );

  return (
    <nav aria-label="مستندات" className="space-y-6 text-sm">
      <div className="space-y-0.5">
        {link("/docs", "شروع سریع", isDocsTop)}
        {link("/about", "درباره", pathname === "/about")}
        {link("/docs#faq", "پرسش‌های متداول", docsSection === "faq")}
        {link("/docs#cli", "نصب خودکار (CLI)", docsSection === "cli")}
        {link("/docs#manual", "نصب دستی", docsSection === "manual")}
        {link("/docs#prompts", "کار با هوش مصنوعی", docsSection === "prompts")}
        {link("/docs#mcp", "سرور MCP", docsSection === "mcp")}
      </div>

      {COMMUNITY_ENABLED && (
        <NavGroup
          id="community"
          open={!!openGroups.community}
          onToggle={() => toggle("community")}
          title="جامعه"
          href="/community"
          titleActive={pathname === "/community"}
          onNavigate={onNavigate}
        >
          <li>{link("/community", "ساخته‌ی جامعه", pathname.startsWith("/community/") && pathname !== "/community/submit")}</li>
          <li>{link("/showcase", "ساخته‌شده با وایب‌فارسی", pathname === "/showcase")}</li>
          <li>{link("/community/submit", "فرستادن کامپوننت", pathname === "/community/submit")}</li>
          <li>{link("/showcase/submit", "معرفی سایت", pathname === "/showcase/submit")}</li>
        </NavGroup>
      )}

      {sections.map((s) => (
        <NavGroup
          key={s.key}
          id={s.key}
          open={!!openGroups[s.key]}
          onToggle={() => toggle(s.key)}
          title={s.label}
          count={s.count}
          href={`/${s.key}`}
          titleActive={pathname === `/${s.key}`}
          onNavigate={onNavigate}
        >
          {lists[s.key].map((it) => {
            const href = `/${s.key}/${it.slug}`;
            return (
              <li key={it.slug}>
                {link(
                  href,
                  it.name,
                  pathname === href,
                  <span
                    className="text-[10px] text-muted-foreground/70"
                    dir="ltr"
                  >
                    {it.slug}
                  </span>,
                )}
              </li>
            );
          })}
        </NavGroup>
      ))}
    </nav>
  );
}
