import type { ComponentCat, ComponentDoc } from "./types";

export const componentCats: { key: ComponentCat | "all"; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "form", label: "فرم" },
  { key: "display", label: "نمایش داده" },
  { key: "feedback", label: "بازخورد" },
  { key: "overlay", label: "پنجره و منو" },
  { key: "nav", label: "ناوبری" },
  { key: "data", label: "داده و نمودار" },
  { key: "education", label: "آموزشی" },
];

const ui = (slug: string) => `registry/ui/${slug}.tsx`;

export const components: ComponentDoc[] = [
  {
    slug: "button", name: "دکمه", cat: "form", file: ui("button"), deps: ["lucide-react"],
    desc: "دکمه در چند واریانت و اندازه، با حالت غیرفعال و آیکونی که در جهت درست کنار متن می‌نشینه.",
    usage: `import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

<Button>ثبت سفارش</Button>
<Button variant="outline" size="sm">انصراف</Button>
<Button variant="brand"><Plus />محصول جدید</Button>`,
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "brand" | "destructive"', default: '"default"', desc: "سبک دکمه. default همان دکمه‌ی سفید اصلیه." },
      { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', desc: "ارتفاع و پدینگ. icon مربعه." },
      { name: "disabled", type: "boolean", desc: "غیرفعال با کاهش شفافیت." },
    ],
    notes: ["آیکون را قبل از متن بگذارید، در RTL خودش سمت راست می‌نشینه.", "برای عمل مخرب از destructive و برای عمل ثانویه از outline استفاده کنید. در هر بخش فقط یک دکمه‌ی default بگذارید."],
    promptBullets: ["Variants default, secondary, outline, ghost, destructive and sizes sm/md/lg/icon.", "Icons sized with [&_svg]:size-4 and gap-2 from the label.", "Disabled: opacity-50 and pointer-events-none; active: scale-[0.98]."],
  },
  {
    slug: "input", name: "ورودی", cat: "form", file: ui("input"),
    desc: "ورودی متن با برچسب، پیشوند و پسوند و پیام خطا. فیلد موبایل هم خودش چپ‌چین میشه.",
    usage: `import { Input, Field } from "@/components/ui/input"

<Field label="نام و نام خانوادگی" htmlFor="name">
  <Input id="name" placeholder="مثلاً: سارا محمدی" />
</Field>

<Field label="شماره‌ی موبایل" htmlFor="phone" hint="کد تأیید به این شماره پیامک می‌شود">
  <Input id="phone" dir="ltr" inputMode="tel" startAddon="+98" placeholder="912 345 6789" />
</Field>`,
    props: [
      { name: "startAddon", type: "ReactNode", desc: "محتوای ابتدای فیلد (سمت راست در RTL)، مثل پیش‌شماره." },
      { name: "endAddon", type: "ReactNode", desc: "محتوای انتهای فیلد، مثل واحد یا آیکون." },
      { name: "error", type: "string", desc: "پیام خطا زیر فیلد، که aria-invalid را هم می‌گذاره." },
      { name: "dir", type: '"rtl" | "ltr"', default: "ارث‌بری", desc: "برای موبایل، ایمیل و کد از ltr استفاده کنید." },
    ],
    notes: ["برچسب همیشه بالا باشه و با htmlFor وصل شده باشه. placeholder جای برچسب نیست.", "برای شماره‌ی موبایل dir=\"ltr\" و inputMode=\"tel\" بگذارید تا کیبورد عددی و ترتیب رقم‌ها درست باشه."],
    promptBullets: ["Input with startAddon, endAddon, and error props; Field wraps the label and hint.", "dir=\"ltr\" for phone and email so the value is left-aligned while the form stays RTL.", "Error: a mild red border and a text-xs message under the field."],
  },
  {
    slug: "textarea", name: "متن چندخطی", cat: "form", file: ui("textarea"),
    desc: "متن چندخطی با شمارنده‌ی کاراکتر فارسی و ارتفاعی که خودش با محتوا بزرگ میشه.",
    usage: `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="پیام‌تان را بنویسید…" maxLength={200} showCount autoResize />`,
    props: [
      { name: "autoResize", type: "boolean", default: "false", desc: "ارتفاع با محتوا زیاد میشه." },
      { name: "showCount", type: "boolean", default: "false", desc: "شمارنده‌ی «۲۴ / ۲۰۰» زیر فیلد (به maxLength نیاز داره)." },
    ],
    promptBullets: ["Character counter with Persian digits, left side under the field (text-end).", "Auto-height by measuring scrollHeight with resize-none."],
  },
  {
    slug: "select", name: "انتخاب", cat: "form", file: ui("select"), deps: ["lucide-react"],
    desc: "فهرست انتخاب بومی مرورگر با ظاهر سفارشی و شورون در سمت چپ.",
    usage: `import { Select } from "@/components/ui/select"

<Select
  placeholder="شهر را انتخاب کنید"
  options={[{ value: "thr", label: "تهران" }, { value: "mhd", label: "مشهد" }]}
  defaultValue=""
/>`,
    props: [
      { name: "options", type: "{ value; label; disabled? }[]", desc: "گزینه‌ها." },
      { name: "placeholder", type: "string", desc: "گزینه‌ی غیرفعال اول." },
    ],
    notes: ["روی موبایل، فهرست بومی سیستم‌عامل باز میشه. اگر جست‌وجو می‌خواید از Combobox استفاده کنید."],
    promptBullets: ["Use a native <select> with appearance-none and put the chevron at end-3 (left in RTL).", "End padding pe-9 for the chevron; ps-3 for the text."],
  },
  {
    slug: "combobox", name: "کمبوباکس", cat: "form", file: ui("combobox"), deps: ["lucide-react"],
    desc: "ورودی با پیشنهادهای زنده که اول گزینه‌هایی را نشان میده که با متن شما شروع میشن و بعد بقیه را.",
    usage: `import { Combobox } from "@/components/ui/combobox"

const cities = ["اصفهان", "اهواز", "اراک", "اردبیل", "تهران", "تبریز"]
<Combobox options={cities} placeholder="نام شهر…" onChange={setCity} />`,
    props: [
      { name: "options", type: "string[]", desc: "همه‌ی گزینه‌ها. فیلتر داخل خود کامپوننت انجام میشه." },
      { name: "value / onChange", type: "string / (v) => void", desc: "کنترل‌شده یا آزاد." },
      { name: "emptyText", type: "string", default: '"چیزی پیدا نشد"', desc: "متن حالت خالی." },
    ],
    promptBullets: ["Two-stage filter: options that start with the query first, then those that contain it.", "Highlight the matched span of each option (font-semibold).", "Up/down, Enter, Escape; role=combobox and aria-expanded.", "Keep the keyboard-active option scrolled into view (scrollIntoView block nearest)."],
  },
  {
    slug: "otp-field", name: "کد تأیید", cat: "form", file: ui("otp-field"),
    desc: "کد تأیید شش‌خانه‌ای با اعداد فارسی که از پیامک خودش پر میشه.",
    usage: `import { OtpField } from "@/components/ui/otp-field"

<OtpField length={6} onComplete={(code) => verify(code)} />`,
    props: [
      { name: "length", type: "number", default: "6", desc: "تعداد خانه‌ها." },
      { name: "onComplete", type: "(code: string) => void", desc: "وقتی همه‌ی خانه‌ها پر شد صدا زده میشه و کد را با اعداد لاتین برمی‌گردونه." },
      { name: "value / onChange", type: "string", desc: "حالت کنترل‌شده." },
    ],
    notes: ["خانه‌ها LTR چیده میشن چون کد از پیامک به همان ترتیب خوانده میشه.", "autoComplete=\"one-time-code\" روی خانه‌ی اول، پیشنهاد کد از پیامک را در iOS و اندروید فعال می‌کنه."],
    promptBullets: ["Cell layout dir=\"ltr\" but each glyph is a Persian digit; the submitted value uses Latin digits.", "Accept Persian and Latin digits from the keyboard; Backspace on an empty cell moves to the previous one.", "Paste fills every cell and fires onComplete."],
  },
  {
    slug: "number-field", name: "عدد", cat: "form", file: ui("number-field"), deps: ["lucide-react"],
    desc: "ورودی عدد با دکمه‌های افزایش و کاهش، اعداد فارسی و حداقل و حداکثر.",
    usage: `import { NumberField } from "@/components/ui/number-field"

<NumberField defaultValue={1} min={1} max={9} aria-label="تعداد" />`,
    props: [
      { name: "min / max / step", type: "number", desc: "محدوده و گام." },
      { name: "value / onChange", type: "number", desc: "حالت کنترل‌شده." },
    ],
    promptBullets: ["\"+\" button at the start (right) and \"−\" at the end; the number in the middle uses Persian digits.", "Manual input accepts Persian and Latin digits and stays in range."],
  },
  {
    slug: "checkbox-group", name: "گروه چک‌باکس", cat: "form", file: ui("checkbox"), deps: ["lucide-react"],
    desc: "چک‌باکس تکی با حالت نامشخص و گروه چک‌باکس با وضعیت مشترک.",
    usage: `import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

<CheckboxGroup
  defaultValue={["ship"]}
  options={[
    { value: "ship", label: "ارسال رایگان" },
    { value: "gift", label: "بسته‌بندی هدیه", description: "۲۰ هزار تومان" },
  ]}
/>`,
    props: [
      { name: "checked", type: 'boolean | "indeterminate"', desc: "حالت نامشخص برای «انتخاب همه»." },
      { name: "label / description", type: "ReactNode", desc: "متن کنار جعبه." },
      { name: "options", type: "{ value; label; description?; disabled? }[]", desc: "برای CheckboxGroup." },
    ],
    promptBullets: ["Button with role=\"checkbox\" and aria-checked (including mixed); box first, then the label.", "CheckboxGroup returns an array of selected values."],
  },
  {
    slug: "radio-group", name: "گروه رادیویی", cat: "form", file: ui("radio-group"),
    desc: "انتخاب یک گزینه از چند گزینه، با توضیح زیر هر کدام و یک واریانت کارتی.",
    usage: `import { RadioGroup } from "@/components/ui/radio-group"

<RadioGroup
  variant="cards"
  defaultValue="post"
  options={[
    { value: "post", label: "پست پیشتاز", description: "۳ تا ۵ روز کاری" },
    { value: "bike", label: "پیک موتوری", description: "امروز، فقط تهران" },
  ]}
/>`,
    props: [
      { name: "variant", type: '"list" | "cards"', default: '"list"', desc: "کارتی برای انتخاب روش ارسال یا پلن." },
      { name: "options", type: "{ value; label; description?; disabled? }[]", desc: "گزینه‌ها." },
    ],
    promptBullets: ["role=\"radiogroup\" and role=\"radio\"; in RTL ArrowLeft moves to the next option.", "cards variant: the whole card is clickable, active option has a stronger border."],
  },
  {
    slug: "switch", name: "کلید", cat: "form", file: ui("switch"),
    desc: "کلید روشن و خاموش با انیمیشن که در RTL دستگیره‌اش به سمت درست میره.",
    usage: `import { Switch } from "@/components/ui/switch"

<label className="flex items-center justify-between">
  <span>اعلان ایمیلی</span>
  <Switch defaultChecked onCheckedChange={setEmail} />
</label>`,
    props: [
      { name: "checked / defaultChecked", type: "boolean", desc: "کنترل‌شده یا آزاد." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", desc: "هنگام تغییر." },
    ],
    notes: ["در RTL حالت «روشن» یعنی دستگیره سمت چپ. با translate منفی پیاده شده تا با dir هماهنگ بمونه."],
    promptBullets: ["role=\"switch\" with aria-checked; the thumb moves left when on (RTL).", "On: bg-primary thumb bg-primary-foreground; off: bg-input thumb bg-foreground."],
  },
  {
    slug: "slider", name: "اسلایدر", cat: "form", file: ui("slider"),
    desc: "اسلایدر بازه با یک دستگیره و برچسب مقدار که مسیرش از راست پر میشه.",
    usage: `import { Slider } from "@/components/ui/slider"
import { formatToman } from "@/lib/utils"

<Slider label="حداکثر قیمت" min={100_000} max={10_000_000} step={100_000} defaultValue={6_500_000} format={formatToman} />`,
    props: [
      { name: "format", type: "(v: number) => string", default: "ارقام فارسی", desc: "قالب برچسب، مثلاً formatToman." },
      { name: "min / max / step", type: "number", desc: "محدوده." },
    ],
    promptBullets: ["Use a native input[type=range] and fill the track from the right with linear-gradient(to left …).", "Value label uses Persian digits and is swappable via a format prop."],
  },
  {
    slug: "range-slider", name: "اسلایدر بازه", cat: "form", file: ui("range-slider"),
    desc: "اسلایدر دو دستگیره‌ای برای فیلتر کف تا سقف (مثل محدوده قیمت فروشگاه) با پر شدن ترک از راست و اعداد فارسی.",
    usage: `import { RangeSlider } from "@/components/ui/range-slider"
import { formatToman } from "@/lib/utils"

<RangeSlider
  label="محدوده قیمت"
  min={0}
  max={150_000_000}
  step={1_000_000}
  defaultValue={[20_000_000, 50_000_000]}
  format={formatToman}
  fullRangeLabel="همه قیمت‌ها"
  onChange={([lo, hi]) => setRange([lo, hi])}
  onCommit={([lo, hi]) => applyPriceFilter(lo, hi)}
/>`,
    props: [
      { name: "value / defaultValue", type: "[number, number]", desc: "زوج کف و سقف. دستگیره‌ها از هم رد نمی‌شن." },
      { name: "onChange", type: "([min, max]) => void", desc: "حین درگ و با هر کلید صدا زده میشه، ولی فقط وقتی مقدار واقعاً عوض شده باشه. برای نمایش زنده مناسبه." },
      { name: "onCommit", type: "([min, max]) => void", desc: "یک بار در پایان تعامل صدا زده میشه (رها کردن دستگیره یا ترک، یا هر کلید) و فقط اگر مقدار نسبت به شروع تعامل عوض شده باشه. جای درستِ درخواست به سرور یا اسکرول به نتایج همینه." },
      { name: "fullRangeLabel", type: "ReactNode", desc: "وقتی بازه کل min تا max را پوشش میده، این متن به‌جای دو عدد نمایش داده میشه، مثلاً «همه قیمت‌ها»." },
      { name: "format", type: "(v: number) => string", default: "ارقام فارسی", desc: "قالب هر دو برچسب، مثلاً formatToman." },
      { name: "min / max / step", type: "number", desc: "بازه‌ی مجاز و گام." },
      { name: "minThumbLabel / maxThumbLabel", type: "string", default: "«کف» / «سقف»", desc: "aria-label هر دستگیره." },
    ],
    notes: [
      "پر شدن ترک با همان الگوی اسلایدر تک‌دستگیره است: linear-gradient(to left …) تا در RTL از راست پر بشه؛ جای دستگیره با inset-inline-start است، نه left/right.",
      "هر دستگیره role=\"slider\" دارد با aria-valuemin/max/now و aria-valuetext فارسی؛ فلش‌ها در RTL با جهت بومی range هماهنگ‌اند.",
    ],
    promptBullets: [
      "Two thumbs on one track; value is [min, max]; thumbs cannot cross.",
      "Fill the band from the right with linear-gradient(to left …) between the two percentages; position thumbs with inset-inline-start only (no left/right).",
      "Each thumb is role=\"slider\" with aria-valuemin/max/now/valuetext; keyboard arrows respect RTL; touch target ≥ 44px.",
      "Value labels use format prop (e.g. formatToman); honor prefers-reduced-motion on thumb transitions.",
    ],
  },
  {
    slug: "rating", name: "امتیاز", cat: "form", file: ui("rating"), deps: ["lucide-react"],
    desc: "امتیاز ستاره‌ای که از راست پر میشه و با هاور پیش‌نمایش میده.",
    usage: `import { Rating } from "@/components/ui/rating"

<Rating defaultValue={4} showValue onChange={setScore} />
<Rating value={4} readOnly size="sm" />`,
    props: [
      { name: "max", type: "number", default: "5", desc: "تعداد ستاره." },
      { name: "readOnly", type: "boolean", desc: "فقط نمایش." },
      { name: "showValue", type: "boolean", desc: "«۴ از ۵» کنار ستاره‌ها." },
    ],
    promptBullets: ["First star is on the right (natural RTL order); hover fills up to that star.", "role=\"radiogroup\" with labels «۱ ستاره» through «۵ ستاره»."],
  },
  {
    slug: "file-upload", name: "آپلود فایل", cat: "form", file: ui("file-upload"), deps: ["lucide-react"],
    desc: "آپلود فایل با کشیدن و رها کردن، فهرست فایل‌ها با حجم فارسی و محدودیت اندازه.",
    usage: `import { FileUpload } from "@/components/ui/file-upload"

<FileUpload accept=".pdf,.png" maxSize={5 * 1024 * 1024} hint="PDF یا PNG، تا ۵ مگابایت" onFiles={setFiles} />`,
    props: [
      { name: "maxSize", type: "number", desc: "به بایت. فایل بزرگ‌تر رد میشه و پیام فارسی میده." },
      { name: "onFiles", type: "(files: File[]) => void", desc: "فهرست فعلی پس از هر تغییر." },
    ],
    promptBullets: ["Drop zone with a dashed border that strengthens on dragover.", "File size via a Persian helper (کیلوبایت/مگابایت) and file name with dir=\"auto\"."],
  },
  {
    slug: "calendar", name: "تقویم شمسی", cat: "form", file: ui("calendar"), wide: true, deps: ["lucide-react"], registryDeps: ["jalali"],
    desc: "تقویم شمسی با ماه و روز فارسی، جمعه‌های خاکستری و حلقه‌ی امروز، که خروجی‌اش یک Date معمولیه.",
    usage: `import { Calendar } from "@/components/ui/calendar"

<Calendar defaultValue={new Date()} onChange={(d) => console.log(formatJalali(d))} />`,
    props: [
      { name: "value / defaultValue", type: "Date | null", desc: "تاریخ انتخاب‌شده (Date میلادی معمولی)." },
      { name: "min / max", type: "Date", desc: "روزهای خارج از بازه غیرفعال میشن." },
      { name: "markWeekend", type: "boolean", default: "true", desc: "جمعه‌ها کم‌رنگ." },
      { name: "compact", type: "boolean", desc: "نسخه‌ی کوچک برای پاپ‌آور." },
    ],
    notes: ["تبدیل تاریخ با الگوریتم جلالی و بدون وابستگی در lib/jalali.ts انجام میشه و سال‌های کبیسه (مثل ۱۴۰۳) درست حساب میشن.", "هفته از شنبه شروع میشه و ستون آخر جمعه‌ست."],
    promptBullets: ["Week starts Saturday (ش ی د س چ پ ج), Fridays muted, today with a ring.", "Use the Jalali conversion helper (jalaali) and return a Date.", "Prev/next month buttons with chevrons; \"prev\" points right and \"next\" points left."],
  },
  {
    slug: "date-picker", name: "انتخاب تاریخ", cat: "form", file: ui("date-picker"), deps: ["lucide-react"], registryDeps: ["calendar"],
    desc: "ورودی تاریخ با تقویم شمسی در پاپ‌آور و دکمه‌ی پاک کردن سریع.",
    usage: `import { DatePicker } from "@/components/ui/date-picker"

<DatePicker placeholder="تاریخ ارسال" onChange={setDate} min={new Date()} />`,
    props: [
      { name: "clearable", type: "boolean", default: "true", desc: "دکمه‌ی × برای پاک کردن." },
      { name: "placeholder", type: "string", desc: "متن وقتی تاریخی انتخاب نشده." },
      { name: "weekday", type: "boolean", default: "true", desc: "نمایش روز هفته قبل از تاریخ." },
    ],
    promptBullets: ["An input-like button that shows the date as «چهارشنبه، ۲۵ شهریور ۱۴۰۵».", "Popover closes on outside click and Escape; start-0 under the field."],
  },
  {
    slug: "command", name: "پالت دستور", cat: "overlay", file: ui("command"), deps: ["lucide-react"],
    desc: "پالت دستور با ⌘K برای جست‌وجو و اجرای دستورها، با گروه‌بندی و میانبر.",
    usage: `import { CommandDialog } from "@/components/ui/command"

const [open, setOpen] = useState(false)
<CommandDialog
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: "new", label: "افزودن محصول", group: "عمل‌ها", shortcut: "N", onSelect: () => router.push("/products/new") },
    { id: "orders", label: "سفارش‌های امروز", group: "رفتن به", icon: ShoppingBag },
  ]}
/>`,
    props: [
      { name: "items", type: "CommandItem[]", desc: "id، label، icon، shortcut، keywords، group، onSelect." },
      { name: "open / onOpenChange", type: "boolean", desc: "برای CommandDialog. میانبرهای ⌘K و Ctrl+K خودکار وصل هستن." },
    ],
    promptBullets: ["Filter on label and keywords; group with a small heading.", "Up/down and Enter; active item bg-accent with an Enter icon on the left.", "Dialog version opens with ⌘K and sits on a blurred overlay."],
  },
  {
    slug: "dialog", name: "پنجره", cat: "overlay", file: ui("dialog"), deps: ["lucide-react"],
    desc: "مودال با عنوان، بدنه و دکمه‌های عمل در جای درست، همراه قفل اسکرول و بازگشت فوکوس.",
    usage: `import { Dialog } from "@/components/ui/dialog"

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="ویرایش آدرس"
  description="آدرس پیش‌فرض ارسال را تغییر دهید."
  footer={<><Button onClick={save}>ذخیره</Button><Button variant="ghost" onClick={() => setOpen(false)}>انصراف</Button></>}
>
  <Input defaultValue="تهران، خیابان ولیعصر…" />
</Dialog>`,
    props: [
      { name: "open / onOpenChange", type: "boolean / (o) => void", desc: "کنترل باز و بسته." },
      { name: "title / description", type: "ReactNode", desc: "با aria-labelledby و aria-describedby وصل میشن." },
      { name: "footer", type: "ReactNode", desc: "دکمه‌ها، که دکمه‌ی اصلی اول می‌آد." },
      { name: "role", type: '"dialog" | "alertdialog"', default: '"dialog"', desc: "alertdialog با کلیک بیرون بسته نمیشه." },
    ],
    promptBullets: ["Escape and overlay click close it; lock body scroll; move focus inside on open and restore on close.", "On mobile from the bottom (items-end), centered on desktop; close button in the top-left corner."],
  },
  {
    slug: "alert-dialog", name: "تأیید عمل", cat: "overlay", file: ui("alert-dialog"), registryDeps: ["dialog", "button"],
    desc: "پنجره‌ی تأیید برای کارهای برگشت‌ناپذیر که فوکوس را اول روی «انصراف» می‌گذاره.",
    usage: `import { AlertDialog } from "@/components/ui/alert-dialog"

<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="این محصول حذف شود؟"
  description="این کار قابل بازگشت نیست."
  confirmText="حذف"
  destructive
  onConfirm={async () => { await deleteProduct(id) }}
/>`,
    props: [
      { name: "onConfirm", type: "() => void | Promise<void>", desc: "اگر Promise برگرداند، دکمه تا پایان «لطفاً صبر کنید…» میشه." },
      { name: "destructive", type: "boolean", desc: "دکمه‌ی تأیید قرمز." },
    ],
    promptBullets: ["role=\"alertdialog\"; initial focus on cancel, not delete.", "Confirm button disables while a Promise is pending, with waiting copy."],
  },
  {
    slug: "dropdown-menu", name: "منوی کشویی", cat: "overlay", file: ui("dropdown-menu"),
    desc: "منوی عمل با میانبر، جداکننده و آیتم قرمز برای حذف.",
    usage: `import { DropdownMenu } from "@/components/ui/dropdown-menu"

<DropdownMenu
  trigger={<Button variant="outline" size="icon"><MoreHorizontal /></Button>}
  items={[
    { label: "ویرایش", icon: Pencil, shortcut: "E" },
    { label: "کپی لینک", icon: Copy },
    { type: "separator" },
    { label: "حذف", icon: Trash2, danger: true, onSelect: remove },
  ]}
/>`,
    props: [
      { name: "items", type: "MenuItem[]", desc: "item | separator | label." },
      { name: "align", type: '"start" | "end"', default: '"start"', desc: "تراز منو نسبت به دکمه." },
    ],
    promptBullets: ["Menu opens under the button at start-0; outside click and Escape close it.", "role=\"menu\"/\"menuitem\", up/down navigation, shortcut as kbd on the left."],
  },
  {
    slug: "tooltip", name: "راهنمای ابزار", cat: "overlay", file: ui("tooltip"),
    desc: "توضیح کوتاهی که با هاور یا فوکوس ظاهر میشه، فقط با CSS.",
    usage: `import { Tooltip } from "@/components/ui/tooltip"

<Tooltip content="افزودن به علاقه‌مندی‌ها">
  <Button size="icon" variant="outline" aria-label="علاقه‌مندی"><Star /></Button>
</Tooltip>`,
    props: [
      { name: "content", type: "ReactNode", desc: "متن راهنما." },
      { name: "side", type: '"top" | "bottom"', default: '"top"', desc: "سمت نمایش." },
    ],
    promptBullets: ["No JavaScript: show with group-hover and group-focus-within.", "role=\"tooltip\" wired with aria-describedby."],
  },
  {
    slug: "sheet", name: "کشو", cat: "overlay", file: ui("sheet"), deps: ["lucide-react"],
    desc: "پنل کناری که از سمت راست باز میشه، برای فیلتر، سبد خرید و منوی موبایل.",
    usage: `import { Sheet } from "@/components/ui/sheet"

<Sheet open={open} onOpenChange={setOpen} title="فیلترها">
  …
</Sheet>`,
    props: [
      { name: "side", type: '"start" | "end" | "bottom"', default: '"start"', desc: "start در RTL یعنی راست." },
    ],
    promptBullets: [
      "Keep mounted while closing so enter and exit both animate; panel uses a spring-like cubic-bezier slide (≈ Animate UI stiffness 150 / damping 22), overlay fades with a short blur clear.",
      "Slide from inline-start (right in RTL) with inset-y-0 start-0; bottom variant slides up with rounded top corners; Escape and overlay close it; title via aria-labelledby.",
    ],
  },
  {
    slug: "tabs", name: "تب‌ها", cat: "nav", file: ui("tabs"),
    desc: "تب‌های بخش‌بندی‌شده یا خطی که با کیبورد کار می‌کنن و جهت راست‌چین را رعایت می‌کنن. در حالت segmented یک قرص زیر تب فعال سر می‌خوره.",
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="preview">
  <TabsList aria-label="نمایش">
    <TabsTrigger value="preview">پیش‌نمایش</TabsTrigger>
    <TabsTrigger value="code">کد</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">…</TabsContent>
  <TabsContent value="code">…</TabsContent>
</Tabs>`,
    props: [
      { name: "variant", type: '"segmented" | "underline"', default: '"segmented"', desc: "ظاهر فهرست تب‌ها." },
      { name: "value / defaultValue / onValueChange", type: "string", desc: "کنترل تب فعال." },
    ],
    promptBullets: ["role=\"tablist\"/\"tab\"/\"tabpanel\" with aria-controls; only the active tab is tabIndex=0.", "In RTL ArrowLeft moves to the next tab (to the left).", "segmented: measure the active tab's offsetLeft/offsetWidth and slide an absolute bg-background pill with translateX; re-measure on ResizeObserver."],
  },
  {
    slug: "pagination", name: "صفحه‌بندی", cat: "nav", file: ui("pagination"), deps: ["lucide-react"],
    desc: "صفحه‌بندی با اعداد فارسی، سه‌نقطه و فلش‌هایی در جهت راست‌چین.",
    usage: `import { Pagination } from "@/components/ui/pagination"

<Pagination page={page} total={12} onChange={setPage} />`,
    props: [
      { name: "page / total", type: "number", desc: "صفحه‌ی فعلی (از ۱) و تعداد کل." },
      { name: "siblings", type: "number", default: "1", desc: "چند شماره دور صفحه‌ی فعلی." },
    ],
    promptBullets: ["\"Previous\" with a right chevron and \"Next\" with a left chevron; aria-current=\"page\" on the current page.", "Ellipsis algorithm: always 1 and last, plus neighbors."],
  },
  {
    slug: "breadcrumb", name: "مسیر", cat: "nav", file: ui("breadcrumb"), deps: ["lucide-react"],
    desc: "مسیر صفحه‌ی فعلی با جداکننده‌هایی که به سمت چپ اشاره می‌کنن.",
    usage: `import { Breadcrumb } from "@/components/ui/breadcrumb"

<Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "فروشگاه", href: "/shop" }, { label: "هدفون بی‌سیم" }]} />`,
    props: [{ name: "items", type: "{ label; href? }[]", desc: "آخرین آیتم صفحه‌ی فعلیه و لینک نمیشه." }],
    promptBullets: ["nav with aria-label=\"مسیر\" and an ol; ChevronLeft separator; last item aria-current=\"page\"."],
  },
  {
    slug: "stepper", name: "مراحل", cat: "nav", file: ui("stepper"), wide: true, deps: ["lucide-react"],
    desc: "نمایش گام‌های فرم چندمرحله‌ای، افقی یا عمودی، از راست به چپ.",
    usage: `import { Stepper } from "@/components/ui/stepper"

