import { animations, backgrounds, blocks, calendar, charts, buildPrompt, buildThemePrompt, components, hostedSkills, libs, sites, skillTarget, templates, themes } from "@/lib/registry";
import { readSource } from "@/lib/source";
import { siteRegistryItem } from "@/lib/site-registry";

const lists = { components, charts, calendars: calendar, animations, backgrounds, templates, blocks, themes, lib: libs, skills: hostedSkills } as const;
type Type = keyof typeof lists;

export function generateStaticParams() {
  return [
    ...(Object.keys(lists) as Type[]).flatMap((type) => lists[type].map((i) => ({ type, slug: `${i.slug}.json` }))),
    ...sites.map((i) => ({ type: "sites", slug: `${i.slug}.json` })),
  ];
}

function userPath(type: Type, file: string) {
  if (type === "themes") return "app/globals.css";
  if (type === "lib") return file;
  const name = file.split("/").pop()!;
  if (type === "components") return `components/ui/${name}`;
  if (type === "animations") return `components/animations/${name}`;
  if (type === "backgrounds") return `components/backgrounds/${name}`;
  if (type === "charts") return `components/charts/${name}`;
  if (type === "calendars") return `components/calendar/${name}`;
  if (type === "blocks") return `components/blocks/${name}`;
  return `components/templates/${name}`;
}

function targetPath(type: Type, item: { file: string; slug: string; format?: "skill" | "guide" | "external" }) {
  if (type === "skills" && item.format) return skillTarget({ slug: item.slug, format: item.format });
  return userPath(type, item.file);
}

/**
 * Machine-readable registry, shadcn-style: GET /r/components/button.json
 * Consumed by the CLI and MCP server.
 */
export async function GET(_req: Request, ctx: RouteContext<"/r/[type]/[slug]">) {
  const { type, slug: raw } = await ctx.params;
  const slug = raw.replace(/\.json$/, "");
  if (type === "sites") {
    const site = sites.find((i) => i.slug === slug);
    if (!site) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json(siteRegistryItem(site), { headers: { "Cache-Control": "public, max-age=3600" } });
  }
  const list = lists[type as Type];
  const item = list?.find((i) => i.slug === slug);
  if (!item) return Response.json({ error: "not_found" }, { status: 404 });

  const content = readSource(item.file);
  const isTheme = type === "themes";
  const kind = (type === "lib" ? "lib" : type.replace(/s$/, "")) as "component" | "chart" | "calendar" | "animation" | "background" | "template" | "block" | "lib" | "skill";
  const prompt = "swatches" in item
    ? buildThemePrompt(item)
    : "promptBullets" in item && kind !== "skill"
      ? buildPrompt(item, kind)
      : undefined;

  const isLib = type === "lib";
  const isSkill = type === "skills";
  const fileKind = isTheme ? "registry:style" : isLib ? "registry:lib" : isSkill ? "registry:skill" : "registry:component";
  const body = {
    $schema: "https://vibefarsi.dev/schema/registry-item.json",
    name: item.slug,
    type: `registry:${isLib ? "lib" : type.replace(/s$/, "")}`,
    title: item.name,
    description: item.desc,
    dependencies: "deps" in item ? item.deps ?? [] : [],
    registryDependencies: "registryDeps" in item ? item.registryDeps ?? [] : [],
    files: [{ path: targetPath(type as Type, item), content, type: fileKind }],
    ...("css" in item && item.css ? { css: item.css } : {}),
    prompt,
  };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=3600" } });
}
