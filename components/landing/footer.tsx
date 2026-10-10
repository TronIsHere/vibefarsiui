import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { GithubIcon } from "@/components/shared/icons";
import { GITHUB_URL } from "@/lib/site";
import { hostingSponsor } from "@/lib/sponsors";
import { Section } from "./frame";
import { SponsorMark } from "./sponsor-card";

export function MonoFooter() {
  return (
    <>
      <Section>
        <div className="flex flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-8 sm:py-16">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">رایگان. برای فارسی‌زبان‌ها.</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-[15px]">
              پلن پولی نداریم و هیچ کامپوننتی قفل نیست. می‌خوایم ساختن یک رابط فارسی خوب، کار ساده‌ای باشه.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/docs" className="inline-flex h-10 cursor-pointer items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              شروع کنید
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <GithubIcon />
              گیت‌هاب
            </a>
          </div>
        </div>
      </Section>
      <footer className="border-b border-border">
        <div className="flex flex-col gap-4 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="پاورقی">
            {[["مستندات", "/docs"], ["درباره", "/about"], ["پرسش‌ها", "/#faq"], ["کامپوننت‌ها", "/components"], ["بلاک‌ها", "/blocks"], ["نمودارها", "/charts"], ["تقویم", "/calendar"], ["انیمیشن‌ها", "/animations"], ["پس‌زمینه‌ها", "/backgrounds"], ["قالب‌ها", "/templates"], ["سیستم‌های طراحی", "/themes"], ["MCP", "/docs#mcp"], ["حامیان", "/#sponsors"]].map(([l, h]) => (
              <Link key={l} href={h} className="cursor-pointer transition-colors hover:text-foreground">
                {l}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span>© ۱۴۰۵ وایب‌فارسی</span>
            {hostingSponsor ? (
              <a
                href={hostingSponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-90"
              >
                <span>میزبانی</span>
                <SponsorMark sponsor={hostingSponsor} />
              </a>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  );
}
