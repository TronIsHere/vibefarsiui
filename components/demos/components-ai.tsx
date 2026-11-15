"use client";

import * as React from "react";
import { Bot, Gauge, PackageSearch, Send, Sparkles, Zap } from "lucide-react";
import { ChatMessage, ChatThread, MessageActions } from "@/registry/ui/chat-message";
import { Markdown } from "@/registry/ui/markdown";
import { CodeBlock } from "@/registry/ui/code-block";
import { ToolCall, ToolCallGroup } from "@/registry/ui/tool-call";
import { Citation, Sources, type Source } from "@/registry/ui/sources";
import { ModelList, ModelPicker, type ModelOption } from "@/registry/ui/model-picker";
import { PromptInput } from "@/registry/ui/prompt-input";

const ANSWER = `برای راست‌چین کردن یک پروژه‌ی Next.js سه کار لازم است:

1. روی تگ \`html\` ویژگی \`dir="rtl"\` و \`lang="fa"\` بگذارید.
2. به‌جای \`ml-4\` و \`pr-2\` از کلاس‌های منطقی مثل \`ms-4\` و \`pe-2\` استفاده کنید.
3. آیکون‌های جهت‌دار را برعکس کنید، چون «بعدی» در فارسی به چپ اشاره می‌کند.

\`\`\`tsx
export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
\`\`\`

Tailwind logical utilities work in both directions, so the same markup also serves an English page.

| کلاس فیزیکی | کلاس منطقی |
| --- | --- |
| \`ml-4\` | \`ms-4\` |
| \`text-left\` | \`text-start\` |

> اعداد را با تابع \`fa\` فارسی کنید، نه با فونت.`;

const sources: Source[] = [
  { title: "راهنمای راست‌چین در Tailwind CSS", url: "https://tailwindcss.com/docs/padding", snippet: "کلاس‌های ps و pe بر اساس جهت متن به راست یا چپ نگاشت می‌شوند." },
  { title: "Structural markup and right-to-left text in HTML", url: "https://www.w3.org/International/questions/qa-html-dir", snippet: "Use the dir attribute on the html element to set the base direction of the whole document." },
  { title: "شیوه‌نامه‌ی خط فارسی", url: "https://apll.ir/dastoor-khat", snippet: "نیم‌فاصله در واژه‌های مرکب و پسوندها به کار می‌رود." },
  { title: "Next.js Internationalization", url: "https://nextjs.org/docs/app/guides/internationalization" },
];

const models: ModelOption[] = [
  { id: "fast", name: "سریع", description: "برای پرسش‌های روزمره و پاسخ کوتاه", badge: "پیش‌فرض", icon: <Zap /> },
  { id: "deep", name: "دقیق", description: "برای تحلیل، کد و متن‌های بلند", icon: <Gauge /> },
  { id: "max", name: "حرفه‌ای", description: "بیشترین دقت", icon: <Sparkles />, disabled: true, disabledReason: "فقط در پلن حرفه‌ای" },
];

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

function ChatDemo({ compact }: { compact?: boolean }) {
  return (
    <ChatThread className={compact ? "h-64 w-full pe-1" : "h-[28rem] w-full pe-2"}>
      <ChatMessage role="user" time={minutesAgo(3)}>سفارش آخرم کجاست؟ با شماره‌ی ۰۹۱۲ ثبت کرده بودم.</ChatMessage>
      <ChatMessage role="assistant" name="دستیار دکان" avatar={<Bot />} time={minutesAgo(3)} actions={<MessageActions text="سفارش شما تحویل پست شده است." onRegenerate={() => {}} onFeedback={() => {}} />}>
        {!compact && (
          <ToolCall className="mb-3" name="search_orders" label="جست‌وجو در سفارش‌ها" status="success" duration={1240} icon={<PackageSearch />} input={{ phone: "0912***4567", limit: 1 }} output={{ id: "DK-48213", status: "shipped", carrier: "post" }} />
        )}
        <Markdown>{"سفارش `DK-48213` دیروز **تحویل پست** شده و طبق برآورد تا پس‌فردا می‌رسد. کد رهگیری را هم برایتان پیامک کردم."}</Markdown>
      </ChatMessage>
      <ChatMessage role="user" time={minutesAgo(1)}>می‌شود نشانی تحویل را عوض کنم؟</ChatMessage>
      <ChatMessage role="assistant" name="دستیار دکان" avatar={<Bot />} status="streaming">
        <Markdown streaming>{"بعد از تحویل به پست، تغییر نشانی فقط از طریق"}</Markdown>
      </ChatMessage>
    </ChatThread>
  );
}

