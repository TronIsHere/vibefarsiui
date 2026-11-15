"use client";

import * as React from "react";
import { ArrowRight, Check, CheckCheck, Mic, MoreVertical, Paperclip, Phone, Pin, Play, Reply, Search, Send, Smile, X } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { cn, fa } from "@/lib/utils";

type Msg = { id: number; from: "me" | "them"; text?: string; voice?: number; time: string; status?: "sent" | "read"; reply?: number; author?: string };
type Chat = { id: string; name: string; last: string; time: string; unread?: number; pinned?: boolean; online?: boolean; group?: boolean; messages: Msg[] };

const chats: Chat[] = [
  {
    id: "team",
    name: "تیم محصول",
    group: true,
    pinned: true,
    last: "مهسا: نسخه‌ی جدید روی استیجینگه",
    time: "۱۰:۴۲",
    unread: 3,
    messages: [
      { id: 1, from: "them", author: "مهسا", text: "صبح بخیر! نسخه‌ی جدید روی استیجینگه، لطفاً یه نگاه بندازید.", time: "۰۹:۱۲" },
      { id: 2, from: "me", text: "صبح بخیر. فرم ثبت‌نام را چک کردم، کد تأیید درست میاد 👌", time: "۰۹:۳۰", status: "read" },
      { id: 3, from: "them", author: "کیان", text: "صفحه‌ی پرداخت روی موبایل یه کم بهم ریخته. اسکرین‌شات می‌فرستم.", time: "۱۰:۰۵" },
      { id: 4, from: "them", author: "مهسا", voice: 34, time: "۱۰:۲۱" },
      { id: 5, from: "me", reply: 3, text: "دیدم، مشکل از عرض جدول اقلامه. تا ظهر درستش می‌کنم.", time: "۱۰:۴۰", status: "sent" },
    ],
  },
  { id: "sara", name: "سارا احمدی", online: true, last: "باشه، فردا ساعت ۱۰ می‌بینمت", time: "۰۹:۵۵", messages: [{ id: 1, from: "them", text: "جلسه‌ی فردا سر جاشه؟", time: "۰۹:۵۰" }, { id: 2, from: "me", text: "آره، ساعت ۱۰ دفتر.", time: "۰۹:۵۲", status: "read" }, { id: 3, from: "them", text: "باشه، فردا ساعت ۱۰ می‌بینمت", time: "۰۹:۵۵" }] },
  { id: "ali", name: "علی رضایی", last: "فایل را فرستادم", time: "دیروز", unread: 1, messages: [{ id: 1, from: "them", text: "فایل را فرستادم", time: "۲۲:۱۰" }] },
  { id: "mom", name: "مامان", pinned: true, online: true, last: "شام میای؟", time: "دیروز", messages: [{ id: 1, from: "them", text: "شام میای؟", time: "۱۹:۳۰" }] },
  { id: "news", name: "کانال اخبار فناوری", group: true, last: "گزارش هفتگی بازار موبایل", time: "شنبه", messages: [{ id: 1, from: "them", text: "گزارش هفتگی بازار موبایل منتشر شد.", time: "۱۸:۰۰" }] },
];

function Ticks({ status }: { status?: Msg["status"] }) {
  if (!status) return null;
  return status === "read" ? <CheckCheck className="size-3.5 text-brand" aria-label="خونده شده" /> : <Check className="size-3.5 opacity-70" aria-label="ارسال شده" />;
}

