import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Catalog, CatalogItem, RegistryItem } from "./types.js";

const DEFAULT_URL = "https://vibefarsi.ir";

export function registryUrl(): string {
  return (process.env.VIBEFARSI_URL || DEFAULT_URL).replace(/\/$/, "");
}

export function repoRoots(): string[] {
  const extra = process.env.VIBEFARSI_ROOT;
  return Array.from(new Set([extra, process.cwd(), resolve(process.cwd(), "..")].filter(Boolean) as string[]));
}

function toUserSource(src: string): string {
  return src
    .replace(/@\/registry\/ui\//g, "@/components/ui/")
    .replace(/@\/registry\/animations\//g, "@/components/animations/")
    .replace(/@\/registry\/backgrounds\//g, "@/components/backgrounds/")
    .replace(/@\/registry\/charts\//g, "@/components/charts/")
    .replace(/@\/registry\/calendar\//g, "@/components/calendar/")
    .replace(/@\/registry\/templates\//g, "@/components/templates/")
    .replace(/@\/registry\/blocks\//g, "@/components/blocks/")
    .replace(/@\/registry\/sites\//g, "@/components/sites/")
    .trimEnd();
}

function readLocalFile(file: string): string | undefined {
  for (const root of repoRoots()) {
    const abs = resolve(root, file);
    if (existsSync(abs)) return toUserSource(readFileSync(abs, "utf8"));
  }
}

async function catalogFromRepo(): Promise<Catalog | undefined> {
  for (const root of repoRoots()) {
    const file = resolve(root, "lib/registry/catalog.ts");
    if (!existsSync(file)) continue;
    try {
      const mod = (await import(pathToFileURL(file).href)) as { buildCatalog: (home?: string) => Catalog };
      return mod.buildCatalog(registryUrl());
    } catch {
      // compiled MCP cannot import the Next app; HTTP still works
    }
  }
}

async function catalogFromJson(): Promise<Catalog | undefined> {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    ...repoRoots().map((root) => resolve(root, "mcp/data/catalog.json")),
    resolve(here, "../data/catalog.json"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      const data = JSON.parse(readFileSync(file, "utf8")) as Catalog;
      if (Array.isArray(data.items)) return data;
    } catch {
      /* skip bad snapshot */
    }
  }
}

async function catalogFromHttp(): Promise<Catalog | undefined> {
  const base = registryUrl();
  for (const path of ["/r/catalog", "/r"]) {
    try {
      const res = await fetch(`${base}${path}`);
      if (!res.ok) continue;
      const data = (await res.json()) as Catalog;
      if (Array.isArray(data.items)) return data;
    } catch {
      /* try next */
    }
  }
}

let cached: Catalog | undefined;

type LocalRegistry = {
  catalog: () => Catalog | Promise<Catalog>;
  readFile: (file: string) => string | undefined;
  /** Whole multi-file items (sites) that a single readFile cannot describe. */
  readItem?: (hit: CatalogItem) => RegistryItem | undefined;
};

let local: LocalRegistry | undefined;

/** The hosted Next.js route injects the in-process registry so /mcp does not HTTP-fetch itself. */
export function useLocalRegistry(access: LocalRegistry) {
  local = access;
  cached = undefined;
}

export async function loadCatalog(): Promise<Catalog> {
  if (cached) return cached;
  cached =
    (local ? await local.catalog() : undefined) ??
    (await catalogFromRepo()) ??
    (await catalogFromJson()) ??
    (await catalogFromHttp());
  if (!cached) {
    throw new Error(
      `Could not load the VibeFarsi registry. Run this inside the vibefarsi-ui repo, or set VIBEFARSI_URL (tried ${registryUrl()}).`,
    );
  }
  return cached;
}

export function clearCatalogCache() {
  cached = undefined;
}

function metaItem(hit: CatalogItem, content?: string): RegistryItem {
  return {
    name: hit.slug,
    type: `registry:${hit.type}`,
    title: hit.name,
    description: hit.desc,
    dependencies: hit.deps,
    registryDependencies: hit.registryDeps,
    files: content ? [{ path: hit.target, content }] : [],
    prompt: hit.prompt,
  };
}

async function itemFromHttp(hit: CatalogItem): Promise<RegistryItem | undefined> {
  try {
    const res = await fetch(`${registryUrl()}${hit.url}`);
    if (!res.ok) return;
    return (await res.json()) as RegistryItem;
  } catch {
    return;
  }
}

export async function loadItem(hit: CatalogItem): Promise<RegistryItem> {
  const whole = local?.readItem?.(hit);
  if (whole) return whole;
  if (hit.type === "site") {
    // A site is a folder of files; only the registry route knows how to bundle it.
    const remote = await itemFromHttp(hit);
    return remote ? { ...remote, prompt: remote.prompt ?? hit.prompt } : metaItem(hit);
  }
  const hooked = local?.readFile(hit.file);
  if (hooked) return metaItem(hit, hooked);
  const fromDisk = readLocalFile(hit.file);
  if (fromDisk) return metaItem(hit, fromDisk);
  const remote = await itemFromHttp(hit);
  if (remote) return { ...remote, prompt: remote.prompt ?? hit.prompt };
  return metaItem(hit);
}
