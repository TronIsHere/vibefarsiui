"use client";

import * as React from "react";
import { JALALI_MONTHS } from "@/lib/jalali";
import { addDays } from "@/lib/chart-utils";
import { formatToman, mulberry32 } from "@/lib/utils";
import { LineChart } from "@/registry/charts/line-chart";
import { AreaChart } from "@/registry/charts/area-chart";
import { BarChart } from "@/registry/charts/bar-chart";
import { ComboChart } from "@/registry/charts/combo-chart";
import { PieChart } from "@/registry/charts/pie-chart";
import { GaugeChart, RadialChart } from "@/registry/charts/radial-chart";
import { RadarChart } from "@/registry/charts/radar-chart";
import { ScatterChart } from "@/registry/charts/scatter-chart";
import { CalendarHeatmap, MatrixHeatmap } from "@/registry/charts/heatmap-chart";
import { FunnelChart } from "@/registry/charts/funnel-chart";
import { TreemapChart } from "@/registry/charts/treemap-chart";
import { WaterfallChart } from "@/registry/charts/waterfall-chart";
import { CandlestickChart } from "@/registry/charts/candlestick-chart";
import { SparkBar, Sparkline } from "@/registry/charts/sparkline";
import { Legend, CHART_COLORS } from "@/registry/charts/chart-core";
import { compactFa, dayKey, percentFa } from "@/lib/chart-utils";
import { JALALI_WEEKDAYS } from "@/lib/jalali";
import { faNumber } from "@/lib/utils";

/* ---------- sample data (seeded, so server and client agree) ---------- */

const rand = mulberry32(1405);
const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

export const monthly = JALALI_MONTHS.map((month, i) => {
  const base = 3_800_000 + i * 260_000 + Math.round(rand() * 900_000);
  return {
    month,
    sales: base * 10,
    cost: Math.round(base * (0.55 + rand() * 0.12)) * 10,
    target: (4_200_000 + i * 240_000) * 10,
  };
});

export const daily = Array.from({ length: 30 }, (_, i) => {
  const date = addDays(today, i - 29);
  const weekend = date.getDay() === 5;
  const v = 1200 + i * 18 + Math.round(Math.sin(i / 2.4) * 160 + rand() * 120) - (weekend ? 380 : 0);
  return {
    date,
    visits: v,
    mobile: Math.round(v * 0.62),
    desktop: Math.round(v * 0.3),
    tablet: Math.round(v * 0.08),
    forecast: i >= 24 ? v + Math.round((i - 24) * 22) : null,
  };
});

const quarters = [
  { q: "بهار", y1404: 182, y1405: 236 },
  { q: "تابستان", y1404: 205, y1405: 251 },
  { q: "پاییز", y1404: 171, y1405: 214 },
  { q: "زمستان", y1404: 196, y1405: 0 },
];

const banks = [
  { bank: "ملت", count: 4_820 },
  { bank: "ملی", count: 4_105 },
  { bank: "سامان", count: 2_960 },
  { bank: "پاسارگاد", count: 2_410 },
  { bank: "تجارت", count: 1_730 },
  { bank: "صادرات", count: 1_385 },
];

const profit = JALALI_MONTHS.slice(0, 8).map((month, i) => ({ month, net: [32, 18, -12, 24, 41, -6, 28, 36][i] * 1_000_000 }));


const combo = JALALI_MONTHS.slice(0, 8).map((month, i) => ({
  month,
  revenue: (180 + i * 22 + Math.round(rand() * 40)) * 1_000_000,
  orders: 820 + i * 70 + Math.round(rand() * 120),
  rate: +(2.1 + Math.sin(i / 1.6) * 0.5 + rand() * 0.3).toFixed(2),
}));

const payments = [
  { label: "درگاه بانکی", value: 6420 },
  { label: "کیف پول", value: 2180 },
  { label: "پرداخت در محل", value: 940 },
  { label: "اقساطی", value: 610 },
  { label: "کارت هدیه", value: 120 },
  { label: "رمزارز", value: 60 },
];

