"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Stepper } from "@/registry/ui/stepper";
import { RadioGroup } from "@/registry/ui/radio-group";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { SuccessCheck } from "@/registry/animations/success-check";
import { SlotPicker, type SlotValue } from "@/registry/calendar/slot-picker";
import { formatJalali, JALALI_WEEKDAYS, jalaliWeekday } from "@/lib/jalali";
import { atMinutes, formatTime } from "@/lib/calendar-utils";
import { cn, fa, faNumber } from "@/lib/utils";
import { DOCTORS, Photo, SERVICES, Shell, useHref } from "./shell";

const STEPS = [{ label: "خدمت" }, { label: "پزشک و زمان" }, { label: "مشخصات" }];
const HOURS: [string, string][] = [["09:00", "12:45"], ["16:00", "21:15"]];
const STARTS = [540, 585, 630, 675, 720, 960, 1005, 1050, 1095, 1140, 1185, 1230];

/** Appointments already booked with a doctor on a day, stable for the same date. Replace with your API. */
function bookedSlots(key: string, doctor: string) {
  const [, m, d] = key.split("-").map(Number);
  const seed = d * 7 + m * 3 + doctor.length;
  return STARTS.filter((_, i) => (seed + i * 5) % 4 === 0).map((t) => ({ start: atMinutes(key, t), end: atMinutes(key, t + 45) }));
}

/** نوبت‌دهی سه‌مرحله‌ای با تقویم شمسی و ساعت‌های خالی. */
export function BookingPage() {
  const href = useHref();
  const [step, setStep] = React.useState(0);
  const [service, setService] = React.useState(SERVICES[0].id);
  const [doctor, setDoctor] = React.useState(DOCTORS[0].id);
  const [slot, setSlot] = React.useState<SlotValue>(null);
  const [phoneOk, setPhoneOk] = React.useState(false);
  const [name, setName] = React.useState("");
  const [done, setDone] = React.useState<string | null>(null);

  const svc = SERVICES.find((s) => s.id === service)!;
  const doc = DOCTORS.find((d) => d.id === doctor)!;
  const when = slot ? `${formatJalali(slot.start, { weekday: true })} ساعت ${formatTime(slot.start)}` : null;

  const canNext = step === 0 ? Boolean(service) : step === 1 ? Boolean(slot) : name.trim().length > 1 && phoneOk;

  function next() {
    if (step < 2) setStep(step + 1);
    else setDone(`LB-${Math.floor(100000 + Math.random() * 899999)}`);
  }

  if (done) {
    return (
      <Shell active="/booking">
        <section className="mx-auto max-w-lg px-4 py-20 text-center" role="status">
          <SuccessCheck className="mx-auto" />
          <h1 className="mt-6 text-3xl font-black">نوبتتون ثبت شد</h1>
          <p className="mt-3 leading-8 text-muted-foreground">
            {svc.name} با {doc.name}، {when}. پیامک یادآوری یک روز قبل براتون می‌آد.
          </p>
          <p className="mx-auto mt-6 w-fit rounded-xl border border-dashed border-border px-5 py-3 text-sm">
            کد پیگیری: <span dir="ltr" className="font-mono font-bold">{done}</span>
          </p>
          <a href={href("/")} className="mt-8 inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold hover:bg-secondary">
            برگشت به خانه
          </a>
        </section>
      </Shell>
    );
  }

  return (
    <Shell active="/booking">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6">
        <h1 className="text-3xl font-black sm:text-4xl">نوبت‌دهی آنلاین</h1>
        <Stepper steps={STEPS} current={step} className="mt-8 max-w-xl" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-3xl border border-border p-5 sm:p-7">
            {step === 0 && (
              <fieldset>
                <legend className="mb-4 font-bold">چه خدمتی لازم دارید؟</legend>
                <RadioGroup
                  name="service"
                  variant="cards"
                  value={service}
                  onChange={setService}
                  options={SERVICES.map((s) => ({ value: s.id, label: s.name, description: `از ${faNumber(s.from)} تومان · حدود ${fa(s.min)} دقیقه` }))}
                />
              </fieldset>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <fieldset>
                  <legend className="mb-4 font-bold">پزشک</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {DOCTORS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        aria-pressed={doctor === d.id}
                        onClick={() => {
                          setDoctor(d.id);
                          setSlot(null);
                        }}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-start transition-colors",
                          doctor === d.id ? "border-foreground bg-secondary" : "border-border hover:bg-secondary/50",
                        )}
                      >
                        <span className="size-11 shrink-0 overflow-hidden rounded-full">
                          <Photo name={d.photo} alt="" />
                        </span>
                        <span className="text-sm">
                          <span className="block font-semibold">{d.name}</span>
                          <span className="block text-xs text-muted-foreground">{d.days.join("، ")}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <p className="mb-3 font-bold">روز و ساعت</p>
                  <SlotPicker
                    key={doctor}
                    value={slot}
                    onChange={setSlot}
                    duration={45}
                    hours={HOURS}
                    closedReason={(d) => {
                      const w = JALALI_WEEKDAYS[jalaliWeekday(d)];
                      return w !== "جمعه" && !doc.days.includes(w) ? `${doc.name} ${w}‌ها در کلینیک نیستن` : null;
                    }}
                    busy={(k) => bookedSlots(k, doctor)}
                    days={21}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="اسم و نام خانوادگی" htmlFor="b-name">
                  <Input id="b-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </Field>
                <Field label="شماره‌ی موبایل" htmlFor="b-phone" hint="کد پیگیری و یادآوری به این شماره پیامک میشه.">
                  <PhoneInput id="b-phone" onChange={(_, ok) => setPhoneOk(ok)} />
                </Field>
                <Field label="توضیحات (اختیاری)" htmlFor="b-note" className="sm:col-span-2">
                  <Textarea id="b-note" rows={3} maxLength={300} showCount placeholder="مثلاً دندان سمت راست بالا به سرما حساسه" />
                </Field>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
                <ArrowRight />
                قبلی
              </Button>
              <Button onClick={next} disabled={!canNext} className="rounded-full px-6">
                {step === 2 ? "ثبت نوبت" : "مرحله‌ی بعد"}
                {step < 2 && <ArrowLeft />}
              </Button>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-28">
            <h2 className="font-bold">خلاصه‌ی نوبت</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["خدمت", svc.name],
                ["پزشک", step > 0 ? doc.name : "—"],
                ["روز", slot ? formatJalali(slot.start, { weekday: true }) : "—"],
                ["ساعت", slot ? formatTime(slot.start) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-dashed border-border pb-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-end font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 pt-1">
                <dt className="text-muted-foreground">هزینه‌ی تقریبی</dt>
                <dd className="font-bold">از {faNumber(svc.from)} تومان</dd>
              </div>
            </dl>
            <p className="mt-5 rounded-xl bg-secondary/60 p-3 text-xs leading-6 text-muted-foreground">نوبت رایگان ثبت میشه و هزینه بعد از معاینه و در خود کلینیک پرداخت میشه.</p>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
