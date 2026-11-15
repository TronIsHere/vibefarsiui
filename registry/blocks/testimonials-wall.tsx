import { Avatar } from "@/registry/ui/avatar";

export interface WallTestimonial {
  name: string;
  role?: string;
  quote: string;
  /** Where it was posted, e.g. «توییتر» or «نظر در بازار». */
  source?: string;
}

export interface TestimonialsWallProps {
  title?: string;
  description?: string;
  items: WallTestimonial[];
  /** Fades the bottom so a long wall reads as "there is more". */
  fade?: boolean;
}

/** دیوار نظرات. A masonry wall of quotes with uneven heights, built with CSS columns. */
export function TestimonialsWall({ title = "از زبان کاربرها", description, items, fade = true }: TestimonialsWallProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>}
        </div>
        <div className={fade ? "relative max-h-[40rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" : undefined}>
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((t, i) => (
              <li key={t.name + i} className="mb-4 break-inside-avoid">
                <figure className="rounded-2xl border border-border bg-card p-5">
                  <figcaption className="flex items-center gap-3">
                    <Avatar name={t.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      {t.role && <p className="truncate text-xs text-muted-foreground">{t.role}</p>}
                    </div>
                    {t.source && <span className="shrink-0 text-[11px] text-muted-foreground">{t.source}</span>}
                  </figcaption>
                  <blockquote className="mt-4 text-sm leading-7 text-foreground/90">«{t.quote}»</blockquote>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
