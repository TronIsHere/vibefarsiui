import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";

export interface HeroSplitProps {
  badge?: string;
  title: React.ReactNode;
  description: string;
  /** Short proof points under the description. */
  bullets?: string[];
  primary?: { label: string; href?: string };
  secondary?: { label: string; href?: string };
  /** Screenshot, video or illustration. Falls back to a token-drawn app window. */
  visual?: React.ReactNode;
}

/** A neutral app window drawn with theme tokens, so the block looks finished before you have a screenshot. */
function WindowMock() {
  const bars = [38, 56, 44, 72, 60, 86, 68];
  return (
    <div aria-hidden className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_100px_-40px_oklch(0_0_0/60%)]">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="ms-3 h-5 flex-1 rounded-md bg-secondary" />
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border p-3">
            <div className="h-2.5 w-12 rounded bg-secondary" />
            <div className="mt-3 h-5 w-16 rounded bg-foreground/20" />
          </div>
        ))}
        <div className="col-span-3 flex h-36 items-end gap-2 rounded-xl border border-border p-4">
          {bars.map((h, i) => (
            <span key={i} className={i === 5 ? "flex-1 rounded-t-md bg-brand" : "flex-1 rounded-t-md bg-foreground/15"} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** هیروی دوستونه. Copy on the right, product visual on the left; stacks on mobile with the copy first. */
export function HeroSplit({ badge, title, description, bullets, primary = { label: "شروع رایگان" }, secondary, visual }: HeroSplitProps) {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          {badge && <Badge variant="brand">{badge}</Badge>}
          <h1 className="mt-4 text-4xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.2]">{title}</h1>
          <p className="mt-5 max-w-lg leading-8 text-muted-foreground sm:text-lg sm:leading-9">{description}</p>
          {bullets && (
            <ul className="mt-6 space-y-2.5 text-sm">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"><Check className="size-3" /></span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Button size="lg">{primary.label}<ArrowLeft /></Button>
            {secondary && <Button size="lg" variant="outline">{secondary.label}</Button>}
          </div>
        </div>
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute -inset-8 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(50% 50% at 50% 50%, oklch(from var(--brand) l c h / 22%), transparent 70%)" }} />
          <div className="relative">{visual ?? <WindowMock />}</div>
        </div>
      </div>
    </section>
  );
}
