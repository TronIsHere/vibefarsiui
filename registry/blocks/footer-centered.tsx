import { fa } from "@/lib/utils";
import { toJalali } from "@/lib/jalali";

export interface FooterCenteredProps {
  logo: React.ReactNode;
  tagline?: string;
  links: { label: string; href: string }[];
  /** Social icons under the links. */
  social?: React.ReactNode;
  copyright?: string;
}

/** پابرگ وسط‌چین. Logo, one line of links and social icons, stacked in the middle. */
export function FooterCentered({ logo, tagline, links, social, copyright }: FooterCenteredProps) {
  const year = fa(toJalali(new Date()).jy);
  return (
    <footer className="border-t border-border px-6 py-12 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <div className="text-lg font-bold">{logo}</div>
        {tagline && <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">{tagline}</p>}
        <nav aria-label="پابرگ" className="mt-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {links.map((l) => <li key={l.label}><a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</a></li>)}
          </ul>
        </nav>
        {social && <div className="mt-6">{social}</div>}
        <p className="mt-8 w-full border-t border-border pt-6 text-xs text-muted-foreground">{copyright ?? `© ${year} تمام حقوق محفوظ است.`}</p>
      </div>
    </footer>
  );
}
