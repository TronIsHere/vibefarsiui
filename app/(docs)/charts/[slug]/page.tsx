import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPrompt, charts } from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, InstallSteps, Notes, PrevNext, PropsTable, UsageBlock } from "@/components/docs/blocks";

export function generateStaticParams() {
  return charts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/charts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = charts.find((c) => c.slug === slug);
  return itemMetadata(item, "نمودارها", `/charts/${slug}`);
}

export default async function Page({ params }: PageProps<"/charts/[slug]">) {
  const { slug } = await params;
  const i = charts.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const item = charts[i];
  const code = readSource(item.file);
  const files = [
    { name: item.file.split("/").pop()!, code },
    // Every chart ships with the shared core and the math module it imports.
    ...(item.slug !== "chart-core" ? [{ name: "chart-core.tsx", code: readSource("registry/charts/chart-core.tsx") }] : []),
    { name: "chart-utils.ts", code: readSource("lib/chart-utils.ts") },
  ];

  return (
    <article className="space-y-12">
      <DocHeader section="charts" sectionLabel="نمودارها" item={item} kind="نمودار" />
      <ItemTabs demo={{ kind: "chart", slug: item.slug }} files={files} prompt={buildPrompt(item, "chart")} previewClass="min-h-[380px]" />
      <DocSection id="install" title="نصب"><InstallSteps item={item} targetDir="components/charts" code={code} section="charts" /></DocSection>
      <DocSection id="usage" title="استفاده"><UsageBlock code={item.usage} /></DocSection>
      {item.props && <DocSection id="props" title="پراپ‌ها"><PropsTable props={item.props} /></DocSection>}
      {item.notes && <DocSection id="notes" title="نکته‌ها"><Notes notes={item.notes} /></DocSection>}
      <PrevNext base="charts" prev={charts[i - 1]} next={charts[i + 1]} />
    </article>
  );
}
