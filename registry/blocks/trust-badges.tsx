import { BadgeCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustSeal {
  /** e.g. «نماد اعتماد الکترونیکی». */
  name: string;
  /** The issuer's verification page for your domain. */
  href?: string;
  /**
   * The seal image the issuer gives you (an <img> with their referrerpolicy and id).
   * Without it a neutral placeholder is drawn, which is fine in design but not in production.
   */
  image?: React.ReactNode;
  /** Short line under the name, e.g. «مجوز کسب‌وکار اینترنتی». */
  caption?: string;
}

export interface TrustBadgesProps {
  title?: string;
  description?: string;
  seals: TrustSeal[];
  /** "row" is a compact strip for footers and checkout; "cards" is a full section. */
  variant?: "row" | "cards";
  className?: string;
}

function Seal({ seal, size }: { seal: TrustSeal; size: "sm" | "lg" }) {
  const box = size === "sm" ? "size-16" : "size-20";
  return seal.image ? (
    <span className={cn("flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 [&_img]:size-full [&_img]:object-contain", box)}>{seal.image}</span>
  ) : (
    <span className={cn("flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground", box)}>
      <ShieldCheck className="size-5" />
      <span className="text-[10px] leading-none">نشان</span>
    </span>
  );
}

/** نشان‌های اعتماد. Slots for e-namad, Samandehi and guild seals; the official images go in as-is. */
export function TrustBadges({ title, description, seals, variant = "row", className }: TrustBadgesProps) {
  if (variant === "row") {
    return (
      <ul className={cn("flex flex-wrap items-center gap-3", className)}>
        {seals.map((s) => (
          <li key={s.name}>
            <a href={s.href ?? "#"} target={s.href ? "_blank" : undefined} rel="noopener noreferrer" aria-label={s.name} title={s.name} className="block transition-opacity hover:opacity-80">
              <Seal seal={s} size="sm" />
            </a>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <section className={cn("px-6 py-16", className)}>
      <div className="mx-auto max-w-4xl">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            {description && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>}
          </div>
        )}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {seals.map((s) => (
            <li key={s.name}>
              <a href={s.href ?? "#"} target={s.href ? "_blank" : undefined} rel="noopener noreferrer" className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent">
                <Seal seal={s} size="lg" />
                <span className="flex min-w-0 flex-col">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">{s.name}<BadgeCheck className="size-4 shrink-0 text-success" /></span>
                  {s.caption && <span className="mt-1 text-xs leading-6 text-muted-foreground">{s.caption}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
