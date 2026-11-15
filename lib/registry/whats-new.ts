import { animations } from "./animations";
import { backgrounds } from "./backgrounds";
import { blocks } from "./blocks";
import { calendar } from "./calendar";
import { charts } from "./charts";
import { components } from "./components";
import { templates } from "./templates";

/** The release the landing announces. Bump `version` and the slug lists together on the next release. */
export const RELEASE = { version: "v2", label: "نسخه‌ی ۲" } as const;

type Kind = "components" | "blocks" | "templates" | "animations" | "backgrounds" | "charts" | "calendar";

/** Items added in this release, in the order they should be shown. */
const NEW_SLUGS: Record<Kind, string[]> = {
  components: [
    "card-to-card", "chat-message", "tool-call", "model-picker", "sources", "markdown", "code-block",
    "payment-methods", "shipping-methods", "installment-calculator", "currency-toggle", "bill-input", "legal-id-input",
    "wheel-date-picker", "birthday-picker", "relative-time", "mention-input", "color-picker", "image-cropper",
    "signature-pad", "qr-code", "copy-button", "sortable-list", "tree-view", "resizable", "drawer", "bottom-nav",
    "menubar", "navigation-menu", "product-tour",
  ],
  blocks: [
    "hero-split", "hero-search", "hero-app", "navbar-floating", "navbar-mega", "navbar-shop", "product-detail",
    "cart-drawer", "order-tracking", "reviews", "pricing-single", "pricing-rows", "pricing-usage", "login-split",
    "testimonials-wall", "testimonials-marquee", "testimonial-spotlight", "trust-badges", "app-download",
    "social-links", "footer-mega", "footer-centered", "footer-minimal",
  ],
  templates: [
    "cafe-menu", "messenger", "crypto-exchange", "doctor-appointment", "seat-picker", "classifieds", "podcast",
    "event-landing", "link-in-bio", "portfolio", "resume",
  ],
  animations: [
    "hero-intro", "hero-parallax", "image-trail", "image-lens", "image-reveal", "ken-burns", "scroll-fill-text",
    "line-rise", "glitch-text", "fill-button", "roll-button", "cursor-ring",
  ],
  backgrounds: [
    "iridescence", "orb", "hyperspace", "beams", "liquid-chrome", "smoke-ring", "lightning", "gradient-blinds",
    "swirl", "neural-veins",
  ],
  charts: ["iran-map-chart", "sankey-chart", "bullet-chart"],
  calendar: ["prayer-times", "triple-date", "resource-timeline"],
};

const SOURCES: Record<Kind, { label: string; href: string; items: { slug: string; name: string; desc: string }[] }> = {
  components: { label: "کامپوننت", href: "/components", items: components },
  blocks: { label: "بلاک", href: "/blocks", items: blocks },
  templates: { label: "قالب", href: "/templates", items: templates },
  animations: { label: "انیمیشن", href: "/animations", items: animations },
  backgrounds: { label: "پس‌زمینه", href: "/backgrounds", items: backgrounds },
  charts: { label: "نمودار", href: "/charts", items: charts },
  calendar: { label: "تقویم", href: "/calendar", items: calendar },
};

export type NewItem = { slug: string; name: string; desc: string; href: string };
export type NewGroup = { kind: Kind; label: string; href: string; items: NewItem[] };

/** Groups of new items resolved against the live registry; slugs that no longer exist are dropped. */
export const whatsNew: NewGroup[] = (Object.keys(NEW_SLUGS) as Kind[]).map((kind) => {
  const src = SOURCES[kind];
  const items = NEW_SLUGS[kind].flatMap((slug) => {
    const it = src.items.find((x) => x.slug === slug);
    return it ? [{ slug, name: it.name, desc: it.desc, href: `${src.href}/${slug}` }] : [];
  });
  return { kind, label: src.label, href: src.href, items };
});

export const whatsNewTotal = whatsNew.reduce((n, g) => n + g.items.length, 0);
