import "server-only";
import {
  createHighlighter,
  createJavaScriptRegexEngine,
  type Highlighter,
  type ThemeRegistrationRaw,
  type ThemedToken,
} from "shiki";

export type Lang = "tsx" | "css" | "json" | "markdown" | "bash" | "text";

/**
 * Graphite palette as hex — TextMate themes only accept hex. Values are the
 * design tokens in registry/themes/graphite.css plus the accents the old
 * regex highlighter used (fuchsia-300, sky-300). Each hex only names a role:
 * `highlight` swaps it for `var(--code-<role>)`, which `code-well` in
 * app/globals.css defines for dark and light themes, so every hex must be unique.
 */
const c = {
  fg: "#d7d7d9", // oklch(0.88 0.003 285), foreground nudged down for long reads
  muted: "#89898b", // --muted-foreground
  brand: "#ffa430", // --brand
  success: "#2acc8a", // --success
  warning: "#fab72a", // --warning
  keyword: "#f4a8ff", // fuchsia-300
  attr: "#74d4ff", // sky-300
  type: "#82e1e0", // oklch(0.85 0.09 195)
  fn: "#c3b9ff", // oklch(0.82 0.1 290)
} as const;

const graphite: ThemeRegistrationRaw = {
  name: "graphite",
  type: "dark",
  colors: { "editor.foreground": c.fg, "editor.background": "#09090a" },
  settings: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: c.muted, fontStyle: "italic" } },
    { scope: ["string", "string.template", "string.regexp"], settings: { foreground: c.success } },
    // Inside `${…}` and `{…}` the surrounding string/JSX rule must not leak in.
    { scope: ["meta.template.expression", "meta.embedded", "meta.jsx.children"], settings: { foreground: c.fg } },
    { scope: ["punctuation.definition.template-expression"], settings: { foreground: c.brand } },
    { scope: ["constant.character.escape"], settings: { foreground: c.warning } },
    { scope: ["keyword.control", "storage", "variable.language", "keyword.operator.new", "keyword.operator.expression", "keyword.other.important", "constant.language.import-export-all"], settings: { foreground: c.keyword } },
    { scope: ["keyword.operator"], settings: { foreground: c.fg } },
    { scope: ["constant.numeric", "constant.language", "keyword.other.unit"], settings: { foreground: c.warning } },
    { scope: ["entity.name.type", "entity.name.namespace", "support.type.primitive", "support.type.builtin", "support.class", "entity.other.inherited-class"], settings: { foreground: c.type } },
    { scope: ["entity.name.function", "support.function", "variable.function"], settings: { foreground: c.fn } },
    // JSX / HTML
    { scope: ["entity.name.tag", "support.class.component"], settings: { foreground: c.brand } },
    { scope: ["punctuation.definition.tag"], settings: { foreground: c.muted } },
    { scope: ["entity.other.attribute-name", "meta.object-literal.key", "support.type.property-name.json"], settings: { foreground: c.attr } },
    { scope: ["punctuation.separator.key-value"], settings: { foreground: c.fg } },
    // CSS
    { scope: ["entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css", "entity.other.attribute-name.pseudo-class.css", "entity.other.attribute-name.pseudo-element.css"], settings: { foreground: c.brand } },
    { scope: ["support.type.property-name.css", "support.type.vendored.property-name.css"], settings: { foreground: c.attr } },
    { scope: ["variable.css", "variable.argument.css", "support.type.custom-property"], settings: { foreground: c.type } },
    { scope: ["keyword.control.at-rule", "punctuation.definition.keyword.css"], settings: { foreground: c.keyword } },
    // Markdown (SKILL.md and guides in registry/skills)
    { scope: ["markup.heading", "entity.name.section.markdown", "punctuation.definition.heading.markdown"], settings: { foreground: c.brand, fontStyle: "bold" } },
    { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
    { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
    { scope: ["markup.inline.raw", "markup.raw.block"], settings: { foreground: c.success } },
    { scope: ["markup.underline.link", "string.other.link.title.markdown"], settings: { foreground: c.attr } },
    { scope: ["markup.quote", "punctuation.definition.quote.begin.markdown"], settings: { foreground: c.muted, fontStyle: "italic" } },
    { scope: ["punctuation.definition.list.begin.markdown", "meta.separator.markdown", "punctuation.definition.table.markdown"], settings: { foreground: c.brand } },
    { scope: ["punctuation.definition.markdown", "fenced_code.block.language"], settings: { foreground: c.muted } },
    // Shell
    { scope: ["source.shell entity.name.command", "support.function.builtin.shell"], settings: { foreground: c.fn } },
  ],
};

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
  // Regex engine instead of the Oniguruma WASM: nothing to load, and every
  // grammar we use is supported.
  return (highlighter ??= createHighlighter({
    themes: [graphite],
    langs: ["tsx", "css", "json", "markdown", "bash"],
    engine: createJavaScriptRegexEngine(),
  }));
}

export type Line = ThemedToken[];

// vscode-textmate upper-cases hex.
const roles = new Map(Object.entries(c).map(([role, hex]) => [hex.toUpperCase(), role]));

/**
 * Tokenizes `code` with the graphite theme; one array per line. `color` is a
 * `var(--code-<role>)` reference so the well can follow the page theme; tokens
 * with the default color have none and inherit from `code-well`.
 */
export async function highlight(code: string, lang: Lang): Promise<Line[]> {
  const h = await getHighlighter();
  const { tokens } = h.codeToTokens(code, { lang, theme: "graphite" });
  return tokens.map((line) =>
    line.map((t) => {
      const role = t.color && roles.get(t.color.toUpperCase());
      return { ...t, color: role && role !== "fg" ? `var(--code-${role})` : undefined };
    }),
  );
}
