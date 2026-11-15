import { Avatar } from "@/registry/ui/avatar";
import { Marquee } from "@/registry/animations/marquee";

export interface MarqueeTestimonial { name: string; role?: string; quote: string }

export interface TestimonialsMarqueeProps {
  title?: string;
  description?: string;
  items: MarqueeTestimonial[];
  /** Seconds for one full loop of the first row; the second row runs a little slower. */
  duration?: number;
}

function QuoteCard({ t }: { t: MarqueeTestimonial }) {
  return (
    <figure className="flex w-80 shrink-0 flex-col rounded-2xl border border-border bg-card p-5">
      <blockquote className="flex-1 text-sm leading-7 text-foreground/90">«{t.quote}»</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <Avatar name={t.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{t.name}</p>
          {t.role && <p className="truncate text-xs text-muted-foreground">{t.role}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

/** نوار نظرات. Two rows of quote cards drifting at different speeds; stops under reduced motion. */
export function TestimonialsMarquee({ title = "حرف مشتری‌ها", description, items, duration = 50 }: TestimonialsMarqueeProps) {
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)].filter((r) => r.length > 0);
  return (
    <section className="py-16">
      <div className="mb-10 px-6 text-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4 motion-reduce:[&_*]:[animation-play-state:paused] hover:[&_*]:[animation-play-state:paused]">
        {rows.map((row, i) => (
          <Marquee key={i} duration={duration * (i === 0 ? 1 : 1.3)} gap="1rem">
            {row.map((t) => <QuoteCard key={t.name} t={t} />)}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
