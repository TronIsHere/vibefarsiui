"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------- encoder: byte mode, versions 1–40, written from ISO/IEC 18004 ---------- */

export type QrEcc = "L" | "M" | "Q" | "H";
const ECC_FORMAT: Record<QrEcc, number> = { L: 1, M: 0, Q: 3, H: 2 };
const ECC_INDEX: Record<QrEcc, number> = { L: 0, M: 1, Q: 2, H: 3 };

// Per version 1..40 (index 0 unused): error-correction codewords per block, and number of blocks.
const ECC_PER_BLOCK = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

function rawModules(ver: number) {
  let n = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const align = Math.floor(ver / 7) + 2;
    n -= (25 * align - 10) * align - 55;
    if (ver >= 7) n -= 36;
  }
  return n;
}

const dataCodewords = (ver: number, e: number) => Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[e][ver] * BLOCKS[e][ver];

function gfMul(x: number, y: number) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number) {
  const out = new Array<number>(degree).fill(0);
  out[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      out[j] = gfMul(out[j], root);
      if (j + 1 < degree) out[j] ^= out[j + 1];
    }
    root = gfMul(root, 2);
  }
  return out;
}

function rsRemainder(data: number[], div: number[]) {
  const out = new Array<number>(div.length).fill(0);
  for (const b of data) {
    const factor = b ^ (out.shift() as number);
    out.push(0);
    div.forEach((c, i) => (out[i] ^= gfMul(c, factor)));
  }
  return out;
}

const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0;

/**
 * The module matrix (true = dark) for `text` in byte mode (UTF-8), so Persian text,
 * URLs and Wi-Fi strings all work. Picks the smallest version that fits.
 */
export function encodeQR(text: string, ecc: QrEcc = "M"): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  const e = ECC_INDEX[ecc];
  let ver = 1;
  for (; ver <= 40; ver++) {
    const used = 4 + (ver <= 9 ? 8 : 16) + bytes.length * 8;
    if (used <= dataCodewords(ver, e) * 8) break;
  }
  if (ver > 40) throw new Error("QR: text is too long");

  // Bit stream: mode, count, data, terminator, padding.
  const bits: number[] = [];
  const push = (v: number, n: number) => { for (let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
  push(4, 4);
  push(bytes.length, ver <= 9 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  const cap = dataCodewords(ver, e) * 8;
  push(0, Math.min(4, cap - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) push(pad, 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));

  // Split into blocks, add error correction, interleave.
  const nBlocks = BLOCKS[e][ver];
  const eccLen = ECC_PER_BLOCK[e][ver];
  const raw = Math.floor(rawModules(ver) / 8);
  const nShort = nBlocks - (raw % nBlocks);
  const shortLen = Math.floor(raw / nBlocks);
  const div = rsDivisor(eccLen);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < nBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1));
    k += dat.length;
    const rem = rsRemainder(dat, div);
    if (i < nShort) dat.push(0);
    blocks.push(dat.concat(rem));
  }
  const codewords: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= nShort) codewords.push(b[i]); });

  // Function patterns.
  const size = ver * 4 + 17;
  const m: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fn: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => { m[y][x] = dark; fn[y][x] = true; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= size || y >= size) continue;
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      set(x, y, d !== 2 && d !== 4);
    }
  };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  if (ver > 1) {
    const n = Math.floor(ver / 7) + 2;
    const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
    const pos = [6];
    for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p);
    pos.forEach((a, i) => pos.forEach((b, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
  }
  const format = (mask: number) => {
    const d = (ECC_FORMAT[ecc] << 3) | mask;
    let r = d;
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412;
    for (let i = 0; i <= 5; i++) set(8, i, bit(b, i));
    set(8, 7, bit(b, 6)); set(8, 8, bit(b, 7)); set(7, 8, bit(b, 8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(b, i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(b, i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(b, i));
    set(8, size - 8, true);
  };
  format(0);
  if (ver >= 7) {
    let r = ver;
    for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
    const b = (ver << 12) | r;
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3), c = Math.floor(i / 3);
      set(a, c, bit(b, i)); set(c, a, bit(b, i));
    }
  }

  // Data in the zigzag order.
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
      const x = right - j;
      const y = ((right + 1) & 2) === 0 ? size - 1 - v : v;
      if (!fn[y][x] && i < codewords.length * 8) { m[y][x] = bit(codewords[i >>> 3], 7 - (i & 7)); i++; }
    }
  }

  // Try all eight masks and keep the one with the lowest penalty.
  const masks = [
    (x: number, y: number) => (x + y) % 2 === 0,
    (_: number, y: number) => y % 2 === 0,
    (x: number) => x % 3 === 0,
    (x: number, y: number) => (x + y) % 3 === 0,
    (x: number, y: number) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
    (x: number, y: number) => ((x * y) % 2) + ((x * y) % 3) === 0,
    (x: number, y: number) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
    (x: number, y: number) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
  ];
  const apply = (k: number) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && masks[k](x, y)) m[y][x] = !m[y][x]; };
  let best = 0, bestScore = Infinity;
  for (let k = 0; k < 8; k++) {
    apply(k); format(k);
    const s = penalty(m);
    if (s < bestScore) { bestScore = s; best = k; }
    apply(k);
  }
  apply(best); format(best);
  return m;
}

