import { fa } from "@/lib/utils";
import { toJalali } from "@/lib/jalali";

export interface FooterMinimalProps {
  logo: React.ReactNode;
  links: { label: string; href: string }[];
  /** Social icons or trust seals at the far end; rendered as-is. */
  end?: React.ReactNode;
  copyright?: string;
}

/** پابرگ ساده. One row: logo, a few links and a slot; the Jalali year fills itself in. */
export function FooterMinimal({ logo, links, end, copyright }: FooterMinimalProps) {
  const year = fa(toJalali(new Date()).jy);
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <div className="text-base font-bold">{logo}</div>
          <p className="text-xs text-muted-foreground">{copyright ?? `© ${year} تمام حقوق محفوظ است.`}</p>
        </div>
        <nav aria-label="پابرگ">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((l) => <li key={l.label}><a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</a></li>)}
          </ul>
        </nav>
        {end && <div className="flex items-center gap-2">{end}</div>}
      </div>
    </footer>
  );
}
