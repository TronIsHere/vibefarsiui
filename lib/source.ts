import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

/** Rewrites in-repo registry imports to the paths a consuming app should use. */
export function toUserSource(src: string): string {
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

/** Reads a registry file so the docs always show the code that actually runs. */
export function readSource(file: string): string {
  const abs = path.join(/* turbopackIgnore: true */ process.cwd(), file);
  return toUserSource(readFileSync(abs, "utf8"));
}
