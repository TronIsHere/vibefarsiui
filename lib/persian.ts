/**
 * Iranian-specific validation and formatting: mobile numbers, شبا (IBAN), کد ملی,
 * bank cards (with BIN → bank), and car plates (پلاک).
 * Dependency-free; accepts Persian or Latin digits everywhere.
 */
import { en, fa } from "./utils";

/* ---------- mobile ---------- */

/** Normalizes «۰۹۱۲…», «+98912…», «0098912…» to the 10-digit form «912…». */
export function normalizeIranMobile(input: string): string {
  let d = en(input).replace(/\D/g, "");
  if (d.startsWith("0098")) d = d.slice(4);
  else if (d.startsWith("98") && d.length > 10) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}

export function isIranMobile(input: string): boolean {
  return /^9\d{9}$/.test(normalizeIranMobile(input));
}

/** «912 345 6789» — three groups, always LTR. */
export function formatIranMobile(input: string): string {
  const d = normalizeIranMobile(input);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
}

const OPERATORS: [RegExp, string][] = [
  [/^(91\d|99[0-6])/, "همراه اول"],
  [/^(93[0-9]|90[1-5])/, "ایرانسل"],
  [/^92[0-2]/, "رایتل"],
  [/^998/, "شاتل موبایل"],
  [/^999/, "سامانتل"],
];

export function mobileOperator(input: string): string | null {
  const d = normalizeIranMobile(input);
  if (d.length < 3) return null;
  return OPERATORS.find(([re]) => re.test(d))?.[1] ?? null;
}

/* ---------- شبا / IBAN ---------- */

/** Keeps «IR» + up to 24 digits, upper-cased, digits normalized. */
export function normalizeIban(input: string): string {
  const raw = en(input).toUpperCase().replace(/[^0-9A-Z]/g, "");
  const digits = raw.replace(/^IR/, "").replace(/\D/g, "").slice(0, 24);
  return "IR" + digits;
}

