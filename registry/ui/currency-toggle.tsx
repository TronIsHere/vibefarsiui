"use client";

import * as React from "react";
import { cn, faNumber } from "@/lib/utils";

export type CurrencyUnit = "toman" | "rial";

const LABEL: Record<CurrencyUnit, string> = { toman: "تومان", rial: "ریال" };
const STORAGE_KEY = "currency-unit";

type CurrencyContextValue = { unit: CurrencyUnit; setUnit: (unit: CurrencyUnit) => void };
const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);

/** Amount in the chosen unit. Amounts are always stored in toman; rial is ten times that. */
export function convertToman(toman: number, unit: CurrencyUnit) {
  return unit === "rial" ? toman * 10 : toman;
}

/** «۱۲٬۴۵۰٬۰۰۰ تومان» or «۱۲۴٬۵۰۰٬۰۰۰ ریال». */
export function formatMoney(toman: number, unit: CurrencyUnit) {
  return `${faNumber(convertToman(toman, unit))} ${LABEL[unit]}`;
}

const listeners = new Set<() => void>();
function readStored(fallback: CurrencyUnit): CurrencyUnit {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "rial" || v === "toman" ? v : fallback;
  } catch {
    return fallback;
  }
}

export interface CurrencyProviderProps {
  /** Unit used on the server and before any choice is stored. */
  defaultUnit?: CurrencyUnit;
  /** Remember the choice in localStorage. */
  persist?: boolean;
  children: React.ReactNode;
}

/**
 * واحد پول. Holds the visitor's choice between تومان and ریال for every <Money> below it.
 * People say prices in toman while invoices, bank receipts and the tax system are in rial,
 * so shops and accounting apps let the reader switch.
 */
export function CurrencyProvider({ defaultUnit = "toman", persist = true, children }: CurrencyProviderProps) {
  const [memory, setMemory] = React.useState(defaultUnit);
  // The stored value is read through useSyncExternalStore so server and first client render agree.
  const stored = React.useSyncExternalStore(
    (notify) => { listeners.add(notify); window.addEventListener("storage", notify); return () => { listeners.delete(notify); window.removeEventListener("storage", notify); }; },
    () => readStored(defaultUnit),
    () => defaultUnit,
  );
  const unit = persist ? stored : memory;

  const setUnit = React.useCallback((next: CurrencyUnit) => {
    setMemory(next);
    if (!persist) return;
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
    listeners.forEach((notify) => notify());
  }, [persist]);

  const ctx = React.useMemo(() => ({ unit, setUnit }), [unit, setUnit]);
  return <CurrencyContext.Provider value={ctx}>{children}</CurrencyContext.Provider>;
}

/** The current unit and its setter. Falls back to toman outside a provider. */
export function useCurrency(): CurrencyContextValue {
  return React.useContext(CurrencyContext) ?? { unit: "toman", setUnit: () => {} };
}

export interface MoneyProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Amount in toman. */
  amount: number;
  /** Hides the unit word, for table columns whose header already names it. */
  bare?: boolean;
}

/** مبلغ. Renders a toman amount in whichever unit the provider holds. */
export function Money({ amount, bare, className, ...props }: MoneyProps) {
  const { unit } = useCurrency();
  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)} {...props}>
      {faNumber(convertToman(amount, unit))}
      {!bare && <span className="ms-1 text-[0.8em] font-normal text-muted-foreground">{LABEL[unit]}</span>}
    </span>
  );
}

export interface CurrencyToggleProps {
  size?: "sm" | "md";
  className?: string;
}

/** کلید تومان و ریال. A two-option switch; ArrowLeft and ArrowRight move between the units. */
export function CurrencyToggle({ size = "md", className }: CurrencyToggleProps) {
  const { unit, setUnit } = useCurrency();
  const units: CurrencyUnit[] = ["toman", "rial"];

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const next = unit === "toman" ? "rial" : "toman";
    setUnit(next);
    e.currentTarget.querySelector<HTMLElement>(`[data-unit="${next}"]`)?.focus();
  }

  return (
    <div role="radiogroup" aria-label="واحد پول" onKeyDown={onKeyDown} className={cn("inline-flex rounded-control border-line border-border bg-secondary/60 p-0.5", className)}>
      {units.map((u) => (
        <button
          key={u}
          type="button"
          role="radio"
          data-unit={u}
          aria-checked={unit === u}
          tabIndex={unit === u ? 0 : -1}
          onClick={() => setUnit(u)}
          className={cn(
            "cursor-pointer rounded-[calc(var(--shape-control)-2px)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3.5 text-sm",
            unit === u ? "bg-card text-foreground shadow-control" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABEL[u]}
        </button>
      ))}
    </div>
  );
}
