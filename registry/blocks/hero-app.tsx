import { Download } from "lucide-react";
import { Rating } from "@/registry/ui/rating";
import { cn, fa } from "@/lib/utils";

export interface StoreLink {
  /** Store name shown large, e.g. «کافه‌بازار». */
  store: string;
  /** Small line above it, e.g. «دریافت از». */
  caption?: string;
  href: string;
  /** Your own store logo. A download glyph is used when it is missing. */
  icon?: React.ReactNode;
}

export interface HeroAppProps {
  title: React.ReactNode;
  description: string;
  stores: StoreLink[];
  /** Average store rating and the number of installs, both optional. */
  rating?: { value: number; count: string };
  /** Screen content of the phone. Falls back to a token-drawn feed. */
  screen?: React.ReactNode;
}

function ScreenMock() {
  return (
    <div aria-hidden className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-foreground/20" />
        <div className="size-7 rounded-full bg-secondary" />
      </div>
      <div className="rounded-2xl bg-brand/15 p-4">
        <div className="h-2.5 w-16 rounded bg-brand/40" />
        <div className="mt-3 h-6 w-28 rounded bg-brand/60" />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
          <div className="size-9 rounded-lg bg-secondary" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-2/3 rounded bg-foreground/15" />
            <div className="h-2 w-1/3 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** هیروی اپلیکیشن. Store buttons for Iranian app stores beside a phone frame. */
export function HeroApp({ title, description, stores, rating, screen }: HeroAppProps) {
  return (
    <section className="overflow-hidden px-6 pt-16 sm:pt-24">
      <div className="mx-auto grid max-w-5xl items-end gap-10 md:grid-cols-[1fr_auto]">
        <div className="pb-16 sm:pb-24">
          <h1 className="text-4xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.2]">{title}</h1>
          <p className="mt-5 max-w-md leading-8 text-muted-foreground sm:text-lg sm:leading-9">{description}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {stores.map((s, i) => (
              <li key={s.store}>
                <a
                  href={s.href}
                  className={cn(
                    "flex h-14 min-w-40 items-center gap-3 rounded-xl border px-4 transition-colors",
                    i === 0 ? "border-foreground bg-foreground text-background hover:bg-foreground/90" : "border-border bg-card hover:bg-accent",
                  )}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center [&_svg]:size-5">{s.icon ?? <Download />}</span>
                  <span className="flex flex-col">
                    <span className="text-[11px] leading-4 opacity-70">{s.caption ?? "دریافت از"}</span>
                    <span className="text-sm font-bold leading-5">{s.store}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {rating && (
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Rating value={rating.value} readOnly size="sm" />
              <span className="font-medium text-foreground">{fa(rating.value)}</span>
              <span>از {rating.count} نصب فعال</span>
            </div>
          )}
        </div>
        <div className="mx-auto w-64 shrink-0 md:w-72">
          <div className="relative h-[26rem] overflow-hidden rounded-t-[2.5rem] border-x-8 border-t-8 border-foreground/85 bg-card">
            <span aria-hidden className="absolute inset-x-0 top-2 z-10 mx-auto h-5 w-20 rounded-full bg-foreground/85" />
            <div className="h-full pt-8">{screen ?? <ScreenMock />}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
