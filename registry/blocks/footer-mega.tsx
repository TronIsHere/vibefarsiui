"use client";

import * as React from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { fa } from "@/lib/utils";
import { toJalali } from "@/lib/jalali";

export interface FooterMegaProps {
  logo: React.ReactNode;
  description?: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  contact?: { address?: string; phone?: string; hours?: string };
  /** Newsletter heading; the form is hidden when it is missing. */
  newsletter?: { title: string; description?: string; placeholder?: string };
  onSubscribe?: (email: string) => void;
  /** Trust seals (e-namad, Samandehi). */
  seals?: React.ReactNode;
  /** Social icons. */
  social?: React.ReactNode;
  /** App store buttons. */
  apps?: React.ReactNode;
  /** Legal links on the bottom line. */
  legal?: { label: string; href: string }[];
  copyright?: string;
}

/** پابرگ کامل. For shops: newsletter on top, link columns, contact details, seals, apps and legal line. */
export function FooterMega({ logo, description, columns, contact, newsletter, onSubscribe, seals, social, apps, legal, copyright }: FooterMegaProps) {
  const year = fa(toJalali(new Date()).jy);
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const id = React.useId();

  return (
    <footer className="border-t border-border bg-card">
      {newsletter && (
        <div className="border-b border-border px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-bold">{newsletter.title}</h2>
              {newsletter.description && <p className="mt-1 text-sm text-muted-foreground">{newsletter.description}</p>}
            </div>
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(e) => { e.preventDefault(); if (!email) return; onSubscribe?.(email); setSent(true); }}
            >
              <label htmlFor={id} className="sr-only">ایمیل</label>
              <input
                id={id}
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSent(false); }}
                placeholder={newsletter.placeholder ?? "you@example.com"}
                className="h-10 min-w-0 flex-1 rounded-field border-line-field border-input bg-field px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/60"
              />
              <Button type="submit">عضویت</Button>
            </form>
            <p role="status" className="sr-only">{sent ? "ایمیل شما ثبت شد." : ""}</p>
          </div>
        </div>
      )}

      <div className="px-6 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="text-base font-bold">{logo}</div>
            {description && <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">{description}</p>}
            {contact && (
              <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                {contact.phone && <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /><a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} dir="ltr" className="hover:text-foreground">{fa(contact.phone)}</a></li>}
                {contact.hours && <li className="flex items-center gap-2"><Clock className="size-4 shrink-0" />{contact.hours}</li>}
                {contact.address && <li className="flex items-start gap-2"><MapPin className="mt-1 size-4 shrink-0" /><span className="leading-7">{contact.address}</span></li>}
              </ul>
            )}
            {social && <div className="mt-5">{social}</div>}
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="text-sm font-semibold">{c.title}</h3>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => <li key={l.label}><a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</a></li>)}
              </ul>
            </nav>
          ))}
          {(seals || apps) && (
            <div className="col-span-2 flex flex-col gap-5 md:col-span-4 lg:col-span-1">
              {seals && <div><h3 className="mb-3 text-sm font-semibold">مجوزها</h3>{seals}</div>}
              {apps && <div><h3 className="mb-3 text-sm font-semibold">اپلیکیشن</h3><div className="flex flex-col gap-2">{apps}</div></div>}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright ?? `© ${year} تمام حقوق این سایت محفوظ است.`}</p>
          {legal && (
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {legal.map((l) => <li key={l.label}><a href={l.href} className="hover:text-foreground">{l.label}</a></li>)}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