<Stepper current={1} steps={[{ label: "سبد" }, { label: "آدرس", description: "کجا بفرستیم؟" }, { label: "پرداخت" }]} />`,
    props: [
      { name: "current", type: "number", desc: "شاخص گام فعلی (از صفر)." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "جهت چیدمان." },
    ],
    promptBullets: ["Completed steps get a check and bg-primary, current step a ring, others a gray border.", "Connector line between circles; aria-current=\"step\" on the current step."],
  },
  {
    slug: "sidebar", name: "نوار کناری", cat: "nav", file: ui("sidebar"), deps: ["lucide-react"],
    desc: "ناوبری اپ با گروه‌بندی، نشان شمارنده و بخش‌های جمع‌شونده.",
    usage: `import { Sidebar, SidebarGroup, SidebarItem } from "@/components/ui/sidebar"

<Sidebar header={<Logo />}>
  <SidebarItem icon={Home} label="خانه" href="/" />
  <SidebarGroup title="فروشگاه" collapsible>
    <SidebarItem icon={ShoppingBag} label="سفارش‌ها" badge={12} active />
    <SidebarItem icon={Package} label="محصولات" />
  </SidebarGroup>
</Sidebar>`,
    props: [
      { name: "active", type: "boolean", desc: "آیتم صفحه‌ی فعلی با aria-current." },
      { name: "badge", type: "number | string", desc: "شمارنده با ارقام فارسی." },
      { name: "collapsible", type: "boolean", desc: "گروه باز و بسته شود." },
    ],
    promptBullets: ["aside on the right; active item bg-accent; numeric badge with Persian digits.", "Collapsible group with a chevron that rotates 90deg when closed."],
  },
  {
    slug: "toast", name: "اعلان", cat: "feedback", file: ui("toast"), deps: ["lucide-react"],
    desc: "اعلان‌هایی که روی هم جمع میشن، با سقف تعداد، دکمه‌ی «بستن همه» و جایگاه قابل تنظیم، از طریق Provider و هوک.",
    usage: `// app/layout.tsx
