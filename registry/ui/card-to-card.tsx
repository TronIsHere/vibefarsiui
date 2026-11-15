"use client";

import * as React from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { cn, fa, formatToman } from "@/lib/utils";
import { bankLabel, cardBank, formatIban, normalizeCardNumber, normalizeIban } from "@/lib/persian";
import { Button } from "./button";

/** Repeating CSS texture laid over the face. */
type Pattern = "rings" | "arc" | "diagonal" | "waves" | "orbs" | "grid" | "sparkle";
/** Drawn motif taken from the bank's real card (mountain, swoosh, clouds…). */
type Art = "mellat" | "damavand" | "clouds" | "map" | "chevron" | "lines" | "swirl" | "ribbons" | "band" | "wedge" | "corner";

export interface BankCardStyle {
  /** CSS background of the face. */
  background: string;
  /** Number, holder and expiry color. */
  ink: string;
  /** Bank name color. */
  accent: string;
  pattern?: Pattern;
  art?: Art;
  /** Soft shadow under the text, for faces with a busy picture behind it. */
  lift?: boolean;
}

const g = (from: string, via: string, to: string) => `linear-gradient(135deg, ${from}, ${via} 55%, ${to})`;

/**
 * One face per bank, keyed by the name `cardBank()` returns. Each one follows
 * the bank's real card (colors and the motif people know it by), drawn with
 * CSS and inline SVG. Logos aren't included; pass your own through `logo`.
 */
export const BANK_CARD_STYLES: Record<string, BankCardStyle> = {
  "ملی": { background: "linear-gradient(180deg, #2a64b8, #6ea8e0 48%, #c4def2 70%)", ink: "#ffffff", accent: "#0b2a6b", art: "damavand", lift: true },
  "ملت": { background: "linear-gradient(135deg, #efe1b0, #cfb67c 50%, #ebdaa6)", ink: "#1c1410", accent: "#c8102e", pattern: "sparkle", art: "mellat" },
  "تجارت": { background: "radial-gradient(120% 95% at 60% 40%, #4189d8, #1d5bb0 55%, #0e3a7d)", ink: "#ffffff", accent: "#ffffff" },
  "پاسارگاد": { background: "linear-gradient(135deg, #222, #0c0c0c 55%, #000)", ink: "#f3e2ad", accent: "#e2bf62", art: "wedge" },
  "شهر": { background: g("#e01b22", "#c9141b", "#a50f15"), ink: "#ffffff", accent: "#ffffff", art: "lines" },
  "رسالت": { background: "linear-gradient(170deg, #2f86d4, #86c0ec 42%, #eef6fd 72%)", ink: "#0e1b2c", accent: "#11508f", art: "clouds" },
  "رفاه کارگران": { background: "linear-gradient(180deg, #ffffff, #eceef3)", ink: "#111827", accent: "#1f4e9c", art: "ribbons" },
  "ایران زمین": { background: "linear-gradient(135deg, #faf8fc, #e8e1f1)", ink: "#24152f", accent: "#6b2c91", art: "swirl" },
  "توسعه تعاون": { background: "linear-gradient(180deg, #f6f9fc 0 26%, #e2eef6 26%, #a8cde4)", ink: "#0d2340", accent: "#1f5f9e", art: "band" },
  "توسعه صادرات": { background: "linear-gradient(135deg, #b3d64a, #9cc63a 55%, #86b22c)", ink: "#13260f", accent: "#0b4f33", art: "map" },
  "صنعت و معدن": { background: "linear-gradient(180deg, #fcfaf4 0 30%, #ead9b0 30%, #ccb27a)", ink: "#1f1a12", accent: "#8a6a2a", art: "chevron" },
  "خاورمیانه": { background: g("#1c1c1c", "#111", "#050505"), ink: "#ffffff", accent: "#ff7a00", art: "corner" },
  "صادرات": { background: g("#14246b", "#2643a3", "#0d184a"), ink: "#ffffff", accent: "#7cc8f2", pattern: "diagonal" },
  "سپه": { background: g("#f2a900", "#ffd043", "#e08e00"), ink: "#0d2557", accent: "#0d2557", pattern: "rings" },
  "سامان": { background: g("#0089c2", "#22b2e6", "#006f9f"), ink: "#ffffff", accent: "#ffffff", pattern: "waves" },
  "پارسیان": { background: g("#6f1230", "#a3203f", "#4f0c22"), ink: "#f3dfb1", accent: "#f3dfb1", pattern: "orbs" },
  "کشاورزی": { background: g("#00693a", "#109a50", "#004f2b"), ink: "#ffffff", accent: "#f4d03f", pattern: "waves" },
  "مسکن": { background: g("#e05a08", "#f7892c", "#bf4a04"), ink: "#ffffff", accent: "#ffffff", pattern: "arc" },
  "دی": { background: g("#00797a", "#00a7a2", "#005a5b"), ink: "#ffffff", accent: "#ffffff", pattern: "orbs" },
  "آینده": { background: g("#55201a", "#8a3424", "#3c1410"), ink: "#f7c873", accent: "#f7c873", pattern: "rings" },
  "اقتصاد نوین": { background: g("#4b1f7a", "#6d34a8", "#341456"), ink: "#ffffff", accent: "#e9c6ff", pattern: "diagonal" },
  "سینا": { background: g("#003f7f", "#0062b2", "#002c5a"), ink: "#ffffff", accent: "#9fd3ff", pattern: "grid" },
  "کارآفرین": { background: g("#0b6b5e", "#159c87", "#07483f"), ink: "#ffffff", accent: "#c9f2e8", pattern: "arc" },
  "پست بانک": { background: g("#087a3c", "#16a352", "#05592b"), ink: "#ffffff", accent: "#ffd200", pattern: "diagonal" },
  "سرمایه": { background: g("#3a2a6b", "#5a46a0", "#271b4d"), ink: "#ffffff", accent: "#d7cdff", pattern: "grid" },
  "قرض‌الحسنه مهر ایران": { background: g("#0b7b3e", "#22a05a", "#075a2d"), ink: "#ffffff", accent: "#ffffff", pattern: "rings" },
};

