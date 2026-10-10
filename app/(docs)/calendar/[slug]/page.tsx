import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPrompt, calendar } from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, InstallSteps, Notes, PrevNext, PropsTable, UsageBlock } from "@/components/docs/blocks";

export function generateStaticParams() {
  return calendar.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/calendar/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = calendar.find((c) => c.slug === slug);
  return itemMetadata(item, "تقویم", `/calendar/${slug}`);
}

export default async function Page({ params }: PageProps<"/calendar/[slug]">) {
  const { slug } = await params;
  const i = calendar.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const item = calendar[i];
  const code = readSource(item.file);
  const files = [
    { name: item.file.split("/").pop()!, code },
    // Every calendar component ships with the shared core and the libs it imports.
    ...(item.slug !== "calendar-core" ? [{ name: "calendar-core.tsx", code: readSource("registry/calendar/calendar-core.tsx") }] : []),
    { name: "calendar-utils.ts", code: readSource("lib/calendar-utils.ts") },
    { name: "iran-holidays.ts", code: readSource("lib/iran-holidays.ts") },
    { name: "hijri.ts", code: readSource("lib/hijri.ts") },
  ];

  return (
    <article className="space-y-12">
      <DocHeader section="calendar" sectionLabel="تقویم" item={item} kind="کامپوننت تقویم" />
      <ItemTabs demo={{ kind: "calendar", slug: item.slug }} files={files} prompt={buildPrompt(item, "calendar")} previewClass="min-h-[420px]" />
      <DocSection id="install" title="نصب"><InstallSteps item={item} targetDir="components/calendar" code={code} section="calendars" /></DocSection>
      <DocSection id="usage" title="استفاده"><UsageBlock code={item.usage} /></DocSection>
      {item.props && <DocSection id="props" title="پراپ‌ها"><PropsTable props={item.props} /></DocSection>}
      {item.notes && <DocSection id="notes" title="نکته‌ها"><Notes notes={item.notes} /></DocSection>}
      <PrevNext base="calendar" prev={calendar[i - 1]} next={calendar[i + 1]} />
    </article>
  );
}
