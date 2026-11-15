"use client";

import * as React from "react";
import { atMinutes, dayKey, formatTimeRange, type CalendarEvent, type Resource } from "@/lib/calendar-utils";
import { PrayerTimes } from "@/registry/calendar/prayer-times";
import { TripleDate } from "@/registry/calendar/triple-date";
import { ResourceTimeline } from "@/registry/calendar/resource-timeline";

/* Bookings for today, built once at module load so render stays pure. */
const todayKey = dayKey(new Date());
const at = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return atMinutes(todayKey, h * 60 + m);
};
const book = (id: string, resourceId: string, title: string, from: string, to: string, color?: number): CalendarEvent => ({ id, resourceId, title, start: at(from), end: at(to), color });

const rooms: Resource[] = [
  { id: "r1", title: "اتاق جلسه‌ی البرز", subtitle: "۱۲ نفر" },
  { id: "r2", title: "اتاق جلسه‌ی دماوند", subtitle: "۶ نفر" },
  { id: "r3", title: "اتاق تلفن", subtitle: "۱ نفر" },
  { id: "r4", title: "سالن آموزش", subtitle: "۴۰ نفر" },
];

const bookings: CalendarEvent[] = [
  book("b1", "r1", "جلسه‌ی هفتگی محصول", "09:00", "10:30", 1),
  book("b2", "r1", "مصاحبه‌ی استخدام", "11:00", "12:00", 3),
  book("b3", "r1", "بازبینی طراحی", "14:00", "15:30", 2),
  book("b4", "r2", "دمو برای مشتری", "10:00", "11:00", 4),
  book("b5", "r2", "برنامه‌ریزی اسپرینت", "10:30", "12:30", 1),
  book("b6", "r2", "یک‌به‌یک", "16:00", "16:30", 5),
  book("b7", "r3", "تماس با تأمین‌کننده", "09:30", "10:00", 6),
  book("b8", "r3", "تماس پشتیبانی", "13:00", "13:45", 6),
  book("b9", "r4", "کارگاه آموزشی فیگما", "13:00", "17:00", 7),
];

function TimelineDemo() {
  const [events, setEvents] = React.useState(bookings);
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div className="w-full space-y-2">
      <ResourceTimeline
        resources={rooms}
        events={events}
        onEventClick={(e) => setLast(`${e.title}، ${formatTimeRange(e.start, e.end)}`)}
        onSlotClick={(resourceId, start, end) => {
          setEvents((list) => [...list, { id: `n${list.length}`, resourceId, title: "رزرو جدید", start, end, color: 2 }]);
          setLast(`رزرو جدید ${formatTimeRange(start, end)} ثبت شد`);
        }}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">{last ?? "روی یک زمان خالی کلیک کنید تا رزرو بشه."}</p>
    </div>
  );
}

export const extraCalendarDemos: Record<string, React.ReactNode> = {
  "prayer-times": (
    <div className="mx-auto grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
      <PrayerTimes cities />
      <div className="space-y-4">
        <PrayerTimes location="مشهد" variant="strip" azanOnly />
        <PrayerTimes location="شیراز" variant="strip" azanOnly />
      </div>
    </div>
  ),
  "triple-date": (
    <div className="mx-auto w-full max-w-md space-y-4">
      <TripleDate navigable />
      <TripleDate variant="inline" latinGregorian />
    </div>
  ),
  "resource-timeline": <TimelineDemo />,
};

function Mini({ children, scale = 0.6 }: { children: React.ReactNode; scale?: number }) {
  return (
    <div className="origin-top-right" style={{ width: `${100 / scale}%`, transform: `scale(${scale})` }}>
      {children}
    </div>
  );
}

export const extraCalendarCardDemos: Record<string, React.ReactNode> = {
  "prayer-times": (
    <Mini scale={0.7}>
      <PrayerTimes azanOnly variant="strip" />
    </Mini>
  ),
  "triple-date": (
    <Mini scale={0.8}>
      <TripleDate occasions={false} />
    </Mini>
  ),
  "resource-timeline": (
    <Mini scale={0.5}>
      <ResourceTimeline resources={rooms} events={bookings} toolbar={false} startHour={9} endHour={17} />
    </Mini>
  ),
};