/** Neutral graphite face for unknown or not-yet-typed cards. */
export const DEFAULT_CARD_STYLE: BankCardStyle = { background: g("#1f2937", "#3b4453", "#111827"), ink: "#ffffff", accent: "#cbd5e1", pattern: "grid" };

export function bankCardStyle(bank: string | null | undefined): BankCardStyle {
  return (bank && BANK_CARD_STYLES[bank]) || DEFAULT_CARD_STYLE;
}

/* Textures take the ink color through currentColor, so they suit light and dark faces alike. */
const tint = (pct: number) => `color-mix(in oklab, currentColor ${pct}%, transparent)`;
const PATTERNS: Record<Pattern, string> = {
  rings: `repeating-radial-gradient(circle at 0% 100%, ${tint(9)} 0 1px, transparent 1px 16px)`,
  arc: `radial-gradient(circle at 0% 50%, transparent 44%, ${tint(12)} 44% 52%, transparent 52% 60%, ${tint(7)} 60% 64%, transparent 64%)`,
  diagonal: `repeating-linear-gradient(45deg, ${tint(7)} 0 2px, transparent 2px 13px)`,
  waves: `radial-gradient(120% 70% at 0% 110%, ${tint(16)}, transparent 60%), radial-gradient(80% 60% at 100% -10%, ${tint(10)}, transparent 60%)`,
  orbs: `radial-gradient(circle at 8% 88%, ${tint(16)} 0 22%, transparent 22.5%), radial-gradient(circle at 26% 105%, ${tint(10)} 0 26%, transparent 26.5%)`,
  grid: `linear-gradient(${tint(6)} 1px, transparent 1px) 0 0 / 18px 18px, linear-gradient(90deg, ${tint(6)} 1px, transparent 1px) 0 0 / 18px 18px`,
  sparkle: `radial-gradient(rgb(255 255 255 / 0.5) 0.6px, transparent 1px) 0 0 / 7px 7px, radial-gradient(rgb(120 90 30 / 0.25) 0.6px, transparent 1px) 3px 4px / 9px 9px`,
};