function ModelPickerDemo() {
  const [model, setModel] = React.useState("fast");
  return (
    // The open list sits beside the composer so the card shows what the trigger opens.
    <div className="grid w-full items-center gap-4 sm:grid-cols-2">
      <PromptInput placeholder="از دستیار بپرسید…" tools={<ModelPicker models={models} value={model} onChange={setModel} />} />
      <ModelList models={models} value={model} onChange={setModel} aria-label="مدل گفت‌وگو" className="shadow-overlay" />
    </div>
  );
}

const toolCalls = (
  <ToolCallGroup className="w-full">
    <ToolCall name="search_orders" label="جست‌وجو در سفارش‌ها" status="success" duration={1240} icon={<PackageSearch />} defaultOpen input={{ phone: "0912***4567", limit: 1 }} output={{ id: "DK-48213", status: "shipped", carrier: "post" }} />
    <ToolCall name="send_sms" label="ارسال پیامک کد رهگیری" status="running" icon={<Send />} input={{ template: "tracking", to: "0912***4567" }} />
    <ToolCall name="update_address" label="تغییر نشانی تحویل" status="error" duration={420} error="سفارش تحویل پست شده و نشانی آن دیگر قابل تغییر نیست." input={{ order: "DK-48213" }} />
  </ToolCallGroup>
);

const codeSample = `export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}`;

export const aiDemos: Record<string, React.ReactNode> = {
  "chat-message": <ChatDemo />,
  markdown: <div className="w-full"><Markdown>{ANSWER}</Markdown></div>,
  "code-block": <CodeBlock className="w-full" filename="app/layout.tsx" lineNumbers highlight={[3]} code={codeSample} />,
  "tool-call": toolCalls,
  sources: (
    <div className="w-full space-y-5">
      <p className="text-sm leading-8">
        برای راست‌چین کردن صفحه، ویژگی <bdi dir="ltr"><code className="rounded-md border border-border bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]">dir</code></bdi> را روی تگ اصلی بگذارید<Citation index={2} source={sources[1]} /> و از کلاس‌های منطقی استفاده کنید<Citation index={1} source={sources[0]} />.
      </p>
      <Sources sources={sources} />
      <Sources sources={sources} variant="chips" title="نمای فشرده" />
    </div>
  ),
  "model-picker": <ModelPickerDemo />,
};

export const aiCardDemos: Record<string, React.ReactNode> = {
  "chat-message": <ChatDemo compact />,
  markdown: (
    <div className="w-full">
      <Markdown>{"ویژگی `dir=\"rtl\"` را روی تگ `html` بگذارید.\n\n1. کلاس‌های منطقی مثل `ms-4`\n2. آیکون‌های برعکس\n\nTailwind handles both directions."}</Markdown>
    </div>
  ),
  "code-block": <CodeBlock className="w-full" filename="app/layout.tsx" code={codeSample} />,
  "tool-call": (
    <div className="w-full space-y-2">
      <ToolCall name="search_orders" label="جست‌وجو در سفارش‌ها" status="success" duration={1240} icon={<PackageSearch />} />
      <ToolCall name="send_sms" label="ارسال پیامک" status="running" icon={<Send />} />
    </div>
  ),
  sources: <div className="w-full"><Sources sources={sources.slice(0, 2)} /></div>,
  "model-picker": <ModelPickerDemo />,
};
