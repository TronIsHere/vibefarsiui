import type { Metadata } from "next";
import { Charts } from "@/components/landing/charts";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "نمودارهای راست‌چین با تقویم شمسی برای React · وایب‌فارسی",
  description: "کتابخانه‌ی نمودار فارسی بدون وابستگی: خطی، ناحیه‌ای، میله‌ای، دایره‌ای، راداری، نقشه‌ی حرارتی تقویم شمسی، قیف، نقشه‌ی درختی، آبشاری و شمعی، با اعداد فارسی و کیبورد.",
  path: "/charts",
});

export default function ChartsIndex() {
  return <Charts standalone />;
}
