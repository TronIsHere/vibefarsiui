import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { loadCatalog, loadItem, registryUrl } from "./load.js";
import { findRecipe } from "./recipes.js";
import { designRules, TOPICS } from "./rules.js";
import { resolveName, searchCatalog } from "./search.js";
import type { CatalogItem, RegistryItem, RegistryType } from "./types.js";
import { REGISTRY_TYPES } from "./types.js";

function text(value: string, isError = false) {
  return { content: [{ type: "text" as const, text: value }], isError };
}

function itemCard(item: CatalogItem, score?: number): string {
  const bits = [
    `### ${item.name} \`${item.slug}\``,
    `${item.type}${item.category ? ` · ${item.category}` : ""}`,
    item.desc,
    score != null ? `score ${score}` : "",
    `get_component names: ["${item.slug}"]`,
  ].filter(Boolean);
  return bits.join("\n");
}

function renderItem(item: RegistryItem): string {
  const assets = item.files.filter((f) => f.content === undefined && f.url);
  const files = [
    ...item.files
      .filter((f) => f.content !== undefined)
      .map((f) => `#### ${f.path}\n\n\`\`\`${f.path.endsWith(".md") ? "md" : f.path.endsWith(".css") ? "css" : "tsx"}\n${f.content}\n\`\`\``),
    ...(assets.length ? [`#### Images\n\nDownload each into the given path:\n${assets.map((f) => `- ${f.path} ← ${registryUrl().replace(/\/r$/, "")}${f.url}`).join("\n")}`] : []),
  ].join("\n\n");
  const deps = item.dependencies.length ? item.dependencies.join(", ") : "none beyond react / tailwind";
  const rdeps = item.registryDependencies.length ? item.registryDependencies.join(", ") : "none";
  return [
    `# ${item.title} (${item.name})`,
    item.description,
    "",
    `npm: ${deps}`,
    `registry: ${rdeps}`,
    item.css ? `\nAdd this CSS to globals.css:\n\n\`\`\`css\n${item.css}\n\`\`\`` : "",
    item.prompt ? `\n## Prompt\n\n${item.prompt}` : "",
    files ? `\n## Files\n\n${files}` : "\nSource was not available. Use the prompt, or set VIBEFARSI_URL to the running site.",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

async function expandDeps(seed: CatalogItem[]): Promise<CatalogItem[]> {
  const catalog = await loadCatalog();
  const seen = new Set<string>();
  const out: CatalogItem[] = [];
  const queue = [...seed];
  while (queue.length) {
    const item = queue.shift()!;
    const key = `${item.type}:${item.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    for (const dep of item.registryDeps) {
      const hit = resolveName(catalog, dep) ?? catalog.items.find((i) => i.slug === dep);
      if (hit) queue.push(hit);
    }
  }
  return out;
}

export async function handleDesignRules(topic: (typeof TOPICS)[number] = "all") {
  return designRules(topic);
}

export async function handleSearch(query: string, type?: RegistryType, limit = 8) {
  const catalog = await loadCatalog();
  const hits = searchCatalog(catalog, query, { type, limit });
  if (!hits.length) {
    return `No registry match for "${query}". Try Persian or English (e.g. «تقویم», otp, toman, dashboard). Types: ${REGISTRY_TYPES.join(", ")}.`;
  }
  const header = `VibeFarsi registry · ${hits.length} hits for "${query}"\nCall get_component with the slugs you want. Do not substitute shadcn.`;
  return [header, "", ...hits.map((h) => itemCard(h.item, h.score))].join("\n\n");
}

export async function handleGetComponent(names: string[], includeDeps = true) {
  const catalog = await loadCatalog();
  const resolved: CatalogItem[] = [];
  const missing: string[] = [];
  for (const name of names) {
    const hit = resolveName(catalog, name);
    if (hit) resolved.push(hit);
    else missing.push(name);
  }
  if (!resolved.length) {
    return `None of these are in the VibeFarsi registry: ${names.join(", ")}. Call search_registry.`;
  }
  const set = includeDeps ? await expandDeps(resolved) : resolved;
  const bodies: string[] = [];
  for (const hit of set) {
    bodies.push(renderItem(await loadItem(hit)));
  }
  const miss = missing.length ? `\n\nUnmatched names: ${missing.join(", ")}. Call search_registry.` : "";
  return `${bodies.join("\n\n---\n\n")}${miss}`;
}

export async function handleGetTheme(name?: string) {
  const catalog = await loadCatalog();
  const slug = name?.trim() || "graphite";
  const hit = resolveName(catalog, slug, "theme") ?? catalog.items.find((i) => i.type === "theme" && i.slug === "graphite");
  if (!hit) return `No theme named "${slug}". Available: ${catalog.items.filter((i) => i.type === "theme").map((i) => `${i.slug} (${i.name})`).join(", ")}.`;
  const item = await loadItem(hit);
  const others = catalog.items
    .filter((i) => i.type === "theme")
    .map((i) => `- ${i.name} / ${i.nameEn} (\`${i.slug}\`) — ${i.desc}`)
    .join("\n");
  return `${renderItem(item)}\n\n## Other themes\n\n${others}\n\nPaste the CSS into :root (or replace the current block). Map tokens in @theme inline as on ${registryUrl()}/docs.`;
}

export async function handleScaffold(goal: string, theme?: string) {
  const catalog = await loadCatalog();
  const recipe = findRecipe(goal);
  const themeHit =
    (theme ? resolveName(catalog, theme, "theme") : undefined) ??
    catalog.items.find((i) => i.type === "theme" && i.slug === (recipe?.theme ?? "graphite"));

  const fromRecipe = recipe
    ? [...recipe.libs, ...recipe.components, recipe.template]
        .filter(Boolean)
        .map((slug) => resolveName(catalog, slug!))
        .filter((x): x is CatalogItem => Boolean(x))
    : [];

  const searched = searchCatalog(catalog, goal, { limit: 10 }).map((h) => h.item);
  const templates = searched.filter((i) => i.type === "template");
  const fullSites = searched.filter((i) => i.type === "site");
  const picks = fromRecipe.length ? fromRecipe : searched.slice(0, 8);

  const slugs = Array.from(new Set(picks.map((p) => p.slug)));
  const lines = [
    `# Scaffold: ${recipe?.title ?? goal}`,
    "",
    recipe?.summary ?? "No canned recipe for this brief. Below is a registry-backed plan. Still use VibeFarsi pieces, not shadcn.",
    "",
    `Theme: ${themeHit ? `${themeHit.name} (\`${themeHit.slug}\`)` : "graphite"} — call get_theme.`,
    "",
    "## Layout",
    recipe?.layout ?? "Compose a single RTL page from the components listed. html[dir=rtl]. Logical properties only.",
    "",
    "## Copy to use (Persian)",
    ...(recipe?.copy ?? []).map((c) => `- ${c}`),
    "",
    "## Registry pieces",
    ...picks.map((p) => `- ${p.name} (\`${p.slug}\`, ${p.type}) — ${p.desc}`),
    templates.length && !recipe?.template ? `\nMatching templates: ${templates.map((t) => t.slug).join(", ")}` : "",
    fullSites.length ? `\nWhole multi-page sites (shell + every route, one get_component call): ${fullSites.map((t) => t.slug).join(", ")}` : "",
    "",
    "## Next calls",
    "1. get_design_rules (if you have not)",
    `2. get_theme name: "${themeHit?.slug ?? "graphite"}"`,
    `3. get_component names: ${JSON.stringify(slugs)} includeDeps: true`,
    "",
    "## Do not",
    ...(recipe?.avoid ?? ["Inter / Geist", "Latin price digits", "ml-/pl-/text-left", "Monday-first calendars"]).map((a) => `- ${a}`),
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

export function registerTools(server: McpServer) {
  server.registerTool(
    "get_design_rules",
    {
      description:
        "Persian RTL design rules for VibeFarsi. Call this BEFORE generating any Iranian/Farsi UI. Covers direction, type, digits, forms, tokens, motion, a11y, and Iranian product patterns. Do not use shadcn or English UI defaults instead of this.",
      inputSchema: z.object({
        topic: z.enum(TOPICS).optional().describe("Subset of rules. Default all."),
      }),
    },
    async ({ topic }) => text(await handleDesignRules(topic ?? "all")),
  );

  server.registerTool(
    "search_registry",
    {
      description:
        "Search the VibeFarsi registry (components, charts, calendar views and holidays, blocks, animations, backgrounds, templates, whole multi-page sites, themes, lib helpers, and agent skills such as persian-conversational or jalali-calendar) with Persian or English. Use this instead of guessing shadcn names.",
      inputSchema: z.object({
        query: z.string().describe("What you need, e.g. تقویم, otp, toman, dashboard, فیروزه"),
        type: z.enum(REGISTRY_TYPES).optional().describe("Limit to one registry kind."),
        limit: z.number().int().min(1).max(25).optional(),
      }),
    },
    async ({ query, type, limit }) => text(await handleSearch(query, type, limit)),
  );

  server.registerTool(
    "get_component",
    {
      description:
        "Return source, prompt, and install path for one or more VibeFarsi items. Accepts slugs or Persian names (input, otp-field, تقویم). Pulls registry dependencies such as jalali and utils when includeDeps is true.",
      inputSchema: z.object({
        names: z.array(z.string()).min(1).describe("Slugs or names, e.g. [\"input\", \"otp-field\", \"date-picker\"]"),
        includeDeps: z.boolean().optional().describe("Also return registryDeps. Default true."),
      }),
    },
    async ({ names, includeDeps }) => text(await handleGetComponent(names, includeDeps ?? true)),
  );

  server.registerTool(
    "get_theme",
    {
      description:
        "Return CSS tokens for a VibeFarsi theme (graphite, turquoise, saffron, pomegranate, lapis, paper). Default graphite. Apply this instead of inventing a palette.",
      inputSchema: z.object({
        name: z.string().optional().describe("Theme slug or Persian/English name. Default graphite."),
      }),
    },
    async ({ name }) => text(await handleGetTheme(name)),
  );

  server.registerTool(
    "scaffold_page",
    {
      description:
        "Turn a page brief into a VibeFarsi composition plan (checkout, auth/OTP, dashboard, invoice, booking, wallet, …). Returns layout, Persian copy, and the get_component names to call next. Use this instead of a generic English dashboard template.",
      inputSchema: z.object({
        goal: z.string().describe("What to build, e.g. صفحه پرداخت, OTP login, Jalali booking"),
        theme: z.string().optional().describe("Theme slug if the user picked one."),
      }),
    },
    async ({ goal, theme }) => text(await handleScaffold(goal, theme)),
  );
}