import { ToastProvider } from "@/components/ui/toast"
<ToastProvider>{children}</ToastProvider>

// هر جای دیگر
const { toast } = useToast()
toast({ title: "تغییرات ذخیره شد", variant: "success", action: { label: "واگرد", onClick: undo } })`,
    props: [
      { name: "toast(options)", type: "{ title; description?; variant?; action?; duration? }", desc: "نمایش اعلان. duration پیش‌فرض ۴۰۰۰ میلی‌ثانیه‌ست." },
      { name: "variant", type: '"default" | "success" | "error"', desc: "آیکون و رنگ." },
      { name: "ToastProvider max / position", type: 'number / "bottom-start" | "bottom-end" | "top-start" | "top-end"', default: '3 / "bottom-start"', desc: "سقف اعلان‌های هم‌زمان و گوشه." },
    ],
    notes: ["اعلان‌ها در گوشه‌ی پایین راست (start) می‌نشینن، همان جایی که چشم فارسی‌خوان اول میره.", "با بیش از یک اعلان، دکمه‌ی «بستن همه» ظاهر میشه و قدیمی‌ترها با رسیدن به سقف حذف میشن."],
    promptBullets: ["ToastProvider with useToast; aria-live=\"polite\" region at bottom-right (bottom-4 start-4).", "Card with a status icon, title, description, action, and close; short enter animation from the right."],
  },
  {
    slug: "alert", name: "هشدار", cat: "feedback", file: ui("alert"), deps: ["lucide-react"],
    desc: "پیام درون صفحه برای اطلاع، موفقیت، توجه و خطا.",
    usage: `import { Alert } from "@/components/ui/alert"

<Alert variant="success" title="پرداخت با موفقیت انجام شد">رسید به شماره‌ی ۰۹۱۲۳۴۵۶۷۸۹ پیامک شد.</Alert>
<Alert variant="destructive" title="پرداخت ناموفق">موجودی کارت کافی نیست.</Alert>`,
    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "destructive"', default: '"info"', desc: "رنگ و آیکون." },
      { name: "icon", type: "Component", desc: "آیکون سفارشی به‌جای پیش‌فرض." },
    ],
    promptBullets: ["Icon at the start (right), bold title, body text-foreground/80.", "variant=destructive uses role=\"alert\"; others role=\"status\"."],
  },
  {
    slug: "progress", name: "پیشرفت", cat: "feedback", file: ui("progress"),
    desc: "نوار پیشرفتی که از راست پر میشه و درصدش را با اعداد فارسی نشان میده.",
    usage: `import { Progress } from "@/components/ui/progress"

<Progress value={72} label="آپلود فایل‌ها" showValue />`,
    props: [
      { name: "value / max", type: "number", desc: "مقدار و بیشینه (پیش‌فرض ۱۰۰)." },
      { name: "showValue", type: "boolean", desc: "درصد با ارقام فارسی سمت چپ." },
    ],
    promptBullets: ["role=\"progressbar\" with aria-valuenow; fill with width and a transition.", "Percent with Persian «٪» and Persian digits."],
  },
  {
    slug: "skeleton", name: "اسکلت", cat: "feedback", file: ui("skeleton"),
    desc: "جای خالی ضربان‌دار یا درخشان تا وقتی داده برسد.",
    usage: `import { Skeleton, SkeletonRow } from "@/components/ui/skeleton"

<Skeleton className="h-24 w-full rounded-lg" shimmer />
<SkeletonRow />`,
    props: [{ name: "shimmer", type: "boolean", desc: "موج نور به‌جای ضربان." }],
    promptBullets: ["Two modes: pulse and shimmer (gradient moving right to left); aria-hidden."],
  },
  {
    slug: "empty-state", name: "حالت خالی", cat: "feedback", file: ui("empty-state"), deps: ["lucide-react"],
    desc: "حالت خالی برای وقتی هنوز داده‌ای نیست، با توضیح و دکمه‌ی قدم بعدی.",
    usage: `import { EmptyState } from "@/components/ui/empty-state"

<EmptyState title="هنوز سفارشی ندارید" description="اولین محصول را اضافه کنید تا این‌جا پر شود." action={<Button size="sm">افزودن محصول</Button>} />`,
    props: [
      { name: "icon", type: "Component", default: "Inbox", desc: "آیکون بالای متن." },
      { name: "action", type: "ReactNode", desc: "دکمه‌ی عمل پیشنهادی." },
    ],
    promptBullets: ["Dashed border, icon in a gray circle, short title and description, and one button."],
  },
  {
    slug: "badge", name: "نشان", cat: "display", file: ui("badge"),
    desc: "برچسب وضعیت با متن رنگی، بدون پس‌زمینه و آیکون.",
    usage: `import { Badge } from "@/components/ui/badge"

<Badge variant="success">فعال</Badge>
<Badge variant="warning">در انتظار</Badge>`,
    props: [{ name: "variant", type: '"default" | "secondary" | "outline" | "success" | "warning" | "brand" | "destructive"', default: '"default"', desc: "رنگ متن." }],
    promptBullets: ["Text only, no background and no icon; text-xs and font-medium.", "Color from the variant token: success, warning, brand, destructive."],
  },
  {
    slug: "avatar", name: "آواتار", cat: "display", file: ui("avatar"),
    desc: "تصویر دایره‌ای کاربر که اگر تصویر نباشه، حرف اول اسم را با حلقه‌ی سفید نشان میده.",
    usage: `import { Avatar, AvatarGroup } from "@/components/ui/avatar"

