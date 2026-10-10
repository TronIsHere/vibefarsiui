import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, FileCode2, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/shared/code-block";
import { JsonLd } from "@/components/shared/json-ld";
import type { Lang } from "@/lib/highlight";
import { CopyButton } from "@/components/shared/copy-button";
import { DocSection, Notes } from "@/components/docs/blocks";
import { readSource } from "@/lib/source";
import { sections } from "@/lib/registry";
import { docsHowToJsonLd, pageMetadata } from "@/lib/site";
import { PRODUCT_FAQ, faqJsonLd } from "@/lib/faq";
import { cn, fa } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "نصب وایب‌فارسی در Next.js و React · شروع سریع",
  description: "نصب وایب‌فارسی در پروژه‌ی Next.js یا React با Tailwind v4: خودکار با CLI یا دستی با کپی فایل. راست‌چین، فونت فارسی و توکن‌های تم از اول آماده می‌شود.",
  path: "/docs",
});

const CLI_INIT = "npx vibefarsi@latest init";
const CLI_ADD = "npx vibefarsi add button calendar price";
const CLI_LIST = "npx vibefarsi list";

const LAYOUT = `// app/layout.tsx
import { Vazirmatn } from "next/font/google"
import "./globals.css"

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-background text-foreground font-sans">{children}</body>
    </html>
  )
}`;

const GOOGLE_FONT = `@import url("https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap");`;

// Same block the CLI writes on init (packages/cli/src/css.ts), so the manual path lands on identical output.
const TAILWIND_MAP = `/* app/globals.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Design language: type, shape, line, depth and motion of the active system. */
  --radius-control: var(--shape-control);
  --radius-field: var(--shape-field);
  --radius-surface: var(--shape-surface);
  --radius-overlay: var(--shape-overlay);
  --border-width-line: var(--line);
  --border-width-line-field: var(--line-field);
  --color-field: var(--field);
  --shadow-control: var(--depth-control);
  --shadow-press: var(--depth-press);
  --shadow-field: var(--depth-field);
  --shadow-surface: var(--depth-surface);
  --shadow-overlay: var(--depth-overlay);
  --ease-motion: var(--motion-ease);
  --font-display: var(--type-display);
  --font-sans: var(--font-vazirmatn), "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    font-size: 16.5px;
    line-height: 1.8;
    letter-spacing: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-family: var(--type-body, inherit);
    background-image: var(--backdrop, none);
  }

  h1, h2, h3, h4 {
    font-family: var(--type-display, inherit);
    font-weight: var(--type-display-weight, 700);
    /* Single-weight display faces (Lalezar) must not be faux-bolded. */
    font-synthesis-weight: none;
  }

  /* iOS Safari zooms into any focused field smaller than 16px; only iOS matches this query. */
  @supports (-webkit-touch-callout: none) {
    input, textarea, select {
      --text-xs: 1rem;
      --text-sm: 1rem;
      font-size: max(1rem, 1em);
    }
  }
}`;

const MCP = `{
  "mcpServers": {
    "vibefarsi": {
      "url": "https://vibefarsi.ir/mcp"
    }
  }
}`;

const MCP_NPX = `{
  "mcpServers": {
    "vibefarsi": {
      "command": "npx",
      "args": ["-y", "@vibefarsi/mcp"]
    }
  }
}`;