const phones = [
  { spec: "دوربین", a: 9, b: 7 },
  { spec: "باتری", a: 7, b: 9.5 },
  { spec: "صفحه‌نمایش", a: 8.5, b: 8 },
  { spec: "قیمت", a: 5, b: 8 },
  { spec: "سرعت", a: 9, b: 6.5 },
  { spec: "طراحی", a: 8, b: 7 },
];

const CATS = ["دیجیتال", "خانه", "مد"];
const products = Array.from({ length: 36 }, (_, i) => {
  const cat = CATS[i % 3];
  const price = Math.round((cat === "دیجیتال" ? 6 : cat === "خانه" ? 2.5 : 1.2) * (0.4 + rand()) * 10) * 100_000;
  const sold = Math.max(4, Math.round(900 / (price / 1_000_000 + 1) + rand() * 160));
  return { name: `محصول ${faNumber(i + 1)}`, category: cat, price, sold, revenue: price * sold };
});

const activity = Array.from({ length: 365 }, (_, i) => {
  const date = addDays(today, -i);
  const dow = (date.getDay() + 1) % 7;
  const season = 1 + Math.sin(i / 58);
  const v = dow === 6 ? 0 : Math.max(0, Math.round((rand() * 9 - 2.5) * season));
  return { date: dayKey(date), value: v };
});
const holidays = Array.from({ length: 365 }, (_, i) => addDays(today, -i)).filter((d) => {
  const j = d.getMonth() === 2 && d.getDate() >= 21 && d.getDate() <= 24;
  return j;
});

const HOURS = Array.from({ length: 24 }, (_, h) => faNumber(h));
const traffic = JALALI_WEEKDAYS.map((_, d) =>
  HOURS.map((__, h) => {
    const work = h >= 9 && h <= 22 ? 1 : 0.25;
    const peak = Math.exp(-((h - 21) ** 2) / 10) * 1.4 + Math.exp(-((h - 13) ** 2) / 8) * 0.8;
    return Math.round((work + peak) * (d === 6 ? 1.3 : 1) * (60 + rand() * 30));
  }),
);

const tree = [
  { label: "موبایل", value: 4200, group: "دیجیتال" },
  { label: "لپ‌تاپ", value: 2900, group: "دیجیتال" },
  { label: "هدفون", value: 1300, group: "دیجیتال" },
  { label: "ساعت هوشمند", value: 760, group: "دیجیتال" },
  { label: "پوشاک", value: 1800, group: "مد" },
  { label: "کفش", value: 1150, group: "مد" },
  { label: "کیف", value: 520, group: "مد" },
  { label: "آشپزخانه", value: 1400, group: "خانه" },
  { label: "دکوراسیون", value: 880, group: "خانه" },
  { label: "ابزار", value: 430, group: "خانه" },
];

const statement = [
  { label: "فروش", value: 820_000_000 },
  { label: "بهای تمام‌شده", value: -410_000_000 },
  { label: "سود ناخالص", value: 0, total: true },
  { label: "حقوق", value: -160_000_000 },
  { label: "اجاره", value: -45_000_000 },
  { label: "تبلیغات", value: -62_000_000 },
  { label: "درآمد دیگر", value: 28_000_000 },
  { label: "سود خالص", value: 0, total: true },
];

const candles = (() => {
  let price = 4_200;
  return Array.from({ length: 60 }, (_, i) => {
    const date = addDays(today, i - 59);
    const open = price;
    const close = Math.max(1000, Math.round(open * (1 + (rand() - 0.47) * 0.05)));
    const high = Math.round(Math.max(open, close) * (1 + rand() * 0.02));
    const low = Math.round(Math.min(open, close) * (1 - rand() * 0.02));
    price = close;
    return { date, open, high, low, close, volume: Math.round(2e6 + rand() * 6e6) };
  });
})();

