import type { DocBase } from "./types";

/** Shared helpers the registry depends on. Not shown as docs pages; served at /r/lib/*.json */
export const libs: DocBase[] = [
  {
    slug: "utils",
    name: "ابزارهای فارسی",
    desc: "اعداد فارسی، تومان، درصد، حجم فایل و اتصال کلاس‌ها. تقریباً هر کامپوننتی به این فایل نیاز داره.",
    file: "lib/utils.ts",
    usage: `import { cn, fa, faNumber, formatToman, faPercent, faFileSize, en } from "@/lib/utils"

formatToman(1_250_000) // ۱٬۲۵۰٬۰۰۰ تومان
fa(1405)               // ۱۴۰۵`,
    promptBullets: [
      "fa converts Latin digits to Persian; faNumber adds the thousands separator «٬»; formatToman puts the unit after the number.",
      "en parses user input (Persian or Arabic-Indic digits to Latin). cn concatenates classes with no clsx dependency.",
      "Never show Latin digits in Persian UI copy; keep Latin digits in URLs and form values.",
    ],
  },
  {
    slug: "jalali",
    name: "تقویم شمسی",
    desc: "تبدیل میلادی به شمسی و برعکس، نام ماه و روز هفته، بدون وابستگی. پیش‌نیاز تقویم و خط زمانه.",
    file: "lib/jalali.ts",
    usage: `import { toJalali, toGregorian, JALALI_MONTHS, JALALI_WEEKDAYS } from "@/lib/jalali"

const { jy, jm, jd } = toJalali(new Date())
JALALI_WEEKDAYS[0] // شنبه`,
    promptBullets: [
      "Week starts on Saturday, not Monday. Charts and calendars must follow that.",
      "toJalali / toGregorian with no date library. Valid years 1 to 3177.",
      "Take month and weekday names from this file; do not translate them.",
    ],
  },
  {
    slug: "persian",
    name: "اعتبارسنجی ایرانی",
    desc: "اعتبارسنجی موبایل، شبا، کد ملی و شماره‌ی کارت با جدول بانک‌ها، پلاک خودرو و زمان نسبی. پیش‌نیاز فیلدهای ایرانیه.",
    file: "lib/persian.ts",
    usage: `import { isNationalId, cardBank, isIban, ibanBank, parsePlate, formatPlate } from "@/lib/persian"

isNationalId("0499370899") // true
cardBank("6037 9911")      // ملی
formatPlate(parsePlate("12ب345-11")) // ۱۲ ب ۳۴۵ ایران ۱۱`,
    promptBullets: [
      "Every function accepts Persian or Latin digits; normalize with en() before validating.",
      "Bank names come from two tables: IBAN bank code (digits 5–7) and card BIN (first 6 digits); bankLabel() adds «بانک» unless the name already has it.",
      "Plate helpers: PLATE_LETTERS with class labels, parsePlate / stringifyPlate («12ب345-11») / formatPlate («۱۲ ب ۳۴۵ ایران ۱۱»).",
    ],
  },
  {
    slug: "iran-divisions",
    name: "استان‌ها و شهرها",
    desc: "۳۱ استان ایران با مراکز شهرستان و شهرهای بزرگ‌ترشون، مرکز استان اول. پیش‌نیاز انتخاب‌گر استان و شهره.",
    file: "lib/iran-divisions.ts",
    usage: `import { PROVINCES, PROVINCE_NAMES, citiesOf, provincesOf } from "@/lib/iran-divisions"

citiesOf("اصفهان")[0]    // اصفهان
provincesOf("حاجی‌آباد") // ["خراسان جنوبی", "هرمزگان"]`,
    promptBullets: [
      "31 provinces sorted with Intl.Collator(\"fa\"); each has name, capital and cities with the capital first.",
      "Names use Persian ی/ک and ZWNJ («علی‌آباد کتول»); store the names, not ids, so they read well in orders and invoices.",
      "Province and city always come from this list in forms, never free text.",
    ],
  },
  {
    slug: "chart-utils",
    name: "ریاضی نمودار",
    desc: "تیک‌های گرد، مقیاس راست‌به‌چپ، انباشتن سری‌ها، منحنی بدون بیرون‌زدگی، کمان، نقشه‌ی درختی و برچسب شمسی. پیش‌نیاز همه‌ی نمودارهاست.",
    file: "lib/chart-utils.ts",
    registryDeps: ["utils", "jalali"],
    usage: `import { niceTicks, compactFa, percentFa, linePath, squarify } from "@/lib/chart-utils"

niceTicks(0, 87).ticks // [0, 20, 40, 60, 80, 100]
compactFa(12_500_000)  // ۱۲٫۵ میلیون
percentFa(42.5, 1)     // ۴۲٫۵٪`,
    promptBullets: [
      "niceTicks picks steps of 1, 2, 2.5 or 5 × 10ⁿ and keeps 0 in range when data crosses it.",
      "bandScale and pointScale put index 0 on the right edge; stackRows stacks positives and negatives away from zero; linePath supports linear, monotone (Fritsch–Carlson) and step.",
      "compactFa uses هزار/میلیون/میلیارد with «٫» decimals; jalaliLabel turns a Date into «۱۲ مهر» or «مهر ۱۴۰۵».",
    ],
  },
  {
    slug: "number-to-words",
    name: "عدد به حروف",
    desc: "۱٬۲۵۰٬۰۰۰ را به «یک میلیون و دویست و پنجاه هزار تومان» تبدیل می‌کنه، برای فاکتور، چک و تأیید پرداخت.",
    file: "lib/number-to-words.ts",
    usage: `import { numberToWords, tomanToWords, rialToWords } from "@/lib/number-to-words"

tomanToWords(1_250_000) // یک میلیون و دویست و پنجاه هزار تومان
numberToWords("۱۴۰۵")   // هزار و چهارصد و پنج`,
    promptBullets: [
      "Groups of three digits with scales هزار، میلیون، میلیارد، تریلیون; join groups with « و »; «هزار» alone for 1000, «یک میلیون» for 1e6.",
      "Accept number, bigint, or a string with Persian digits and «٬» separators; negative → «منفی»; decimals → «ممیز» then digit by digit.",
      "amountToWords(n, unit) appends the unit; tomanToWords and rialToWords are shortcuts.",
    ],
  },
  {
    slug: "svg-text-path-rtl",
    name: "متن روی مسیر SVG",
    desc: "شکل‌دهی حروف عربی/فارسی به فرم‌های نمایشی و ترتیب بصری LTR برای <textPath>؛ لازم برای حلقه‌ی متن و متن خمیده در سافاری.",
    file: "lib/svg-text-path-rtl.ts",
    usage: `import { forSvgTextPath } from "@/lib/svg-text-path-rtl"

// Paint under style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
forSvgTextPath("وایب‌فارسی · MCP")`,
    promptBullets: [
      "Safari/WebKit does not shape or bidi Arabic on SVG textPath; reshape to presentation forms then emit RTL-base visual order via forSvgTextPath.",
      "Prefer laying glyphs with getPointAtLength instead of <textPath> (also avoids Safari's negative startOffset bug).",
      "measureGlyphWidths uses getExtentOfChar on a hidden SVG text node so advances match the painted font.",
    ],
  },
  {
    slug: "float",
    name: "لایه‌ی شناور",
    desc: "پورتال position:fixed برای پاپ‌آور، منو و کمبوباکس تا overflow:hidden آن‌ها را نبرد.",
    file: "lib/float.tsx",
    usage: `import { useFloat, FloatPortal } from "@/lib/float"

const root = useRef<HTMLDivElement>(null)
const { mounted, style, theme, panel } = useFloat(open, root)
return (
  <div ref={root}>
    <button onClick={() => setOpen((o) => !o)}>باز</button>
    <FloatPortal open={open} mounted={mounted} style={style} theme={theme} panelRef={panel} className="fixed z-50 …">
      …
    </FloatPortal>
  </div>
)`,
    promptBullets: [
      "Portal the panel into document.body with position:fixed from getBoundingClientRect so overflow:hidden ancestors cannot clip it.",
      "Copy data-theme from the trigger so a themed preview still colors the panel.",
      "Flip to the opposite side when the panel would go past the viewport; matchWidth for combobox lists.",
    ],
  },
];