<Avatar name="سارا محمدی" src="/avatars/sara.jpg" />
<Avatar name="علی رضایی" />
<AvatarGroup people={[{ name: "سارا", src: "/avatars/sara.jpg" }, { name: "علی", src: "/avatars/ali.jpg" }, { name: "نگار" }, { name: "رضا" }, { name: "مینا" }]} max={4} />`,
    props: [
      { name: "name", type: "string", desc: "title و حرف اول وقتی تصویر نیست." },
      { name: "src", type: "string", desc: "آدرس تصویر. اگر نباشه، حرف اول اسم سفید نشان داده میشه." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "اندازه." },
    ],
    promptBullets: ["If src is set, a circular image only, no fill or gradient.", "If there is no image, a white first letter, a white ring, and a transparent background.", "AvatarGroup overlaps with -ms-2 and a «+۱۲ نفر دیگر» trailer."],
  },
  {
    slug: "table", name: "جدول", cat: "display", file: ui("table"), wide: true,
    desc: "جدول با ستون‌هایی که از راست شروع میشن، مبلغ‌های تومانی و سطرهایی که با هاور برجسته میشن.",
    usage: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

<Table>
  <TableHeader><TableRow><TableHead>مشتری</TableHead><TableHead>مبلغ</TableHead></TableRow></TableHeader>
  <TableBody>
    <TableRow><TableCell>مریم احمدی</TableCell><TableCell numeric>{formatToman(2_890_000)}</TableCell></TableRow>
  </TableBody>
</Table>`,
    props: [{ name: "numeric", type: "boolean", desc: "روی TableCell، ارقام هم‌عرض برای ستون مبلغ." }],
    promptBullets: ["th with text-start; header row on a muted background; rows hover:bg-accent/40.", "Numeric cells tabular-nums and amounts with «تومان»."],
  },
  {
    slug: "stat", name: "آمار", cat: "display", file: ui("stat"), deps: ["lucide-react"],
    desc: "عدد کلیدی با میزان تغییرش نسبت به دوره‌ی قبل.",
    usage: `import { Stat } from "@/components/ui/stat"

<Stat label="درآمد این ماه" value={faNumber(216_000_000)} unit="تومان" delta={18} />`,
    props: [
      { name: "delta", type: "number", desc: "درصد تغییر. مقدار منفی قرمز و رو به پایین نشان داده میشه." },
      { name: "unit", type: "ReactNode", desc: "واحد کنار عدد." },
    ],
    promptBullets: ["Growth arrow points up-left (ArrowUpLeft) because \"forward\" in RTL is left.", "Positive text-success, negative text-destructive."],
  },
  {
    slug: "price", name: "قیمت", cat: "display", file: ui("price"),
    desc: "قیمت با جداکننده‌ی هزارگان، درصد تخفیف و واحد.",
    usage: `import { Price } from "@/components/ui/price"

<Price amount={12_450_000} original={14_900_000} />`,
    props: [
      { name: "amount / original", type: "number", desc: "قیمت فعلی و قبلی. درصد تخفیف خودکار حساب میشه." },
      { name: "unit", type: "string", default: '"تومان"', desc: "واحد." },
    ],
    promptBullets: ["Separator «٬» (U+066C), unit after the number, original price line-through, discount percent in a badge."],
  },
  {
    slug: "timeline", name: "خط زمان", cat: "display", file: ui("timeline"), registryDeps: ["jalali"],
    desc: "خط زمان رویدادها با تاریخ شمسی و خطی که در سمت راست قرار می‌گیره.",
    usage: `import { Timeline } from "@/components/ui/timeline"

<Timeline items={[{ date: new Date(), title: "سفارش تحویل شد" }, { date: "۲۳ شهریور", title: "بسته ارسال شد" }]} />`,
    props: [
      { name: "items", type: "{ date: Date | string; title; description? }[]", desc: "Date به شمسی تبدیل میشه." },
      { name: "activeIndex", type: "number", default: "0", desc: "رویداد پررنگ." },
    ],
    promptBullets: ["Vertical line with border-s on the right and dots on it; date under the title as text-xs."],
  },
  {
    slug: "accordion", name: "آکاردئون", cat: "display", file: ui("accordion"), deps: ["lucide-react"],
    desc: "آکاردئون برای پرسش‌های متداول، با شورون در سمت چپ و ارتفاعی که با CSS grid انیمیت میشه.",
    usage: `import { Accordion } from "@/components/ui/accordion"

<Accordion items={[{ id: "free", title: "آیا رایگان است؟", content: "بله، بدون پلن پولی." }]} defaultOpen={["free"]} />`,
    props: [
      { name: "multiple", type: "boolean", desc: "چند پنل هم‌زمان باز باشن." },
      { name: "defaultOpen", type: "string[]", desc: "شناسه‌ی پنل‌های باز اولیه." },
    ],
    promptBullets: ["Height animation via grid-template-rows: 0fr → 1fr, no measuring.", "Button with aria-expanded and aria-controls; chevron on the left that rotates 180deg."],
  },
  {
    slug: "kbd", name: "کلید میانبر", cat: "display", file: ui("kbd"),
    desc: "نمایش میانبرهای کیبورد که همیشه چپ‌به‌راست می‌مونه.",
    usage: `import { Kbd } from "@/components/ui/kbd"

<Kbd keys={["⌘", "K"]} />`,
    props: [{ name: "keys", type: "string[]", desc: "کلیدها به ترتیب فشردن." }],
    promptBullets: ["dir=\"ltr\" on the container so «⌘ K» reads in the right order; mono font and a 1px bottom shadow."],
  },
  {
    slug: "prompt-input", name: "جعبه‌ی پرامپت", cat: "form", file: ui("prompt-input"), wide: true, deps: ["lucide-react"],
    desc: "ورودی چت هوش مصنوعی با قابلیت بزرگ شدن، پیوست، انتخاب مدل و دکمه‌ی ارسال/توقف.",
    usage: `import { PromptInput } from "@/components/ui/prompt-input"

<PromptInput loading={streaming} onSubmit={send} onStop={stop} placeholder="یک فرم ثبت‌نام فارسی بساز…" />`,
    props: [
      { name: "onSubmit", type: "(value: string) => void", desc: "با Enter یا دکمه‌ی ارسال. Shift+Enter خط جدید می‌آوره." },
      { name: "loading / onStop", type: "boolean / () => void", desc: "در حال تولید، به‌جای ارسال دکمه‌ی توقف نشان داده میشه." },
      { name: "tools", type: "ReactNode", desc: "جایگزین انتخاب مدل در نوار ابزار." },
    ],
    promptBullets: ["Textarea auto-grows up to 200px; Enter submits, Shift+Enter is a newline, ignore isComposing.", "Send button at the end (left) and tools at the start (right); loading shows a square stop button."],
  },
  {
    slug: "card", name: "کارت", cat: "display", file: ui("card"),
    desc: "کادر محتوا با سربرگ، عنوان و توضیح.",
    usage: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader><CardTitle>هدف ماهانه</CardTitle><CardDescription>۷۲٪ از ۳۰۰ میلیون تومان</CardDescription></CardHeader>
  <CardContent>…</CardContent>
</Card>`,
    promptBullets: ["1px border from the border token, card background, radius from --radius; no heavy shadow."],
  },
  {
    slug: "data-table", name: "جدول داده", cat: "data", file: ui("data-table"), wide: true, deps: ["lucide-react"], registryDeps: ["table", "pagination", "skeleton", "empty-state", "input"],
    desc: "جدول داده با مرتب‌سازی، فیلتر متنی، ستون‌های تومانی، اسکلت بارگذاری، حالت خالی و صفحه‌بندی، همه در سمت کلاینت.",
    usage: `import { DataTable, type Column } from "@/components/ui/data-table"

const columns: Column<Order>[] = [
  { key: "customer", header: "مشتری", sortable: true },
  { key: "amount", header: "مبلغ", sortable: true, numeric: true, cell: (o) => formatToman(o.amount) },
  { key: "status", header: "وضعیت", cell: (o) => <Badge>{o.status}</Badge> },
]
<DataTable rows={orders} columns={columns} rowKey={(o) => o.id} searchKeys={["customer"]} pageSize={8} />`,
    props: [
      { name: "columns", type: "Column<T>[]", desc: "key، header، sortable، numeric، cell، className." },
      { name: "searchKeys", type: "(keyof T)[]", desc: "فیلدهای جست‌وجو. اعداد فارسی و لاتین یکی حساب میشن." },
      { name: "loading", type: "boolean", desc: "ردیف‌های اسکلتی به‌جای داده." },
      { name: "pageSize", type: "number", default: "8", desc: "تعداد در هر صفحه." },
      { name: "toolbar", type: "ReactNode", desc: "فیلترهای اضافه کنار جست‌وجو." },
    ],
    notes: ["رشته‌ها با localeCompare('fa') مرتب میشن تا ترتیب الفبای فارسی درست باشه و ستون‌های numeric عددی مرتب میشن.", "جست‌وجو قبل از مقایسه اعداد فارسی را لاتین می‌کنه، پس «۱۴۰۵۲» و «14052» هر دو پیدا میشن."],
    promptBullets: ["Columns from config (key/header/sortable/numeric/cell); header click cycles asc, desc, unsorted and sets aria-sort.", "Text filter on searchKeys with Persian-digit normalization; loading uses Skeleton, empty uses EmptyState inside a colSpan row.", "Pagination with Persian digits and «صفحه‌ی ۲ از ۵»."],
  },
  {
    slug: "chart", name: "نمودار", cat: "data", file: ui("chart"), wide: true, registryDeps: ["jalali"],
    desc: "نمودار میله‌ای، خطی و اسپارک‌لاین با SVG خالص، با برچسب‌های شمسی، هفته‌ای که از شنبه شروع میشه، تیک‌های فارسی و محور مقدار در سمت راست.",
    usage: `import { BarChart, LineChart, Sparkline, jalaliWeekLabels, jalaliDayLabels } from "@/components/ui/chart"

const week = jalaliWeekLabels() // ["ش","ی","د","س","چ","پ","ج"] ending today
<BarChart data={week.map((label, i) => ({ label, value: sales[i] }))} highlight={6} />
<LineChart data={jalaliDayLabels(10).map((label, i) => ({ label, value: visits[i] }))} />
<Sparkline data={[3, 5, 4, 8, 7, 9]} />`,
    props: [
      { name: "data", type: "{ label: string; value: number }[]", desc: "نقطه‌ها. اولی سمت راست رسم میشه." },
      { name: "format", type: "(n) => string", default: "compactFa", desc: "قالب تیک‌ها، مثل «۱۲ میلیون» و «۸۰۰ هزار»." },
      { name: "highlight", type: "number", desc: "شاخص میله‌ی برجسته (مثلاً امروز)." },
      { name: "height", type: "number", default: "180", desc: "ارتفاع viewBox." },
    ],
    notes: ["بدون کتابخانه‌ی نمودار، فقط SVG با viewBox و عرض ۱۰۰٪. برای داشبوردهای سنگین همین هندسه را میشه به Recharts منتقل کرد.", "jalaliWeekLabels از شنبه شروع نمی‌کنه و هفت روز اخیر را با نام روز شمسی برمی‌گردونه. برای هفته‌ی تقویمی ثابت از JALALI_WEEKDAYS_SHORT استفاده کنید."],
    promptBullets: ["x of the first point is on the right (x = width − pad − (i+1)·slot) and the value axis labels sit on the right edge.", "\"Nice\" ticks (1, 2, 2.5, 5 × power of 10) and compact Persian formatting; simple hover tooltip.", "Time labels from the Jalali calendar; weekly short names ش to ج."],
  },
  {
    slug: "popover", name: "پاپ‌آور", cat: "overlay", file: ui("popover"),
    desc: "پنل کوچکی که به دکمه می‌چسبه و با کلیک بیرون یا Escape بسته میشه.",
    usage: `import { Popover } from "@/components/ui/popover"

<Popover trigger={<Button variant="outline">فیلتر</Button>} align="start">
  …
</Popover>`,
    props: [{ name: "side / align", type: '"top"|"bottom" / "start"|"center"|"end"', default: "bottom / start", desc: "جهت و تراز نسبت به دکمه." }, { name: "open / onOpenChange", type: "boolean", desc: "حالت کنترل‌شده." }],
    promptBullets: ["role=dialog and aria-expanded on the button; start aligns to the trigger's inline-start (right in RTL).", "Portal into document.body with position:fixed from getBoundingClientRect so overflow:hidden ancestors cannot clip it; no positioning library."],
  },
  {
    slug: "context-menu", name: "منوی راست‌کلیک", cat: "overlay", file: ui("context-menu"), registryDeps: ["dropdown-menu"],
    desc: "منویی که در نقطه‌ی راست‌کلیک باز میشه، با همان آیتم‌های منوی کشویی.",
    usage: `import { ContextMenu } from "@/components/ui/context-menu"

<ContextMenu items={[{ label: "ویرایش", icon: Pencil }, { type: "separator" }, { label: "حذف", danger: true }]}>
  <div className="rounded-xl border p-8">راست‌کلیک کنید</div>
</ContextMenu>`,
    promptBullets: ["onContextMenu preventDefault and store relative coords; menu is absolute at that point.", "Close on outside click, Escape, and scroll."],
  },
  {
    slug: "hover-card", name: "کارت شناور", cat: "overlay", file: ui("hover-card"),
    desc: "کارتی که با نگه‌داشتن ماوس یا فوکوس باز میشه، مناسب پیش‌نمایش پروفایل.",
    usage: `import { HoverCard } from "@/components/ui/hover-card"

<HoverCard trigger={<a href="#" className="underline">@negar</a>}>
  <ProfilePreview />
</HoverCard>`,
    props: [{ name: "openDelay / closeDelay", type: "number", default: "300 / 150", desc: "تأخیر باز و بسته شدن (میلی‌ثانیه)." }],
    promptBullets: ["Open/close timers with delay so a fast mouse pass does not open it; open immediately on focus.", "Portal into document.body with position:fixed so overflow:hidden ancestors cannot clip it; keep the close delay so the pointer can reach the card."],
  },
  {
    slug: "carousel", name: "اسلایدر", cat: "display", file: ui("carousel"), wide: true, deps: ["lucide-react"],
    desc: "اسلایدر با اسکرول‌اسنپ بومی و راست‌چین واقعی، که اولین اسلاید سمت راسته و «بعدی» به چپ میره.",
    usage: `import { Carousel } from "@/components/ui/carousel"

<Carousel slideWidth={0.5}>
  {products.map((p) => <ProductCard key={p.id} {...p} />)}
</Carousel>`,
    props: [{ name: "slideWidth", type: "number", default: "1", desc: "سهم هر اسلاید از عرض (۰٫۵ = دو تا در دید)." }, { name: "showDots", type: "boolean", default: "true", desc: "نقطه‌های پایین." }],
    notes: ["در مرورگرهای امروزی scrollLeft ظرف RTL از صفر شروع میشه و منفی میره. همین باعث میشه «بعدی» یعنی scrollTo با left منفی."],
    promptBullets: ["Flex container with snap-x snap-mandatory and overflow-x-auto; slides are shrink-0 snap-start.", "Active index from Math.abs(scrollLeft) / slide width; previous button on the right with a right chevron, next on the left with a left chevron."],
  },
  {
    slug: "combobox-async", name: "کمبوباکس آنلاین", cat: "form", file: ui("combobox-async"), deps: ["lucide-react"],
    desc: "جست‌وجوی سمت سرور با debounce، لغو درخواست‌های قدیمی و حالت‌های بارگذاری، خالی و خطا، مناسب شهر و محصول.",
    usage: `import { ComboboxAsync } from "@/components/ui/combobox-async"

<ComboboxAsync
  placeholder="نام شهر…"
  loadOptions={async (q, signal) => {
    const res = await fetch(\`/api/cities?q=\${encodeURIComponent(q)}\`, { signal })
    return res.json() // [{ value, label, hint }]
  }}
  onChange={setCity}
/>`,
    props: [{ name: "loadOptions", type: "(q, signal) => Promise<Option[]>", desc: "با signal درخواست قدیمی را لغو کنید." }, { name: "debounce / minChars", type: "number", default: "250 / 1", desc: "تأخیر و حداقل حروف." }],
    promptBullets: ["AbortController per search; ignore responses from aborted requests.", "Three list states: «در حال جست‌وجو…», «چیزی پیدا نشد», «خطا در دریافت»; spinner at the end of the field.", "Highlight the matched span; use ZWJ so Persian letter joining does not break.", "Keep the keyboard-active option scrolled into view (scrollIntoView block nearest)."],
  },
  {
    slug: "password-input", name: "رمز عبور", cat: "form", file: ui("password-input"), deps: ["lucide-react"],
    desc: "رمز عبور با نمایش و پنهان کردن، همیشه چپ‌چین، همراه سنجش قدرت با برچسب فارسی.",
    usage: `import { PasswordInput } from "@/components/ui/password-input"

<PasswordInput strength placeholder="حداقل ۸ کاراکتر" />`,
    props: [{ name: "strength", type: "boolean", desc: "نوار چهارقسمتی و برچسب «ضعیف تا عالی»." }],
    promptBullets: ["Field dir=ltr so characters appear in typing order; eye button with aria-pressed.", "Strength from length, upper/lower case, digits, and symbols; bar color from destructive to success."],
  },
  {
    slug: "iban-input", name: "شماره‌ی شبا", cat: "form", file: ui("iban-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "شماره‌ی شبا با پیشوند ثابت IR، گروه‌بندی چهارتایی، اعتبارسنجی mod-97 و تشخیص بانک.",
    usage: `import { IbanInput } from "@/components/ui/iban-input"

<IbanInput onChange={(iban, valid) => setIban(valid ? iban : null)} />`,
    props: [{ name: "onChange", type: "(iban, valid) => void", desc: "شبا نرمال‌شده (IR + ۲۴ رقم) و اعتبار." }],
    notes: ["الگوریتم این‌طوریه که رشته‌ی بعد از IR + «1827» + دو رقم کنترل، به پیمانه‌ی ۹۷ باید ۱ بشه. نام بانک هم از سه رقم بعد از ارقام کنترل درمی‌آد."],
    promptBullets: ["Fixed IR outside the input; input is 24 digits grouped every 4 with font-mono.", "mod-97 validation and bank name from the three-digit code; show the error only when all 24 digits are filled."],
  },
  {
    slug: "phone-input", name: "شماره‌ی موبایل", cat: "form", file: ui("phone-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "شماره‌ی موبایل با +۹۸ ثابت در چپ، گروه‌بندی ۳-۳-۴، تشخیص اپراتور و پذیرش اعداد فارسی و صفر اول.",
    usage: `import { PhoneInput } from "@/components/ui/phone-input"

<PhoneInput onChange={(digits, valid) => valid && setPhone(digits)} />`,
    props: [{ name: "onChange", type: "(digits, valid) => void", desc: "ده رقم ملی («912…») و اعتبار." }],
    promptBullets: ["Normalize: strip +98, 0098, and a leading zero; convert Persian digits to Latin.", "Operator from the prefix (همراه اول، ایرانسل، رایتل); inputMode=tel and autoComplete=tel-national."],
  },
  {
    slug: "notification-inbox", name: "صندوق اعلان", cat: "feedback", file: ui("notification-inbox"), deps: ["lucide-react"], registryDeps: ["popover", "persian"],
    desc: "زنگ اعلان با شمارنده‌ی نخوانده و پنلی که اعلان‌ها را به امروز، دیروز و قدیمی‌تر گروه می‌کنه، با زمان نسبی فارسی.",
    usage: `import { NotificationInbox } from "@/components/ui/notification-inbox"

<NotificationInbox items={notifications} onRead={markRead} onReadAll={markAllRead} />`,
    props: [{ name: "items", type: "Notification[]", desc: "id، title، description، date، read، icon، href." }],
    promptBullets: ["Group by day difference from today; relative time like «۵ دقیقه پیش» and «دیروز».", "All/unread tabs, a «خواندن همه» button, brand dot on unread items."],
  },
  {
    slug: "form", name: "فرم", cat: "form", file: ui("form"), registryDeps: ["persian"],
    desc: "هوک useForm شصت‌خطی با مقدارها، نقشه‌ی خطا، اعتبارسنج‌های فارسی (موبایل، شبا، کد ملی) و FormField، بدون کتابخانه‌ی فرم.",
    usage: `import { useForm, rules, FormField, FormErrors } from "@/components/ui/form"

const form = useForm({
  initial: { name: "", phone: "", nationalId: "" },
  schema: { name: [rules.required()], phone: [rules.required(), rules.mobile()], nationalId: [rules.nationalId()] },
  onSubmit: async (values) => save(values),
})

<form onSubmit={form.handleSubmit} className="space-y-4">
  <FormField label="نام" htmlFor="name" error={form.field("name").error} required>
    <Input {...form.field("name")} />
  </FormField>
  <FormErrors errors={form.errors} labels={{ name: "نام", phone: "موبایل" }} />
  <Button type="submit" disabled={form.submitting}>ثبت</Button>
</form>`,
    props: [
      { name: "useForm({ initial, schema, onSubmit })", type: "hook", desc: "values، errors، touched، field(name)، handleSubmit، reset، isValid." },
      { name: "rules", type: "required · minLength · pattern · mobile · iban · nationalId · email · equals", desc: "پیام‌های فارسی پیش‌فرض، قابل تغییر." },
      { name: "FormField", type: "component", desc: "برچسب، ستاره‌ی الزامی، پیام خطا با role=alert." },
    ],
    promptBullets: ["Hook with useState; validate a field after blur and every field on submit; the first failing rule supplies the message.", "field(name) returns id/name/value/onChange/onBlur/error so it spreads onto Input.", "FormErrors is a summary of errors with links to the fields."],
  },
  {
    slug: "national-id-input", name: "کد ملی", cat: "form", file: ui("national-id-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "کد ملی ده‌رقمی با گروه‌بندی ۳-۶-۱ مثل روی کارت، اعتبارسنجی رقم کنترل و نگه‌داشتن صفر اول.",
    usage: `import { NationalIdInput } from "@/components/ui/national-id-input"

<NationalIdInput onChange={(digits, valid) => setNationalId(valid ? digits : null)} />`,
    props: [
      { name: "value", type: "string", desc: "ده رقم لاتین. رشته بمونه تا صفر اول حذف نشه." },
      { name: "onChange", type: "(digits, valid) => void", desc: "رقم‌های نرمال‌شده و نتیجه‌ی اعتبارسنجی." },
    ],
    notes: ["الگوریتم این‌طوریه که رقم‌ها ضرب در وزن ۱۰ تا ۲ جمع میشن و باقی‌مانده بر ۱۱ بررسی میشه. کدهای یکنواخت مثل ۱۱۱۱۱۱۱۱۱۱ رد میشن.", "خطا فقط بعد از رقم دهم نشان داده میشه تا هنگام تایپ مزاحم نباشه."],
    promptBullets: ["dir=ltr field; digits shown in Persian with the 3-6-1 grouping «۰۰۱-۲۳۴۵۶۷-۸»; store the value as a string.", "Checksum: weights 10…2, sum mod 11; reject all-same digits. Show the error only once ten digits are typed, a check icon when valid."],
  },
  {
    slug: "card-number-input", name: "شماره‌ی کارت", cat: "form", file: ui("card-number-input"), deps: ["lucide-react"], registryDeps: ["persian"],
    desc: "شماره‌ی کارت در چهار گروه چهارتایی، با تشخیص بانک از شش رقم اول و اعتبارسنجی Luhn بعد از رقم شانزدهم.",
    usage: `import { CardNumberInput } from "@/components/ui/card-number-input"

<CardNumberInput onChange={(digits, valid, bank) => valid && setCard({ digits, bank })} />`,
    props: [
      { name: "onChange", type: "(digits, valid, bank) => void", desc: "شانزده رقم لاتین، نتیجه‌ی Luhn و نام بانک (یا null)." },
    ],
    notes: ["جدول پیش‌شماره‌ها در lib/persian.ts هست و بانک‌های ادغام‌شده (انصار، قوامین، حکمت، مهر اقتصاد، کوثر) زیر نام سپه می‌آن.", "autoComplete=\"cc-number\" را نگه دارید تا مرورگر کارت ذخیره‌شده را پیشنهاد کند."],
    promptBullets: ["dir=ltr field; Persian digits grouped in fours; inputMode=numeric and autoComplete=cc-number.", "Bank name from the first six digits (BIN table for Iranian banks) shown under the field with a bank icon; Luhn error only when all 16 digits are in."],
  },
  {
    slug: "plate-input", name: "پلاک خودرو", cat: "form", file: ui("plate-input"), registryDeps: ["persian"],
    desc: "پلاک خودرو با چیدمان واقعی (دو رقم، حرف، سه رقم و کد شهر)، انتخاب حرف از فهرست با معنی هر حرف و تایپ پیوسته بین جعبه‌ها.",
    usage: `import { PlateInput } from "@/components/ui/plate-input"
import { stringifyPlate } from "@/lib/persian"

<PlateInput onChange={(plate, complete) => complete && setPlate(stringifyPlate(plate))} />

// فقط تاکسی:
<PlateInput letters={["ت"]} />`,
    props: [
      { name: "value / defaultValue", type: "PlateValue", desc: "{ left, letter, middle, region } با رقم‌های لاتین." },
      { name: "onChange", type: "(value, complete) => void", desc: "complete وقتی هر چهار بخش پر و حرف مجاز باشه." },
      { name: "letters", type: "string[]", desc: "محدود کردن حرف‌های مجاز، مثلاً [\"ت\"] برای تاکسی." },
      { name: "name", type: "string", desc: "ورودی مخفی با مقدار «12ب345-11» برای فرم معمولی." },
    ],
    notes: ["خود پلاک dir=\"ltr\" هست چون روی فلز از چپ خوانده میشه، ولی فهرست حرف‌ها rtl هست و کلیدهای چپ و راست در آن برعکس میشن.", "تایپ حرف روی جعبه‌ی حرف هم کار می‌کنه و ي و ك عربی به ی و ک، و «ا» به «الف» تبدیل میشه.", "پیست کردن کل پلاک در جعبه‌ی اول همه‌ی بخش‌ها را پر می‌کنه."],
    promptBullets: ["Plate frame dir=ltr: a dark «I.R. IRAN» strip, a 2-digit box, a letter button, a 3-digit box, then a divided «ایران» box with the 2-digit region code.", "The letter button opens an RTL listbox grid of legal plate letters with a footer naming the class (تاکسی، دولتی، شخصی…); arrow keys, typeahead, Escape, and focus return.", "Typing auto-advances between boxes, Backspace on an empty box goes back, and pasting «12ب345-11» fills everything."],
  },
  {
    slug: "date-range-picker", name: "بازه‌ی تاریخ شمسی", cat: "form", file: ui("date-range-picker"), wide: true, deps: ["lucide-react"], registryDeps: ["jalali"],
    desc: "بازه‌ی تاریخ شمسی با دو ماه کنار هم، پیش‌نمایش بازه با هاور، بازه‌های آماده مثل «۷ روز گذشته» و شمارش روزها.",
    usage: `import { DateRangePicker, RangeCalendar, formatJalaliRange } from "@/components/ui/date-range-picker"

<DateRangePicker onChange={(r) => r.from && r.to && load(r)} min={new Date()} />

// تقویم بدون فیلد:
<RangeCalendar months={2} defaultValue={{ from, to }} />`,
    props: [
      { name: "value / defaultValue", type: "{ from: Date | null; to: Date | null }", desc: "دو سر بازه با Date معمولی. اگر پایان قبل از شروع انتخاب بشه، جابه‌جا میشن." },
      { name: "months", type: "1 | 2", default: "۲ در فیلد، ۱ در تقویم", desc: "تعداد ماه‌های کنار هم. زیر ۶۴۰ پیکسل زیر هم میرن." },
      { name: "presets", type: "RangePreset[]", default: "defaultRangePresets", desc: "چیپ‌های بالای تقویم. برای حذف [] بدید." },
      { name: "min / max", type: "Date", desc: "روزهای خارج از بازه غیرفعال میشن." },
    ],
    notes: ["نوار بین دو سر بازه با rounded-s و rounded-e گرد میشه، نه left و right، چون هفته از راست به چپ میره.", "نمایش متنی بازه کوتاه میشه، مثل «۱۲ تا ۲۵ مهر ۱۴۰۵»، و فقط وقتی سال فرق کنه سال هر دو سر می‌آد."],
    promptBullets: ["RangeCalendar: first click = start, second = end (swap if earlier), third starts over; hovering previews the band before the end is chosen.", "Band cells use bg-accent with rounded-s-md on the start and rounded-e-md on the end; ends use bg-primary. Week starts Saturday, Fridays muted.", "DateRangePicker field shows «۱۲ تا ۲۵ مهر ۱۴۰۵», closes once both ends are picked, has preset chips (امروز، ۷ روز گذشته، ۳۰ روز گذشته، این ماه) and a clear button."],
  },
  {
    slug: "time-picker", name: "انتخاب ساعت", cat: "form", file: ui("time-picker"), deps: ["lucide-react"],
    desc: "انتخاب ساعت ۲۴ساعته با دو بخش تایپی و اعداد فارسی، کلیدهای بالا و پایین برای تغییر و فهرست ساعت و دقیقه برای ماوس.",
    usage: `import { TimePicker } from "@/components/ui/time-picker"

<TimePicker step={15} min="09:00" max="18:00" onChange={(t) => setTime(t)} /> // "14:30"`,
    props: [
      { name: "value", type: "string | null", desc: "«HH:mm» با رقم لاتین، مثل \"14:30\"." },
      { name: "step", type: "1 | 5 | 10 | 15 | 30", default: "5", desc: "گام ستون دقیقه. تایپ دستی هر دقیقه‌ای را می‌پذیره." },
      { name: "min / max", type: "string", desc: "بازه‌ی مجاز. گزینه‌های بیرون از آن غیرفعال میشن و مقدار تایپی بیرون از آن خطا می‌گیره." },
    ],
    notes: ["ایران ساعت را ۲۴ساعته می‌نویسه و صبح و عصر نداره.", "فیلد dir=\"ltr\" هست چون ساعت:دقیقه در متن فارسی هم از چپ خوانده میشه، ولی برچسب‌ها فارسی می‌مونن."],
    promptBullets: ["Two segments (hour, minute) that behave like a native time input: a high first digit pads itself, «:» or → moves to minutes, ↑/↓ steps, Backspace on an empty minute goes back.", "Dropdown with an hours column and a minutes column (step), selected item scrolled into view; footer with «الان» and «تأیید».", "Value is \"HH:mm\" in Latin digits; display uses Persian digits, 24-hour clock."],
  },
  {
    slug: "amount-input", name: "مبلغ", cat: "form", file: ui("amount-input"), registryDeps: ["number-to-words"],
    desc: "ورودی مبلغ با جداکننده‌ی هزارگان هنگام تایپ، واحد بعد از عدد و مبلغ به حروف زیر فیلد، مثل «یک میلیون و دویست و پنجاه هزار تومان».",
    usage: `import { AmountInput } from "@/components/ui/amount-input"

<AmountInput min={10_000} max={50_000_000} quick={[100_000, 500_000, 1_000_000]} onChange={setAmount} />`,
    props: [
      { name: "value / defaultValue", type: "number | null", desc: "مقدار عددی خام. نمایش با «٬» و اعداد فارسیه." },
      { name: "unit", type: "string", default: "«تومان»", desc: "واحد در انتهای فیلد و آخر جمله‌ی حروفی." },
      { name: "words", type: "boolean", default: "true", desc: "نمایش مبلغ به حروف زیر فیلد." },
      { name: "quick", type: "number[]", desc: "چیپ‌های مبلغ آماده با برچسب کوتاه، مثل «۵۰۰ هزار» و «۱ میلیون»." },
    ],
    notes: ["تبدیل عدد به حروف در lib/number-to-words.ts هست و جدا هم میشه ازش استفاده کرد، با numberToWords، tomanToWords و rialToWords.", "«هزار» بدون «یک» می‌آد (هزار تومان، نه یک هزار تومان) ولی از میلیون به بالا «یک میلیون» نوشته میشه."],
    promptBullets: ["Numeric text field; strip non-digits (Persian digits accepted), keep a plain number in state, render with «٬» and Persian digits; unit at the end.", "Under the field spell the amount in Persian words with the unit; min/max errors replace it.", "Optional quick chips that set common amounts, labelled «۱۰۰ هزار» / «۱ میلیون»."],
  },
  {
    slug: "search-input", name: "جست‌وجو", cat: "form", file: ui("search-input"), deps: ["lucide-react"],
    desc: "فیلد جست‌وجو با ذره‌بین، دکمه‌ی پاک کردن، حالت بارگذاری و تأخیر کوتاه قبل از جست‌وجو تا با هر حرف درخواست نفرستید.",
    usage: `import { SearchInput } from "@/components/ui/search-input"

<SearchInput placeholder="نام محصول…" loading={isPending} onSearch={(q) => search(q)} shortcut="⌘K" />`,
    props: [
      { name: "onSearch", type: "(value: string) => void", desc: "بعد از مکث تایپ، با Enter و وقتی فیلد پاک میشه صدا زده میشه." },
      { name: "debounce", type: "number", default: "300", desc: "مکث تایپ به میلی‌ثانیه قبل از onSearch." },
      { name: "loading", type: "boolean", desc: "به جای ذره‌بین یک چرخنده نشان میده." },
      { name: "shortcut", type: "string", default: "—", desc: "راهنمای میانبر در انتهای فیلد، مثل «⌘K»، که با تایپ پنهان میشه." },
      { name: "size", type: '"sm" | "md"', default: '"md"', desc: "ارتفاع ۳۲ یا ۴۰ پیکسل." },
    ],
    notes: ["Escape متن را پاک می‌کنه و Enter بدون منتظر ماندن جست‌وجو می‌کنه.", "type=\"search\" هست تا کیبورد موبایل دکمه‌ی جست‌وجو نشان بده، ولی ضربدر بومی مرورگر پنهان شده و دکمه‌ی خودمان جای آن نشسته."],
    promptBullets: ["type=\"search\" with enterKeyHint=\"search\"; hide the WebKit cancel button and render an own clear (X) button at the inline-end once there is text.", "Magnifier at the inline-start (right in RTL); `loading` swaps it for a spinner.", "onSearch fires after a debounce (default 300ms), immediately on Enter, and with \"\" when cleared; Escape clears."],
  },
  {
    slug: "tags-input", name: "برچسب‌ها", cat: "form", file: ui("tags-input"), deps: ["lucide-react"],
    desc: "ورودی چندمقداری که با Enter یا ویرگول فارسی هر عبارت را چیپ می‌کنه، متن چسبانده‌شده را می‌شکنه و تکراری‌ها را نمی‌پذیره.",
    usage: `import { TagsInput } from "@/components/ui/tags-input"

<TagsInput defaultValue={["ری‌اکت", "تیلویند"]} max={5} onChange={setTags} />`,
    props: [
      { name: "value / onChange", type: "string[]", desc: "فهرست برچسب‌ها، کنترل‌شده یا آزاد." },
      { name: "max", type: "number", desc: "سقف تعداد. شمارنده‌ی «۳ / ۵» زیر فیلد می‌آد و بعد از پر شدن، تایپ بسته میشه." },
      { name: "separators", type: "string[]", default: '["،", ","]', desc: "کاراکترهایی که موقع تایپ برچسب را ثبت می‌کنن. Enter همیشه ثبت می‌کنه." },
      { name: "validate", type: "(tag) => string | null", default: "trim", desc: "قبل از افزودن اصلاح یا رد می‌کنه، مثلاً حروف کوچک کردن یا محدودیت طول." },
    ],
    notes: ["Backspace روی فیلد خالی آخرین چیپ را برمی‌داره و با ترک فیلد، متن نیمه‌کاره هم ثبت میشه.", "هر چیپ dir=\"auto\" داره تا برچسب انگلیسی کنار فارسی درست نمایش داده بشه."],
    promptBullets: ["Chips inside a bordered wrapper (focus-within ring) followed by a flex-1 text input; clicking the wrapper focuses the input.", "Enter, «،», «,» and newline commit a tag; paste splits on the same separators; duplicates are ignored; Backspace on empty input removes the last chip.", "Optional max with a Persian «۳ / ۵» counter; each chip has an X button labelled «حذف …»."],
  },
  {
    slug: "multi-select", name: "چندانتخابی", cat: "form", file: ui("multi-select"), deps: ["lucide-react"],
    desc: "فهرست انتخاب چندتایی با جست‌وجو، تیک کنار هر گزینه و چیپ‌هایی که داخل فیلد می‌نشینن و بعد از چند تا به «+۲ مورد دیگر» جمع میشن.",
    usage: `import { MultiSelect } from "@/components/ui/multi-select"

<MultiSelect
  placeholder="مهارت‌ها…"
  options={[{ value: "react", label: "ری‌اکت" }, { value: "next", label: "نکست" }, { value: "ts", label: "تایپ‌اسکریپت" }]}
  max={3}
  onChange={setSkills}
/>`,
    props: [
      { name: "options", type: "{ value; label; disabled? }[]", desc: "گزینه‌ها. جست‌وجو روی label انجام میشه." },
      { name: "value / onChange", type: "string[]", desc: "مقدارهای انتخاب‌شده، کنترل‌شده یا آزاد." },
      { name: "searchable", type: "boolean", default: "true", desc: "فیلد فیلتر بالای فهرست." },
      { name: "maxVisible", type: "number", default: "3", desc: "تعداد چیپ‌هایی که داخل فیلد نشان داده میشن و بقیه به «+n مورد دیگر» تبدیل میشن." },
      { name: "max", type: "number", desc: "سقف انتخاب. بعد از رسیدن به آن، گزینه‌های دیگر غیرفعال میشن." },
    ],
    notes: ["پنل با lib/float.tsx داخل body رندر میشه تا overflow والد آن را نبره و هم‌عرض فیلد باز میشه.", "با کلید پایین فهرست باز میشه، Space یا Enter تیک می‌زنه، Backspace روی جست‌وجوی خالی آخرین چیپ را حذف می‌کنه و Escape می‌بنده."],
    promptBullets: ["Trigger is a focusable div with role=combobox and aria-haspopup=listbox; selected items render as chips with X buttons, overflow collapses into «+۲ مورد دیگر».", "Panel in a fixed portal matching the field width: optional search box on top, ul role=listbox aria-multiselectable with checkbox-style options, footer with «n مورد انتخاب شده» and «پاک کردن».", "Keyboard: ArrowDown opens/moves, ArrowUp moves, Enter/Space toggles, Escape closes, Backspace with empty query removes the last chip; onMouseDown preventDefault on options keeps focus in the search box."],
  },
  {
    slug: "toggle", name: "دکمه‌ی فشاری", cat: "form", file: ui("toggle"),
    desc: "دکمه‌ی دووضعیتی مثل «پررنگ» یا «فقط موجود» و گروهش که یا مثل رادیو یکی را نگه می‌داره یا مثل چک‌باکس چند تا را.",
    usage: `import { Toggle, ToggleGroup } from "@/components/ui/toggle"
import { Bold, Italic, Underline } from "lucide-react"

<Toggle aria-label="پررنگ"><Bold /></Toggle>

<ToggleGroup
  type="single"
  defaultValue="all"
  items={[{ value: "all", label: "همه" }, { value: "instock", label: "موجود" }, { value: "sale", label: "تخفیف‌دار" }]}
/>`,
    props: [
      { name: "pressed / onPressedChange", type: "boolean", desc: "وضعیت دکمه‌ی تکی." },
      { name: "type", type: '"single" | "multiple"', default: '"single"', desc: "در گروه: یکی یا چند تا. در single می‌تونید همان یکی را هم خاموش کنید." },
      { name: "items", type: "{ value; label; aria-label?; disabled? }[]", desc: "گزینه‌های گروه. برای آیکون‌های تنها aria-label بدید." },
      { name: "variant", type: '"default" | "outline"', default: '"default"', desc: "outline دور دکمه یا دور کل گروه خط می‌کشه." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "ارتفاع ۳۲، ۳۶ یا ۴۰ پیکسل." },
    ],
    notes: ["با Switch فرق داره. Switch یک تنظیم را روشن و خاموش می‌کنه و همان لحظه اعمال میشه، ولی Toggle یک حالت نمایش یا فیلتر را می‌گیره.", "کلیدهای چپ و راست بین اعضای گروه می‌گردن و در RTL چپ یعنی بعدی.", "در type=single یک قرص لغزان زیر گزینه‌ی فعال می‌نشینه، مثل کنترل بخشی."],
    promptBullets: ["Button with aria-pressed; pressed state uses bg-secondary text-foreground, unpressed is text-muted-foreground with a hover background.", "ToggleGroup: role=group, type single (one or none) or multiple; ArrowLeft moves to the next item in RTL, ArrowRight to the previous.", "Sizes sm/md/lg (h-8/h-9/h-10) and an outline variant that boxes the whole group.", "single: sliding highlight pill measured from data-value button offsetLeft/offsetWidth; multiple keeps per-button bg-secondary."],
  },
  {
    slug: "segmented-control", name: "کنترل بخشی", cat: "form", file: ui("segmented-control"),
    desc: "چند گزینه‌ی کنار هم با یک قرص که زیر گزینه‌ی فعال سر می‌خوره، برای چیزهایی مثل «هفتگی و ماهانه» یا «فهرست و شبکه».",
    usage: `import { SegmentedControl } from "@/components/ui/segmented-control"

<SegmentedControl
  aria-label="بازه"
  defaultValue="week"
  options={[{ value: "day", label: "روزانه" }, { value: "week", label: "هفتگی" }, { value: "month", label: "ماهانه" }]}
  onChange={setRange}
/>`,
    props: [
      { name: "options", type: "{ value; label; disabled?; aria-label? }[]", desc: "بخش‌ها. عرض همه برابر پهن‌ترین برچسبه." },
      { name: "value / onChange", type: "string", desc: "کنترل‌شده یا آزاد. پیش‌فرض گزینه‌ی اوله." },
      { name: "fullWidth", type: "boolean", default: "false", desc: "کل عرض والد را می‌گیره و بخش‌ها را مساوی تقسیم می‌کنه." },
      { name: "size", type: '"sm" | "md"', default: '"md"', desc: "ارتفاع ۲۸ یا ۳۲ پیکسل." },
    ],
    notes: ["فرقش با Tabs اینه که محتوایی زیرش عوض نمیشه، فقط یک مقدار انتخاب میشه، مثل یک select کوچک با گزینه‌های کم.", "قرص از offsetLeft و offsetWidth خود دکمه اندازه گرفته میشه، پس در RTL هم درست زیر گزینه می‌نشینه و با تغییر اندازه دوباره اندازه‌گیری میشه."],
    promptBullets: ["role=radiogroup with role=radio buttons on a bg-muted track; the active pill is one absolutely positioned span behind the buttons, moved with translateX and width measured from the selected button (offsetLeft/offsetWidth), re-measured by ResizeObserver.", "Equal-width segments via an inline grid with auto-cols-fr; fullWidth switches to a block grid.", "ArrowLeft = next in RTL, ArrowRight = previous; roving tabIndex so only the active segment is in the tab order."],
  },
  {
    slug: "separator", name: "جداکننده", cat: "display", file: ui("separator"),
    desc: "خط نازک افقی یا عمودی از توکن border، با متن وسطش برای جاهایی مثل «یا» بین دو روش ورود.",
    usage: `import { Separator } from "@/components/ui/separator"

<Separator />
<Separator label="یا" />
<div className="flex h-5 items-center gap-3">
  <span>ویرایش</span><Separator orientation="vertical" /><span>حذف</span>
</div>`,
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "عمودی داخل flex با self-stretch ارتفاع می‌گیره." },
      { name: "label", type: "ReactNode", desc: "متن وسط خط افقی." },
      { name: "decorative", type: "boolean", default: "true", desc: "true یعنی برای صفحه‌خوان معنایی نداره. برای جداکننده‌ی معنادار false بدید تا role=separator بگیره." },
    ],
    promptBullets: ["One-pixel line from the border token: h-px w-full for horizontal, w-px self-stretch for vertical.", "With a label: two flex-1 lines around a text-xs muted span.", "decorative → role=none; otherwise role=separator with aria-orientation."],
  },
  {
    slug: "spinner", name: "بارگذاری", cat: "feedback", file: ui("spinner"),
    desc: "حلقه‌ی در حال چرخش که رنگ متن اطرافش را می‌گیره، در چهار اندازه، با متن کنارش یا به شکل لایه‌ای روی کارت.",
    usage: `import { Spinner, LoadingOverlay } from "@/components/ui/spinner"

<Spinner label="در حال دریافت…" />
<Button disabled><Spinner size="xs" className="text-current" /> ثبت</Button>

<div className="relative">
  <LoadingOverlay loading={isPending} />
  …
</div>`,
    props: [
      { name: "size", type: '"xs" | "sm" | "md" | "lg"', default: '"md"', desc: "۱۲ تا ۳۶ پیکسل. xs برای داخل دکمه." },
      { name: "label", type: "ReactNode", desc: "متن کنار حلقه. بدون آن هم صفحه‌خوان «در حال بارگذاری» می‌شنوه." },
      { name: "LoadingOverlay", type: "{ loading; label? }", desc: "لایه‌ی نیمه‌شفاف روی والدی که relative باشه." },
    ],
    promptBullets: ["role=status wrapper; the ring is a border-current circle with border-e-transparent and animate-spin, sized xs/sm/md/lg.", "Color comes from currentColor so text-muted-foreground or text-brand recolors it; sr-only «در حال بارگذاری» when there is no visible label.", "LoadingOverlay: absolute inset-0 bg-background/60 with a centered spinner, inherits the parent's radius."],
  },
  {
    slug: "collapsible", name: "بازشو", cat: "display", file: ui("collapsible"), deps: ["lucide-react"],
    desc: "دکمه‌ی «نمایش بیشتر» که یک بلوک را با انیمیشن ارتفاع باز و بسته می‌کنه و محتوا را از DOM حذف نمی‌کنه تا وضعیت فرم داخلش بمونه.",
    usage: `import { Collapsible } from "@/components/ui/collapsible"

<Collapsible trigger="نمایش جزئیات" openLabel="پنهان کردن">
  <p>هزینه‌ی ارسال بر اساس وزن و شهر مقصد محاسبه می‌شود.</p>
</Collapsible>`,
    props: [
      { name: "trigger", type: "ReactNode", desc: "برچسب دکمه. شورون کنارش خودش می‌چرخه." },
      { name: "openLabel", type: "ReactNode", desc: "برچسب در حالت باز، مثل «پنهان کردن». اگر ندید همان trigger می‌مونه." },
      { name: "open / defaultOpen / onOpenChange", type: "boolean", desc: "کنترل‌شده یا آزاد." },
    ],
    notes: ["انیمیشن با grid-template-rows از 0fr به 1fr انجام میشه، پس ارتفاعی اندازه‌گیری نمیشه و با هر محتوایی کار می‌کنه.", "در حالت بسته، بلوک inert میشه تا لینک و فیلدهای داخلش با Tab پیدا نشن. برای چند بخش پشت سر هم از Accordion استفاده کنید."],
    promptBullets: ["Trigger button with aria-expanded and aria-controls; chevron rotates 180° when open.", "Height animation with a CSS grid wrapper: grid-rows-[0fr] ↔ grid-rows-[1fr], inner div min-h-0 overflow-hidden, ~200ms.", "Content stays mounted; the closed block gets inert and aria-hidden so it leaves the tab order."],
  },
  {
    slug: "scroll-area", name: "ناحیه اسکرول", cat: "display", file: ui("scroll-area"),
    desc: "باکس اسکرول با اسکرول‌بار نازک و هم‌رنگ تم؛ برای لیست‌های بلند و متن‌های اسکرول‌شونده، تا اسکرول‌بار پیش‌فرض ویندوز تم دارک را خراب نکنه.",
    usage: `import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-64 rounded-lg border border-border p-3">
  {items.map((item) => (
    <p key={item} className="border-b border-border py-2 last:border-0">{item}</p>
  ))}
</ScrollArea>`,
    props: [
      { name: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', desc: "محور اسکرول. افقی برای گالری و عمودی برای لیست." },
      { name: "size", type: '"thin" | "md"', default: '"thin"', desc: "ضخامت اسکرول‌بار." },
    ],
    notes: ["با scroll-progress فرق داره؛ آن فقط نوار پیشرفت بالای صفحه است، این خود ظرف اسکرول با اسکرول‌بار قابل استایل است.", "ارتفاع یا عرض ثابت (مثل h-64) بدهید وگرنه محتوا کش می‌آید و اسکرولی دیده نمی‌شود."],
    promptBullets: ["Overflow box with theme scrollbar: scrollbar-width thin, scrollbar-color from --border, webkit thumb rounded-full bg-border, track transparent.", "orientation vertical | horizontal | both; size thin | md for scrollbar thickness.", "min-h-0 min-w-0 so it shrinks inside flex/grid parents; not the page-level scroll-progress bar."],
  },
  {
    slug: "countdown", name: "شمارش معکوس", cat: "display", file: ui("countdown"),
    desc: "تایمر شمارش معکوس با اعداد فارسی؛ برای فلش‌سیلز فروشگاه یا لانچ محصول در لندینگ.",
    usage: `import { Countdown } from "@/components/ui/countdown"

const launch = new Date("2026-10-01T12:00:00+03:30")

<Countdown target={launch} className="max-w-md" />
<Countdown target={launch} units={["hours", "minutes", "seconds"]} variant="inline" size="sm" />`,
    props: [
      { name: "target", type: "Date | string | number", desc: "زمان پایان؛ Date، رشته‌ی ISO یا timestamp." },
      { name: "units", type: '("days" | "hours" | "minutes" | "seconds")[]', default: "هر چهار واحد", desc: "کدام خانه‌ها نشان داده شوند، به ترتیب چپ‌به‌راست." },
      { name: "variant", type: '"cards" | "inline"', default: '"cards"', desc: "کارت‌های جدا یا ۱۲:۳۴:۵۶ با دونقطه." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', desc: "اندازه‌ی رقم و پدینگ." },
      { name: "pad", type: "boolean", default: "true", desc: "رقم‌ها دوخانه‌ای با صفر (۰۰)." },
      { name: "labels", type: "Partial<Record<unit, string>>", desc: "برچسب فارسی هر واحد؛ پیش‌فرض روز/ساعت/دقیقه/ثانیه." },
      { name: "onComplete", type: "() => void", desc: "یک‌بار وقتی به صفر رسید." },
    ],
    notes: ["تا قبل از mount خانه‌ها «--» هستند تا HTML سرور و کلاینت یکی بماند.", "useCountdown را هم می‌توان جدا برای منطق سفارشی import کرد.", "dir=ltr روی رقم‌هاست تا ترتیب روز←ثانیه درست خوانده شود؛ برچسب‌ها فارسی می‌مانند."],
    promptBullets: ["Client timer to a target Date; Persian digits via fa(); labels روز/ساعت/دقیقه/ثانیه; pad to two digits.", "SSR-safe: null until mounted so first paint shows -- placeholders; onComplete fires once at zero.", "variant cards (bordered grid, dir=ltr) or inline colon-separated; units array picks which cells to show."],
  },
  {
    slug: "video-player", name: "پخش‌کننده ویدئو", cat: "education", file: ui("video-player"), wide: true, deps: ["lucide-react"],
    desc: "پخش‌کننده‌ی ویدئوی آموزشی با فصل‌بندی، سرعت پخش، زیرنویس و ادامه از جای قبلی؛ زمان‌ها فارسی و نوار زمان طبق قاعده‌ی رسانه چپ‌به‌راست.",
    usage: `import { VideoPlayer } from "@/components/ui/video-player"

<VideoPlayer
  src="/videos/lesson-3.mp4"
  poster="/videos/lesson-3.webp"
  title="درس ۳: ساختار پوشه‌ها در App Router"
  startAt={lastPosition}
  chapters={[
    { start: 0, title: "مقدمه" },
    { start: 95, title: "پوشه‌ی app و فایل page" },
    { start: 310, title: "layout و مسیرهای تو در تو" },
  ]}
  captions={[{ src: "/videos/lesson-3.fa.vtt", srclang: "fa", label: "فارسی", default: true }]}
  onTimeUpdate={(t) => savePosition(t)}
  onEnded={() => markLessonDone()}
/>`,
    props: [
      { name: "src / poster", type: "string", desc: "آدرس ویدئو و تصویر پیش از پخش." },
      { name: "title", type: "string", desc: "روی لایه‌ی توقف نشان داده میشه و نام دسترس‌پذیر ناحیه است." },
      { name: "chapters", type: "{ start: number; title: string }[]", desc: "فصل‌ها با زمان شروع به ثانیه. روی نوار زمان علامت می‌خورن و فهرست کلیک‌پذیر زیر ویدئو می‌سازن." },
      { name: "captions", type: "{ src; srclang; label; default? }[]", desc: "زیرنویس‌های WebVTT." },
      { name: "showChapters", type: "boolean", default: "true", desc: "نمایش فهرست فصل‌ها زیر ویدئو." },
      { name: "startAt", type: "number", default: "0", desc: "ثانیه‌ی شروع؛ برای «ادامه از جایی که ماندید»." },
      { name: "rates", type: "number[]", default: "[0.75, 1, 1.25, 1.5, 2]", desc: "سرعت‌های قابل انتخاب." },
      { name: "onTimeUpdate / onEnded", type: "(t, duration) => void / () => void", desc: "برای ذخیره‌ی پیشرفت و تیک زدن درس." },
    ],
    notes: [
      "نوار زمان و دکمه‌های پخش عمداً dir=\"ltr\" هستن: پیشرفت رسانه جهت زمان را نشان میده، نه جهت متن (قاعده‌ی bidi متریال). فقط برچسب‌ها و فهرست فصل‌ها راست‌چین‌اند.",
      "میان‌برها وقتی فوکوس روی ویدئوست: Space یا K پخش/توقف، فلش راست/چپ ۵ ثانیه جلو/عقب، M بی‌صدا، F تمام‌صفحه.",
      "هر دکمه حداقل ۴۴ پیکسل است؛ در عرض کم (container query) دکمه‌های ۱۰ ثانیه و بعد زمان پنهان میشن تا کنترل‌ها سرریز نکنن.",
    ],
    promptBullets: [
      "Native <video> with custom controls; aspect-video box reserved before load; big play overlay while paused.",
      "Timeline and transport buttons are dir=\"ltr\" (media progress follows time, not text); seek is a native range with aria-valuetext in Persian («۴:۱۲ از ۱۸:۰۰»).",
      "Chapters: markers on the track, current chapter title above it, clickable chapter list with Persian numbers and LTR timestamps.",
      "Speed menu (menuitemradio) with Persian decimals «۱٫۵×», mute, fullscreen, WebVTT subtitles; all hit targets ≥ 44px.",
      "Keyboard: Space/K toggle, ArrowRight/ArrowLeft ±5s, M mute, F fullscreen; onTimeUpdate/onEnded for resume and completion.",
    ],
  },
  {
    slug: "course-outline", name: "سرفصل دوره", cat: "education", file: ui("course-outline"), deps: ["lucide-react"],
    desc: "سرفصل‌های دوره با فصل‌های بازشو، حلقه‌ی پیشرفت هر فصل، نوع درس (ویدئو، درس‌نامه، آزمونک، تمرین)، مدت، قفل و پیش‌نمایش رایگان.",
    usage: `import { CourseOutline } from "@/components/ui/course-outline"

<CourseOutline
  currentId="l3"
  onSelect={(lesson) => router.push(\`/learn/\${lesson.id}\`)}
  sections={[
    {
      id: "s1", title: "شروع کار",
      lessons: [
        { id: "l1", title: "معرفی دوره", kind: "video", minutes: 6, done: true, preview: true },
        { id: "l2", title: "نصب ابزارها", kind: "reading", minutes: 10, done: true },
        { id: "l3", title: "اولین پروژه", kind: "video", minutes: 18 },
        { id: "l4", title: "آزمونک فصل اول", kind: "quiz", minutes: 5 },
      ],
    },
    { id: "s2", title: "مسیرها", lessons: [{ id: "l5", title: "صفحه‌ی داینامیک", minutes: 22, locked: true }] },
  ]}
/>`,
    props: [
      { name: "sections", type: "{ id; title; lessons: OutlineLesson[] }[]", desc: "فصل‌ها و درس‌ها." },
      { name: "OutlineLesson", type: "{ id; title; kind?; minutes?; done?; locked?; preview? }", desc: "kind یکی از video | reading | quiz | assignment است." },
      { name: "currentId", type: "string", desc: "درس در حال پخش؛ با نوار brand در ابتدای ردیف مشخص میشه و فصلش باز می‌مونه." },
      { name: "onSelect", type: "(lesson) => void", desc: "کلیک روی درس. درس قفل (بدون preview) غیرفعال است." },
      { name: "defaultOpen", type: "string[]", desc: "فصل‌های باز در شروع؛ پیش‌فرض فصل درس جاری." },
      { name: "showSummary", type: "boolean", default: "true", desc: "ردیف «۴ فصل · ۱۲ درس · ۳ ساعت و ۱۵ دقیقه»." },
    ],
    notes: ["مدت کل با formatMinutes به «۳ ساعت و ۱۵ دقیقه» تبدیل میشه؛ همین تابع export شده.", "پنل بسته inert است تا Tab روی درس‌های پنهان نره."],
    promptBullets: [
      "Collapsible sections (grid-rows 0fr↔1fr), chevron at inline-end, closed panels inert.",
      "Section header: Persian number inside a progress ring (brand, success when complete), «۲ از ۴ درس · ۴۰ دقیقه».",
      "Lesson row: type icon (PlayCircle/FileText/ClipboardCheck/PenLine), CheckCircle2 when done, Lock when locked, «رایگان» chip for preview, minutes in Persian.",
      "Current lesson: aria-current=step, bg-accent and a brand bar on the inline-start (before:start-0).",
    ],
  },
  {
    slug: "lesson-note", name: "درس‌نامه", cat: "education", file: ui("lesson-note"), deps: ["lucide-react"],
    desc: "قالب درس‌نامه‌ی متنی با اهداف یادگیری و زمان مطالعه، کادرهای نکته، تعریف، مثال و اشتباه رایج، فرمول چپ‌به‌راست و واژه‌نامه.",
    usage: `import { LessonNote, Callout, Formula, KeyTerms } from "@/components/ui/lesson-note"

<LessonNote
  eyebrow="فصل ۲ · درس ۳"
  title="سرعت متوسط و سرعت لحظه‌ای"
  minutes={8}
  objectives={["فرق سرعت متوسط و لحظه‌ای را بگویید", "سرعت را از روی نمودار مکان-زمان بخوانید"]}
>
  <p>سرعت متوسط یعنی جابه‌جایی تقسیم بر مدت زمان.</p>
  <Formula caption="رابطه‌ی ۲-۱">v̄ = Δx / Δt</Formula>
  <Callout kind="example">خودرویی ۱۲۰ کیلومتر را در ۲ ساعت می‌رود؛ سرعت متوسطش ۶۰ کیلومتر بر ساعت است.</Callout>
  <Callout kind="warning">سرعت متوسط میانگین سرعت‌ها نیست.</Callout>
  <KeyTerms terms={[{ term: "جابه‌جایی", en: "displacement", desc: "فاصله‌ی مستقیم نقطه‌ی شروع تا پایان، با جهت." }]} />
</LessonNote>`,
    props: [
      { name: "LessonNote", type: "{ title; eyebrow?; minutes?; objectives? }", desc: "پوسته‌ی مقاله با سربرگ، کادر «در این درس یاد می‌گیرید» و متن با ارتفاع خط خواندنی." },
      { name: "Callout kind", type: '"tip" | "definition" | "example" | "warning" | "summary" | "quote"', default: '"tip"', desc: "نکته، تعریف، مثال، اشتباه رایج، جمع‌بندی، نقل‌قول. title برچسب را عوض می‌کنه." },
      { name: "Formula", type: "{ caption?; inline? }", desc: "فرمول در جعبه‌ی LTR؛ inline برای وسط جمله." },
      { name: "KeyTerms", type: "{ terms: { term; en?; desc }[]; title? }", desc: "واژه‌نامه با معادل انگلیسی LTR." },
    ],
    notes: [
      "فرمول و معادل انگلیسی داخل bdi با dir=\"ltr\" هستن تا ترتیب کلمات جمله‌ی فارسی به‌هم نریزه.",
      "نوار رنگی کادرها با border-s است، پس در RTL سمت راست می‌نشینه.",
      "متن درس‌نامه ارتفاع خط ۱٫۹ دارد (خواندن طولانی)، سربرگ‌ها فشرده.",
    ],
    promptBullets: [
      "Article shell: eyebrow in brand, h2 title, «زمان مطالعه: ۸ دقیقه», objectives card with CheckCircle2 bullets; body line-height 1.9.",
      "Callout kinds tip/definition/example/warning/summary/quote with Persian labels (نکته، تعریف، مثال، اشتباه رایج، جمع‌بندی) and a border-s-4 accent bar.",
      "Formula: centred LTR box (Persian digits, tabular-nums) with a Persian figcaption; inline variant is <bdi dir=ltr>.",
      "KeyTerms: dl with Persian term, optional English equivalent in <bdi dir=ltr>, definition.",
    ],
  },
  {
    slug: "function-plot", name: "نمودار تعاملی", cat: "education", file: ui("function-plot"), wide: true, deps: ["lucide-react"], registryDeps: ["slider"],
    desc: "نمودار تابع با اسلایدر برای هر پارامتر، فرمول زنده، ردیاب مختصات و منحنی خط‌چین حالت اول برای مقایسه؛ برای درس ریاضی و فیزیک.",
    usage: `import { FunctionPlot, faDecimal } from "@/components/ui/function-plot"

<FunctionPlot
  label="نمودار y = a·sin(bx)"
  xDomain={[-6.3, 6.3]}
  yDomain={[-3, 3]}
  params={[
    { key: "a", label: "دامنه (a)", min: 0.5, max: 3, step: 0.1, default: 1 },
    { key: "b", label: "بسامد (b)", min: 0.5, max: 3, step: 0.1, default: 1 },
  ]}
  fn={(x, p) => p.a * Math.sin(p.b * x)}
  formula={(p) => \`y = \${faDecimal(p.a, 1)} · sin(\${faDecimal(p.b, 1)}x)\`}
/>`,
    props: [
      { name: "fn", type: "(x, params) => number", desc: "تابع. NaN یعنی نقطه رسم نشه (مثلاً بیرون از دامنه)." },
      { name: "params", type: "{ key; label; min; max; step?; default }[]", desc: "هر پارامتر یک اسلایدر می‌سازه." },
      { name: "formula", type: "(params) => string", desc: "فرمول زنده در جعبه‌ی LTR بالای نمودار." },
      { name: "xDomain / yDomain", type: "[number, number]", default: "[-10, 10] / [-6, 6]", desc: "بازه‌ی محورها." },
      { name: "showBaseline", type: "boolean", default: "true", desc: "بعد از تغییر پارامتر، منحنی حالت اول خط‌چین می‌مونه." },
      { name: "label", type: "string", desc: "توضیح دسترس‌پذیر نمودار." },
    ],
    notes: [
      "محورها قرارداد ریاضی را نگه می‌دارن (x به راست زیاد میشه) حتی در صفحه‌ی راست‌چین؛ فقط اعداد محور فارسی میشن. این با نمودار داده‌ی فروش (chart) فرق داره که از راست شروع میشه.",
      "مجانب قائم (مثل tan) خودکار تشخیص داده میشه و خط از بالا به پایین وصل نمیشه.",
      "روی موبایل با لمس و کشیدن هم مختصات نقطه را نشان میده.",
    ],
    promptBullets: [
      "Pure SVG plot of y = f(x; params) inside dir=ltr (maths axes are never mirrored); Persian tick numbers with «٫» decimal.",
      "One Slider per param (label, min, max, step); live formula in an LTR box; «حالت اول» reset button.",
      "Dashed ghost of the default curve once params change; hover/touch tracer with dot and «x = ۱٫۵ | y = ۰٫۹۹» readout.",
      "Lift the pen on NaN and across vertical asymptotes; clip to the plot area.",
    ],
  },
  {
    slug: "hotspot-figure", name: "شکل تعاملی", cat: "education", file: ui("hotspot-figure"), wide: true, deps: ["lucide-react"],
    desc: "تصویر یا دیاگرام با نقطه‌های شماره‌دار که با کلیک نام و توضیح هر بخش را نشان میدن و راهنمای زیر شکل بخش‌های دیده‌شده را تیک می‌زنه.",
    usage: `import { HotspotFigure } from "@/components/ui/hotspot-figure"

<HotspotFigure
  ratio="4 / 3"
  caption="شکل ۴-۱: ساختار سلول گیاهی"
  hotspots={[
    { id: "wall", x: 12, y: 50, title: "دیواره‌ی سلولی", desc: "لایه‌ی سلولزی محکم بیرون غشا." },
    { id: "nucleus", x: 58, y: 38, title: "هسته", desc: "DNA سلول و مرکز کنترل." },
    { id: "chloroplast", x: 36, y: 70, title: "کلروپلاست", desc: "محل فتوسنتز." },
  ]}
  onExplore={(seen) => seen.length === 3 && markDone()}
>
  <img src="/figures/plant-cell.webp" alt="سلول گیاهی" />
</HotspotFigure>`,
    props: [
      { name: "hotspots", type: "{ id; x; y; title; desc? }[]", desc: "x و y درصد از لبه‌ی چپ و بالای تصویرند." },
      { name: "children", type: "ReactNode", desc: "تصویر، SVG یا هر المانی که کادر را پر کنه." },
      { name: "ratio", type: "string", default: '"16 / 10"', desc: "نسبت ابعاد؛ قبل از بارگذاری جا رزرو میشه." },
      { name: "showLegend", type: "boolean", default: "true", desc: "فهرست شماره‌دار زیر شکل با تیک بخش‌های دیده‌شده." },
      { name: "onExplore", type: "(visited: string[]) => void", desc: "هر بار که بخش تازه‌ای دیده میشه." },
      { name: "caption", type: "ReactNode", desc: "شرح شکل." },
    ],
    notes: [
      "مختصات نقطه‌ها فیزیکی (left/top) است چون خود تصویر در RTL آینه نمیشه؛ کارت توضیح و راهنما راست‌چین‌اند.",
      "نقطه‌های دیده‌نشده پالس می‌زنن (با prefers-reduced-motion خاموش میشه)؛ Escape کارت را می‌بنده.",
      "هر نقطه ناحیه‌ی لمس ۴۴ پیکسلی داره، هرچند دایره‌ی دیده‌شده کوچک‌تره.",
    ],
    promptBullets: [
      "Picture box with reserved aspect-ratio; numbered hotspot buttons (44px hit area, Persian digits) placed by physical left/top percent because images don't mirror.",
      "Clicking a hotspot opens an RTL card (title + explanation) that flips above/below and is clamped horizontally (left: clamp(…)) to stay inside the picture; Escape closes.",
      "Unvisited hotspots pulse (animate-ping, off under prefers-reduced-motion); visited ones turn neutral.",
      "Legend grid under the figure mirrors the hotspots, ticks explored ones and shows «۲ از ۵ بخش را دیده‌اید».",
    ],
  },
  {
    slug: "quiz", name: "ارزیابی", cat: "education", file: ui("quiz"), deps: ["lucide-react"], registryDeps: ["button", "progress"],
    desc: "ارزیابی چندگزینه‌ای با گزینه‌های الف تا د، سؤال چندپاسخی، بازخورد فوری با توضیح یا حالت امتحان، و صفحه‌ی نتیجه با درصد، مرور پاسخ‌ها و تلاش دوباره.",
    usage: `import { Quiz } from "@/components/ui/quiz"

<Quiz
  title="آزمونک فصل ۲"
  passPercent={60}
  onComplete={(r) => saveScore(r.percent)}
  questions={[
    {
      id: "q1",
      prompt: "خودرویی ۱۲۰ کیلومتر را در ۲ ساعت طی می‌کند. سرعت متوسط آن چقدر است؟",
      options: [
        { id: "a", label: "۲۴۰ کیلومتر بر ساعت" },
        { id: "b", label: "۶۰ کیلومتر بر ساعت" },
        { id: "c", label: "۱۲۰ کیلومتر بر ساعت" },
      ],
      answer: "b",
      explanation: "سرعت متوسط = جابه‌جایی ÷ زمان = ۱۲۰ ÷ ۲.",
    },
    {
      id: "q2",
      prompt: "کدام کمیت‌ها برداری‌اند؟",
      options: [{ id: "a", label: "جابه‌جایی" }, { id: "b", label: "مسافت" }, { id: "c", label: "سرعت" }],
      answer: ["a", "c"],
    },
  ]}
/>`,
    props: [
      { name: "questions", type: "{ id; prompt; options; answer; explanation? }[]", desc: "answer یک id یا آرایه‌ای از idها (سؤال چندپاسخی) است." },
      { name: "feedback", type: '"instant" | "end"', default: '"instant"', desc: "instant: بررسی هر سؤال با توضیح. end: حالت امتحان، نتیجه در پایان." },
      { name: "passPercent", type: "number", default: "70", desc: "درصد قبولی." },
      { name: "onComplete", type: "(result) => void", desc: "{ correct, total, percent, passed, answers } بعد از پایان." },
      { name: "title", type: "ReactNode", desc: "عنوان بالای نوار پیشرفت." },
    ],
    notes: [
      "گزینه‌ها input واقعی radio/checkbox هستن (sr-only)، پس کیبورد و صفحه‌خوان بدون کد اضافه کار می‌کنن.",
      "حروف گزینه‌ها «الف، ب، ج، د» است نه A/B/C؛ ثابت OPTION_LETTERS export شده.",
      "دکمه‌ی «سؤال بعدی» آیکون ArrowLeft دارد چون در RTL جلو یعنی چپ.",
    ],
    promptBullets: [
      "Single or multiple answer (answer: string | string[]); options are real sr-only radio/checkbox inputs inside labels, lettered الف/ب/ج/د.",
      "Instant mode: «بررسی پاسخ» reveals success/destructive states and an explanation box (border-s-4) in an aria-live region; end mode grades at the end with قبلی/بعدی.",
      "Header «سؤال ۲ از ۵» with Progress; next button uses ArrowLeft (RTL forward).",
      "Result: percent ring (success if ≥ passPercent else warning), «قبول شدید / نیاز به مرور دارید», per-question review with the right letter, retry button.",
    ],
  },
];
