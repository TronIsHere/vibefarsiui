"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { areaPath, compactFa, linePath, percentFa, type Pt } from "@/lib/chart-utils";
import { colorAt, useWidth } from "@/registry/charts/chart-core";

type SparkBase = {
  data: number[];
  /** Accessible summary prefix, e.g. «فروش هفت روز اخیر». */
  label: string;
  height?: number;
  /** Fixed width; default fills the parent. */
  width?: number;
  color?: string;
  className?: string;
};

/** «فروش هفت روز اخیر: از ۱۲ هزار به ۱۸ هزار، ۵۰٪ افزایش» */
function summary(label: string, data: number[]) {
  if (data.length < 2) return label;
  const a = data[0], b = data[data.length - 1];
  const ch = a ? ((b - a) / Math.abs(a)) * 100 : 0;
  return `${label}: از ${compactFa(a)} به ${compactFa(b)}، ${percentFa(Math.abs(ch))} ${ch >= 0 ? "افزایش" : "کاهش"}`;
}

/** Width of the parent unless a fixed one is given. */
function useBoxWidth(fixed?: number): [React.RefObject<HTMLSpanElement | null>, number] {
  const [ref, w] = useWidth<HTMLSpanElement>();
  return [ref, fixed ?? w];
}

export interface SparklineProps extends SparkBase {
  /** Soft fill under the line. */
  area?: boolean;
  /** Mark the highest and lowest points. */
  extremes?: boolean;
  /** Colour by trend: green when the last value beats the first, red otherwise. */
  trend?: boolean;
  /** For metrics where lower is better (cancellations, response time), pass "down" to flip the trend colours. */
  goodWhen?: "up" | "down";
}

/**
 * اسپارک‌لاین. A tiny trend for stat cards and table cells. The oldest value is
 * on the right like the full charts, the latest gets a dot on the left end.
 */
export function Sparkline({ data, label, height = 32, width, color, area = true, extremes = false, trend = false, goodWhen = "up", className }: SparklineProps) {
  const [ref, w] = useBoxWidth(width);
  const gid = React.useId().replace(/:/g, "");
  const up = data.length > 1 && data[data.length - 1] >= data[0];
  const good = goodWhen === "up" ? up : !up;
  const c = color ?? (trend ? (good ? "var(--success)" : "var(--destructive)") : colorAt(0));
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 3;
  const x = (i: number) => (data.length > 1 ? w - pad - (i / (data.length - 1)) * (w - pad * 2) : w / 2);
  const y = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const pts: Pt[] = data.map((v, i) => [x(i), y(v)]);
  const iMax = data.indexOf(max), iMin = data.indexOf(min);
  return (
    <span ref={ref} role="img" aria-label={summary(label, data)} className={cn("inline-block align-middle", !width && "w-full", className)} style={{ height, width }}>
      {w > 0 && data.length > 0 && (
        <svg width={w} height={height} className="block overflow-visible" aria-hidden>
          {area && (
            <>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={c} stopOpacity={0.28} />
                  <stop offset="1" stopColor={c} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={areaPath(pts, pts.map(([px]) => [px, height] as Pt))} fill={`url(#${gid})`} />
            </>
          )}
          <path d={linePath(pts)} fill="none" stroke={c} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
          {extremes && data.length > 2 && (
            <>
              <circle cx={x(iMax)} cy={y(max)} r={2.25} fill="var(--success)" />
              <circle cx={x(iMin)} cy={y(min)} r={2.25} fill="var(--destructive)" />
            </>
          )}
          <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.75} fill={c} stroke="var(--background)" strokeWidth={1.5} />
        </svg>
      )}
    </span>
  );
}

export interface SparkBarProps extends SparkBase {
  /** Index drawn in full colour, e.g. today. Default: the last one. */
  highlight?: number;
}

/** میله‌ی کوچک. Mini column chart for daily counts; negative values hang below a baseline. */
export function SparkBar({ data, label, height = 32, width, color, highlight, className }: SparkBarProps) {
  const [ref, w] = useBoxWidth(width);
  const c = color ?? colorAt(0);
  const hi = Math.max(0, ...data), lo = Math.min(0, ...data);
  const step = w / Math.max(1, data.length);
  const bw = Math.max(1, step * 0.7);
  const y = (v: number) => ((hi - v) / (hi - lo || 1)) * height;
  const on = highlight ?? data.length - 1;
  return (
    <span ref={ref} role="img" aria-label={summary(label, data)} className={cn("inline-block align-middle", !width && "w-full", className)} style={{ height, width }}>
      {w > 0 && (
        <svg width={w} height={height} className="block" aria-hidden>
          {data.map((v, i) => {
            const top = y(Math.max(0, v)), bottom = y(Math.min(0, v));
            return <rect key={i} x={w - (i + 1) * step + (step - bw) / 2} y={top} width={bw} height={Math.max(1, bottom - top)} rx={Math.min(2, bw / 3)} fill={v < 0 ? "var(--destructive)" : c} fillOpacity={i === on ? 1 : 0.4} />;
          })}
        </svg>
      )}
    </span>
  );
}
