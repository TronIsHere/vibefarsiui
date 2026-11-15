import type { ComponentDoc } from "./types";
import { generalComponents } from "./components-general";

const ui = (slug: string) => `registry/ui/${slug}.tsx`;

/** The AI chat kit: everything around `prompt-input` that a Persian chat screen needs. */
const aiComponents: ComponentDoc[] = [
  {
    slug: "chat-message", name: "پیام چت", cat: "ai", file: ui("chat-message"), wide: true, deps: ["lucide-react"],
    desc: "پیام کاربر و پاسخ دستیار با ساعت، حالت در حال نوشتن و خطا، ردیف کپی و بازخورد، و رشته‌ی گفت‌وگویی که خودش دنبال پیام جدید اسکرول میشه.",
    usage: `import { ChatMessage, ChatThread, MessageActions } from "@/components/ui/chat-message"
import { Markdown } from "@/components/ui/markdown"
import { Sparkles } from "lucide-react"

<ChatThread className="h-[32rem] p-4">
  <ChatMessage role="user" time={new Date()}>فاکتور شمسی را چطور بسازم؟</ChatMessage>
  <ChatMessage
    role="assistant"
    name="دستیار دکان"
    avatar={<Sparkles />}
    status={streaming ? "streaming" : undefined}
    actions={<MessageActions text={answer} onRegenerate={regenerate} onFeedback={sendFeedback} />}
  >
    <Markdown streaming={streaming}>{answer}</Markdown>
  </ChatMessage>
</ChatThread>`,
    props: [
      { name: "role", type: '"user" | "assistant"', desc: "پیام کاربر حباب داره و سمت راست می‌نشینه. پاسخ دستیار متن ساده‌ست که کل ستون را می‌گیره." },
      { name: "status", type: '"streaming" | "error"', desc: "streaming پیام را برای صفحه‌خوان مشغول علامت می‌زنه و ردیف عمل‌ها را پنهان می‌کنه. error جعبه‌ی «تلاش دوباره» را نشون میده." },
      { name: "actions", type: "ReactNode", desc: "ردیف زیر پاسخ که معمولاً MessageActions در اون قرار می‌گیره." },
      { name: "follow", type: "boolean", default: "true", desc: "مال ChatThread است. تا وقتی پایین گفت‌وگو هستید، با هر متن جدید اسکرول میشه و اگه بالا برید دیگه مزاحم نمیشه." },
    ],
    notes: [
      "پاسخ دستیار عمداً حباب نداره، چون پاراگراف بلند فارسی، جدول و بلوک کد داخل حباب تنگ میشن.",
      "ChatThread نقش log و aria-live داره، پس صفحه‌خوان پیام تازه را خودش می‌خونه. موقع استریم طولانی بهتره متن کامل را یک‌جا اعلام کنید.",
    ],
    promptBullets: [
      "User message: a secondary-colored bubble at the inline-start with dir=auto and pre-wrap; assistant message: avatar, name and time, then unboxed content across the column.",
      "status=streaming sets aria-busy and hides the actions; status=error renders a role=alert box with a retry button.",
      "MessageActions: copy (with a role=status announcement), regenerate, and thumbs up/down toggles with aria-pressed.",
      "ChatThread is role=log with aria-live=polite; a MutationObserver keeps it pinned to the bottom only while the reader is within 48px of it.",
    ],
  },
  {
    slug: "markdown", name: "مارک‌داون", cat: "ai", file: ui("markdown"), wide: "full", registryDeps: ["code-block"],
    desc: "نمایش خروجی مدل وقتی فارسی، انگلیسی و کد قاطی هستن. جهت هر پاراگراف جدا حساب میشه، کد همیشه چپ‌چین می‌مونه و وسط استریم هم به‌هم نمی‌ریزه.",
    usage: `import { Markdown } from "@/components/ui/markdown"

<Markdown streaming={isStreaming}>{answer}</Markdown>`,
    props: [
      { name: "children", type: "string", desc: "متن مارک‌داون. تیتر، فهرست، فهرست کار، نقل‌قول، جدول، لینک، کد درون‌خطی و بلوک کد را می‌شناسه." },
      { name: "streaming", type: "boolean", desc: "یک نشانگر نرم بعد از آخرین بلوک می‌گذاره تا معلوم باشه مدل هنوز می‌نویسه." },
      { name: "dir", type: '"rtl" | "ltr"', default: '"rtl"', desc: "جهت بلوک‌هایی که هیچ حرفی ندارن، مثل یک خط عدد." },
    ],
    notes: [
      "چرا dir=\"auto\" کافی نیست؟ چون فقط اولین حرف را نگاه می‌کنه و جمله‌ای مثل «React یک کتابخانه است» را چپ‌چین می‌کنه. تابع textDir حروف فارسی و لاتین را می‌شمره و بعد تصمیم می‌گیره.",
      "کد درون‌خطی داخل bdi با جهت ltr می‌آد تا نقطه و پرانتزش وسط جمله‌ی فارسی جابه‌جا نشه.",
      "HTML خام رندر نمیشه و لینک‌ها فقط با http، https، mailto، tel، / و # باز میشن، پس خروجی مدل نمی‌تونه اسکریپت تزریق کنه.",
      "پارسر وابستگی نداره و برای خروجی مدل ساخته شده، نه برای کل استاندارد CommonMark. اگه پانویس یا HTML لازم دارید، یک کتابخانه‌ی کامل بگذارید و فقط textDir را نگه دارید.",
    ],
    promptBullets: [
      "A dependency-free block parser (headings, paragraphs, fenced code, blockquote, ordered/unordered/task lists, tables, hr) that tolerates an unclosed fence mid-stream.",
      "Per-block direction from a letter count (RTL letters ≥ 30% of Latin letters → rtl), not dir=auto; inline code wrapped in <bdi dir=ltr>; fenced code rendered by CodeBlock, always LTR.",
      "Ordered lists use list-style-type: persian in RTL blocks; tables scroll horizontally with text-start headers; links are scheme-checked and external ones open with rel=noopener.",
      "No raw HTML is ever rendered; a soft caret follows the last block while streaming.",
    ],
  },
  {
    slug: "code-block", name: "بلوک کد", cat: "ai", file: ui("code-block"), wide: "full", deps: ["lucide-react"],
    desc: "بلوک کد با اسم فایل یا زبان، دکمه‌ی کپی، شماره‌ی خط و خط‌های برجسته، که در صفحه‌ی راست‌چین هم همیشه چپ‌چین می‌مونه.",
    usage: `import { CodeBlock } from "@/components/ui/code-block"

<CodeBlock
  filename="app/layout.tsx"
  lineNumbers
  highlight={[3]}
  code={\`export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}\`}
/>`,
    props: [
      { name: "code", type: "string", desc: "متن کد. همین متن کپی میشه." },
      { name: "filename / language", type: "string", desc: "عنوان سربرگ. اگه هر دو را بدید، اسم فایل نشون داده میشه." },
      { name: "highlight", type: "number[]", desc: "شماره‌ی خط‌هایی که باید رنگی بشن، از ۱." },
      { name: "children", type: "ReactNode", desc: "خروجی رنگ‌شده‌ی یک هایلایتر مثل shiki. اگه بدید، به‌جای متن ساده نشون داده میشه." },
    ],
    notes: ["هایلایتر داخلش نیست تا وابستگی نداشته باشه. خروجی shiki یا هر هایلایتر دیگه را به‌شکل children بهش بدید."],
    promptBullets: [
      "A <figure dir=ltr> with a header (filename or language in mono, copy button) and a focusable, scrollable <pre>.",
      "Optional line numbers (aria-hidden, non-selectable) and highlighted lines with a brand tint and an inset start bar.",
      "Copy writes the raw code and swaps the label to «کپی شد» in an aria-live span for two seconds.",
    ],
  },
  {
    slug: "tool-call", name: "فراخوانی ابزار", cat: "ai", file: ui("tool-call"), wide: "full", deps: ["lucide-react"],
    desc: "کارت اجرای یک ابزار توسط ایجنت با اسم فارسی و اسم تابع، وضعیت در صف تا ناموفق، زمان اجرا و ورودی و خروجی خام که باز و بسته میشه.",
    usage: `import { ToolCall, ToolCallGroup } from "@/components/ui/tool-call"

<ToolCallGroup>
  <ToolCall name="search_orders" label="جست‌وجو در سفارش‌ها" status="success" duration={1240} input={{ phone: "09121234567" }} output={{ count: 3 }} />
  <ToolCall name="send_sms" label="ارسال پیامک" status="running" />
</ToolCallGroup>`,
    props: [
      { name: "status", type: '"pending" | "running" | "success" | "error"', desc: "وضعیت اجرا که با آیکون، رنگ و متن فارسی نشون داده میشه." },
      { name: "label", type: "string", desc: "توضیح فارسی کار ابزار. اسم تابع زیرش با فونت مونو می‌آد." },
      { name: "input / output", type: "unknown", desc: "ورودی و خروجی. شیء به شکل JSON چاپ میشه و رشته همون‌طور که هست." },
      { name: "duration", type: "number", desc: "زمان اجرا به میلی‌ثانیه که به شکل «۱٫۲ ثانیه» نشون داده میشه." },
    ],
    notes: ["برای کاربر عادی label را بدید چون search_orders براش معنی نداره. اسم تابع برای توسعه‌دهنده زیرش می‌مونه."],
    promptBullets: [
      "Header button (aria-expanded, aria-controls) with an icon tile, Persian label over an ltr mono function name, and a status with icon + text + duration.",
      "Body is a grid-rows disclosure with «ورودی» and «خروجی» as ltr <pre> blocks (JSON.stringify with 2 spaces) and a role=alert error line.",
      "Status is never color alone: spinner for running, check for success, X for error, dashed circle for pending.",
    ],
  },
  {
    slug: "sources", name: "منابع و ارجاع", cat: "ai", file: ui("sources"), wide: "full", deps: ["lucide-react"],
    desc: "فهرست شماره‌دار منابع یک پاسخ با تیتر، جمله‌ی شاهد و دامنه، به‌همراه نشان کوچک شماره که وسط متن بعد از هر ادعا می‌گذارید.",
    usage: `import { Citation, Sources } from "@/components/ui/sources"

const sources = [
  { title: "راهنمای سامانه‌ی مودیان", url: "https://tp.tax.gov.ir/help", snippet: "صورت‌حساب الکترونیکی باید ظرف ۳۰ روز ارسال شود." },
]

<p>مهلت ارسال صورت‌حساب ۳۰ روز است<Citation index={1} source={sources[0]} />.</p>
<Sources sources={sources} collapsible />`,
    props: [
      { name: "sources", type: "{ title; url; snippet?; icon? }[]", desc: "منبع‌ها به ترتیب شماره." },
      { name: "variant", type: '"list" | "chips"', default: '"list"', desc: "list تیتر و جمله‌ی شاهد را نشون میده و chips فقط شماره و دامنه را." },
      { name: "collapsible", type: "boolean", desc: "منابع را پشت یک دکمه‌ی «۴ منبع» جمع می‌کنه." },
    ],
    notes: ["تیتر منبع dir=\"auto\" داره چون ممکنه انگلیسی باشه، و دامنه همیشه داخل bdi چپ‌چین می‌مونه."],
    promptBullets: [
      "Citation is an inline numbered pill (Persian digit) linking to the source in a new tab, with an aria-label that reads the source title.",
      "Sources is an ordered list: number, title (dir=auto, two-line clamp), optional snippet, and the host in <bdi dir=ltr> next to a favicon slot.",
      "Collapsible mode: a pill button with stacked favicons and «۴ منبع», opening a grid-rows disclosure.",
    ],
  },
  {
    slug: "model-picker", name: "انتخاب مدل", cat: "ai", file: ui("model-picker"), wide: true, deps: ["lucide-react"], registryDeps: ["float"],
    desc: "دکمه‌ی کوچک انتخاب مدل برای نوار ابزار جعبه‌ی پرامپت، با فهرستی که برای هر مدل یک خط توضیح و یک برچسب داره و مدل‌های قفل را هم نشون میده.",
    usage: `import { ModelPicker } from "@/components/ui/model-picker"
import { PromptInput } from "@/components/ui/prompt-input"

<PromptInput
  tools={
    <ModelPicker
      value={model}
      onChange={setModel}
      models={[
        { id: "fast", name: "سریع", description: "برای پرسش‌های روزمره", badge: "پیش‌فرض" },
        { id: "deep", name: "دقیق", description: "برای تحلیل و کد" },
        { id: "max", name: "حرفه‌ای", disabled: true, disabledReason: "در پلن حرفه‌ای" },
      ]}
    />
  }
/>`,
    props: [
      { name: "models", type: "{ id; name; description?; badge?; icon?; disabled?; disabledReason? }[]", desc: "فهرست مدل‌ها. مدل disabled دیده میشه ولی انتخاب نمیشه و دلیلش به‌جای توضیح می‌آد." },
      { name: "side", type: '"top" | "bottom"', default: '"top"', desc: "جهت باز شدن فهرست. اگه جا نباشه خودش برمی‌گرده." },
      { name: "size", type: '"sm" | "md"', default: '"sm"', desc: "sm برای نوار ابزار، md با حاشیه برای فرم تنظیمات." },
      { name: "ModelList", type: "component", desc: "همین فهرست، همیشه باز و بدون دکمه. برای صفحه‌ی تنظیمات یا مرحله‌ی انتخاب مدل؛ همون models و value و onChange را می‌گیره." },
    ],
    promptBullets: [
      "Also export ModelList: the same option rows as an always-open, focusable role=listbox for settings pages, sharing the keyboard handling with the popover.",
      "Trigger button with aria-haspopup=listbox and aria-expanded; the panel is a portaled role=listbox positioned with fixed coordinates so composer overflow cannot clip it.",
      "Keyboard: ArrowUp/Down skip disabled options, Home/End, Enter or Space select, Escape closes and returns focus; aria-activedescendant tracks the active option.",
      "Each option: name in <bdi>, a brand-tinted badge, one description line, a check on the selected one; disabled options show the reason instead.",
    ],
  },
];

