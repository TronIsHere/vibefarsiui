export * from "./types";
export * from "./components";
export * from "./animations";
export * from "./backgrounds";
export * from "./charts";
export * from "./calendar";
export * from "./templates";
export * from "./sites";
export * from "./blocks";
export * from "./themes";
export * from "./skills";
export * from "./prompt";
export * from "./libs";
export * from "./catalog";

import { components } from "./components";
import { animations } from "./animations";
import { backgrounds } from "./backgrounds";
import { charts } from "./charts";
import { calendar } from "./calendar";
import { templates } from "./templates";
import { sites } from "./sites";
import { blocks } from "./blocks";
import { themes } from "./themes";
import { skills } from "./skills";

export type SectionKey = "components" | "blocks" | "charts" | "calendar" | "templates" | "sites" | "animations" | "backgrounds" | "themes" | "skills";

export const sections: { key: SectionKey; label: string; desc: string; count: number }[] = [
  { key: "components", label: "کامپوننت‌ها", desc: "دکمه، فرم و جدول، همه از پایه راست‌چین", count: components.length },
  { key: "blocks", label: "بلاک‌ها", desc: "بخش‌های آماده‌ی صفحه مثل هیرو، قیمت و پرسش‌های متداول", count: blocks.length },
  { key: "charts", label: "نمودارها", desc: "خطی، میله‌ای، دایره‌ای، نقشه‌ی حرارتی تقویم شمسی و شمعی، بدون کتابخانه", count: charts.length },
  { key: "calendar", label: "تقویم", desc: "تقویم رویدادها، تعطیلات رسمی و قمری، نوبت‌دهی، گانت و شیفت، همه شمسی و راست‌چین", count: calendar.length },
  { key: "animations", label: "انیمیشن‌ها", desc: "انیمیشن با CSS و React، بدون کتابخانه‌ی اضافه", count: animations.length },
  { key: "backgrounds", label: "پس‌زمینه‌ها", desc: "الگو و نور کم‌کنتراست که متن روشون خوانا می‌مونه", count: backgrounds.length },
  { key: "templates", label: "قالب‌ها", desc: "صفحه‌های کامل، از همین کامپوننت‌ها", count: templates.length },
  { key: "sites", label: "سایت‌های کامل", desc: "وب‌سایت‌های چندصفحه‌ای آماده که یک‌جا کپی میشن", count: sites.length },
  { key: "themes", label: "سیستم‌های طراحی", desc: "توکن‌های رنگ و شعاع که هر وقت بخواید عوض میشن", count: themes.length },
  { key: "skills", label: "مهارت‌ها", desc: "فایل‌های SKILL.md که به Claude Code و Cursor فارسی یاد میدن", count: skills.length },
];
