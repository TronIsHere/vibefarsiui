import type { ChartCat, ChartDoc } from "./types";

const ch = (slug: string) => `registry/charts/${slug}.tsx`;
const DEPS = ["chart-core", "chart-utils"];

export const chartCats: { key: ChartCat; label: string }[] = [
  { key: "kit", label: "پایه" },
  { key: "trend", label: "روند زمانی" },
  { key: "compare", label: "مقایسه" },
  { key: "part", label: "سهم از کل" },
  { key: "distribution", label: "توزیع و الگو" },
  { key: "flow", label: "جریان و قیف" },
  { key: "finance", label: "مالی" },
];

const list: ChartDoc[] = [
  {
    slug: "chart-core",
    name: "هسته‌ی نمودار",
    cat: "kit",
    tags: ["core", "legend", "tooltip", "a11y"],
    file: ch("chart-core"),
    registryDeps: ["chart-utils"],
    desc: "قاب مشترک همه‌ی نمودارها که عرض را اندازه می‌گیره و راهنما، تولتیپ، ناوبری با کیبورد، جدول مخفی برای صفحه‌خوان و پالت رنگ را فراهم می‌کنه.",
    usage: `import { ChartFrame, Legend, ChartTooltip, colorAt, useActive } from "@/components/charts/chart-core"

// بیشتر وقت‌ها مستقیم سراغش نمیاید. هر نمودار خودش از این فایل استفاده می‌کنه.
// برای نمودار سفارشی:
<ChartFrame title="فروش" height={240} table={{ head: ["ماه", "فروش"], rows }}>
  {(width) => <svg width={width} height={240}>…</svg>}
</ChartFrame>`,
    props: [
      { name: "title", type: "string", desc: "اسم قابل دسترس نمودار که عنوان جدول مخفی هم میشه." },
      { name: "height", type: "number", desc: "ارتفاع ناحیه‌ی رسم به پیکسل. عرض از والد گرفته میشه." },
      { name: "children", type: "(width) => ReactNode", desc: "بعد از اندازه‌گیری با عرض واقعی صدا زده میشه." },
      { name: "table", type: "{ head, rows }", desc: "جدولی که فقط صفحه‌خوان می‌خونه." },
      { name: "keyboard", type: "useActive(n)", desc: "فوکوس‌پذیر می‌کنه و کلیدهای جهت را وصل می‌کنه." },
    ],
    notes: [
      "رنگ‌ها اول --chart-1 تا --chart-7 را می‌خونن، پس کافیه در globals.css این متغیرها را تعریف کنید تا همه‌ی نمودارها رنگ برند شما را بگیرن.",
      "انیمیشن‌ها از --motion و --motion-ease تم می‌آن، پس در سیستم ترمینال پله‌ای و در سیستم خمیری فنری حرکت می‌کنن.",
    ],
    promptBullets: [
      "Export ChartFrame (measures width, legend slot, aria-live region, sr-only table), Legend (toggle buttons), ChartTooltip (HTML, placed left of the point and flipped near the left edge), Label (SVG text with direction=rtl and physical anchors), ValueGrid, CategoryAxis, References, plotBox, valueTicks, useActive, useHidden, colorAt, num.",
      "Keyframes vf-draw (stroke-dashoffset with pathLength=1), vf-grow (scale from the baseline with transform-box: fill-box), vf-fade, vf-pop live in one <style href precedence> so React hoists them once.",
    ],
  },
  {
    slug: "line-chart",
    name: "نمودار خطی",
    cat: "trend",
    tags: ["line", "trend", "time series", "forecast"],
    file: ch("line-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "روند یک یا چند سری در طول زمان، با منحنی نرم بدون بیرون‌زدگی، خط‌چین برای پیش‌بینی، خط هدف و شکستن خط در داده‌ی خالی.",
    usage: `import { LineChart } from "@/components/charts/line-chart"

const data = [
  { month: "فروردین", sales: 4_200_000, target: 5_000_000 },
  { month: "اردیبهشت", sales: 5_100_000, target: 5_000_000 },
  { month: "خرداد", sales: 4_800_000, target: 5_500_000 },
]

<LineChart
  title="فروش ماهانه"
  data={data}
  x="month"
  series={[{ key: "sales", label: "فروش" }, { key: "target", label: "هدف", dashed: true }]}
  format={formatToman}
/>`,
    props: [
      { name: "data / x / series", type: "Row[] / string / Series[]", desc: "ردیف‌ها، اسم فیلد محور افقی و سری‌ها با key و label و رنگ دلخواه." },
      { name: "curve", type: '"monotone" | "linear" | "step"', default: '"monotone"', desc: "monotone هیچ‌وقت از داده بیرون نمی‌زنه، پس خط زیر صفر نمیره." },
      { name: "format / axisFormat", type: "(n) => string", desc: "قالب تولتیپ (پیش‌فرض عدد کامل) و قالب محور (پیش‌فرض کوتاه مثل «۱۲ میلیون»)." },
      { name: "domain", type: '"auto" | "zero" | [min, max]', default: '"auto"', desc: "auto به داده می‌چسبه و zero از صفر شروع می‌کنه." },
      { name: "references", type: "{ value, label }[]", desc: "خط افقی خط‌چین مثل هدف یا میانگین." },
      { name: "highlight", type: "number", desc: "اندیس نقطه‌ای که پررنگ میشه، مثلاً امروز." },
      { name: "onSelect", type: "(row, index) => void", desc: "کلیک روی نمودار، مثلاً برای رفتن به جزئیات اون روز." },
    ],
    notes: [
      "اولین ردیف سمت راست می‌نشینه و زمان به چپ می‌ره، همون جهتی که متن فارسی خوانده میشه.",
      "مقدار null یا جاافتاده خط را می‌شکنه به‌جای این‌که به صفر سقوط کنه.",
      "تاریخ‌های Date خودشون به شمسی مثل «۱۲ مهر» تبدیل میشن.",
    ],
    promptBullets: [
      "Monotone cubic (Fritsch–Carlson) path; dashed series use stroke-dasharray 5 4 and fade in instead of drawing.",
      "Crosshair + enlarged dots on the active index; one tooltip lists every visible series.",
      "Dots appear automatically up to 16 points; category labels thin out by measured width.",
    ],
  },
  {
    slug: "area-chart",
    name: "نمودار ناحیه‌ای",
    cat: "trend",
    tags: ["area", "stacked", "percent", "trend"],
    file: ch("area-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "حجم در طول زمان با سه حالت روی‌هم‌افتاده، انباشته و صددرصدی، با گرادیان ملایم و جمع کل در تولتیپ.",
    usage: `import { AreaChart } from "@/components/charts/area-chart"

<AreaChart
  title="کاربران فعال بر اساس دستگاه"
  data={days}
  x="date"
  stack="stacked"
  series={[
    { key: "mobile", label: "موبایل" },
    { key: "desktop", label: "دسکتاپ" },
    { key: "tablet", label: "تبلت" },
  ]}
/>`,
    props: [
      { name: "stack", type: '"none" | "stacked" | "percent"', default: '"none"', desc: "percent سهم هر سری از صددرصد را نشون میده و تولتیپ درصدش را هم می‌نویسه." },
      { name: "fill", type: '"gradient" | "solid"', default: '"gradient"', desc: "گرادیان عمودی یا رنگ یکدست کم‌رنگ." },
      { name: "data / x / series", type: "Row[] / string / Series[]", desc: "مثل نمودار خطی." },
    ],
    notes: ["در حالت انباشته مقدار خالی صفر حساب میشه تا لایه‌ها از هم جدا نشن."],
    promptBullets: [
      "Stack positives and negatives away from zero separately; percent mode normalises each row to 100.",
      "Gradient per series via <linearGradient>; tooltip lists top layer first and adds «جمع» in stacked modes.",
    ],
  },
  {
    slug: "bar-chart",
    name: "نمودار میله‌ای",
    cat: "compare",
    tags: ["bar", "column", "grouped", "stacked", "horizontal", "negative"],
    file: ch("bar-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "ستونی یا افقی، گروهی، انباشته یا صددرصدی، با مقدار منفی، رنگ جدا برای هر دسته و برجسته کردن یک ستون.",
    usage: `import { BarChart } from "@/components/charts/bar-chart"

<BarChart title="فروش فصلی" data={quarters} x="q"
  series={[{ key: "y1404", label: "۱۴۰۴" }, { key: "y1405", label: "۱۴۰۵" }]} />

// افقی، از برچسب‌های سمت راست به چپ رشد می‌کنه:
<BarChart title="سهم بانک‌ها" orientation="horizontal" data={banks} x="bank"
  series={[{ key: "count", label: "تراکنش" }]} showValues />`,
    props: [
      { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', desc: "افقی برای برچسب‌های بلند فارسی بهتره." },
      { name: "stack", type: '"none" | "stacked" | "percent"', default: '"none"', desc: "none سری‌ها را کنار هم می‌گذاره." },
      { name: "showValues", type: "boolean", default: "false", desc: "عدد هر میله (یا جمع انباشته) سر میله نوشته میشه." },
      { name: "colors", type: "string[]", desc: "وقتی فقط یک سری دارید، یک رنگ برای هر دسته." },
      { name: "highlight", type: "number", desc: "بقیه‌ی میله‌ها کم‌رنگ میشن، مثلاً برای ماه جاری." },
      { name: "radius", type: "number", default: "4", desc: "فقط سر میله گرد میشه، نه پایه‌اش." },
    ],
    notes: ["در حالت گروهی سری اول سمت راست هر دسته قرار می‌گیره تا ترتیب راهنما و میله‌ها یکی باشه.", "ارتفاع نمودار افقی اگه ندید از تعداد ردیف‌ها حساب میشه."],
    promptBullets: [
      "Band scale right-to-left; grouped sub-bars keep series order right-to-left; only the far end of the outermost stack segment is rounded.",
      "Horizontal: labels in a right column, value scale grows leftward from zero, negatives extend right; grow animation origin is the zero side.",
    ],
  },
  {
    slug: "combo-chart",
    name: "نمودار ترکیبی",
    cat: "compare",
    tags: ["combo", "dual axis", "bar line", "composed"],
    file: ch("combo-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "میله، خط و ناحیه روی یک نمودار با دو محور، مثلاً درآمد به تومان روی محور راست و نرخ تبدیل به درصد روی محور چپ.",
    usage: `import { ComboChart } from "@/components/charts/combo-chart"

<ComboChart
  title="درآمد و نرخ تبدیل"
  data={months}
  x="month"
  series={[
    { key: "revenue", label: "درآمد", type: "bar" },
    { key: "orders", label: "سفارش", type: "line" },
    { key: "rate", label: "نرخ تبدیل", type: "line", axis: "left", dashed: true },
  ]}
  axisFormatLeft={(n) => percentFa(n)}
  formatLeft={(n) => percentFa(n, 1)}
/>`,
    props: [
      { name: "series[].type", type: '"bar" | "line" | "area"', desc: "شکل هر سری. میله‌ها کنار هم گروه میشن و خط‌ها روی‌شون می‌آن." },
      { name: "series[].axis", type: '"right" | "left"', default: '"right"', desc: "محور اصلی سمت راسته و محور دوم سمت چپ." },
      { name: "formatLeft / axisFormatLeft", type: "(n) => string", desc: "قالب جدا برای سری‌های محور چپ." },
    ],
    notes: ["خطوط شبکه فقط از محور راست کشیده میشن و تیک‌های محور چپ با همون ردیف‌ها هم‌تراز میشن تا دو شبکه روی هم نیفتن."],
    promptBullets: ["One band scale; bar series grouped right-to-left, line/area series through band centres; secondary axis ticks aligned to the primary grid rows.", "Tooltip formats each value with its own axis format."],
  },
  {
    slug: "pie-chart",
    name: "دایره‌ای و دونات",
    cat: "part",
    tags: ["pie", "donut", "share", "percent"],
    file: ch("pie-chart"),
    registryDeps: DEPS,
    desc: "سهم هر بخش از کل، با جمع یا درصد بخش فعال وسط دونات، کنار رفتن برش زیر نشانگر و ادغام برش‌های کوچک در «سایر».",
    usage: `import { PieChart } from "@/components/charts/pie-chart"

<PieChart
  title="روش پرداخت"
  data={[
    { label: "درگاه بانکی", value: 6420 },
    { label: "کیف پول", value: 2180 },
    { label: "پرداخت در محل", value: 940 },
  ]}
  centerLabel="سفارش"
  minShare={3}
/>`,
    props: [
      { name: "variant", type: '"donut" | "pie"', default: '"donut"', desc: "دونات جای جمع کل را وسطش داره." },
      { name: "minShare", type: "number", default: "0", desc: "برش‌های کمتر از این درصد یکی میشن و اسمشون «سایر» میشه." },
      { name: "centerLabel / centerValue", type: "string", desc: "متن زیر عدد وسط و خود عدد. پیش‌فرض جمع کل هست." },
      { name: "showPercent", type: "boolean", desc: "درصد روی برش‌هایی که جا دارن نوشته میشه." },
      { name: "sort", type: "boolean", default: "true", desc: "بزرگ‌ترین برش اول، از ساعت ۱۲." },
    ],
    notes: ["بیشتر از شش برش خوانا نیست. اگه داده‌تون بیشتره minShare بدید یا نمودار میله‌ای افقی را امتحان کنید."],
    promptBullets: ["Slices clockwise from 12 o'clock with a tiny angular gap; hovered slice translates 6px outward along its mid-angle and the rest fade.", "Donut centre shows the total, or the active slice's share and label; legend at the bottom lists each share."],
  },
  {
    slug: "radial-chart",
    name: "حلقه‌ی پیشرفت و گیج",
    cat: "part",
    tags: ["radial", "progress", "gauge", "kpi", "goal"],
    file: ch("radial-chart"),
    registryDeps: DEPS,
    desc: "حلقه‌های هم‌مرکز برای پیشرفت چند هدف و یک گیج نیم‌دایره که از راست به چپ پر میشه، با بازه‌های رنگی و عقربه.",
    usage: `import { RadialChart, GaugeChart } from "@/components/charts/radial-chart"

<RadialChart
  title="اهداف فصل"
  data={[
    { label: "فروش", value: 82 },
    { label: "مشتری جدید", value: 340, max: 500 },
    { label: "رضایت", value: 4.6, max: 5 },
  ]}
  centerValue="۷۴٪"
  centerLabel="میانگین"
/>

<GaugeChart
  title="امتیاز رضایت"
  value={72}
  bands={[
    { to: 40, color: "var(--destructive)", label: "ضعیف" },
    { to: 70, color: "var(--warning)", label: "متوسط" },
    { to: 100, color: "var(--success)", label: "خوب" },
  ]}
/>`,
    props: [
      { name: "data[].max", type: "number", default: "100", desc: "سقف هر حلقه جداست، پس واحدهای مختلف کنار هم می‌شینن." },
      { name: "sweep", type: "number", default: "360", desc: "۲۷۰ یک حلقه‌ی باز «C» شکل می‌سازه." },
      { name: "GaugeChart bands", type: "{ to, color, label }[]", desc: "بازه‌های رنگی بیرون گیج. برچسب بازه‌ی فعلی زیر عدد میاد." },
      { name: "GaugeChart min / max", type: "number", default: "0 / 100", desc: "کمینه سمت راست و بیشینه سمت چپه." },
    ],
    notes: ["گیج مثل بقیه‌ی نمودارها از راست شروع میشه، پس عقربه با بیشتر شدن عدد به چپ می‌چرخه."],
    promptBullets: ["RadialChart: one ring per metric against its own max, track at 7% foreground, round caps, centre shows active share.", "GaugeChart: half circle with min on the right end and max on the left, outer band ring, filled arc from min to value, needle rotated with the theme motion."],
  },
  {
    slug: "radar-chart",
    name: "نمودار راداری",
    cat: "compare",
    tags: ["radar", "spider", "profile", "compare"],
    file: ch("radar-chart"),
    registryDeps: DEPS,
    desc: "مقایسه‌ی چند سری روی محورهای یکسان، مثل مشخصات دو گوشی یا مهارت‌های یک تیم، با شبکه‌ی چندضلعی یا دایره‌ای.",
    usage: `import { RadarChart } from "@/components/charts/radar-chart"

<RadarChart
  title="مقایسه‌ی دو گوشی"
  axis="spec"
  data={[
    { spec: "دوربین", a: 9, b: 7 },
    { spec: "باتری", a: 7, b: 9 },
    { spec: "صفحه", a: 8, b: 8 },
    { spec: "قیمت", a: 5, b: 8 },
    { spec: "سرعت", a: 9, b: 6 },
  ]}
  series={[{ key: "a", label: "مدل الف" }, { key: "b", label: "مدل ب" }]}
  max={10}
/>`,
    props: [
      { name: "axis", type: "string", desc: "اسم فیلدی که عنوان هر محوره." },
      { name: "max", type: "number", desc: "مقدار لبه‌ی بیرونی. اگه ندید یک عدد گرد بالای داده انتخاب میشه." },
      { name: "grid", type: '"polygon" | "circle"', default: '"polygon"', desc: "شکل حلقه‌های شبکه." },
      { name: "levels", type: "number", default: "4", desc: "تعداد حلقه‌ها." },
    ],
    notes: ["دست‌کم سه محور لازمه. محور اول بالا و بقیه ساعتگرد چیده میشن، پس محور دوم سمت راست قرار می‌گیره که با جهت خواندن فارسی جوره."],
    promptBullets: ["First axis points up, others clockwise; axis labels anchored away from the centre using the sine of the angle.", "Series polygons at 16% fill with 2px stroke; hovering an axis shows every series' value on it."],
  },
  {
    slug: "scatter-chart",
    name: "پراکندگی و حبابی",
    cat: "distribution",
    tags: ["scatter", "bubble", "correlation", "quadrant"],
    file: ch("scatter-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "رابطه‌ی دو عدد با هم، با اندازه‌ی حباب برای عدد سوم، گروه‌بندی رنگی و خطوط مرجع برای ساختن نمودار چهارخانه.",
    usage: `import { ScatterChart } from "@/components/charts/scatter-chart"

<ScatterChart
  title="قیمت و فروش محصولات"
  data={products}
  x="price" xLabel="قیمت"
  y="sold" yLabel="تعداد فروش"
  size="revenue" sizeLabel="درآمد"
  group="category" name="name"
  xReferences={[{ value: avgPrice, label: "میانگین قیمت" }]}
/>`,
    props: [
      { name: "x / y", type: "string", desc: "فیلدهای عددی. محور افقی از راست به چپ بزرگ میشه." },
      { name: "size", type: "string", desc: "فیلد عدد سوم که مساحت حباب را تعیین می‌کنه." },
      { name: "group / name", type: "string", desc: "فیلد گروه برای رنگ و راهنما، و فیلد اسم برای عنوان تولتیپ." },
      { name: "xReferences / yReferences", type: "{ value, label }[]", desc: "خط عمودی و افقی خط‌چین، مثلاً میانگین‌ها." },
    ],
    notes: ["حباب‌های بزرگ اول کشیده میشن تا حباب‌های کوچک زیرشون گم نشن."],
    promptBullets: ["Origin bottom-right: x grows leftward; bubble radius from sqrt(value/max) so area tracks the value.", "Draw largest bubbles first; hovered bubble gets a foreground stroke and the rest fade to 25%."],
  },
  {
    slug: "heatmap-chart",
    name: "نقشه‌ی حرارتی",
    cat: "distribution",
    tags: ["heatmap", "calendar", "jalali", "activity", "matrix"],
    file: ch("heatmap-chart"),
    wide: true,
    registryDeps: [...DEPS, "jalali"],
    desc: "تقویم یک‌ساله‌ی شمسی مثل گیت‌هاب ولی با هفته‌ی شنبه تا جمعه و ماه‌های شمسی و تعطیلات، به‌علاوه‌ی جدول حرارتی مثل روز هفته در برابر ساعت.",
    usage: `import { CalendarHeatmap, MatrixHeatmap } from "@/components/charts/heatmap-chart"

<CalendarHeatmap
  title="سفارش‌های روزانه"
  data={orders.map((o) => ({ date: o.day, value: o.count }))}
  holidays={["2026-03-21", "2026-04-01"]}
  unit="سفارش"
/>

<MatrixHeatmap
  title="ترافیک بر اساس ساعت"
  rows={["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"]}
  cols={hours}
  values={traffic}
/>`,
    props: [
      { name: "data", type: "{ date, value }[]", desc: "date می‌تونه Date یا «YYYY-MM-DD» میلادی باشه. روزهای تکراری جمع میشن." },
      { name: "days / end", type: "number / Date", default: "365 / امروز", desc: "چند روز تا کدام روز." },
      { name: "holidays", type: "(Date | string)[]", desc: "تعطیلات رسمی با حاشیه‌ی قرمز مشخص میشن." },
      { name: "unit", type: "string", desc: "واحد بعد از عدد در تولتیپ، مثل «سفارش»." },
      { name: "MatrixHeatmap rows / cols / values", type: "string[] / string[] / number[][]", desc: "ستون اول سمت راسته و values[ردیف][ستون]." },
    ],
    notes: ["هفته‌ها از راست به چپ جلو می‌رن و ردیف‌ها از شنبه شروع میشن، پس جمعه‌ها پایین‌ترین ردیف هستن.", "با کلیدهای بالا و پایین روز به روز و با چپ و راست هفته به هفته جابه‌جا می‌شید."],
    promptBullets: ["Calendar: align the start to Saturday (getDay()+1)%7, columns are weeks right-to-left, Jalali month label above the week containing day 1, five opacity levels of one colour.", "Holidays get a destructive-coloured ring; ArrowUp/Down move a day, ArrowLeft/Right move a week; tooltip «پنجشنبه ۱۶ مهر ۱۴۰۵».", "MatrixHeatmap: rows × cols grid, column 0 on the right, optional values in cells with contrast-aware text."],
  },
  {
    slug: "funnel-chart",
    name: "نمودار قیف",
    cat: "flow",
    tags: ["funnel", "conversion", "dropoff"],
    file: ch("funnel-chart"),
    registryDeps: DEPS,
    desc: "قیف تبدیل از بازدید تا پرداخت، با تعداد و درصد هر مرحله نسبت به اول، و نرخ تبدیل و ریزش بین مرحله‌ها.",
    usage: `import { FunnelChart } from "@/components/charts/funnel-chart"

<FunnelChart
  title="قیف خرید"
  data={[
    { label: "بازدید محصول", value: 48_200 },
    { label: "افزودن به سبد", value: 9_640 },
    { label: "شروع پرداخت", value: 4_120 },
    { label: "پرداخت موفق", value: 3_010 },
  ]}
/>`,
    props: [
      { name: "shape", type: '"centered" | "aligned"', default: '"centered"', desc: "قیف متقارن یا میله‌هایی که از کنار برچسب شروع میشن." },
      { name: "row", type: "number", default: "44", desc: "ارتفاع هر مرحله." },
    ],
    notes: ["برچسب مرحله سمت راست، عدد و درصد سمت چپ و نرخ تبدیل بین دو ردیف نوشته میشه."],
    promptBullets: ["Rows with label column right, value + share-of-first column left, bars centred (or right-aligned) with width ∝ value/first.", "Trapezoid connectors between rows and «↓ ۴۲٫۵٪» step conversion in the gap; tooltip adds drop-off count."],
  },
  {
    slug: "treemap-chart",
    name: "نقشه‌ی درختی",
    cat: "part",
    tags: ["treemap", "share", "hierarchy", "portfolio"],
    file: ch("treemap-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "سهم ده‌ها آیتم در یک مستطیل، مثل فروش دسته‌بندی‌ها یا سبد سهام، با چیدمان مربعی و رنگ بر اساس گروه.",
    usage: `import { TreemapChart } from "@/components/charts/treemap-chart"

<TreemapChart
  title="فروش بر اساس دسته"
  data={[
    { label: "موبایل", value: 4200, group: "دیجیتال" },
    { label: "لپ‌تاپ", value: 2900, group: "دیجیتال" },
    { label: "پوشاک", value: 1800, group: "مد" },
  ]}
/>`,
    props: [
      { name: "data", type: "{ label, value, group?, color? }[]", desc: "هر آیتم یک کاشی میشه." },
      { name: "colorBy", type: '"item" | "group"', desc: "اگه group داشته باشید پیش‌فرض رنگ بر اساس گروهه و راهنما هم نشون داده میشه." },
    ],
    notes: ["بزرگ‌ترین کاشی بالا و سمت راست قرار می‌گیره، جایی که چشم فارسی‌زبان اول نگاه می‌کنه.", "اسم و درصد فقط وقتی نوشته میشن که در کاشی جا بشن."],
    promptBullets: ["Squarified layout (Bruls et al.) laying columns from the right edge and rows from the top, right to left.", "Labels only when they fit; text uses the background colour on the tile fill."],
  },
  {
    slug: "waterfall-chart",
    name: "نمودار آبشاری",
    cat: "finance",
    tags: ["waterfall", "bridge", "profit", "income statement"],
    file: ch("waterfall-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "از درآمد تا سود خالص قدم به قدم، با افزایش سبز، کاهش قرمز، ستون‌های جمع و خطوط اتصال، مثل صورت سود و زیان.",
    usage: `import { WaterfallChart } from "@/components/charts/waterfall-chart"

<WaterfallChart
  title="از درآمد تا سود"
  data={[
    { label: "فروش", value: 820_000_000 },
    { label: "بهای تمام‌شده", value: -410_000_000 },
    { label: "سود ناخالص", value: 0, total: true },
    { label: "حقوق", value: -160_000_000 },
    { label: "اجاره", value: -45_000_000 },
    { label: "سود خالص", value: 0, total: true },
  ]}
/>`,
    props: [
      { name: "data[].total", type: "boolean", desc: "این ستون جمع تا اینجاست و value نادیده گرفته میشه." },
      { name: "colors", type: "{ up, down, total }", desc: "پیش‌فرض success، destructive و رنگ اول نمودار." },
    ],
    notes: ["ستون‌ها از راست به چپ می‌آن، همون ترتیبی که صورت مالی فارسی خوانده میشه."],
    promptBullets: ["Running total; each step floats from the previous total; total steps start at zero; dashed connectors at the running total between bars.", "Signed labels «+۱۲۰ میلیون» / «−۴۵ میلیون» above rises and below falls."],
  },
  {
    slug: "candlestick-chart",
    name: "نمودار شمعی",
    cat: "finance",
    tags: ["candlestick", "ohlc", "stock", "bourse", "بورس"],
    file: ch("candlestick-chart"),
    wide: true,
    registryDeps: DEPS,
    desc: "قیمت روزانه‌ی سهم یا ارز با شمع سبز و قرمز، حجم معاملات زیرش و میانگین متحرک، برای داشبوردهای بورس و کریپتو.",
    usage: `import { CandlestickChart } from "@/components/charts/candlestick-chart"

<CandlestickChart
  title="فولاد · ۶۰ روز اخیر"
  data={prices} // { date, open, high, low, close, volume }[]
  movingAverages={[7, 21]}
  format={(n) => \`\${faNumber(n)} ریال\`}
/>`,
    props: [
      { name: "data", type: "{ date, open, high, low, close, volume? }[]", desc: "به ترتیب زمانی، قدیمی‌ترین اول." },
      { name: "movingAverages", type: "number[]", desc: "میانگین متحرک ساده با این تعداد شمع، خط‌چین." },
      { name: "volume", type: "boolean", default: "true", desc: "میله‌های حجم در پایین نمودار وقتی داده‌اش باشه." },
      { name: "colors", type: "{ up, down }", desc: "پیش‌فرض سبز برای مثبت و قرمز برای منفی، مثل تابلوی بورس تهران." },
    ],
    notes: ["جدیدترین شمع سمت چپه، پس روند از راست به چپ خوانده میشه.", "تغییر در تولتیپ نسبت به قیمت پایانی روز قبل حساب میشه."],
    promptBullets: ["Wick from high to low, body from open to close, green when close ≥ open; volume bars in the bottom 18% at 30% opacity.", "Simple moving averages as dashed lines; tooltip lists باز شدن، بیشترین، کمترین، پایانی، تغییر و حجم."],
  },
  {
    slug: "sparkline",
    name: "اسپارک‌لاین",
    cat: "trend",
    tags: ["sparkline", "mini", "kpi", "stat card"],
    file: ch("sparkline"),
    registryDeps: DEPS,
    desc: "نمودار خیلی کوچک برای کارت آمار و خانه‌ی جدول، خطی یا میله‌ای، با رنگ روند و نقطه‌ی آخرین مقدار.",
    usage: `import { Sparkline, SparkBar } from "@/components/charts/sparkline"

<Sparkline label="فروش هفت روز اخیر" data={[12, 14, 11, 18, 17, 21, 24]} trend />
<SparkBar label="سفارش روزانه" data={[8, 12, 5, 14, 9, 16, 11]} width={96} />`,
    props: [
      { name: "label", type: "string", desc: "اول خلاصه‌ی صوتی، مثل «فروش هفت روز اخیر: از ۱۲ به ۲۴، ۱۰۰٪ افزایش»." },
      { name: "trend", type: "boolean", desc: "سبز اگه مقدار آخر از اول بیشتر باشه و قرمز اگه کمتر." },
      { name: "goodWhen", type: '"up" | "down"', default: '"up"', desc: "برای عددهایی که کمتر شدنشون خوبه، مثل سفارش لغوشده، down بدید تا رنگ‌ها برعکس بشن." },
      { name: "extremes", type: "boolean", desc: "نقطه‌ی بیشترین و کمترین." },
      { name: "width / height", type: "number", default: "پهنای والد / 32", desc: "بدون width کل عرض والد را می‌گیره." },
    ],
    notes: ["اسپارک‌لاین‌ها فوکوس‌پذیر نیستن و فقط یک aria-label خلاصه دارن، چون کنار عدد اصلی کارت می‌شینن."],
    promptBullets: ["No axes; oldest value on the right, last value marked with a dot on the left end.", "role=img with an aria-label summarising first → last and the percentage change."],
  },
];

/** Grouped in the order of `chartCats`, so the sidebar and prev/next follow the index page. */
export const charts: ChartDoc[] = [...list].sort((a, b) => chartCats.findIndex((c) => c.key === a.cat) - chartCats.findIndex((c) => c.key === b.cat));
