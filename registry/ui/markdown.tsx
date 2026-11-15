import * as React from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/registry/ui/code-block";

/* ------------------------------------------------------------------ direction */

const RTL_LETTERS = /[֐-ࣿיִ-﷿ﹰ-ﻼ]/g;
const LTR_LETTERS = /[A-Za-z]/g;

/**
 * Direction of a block of mixed text. `dir="auto"` only looks at the first strong
 * character, so «React یک کتابخانه است» would flip to LTR; this counts letters instead.
 * Inline code and URLs are ignored because they are always Latin.
 */
export function textDir(text: string): "rtl" | "ltr" | undefined {
  const plain = text.replace(/`[^`]*`/g, "").replace(/https?:\/\/\S+/g, "");
  const rtl = plain.match(RTL_LETTERS)?.length ?? 0;
  const ltr = plain.match(LTR_LETTERS)?.length ?? 0;
  if (rtl === 0) return ltr > 0 ? "ltr" : undefined;
  return rtl >= ltr * 0.3 ? "rtl" : "ltr";
}

/* --------------------------------------------------------------------- parser */

type ListItem = { depth: number; ordered: boolean; text: string; checked?: boolean };
type MdBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: ListItem[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "hr" };

const LIST_RE = /^(\s*)([-*+]|(?:\d+|[۰-۹]+)[.)])\s+(.*)$/;
const TABLE_SEP_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

const cells = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

/** Markdown to blocks. Tolerates an unfinished stream: an unclosed fence is still a code block. */
export function parseMarkdownBlocks(src: string): MdBlock[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++;
      blocks.push({ type: "code", lang: fence[1], code: body.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) { blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() }); i++; continue; }

    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) { blocks.push({ type: "hr" }); i++; continue; }

    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push({ type: "quote", text: body.join("\n") });
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && TABLE_SEP_RE.test(lines[i + 1])) {
      const head = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(cells(lines[i++]));
      blocks.push({ type: "table", head, rows });
      continue;
    }

    if (LIST_RE.test(line)) {
      const items: ListItem[] = [];
      while (i < lines.length) {
        const m = lines[i].match(LIST_RE);
        if (m) {
          const task = m[3].match(/^\[([ xX])\]\s+(.*)$/);
          items.push({ depth: Math.min(3, Math.floor(m[1].length / 2)), ordered: !/^[-*+]$/.test(m[2]), text: task ? task[2] : m[3], checked: task ? task[1] !== " " : undefined });
          i++;
        } else if (lines[i].trim() && /^\s{2,}/.test(lines[i]) && items.length) {
          // A wrapped line belongs to the item above it.
          items[items.length - 1].text += " " + lines[i].trim();
          i++;
        } else break;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const body: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*```/.test(lines[i]) && !/^#{1,4}\s/.test(lines[i]) && !/^\s*>/.test(lines[i]) && !LIST_RE.test(lines[i])) body.push(lines[i++]);
    blocks.push({ type: "paragraph", text: body.join("\n") });
  }
  return blocks;
}

/* --------------------------------------------------------------------- inline */

const INLINE_RE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(~~[^~\n]+~~)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))/;
const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#)/i;

function inline(text: string, keyBase = "i"): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let rest = text;
  let n = 0;
  while (rest) {
    const m = rest.match(INLINE_RE);
    if (!m || m.index === undefined) { out.push(rest); break; }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    const tok = m[0];
    const key = `${keyBase}-${n++}`;
    if (tok.startsWith("`")) {
      // Code is isolated and LTR so the surrounding Persian cannot reorder its punctuation.
      out.push(<bdi key={key} dir="ltr"><code className="rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]">{tok.slice(1, -1)}</code></bdi>);
    } else if (tok.startsWith("**") || tok.startsWith("__")) {
      out.push(<strong key={key} className="font-semibold">{inline(tok.slice(2, -2), key)}</strong>);
    } else if (tok.startsWith("~~")) {
      out.push(<del key={key}>{inline(tok.slice(2, -2), key)}</del>);
    } else if (tok.startsWith("*")) {
      out.push(<em key={key}>{inline(tok.slice(1, -1), key)}</em>);
    } else {
      const link = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)!;
      const href = SAFE_HREF.test(link[2]) ? link[2] : "#";
      const external = /^https?:/i.test(href);
      out.push(
        <a key={key} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="text-brand underline underline-offset-4 hover:opacity-80">
          <bdi>{inline(link[1], key)}</bdi>
        </a>,
      );
    }
    rest = rest.slice(m.index + tok.length);
  }
  return out;
}

