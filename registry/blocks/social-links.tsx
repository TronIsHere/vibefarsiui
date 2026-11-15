import { AtSign, Camera, Globe, Mail, MessageCircle, MessagesSquare, Phone, Send, Tv, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Networks Iranian businesses actually list. Brand logos are trademarks, so each one gets a neutral glyph; pass `icon` for your own. */
export type SocialNetwork = "telegram" | "eitaa" | "bale" | "rubika" | "instagram" | "whatsapp" | "aparat" | "linkedin" | "email" | "phone" | "website";

const NETWORKS: Record<SocialNetwork, { label: string; icon: LucideIcon }> = {
  telegram: { label: "تلگرام", icon: Send },
  eitaa: { label: "ایتا", icon: MessagesSquare },
  bale: { label: "بله", icon: MessageCircle },
  rubika: { label: "روبیکا", icon: AtSign },
  instagram: { label: "اینستاگرام", icon: Camera },
  whatsapp: { label: "واتس‌اپ", icon: Phone },
  aparat: { label: "آپارات", icon: Tv },
  linkedin: { label: "لینکدین", icon: Users },
  email: { label: "ایمیل", icon: Mail },
  phone: { label: "تلفن", icon: Phone },
  website: { label: "وب‌سایت", icon: Globe },
};

export interface SocialLink {
  network: SocialNetwork;
  href: string;
  /** The handle or number shown in the "list" and "cards" variants, e.g. «@dokan». */
  handle?: string;
  /** Replaces the default name. */
  label?: string;
  icon?: React.ReactNode;
}

export interface SocialLinksProps {
  links: SocialLink[];
  /** "icons" for footers, "list" for contact pages, "cards" for a link-in-bio page. */
  variant?: "icons" | "list" | "cards";
  className?: string;
}

/** شبکه‌های اجتماعی. Telegram, Eitaa, Bale and Rubika beside Instagram; handles stay left-to-right. */
export function SocialLinks({ links, variant = "icons", className }: SocialLinksProps) {
  if (variant === "icons") {
    return (
      <ul className={cn("flex flex-wrap items-center gap-2", className)}>
        {links.map((l) => {
          const n = NETWORKS[l.network];
          return (
            <li key={l.network + l.href}>
              <a href={l.href} aria-label={l.label ?? n.label} title={l.label ?? n.label} className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4">
                {l.icon ?? <n.icon />}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <ul className={cn(variant === "cards" ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : "flex flex-col divide-y divide-border", className)}>
      {links.map((l) => {
        const n = NETWORKS[l.network];
        return (
          <li key={l.network + l.href}>
            <a href={l.href} className={cn("flex items-center gap-3 transition-colors", variant === "cards" ? "rounded-2xl border border-border bg-card p-4 hover:bg-accent" : "py-3 hover:text-foreground")}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary [&_svg]:size-4">{l.icon ?? <n.icon />}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium">{l.label ?? n.label}</span>
                {l.handle && <bdi dir="ltr" className="truncate text-end text-xs text-muted-foreground">{l.handle}</bdi>}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
