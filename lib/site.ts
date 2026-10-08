import type { Metadata } from "next";

export const SITE_URL = "https://vibefarsi.ir";
export const SITE_NAME = "وایب‌فارسی";
export const SITE_NAME_EN = "VibeFarsi";
export const GITHUB_URL = "https://github.com/TronIsHere/vibefarsiui";
export const GITHUB_REPO = "TronIsHere/vibefarsiui";
export const X_URL = "https://x.com/Erwinamm";
export const SPONSOR_URL = X_URL;
export const NPM_URL = "https://www.npmjs.com/package/vibefarsi";

/** Public community pages (/community, /showcase, submissions). Off for now; the admin queue at /vf/community still works. */
export const COMMUNITY_ENABLED = false;

export const SITE_TITLE = "کامپوننت‌های فارسی راست‌چین برای React · وایب‌فارسی";
export const SITE_DESCRIPTION =
  "کامپوننت‌های راست‌چین رایگان برای Next.js و React. فایل را کپی کنید یا پرامپت انگلیسی را به Cursor بدهید. فونت و اعداد فارسی داخل خود کامپوننت است.";

export function absUrl(path = "/"): string {
  return new URL(path, SITE_URL).href;
}

export const OG_ALT = "وایب‌فارسی: کامپوننت‌های فارسی راست‌چین برای React";
/** Bump when replacing the PNG so X/Telegram re-fetch (they cache by exact image URL). */
export const OG_IMAGE_URL = "/opengraph-image.png?v=2";
export const OG_IMAGE = {
  url: OG_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: OG_ALT,
} as const;

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description?: string;
  path: string;
  index?: boolean;
}): Metadata {
  const image = { ...OG_IMAGE };
  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: SITE_NAME,
      title,
      ...(description ? { description } : {}),
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      ...(description ? { description } : {}),
      images: [image],
    },
    ...(!index ? { robots: { index: false, follow: false } } : {}),
  };
}

function metaDescription(desc?: string) {
  const extra = "کد، پرامپت و راهنمای نصب برای React و Next.js.";
  if (!desc) return extra;
  if (desc.length >= 110) return desc;
  return `${desc} ${extra}`;
}

export function itemMetadata(
  item: { name: string; desc?: string } | undefined,
  section: string,
  path: string,
): Metadata {
  if (!item) {
    return pageMetadata({ title: "یافت نشد", path, index: false });
  }
  return pageMetadata({
    title: `${item.name} راست‌چین · ${section} · وایب‌فارسی`,
    description: metaDescription(item.desc),
    path,
  });
}

export function siteJsonLd() {
  const orgId = absUrl("/#organization");
  const siteId = absUrl("/#website");
  const appId = absUrl("/#app");
  const personId = absUrl("/#maintainer");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "TronIsHere",
        url: GITHUB_URL,
        sameAs: [GITHUB_URL, SPONSOR_URL],
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        alternateName: [
          "وایب فارسی",
          "وایب‌فارسی UI",
          SITE_NAME_EN,
          "Vibe Farsi",
          "VibeFarsi UI",
        ],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absUrl("/icons/android-chrome-512x512.png"),
        },
        sameAs: [GITHUB_URL, NPM_URL, SPONSOR_URL],
        founder: { "@id": personId },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ["وایب فارسی", SITE_NAME_EN, "Vibe Farsi"],
        inLanguage: "fa-IR",
        description: SITE_DESCRIPTION,
        publisher: { "@id": orgId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": appId,
        name: SITE_NAME,
        alternateName: SITE_NAME_EN,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        inLanguage: "fa-IR",
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IRR",
        },
        author: { "@id": orgId },
        codeRepository: GITHUB_URL,
        installUrl: NPM_URL,
      },
    ],
  };
}

export function docsHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "نصب وایب‌فارسی با CLI",
    description:
      "در پروژه‌ی Next.js یا Vite با Tailwind v4، دو دستور CLI فونت، جهت صفحه و توکن‌های تم را می‌نویسد و کامپوننت‌ها را اضافه می‌کند.",
    inLanguage: "fa-IR",
    url: absUrl("/docs"),
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "پروژه را آماده کنید",
        text: "یک‌بار در ریشه‌ی پروژه npx vibefarsi@latest init را اجرا کنید تا جهت راست‌چین، فونت و توکن‌های تم نوشته شوند.",
        url: absUrl("/docs#cli"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "کامپوننت‌ها را اضافه کنید",
        text: "با npx vibefarsi add button calendar price هر قطعه را با وابستگی‌هایش داخل پروژه بنویسید.",
        url: absUrl("/docs#cli"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "گزینه‌ها (اختیاری)",
        text: "با --font iransans فونت را عوض کنید، با --theme saffron تم دیگری بگذارید، و با --dry-run فقط ببینید چه فایل‌هایی نوشته می‌شوند.",
        url: absUrl("/docs#cli"),
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absUrl(item.path) } : {}),
    })),
  };
}

export function itemJsonLd(
  item: { name: string; desc: string },
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: item.name,
    description: item.desc,
    url: absUrl(path),
    inLanguage: "fa-IR",
    programmingLanguage: "TypeScript",
    codeRepository: GITHUB_URL,
    isPartOf: { "@id": absUrl("/#app") },
    author: { "@id": absUrl("/#organization") },
  };
}