const INIT_WRITES: React.ReactNode[] = [
  <>
    <Inline>lang=&quot;fa&quot; dir=&quot;rtl&quot;</Inline> روی <Inline>&lt;html&gt;</Inline>، در Next.js داخل{" "}
    <Inline>app/layout.tsx</Inline> و در Vite داخل <Inline>index.html</Inline>
  </>,
  <>
    فونت Vazirmatn، در Next.js با فایل <Inline>app/fonts.ts</Inline> و کلاس آن روی html، و در بقیه‌ی پروژه‌ها با import از
    Google Fonts داخل CSS
  </>,
  <>
    توکن‌های تم گرافیت و نگاشت Tailwind در <Inline>globals.css</Inline>
  </>,
  <>
    <Inline>lib/utils.ts</Inline> و <Inline>lib/jalali.ts</Inline> از رجیستری
  </>,
  <>
    قوانین مدل: یک بلوک فشرده‌ی فارسی و کرافت داخل <Inline>AGENTS.md</Inline>، خط <Inline>@AGENTS.md</Inline> در{" "}
    <Inline>CLAUDE.md</Inline>، دو راهنمای کامل در <Inline>docs/</Inline> و اگر پوشه‌ی <Inline>.cursor</Inline> باشه یک rule
    برای Cursor. دوباره که init بزنید همان بلوک جایگزین میشه و بقیه‌ی فایل دست نمی‌خوره
  </>,
  <>
    <Inline>vibefarsi.json</Inline> و مسیر <Inline>@/*</Inline> در tsconfig
  </>,
];

const ADD_TARGETS: [string, string][] = [
  ["کامپوننت", "components/ui/"],
  ["بلاک", "components/blocks/"],
  ["نمودار", "components/charts/"],
  ["تقویم", "components/calendar/"],
  ["انیمیشن", "components/animations/"],
  ["پس‌زمینه", "components/backgrounds/"],
  ["قالب", "components/templates/"],
  ["تم", "globals.css"],
  ["مهارت", ".claude/skills/"],
];

const FLAGS: [string, React.ReactNode][] = [
  [
    "--font iransans",
    <>
      اگر <Inline>IRANSans-Reg.woff</Inline> در <Inline>/fonts</Inline> یا <Inline>/public</Inline> باشه، همان را
      به‌جای Vazirmatn وصل می‌کنه
    </>,
  ],
  [
    "--theme saffron",
    <>
      تم دیگری به‌جای گرافیت. بعداً هم می‌تونید با <Inline>npx vibefarsi add saffron</Inline> عوضش کنید
    </>,
  ],
  ["--registry http://localhost:3000/r", "رجیستری روی همین ماشین، برای وقتی روی خود مخزن کار می‌کنید"],
  ["--dry-run", "فقط نشان میده چه فایل‌هایی نوشته میشن و چیزی را تغییر نمیده"],
  ["--overwrite", "فایل‌های موجود را جایگزین می‌کنه"],
  ["--no-install", "پکیج‌های npm را نصب نمی‌کنه"],
];

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-secondary px-1 py-0.5 text-[12px]" dir="ltr">
      {children}
    </code>
  );
}

function Pill({ tone, children }: { tone: "auto" | "manual"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        tone === "auto"
          ? "border-brand/30 bg-brand/10 text-brand"
          : "border-border bg-secondary text-foreground/80",
      )}
    >
      {tone === "auto" ? <Terminal className="size-3" /> : <FileCode2 className="size-3" />}
      {children}
    </span>
  );
}

function Cmd({ cmd, className }: { cmd: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs",
        className,
      )}
      dir="ltr"
    >
      <span className="text-muted-foreground">$</span>
      <code className="bg-transparent">{cmd}</code>
      <CopyButton text={cmd} className="ms-auto" />
    </div>
  );
}

function Code({ name, code, lang }: { name: string; code: string; lang?: Lang }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div dir="ltr" className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs text-muted-foreground" dir="ltr">
          {name}
        </span>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} lang={lang} className="max-h-[420px] overflow-auto" />
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  children,
}: {
  n: number;
  title: string;
  desc?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative ps-10 before:absolute before:start-[13px] before:top-8 before:h-[calc(100%-1.25rem)] before:w-px before:bg-border last:before:hidden">
      <span className="absolute start-0 top-0.5 flex size-7 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold">
        {fa(n)}
      </span>
      <h3 className="text-base font-semibold leading-7">{title}</h3>
      {desc && <p className="mt-1 text-sm leading-7 text-muted-foreground">{desc}</p>}
      {children && <div className="mt-3 space-y-3">{children}</div>}
    </li>
  );
}

function Note({ kind = "نکته", children }: { kind?: "نکته" | "هشدار"; children: React.ReactNode }) {
  return (
    <p className="flex gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
      <span className={cn("shrink-0 font-semibold", kind === "هشدار" ? "text-warning" : "text-foreground/80")}>
        {kind}
      </span>
      <span>{children}</span>
    </p>
  );
}

function PathCard({
  href,
  tone,
  title,
  desc,
  meta,
  recommended,
}: {
  href: string;
  tone: "auto" | "manual";
  title: string;
  desc: string;
  meta: string;
  recommended?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/25",
        tone === "auto" ? "border-brand/25" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Pill tone={tone}>{tone === "auto" ? "خودکار" : "دستی"}</Pill>
        {recommended && <span className="text-[11px] text-muted-foreground">پیشنهادی</span>}
      </div>
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">{desc}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>{meta}</span>
        <span className="flex items-center gap-1 transition-colors group-hover:text-foreground">
          راهنما
          <ArrowLeft className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

function PathHeader({
  tone,
  title,
  lead,
}: {
  tone: "auto" | "manual";
  title: string;
  lead: React.ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-border pb-5">
      <Pill tone={tone}>{tone === "auto" ? "راه اول · خودکار" : "راه دوم · دستی"}</Pill>
      <h2 className="mt-3 text-xl font-bold sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{lead}</p>
    </div>
  );
}

export default function DocsPage() {
  const utils = readSource("lib/utils.ts");
  const theme = readSource("registry/themes/graphite.css");

  return (
    <article className="space-y-16">
      <JsonLd data={docsHowToJsonLd()} />
      <JsonLd data={faqJsonLd()} />
      <header>
        <p className="text-xs text-muted-foreground">مستندات</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">شروع سریع</h1>
        <p className="mt-3 max-w-2xl leading-8 text-muted-foreground">
          وایب‌فارسی پکیج npm نیست. هر کامپوننت به شکل یک فایل داخل پروژه‌تون نوشته میشه و از همان لحظه مال شماست،
          پس هر طور خواستید تغییرش بدید. برای شروع دو راه دارید: خودکار با CLI، یا دستی با کپی کردن همان فایل‌ها. خروجی هر دو یکیه.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={`/${s.key}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
          >
            <span>
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className="block text-xs text-muted-foreground">{s.desc}</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              {fa(s.count)}
              <ArrowLeft className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <section id="install" className="scroll-mt-24">
        <h2 className="text-lg font-bold">نصب و راه‌اندازی</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          در پروژه‌ی Next.js یا Vite با Tailwind v4، دو دستور CLI فونت، جهت صفحه و توکن‌های تم را برای‌تون می‌نویسه. اگر CLI
          نمی‌خواید یا ساختار پروژه‌تون فرق داره، راه دستی همان فایل‌ها را نشان میده تا خودتون بگذارید.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <PathCard
            href="#cli"
            tone="auto"
            title="با CLI"
            desc="دو دستور. init پروژه را راست‌چین و فارسی می‌کنه و add کامپوننت‌ها را با وابستگی‌هاشون می‌آوره."
            meta="Next.js یا Vite · Tailwind v4"
            recommended
          />
          <PathCard
            href="#manual"
            tone="manual"
            title="کپی فایل‌ها"
            desc="چند فایل پایه را خودتون می‌نویسید و کد هر کامپوننت را از تب «کد» صفحه‌اش کپی می‌کنید. بدون هیچ ابزار اضافه."
            meta="هر پروژه‌ی React · Tailwind v4"
          />
        </div>
      </section>

      <section id="cli" className="scroll-mt-24">
        <PathHeader
          tone="auto"
          title="نصب خودکار با CLI"
          lead="داخل پروژه‌ی React با Tailwind v4 اجرا کنید. CLI فایل‌ها را می‌نویسه و پکیج‌های لازم را با همان مدیر پکیج پروژه نصب می‌کنه، یعنی npm، pnpm، yarn یا bun."
        />
        <ol className="space-y-10">
          <Step n={1} title="پروژه را آماده کنید" desc="یک‌بار در ریشه‌ی پروژه اجرا کنید.">
            <Cmd cmd={CLI_INIT} />
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">فایل‌هایی که نوشته میشن</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-7">
                {INIT_WRITES.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-2 size-3.5 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Note>
              اگر پروژه پوشه‌ی <Inline>src</Inline> داره، همه‌ی این فایل‌ها داخل src نوشته میشن.{" "}
              به <Inline>globals.css</Inline> و <Inline>layout.tsx</Inline> فقط چند خط اضافه میشه و از نو نوشته نمیشن.
              فایل‌های lib هم اگر از قبل باشن دست نمی‌خورن، مگر با <Inline>--overwrite</Inline>.
            </Note>
          </Step>

          <Step
            n={2}
            title="کامپوننت‌ها را اضافه کنید"
            desc={
              <>
                هر کامپوننت با وابستگی‌هاش می‌آد. مثلاً calendar فایل <Inline>lib/jalali.ts</Inline> را هم می‌آوره و
                پکیج‌های npm لازم نصب میشن. بعد از نوشتن، فایل مال خودتونه و می‌تونید هر طور خواستید تغییرش بدید.
              </>
            }
          >
            <Cmd cmd={CLI_ADD} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">مقصد فایل‌ها</p>
                <ul className="mt-2 space-y-1 text-sm leading-7">
                  {ADD_TARGETS.map(([kind, dir]) => (
                    <li key={kind} className="flex items-center justify-between gap-3">
                      <span>{kind}</span>
                      <Inline>{dir}</Inline>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">اسم کامپوننت‌ها</p>
                <p className="mt-2 text-sm leading-7">
                  slug هر کامپوننت کنار عنوان صفحه‌اش نوشته شده. فهرست کامل را با این دستور ببینید:
                </p>
                <Cmd cmd={CLI_LIST} className="mt-2 bg-background" />
              </div>
            </div>
          </Step>

          <Step n={3} title="گزینه‌ها (اختیاری)" desc="هر دو دستور این گزینه‌ها را قبول می‌کنن.">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-start font-medium">گزینه</th>
                    <th className="px-3 py-2 text-start font-medium">کار</th>
                  </tr>
                </thead>
                <tbody>
                  {FLAGS.map(([flag, desc]) => (
                    <tr key={flag} className="border-t border-border align-top">
                      <td className="whitespace-nowrap px-3 py-2 text-xs" dir="ltr">
                        <code className="bg-transparent">{flag}</code>
                      </td>
                      <td className="px-3 py-2 leading-7 text-foreground/85">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Step>
        </ol>
      </section>

      <section id="manual" className="scroll-mt-24">
        <PathHeader
          tone="manual"
          title="نصب دستی"
          lead={
            <>
              همان چیزی که init می‌نویسه، این‌جا فایل‌به‌فایل آمده. هر بلوک را کپی کنید و در مسیر گفته‌شده بگذارید.
              پیش‌نیازش React با Tailwind v4 هست.
            </>
          }
        />
        <ol className="space-y-10">
          <Step
            n={1}
            title="جهت و فونت"
            desc={
              <>
                روی html، <Inline>dir=&quot;rtl&quot;</Inline> و <Inline>lang=&quot;fa&quot;</Inline> بگذارید و فونت را
                با یک متغیر CSS وصل کنید. این نمونه‌ی Next.js با Vazirmatn از Google Fonts هست:
              </>
            }
          >
            <Code name="app/layout.tsx" code={LAYOUT} />
            <Note>
              برای IRANSans، فایل‌های woff را در <Inline>/fonts</Inline> بگذارید و با{" "}
              <Inline>next/font/local</Inline> همان متغیر را بسازید. در Vite به‌جای next/font، این خط را بالای
              CSS بگذارید:
            </Note>
            <Code name="globals.css (فقط Vite)" code={GOOGLE_FONT} lang="css" />
          </Step>

          <Step
            n={2}
            title="توکن‌های تم"
            desc={
              <>
                کامپوننت‌ها رنگشون را فقط از این متغیرها می‌گیرن. این بلوک را در <Inline>globals.css</Inline> بگذارید.
              </>
            }
          >
            <Code name="app/globals.css (تم گرافیت)" code={theme} lang="css" />
            <Note>
              تم‌های دیگر (فیروزه، زعفران، انار، لاجورد، کاغذ) در{" "}
              <Link href="/themes" className="underline underline-offset-4 hover:text-foreground">
                سیستم‌های طراحی
              </Link>{" "}
              هستن. همان ساختار را دارن و جای همین بلوک می‌نشینن.
            </Note>
          </Step>

          <Step
            n={3}
            title="نگاشت Tailwind"
            desc={
              <>
                این بلوک متغیرهای بالا را به کلاس‌های Tailwind مثل <Inline>bg-background</Inline> و{" "}
                <Inline>text-muted-foreground</Inline> وصل می‌کنه. زیر بلوک تم بگذارید. اگر اسم متغیر فونت‌تون فرق
                داره، خط <Inline>--font-sans</Inline> را با همان عوض کنید.
              </>
            }
          >
            <Code name="app/globals.css (نگاشت Tailwind)" code={TAILWIND_MAP} lang="css" />
          </Step>

          <Step
            n={4}
            title="ابزارهای کمکی"
            desc={
              <>
                <Inline>cn</Inline> برای کلاس‌ها، <Inline>fa</Inline> و <Inline>faNumber</Inline> برای اعداد فارسی و{" "}
                <Inline>formatToman</Inline> برای قیمت. در <Inline>lib/utils.ts</Inline> بگذارید.
              </>
            }
          >
            <Code name="lib/utils.ts" code={utils} />
            <Note>
              تقویم و انتخاب تاریخ به <Inline>lib/jalali.ts</Inline> هم نیاز دارن. آن را از{" "}
              <a
                href="/r/lib/jalali.json"
                className="underline underline-offset-4 hover:text-foreground"
                dir="ltr"
              >
                /r/lib/jalali.json
              </a>{" "}
              بردارید.
            </Note>
          </Step>

          <Step
            n={5}
            title="کامپوننت‌ها"
            desc={
              <>
                در صفحه‌ی هر کامپوننت، تب «کد» را کپی کنید و در <Inline>components/ui/&lt;slug&gt;.tsx</Inline> بگذارید.
                پکیج‌های npm لازم و پیش‌نیازها در بخش «نصب» همان صفحه آمده. همه‌ی کامپوننت‌ها به{" "}
                <Inline>lucide-react</Inline> نیاز دارن.
              </>
            }
          >
            <Cmd cmd="npm i lucide-react" />
            <Link
              href="/components"
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-foreground/25"
            >
              <span>
                <span className="block font-semibold">کامپوننت‌ها</span>
                <span className="block text-xs text-muted-foreground">از دکمه و ورودی شروع کنید</span>
              </span>
              <ArrowLeft className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </Link>
          </Step>
        </ol>
      </section>

      <DocSection id="prompts" title="کار با هوش مصنوعی">
        <Notes
          notes={[
            "هر صفحه یک تب «پرامپت» داره که همان کامپوننت را به انگلیسی توضیح میده، با قوانین راست‌چین، فونت، اعداد و توکن‌ها. آن را در Cursor، Claude Code یا Codex پیست کنید تا مدل همان کامپوننت را با سبک پروژه‌تون بسازه.",
            "اگر خروجی چپ‌چین شد یا اعداد لاتین ماند، همان پرامپت را یک‌بار دیگر بفرستید و بگید re-check the Persian RTL rules. قوانین داخل همان پرامپت هست.",
            "نسخه‌ی ماشین‌خوان هر مورد در /r/<بخش>/<slug>.json هست و CLI هم همان را می‌خونه.",
          ]}
        />
      </DocSection>

      <DocSection id="mcp" title="سرور MCP">
        <p className="mb-3 text-sm leading-7 text-muted-foreground">
          ابزارهای هوش مصنوعی به انگلیسی فکر می‌کنن. این پنج ابزار قوانین فارسی و کد رجیستری را به Cursor، Claude Code و Codex میدن تا به‌جای Inter و چیدمان چپ‌چین، کامپوننت وایب‌فارسی بسازن. آدرس سرور <Inline>https://vibefarsi.ir/mcp</Inline> هست و Node روی سیستم لازم نیست.
        </p>
        <Code name="mcp.json" code={MCP} lang="json" />
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
          <li>
            Cursor: همین JSON را در <Inline>.cursor/mcp.json</Inline> پروژه، یا <Inline>~/.cursor/mcp.json</Inline> بگذارید.{" "}
            <a
              href="https://cursor.com/en/install-mcp?name=vibefarsi&config=eyJ1cmwiOiJodHRwczovL3ZpYmVmYXJzaS5pci9tY3AifQ=="
              className="underline underline-offset-4 hover:text-foreground"
            >
              افزودن به Cursor
            </a>
          </li>
          <li>
            Claude Code: <Inline>claude mcp add --transport http vibefarsi https://vibefarsi.ir/mcp</Inline>
          </li>
          <li>
            Codex: <Inline>codex mcp add vibefarsi --url https://vibefarsi.ir/mcp</Inline>
          </li>
        </ul>
        <ul className="mt-4 space-y-2 text-sm leading-7">
          <li><Inline>get_design_rules</Inline> قوانین راست‌چین، فونت، اعداد، فرم و توکن‌ها. این را قبل از ساخت هر صفحه صدا بزنید.</li>
          <li><Inline>search_registry</Inline> جست‌وجو بین کامپوننت، بلاک، انیمیشن، پس‌زمینه، قالب و تم، به فارسی یا انگلیسی.</li>
          <li><Inline>get_component</Inline> کد، پرامپت و مسیر نصب یک یا چند کامپوننت، همراه وابستگی‌هایی مثل jalali.</li>
          <li><Inline>get_theme</Inline> توکن‌های CSS تم (پیش‌فرض گرافیت). مدل نباید از خودش رنگ بگذاره.</li>
          <li><Inline>scaffold_page</Inline> از توضیح صفحه (پرداخت، ورود پیامکی، نوبت شمسی) یک ترکیب آماده می‌سازه.</li>
        </ul>
        <p className="mt-4 mb-2 text-sm leading-7 text-muted-foreground">
          اگر بخواید سرور روی سیستم خودتون اجرا بشه، به‌جای URL از npx استفاده کنید:
        </p>
        <Code name="mcp.json (npx)" code={MCP_NPX} lang="json" />
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          برای کار روی همین مخزن، به‌جای npx از <Inline>npm run mcp</Inline> استفاده کنید. فهرست ماشین‌خوان کامپوننت‌ها هم در <Inline>/r/&lt;بخش&gt;/&lt;slug&gt;.json</Inline> هست، ولی این مسیر رجیستری CLI هست، نه MCP.
        </p>
      </DocSection>

      <DocSection id="faq" title="پرسش‌های متداول">
        <dl className="space-y-6">
          {PRODUCT_FAQ.map((item) => (
            <div key={item.id}>
              <dt>
                <h3 className="text-base font-bold">{item.q}</h3>
              </dt>
              <dd className="mt-2 text-sm leading-7 text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </DocSection>
    </article>
  );
}