/** Soft line breaks inside a paragraph become <br>. */
function withBreaks(text: string, keyBase: string) {
  return text.split("\n").flatMap((line, i) => (i === 0 ? inline(line, `${keyBase}-${i}`) : [<br key={`${keyBase}-br-${i}`} />, ...inline(line, `${keyBase}-${i}`)]));
}

/* ------------------------------------------------------------------- renderer */

export interface MarkdownProps {
  children: string;
  /** Shows a soft caret after the last block while a model is still writing. */
  streaming?: boolean;
  /** Base direction for blocks with no letters at all (numbers, emoji). */
  dir?: "rtl" | "ltr";
  className?: string;
}

const HEADING = ["", "text-xl font-bold mt-6", "text-lg font-bold mt-6", "text-base font-semibold mt-5", "text-sm font-semibold mt-4"];

/**
 * مارک‌داون راست‌چین. Renders model output where Persian, English and code are mixed:
 * every block gets its own direction, code blocks stay LTR, inline code is bidi-isolated,
 * and ordered lists count in Persian digits when the list is Persian.
 */
export function Markdown({ children, streaming, dir = "rtl", className }: MarkdownProps) {
  const blocks = React.useMemo(() => parseMarkdownBlocks(children), [children]);
  const caret = streaming ? <span aria-hidden className="ms-1 inline-block h-[1em] w-[3px] translate-y-[0.15em] rounded-full bg-foreground/70 motion-safe:animate-pulse" /> : null;

  return (
    <div className={cn("space-y-3 text-sm leading-8 [&>:first-child]:mt-0", className)}>
      {blocks.map((b, i) => {
        const last = i === blocks.length - 1;
        switch (b.type) {
          case "heading": {
            const Tag = `h${Math.min(6, b.level + 1)}` as "h2" | "h3" | "h4" | "h5";
            return <Tag key={i} dir={textDir(b.text) ?? dir} className={HEADING[b.level]}>{inline(b.text, `h${i}`)}{last && caret}</Tag>;
          }
          case "paragraph":
            return <p key={i} dir={textDir(b.text) ?? dir}>{withBreaks(b.text, `p${i}`)}{last && caret}</p>;
          case "code":
            return <CodeBlock key={i} code={b.code} language={b.lang || undefined} />;
          case "quote":
            return <blockquote key={i} dir={textDir(b.text) ?? dir} className="border-s-2 border-border ps-4 text-muted-foreground">{withBreaks(b.text, `q${i}`)}{last && caret}</blockquote>;
          case "hr":
            return <hr key={i} className="border-border" />;
          case "table":
            return (
              <div key={i} dir={textDir(b.head.join(" ")) ?? dir} className="overflow-x-auto rounded-surface border-line border-border">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-secondary/60">
                    <tr>{b.head.map((h, c) => <th key={c} scope="col" className="px-3 py-2 text-start font-semibold">{inline(h, `th${i}-${c}`)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-t border-border">
                        {row.map((cell, c) => <td key={c} className="px-3 py-2 align-top"><bdi>{inline(cell, `td${i}-${r}-${c}`)}</bdi></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "list": {
            const listDir = textDir(b.items.map((it) => it.text).join(" ")) ?? dir;
            const ordered = b.items[0]?.ordered;
            const List = ordered ? "ol" : "ul";
            return (
              <List key={i} dir={listDir} className={cn("space-y-1 ps-6", ordered ? (listDir === "rtl" ? "[list-style-type:persian]" : "list-decimal") : "list-disc", "marker:text-muted-foreground")}>
                {b.items.map((it, k) => (
                  <li key={k} style={{ marginInlineStart: it.depth ? `${it.depth * 1.25}rem` : undefined }} className={cn(it.checked !== undefined && "list-none -ms-6 flex items-start gap-2")}>
                    {it.checked !== undefined && <input type="checkbox" checked={it.checked} readOnly disabled className="mt-2 size-4 accent-[var(--brand)]" aria-label={it.checked ? "انجام‌شده" : "انجام‌نشده"} />}
                    <span>{inline(it.text, `l${i}-${k}`)}{last && k === b.items.length - 1 && caret}</span>
                  </li>
                ))}
              </List>
            );
          }
        }
      })}
      {blocks.length === 0 && caret}
    </div>
  );
}
