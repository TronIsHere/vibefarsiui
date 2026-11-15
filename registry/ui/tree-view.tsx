"use client";

import * as React from "react";
import { ChevronLeft, File, Folder, FolderOpen, type LucideIcon } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type TreeNode = {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Small text on the far side, e.g. a count or a size. */
  meta?: string | number;
  children?: TreeNode[];
  disabled?: boolean;
};

export interface TreeViewProps {
  items: TreeNode[];
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (node: TreeNode) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Folder and file icons for nodes without their own. Default true. */
  icons?: boolean;
  /** Guide lines down each level. Default true. */
  guides?: boolean;
  "aria-label"?: string;
  className?: string;
}

type Flat = { node: TreeNode; level: number; parent: string | null };

function flatten(items: TreeNode[], open: Set<string>, level = 1, parent: string | null = null, out: Flat[] = []) {
  for (const node of items) {
    out.push({ node, level, parent });
    if (node.children?.length && open.has(node.id)) flatten(node.children, open, level + 1, node.id, out);
  }
  return out;
}

function TreeIcon({ icon, className }: { icon: LucideIcon; className?: string }) {
  return React.createElement(icon, { className, "aria-hidden": true });
}

/**
 * درخت. Folders, categories or org charts with the WAI-ARIA tree pattern. In RTL the
 * arrows are mirrored: ArrowLeft opens a branch or steps into it, ArrowRight closes it
 * or goes to the parent. Up/Down, Home/End, * opens siblings, and typing jumps by letter.
 */
export function TreeView({ items, selected, defaultSelected = null, onSelect, expanded, defaultExpanded = [], onExpandedChange, icons = true, guides = true, className, ...aria }: TreeViewProps) {
  const [openInternal, setOpenInternal] = React.useState<string[]>(defaultExpanded);
  const [selInternal, setSelInternal] = React.useState<string | null>(defaultSelected);
  const open = React.useMemo(() => new Set(expanded ?? openInternal), [expanded, openInternal]);
  const sel = selected !== undefined ? selected : selInternal;
  const rows = flatten(items, open);
  const [focus, setFocus] = React.useState<string | null>(null);
  const focusId = focus && rows.some((r) => r.node.id === focus) ? focus : sel && rows.some((r) => r.node.id === sel) ? sel : rows[0]?.node.id;
  const refs = React.useRef(new Map<string, HTMLLIElement>());
  const typed = React.useRef({ text: "", at: 0 });

  const setOpen = (ids: string[]) => {
    if (expanded === undefined) setOpenInternal(ids);
    onExpandedChange?.(ids);
  };
  const toggle = (id: string, to?: boolean) => {
    const on = to ?? !open.has(id);
    setOpen(on ? [...open, id] : [...open].filter((x) => x !== id));
  };
  const choose = (n: TreeNode) => {
    if (n.disabled) return;
    if (selected === undefined) setSelInternal(n.id);
    onSelect?.(n);
  };
  const move = (id: string | undefined) => {
    if (!id) return;
    setFocus(id);
    refs.current.get(id)?.focus();
  };

  function onKeyDown(e: React.KeyboardEvent) {
    const i = rows.findIndex((r) => r.node.id === focusId);
    const r = rows[i];
    if (!r) return;
    const branch = !!r.node.children?.length;
    let handled = true;
    switch (e.key) {
      case "ArrowDown": move(rows[i + 1]?.node.id); break;
      case "ArrowUp": move(rows[i - 1]?.node.id); break;
      case "Home": move(rows[0]?.node.id); break;
      case "End": move(rows[rows.length - 1]?.node.id); break;
      case "ArrowLeft":
        if (branch && !open.has(r.node.id)) toggle(r.node.id, true);
        else if (branch) move(rows[i + 1]?.node.id);
        break;
      case "ArrowRight":
        if (branch && open.has(r.node.id)) toggle(r.node.id, false);
        else move(r.parent ?? undefined);
        break;
      case "Enter":
      case " ":
        choose(r.node);
        if (branch && e.key === "Enter") toggle(r.node.id);
        break;
      case "*": {
        const siblings = rows.filter((x) => x.parent === r.parent && x.node.children?.length).map((x) => x.node.id);
        setOpen([...new Set([...open, ...siblings])]);
        break;
      }
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
          const now = e.timeStamp;
          typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + e.key, at: now };
          const q = typed.current.text;
          const after = [...rows.slice(i + 1), ...rows.slice(0, i + 1)];
          move(after.find((x) => x.node.label.startsWith(q))?.node.id);
        } else handled = false;
    }
    if (handled) e.preventDefault();
  }

  return (
    <ul role="tree" aria-label={aria["aria-label"]} onKeyDown={onKeyDown} className={cn("text-sm", className)}>
      {rows.map(({ node, level }) => {
        const branch = !!node.children?.length;
        const isOpen = open.has(node.id);
        const on = node.id === sel;
        const icon = node.icon ?? (branch ? (isOpen ? FolderOpen : Folder) : File);
        return (
          <li
            key={node.id}
            ref={(el) => { if (el) refs.current.set(node.id, el); else refs.current.delete(node.id); }}
            role="treeitem"
            aria-level={level}
            aria-expanded={branch ? isOpen : undefined}
            aria-selected={on}
            aria-disabled={node.disabled || undefined}
            tabIndex={node.id === focusId ? 0 : -1}
            onFocus={() => setFocus(node.id)}
            onClick={(e) => { e.stopPropagation(); setFocus(node.id); choose(node); if (branch) toggle(node.id); }}
            className={cn(
              "relative flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-control pe-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60",
              on ? "bg-accent font-medium text-accent-foreground" : "hover:bg-accent/50",
              node.disabled && "cursor-not-allowed opacity-50",
            )}
            style={{ paddingInlineStart: (level - 1) * 18 + 6 }}
          >
            {guides && Array.from({ length: level - 1 }, (_, g) => (
              <span key={g} aria-hidden className="absolute inset-y-0 border-s border-border" style={{ insetInlineStart: g * 18 + 13 }} />
            ))}
            <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
              {branch && <ChevronLeft aria-hidden className={cn("size-3.5 transition-transform duration-(--motion) ease-motion", isOpen && "-rotate-90")} />}
            </span>
            {icons && <TreeIcon icon={icon} className={cn("size-4 shrink-0", branch ? "text-brand" : "text-muted-foreground")} />}
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.meta !== undefined && <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{typeof node.meta === "number" ? fa(node.meta) : node.meta}</span>}
          </li>
        );
      })}
    </ul>
  );
}
