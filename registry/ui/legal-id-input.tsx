"use client";

import * as React from "react";
import { Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { isLegalId, normalizeLegalId } from "@/lib/persian";

export interface LegalIdInputProps {
  value?: string;
  onChange?: (id: string, valid: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

/** شناسه‌ی ملی. The 11-digit id of companies and organisations, with its check digit verified as you type. */
export function LegalIdInput({ value, onChange, disabled, className, id, name }: LegalIdInputProps) {
  const [internal, setInternal] = React.useState("");
  const digits = normalizeLegalId(value ?? internal);
  const complete = digits.length === 11;
  const valid = complete && isLegalId(digits);
  const autoId = React.useId();
  const hintId = `${id ?? autoId}-hint`;

  function set(raw: string) {
    const next = normalizeLegalId(raw);
    if (value === undefined) setInternal(next);
    onChange?.(next, isLegalId(next));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div dir="ltr" className={cn("flex h-10 items-center gap-2 rounded-field border-line-field bg-field shadow-field px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/60", complete && !valid ? "border-destructive/60" : "border-input", disabled && "opacity-50")}>
        <Building2 className="size-4 shrink-0 text-muted-foreground" />
        <input
          id={id}
          name={name}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={digits}
          onChange={(e) => set(e.target.value)}
          placeholder="00000000000"
          aria-invalid={complete && !valid ? true : undefined}
          aria-describedby={hintId}
          className="h-full min-w-0 flex-1 bg-transparent font-mono text-sm tracking-widest outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
        />
        {valid && <Check className="size-4 shrink-0 text-success" />}
      </div>
      <p id={hintId} className={cn("text-[11px]", complete && !valid ? "text-destructive" : "text-muted-foreground")}>
        {complete && !valid ? "شناسه‌ی ملی معتبر نیست." : valid ? "شناسه‌ی ملی معتبر است." : "۱۱ رقم، برای شرکت‌ها و سازمان‌ها"}
      </p>
    </div>
  );
}