/** Motifs on a 856×540 canvas (the card in tenths of a millimetre). */
function CardArt({ art }: { art: Art }) {
  const id = React.useId();
  const svg = (children: React.ReactNode) => (
    <svg aria-hidden viewBox="0 0 856 540" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 size-full">
      {children}
    </svg>
  );
  switch (art) {
    case "mellat":
      return svg(
        <>
          <path d="M60 540C20 390 110 210 290 100 380 45 470 15 570 0h150C570 70 470 175 440 300c-24 100 6 180 56 240Z" fill="#c8102e" />
          <path d="M496 540c-50-60-80-140-56-240 16-64 46-118 86-162-24 96-20 250 76 402Z" fill="#8c0a1f" />
          <path d="M60 540C20 390 110 210 290 100" stroke="#fff" strokeOpacity=".25" strokeWidth="6" fill="none" />
        </>,
      );
    case "damavand":
      return svg(
        <>
          <defs>
            <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7d93ad" />
              <stop offset="1" stopColor="#3f5876" />
            </linearGradient>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5f9c3a" />
              <stop offset="1" stopColor="#1f5a22" />
            </linearGradient>
          </defs>
          <path d="M0 390l170-70 160-120 90-52 50 22 90 70 140 60 156 46v194H0Z" fill={`url(#${id}r)`} />
          <path d="M330 200l90-52 50 22 90 70-42-6-38 22-34-30-46 26-30-24-40 18Z" fill="#f5f9fd" />
          <path d="M0 425c200-50 380-10 520-30s260-15 336-25v170H0Z" fill={`url(#${id}g)`} />
        </>,
      );
    case "clouds":
      return svg(
        <>
          <defs>
            <filter id={`${id}b`}><feGaussianBlur stdDeviation="14" /></filter>
          </defs>
          <g fill="#fff" filter={`url(#${id}b)`}>
            <ellipse cx="140" cy="150" rx="170" ry="48" opacity=".9" />
            <ellipse cx="330" cy="100" rx="120" ry="40" opacity=".7" />
            <ellipse cx="720" cy="230" rx="200" ry="60" opacity=".8" />
            <ellipse cx="260" cy="330" rx="260" ry="70" opacity=".9" />
            <ellipse cx="640" cy="440" rx="320" ry="90" />
          </g>
        </>,
      );
    case "map":
      return svg(
        <g fill="#f3e43a" opacity=".55">
          <path d="M90 110c60-30 150-20 190 20s10 90-40 110-60 70-110 50S40 220 50 170s0-40 40-60Z" />
          <path d="M230 300c40-10 80 20 75 70s-30 110-60 130-40-40-45-90-10-100 30-110Z" />
          <path d="M380 90c70-30 170-20 230 10s170 0 210 50-30 90-110 90-100 50-170 40-110-30-150-80-60-80-10-110Z" />
          <path d="M440 260c50-10 100 20 100 70s-40 100-80 110-60-50-60-100 0-75 40-80Z" />
          <path d="M700 330c40-10 90 10 100 50s-20 60-60 60-80-20-80-60 10-45 40-50Z" />
        </g>,
      );
    case "chevron":
      return svg(<path d="M250 560V230l180 170 180-170v330" stroke="#fff" strokeOpacity=".35" strokeWidth="70" fill="none" strokeLinejoin="round" />);
    case "lines":
      return svg(
        <g stroke="#fff" strokeOpacity=".12" strokeWidth="2" fill="none">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M0 ${250 + i * 26}C200 ${190 + i * 26} 420 ${330 + i * 22} 856 ${200 + i * 30}`} />
          ))}
        </g>,
      );
    case "swirl":
      return svg(
        <>
          <path d="M0 90c210 40 300 260 150 450H0Z" fill="#6b2c91" opacity=".14" />
          <path d="M0 200c170 30 230 200 110 340H0Z" fill="#6b2c91" opacity=".18" />
          <path d="M0 540c280-90 560-60 856-150" stroke="#6b2c91" strokeOpacity=".3" strokeWidth="5" fill="none" />
        </>,
      );
    case "ribbons":
      return svg(
        <>
          <path d="M0 250l330-110v12L0 264Z" fill="#c8102e" />
          <path d="M0 272l330-110v8L0 282Z" fill="#1f4e9c" />
          <path d="M600 40h220v6H600Z" fill="#1f4e9c" opacity=".5" />
        </>,
      );
    case "band":
      return svg(<path d="M0 140h856v12H0Z" fill="#2f6fae" />);
    case "wedge":
      return svg(
        <>
          <path d="M0 300l70 40-70 40Z" fill="#c8102e" />
          <path d="M0 0h856v540" stroke="#e2bf62" strokeOpacity=".25" strokeWidth="3" fill="none" />
          <path d="M520 0C640 120 700 330 856 400V0Z" fill="#fff" opacity=".04" />
        </>,
      );
    case "corner":
      return svg(<path d="M0 0h150L0 150Z" fill="#ff7a00" />);
  }
}

/** Contact chip, silver like the ones on Shetab cards. */
function Chip() {
  const id = React.useId();
  return (
    <svg aria-hidden viewBox="0 0 48 36" className="w-[12cqw]">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c7d2e2" />
          <stop offset=".45" stopColor="#f5f8fc" />
          <stop offset="1" stopColor="#8e9fb6" />
        </linearGradient>
      </defs>
      <rect x=".5" y=".5" width="47" height="35" rx="6" fill={`url(#${id})`} stroke="#6b7c93" strokeOpacity=".5" />
      <path d="M16 1v34M32 1v34M1 12h15M1 24h15M32 12h15M32 24h15M16 18h16" stroke="#6b7c93" strokeOpacity=".55" fill="none" />
    </svg>
  );
}

/** «۶۰۳۷ ۹۹•• •••• ۴۴۵۵» keeps the BIN and the last four, like a receipt. */
function cardGroups(digits: string, masked: boolean): string[] {
  const padded = digits.padEnd(16, "•");
  const shown = masked ? padded.slice(0, 6) + "••••••" + padded.slice(12) : padded;
  return fa(shown).match(/.{4}/g) ?? [];
}

export interface BankCardProps {
  /** Card number, Persian or Latin digits, spaces allowed. The bank is read from the first six digits. */
  number: string;
  /** Name printed on the card. */
  holder?: string;
  /** Expiry as printed, e.g. «1404/09». */
  expiry?: string;
  /** IBAN printed above the number, as on most Iranian cards. */
  sheba?: string;
  /** Force a bank by name («ملت», «سامان», …) instead of detecting it. */
  bank?: string;
  /** Your own logo, shown before the bank name. */
  logo?: React.ReactNode;
  /** A full card-face image (e.g. your bank's artwork). Replaces the drawn face. */
  image?: string;
  /** Text color to use with `image`. */
  ink?: string;
  /** Hide the middle six digits. */
  masked?: boolean;
  className?: string;
}

/**
 * A bank card face in the look of each Iranian bank's real card. Sizes itself
 * to its container (ID-1 ratio), and every label scales with the card width.
 */
export function BankCard({ number, holder, expiry, sheba, bank, logo, image, ink, masked = false, className }: BankCardProps) {
  const digits = normalizeCardNumber(number);
  const name = bank ?? cardBank(digits);
  const look = bankCardStyle(name);
  const color = ink ?? look.ink;
  const iban = sheba ? normalizeIban(sheba) : "";

  return (
    <div
      dir="rtl"
      role="img"
      aria-label={`${name ? bankLabel(name) : "کارت بانکی"}، شماره‌ی ${fa(digits)}${holder ? `، به نام ${holder}` : ""}`}
      className={cn("@container relative isolate aspect-[1.586/1] w-full select-none overflow-hidden rounded-[3.7%/5.9%] shadow-lg", className)}
      style={{ background: image ? `center / cover no-repeat url(${JSON.stringify(image)})` : look.background, color }}
    >
      {!image && look.pattern && <div aria-hidden className="absolute inset-0 -z-10" style={{ background: PATTERNS[look.pattern] }} />}
      {!image && look.art && <CardArt art={look.art} />}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.16)_48%,transparent_60%)]" />

      <div
        aria-hidden
        className="absolute inset-0 flex flex-col px-[7cqw] pb-[6cqw] pt-[6.5cqw]"
        style={look.lift && !image ? { textShadow: "0 1px 3px rgb(0 0 0 / 0.45)" } : undefined}
      >
        <div className="flex items-center gap-[2cqw] self-start text-[5.6cqw] font-bold leading-none" style={{ color: image ? color : look.accent, textShadow: "none" }}>
          {logo && <span className="flex size-[8cqw] items-center justify-center [&>*]:max-h-full [&>*]:max-w-full">{logo}</span>}
          {name ? bankLabel(name) : "کارت بانکی"}
        </div>

        <div className="mt-[5cqw] self-end">
          <Chip />
        </div>

        <div className="mt-auto space-y-[2.2cqw]">
          {iban && (
            <p dir="ltr" className="text-[3.3cqw] font-medium leading-none tabular-nums opacity-85">
              {fa(formatIban(iban))}
            </p>
          )}
          <div dir="ltr" className="flex justify-between text-[7.2cqw] font-bold leading-none tabular-nums">
            {cardGroups(digits, masked).map((part, i) => (
              <span key={i}>{part}</span>
            ))}
          </div>
          <div className="flex items-end justify-between gap-[3cqw] text-[3.8cqw] leading-tight">
            <span className="min-w-0 truncate font-bold">{holder || " "}</span>
            {expiry && (
              <span className="shrink-0 text-[3.2cqw]">
                <span className="opacity-75">تاریخ انقضا </span>
                <span dir="ltr" className="font-bold tabular-nums">{fa(expiry)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface CardToCardProps extends Omit<BankCardProps, "masked" | "className"> {
  /** Amount to pay in toman, shown with its own copy button. */
  amount?: number;
  /** Called with what was copied and its raw Latin value. */
  onCopy?: (field: "card" | "sheba" | "amount", value: string) => void;
  className?: string;
}

type Field = "card" | "sheba" | "amount";

/**
 * «کارت به کارت»: the payee's card in its bank colors, the account holder's
 * name to check against the banking app, and one-tap copy for the number,
 * the IBAN and the amount. Copies Latin digits, which every bank app accepts.
 */
export function CardToCard({ number, holder, expiry, sheba, bank, logo, image, ink, amount, onCopy, className }: CardToCardProps) {
  const [copied, setCopied] = React.useState<Field | null>(null);
  const digits = normalizeCardNumber(number);
  const iban = sheba ? normalizeIban(sheba) : "";

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy(field: Field, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      onCopy?.(field, value);
    } catch {
      // Clipboard can be blocked (insecure origin, iframe policy); the numbers stay selectable.
    }
  }

  const mark = (field: Field) => (copied === field ? <Check className="text-success" /> : <Copy />);

  return (
    <div
      dir="rtl"
      className={cn(
        "w-full max-w-sm space-y-4 rounded-surface border-line border-border bg-card p-4 text-card-foreground shadow-surface [--tw-border-style:var(--line-style)]",
        className,
      )}
    >
      <BankCard number={digits} holder={holder} expiry={expiry} sheba={iban || undefined} bank={bank} logo={logo} image={image} ink={ink} />

      {holder && (
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
          <span>
            قبل از تأیید انتقال، چک کنید اپ بانک اسم <b className="font-bold text-foreground">{holder}</b> را نشون بده.
          </span>
        </p>
      )}

      {amount !== undefined && (
        <Row label="مبلغ" value={formatToman(amount)} onCopy={() => copy("amount", String(amount))} mark={mark("amount")} copied={copied === "amount"} />
      )}
      {iban && (
        <Row label="شبا" value={fa(formatIban(iban))} ltr onCopy={() => copy("sheba", iban)} mark={mark("sheba")} copied={copied === "sheba"} />
      )}

      <Button variant="brand" className="w-full" onClick={() => copy("card", digits)} disabled={digits.length !== 16}>
        {mark("card")}
        {copied === "card" ? "شماره‌ی کارت کپی شد" : "کپی شماره‌ی کارت"}
      </Button>
    </div>
  );
}

function Row({ label, value, ltr, onCopy, mark, copied }: { label: string; value: string; ltr?: boolean; onCopy: () => void; mark: React.ReactNode; copied: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-field border-line border-border bg-muted/40 py-1.5 pe-1.5 ps-3 [--tw-border-style:var(--line-style)]">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className="min-w-0 flex-1 truncate text-end text-sm font-medium tabular-nums select-all">
        {value}
      </span>
      <Button variant="ghost" size="sm" className="size-8 shrink-0 px-0" onClick={onCopy} aria-label={copied ? `${label} کپی شد` : `کپی ${label}`}>
        {mark}
      </Button>
    </div>
  );
}
