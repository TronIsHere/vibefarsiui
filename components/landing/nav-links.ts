import { COMMUNITY_ENABLED } from "@/lib/site";

export type NavLink = { href: string; label: string; desc?: string };
export type NavGroup = { label: string; items: readonly NavLink[] };
export type NavEntry = NavLink | NavGroup;

/** The six browsable catalogs, grouped under one menu so the top bar stays short. */
export const libraryLinks: readonly NavLink[] = [
  { href: "/components", label: "کامپوننت‌ها", desc: "دکمه، ورودی، جدول و تقویم شمسی" },
  { href: "/blocks", label: "بلاک‌ها", desc: "هیرو، قیمت‌گذاری، فوتر و بخش‌های آماده‌ی صفحه" },
  { href: "/animations", label: "انیمیشن‌ها", desc: "حرکت‌های سبک و راست‌چین، بدون کتابخانه‌ی اضافه" },
  { href: "/backgrounds", label: "پس‌زمینه‌ها", desc: "الگو، نور و شیدرهایی که متن روشون خوانا می‌مونه" },
  { href: "/templates", label: "قالب‌ها", desc: "صفحه‌های کامل مثل داشبورد، فروشگاه و فاکتور" },
  { href: "/sites", label: "سایت‌ها", desc: "سایت‌های چندصفحه‌ای که با یک دستور نصب می‌شن" },
];

export const navLinks: readonly NavEntry[] = [
  { href: "/docs", label: "مستندات" },
  { label: "کتابخانه", items: libraryLinks },
  { href: "/themes", label: "سیستم‌های طراحی" },
  { href: "/skills", label: "مهارت‌ها" },
  ...(COMMUNITY_ENABLED ? [{ href: "/community", label: "جامعه" }] : []),
];

export const isGroup = (e: NavEntry): e is NavGroup => "items" in e;