/** پیام‌رسان: فهرست گفت‌وگوها با سنجاق و نخونده، حباب پیام با پاسخ و پیام صوتی، تیک خونده‌شدن و نوشتن پیام. */
export function MessengerPage() {
  const [data, setData] = React.useState(chats);
  const [activeId, setActiveId] = React.useState<string | null>("team");
  const [q, setQ] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [replyTo, setReplyTo] = React.useState<Msg | null>(null);
  const endRef = React.useRef<HTMLDivElement>(null);
  const active = data.find((c) => c.id === activeId) ?? null;
  const sorted = [...data].filter((c) => !q || c.name.includes(q)).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [activeId, active?.messages.length]);

  function open(id: string) {
    setActiveId(id);
    setReplyTo(null);
    setData((d) => d.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function send() {
    const text = draft.trim();
    if (!text || !active) return;
    const msg: Msg = { id: Date.now(), from: "me", text, time: "۱۰:۴۵", status: "sent", reply: replyTo?.id };
    setData((d) => d.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, msg], last: text, time: "۱۰:۴۵" } : c)));
    setDraft("");
    setReplyTo(null);
  }

  return (
    <div className="flex h-dvh bg-background text-foreground">
      <aside className={cn("flex w-full flex-col border-e border-border md:w-80", active && "hidden md:flex")} aria-label="گفت‌وگوها">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <label className="relative flex-1">
            <span className="sr-only">جست‌وجو</span>
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو" className="h-9 w-full rounded-full bg-secondary ps-9 pe-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60" />
          </label>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {sorted.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => open(c.id)} aria-current={c.id === activeId ? "true" : undefined} className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors", c.id === activeId ? "bg-accent" : "hover:bg-accent/50")}>
                <span className="relative">
                  <Avatar name={c.name} size="lg" />
                  {c.online && <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-background bg-success" aria-label="آنلاین" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">{c.name}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-muted-foreground">{c.last}</span>
                    {c.unread ? <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-foreground">{fa(c.unread)}<span className="sr-only"> پیام نخونده</span></span> : c.pinned ? <Pin className="size-3.5 text-muted-foreground" aria-label="سنجاق‌شده" /> : null}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {active ? (
        <section className="flex min-w-0 flex-1 flex-col" aria-label={`گفت‌وگو با ${active.name}`}>
          <header className="flex items-center gap-3 border-b border-border px-3 py-2">
            <button type="button" onClick={() => setActiveId(null)} aria-label="بازگشت به فهرست" className="rounded-control p-1.5 hover:bg-accent md:hidden"><ArrowRight className="size-5" /></button>
            <Avatar name={active.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{active.name}</p>
              <p className="text-xs text-muted-foreground">{active.group ? `${fa(12)} عضو، ${fa(4)} آنلاین` : active.online ? "آنلاین" : "اخیراً دیده شده"}</p>
            </div>
            <button type="button" aria-label="تماس" className="rounded-control p-2 text-muted-foreground hover:bg-accent"><Phone className="size-5" /></button>
            <button type="button" aria-label="بیشتر" className="rounded-control p-2 text-muted-foreground hover:bg-accent"><MoreVertical className="size-5" /></button>
          </header>

          <div role="log" aria-live="polite" className="flex-1 space-y-2 overflow-y-auto bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:20px_20px] px-3 py-4 sm:px-6">
            <p className="mx-auto w-fit rounded-full bg-background/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">امروز</p>
            {active.messages.map((m) => {
              const quoted = m.reply ? active.messages.find((x) => x.id === m.reply) : null;
              const mine = m.from === "me";
              return (
                <div key={m.id} className={cn("group flex items-end gap-1", mine ? "justify-start" : "justify-end")}>
                  {/* Mine on the start (right) side, like the rest of this kit's chat. */}
                  <div className={cn("max-w-[78%] rounded-2xl px-3 py-2 shadow-control", mine ? "rounded-ss-sm bg-primary text-primary-foreground" : "rounded-se-sm bg-card")}>
                    {m.author && !mine && <p className="mb-0.5 text-xs font-semibold text-brand">{m.author}</p>}
                    {quoted && (
                      <p className={cn("mb-1.5 border-s-2 ps-2 text-xs", mine ? "border-primary-foreground/50 opacity-80" : "border-brand text-muted-foreground")}>
                        <span className="block font-semibold">{quoted.author ?? "شما"}</span>
                        <span className="line-clamp-1">{quoted.text ?? "پیام صوتی"}</span>
                      </p>
                    )}
                    {m.voice ? (
                      <span className="flex items-center gap-2 py-1">
                        <button type="button" aria-label={`پخش پیام صوتی ${fa(m.voice)} ثانیه‌ای`} className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground"><Play className="size-4 fill-current" /></button>
                        <span aria-hidden dir="ltr" className="flex h-6 items-center gap-0.5">
                          {Array.from({ length: 28 }, (_, i) => <span key={i} className="w-0.5 rounded-full bg-current opacity-50" style={{ height: `${25 + ((i * 37) % 70)}%` }} />)}
                        </span>
                        <span className="text-[11px] tabular-nums opacity-70">{fa(`0:${m.voice}`)}</span>
                      </span>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-7">{m.text}</p>
                    )}
                    <p className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10px] tabular-nums", mine ? "opacity-70" : "text-muted-foreground")}>
                      {m.time}
                      {mine && <Ticks status={m.status} />}
                    </p>
                  </div>
                  <button type="button" onClick={() => setReplyTo(m)} aria-label="پاسخ" className="rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent focus-visible:opacity-100 group-hover:opacity-100"><Reply className="size-4" /></button>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <form className="border-t border-border p-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
            {replyTo && (
              <div className="mb-2 flex items-center gap-2 rounded-control bg-secondary px-3 py-1.5 text-xs">
                <Reply className="size-4 text-brand" />
                <span className="min-w-0 flex-1 truncate">پاسخ به {replyTo.author ?? "خودتون"}: {replyTo.text ?? "پیام صوتی"}</span>
                <button type="button" aria-label="لغو پاسخ" onClick={() => setReplyTo(null)}><X className="size-4" /></button>
              </div>
            )}
            <div className="flex items-end gap-1">
              <button type="button" aria-label="شکلک" className="rounded-full p-2.5 text-muted-foreground hover:bg-accent"><Smile className="size-5" /></button>
              <label className="flex-1">
                <span className="sr-only">پیام</span>
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="پیام"
                  className="max-h-32 min-h-10 w-full resize-none rounded-2xl bg-secondary px-4 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                />
              </label>
              <button type="button" aria-label="پیوست" className="rounded-full p-2.5 text-muted-foreground hover:bg-accent"><Paperclip className="size-5" /></button>
              {draft.trim() ? (
                <button type="submit" aria-label="ارسال" className="rounded-full bg-brand p-2.5 text-brand-foreground"><Send className="size-5 -scale-x-100" /></button>
              ) : (
                <button type="button" aria-label="ضبط پیام صوتی" className="rounded-full p-2.5 text-muted-foreground hover:bg-accent"><Mic className="size-5" /></button>
              )}
            </div>
          </form>
        </section>
      ) : (
        <div className="hidden flex-1 items-center justify-center text-sm text-muted-foreground md:flex">یک گفت‌وگو را باز کنید.</div>
      )}
    </div>
  );
}
