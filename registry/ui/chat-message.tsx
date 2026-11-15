"use client";

import * as React from "react";
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp, TriangleAlert } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type ChatRole = "user" | "assistant";

export interface ChatMessageProps {
  role: ChatRole;
  /** Shown above an assistant message, e.g. the model name. */
  name?: string;
  /** Avatar node for the assistant. User messages have none. */
  avatar?: React.ReactNode;
  /** Sent time; rendered as «۱۴:۳۰». */
  time?: Date;
  /** "streaming" marks the message busy for screen readers; "error" shows the retry row. */
  status?: "streaming" | "error";
  onRetry?: () => void;
  /** Row under an assistant message, usually <MessageActions />. */
  actions?: React.ReactNode;
  /** Files or images attached to a user message. */
  attachments?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const clock = (d: Date) => fa(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);

/**
 * پیام چت. The user's message is a bubble at the inline-start (right in RTL); the
 * assistant's answer is plain text across the column, which reads better for long
 * Persian paragraphs, code and tables.
 */
export function ChatMessage({ role, name, avatar, time, status, onRetry, actions, attachments, className, children }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className={cn("flex flex-col items-start gap-1", className)}>
        <span className="sr-only">شما:</span>
        {attachments && <div className="flex max-w-[85%] flex-wrap gap-2">{attachments}</div>}
        <div dir="auto" className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-ss-md bg-secondary px-4 py-2.5 text-sm leading-7 break-words">{children}</div>
        {time && <time dateTime={time.toISOString()} className="px-1 text-[11px] text-muted-foreground">{clock(time)}</time>}
      </div>
    );
  }
  return (
    <div className={cn("group/message flex gap-3", className)} aria-busy={status === "streaming" || undefined}>
      {avatar && <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card [&_svg]:size-4">{avatar}</div>}
      <div className="min-w-0 flex-1">
        <p className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{name ?? "دستیار"}</span>
          {time && <time dateTime={time.toISOString()}>{clock(time)}</time>}
        </p>
        <div className="text-sm leading-8">{children}</div>
        {status === "error" ? (
          <div role="alert" className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" />
            <span className="flex-1">پاسخ کامل نشد. اتصال را بررسی کنید و دوباره امتحان کنید.</span>
            {onRetry && <button type="button" onClick={onRetry} className="flex cursor-pointer items-center gap-1.5 font-medium underline underline-offset-4"><RotateCcw className="size-3.5" />تلاش دوباره</button>}
          </div>
        ) : (
          status !== "streaming" && actions && <div className="mt-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

export interface MessageActionsProps {
  /** Plain text of the message, for the copy button. */
  text: string;
  onRegenerate?: () => void;
  /** Called with "up", "down", or null when the vote is taken back. */
  onFeedback?: (vote: "up" | "down" | null) => void;
  className?: string;
}

const actionButton = "flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4";

/** کپی، بازنویسی و بازخورد. The row of small icon buttons under an assistant message. */
export function MessageActions({ text, onRegenerate, onFeedback, className }: MessageActionsProps) {
  const [copied, setCopied] = React.useState(false);
  const [vote, setVote] = React.useState<"up" | "down" | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  function cast(next: "up" | "down") {
    const value = vote === next ? null : next;
    setVote(value);
    onFeedback?.(value);
  }

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <button type="button" className={actionButton} onClick={copy} aria-label="کپی پاسخ" title="کپی">{copied ? <Check className="text-success" /> : <Copy />}</button>
      {onRegenerate && <button type="button" className={actionButton} onClick={onRegenerate} aria-label="نوشتن دوباره‌ی پاسخ" title="دوباره بنویس"><RotateCcw /></button>}
      {onFeedback && (
        <>
          <button type="button" className={cn(actionButton, vote === "up" && "bg-secondary text-foreground")} aria-pressed={vote === "up"} onClick={() => cast("up")} aria-label="پاسخ خوب بود" title="خوب بود"><ThumbsUp /></button>
          <button type="button" className={cn(actionButton, vote === "down" && "bg-secondary text-foreground")} aria-pressed={vote === "down"} onClick={() => cast("down")} aria-label="پاسخ خوب نبود" title="خوب نبود"><ThumbsDown /></button>
        </>
      )}
      <span role="status" className="sr-only">{copied ? "کپی شد" : ""}</span>
    </div>
  );
}

export interface ChatThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Keeps the view pinned to the newest message while the reader is at the bottom. */
  follow?: boolean;
}

/**
 * رشته‌ی گفت‌وگو. A scrolling log that follows new text while you are at the bottom and
 * leaves you alone once you scroll up to read.
 */
export function ChatThread({ follow = true, className, children, ...props }: ChatThreadProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const pinned = React.useRef(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !follow) return;
    const onScroll = () => { pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48; };
    const observer = new MutationObserver(() => { if (pinned.current) el.scrollTop = el.scrollHeight; });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    el.scrollTop = el.scrollHeight;
    return () => { observer.disconnect(); el.removeEventListener("scroll", onScroll); };
  }, [follow]);

  return (
    <div ref={ref} role="log" aria-label="گفت‌وگو" aria-live="polite" tabIndex={0} className={cn("flex flex-col gap-6 overflow-y-auto focus-visible:outline-none", className)} {...props}>
      {children}
    </div>
  );
}
