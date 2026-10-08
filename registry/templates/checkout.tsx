"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Bike, CreditCard, Package, ShieldCheck } from "lucide-react";
import { Stepper } from "@/registry/ui/stepper";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { RadioGroup } from "@/registry/ui/radio-group";
import { NumberField } from "@/registry/ui/number-field";
import { Badge } from "@/registry/ui/badge";
import { PhoneInput } from "@/registry/ui/phone-input";
import { AddressPicker } from "@/registry/ui/address-picker";
import { PostalCodeInput } from "@/registry/ui/postal-code-input";
import { fa, formatToman } from "@/lib/utils";

const items = [
  { id: 1, name: "هدفون بی‌سیم مدل X۲", price: 1_890_000, qty: 1 },
  { id: 2, name: "کابل شارژ ۲ متری", price: 120_000, qty: 2 },
];
const shippingOptions = [
  { value: "post", label: "پست پیشتاز", description: "۳ تا ۵ روز کاری · ۴۵ هزار تومان", cost: 45_000 },
  { value: "bike", label: "پیک موتوری", description: "امروز تا ساعت ۲۲ · فقط تهران · ۸۰ هزار تومان", cost: 80_000 },
  { value: "tipax", label: "تیپاکس", description: "۱ تا ۲ روز · پرداخت در محل", cost: 0 },
];
const gateways = [
  { value: "mellat", label: "به پرداخت ملت", description: "کارت‌های عضو شتاب" },
  { value: "saman", label: "سامان‌کیش", description: "کارت‌های عضو شتاب" },
  { value: "wallet", label: "کیف پول", description: "موجودی: ۲٬۱۰۰٬۰۰۰ تومان" },
];

/** پرداخت: سبد → آدرس → ارسال → درگاه، با خلاصه‌ی سفارش چسبان. */
export function CheckoutPage() {
  const [step, setStep] = React.useState(0);
  const [qty, setQty] = React.useState<Record<number, number>>({ 1: 1, 2: 2 });
  const [ship, setShip] = React.useState("post");
  const subtotal = items.reduce((s, i) => s + i.price * (qty[i.id] ?? i.qty), 0);
  const shipping = shippingOptions.find((s) => s.value === ship)?.cost ?? 0;
  const total = subtotal + shipping;
  const steps = [{ label: "سبد خرید" }, { label: "آدرس" }, { label: "ارسال" }, { label: "پرداخت" }];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4"><span className="font-bold">دکان</span><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-success" />پرداخت امن</span></header>
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Stepper current={step} steps={steps} />
          <div className="rounded-2xl border border-border bg-card p-5">
            {step === 0 && (
              <ul className="divide-y divide-border">
                {items.map((it) => (
                  <li key={it.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-secondary"><Package className="size-6 text-muted-foreground" /></span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-6">{it.name}</p>
                        <p className="text-xs text-muted-foreground">گارانتی ۱۸ ماهه</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
                      <NumberField value={qty[it.id]} min={1} max={9} onChange={(n) => setQty((q) => ({ ...q, [it.id]: n }))} aria-label="تعداد" />
                      <span className="shrink-0 text-end text-sm font-semibold tabular-nums sm:w-32">{formatToman(it.price * (qty[it.id] ?? 1))}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="نام و نام خانوادگی" htmlFor="c-n"><Input id="c-n" defaultValue="مریم احمدی" /></Field>
                <div className="space-y-1.5"><span className="text-sm font-medium text-foreground/90">شماره‌ی موبایل</span><PhoneInput /></div>
                <AddressPicker id="c" defaultValue={{ province: "اصفهان", city: "اصفهان" }} className="sm:col-span-2" />
                <Field label="آدرس" htmlFor="c-a" className="sm:col-span-2"><Textarea id="c-a" rows={2} defaultValue="خیابان چهارباغ بالا، کوچه‌ی ۱۲، پلاک ۸، واحد ۳" /></Field>
                <Field label="کد پستی" htmlFor="c-z"><PostalCodeInput id="c-z" defaultValue="8163847351" /></Field>
              </div>
            )}
            {step === 2 && <RadioGroup variant="cards" value={ship} onChange={setShip} options={shippingOptions} />}
            {step === 3 && (
              <div className="space-y-4">
                <RadioGroup variant="cards" defaultValue="mellat" options={gateways} />
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><CreditCard className="size-4" />به درگاه بانک منتقل می‌شوید و بعد از پرداخت برمی‌گردید.</p>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowRight />مرحله‌ی قبل</Button>
            <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>{step === 3 ? `پرداخت ${formatToman(total)}` : "ادامه"}{step < 3 && <ArrowLeft />}</Button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6">
          <h2 className="font-semibold">خلاصه‌ی سفارش</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{fa(items.length)} کالا</dt><dd>{formatToman(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">هزینه‌ی ارسال</dt><dd>{shipping ? formatToman(shipping) : "پرداخت در محل"}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><dt>قابل پرداخت</dt><dd>{formatToman(total)}</dd></div>
          </dl>
          <div className="mt-4 flex gap-2"><Input placeholder="کد تخفیف" dir="ltr" className="h-9" /><Button variant="outline" size="sm" className="h-9">اعمال</Button></div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Bike className="size-4" /><span>ارسال امروز برای سفارش‌های قبل از ساعت ۱۴</span></div>
          <Badge variant="success" className="mt-4">۷ روز ضمانت بازگشت</Badge>
        </aside>
      </main>
    </div>
  );
}
