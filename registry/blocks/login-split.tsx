"use client";

import * as React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { PhoneInput } from "@/registry/ui/phone-input";
import { OtpField } from "@/registry/ui/otp-field";
import { fa } from "@/lib/utils";

export interface LoginSplitProps {
  logo: React.ReactNode;
  title?: string;
  /** Called with the ten-digit national number when «دریافت کد» is pressed. Reject to show the error. */
  onRequestCode?: (phone: string) => Promise<void> | void;
  /** Called with the phone and the typed code. Reject to show «کد درست نیست». */
  onVerify?: (phone: string, code: string) => Promise<void> | void;
  /** Seconds before «ارسال دوباره» becomes active. */
  resendAfter?: number;
  codeLength?: number;
  /** The side panel: a quote, a list of benefits or a picture. */
  aside?: React.ReactNode;
  termsHref?: string;
}

/** ورود دوستونه. Mobile number then SMS code on one side, a brand panel on the other; the panel hides on mobile. */
export function LoginSplit({ logo, title = "ورود یا ثبت‌نام", onRequestCode, onVerify, resendAfter = 120, codeLength = 5, aside, termsHref = "#" }: LoginSplitProps) {
  const [phone, setPhone] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [left, setLeft] = React.useState(resendAfter);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    if (step !== "code" || left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, left]);

  async function requestCode() {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      await onRequestCode?.(phone);
      setStep("code");
      setLeft(resendAfter);
      setAttempt((a) => a + 1);
    } catch {
      setError("ارسال کد انجام نشد. چند لحظه‌ی دیگر دوباره امتحان کنید.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(code: string) {
    setBusy(true);
    setError("");
    try {
      await onVerify?.(phone, code);
    } catch {
      setError("کد واردشده درست نیست.");
      setAttempt((a) => a + 1);
    } finally {
      setBusy(false);
    }
  }

  const clock = `${fa(Math.floor(left / 60))}:${fa(String(left % 60).padStart(2, "0"))}`;

  return (
    <section className="grid min-h-[36rem] lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <div className="text-base font-bold">{logo}</div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {step === "phone" ? (
            <form onSubmit={(e) => { e.preventDefault(); requestCode(); }}>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">شماره‌ی موبایل‌تان را وارد کنید. کد تأیید را پیامک می‌کنیم.</p>
              <label htmlFor="login-split-phone" className="mt-8 block text-sm font-medium">شماره‌ی موبایل</label>
              <PhoneInput id="login-split-phone" className="mt-1.5" value={phone} onChange={(d, v) => { setPhone(d); setValid(v); }} autoFocus />
              <Button type="submit" size="lg" className="mt-5 w-full" disabled={!valid || busy}>{busy ? "در حال ارسال…" : "دریافت کد تأیید"}</Button>
              <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">ورود شما به معنای پذیرش <a href={termsHref} className="underline underline-offset-4 hover:text-foreground">قوانین و حریم خصوصی</a> است.</p>
            </form>
          ) : (
            <div>
              <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowRight className="size-4" />تغییر شماره</button>
              <h1 className="mt-6 text-2xl font-bold">کد تأیید را وارد کنید</h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">کد {fa(codeLength)} رقمی به شماره‌ی <bdi dir="ltr" className="font-medium text-foreground">{fa(`0${phone}`)}</bdi> پیامک شد.</p>
              <div className="mt-8 flex justify-center">
                <OtpField key={attempt} length={codeLength} onComplete={verify} disabled={busy} aria-label="کد تأیید" />
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {left > 0 ? (
                  <span>ارسال دوباره‌ی کد تا <span className="font-medium tabular-nums text-foreground">{clock}</span> دیگر</span>
                ) : (
                  <button type="button" onClick={requestCode} disabled={busy} className="cursor-pointer font-medium text-foreground underline underline-offset-4">ارسال دوباره‌ی کد</button>
                )}
              </div>
            </div>
          )}
          <p role="alert" className="mt-4 min-h-5 text-center text-sm text-destructive">{error}</p>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" />شماره‌ی شما فقط برای ورود استفاده میشه.</p>
      </div>
      <div className="relative hidden overflow-hidden border-s border-border bg-card lg:flex lg:items-center lg:justify-center lg:p-12">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(70% 60% at 30% 20%, oklch(from var(--brand) l c h / 22%), transparent 70%), radial-gradient(60% 50% at 80% 90%, oklch(from var(--foreground) l c h / 8%), transparent 70%)" }} />
        <div className="relative max-w-md">{aside}</div>
      </div>
    </section>
  );
}
