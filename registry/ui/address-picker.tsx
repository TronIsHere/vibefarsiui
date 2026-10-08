"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PROVINCES, citiesOf } from "@/lib/iran-divisions";
import { Combobox } from "@/registry/ui/combobox";

export type AddressValue = { province: string; city: string };

export interface AddressPickerProps {
  value?: AddressValue;
  defaultValue?: AddressValue;
  /** `complete` is true once both a province and one of its cities are picked. */
  onChange?: (value: AddressValue, complete: boolean) => void;
  /** Limit to the provinces you deliver to, e.g. ["تهران", "البرز"]. */
  provinces?: string[];
  /** Hidden inputs `${name}-province` and `${name}-city` for a plain <form>. */
  name?: string;
  /** Prefix for the two input ids, so labels and errors can point at them. */
  id?: string;
  labels?: { province?: string; city?: string };
  /** Shows the «required» error under an empty field (pass true after submit). */
  invalid?: boolean;
  disabled?: boolean;
  /** "row" puts the fields side by side from the sm breakpoint; "stack" always stacks them. */
  layout?: "row" | "stack";
  className?: string;
}

const EMPTY: AddressValue = { province: "", city: "" };

/**
 * استان و شهر: two linked comboboxes over all 31 provinces. The city list
 * follows the province, picking a new province clears the city, and both
 * fields only accept names from the list (Arabic ي/ك typing still matches).
 */
export function AddressPicker({
  value,
  defaultValue = EMPTY,
  onChange,
  provinces,
  name,
  id,
  labels,
  invalid,
  disabled,
  layout = "row",
  className,
}: AddressPickerProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const auto = React.useId();
  const base = id ?? auto;

  const provinceOptions = React.useMemo(
    () => (provinces ? PROVINCES.filter((p) => provinces.includes(p.name)) : PROVINCES).map((p) => p.name),
    [provinces],
  );
  const cityOptions = React.useMemo(() => citiesOf(current.province), [current.province]);

  function set(next: AddressValue) {
    if (value === undefined) setInternal(next);
    onChange?.(next, !!next.province && citiesOf(next.province).includes(next.city));
  }

  const provinceMissing = invalid && !current.province;
  const cityMissing = invalid && !!current.province && !current.city;

  return (
    <div className={cn("grid grid-cols-1 gap-4", layout === "row" && "sm:grid-cols-2", className)}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${base}-province`} className="text-sm font-medium text-foreground/90">
          {labels?.province ?? "استان"}
        </label>
        <Combobox
          id={`${base}-province`}
          name={name && `${name}-province`}
          strict
          disabled={disabled}
          options={provinceOptions}
          value={current.province}
          onChange={(province) => province !== current.province && set({ province, city: "" })}
          placeholder="انتخاب استان"
          emptyText="استانی با این اسم نیست"
          aria-invalid={provinceMissing || undefined}
          aria-describedby={provinceMissing ? `${base}-province-error` : undefined}
        />
        {provinceMissing && (
          <p id={`${base}-province-error`} className="text-xs text-destructive">
            استان را انتخاب کنید.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${base}-city`} className="text-sm font-medium text-foreground/90">
          {labels?.city ?? "شهر"}
        </label>
        <Combobox
          id={`${base}-city`}
          name={name && `${name}-city`}
          strict
          disabled={disabled || !current.province}
          options={cityOptions}
          value={current.city}
          onChange={(city) => set({ province: current.province, city })}
          placeholder={current.province ? `شهرهای ${current.province}` : "اول استان را انتخاب کنید"}
          emptyText="این شهر در فهرست نیست"
          aria-invalid={cityMissing || undefined}
          aria-describedby={cityMissing ? `${base}-city-error` : undefined}
        />
        {cityMissing && (
          <p id={`${base}-city-error`} className="text-xs text-destructive">
            شهر را انتخاب کنید.
          </p>
        )}
      </div>
    </div>
  );
}
