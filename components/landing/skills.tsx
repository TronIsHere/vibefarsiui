import Link from "next/link";
import {
  AlignRight,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CloudUpload,
  ExternalLink,
  MessageCircle,
  MessageSquareText,
  PenLine,
  Ruler,
  ScrollText,
  Search,
  ShieldCheck,
  TextCursorInput,
  Type,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { SKILL_FORMAT_LABEL, skills, type SkillDoc, type SkillIcon } from "@/lib/registry";
import { cn, fa } from "@/lib/utils";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";
import { fillGrid } from "@/lib/grid-fill";

export const SKILL_ICONS: Record<SkillIcon, LucideIcon> = {
  chat: MessageCircle,
  letter: ScrollText,
  input: TextCursorInput,
  rtl: AlignRight,
  calendar: CalendarDays,
  shield: ShieldCheck,
  search: Search,
  book: BookOpen,
  type: Type,
  pen: PenLine,
  upload: CloudUpload,
  wallet: Wallet,
  sms: MessageSquareText,
  ruler: Ruler,
};

export function SkillFormatPill({ format, className }: { format: SkillDoc["format"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        format === "skill" && "border-brand/30 bg-brand/10 text-brand",
        format === "guide" && "border-border bg-secondary text-foreground/80",
        format === "external" && "border-border text-muted-foreground",
        className,
      )}
    >
      {format === "external" && <ExternalLink className="size-2.5" />}
      {SKILL_FORMAT_LABEL[format]}
    </span>
  );
}

function SkillCard({ s }: { s: SkillDoc }) {
  const Icon = SKILL_ICONS[s.icon];
  const href = `/skills/${s.slug}`;
  const cmd = s.format === "external" ? (s.install?.[0]?.cmd ?? s.repo ?? "") : `npx vibefarsi add ${s.slug}`;
  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25">
      <Link href={href} className="block rounded-t-xl border-b border-border bg-muted/50 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold">{s.name}</span>
              <SkillFormatPill format={s.format} />
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground" dir="ltr">
              {s.slug}
            </span>
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-4 py-3">
        <p className="text-xs leading-6 text-muted-foreground">{s.desc}</p>
        <ul className="mt-3 space-y-1 text-xs text-foreground/85">
          {s.useWhen.slice(0, 3).map((u) => (
            <li key={u} className="flex items-start gap-2">
              <Check className="mt-1 size-3 shrink-0 text-brand" />
              <span>{u}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-1 pt-3">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-border px-3 py-2 text-[11px]" dir="ltr">
        <span className="text-muted-foreground">$</span>
        <code className="min-w-0 flex-1 truncate bg-transparent text-foreground/85">{cmd}</code>
        <CopyButton text={cmd} className="size-7" />
      </div>
      <Link
        href={href}
        aria-label={`باز کردن ${s.name}`}
        className="absolute end-3 top-3 hidden size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
      >
        <ArrowLeft className="size-3.5" />
      </Link>
    </div>
  );
}

export function Skills({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{fa(skills.length)} مهارت و راهنما</>}
      title={standalone ? "مهارت‌ها" : "به هوش مصنوعی فارسی یاد بدید"}
      desc={
        standalone
          ? "مهارت یک فایل مارک‌داون هست که Claude Code، Cursor و Codex قبل از کار می‌خونن. این‌ها را برای کارهای فارسی نوشتیم: فارسی محاوره‌ای، متن دکمه و خطا، تقویم شمسی، کد ملی و شبا، هر کدام یک فایل. روی اسمش بزنید تا متن کامل و راه نصب را ببینید."
          : "مهارت یک فایل مارک‌داون هست که Claude Code، Cursor و Codex قبل از کار می‌خونن. یکی را با یک دستور توی پروژه بگذارید و از همان پرامپت بعدی، فارسی محاوره‌ای، تقویم شمسی و کد ملی را درست می‌نویسه."
      }
      href="/skills"
      standalone={standalone}
    />
  );
  const spans = fillGrid(skills.map(() => 1), { base: 1, sm: 2, xl: 3 });
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "xl:grid-cols-3" : "p-3 sm:p-4 xl:grid-cols-3")}>
      {skills.map((s, i) => (
        <li key={s.slug} className={spans[i]}>
          <SkillCard s={s} />
        </li>
      ))}
    </ul>
  );
  if (standalone)
    return (
      <div>
        {head}
        {grid}
      </div>
    );
  return (
    <Section id="skills">
      {head}
      {grid}
      <SectionFoot href="/skills" label="همه‌ی مهارت‌ها" note="هر مهارت با npx vibefarsi add نصب میشه و همان لحظه مال شماست." />
    </Section>
  );
}