/** Standard IBAN mod-97 check for IR accounts (IR + 24 digits). */
export function isIban(input: string): boolean {
  const iban = normalizeIban(input);
  if (!/^IR\d{24}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + "1827" + iban.slice(2, 4); // I=18, R=27
  let rem = 0;
  for (const ch of rearranged) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1;
}

/** «IR12 0170 0000 0010 2345 6789 01» */
export function formatIban(input: string): string {
  const iban = normalizeIban(input);
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

const BANKS: Record<string, string> = {
  "010": "بانک مرکزی", "011": "صنعت و معدن", "012": "ملت", "013": "رفاه کارگران", "014": "مسکن", "015": "سپه", "016": "کشاورزی",
  "017": "ملی", "018": "تجارت", "019": "صادرات", "020": "توسعه صادرات", "021": "پست بانک", "022": "توسعه تعاون", "051": "مؤسسه توسعه",
  "053": "کارآفرین", "054": "پارسیان", "055": "اقتصاد نوین", "056": "سامان", "057": "پاسارگاد", "058": "سرمایه", "059": "سینا",
  "060": "قرض‌الحسنه مهر ایران", "061": "شهر", "062": "آینده", "064": "گردشگری", "066": "دی", "069": "ایران زمین", "070": "رسالت",
  "078": "خاورمیانه", "079": "مؤسسه ملل",
};

/** Bank name from the 3-digit bank code inside the IBAN, or null. */
export function ibanBank(input: string): string | null {
  const iban = normalizeIban(input);
  if (iban.length < 7) return null;
  return BANKS[iban.slice(4, 7)] ?? null;
}

/** «ملت» → «بانک ملت»; names that already carry بانک/مؤسسه («پست بانک», «مؤسسه ملل») are left alone. */
export function bankLabel(name: string): string {
  return /بانک|مؤسسه/.test(name) ? name : `بانک ${name}`;
}

/* ---------- کد ملی ---------- */

/** Digits only (Persian accepted), capped at 10. Keep it a string: codes may start with 0. */
export function normalizeNationalId(input: string): string {
  return en(input).replace(/\D/g, "").slice(0, 10);
}

/** «۰۰۱-۲۳۴۵۶۷-۸» — the 3-6-1 grouping printed on the card. */
export function formatNationalId(input: string): string {
  const d = normalizeNationalId(input);
  return fa([d.slice(0, 3), d.slice(3, 9), d.slice(9, 10)].filter(Boolean).join("-"));
}

export function isNationalId(input: string): boolean {
  const d = en(input).replace(/\D/g, "");
  if (!/^\d{10}$/.test(d) || /^(\d)\1{9}$/.test(d)) return false;
  const check = Number(d[9]);
  const sum = d.slice(0, 9).split("").reduce((s, ch, i) => s + Number(ch) * (10 - i), 0);
  const r = sum % 11;
  return r < 2 ? check === r : check === 11 - r;
}

/* ---------- card ---------- */

/** 16 Latin digits at most; Persian digits, spaces and dashes are stripped. */
export function normalizeCardNumber(input: string): string {
  return en(input).replace(/\D/g, "").slice(0, 16);
}

/** «۶۰۳۷ ۹۹۱۱ ۲۲۳۳ ۴۴۵۵» — Persian digits, four groups. */
export function formatCardNumber(input: string): string {
  const d = normalizeCardNumber(input);
  return fa(d.replace(/(.{4})/g, "$1 ").trim());
}

/** First six digits (BIN / پیش‌شماره) of Iranian bank cards. Merged banks (انصار، قوامین، حکمت، مهر اقتصاد، کوثر) now issue under سپه. */
const CARD_BINS: Record<string, string> = {
  "603799": "ملی", "589210": "سپه", "627381": "سپه", "639599": "سپه", "636949": "سپه", "639370": "سپه", "505801": "سپه",
  "627648": "توسعه صادرات", "207177": "توسعه صادرات", "627961": "صنعت و معدن", "603770": "کشاورزی", "639217": "کشاورزی",
  "628023": "مسکن", "627760": "پست بانک", "502908": "توسعه تعاون", "627412": "اقتصاد نوین", "622106": "پارسیان", "639194": "پارسیان",
  "627884": "پارسیان", "502229": "پاسارگاد", "639347": "پاسارگاد", "627488": "کارآفرین", "502910": "کارآفرین", "621986": "سامان",
  "639346": "سینا", "639607": "سرمایه", "636214": "آینده", "502806": "شهر", "504706": "شهر", "502938": "دی", "603769": "صادرات",
  "610433": "ملت", "991975": "ملت", "627353": "تجارت", "585983": "تجارت", "589463": "رفاه کارگران", "504172": "رسالت",
  "606373": "قرض‌الحسنه مهر ایران", "628157": "مؤسسه توسعه", "505785": "ایران زمین", "505416": "گردشگری", "606256": "مؤسسه ملل",
  "585947": "خاورمیانه", "581874": "ایران‌ونزوئلا", "636795": "بانک مرکزی", "507677": "مؤسسه نور",
};

/** Bank name from the first six digits of the card, or null while fewer than six are typed / unknown. */
export function cardBank(input: string): string | null {
  const d = normalizeCardNumber(input);
  if (d.length < 6) return null;
  return CARD_BINS[d.slice(0, 6)] ?? null;
}

/** Luhn check for 16-digit bank cards. */
export function isCardNumber(input: string): boolean {
  const d = normalizeCardNumber(input);
  if (d.length !== 16) return false;
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let n = Number(d[i]);
    if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

/* ---------- پلاک خودرو ---------- */

export type PlateValue = { left: string; letter: string; middle: string; region: string };

export const EMPTY_PLATE: PlateValue = { left: "", letter: "", middle: "", region: "" };

/**
 * Letters that appear on Iranian car plates and what they stand for.
 * «شخصی» letters come first; the rest mark a vehicle class.
 */
export const PLATE_LETTERS: { letter: string; label: string }[] = [
  ...["ب", "ج", "د", "س", "ص", "ط", "ق", "ل", "م", "ن", "و", "ه", "ی"].map((letter) => ({ letter, label: "شخصی" })),
  { letter: "الف", label: "دولتی" },
  { letter: "ت", label: "تاکسی" },
  { letter: "ع", label: "حمل‌ونقل عمومی" },
  { letter: "ک", label: "کشاورزی" },
  { letter: "ژ", label: "جانبازان و معلولان" },
  { letter: "پ", label: "نیروی انتظامی" },
  { letter: "ث", label: "ارتش" },
  { letter: "ز", label: "وزارت دفاع" },
  { letter: "ش", label: "سپاه" },
  { letter: "ف", label: "ستاد کل نیروهای مسلح" },
  { letter: "گ", label: "گذر موقت" },
  { letter: "D", label: "دیپلماتیک" },
  { letter: "S", label: "کارکنان سفارت" },
];

const PLATE_LETTER_SET = new Set(PLATE_LETTERS.map((l) => l.letter));

/** Maps a typed key to a plate letter: Arabic ي/ك → ی/ک, «ا» → «الف», d/s → D/S. Null if not a plate letter. */
export function plateLetterFromKey(key: string): string | null {
  const k = key.replace("ي", "ی").replace("ك", "ک").replace(/^ا$/, "الف");
  const up = k.toUpperCase();
  if (PLATE_LETTER_SET.has(k)) return k;
  if (PLATE_LETTER_SET.has(up)) return up;
  return null;
}

/** All four parts filled: 2 digits, a known letter, 3 digits, 2 digits. */
export function isPlate(value: PlateValue): boolean {
  return /^\d{2}$/.test(value.left) && PLATE_LETTER_SET.has(value.letter) && /^\d{3}$/.test(value.middle) && /^\d{2}$/.test(value.region);
}

/** Canonical storage form «12ب345-11» (Latin digits). Empty parts stay empty. */
export function stringifyPlate(value: PlateValue): string {
  return `${value.left}${value.letter}${value.middle}${value.region ? "-" + value.region : ""}`;
}

/** Parses «12ب345-11», «۱۲ ب ۳۴۵ ایران ۱۱» or «12 الف 345 11». Missing parts come back empty. */
export function parsePlate(input: string): PlateValue {
  const s = en(input).replace(/ایران/g, " ").replace(/[\s\-_/]+/g, "");
  const m = /^(\d{0,2})(الف|[^\d]?)(\d{0,3})(\d{0,2})$/.exec(s);
  if (!m) return { ...EMPTY_PLATE };
  const letter = m[2] ? (plateLetterFromKey(m[2]) ?? "") : "";
  return { left: m[1], letter, middle: m[3], region: m[4] };
}

/** Display form «۱۲ ب ۳۴۵ ایران ۱۱». */
export function formatPlate(value: PlateValue): string {
  if (!value.left && !value.letter && !value.middle && !value.region) return "";
  return `${fa(value.left)} ${value.letter} ${fa(value.middle)} ایران ${fa(value.region)}`.replace(/\s+/g, " ").trim();
}

/* ---------- postal code ---------- */

/** Up to 10 Latin digits from «۸۱۶۳۸-۴۷۳۵۱», «8163847351» or a pasted address line. */
export function normalizePostalCode(input: string): string {
  return en(input).replace(/\D/g, "").slice(0, 10);
}

/** «۸۱۶۳۸-۴۷۳۵۱»: two groups of five, the way it's printed on bills. */
export function formatPostalCode(input: string): string {
  const d = normalizePostalCode(input);
  return fa(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
}

/** Ten digits and not one digit repeated (0000000000). Iran Post publishes no checksum. */
export function isPostalCode(input: string): boolean {
  const d = normalizePostalCode(input);
  return d.length === 10 && !/^(\d)\1{9}$/.test(d);
}

/* ---------- relative time ---------- */

/** «همین حالا»، «۵ دقیقه پیش»، «۳ ساعت پیش»، «دیروز»، «۴ روز پیش» */
export function timeAgo(date: Date, now = new Date()): string {
  const s = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (s < 60) return "همین حالا";
  const m = Math.round(s / 60);
  if (m < 60) return `${fa(m)} دقیقه پیش`;
  const h = Math.round(m / 60);
  if (h < 24) return `${fa(h)} ساعت پیش`;
  const d = Math.round(h / 24);
  if (d === 1) return "دیروز";
  if (d < 30) return `${fa(d)} روز پیش`;
  const mo = Math.round(d / 30);
  return mo < 12 ? `${fa(mo)} ماه پیش` : `${fa(Math.round(mo / 12))} سال پیش`;
}
