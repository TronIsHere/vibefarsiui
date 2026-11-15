"use client";

import * as React from "react";
import { BulletChart, type BulletRow } from "@/registry/charts/bullet-chart";
import { SankeyChart, type SankeyLink, type SankeyNode } from "@/registry/charts/sankey-chart";
import { IranMapChart, IRAN_TILES } from "@/registry/charts/iran-map-chart";
import { mulberry32 } from "@/lib/utils";

const kpis: BulletRow[] = [
  { label: "فروش", sublabel: "میلیون تومان", value: 2_750, target: 3_000, ranges: [1_800, 2_600, 3_400] },
  { label: "سفارش جدید", value: 1_240, target: 1_100, ranges: [700, 1_000, 1_500] },
  { label: "میانگین سبد", sublabel: "هزار تومان", value: 412, target: 450, ranges: [300, 400, 520] },
  { label: "رضایت مشتری", sublabel: "از ۱۰۰", value: 81, target: 85, ranges: [60, 80, 100] },
];

const nodes: SankeyNode[] = [
  { id: "google", label: "گوگل" },
  { id: "insta", label: "اینستاگرام" },
  { id: "direct", label: "ورود مستقیم" },
  { id: "product", label: "صفحه‌ی محصول" },
  { id: "offers", label: "شگفت‌انگیزها" },
  { id: "cart", label: "سبد خرید" },
  { id: "exit", label: "خروج" },
  { id: "buy", label: "خرید موفق" },
];

const links: SankeyLink[] = [
  { source: "google", target: "product", value: 5200 },
  { source: "google", target: "offers", value: 1300 },
  { source: "insta", target: "product", value: 2100 },
  { source: "insta", target: "offers", value: 1900 },
  { source: "direct", target: "product", value: 1400 },
  { source: "product", target: "cart", value: 2600 },
  { source: "product", target: "exit", value: 6100 },
  { source: "offers", target: "cart", value: 1500 },
  { source: "offers", target: "exit", value: 1700 },
  { source: "cart", target: "buy", value: 2900 },
  { source: "cart", target: "exit", value: 1200 },
];

// Seeded so server and client agree; Tehran and the big cities lead, as real order data would.
const rand = mulberry32(31);
const weight: Record<string, number> = { "تهران": 18_420, "اصفهان": 6_310, "خراسان رضوی": 5_870, "فارس": 4_960, "آذربایجان شرقی": 3_880, "البرز": 3_640, "خوزستان": 3_120 };
const provinces = Object.keys(IRAN_TILES)
  .filter((p) => p !== "سیستان و بلوچستان" && p !== "کهگیلویه و بویراحمد")
  .map((province) => ({ province, value: weight[province] ?? Math.round(420 + rand() * 2_100) }));

export const extraChartDemos: Record<string, React.ReactNode> = {
  "bullet-chart": <div className="w-full"><BulletChart title="عملکرد فصل پاییز" data={kpis} /></div>,
  "sankey-chart": <div className="w-full"><SankeyChart title="مسیر کاربران از ورود تا خرید" nodes={nodes} links={links} height={340} /></div>,
  "iran-map-chart": <div className="w-full"><IranMapChart title="سفارش‌ها به تفکیک استان" unit="سفارش" data={provinces} /></div>,
};

export const extraChartCardDemos: Record<string, React.ReactNode> = {
  "bullet-chart": <BulletChart title="عملکرد" data={kpis.slice(0, 3)} row={26} />,
  "sankey-chart": <SankeyChart title="مسیر خرید" nodes={nodes} links={links} height={160} nodePadding={8} />,
  "iran-map-chart": <IranMapChart title="سفارش‌ها" data={provinces} />,
};