/** The four standard penalty rules, close enough to pick a well-readable mask. */
function penalty(m: boolean[][]) {
  const n = m.length;
  let score = 0, dark = 0;
  const line = (get: (i: number) => boolean) => {
    let run = 1;
    let s = "";
    for (let i = 0; i < n; i++) {
      const v = get(i);
      s += v ? "1" : "0";
      if (i > 0 && v === get(i - 1)) { run++; if (run === 5) score += 3; else if (run > 5) score += 1; }
      else run = 1;
    }
    for (const p of ["10111010000", "00001011101"]) for (let at = s.indexOf(p); at >= 0; at = s.indexOf(p, at + 1)) score += 40;
  };
  for (let y = 0; y < n; y++) line((x) => m[y][x]);
  for (let x = 0; x < n; x++) line((y) => m[y][x]);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (m[y][x]) dark++;
    if (x < n - 1 && y < n - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3;
  }
  return score + Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
}

/* ---------- component ---------- */

export interface QRCodeProps {
  value: string;
  /** Rendered size in px. Default 168. */
  size?: number;
  /** Error correction. A center logo needs "H". Default "M". */
  ecc?: QrEcc;
  /** Quiet zone in modules. Scanners want 4; 2 is usually fine on a plain card. */
  margin?: number;
  /** Rounded dots instead of squares. Finder eyes stay square-ish so scanners lock on. */
  rounded?: boolean;
  /** Dark color. Light is always the card background, so dark mode still scans. */
  color?: string;
  /** Spoken name, e.g. «لینک پرداخت». Defaults to the value. */
  label?: string;
  /** Something small for the middle, like a logo slot. Forces ecc "H". */
  children?: React.ReactNode;
  className?: string;
}

/**
 * کد QR. Generated in the browser with no dependency: byte mode with UTF-8, so
 * Persian text works, the smallest version that fits, and the best of eight masks.
 * Drawn as one SVG path. Light modules use a fixed white so it scans in dark mode.
 */
export function QRCode({ value, size = 168, ecc = "M", margin = 4, rounded, color = "#111", label, children, className }: QRCodeProps) {
  const level = children ? "H" : ecc;
  const matrix = React.useMemo(() => encodeQR(value, level), [value, level]);
  const n = matrix.length;
  const total = n + margin * 2;
  const isEye = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  let d = "";
  let dots = "";
  matrix.forEach((row, y) => row.forEach((on, x) => {
    if (!on) return;
    const X = x + margin, Y = y + margin;
    if (rounded && !isEye(x, y)) dots += `M${X + 0.5},${Y + 0.08}a0.42,0.42 0 1,0 0.001,0Z`;
    else d += `M${X},${Y}h1v1h-1z`;
  }));
  // Leave a clear square in the middle for the logo (H recovers up to 30%).
  const hole = Math.ceil(n * 0.22) | 1;
  const h0 = margin + (n - hole) / 2;

  return (
    <div role="img" aria-label={`کد QR: ${label ?? value}`} className={cn("relative inline-block overflow-hidden rounded-control bg-white", className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${total} ${total}`} width={size} height={size} shapeRendering={rounded ? "geometricPrecision" : "crispEdges"} aria-hidden>
        <path d={d} fill={color} />
        {dots && <path d={dots} fill={color} />}
        {children && <rect x={h0} y={h0} width={hole} height={hole} rx={1} fill="#fff" />}
      </svg>
      {children && (
        <span className="absolute inset-0 m-auto flex items-center justify-center" style={{ width: (hole / total) * size * 0.86, height: (hole / total) * size * 0.86 }}>
          {children}
        </span>
      )}
    </div>
  );
}

/** «WIFI:T:WPA;S:name;P:pass;;» for a Wi-Fi QR code, with the special characters escaped. */
export function wifiQR({ ssid, password, security = "WPA", hidden }: { ssid: string; password?: string; security?: "WPA" | "WEP" | "nopass"; hidden?: boolean }) {
  const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
  return `WIFI:T:${security};S:${esc(ssid)};${password ? `P:${esc(password)};` : ""}${hidden ? "H:true;" : ""};`;
}
