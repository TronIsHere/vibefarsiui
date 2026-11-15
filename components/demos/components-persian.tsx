"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { WheelDatePicker } from "@/registry/ui/wheel-date-picker";
import { BirthdayPicker } from "@/registry/ui/birthday-picker";
import { BillInput } from "@/registry/ui/bill-input";
import { LegalIdInput } from "@/registry/ui/legal-id-input";
import { InstallmentCalculator } from "@/registry/ui/installment-calculator";
import { CurrencyProvider, CurrencyToggle, Money } from "@/registry/ui/currency-toggle";
import { RelativeTime } from "@/registry/ui/relative-time";
import { ShippingMethods, type ShippingMethod } from "@/registry/ui/shipping-methods";
import { PaymentMethods, type PaymentMethod } from "@/registry/ui/payment-methods";
import { toGregorian } from "@/lib/jalali";

const shipping: ShippingMethod[] = [
  { id: "post", name: "پست پیشتاز", kind: "post", eta: "۲ تا ۴ روز کاری", price: 65_000, freeFrom: 1_500_000 },
  { id: "tipax", name: "تیپاکس", kind: "express", eta: "۱ تا ۲ روز کاری", description: "هزینه را هنگام تحویل می‌پردازید" },
  { id: "courier", name: "پیک موتوری", kind: "courier", eta: "امروز تا ساعت ۲۰", price: 90_000, disabled: true, disabledReason: "فقط برای نشانی‌های داخل تهران" },
  { id: "pickup", name: "تحویل حضوری", kind: "pickup", eta: "از فردا، ۱۰ تا ۱۸", price: 0 },
];

const payment: PaymentMethod[] = [
  { id: "zarinpal", kind: "gateway", name: "درگاه زرین‌پال", badge: "پیشنهادی" },
  { id: "mellat", kind: "gateway", name: "به‌پرداخت ملت" },
  { id: "wallet", kind: "wallet", name: "کیف پول", balance: 850_000 },
  { id: "c2c", kind: "card-to-card", name: "کارت‌به‌کارت", description: "تأیید تا یک ساعت بعد از ثبت رسید" },
  { id: "cod", kind: "cod", name: "پرداخت در محل", disabled: true, disabledReason: "برای سفارش بالای ۵ میلیون فعال نیست" },
];

const invoice = [
  { name: "هدفون بی‌سیم", amount: 2_450_000 },
  { name: "کیبورد مکانیکی", amount: 1_950_000 },
  { name: "هزینه‌ی ارسال", amount: 65_000 },
];

function CurrencyDemo({ compact }: { compact?: boolean }) {
  return (
    <CurrencyProvider persist={false}>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">خلاصه‌ی فاکتور</span>
          <CurrencyToggle size="sm" />
        </div>
        <dl className="mt-3 divide-y divide-border text-sm">
          {(compact ? invoice.slice(0, 2) : invoice).map((row) => (
            <div key={row.name} className="flex justify-between gap-3 py-2">
              <dt className="text-muted-foreground">{row.name}</dt>
              <dd><Money amount={row.amount} /></dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 py-2.5 font-semibold">
            <dt>جمع کل</dt>
            <dd><Money amount={invoice.reduce((s, r) => s + r.amount, 0)} className="text-base" /></dd>
          </div>
        </dl>
      </div>
    </CurrencyProvider>
  );
}

const minutes = (n: number) => new Date(Date.now() - n * 60_000);

// Built once at module load so render stays pure.
const relativeRows: [string, Date][] = [
  ["پیام جدید", minutes(0.2)],
  ["آخرین ورود", minutes(12)],
  ["ثبت سفارش", minutes(60 * 5)],
  ["پرداخت", minutes(60 * 26)],
  ["تحویل سفارش", minutes(-(60 * 49))],
  ["عضویت", minutes(60 * 24 * 200)],
];

function RelativeDemo() {
  const rows = relativeRows;
  return (
    <ul className="w-full divide-y divide-border text-sm">
      {rows.map(([label, date]) => (
        <li key={label} className="flex items-center justify-between gap-3 py-2">
          <span className="text-muted-foreground">{label}</span>
          <RelativeTime date={date} className="font-medium" />
        </li>
      ))}
    </ul>
  );
}

function BillDemo() {
  // A sample pair that passes both check digits: a landline bill of ۱٬۷۰۰ تومان.
  return <BillInput className="w-full" defaultValue={{ billId: "7748317800142", paymentId: "1770160" }} />;
}

function ShippingDemo() {
  const [total, setTotal] = React.useState(1_200_000);
  return (
    <div className="w-full space-y-3">
      <ShippingMethods methods={shipping} defaultValue="post" orderTotal={total} />
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>جمع سبد را عوض کنید تا ارسال رایگان را ببینید.</span>
        <Button size="sm" variant="outline" onClick={() => setTotal((t) => (t < 1_500_000 ? 1_800_000 : 1_200_000))}>{total < 1_500_000 ? "سبد ۱٫۸ میلیونی" : "سبد ۱٫۲ میلیونی"}</Button>
      </div>
    </div>
  );
}

export const persianDemos: Record<string, React.ReactNode> = {
  "wheel-date-picker": <WheelDatePicker defaultValue={toGregorian(1374, 7, 12)} />,
  "birthday-picker": <div className="w-full max-w-sm"><BirthdayPicker defaultValue={toGregorian(1374, 7, 12)} minAge={18} /></div>,
  "bill-input": <BillDemo />,
  "legal-id-input": <div className="w-full max-w-sm"><LegalIdInput value="10380284790" /></div>,
  "installment-calculator": <InstallmentCalculator className="max-w-md" price={48_000_000} rate={(m) => (m <= 12 ? 23 : 26)} footer={<Button className="w-full">ثبت درخواست خرید قسطی</Button>} />,
  "currency-toggle": <CurrencyDemo />,
  "relative-time": <RelativeDemo />,
  "shipping-methods": <ShippingDemo />,
  "payment-methods": <PaymentMethods className="w-full" methods={payment} defaultValue="zarinpal" amount={4_465_000} />,
};

export const persianCardDemos: Record<string, React.ReactNode> = {
  ...persianDemos,
  "installment-calculator": <InstallmentCalculator price={48_000_000} terms={[6, 12, 24]} />,
  "currency-toggle": <CurrencyDemo compact />,
  "shipping-methods": <ShippingMethods className="w-full" methods={shipping.slice(0, 3)} defaultValue="post" orderTotal={1_800_000} />,
  "payment-methods": <PaymentMethods className="w-full" methods={payment.slice(0, 3)} defaultValue="zarinpal" amount={4_465_000} />,
};
