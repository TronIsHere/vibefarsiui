export const DEFAULT_REGISTRY = "https://vibefarsi.ir/r";

export type RegistryType = "component" | "chart" | "calendar" | "animation" | "background" | "template" | "block" | "site" | "theme" | "lib" | "skill";

export type CatalogItem = {
  type: RegistryType;
  slug: string;
  name: string;
  nameEn?: string;
  desc: string;
  file: string;
  target: string;
  url: string;
  deps: string[];
  registryDeps: string[];
  aliases: string[];
};

export type Catalog = {
  name: string;
  homepage: string;
  items: CatalogItem[];
};

export type RegistryFile = {
  path: string;
  /** Text files carry their content; binary assets (photos) carry a url to download instead. */
  content?: string;
  url?: string;
  type?: string;
};

/** Text of every file that has content, for dependency sniffing. */
export function textOf(files: RegistryFile[]) {
  return files.map((f) => f.content ?? "").join("\n");
}

export async function fetchBytes(client: RegistryClient, url: string) {
  const target = client.itemUrl(url);
  let res: Response;
  try {
    res = await fetch(target);
  } catch (err) {
    throw new Error(`Cannot download ${target}. ${err instanceof Error ? err.message : String(err)}`);
  }
  if (!res.ok) throw new Error(`Registry ${res.status} for ${target}`);
  return Buffer.from(await res.arrayBuffer());
}

export type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  css?: string;
  prompt?: string;
};

export type RegistryClient = {
  catalogUrl: string;
  origin: string;
  itemUrl: (rel: string) => string;
};

export function makeClient(registry: string): RegistryClient {
  if (!registry) {
    throw new Error(`Registry URL is missing. Pass --registry ${DEFAULT_REGISTRY}`);
  }
  const trimmed = registry.replace(/\/$/, "");
  const catalogUrl = trimmed.endsWith("/r") ? trimmed : `${trimmed}/r`;
  const origin = catalogUrl.replace(/\/r$/, "");
  return {
    catalogUrl,
    origin,
    itemUrl(rel: string) {
      if (/^https?:\/\//.test(rel)) return rel;
      const path = rel.startsWith("/") ? rel : `/${rel}`;
      return `${origin}${path}`;
    },
  };
}

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (err) {
    throw new Error(`Cannot reach registry at ${url}. ${err instanceof Error ? err.message : String(err)}`);
  }
  if (!res.ok) throw new Error(`Registry ${res.status} for ${url}`);
  return (await res.json()) as T;
}

export async function fetchCatalog(client: RegistryClient) {
  return getJson<Catalog>(client.catalogUrl);
}

export async function fetchItem(client: RegistryClient, item: CatalogItem) {
  return getJson<RegistryItem>(client.itemUrl(item.url));
}

const TYPE_RANK: RegistryType[] = ["lib", "component", "chart", "calendar", "block", "animation", "background", "template", "site", "theme", "skill"];

export function resolveItems(catalog: Catalog, queries: string[]) {
  const found: CatalogItem[] = [];
  const missing: string[] = [];
  for (const q of queries) {
    const item = resolveOne(catalog, q);
    if (item) found.push(item);
    else missing.push(q);
  }
  return { found, missing };
}

export function resolveOne(catalog: Catalog, query: string): CatalogItem | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  const typed = q.match(/^(components?|charts?|calendars?|blocks?|animations?|backgrounds?|templates?|sites?|themes?|skills?|lib)\/(.+)$/);
  if (typed) {
    const rawType = typed[1].replace(/s$/, "") as RegistryType;
    const type = (rawType === "component" || TYPE_RANK.includes(rawType) ? rawType : "component") as RegistryType;
    const slug = typed[2];
    return catalog.items.find((i) => i.type === type && i.slug === slug);
  }

  const exact = catalog.items.filter((i) => i.slug === q);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) {
    exact.sort((a, b) => TYPE_RANK.indexOf(a.type) - TYPE_RANK.indexOf(b.type));
    return exact[0];
  }

  const alias = catalog.items.filter((i) => i.aliases.some((a) => a.toLowerCase() === q));
  if (alias.length) {
    alias.sort((a, b) => TYPE_RANK.indexOf(a.type) - TYPE_RANK.indexOf(b.type));
    return alias[0];
  }
  return undefined;
}

export function rewriteUserSource(src: string) {
  return src
    .replace(/@\/registry\/ui\//g, "@/components/ui/")
    .replace(/@\/registry\/animations\//g, "@/components/animations/")
    .replace(/@\/registry\/backgrounds\//g, "@/components/backgrounds/")
    .replace(/@\/registry\/charts\//g, "@/components/charts/")
    .replace(/@\/registry\/calendar\//g, "@/components/calendar/")
    .replace(/@\/registry\/templates\//g, "@/components/templates/")
    .replace(/@\/registry\/blocks\//g, "@/components/blocks/")
    .replace(/@\/registry\/sites\//g, "@/components/sites/");
}

export function implicitLibSlugs(content: string) {
  const slugs: string[] = [];
  if (content.includes("@/lib/utils")) slugs.push("utils");
  if (content.includes("@/lib/jalali")) slugs.push("jalali");
  if (content.includes("@/lib/persian")) slugs.push("persian");
  if (content.includes("@/lib/number-to-words")) slugs.push("number-to-words");
  if (content.includes("@/lib/iran-divisions")) slugs.push("iran-divisions");
  if (content.includes("@/lib/chart-utils")) slugs.push("chart-utils");
  if (content.includes("@/lib/hijri")) slugs.push("hijri");
  if (content.includes("@/lib/iran-holidays")) slugs.push("iran-holidays");
  if (content.includes("@/lib/calendar-utils")) slugs.push("calendar-utils");
  if (content.includes("@/lib/float")) slugs.push("float");
  return slugs;
}

export function lucideNeeded(content: string) {
  return /from ["']lucide-react["']/.test(content);
}
