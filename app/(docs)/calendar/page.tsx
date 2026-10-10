import type { Metadata } from "next";
import { CalendarSection } from "@/components/landing/calendar";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "تقویم شمسی و تعطیلات رسمی برای React · وایب‌فارسی",
  description: "کامپوننت‌های تقویم فارسی بدون وابستگی: تقویم رویداد با نمای ماه و هفته و روز، تعطیلات رسمی ایران با تاریخ قمری، انتخاب نوبت، گانت و برنامه‌ی شیفت، همه شمسی و راست‌چین.",
  path: "/calendar",
});

export default function CalendarIndex() {
  return <CalendarSection standalone />;
}
