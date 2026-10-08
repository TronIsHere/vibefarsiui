import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumb } from "@/registry/ui/breadcrumb";
import { animations, backgrounds, blocks, charts, type DocBase, type PropDoc } from "@/lib/registry";
import { breadcrumbJsonLd, itemJsonLd } from "@/lib/site";
import { cn } from "@/lib/utils";

export function DocHeader({
  section,
  sectionLabel,
  item,
  kind,
}: {
  section: string;
  sectionLabel: string;
  item: { name: string; slug: string; desc: string };
  kind: string;
}) {
  const path = `/${section}/${item.slug}`;
  return (
    <header>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: sectionLabel, path: `/${section}` },
          { name: item.name, path },
        ])}
      />
      <JsonLd data={itemJsonLd({ name: item.name, desc: item.desc }, path)} />
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: sectionLabel, href: `/${section}` },
          { label: item.name },
        ]}
      />
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <span className="  text-sm text-muted-foreground" dir="ltr">
          {item.slug}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {kind}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-muted-foreground">{item.desc}</p>
    </header>
  );
}

export function DocSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-start font-medium">پراپ</th>
            <th className="px-3 py-2 text-start font-medium">نوع</th>
            <th className="px-3 py-2 text-start font-medium">پیش‌فرض</th>
            <th className="px-3 py-2 text-start font-medium">توضیح</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-t border-border align-top">
              <td className="px-3 py-2   text-xs" dir="ltr">
                {p.name}
              </td>
              <td
                className="px-3 py-2   text-xs text-muted-foreground"
                dir="ltr"
              >
                {p.type}
              </td>
              <td
                className="px-3 py-2   text-xs text-muted-foreground"
                dir="ltr"
              >
                {p.default ?? "-"}
              </td>
              <td className="px-3 py-2 text-foreground/85">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Docs URL for a registry dependency slug; components are the default section. */
export function depHref(slug: string) {
  if (backgrounds.some((i) => i.slug === slug)) return `/backgrounds/${slug}`;
  if (charts.some((i) => i.slug === slug)) return `/charts/${slug}`;
  if (animations.some((i) => i.slug === slug)) return `/animations/${slug}`;
  if (blocks.some((i) => i.slug === slug)) return `/blocks/${slug}`;
  return `/components/${slug}`;
}

export function InstallSteps({
  item,
  targetDir,
  code,
  section,
}: {
  item: DocBase;
  targetDir: string;
  code: string;
  section: string;
}) {
  const fileName = item.file.split("/").pop()!;
  const cmd = `npx vibefarsi add ${item.slug}`;
  const deps = ["lucide-react", ...(item.deps ?? [])].filter(
    (d, i, a) => a.indexOf(d) === i,
  );
  const inner = item.registryDeps?.filter((d) => !["jalali", "persian", "utils", "number-to-words", "iran-divisions", "chart-utils"].includes(d)) ?? [];
  return (
    <ol className="space-y-4">
      <li className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">با CLI</p>
        <p className="mt-1 text-xs text-muted-foreground">
          اگر هنوز init نکردید، اول از{" "}
          <Link href="/docs#install" className="underline underline-offset-4">
            راهنمای نصب
          </Link>{" "}
          پروژه را آماده کنید. بعد این دستور کامپوننت و وابستگی‌هاش را می‌نویسه.
        </p>
        <div
          className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5   text-xs"
          dir="ltr"
        >
          <span className="text-muted-foreground">$</span> {cmd}
          <CopyButton text={cmd} className="ms-auto" />
        </div>
      </li>
      <li className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">نصب دستی</p>
        <p className="mt-1 text-xs text-muted-foreground">
          محتوای تب «کد» را در{" "}
          <code className="rounded bg-secondary px-1 text-[11px]" dir="ltr">
            {targetDir}/{fileName}
          </code>{" "}
          بگذارید.
          {inner.length > 0 && (
            <>
              {" "}
              پیش‌نیاز:{" "}
              {inner.map((d, i) => (
                <span key={d}>
                  {i > 0 && "، "}
                  <Link
                    href={depHref(d)}
                    className="underline underline-offset-4"
                    dir="ltr"
                  >
                    {d}
                  </Link>
                </span>
              ))}
              .
            </>
          )}
          {item.css && (
            <>
              {" "}
              کلیدفریم را هم به{" "}
              <code className="rounded bg-secondary px-1 text-[11px]">
                globals.css
              </code>{" "}
              اضافه کنید.
            </>
          )}
        </p>
        <div
          className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5   text-xs"
          dir="ltr"
        >
          <span className="text-muted-foreground">$</span> npm i {deps.join(" ")}
          <CopyButton text={`npm i ${deps.join(" ")}`} className="ms-auto" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <CopyButton
            text={code}
            className="size-8 rounded-md border border-border"
          />
          <span className="text-xs text-muted-foreground">کپی کل فایل</span>
          <a
            href={`/r/${section}/${item.slug}.json`}
            className="ms-auto   text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            dir="ltr"
          >
            registry json
          </a>
        </div>
      </li>
    </ol>
  );
}

export function UsageBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div dir="ltr" className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="  text-xs text-muted-foreground" dir="ltr">
          usage.tsx
        </span>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

export function Notes({ notes }: { notes: string[] }) {
  return (
    <ul className="space-y-2">
      {notes.map((n) => (
        <li
          key={n}
          className="flex gap-3 rounded-xl border border-border bg-card p-3 text-sm leading-7"
        >
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
          <span className="text-foreground/85">{n}</span>
        </li>
      ))}
    </ul>
  );
}

export function PrevNext({
  prev,
  next,
  base,
}: {
  prev?: { slug: string; name: string };
  next?: { slug: string; name: string };
  base: string;
}) {
  const cls =
    "flex flex-1 items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-foreground/25";
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {prev ? (
        <Link href={`/${base}/${prev.slug}`} className={cls}>
          <ArrowRight className="size-4 text-muted-foreground" />
          <span>
            <span className="block text-xs text-muted-foreground">قبلی</span>
            {prev.name}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/${base}/${next.slug}`}
          className={cn(cls, "justify-end text-end")}
        >
          <span>
            <span className="block text-xs text-muted-foreground">بعدی</span>
            {next.name}
          </span>
          <ArrowLeft className="size-4 text-muted-foreground" />
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </div>
  );
}
