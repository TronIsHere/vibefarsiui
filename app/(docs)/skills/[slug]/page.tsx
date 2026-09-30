import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { SKILL_FORMAT_LABEL, skills, skillTarget, type SkillDoc } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { splitFrontmatter } from "@/lib/markdown";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { DocHeader, DocSection, PrevNext } from "@/components/docs/blocks";
import { Markdown } from "@/components/docs/markdown";
import { SkillDetail } from "@/components/docs/skill-detail";

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/skills/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = skills.find((s) => s.slug === slug);
  if (!item) return pageMetadata({ title: "یافت نشد", path: `/skills/${slug}`, index: false });
  return pageMetadata({
    title: `${item.name} · مهارت Claude Code و Cursor · وایب‌فارسی`,
    description: item.desc,
    path: `/skills/${slug}`,
  });
}

function Cmd({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" dir="ltr">
      <span className="text-muted-foreground">$</span>
      <code className="min-w-0 flex-1 truncate bg-transparent">{cmd}</code>
      <CopyButton text={cmd} className="ms-auto" />
    </div>
  );
}

function Path({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-secondary px-1 py-0.5 text-[11.5px]" dir="ltr">
      {children}
    </code>
  );
}

function ToolPaths({ item }: { item: SkillDoc }) {
  const slug = item.slug;
  const rows: { tool: string; how: React.ReactNode; code?: string }[] =
    item.format === "guide"
      ? [
          { tool: "Claude Code", how: <>فایل را در <Path>docs/{slug}.md</Path> بگذارید و این خط را به <Path>CLAUDE.md</Path> اضافه کنید:</>, code: `@docs/${slug}.md` },
          { tool: "Cursor", how: <>در <Path>.cursor/rules/{slug}.mdc</Path> با <Path>alwaysApply: true</Path> بالای فایل</> },
          { tool: "Codex و بقیه", how: <>متن را در <Path>AGENTS.md</Path> بگذارید یا از همان‌جا به فایل لینک بدید</> },
        ]
      : [
          { tool: "Claude Code", how: <><Path>.claude/skills/{slug}/SKILL.md</Path> برای همین پروژه، یا <Path>~/.claude/skills/{slug}/SKILL.md</Path> برای همه‌ی پروژه‌ها</> },
          { tool: "Cursor", how: <Path>.cursor/skills/{slug}/SKILL.md</Path> },
          { tool: "Codex", how: <Path>.agents/skills/{slug}/SKILL.md</Path> },
          { tool: "بقیه‌ی ابزارها", how: <>همان فایل را در پروژه بگذارید و یک خط به <Path>AGENTS.md</Path> اضافه کنید:</>, code: `For any Persian task, read .claude/skills/${slug}/SKILL.md first.` },
        ];
  return (
    <ul className="mt-3 space-y-2.5 text-xs leading-6 text-muted-foreground">
      {rows.map((r) => (
        <li key={r.tool} className="flex gap-3">
          <span className="w-24 shrink-0 font-medium text-foreground">{r.tool}</span>
          <span className="min-w-0 flex-1">
            {r.how}
            {r.code && (
              <code className="mt-1 block truncate rounded bg-secondary px-2 py-1 text-[11.5px] text-foreground/85" dir="ltr">
                {r.code}
              </code>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Install({ item, source }: { item: SkillDoc; source: string }) {
  const target = skillTarget(item);
  return (
    <ol className="space-y-4">
      <li className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">با CLI</p>
        <p className="mt-1 text-xs text-muted-foreground">
          این دستور فایل را در <Path>{target}</Path> می‌نویسه. CLI به init نیاز نداره؛ فقط باید داخل پوشه‌ی پروژه باشید.
        </p>
        <div className="mt-2">
          <Cmd cmd={`npx vibefarsi add ${item.slug}`} />
        </div>
      </li>
      <li className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">دستی</p>
        <p className="mt-1 text-xs text-muted-foreground">
          محتوای تب <span dir="ltr">{item.file?.split("/").pop()}</span> را کپی کنید و در مسیر ابزار خودتون بگذارید:
        </p>
        <ToolPaths item={item} />
        <div className="mt-3 flex items-center gap-2">
          <CopyButton text={source} className="size-8 rounded-md border border-border" />
          <span className="text-xs text-muted-foreground">کپی کل فایل</span>
          <a
            href={`/r/skills/${item.slug}.json`}
            className="ms-auto text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            dir="ltr"
          >
            registry json
          </a>
        </div>
      </li>
    </ol>
  );
}

function ExternalCard({ item }: { item: SkillDoc }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">این مهارت در مخزن خودش نگهداری میشه</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            نوشته‌ی{" "}
            {item.author && (
              <a href={item.author.url} className="underline underline-offset-4 hover:text-foreground" dir="ltr" lang="en" target="_blank" rel="noreferrer">
                {item.author.name}
              </a>
            )}
            {item.license && <> با لایسنس {item.license}</>}. ما فقط معرفی‌اش می‌کنیم و نسخه‌ی به‌روز همیشه همان‌جاست.
          </p>
        </div>
        {item.repo && (
          <a
            href={item.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ExternalLink className="size-3.5" />
            GitHub
          </a>
        )}
      </div>
      {item.install && (
        <div className="mt-4 space-y-3">
          {item.install.map((i) => (
            <div key={i.cmd}>
              <p className="mb-1 text-xs text-muted-foreground">{i.label}</p>
              <Cmd cmd={i.cmd} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function SkillPage({ params }: PageProps<"/skills/[slug]">) {
  const { slug } = await params;
  const i = skills.findIndex((s) => s.slug === slug);
  if (i < 0) notFound();
  const item = skills[i];
  const source = item.file ? readSource(item.file) : "";
  const { meta, body } = splitFrontmatter(source);
  const fileName = item.file?.split("/").pop() ?? "";

  return (
    <article className="space-y-12">
      <DocHeader section="skills" sectionLabel="مهارت‌ها" item={item} kind={SKILL_FORMAT_LABEL[item.format]} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">کی به کار می‌آد</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-7">
            {item.useWhen.map((u) => (
              <li key={u} className="flex gap-2">
                <Check className="mt-2 size-3.5 shrink-0 text-brand" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          {meta.description ? (
            <>
              <p className="text-xs font-medium text-muted-foreground">شرط فعال شدن (description)</p>
              <p className="mt-2 text-[13px] leading-6 text-foreground/85" dir="ltr" lang="en">
                {meta.description}
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                مدل با همین چند خط تصمیم می‌گیره مهارت را بخونه یا نه. اگر می‌خواید در موقعیت‌های دیگری هم فعال بشه، همین را عوض کنید.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-muted-foreground">برچسب‌ها</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                {item.format === "guide"
                  ? "راهنما فرانت‌متر نداره و خودکار فعال نمیشه؛ از CLAUDE.md یا AGENTS.md به آن لینک بدید تا مدل در هر جلسه بخوندش."
                  : "برای جزئیات فعال شدن، README مخزن را ببینید."}
              </p>
            </>
          )}
        </div>
      </div>

      {item.file ? (
        <SkillDetail
          fileName={fileName}
          source={source}
          rendered={<Markdown source={body} />}
          raw={<CodeBlock code={source} lang="markdown" className="max-h-[70vh] overflow-auto" />}
        />
      ) : (
        <ExternalCard item={item} />
      )}

      {item.example && (
        <DocSection id="example" title="نمونه">
          <p className="mb-3 text-sm text-muted-foreground">
            پرامپت: <span className="text-foreground">«{item.example.prompt}»</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">بدون مهارت</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-7 text-foreground/70" dir="auto">
                {item.example.without}
              </pre>
            </div>
            <div className="rounded-xl border border-brand/30 bg-card p-4">
              <p className="text-xs font-medium text-brand">با مهارت</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-7" dir="auto">
                {item.example.with}
              </pre>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">نمونه برای نشان دادن جهت تغییره؛ خروجی واقعی به مدل و پرامپت شما بستگی داره.</p>
        </DocSection>
      )}

      {item.file && (
        <DocSection id="install" title="نصب">
          <Install item={item} source={source} />
        </DocSection>
      )}

      {item.format !== "external" && (
        <p className="text-xs leading-6 text-muted-foreground">
          می‌خواید همه‌ی قوانین را یک‌جا داشته باشید؟{" "}
          <Link href="/skills/agents-md-persian" className="underline underline-offset-4 hover:text-foreground">
            قوانین فارسی برای CLAUDE.md
          </Link>{" "}
          خلاصه‌ی همه‌ی مهارت‌ها در یک صفحه‌ست و{" "}
          <Link href="/skills/ui-craft-rules" className="underline underline-offset-4 hover:text-foreground">
            قوانین کرافت رابط
          </Link>{" "}
          طرف طراحی را پوشش میده. <Path>npx vibefarsi init</Path> هر دو را داخل پروژه می‌نویسه.
        </p>
      )}

      <PrevNext base="skills" prev={skills[i - 1]} next={skills[i + 1]} />
    </article>
  );
}