/** Iran-specific inputs and displays beyond the first batch (national id, card, plate, …). */
const persianComponents: ComponentDoc[] = [
  {
    slug: "wheel-date-picker", name: "تاریخ چرخشی", cat: "form", file: ui("wheel-date-picker"), registryDeps: ["jalali"],
    desc: "انتخاب تاریخ شمسی با سه چرخ روز، ماه و سال، همون چیزی که اپ‌های ایرانی برای تاریخ تولد و نوبت دارن. با لمس، ماوس و کیبورد کار می‌کنه.",
    usage: `import { WheelDatePicker } from "@/components/ui/wheel-date-picker"

<WheelDatePicker value={date} onChange={setDate} minYear={1320} maxYear={1405} />`,
    props: [
      { name: "value / defaultValue", type: "Date | null", desc: "تاریخ میلادی. اگه خالی باشه چرخ‌ها روی امروز می‌ایستن." },
      { name: "onChange", type: "(date: Date) => void", desc: "با هر جابه‌جایی چرخ صدا زده میشه." },
      { name: "minYear / maxYear", type: "number", desc: "اولین و آخرین سال شمسی چرخ سال. پیش‌فرض از صد سال پیش تا پنج سال بعده." },
    ],
    notes: [
      "چرخ روز برای ماه‌های ۳۰ روزه و اسفند غیرکبیسه کوتاه میشه. اگه روی ۳۱ باشید و ماه را عوض کنید، خودش به آخرین روز اون ماه میره.",
      "WheelPicker جدا هم export شده و می‌تونید باهاش چرخ ساعت و دقیقه یا هر فهرست دیگه‌ای بسازید.",
      "داخل یک Sheet با side=\"bottom\" بگذاریدش تا همون حس اپ موبایل را بده.",
    ],
    promptBullets: [
      "Three scroll-snap columns in RTL order: day (right), month names, year (left); a fixed center band marks the selected row and a mask fades the edges.",
      "Each column is a focusable role=listbox with aria-activedescendant; ArrowUp/Down, PageUp/Down, Home and End change the value; the scroll position syncs back from the value.",
      "Day count follows jalaliMonthLength(year, month) and the day clamps when the month or year changes; a polite live line reads the full date with weekday.",
    ],
  },
  {
    slug: "birthday-picker", name: "تاریخ تولد", cat: "form", file: ui("birthday-picker"), registryDeps: ["select", "jalali"],
    desc: "تاریخ تولد شمسی با سه فهرست روز، ماه و سال که روزهای نامعتبر را می‌بنده، سن را همون لحظه نشون میده و حداقل سن را هم بررسی می‌کنه.",
    usage: `import { BirthdayPicker } from "@/components/ui/birthday-picker"

<BirthdayPicker name="birthday" minAge={18} onChange={(date, age) => setBirthday(date)} />`,
    props: [
      { name: "onChange", type: "(date: Date | null, age: number | null) => void", desc: "تا وقتی تاریخ کامل و معتبر نشده، date برابر null است." },
      { name: "minAge", type: "number", default: "0", desc: "حداقل سن به سال کامل. کمتر از اون خطا میده." },
      { name: "name", type: "string", desc: "اسم فیلد فرم. تاریخ میلادی به شکل YYYY-MM-DD فرستاده میشه." },
    ],
    notes: ["برای تاریخ تولد تقویم نگذارید، چون کسی حوصله نداره چهل سال را ماه‌به‌ماه عقب بره. سه فهرست بومی روی موبایل هم چرخ خود سیستم را باز می‌کنن.", "تابع jalaliAge سن را با تقویم شمسی حساب می‌کنه، پس روز تولد با تقویم خود کاربر جور درمی‌آد."],
    promptBullets: [
      "Three native selects in a fieldset (روز، ماه، سال); days beyond the month length are disabled, including اسفند in non-leap years.",
      "Age counted on the Jalali calendar and shown in an aria-live hint («۲۸ ساله»); errors for an impossible day, a future date and an age under minAge.",
      "A hidden input submits the Gregorian date as YYYY-MM-DD.",
    ],
  },
  {
    slug: "bill-input", name: "شناسه‌ی قبض", cat: "form", file: ui("bill-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "شناسه‌ی قبض و شناسه‌ی پرداخت با اعتبارسنجی رقم کنترل، که نوع قبض و مبلغ را از خود عددها درمی‌آره و قبل از پرداخت نشون میده.",
    usage: `import { BillInput } from "@/components/ui/bill-input"

<BillInput onChange={(value, { valid, type, amount }) => valid && setBill({ ...value, amount })} />`,
    props: [
      { name: "onChange", type: "(value, info) => void", desc: "value شامل billId و paymentId است و info شامل valid، type (مثل «برق») و amount به تومان." },
    ],
    notes: [
      "نوع قبض از رقم یکی مونده به آخر شناسه‌ی قبض خونده میشه و مبلغ از شناسه‌ی پرداخت بدون پنج رقم آخر، ضرب در هزار ریال.",
      "رقم آخر شناسه‌ی پرداخت هر دو شناسه را با هم کنترل می‌کنه، پس شناسه‌ی پرداخت یک قبض دیگه رد میشه.",
      "این فقط بررسی شکل شناسه‌ست. پرداخت‌شده بودن قبض را باید از سرویس پرداخت‌تون بپرسید.",
    ],
    promptBullets: [
      "Two ltr mono numeric fields, up to 13 digits each, accepting Persian digits; errors appear only once at least 6 digits are typed.",
      "Bill check digit: weights 2..7 from the right, mod 11 (remainder < 2 → 0, else 11 − remainder); payment id has one check on itself and one on bill + payment.",
      "Bill kind from the digit before the check digit (آب، برق، گاز، تلفن ثابت، تلفن همراه، عوارض شهرداری، مالیات، جریمه); a summary card with icon, kind and amount in تومان in an aria-live region.",
    ],
  },
  {
    slug: "legal-id-input", name: "شناسه‌ی ملی", cat: "form", file: ui("legal-id-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "شناسه‌ی ملی ۱۱ رقمی شرکت‌ها و سازمان‌ها با بررسی رقم کنترل، برای فرم فاکتور رسمی و ثبت‌نام حقوقی.",
    usage: `import { LegalIdInput } from "@/components/ui/legal-id-input"

<LegalIdInput onChange={(id, valid) => setCompanyId(valid ? id : null)} />`,
    props: [{ name: "onChange", type: "(id, valid) => void", desc: "یازده رقم لاتین و نتیجه‌ی اعتبارسنجی." }],
    notes: ["با کد ملی اشتباه نگیرید. کد ملی ۱۰ رقمی و مال اشخاص حقیقیه و کامپوننتش national-id-input است."],
    promptBullets: [
      "11 digits, ltr mono with a building icon; Persian digits accepted and normalized.",
      "Check: add (tenth digit + 2) to each of the first ten digits, multiply by weights 29, 27, 23, 19, 17 repeated, sum mod 11 (10 → 0) must equal the last digit.",
      "Error only when all 11 digits are present; the hint is linked with aria-describedby.",
    ],
  },
  {
    slug: "installment-calculator", name: "محاسبه‌گر اقساط", cat: "data", file: ui("installment-calculator"), wide: true, registryDeps: ["slider"],
    desc: "محاسبه‌ی قسط ماهانه با اسلایدر پیش‌پرداخت و انتخاب مدت، که مبلغ تسهیلات، سود کل دوره و جمع پرداختی را هم نشون میده.",
    usage: `import { InstallmentCalculator } from "@/components/ui/installment-calculator"

<InstallmentCalculator
  price={48_000_000}
  terms={[6, 12, 18, 24]}
  rate={(months) => (months <= 12 ? 23 : 26)}
  onChange={(plan) => setPlan(plan)}
/>`,
    props: [
      { name: "price", type: "number", desc: "قیمت نقدی به تومان." },
      { name: "rate", type: "number | (months) => number", default: "23", desc: "نرخ سود سالانه به درصد. با تابع می‌تونید برای مدت‌های بلندتر نرخ بیشتری بدید." },
      { name: "minDownPayment / maxDownPayment", type: "number", default: "0.2 / 0.8", desc: "کف و سقف پیش‌پرداخت به‌شکل سهمی از قیمت." },
      { name: "onChange", type: "(plan) => void", desc: "plan شامل principal، monthly، total، interest و months است." },
    ],
    notes: ["فرمول همون قسط مساوی بانک‌هاست و هر قسط به هزار تومان بالا گرد میشه. تابع calculateInstallments هم export شده تا سمت سرور همین عدد را دوباره حساب کنید."],
    promptBullets: [
      "Equal instalments on a reducing balance: P·r·(1+r)^n / ((1+r)^n − 1) with r = yearly rate / 1200; zero rate divides evenly; each instalment rounded up to 1,000 toman.",
      "Down payment Slider in 5% steps showing both the toman amount and the percent; terms as radio chips («۱۲ ماهه»).",
      "Result box in an aria-live region: the monthly instalment large, then financed amount, yearly rate, total interest and total paid.",
    ],
  },
  {
    slug: "currency-toggle", name: "تومان و ریال", cat: "display", file: ui("currency-toggle"),
    desc: "کلید جابه‌جایی بین تومان و ریال که همه‌ی مبلغ‌های صفحه را با هم عوض می‌کنه و انتخاب کاربر را هم یادش می‌مونه.",
    usage: `import { CurrencyProvider, CurrencyToggle, Money } from "@/components/ui/currency-toggle"

<CurrencyProvider>
  <CurrencyToggle />
  <Money amount={12_450_000} />
</CurrencyProvider>`,
    props: [
      { name: "amount", type: "number", desc: "مال Money است. مبلغ همیشه به تومان داده میشه و ریال ده برابرش حساب میشه." },
      { name: "defaultUnit", type: '"toman" | "rial"', default: '"toman"', desc: "مال CurrencyProvider است. واحد سمت سرور و قبل از اولین انتخاب." },
      { name: "persist", type: "boolean", default: "true", desc: "انتخاب را در localStorage نگه می‌داره." },
    ],
    notes: [
      "مبلغ را همیشه به یک واحد ذخیره کنید و فقط موقع نمایش تبدیل کنید. این‌جا واحد پایه تومانه.",
      "مردم قیمت را به تومان میگن ولی فاکتور رسمی، رسید بانک و سامانه‌ی مودیان به ریال هستن. برای همین اپ‌های حسابداری و فروشگاهی این کلید را دارن.",
    ],
    promptBullets: [
      "A context provider holding \"toman\" | \"rial\"; Money renders faNumber(amount × 1 or × 10) with the unit word after the number.",
      "Persistence through useSyncExternalStore over localStorage with a server snapshot, so hydration matches and tabs stay in sync.",
      "The toggle is a two-option radiogroup with roving tabindex and arrow keys.",
    ],
  },
  {
    slug: "relative-time", name: "زمان نسبی", cat: "display", file: ui("relative-time"), registryDeps: ["jalali"],
    desc: "زمان به زبان آدم، مثل «۳ دقیقه پیش»، «دیروز» و «پس‌فردا»، که خودش به‌روز میشه و تاریخ کامل شمسی را در راهنمای ابزار نشون میده.",
    usage: `import { RelativeTime } from "@/components/ui/relative-time"

<RelativeTime date={comment.createdAt} />
<RelativeTime date={order.deliveryAt} live={false} />`,
    props: [
      { name: "date", type: "Date | string | number", desc: "لحظه‌ی موردنظر، گذشته یا آینده." },
      { name: "live", type: "boolean", default: "true", desc: "تا وقتی صفحه بازه، متن را تازه نگه می‌داره." },
      { name: "absoluteAfterDays", type: "number", default: "30", desc: "بعد از این تعداد روز به‌جای «… پیش» تاریخ کامل شمسی می‌آد." },
    ],
    notes: ["سمت سرور تاریخ کامل رندر میشه و بعد از mount به زمان نسبی عوض میشه، پس خطای hydration نمی‌گیرید.", "تایمر فقط وقتی بیدار میشه که متن قراره عوض بشه، یعنی هر چند ثانیه برای دقیقه‌ی اول و هر ساعت برای روزهای قبل."],
    promptBullets: [
      "A <time> with an ISO dateTime, the full Jalali date and Persian-digit time in title, and Persian relative text: «پیش» for the past, «دیگر» for the future, plus دیروز/فردا/پریروز/پس‌فردا.",
      "Renders the absolute date until mounted (no hydration mismatch); a self-rescheduling timeout whose interval grows with the distance.",
      "Falls back to the absolute Jalali date after absoluteAfterDays.",
    ],
  },
  {
    slug: "shipping-methods", name: "روش ارسال", cat: "form", file: ui("shipping-methods"), deps: ["lucide-react"],
    desc: "انتخاب روش ارسال با کارت‌های رادیویی برای پست پیشتاز، تیپاکس، پیک و تحویل حضوری، با زمان تحویل، هزینه و ارسال رایگان از یک سقف.",
    usage: `import { ShippingMethods } from "@/components/ui/shipping-methods"

<ShippingMethods
  orderTotal={cartTotal}
  defaultValue="post"
  onChange={(id, fee) => setShipping({ id, fee })}
  methods={[
    { id: "post", name: "پست پیشتاز", kind: "post", eta: "۲ تا ۴ روز کاری", price: 65_000, freeFrom: 1_500_000 },
    { id: "tipax", name: "تیپاکس", kind: "express", eta: "۱ تا ۲ روز کاری" },
    { id: "courier", name: "پیک موتوری", kind: "courier", eta: "امروز تا ساعت ۲۰", price: 90_000, disabled: true, disabledReason: "فقط در تهران" },
  ]}
/>`,
    props: [
      { name: "methods", type: "{ id; name; kind?; eta; price?; freeFrom?; disabled? }[]", desc: "اگه price را ندید «پس‌کرایه» نوشته میشه و صفر یعنی رایگان." },
      { name: "orderTotal", type: "number", desc: "جمع سبد به تومان که freeFrom با اون سنجیده میشه." },
      { name: "onChange", type: "(id, fee) => void", desc: "شناسه‌ی روش و هزینه‌ی نهایی بعد از اعمال ارسال رایگان." },
    ],
    notes: ["تابع shippingFee هم export شده تا هزینه را سمت سرور با همین قاعده حساب کنید."],
    promptBullets: [
      "Real radio inputs (sr-only) in label cards inside a fieldset; each card: radio dot, kind icon tile, name, ETA line, fee at the end.",
      "Fee states: «پس‌کرایه» when undefined, green «رایگان» at 0 or once orderTotal ≥ freeFrom (with the old fee struck through), otherwise Persian-digit toman.",
      "Disabled methods stay visible with the reason in place of the ETA.",
    ],
  },
  {
    slug: "payment-methods", name: "روش پرداخت", cat: "form", file: ui("payment-methods"), deps: ["lucide-react"],
    desc: "انتخاب روش پرداخت با کارت‌های رادیویی برای درگاه‌های بانکی، کیف پول با موجودی، کارت‌به‌کارت، قسطی و پرداخت در محل.",
    usage: `import { PaymentMethods } from "@/components/ui/payment-methods"

<PaymentMethods
  amount={payable}
  defaultValue="zarinpal"
  onChange={setMethod}
  methods={[
    { id: "zarinpal", kind: "gateway", name: "درگاه زرین‌پال", badge: "پیشنهادی" },
    { id: "mellat", kind: "gateway", name: "به‌پرداخت ملت" },
    { id: "wallet", kind: "wallet", name: "کیف پول", balance: 850_000 },
    { id: "cod", kind: "cod", name: "پرداخت در محل", disabled: true, disabledReason: "برای سفارش بالای ۵ میلیون فعال نیست" },
  ]}
/>`,
    props: [
      { name: "methods", type: "{ id; kind; name; description?; logo?; balance?; badge?; disabled? }[]", desc: "kind یکی از gateway، wallet، card-to-card، installment و cod است و آیکون و توضیح پیش‌فرض را تعیین می‌کنه." },
      { name: "amount", type: "number", desc: "مبلغ قابل پرداخت. اگه موجودی کیف پول کمتر باشه، غیرفعال میشه و کسری را می‌نویسه." },
      { name: "layout", type: '"list" | "grid"', default: '"list"', desc: "grid از sm به بالا دو کارت در هر ردیف می‌گذاره." },
    ],
    notes: ["لوگوی درگاه‌ها علامت تجاری هستن و داخل کامپوننت نیومدن. فایل رسمی هر درگاه را در logo بگذارید."],
    promptBullets: [
      "Real radio inputs in label cards inside a fieldset; a kind table gives each method a neutral lucide icon and a default hint line, with a logo slot.",
      "Wallet cards show the balance at the end; when balance < amount the card is disabled and reads «… تومان کم دارید» in the destructive color.",
      "Optional brand-tinted badge («پیشنهادی»); list or two-column grid layout.",
    ],
  },
];

export const extraComponents: ComponentDoc[] = [...aiComponents, ...persianComponents, ...generalComponents];