/* ---------- demos ---------- */

/** Charts sit on a card in the docs preview so the hatch pattern doesn't fight the grid lines. */
function Panel({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-4 shadow-surface sm:p-5">
      {title && <p className="mb-3 text-sm font-semibold">{title}</p>}
      {children}
    </div>
  );
}

const series = {
  sales: [
    { key: "sales", label: "فروش" },
    { key: "cost", label: "هزینه" },
    { key: "target", label: "هدف", dashed: true },
  ],
  devices: [
    { key: "mobile", label: "موبایل" },
    { key: "desktop", label: "دسکتاپ" },
    { key: "tablet", label: "تبلت" },
  ],
};

function BarDemo() {
  const [mode, setMode] = React.useState<"vertical" | "horizontal" | "stacked">("vertical");
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-1 text-xs" role="radiogroup" aria-label="حالت نمودار">
        {([["vertical", "ستونی گروهی"], ["stacked", "انباشته"], ["horizontal", "افقی"]] as const).map(([k, l]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={mode === k}
            onClick={() => setMode(k)}
            className={`cursor-pointer rounded-md border px-2.5 py-1 transition-colors ${mode === k ? "border-foreground/30 bg-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {l}
          </button>
        ))}
      </div>
      {mode === "horizontal" ? (
        <BarChart title="تراکنش بر اساس بانک" orientation="horizontal" data={banks} x="bank" series={[{ key: "count", label: "تراکنش" }]} showValues highlight={0} />
      ) : (
        <BarChart
          title="فروش فصلی"
          data={quarters}
          x="q"
          stack={mode === "stacked" ? "stacked" : "none"}
          series={[{ key: "y1404", label: "۱۴۰۴" }, { key: "y1405", label: "۱۴۰۵" }]}
          axisFormat={(n) => `${n.toLocaleString("fa-IR")}`}
          showValues
        />
      )}
    </div>
  );
}

export const chartDemos: Record<string, React.ReactNode> = {
  "chart-core": (
    <div className="w-full max-w-md space-y-3">
      <p className="text-xs text-muted-foreground">پالت هفت‌رنگ که از --chart-1 تا --chart-7 خونده میشه:</p>
      <Legend items={CHART_COLORS.map((c, i) => ({ key: String(i), label: `رنگ ${(i + 1).toLocaleString("fa-IR")}`, color: c }))} />
    </div>
  ),
  "line-chart": (
    <Panel title="فروش و هزینه‌ی ماهانه (تومان)">
    <LineChart
      title="فروش و هزینه‌ی ماهانه"
      data={monthly}
      x="month"
      series={series.sales}
      format={formatToman}
      highlight={6}
      references={[{ value: 60_000_000, label: "نقطه‌ی سربه‌سر" }]}
    />
    </Panel>
  ),
  "area-chart": (
    <Panel title="بازدید روزانه بر اساس دستگاه">
      <AreaChart title="بازدید روزانه بر اساس دستگاه" data={daily} x="date" stack="stacked" series={series.devices} />
    </Panel>
  ),
  "bar-chart": (
    <Panel>
      <BarDemo />
    </Panel>
  ),  "combo-chart": (
    <Panel title="درآمد، سفارش و نرخ تبدیل">
      <ComboChart
        title="درآمد، سفارش و نرخ تبدیل"
        data={combo}
        x="month"
        series={[
          { key: "revenue", label: "درآمد", type: "bar" },
          { key: "rate", label: "نرخ تبدیل", type: "line", axis: "left" },
        ]}
        format={formatToman}
        formatLeft={(n) => percentFa(n, 2)}
        axisFormatLeft={(n) => percentFa(n, 1)}
      />
    </Panel>
  ),
  "pie-chart": (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <Panel title="روش پرداخت (دونات)">
        <PieChart title="روش پرداخت" data={payments} centerLabel="سفارش" minShare={3} />
      </Panel>
      <Panel title="روش پرداخت (دایره)">
        <PieChart title="روش پرداخت" variant="pie" data={payments} minShare={3} />
      </Panel>
    </div>
  ),
  "radial-chart": (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <Panel title="اهداف فصل">
        <RadialChart
          title="اهداف فصل"
          data={[
            { label: "فروش", value: 82 },
            { label: "مشتری جدید", value: 340, max: 500 },
            { label: "رضایت", value: 4.6, max: 5 },
          ]}
          format={(n) => n.toLocaleString("fa-IR")}
          centerValue="۷۷٪"
          centerLabel="میانگین"
        />
      </Panel>
      <Panel title="امتیاز رضایت مشتری">
        <GaugeChart
          title="امتیاز رضایت مشتری"
          value={72}
          bands={[
            { to: 40, color: "var(--destructive)", label: "ضعیف" },
            { to: 70, color: "var(--warning)", label: "متوسط" },
            { to: 100, color: "var(--success)", label: "خوب" },
          ]}
        />
      </Panel>
    </div>
  ),
  "radar-chart": (
    <Panel title="مقایسه‌ی دو گوشی">
      <RadarChart title="مقایسه‌ی دو گوشی" axis="spec" data={phones} series={[{ key: "a", label: "مدل الف" }, { key: "b", label: "مدل ب" }]} max={10} />
    </Panel>
  ),
  "scatter-chart": (
    <Panel title="قیمت و تعداد فروش، اندازه = درآمد">
      <ScatterChart
        title="قیمت و تعداد فروش محصولات"
        data={products}
        x="price"
        xLabel="قیمت"
        y="sold"
        yLabel="تعداد فروش"
        size="revenue"
        sizeLabel="درآمد"
        sizeFormat={formatToman}
        xFormat={(n) => compactFa(n)}
        group="category"
        name="name"
      />
    </Panel>
  ),
  "heatmap-chart": (
    <div className="w-full max-w-3xl space-y-4">
      <Panel title="سفارش‌های یک سال اخیر">
        <CalendarHeatmap title="سفارش‌های روزانه" data={activity} holidays={holidays} unit="سفارش" />
      </Panel>
      <Panel title="بازدید بر اساس روز و ساعت">
        <MatrixHeatmap title="بازدید بر اساس روز و ساعت" rows={JALALI_WEEKDAYS} cols={HOURS} values={traffic} />
      </Panel>
    </div>
  ),
  "funnel-chart": (
    <Panel title="قیف خرید این ماه">
      <FunnelChart
        title="قیف خرید"
        data={[
          { label: "بازدید محصول", value: 48_200 },
          { label: "افزودن به سبد", value: 9_640 },
          { label: "شروع پرداخت", value: 4_120 },
          { label: "پرداخت موفق", value: 3_010 },
        ]}
      />
    </Panel>
  ),
  "treemap-chart": (
    <Panel title="فروش بر اساس دسته (میلیون تومان)">
      <TreemapChart title="فروش بر اساس دسته" data={tree} />
    </Panel>
  ),
  "waterfall-chart": (
    <Panel title="از فروش تا سود خالص، مهر ۱۴۰۵">
      <WaterfallChart title="از فروش تا سود خالص" data={statement} format={formatToman} />
    </Panel>
  ),
  "candlestick-chart": (
    <Panel title="نماد نمونه · ۶۰ روز اخیر (ریال)">
      <CandlestickChart title="قیمت نماد نمونه" data={candles} movingAverages={[7, 21]} format={(n) => `${faNumber(n)} ریال`} />
    </Panel>
  ),
  sparkline: (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
      {[
        { t: "فروش امروز", v: "۴۸٫۲ میلیون", d: [12, 14, 11, 18, 17, 21, 24] },
        { t: "سفارش لغوشده", v: "۳۸", d: [22, 19, 24, 18, 15, 12, 9], down: true },
        { t: "کاربر فعال", v: "۲٬۴۱۰", d: [1800, 1950, 1700, 2100, 2240, 2050, 2410] },
      ].map((k) => (
        <div key={k.t} className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">{k.t}</p>
          <p className="mt-1 text-xl font-bold">{k.v}</p>
          <Sparkline className="mt-3" label={k.t} data={k.d} trend goodWhen={"down" in k ? "down" : "up"} height={36} />
        </div>
      ))}
      <div className="rounded-xl border border-border bg-card p-4 sm:col-span-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">سفارش روزانه، ۱۴ روز اخیر</p>
            <p className="mt-1 text-xl font-bold">۱۶۳</p>
          </div>
          <SparkBar label="سفارش روزانه" data={[8, 12, 5, 14, 9, 16, 11, 13, 7, 15, 10, 12, 9, 14].reverse()} width={180} height={40} />
        </div>
      </div>
    </div>
  ),
};

/** Compact versions for the section grid: short, no axes chrome where it hurts. */
export const chartCardDemos: Record<string, React.ReactNode> = {
  "chart-core": (
    <div className="flex h-full items-center justify-center gap-1.5">
      {CHART_COLORS.map((c) => (
        <span key={c} className="size-6 rounded-md" style={{ background: c }} />
      ))}
    </div>
  ),
  "line-chart": <LineChart title="فروش" data={monthly} x="month" series={series.sales.slice(0, 2)} height={150} legend={false} dots={false} />,
  "area-chart": <AreaChart title="بازدید" data={daily} x="date" stack="stacked" series={series.devices} height={150} legend={false} />,
  "bar-chart": <BarChart title="سود ماهانه" data={profit} x="month" series={[{ key: "net", label: "سود خالص" }]} height={150} />,
  "combo-chart": <ComboChart title="درآمد" data={combo} x="month" series={[{ key: "revenue", label: "درآمد", type: "bar" }, { key: "rate", label: "نرخ", type: "line", axis: "left" }]} height={150} legend={false} />,
  "pie-chart": <PieChart title="پرداخت" data={payments} size={120} legend={false} minShare={3} animate={false} />,
  "radial-chart": <GaugeChart title="رضایت" value={72} size={190} bands={[{ to: 40, color: "var(--destructive)" }, { to: 70, color: "var(--warning)" }, { to: 100, color: "var(--success)" }]} />,
  "radar-chart": <RadarChart title="گوشی" axis="spec" data={phones} series={[{ key: "a", label: "الف" }, { key: "b", label: "ب" }]} size={124} max={10} legend={false} />,
  "scatter-chart": <ScatterChart title="محصولات" data={products} x="price" y="sold" size="revenue" group="category" height={150} legend={false} />,
  "heatmap-chart": <CalendarHeatmap title="فعالیت" data={activity} days={182} legend={false} />,
  "funnel-chart": <FunnelChart title="قیف" data={[{ label: "بازدید", value: 48_200 }, { label: "سبد", value: 9_640 }, { label: "پرداخت", value: 3_010 }]} row={30} />,
  "treemap-chart": <TreemapChart title="دسته‌ها" data={tree} height={150} />,
  "waterfall-chart": <WaterfallChart title="سود" data={statement} height={150} legend={false} showValues={false} />,
  "candlestick-chart": <CandlestickChart title="نماد" data={candles.slice(-36)} height={150} volume={false} />,
  sparkline: (
    <div className="flex h-full flex-col justify-center gap-4 px-2">
      <Sparkline label="فروش" data={[12, 14, 11, 18, 17, 21, 24, 22, 27]} trend height={36} />
      <SparkBar label="سفارش" data={[8, 12, 5, 14, 9, 16, 11, 13, 7, 15, 10, 12]} height={36} />
    </div>
  ),
};
