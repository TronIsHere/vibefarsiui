"use client";

import * as React from "react";
import { MapPin, Scissors, Stethoscope } from "lucide-react";
import { SlotPicker, type SlotValue } from "@/registry/calendar/slot-picker";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Avatar } from "@/registry/ui/avatar";
import { RadioGroup } from "@/registry/ui/radio-group";
import { PhoneInput } from "@/registry/ui/phone-input";
import { fa, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import { atMinutes, formatTimeRange } from "@/lib/calendar-utils";

const services = [
  { value: "cut", label: "اصلاح مو", description: "۴۵ دقیقه · ۲۸۰ هزار تومان", price: 280_000, minutes: 45, icon: Scissors },
  { value: "color", label: "رنگ مو", description: "۲ ساعت · ۹۵۰ هزار تومان", price: 950_000, minutes: 120, icon: Scissors },
  { value: "consult", label: "مشاوره‌ی پوست", description: "۳۰ دقیقه · ۴۰۰ هزار تومان", price: 400_000, minutes: 30, icon: Stethoscope },
];
const hours: [string, string][] = [["10:00", "13:30"], ["14:00", "19:00"]];

/** Booked appointments of a day. Replace with your API. */
function bookedOn(key: string) {
  const seed = Number(key.slice(-2));
  return [630, 840, 1020].filter((_, i) => (seed + i) % 2 === 0).map((m) => ({ start: atMinutes(key, m), end: atMinutes(key, m + 45) }));
}

/** رزرو نوبت: سرویس، روز و ساعت خالی (جمعه‌ها و تعطیلات رسمی بسته) و تأیید. */
export function BookingPage() {
  const [service, setService] = React.useState("cut");
  const [slot, setSlot] = React.useState<SlotValue>(null);
  const chosen = services.find((s) => s.value === service)!;
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border"><div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4"><Avatar name="سالن نگار" /><div><p className="text-sm font-bold">سالن زیبایی نگار</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />تهران، سعادت‌آباد</p></div><Badge variant="success" className="ms-auto">امروز باز است</Badge></div></header>
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
        <section className="space-y-3"><h2 className="font-semibold">۱. سرویس</h2><RadioGroup variant="cards" value={service} onChange={(v) => { setService(v); setSlot(null); }} options={services} /></section>
        <section className="space-y-3">
          <h2 className="font-semibold">۲. روز و ساعت</h2>
          <SlotPicker key={service} value={slot} onChange={setSlot} duration={chosen.minutes} step={15} hours={hours} busy={(k) => bookedOn(k)} days={10} />
        </section>
        <section className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6">
          <h2 className="font-semibold">۳. تأیید</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">سرویس</dt><dd>{chosen.label}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">روز</dt><dd>{slot ? formatJalali(slot.start, { weekday: true }) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">ساعت</dt><dd className="tabular-nums">{slot ? formatTimeRange(slot.start, slot.end) : "—"}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 font-bold"><dt>بیعانه</dt><dd>{formatToman(Math.round(chosen.price * 0.3))}</dd></div>
          </dl>
          <div className="space-y-1.5"><span className="text-sm font-medium">شماره‌ی موبایل برای یادآوری</span><PhoneInput /></div>
          <Button className="w-full" disabled={!slot}>پرداخت بیعانه و ثبت نوبت</Button>
          <p className="text-[11px] text-muted-foreground">تا {fa(24)} ساعت قبل از نوبت می‌توانید رایگان لغو کنید.</p>
        </section>
      </main>
    </div>
  );
}
