"use client";

import * as React from "react";
import { Check, Mailbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPostalCode, isPostalCode, normalizePostalCode } from "@/lib/persian";

export interface PostalCodeInputProps {
  value?: string;
  defaultValue?: string;
  /** Receives up to 10 raw Latin digits and validity. */
  onChange?: (digits: string, valid: boolean) => void;
  /** Hidden input with the 10 digits, for a plain <form>. */
  name?: string;
  id?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  /** Show the error even before blur (pass true after a submit attempt). */
  invalid?: boolean;
  className?: string;
}

/**
 * کد پستی. Persian digits in the «۸۱۶۳۸-۴۷۳۵۱» grouping printed on bills,
 * pasting with or without the dash works, and the length error waits for blur.
 */
export function PostalCodeInput({ value, defaultValue = "", onChange, name, id, autoFocus, disabled, invalid, className }: PostalCodeInputProps) {
  const [internal, setInternal] = React.useState(() => normalizePostalCode(defaultValue));
  const [touched, setTouched] = React.useState(false);
  const auto = React.useId();
  const fieldId = id ?? auto;
  const digits = normalizePostalCode(value ?? internal);
  const valid = isPostalCode(digits);
  const showError = !valid && digits.length > 0 && (touched || digits.length === 10 || invalid);
  const missing = invalid && digits.length === 0;

  function set(next: string) {
    const d = normalizePostalCode(next);
    if (value === undefined) setInternal(d);
    onChange?.(d, isPostalCode(d));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-field border-line-field bg-field shadow-field px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/60",
          showError || missing ? "border-destructive/60" : "border-input",
          disabled && "opacity-50",
        )}
        dir="ltr"
      >
        <Mailbox className="size-4 shrink-0 text-muted-foreground" />
        <input
          id={fieldId}
          inputMode="numeric"
          autoComplete="postal-code"
          autoFocus={autoFocus}
          disabled={disabled}
          value={formatPostalCode(digits)}
          onChange={(e) => set(e.target.value)}
          onBlur={() => setTouched(true)}
          onPaste={(e) => {
            e.preventDefault();
            set(e.clipboardData.getData("text"));
          }}
          placeholder="۱۲۳۴۵-۶۷۸۹۰"
          maxLength={11}
          className="h-full min-w-0 flex-1 bg-transparent text-sm tabular-nums tracking-wide outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
          aria-invalid={showError || missing ? true : undefined}
          aria-describedby={`${fieldId}-hint`}
        />
        {valid && <Check className="size-4 shrink-0 text-success" />}
      </div>
      {name && <input type="hidden" name={name} value={valid ? digits : ""} />}
      <p id={`${fieldId}-hint`} className="text-[11px] text-muted-foreground" aria-live="polite">
        {showError ? (
          <span className="text-destructive">{digits.length < 10 ? "کد پستی باید ۱۰ رقم باشد." : "کد پستی معتبر نیست."}</span>
        ) : missing ? (
          <span className="text-destructive">کد پستی را وارد کنید.</span>
        ) : (
          "ده رقم، بدون خط تیره هم قبول میشه"
        )}
      </p>
    </div>
  );
}
