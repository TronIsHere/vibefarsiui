"use client";

import * as React from "react";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type CropArea = { x: number; y: number; width: number; height: number; rotation: number };

export interface ImageCropperProps {
  src: string;
  /** Width / height of the crop frame. Default 1. */
  aspect?: number;
  /** Round frame for avatars. */
  round?: boolean;
  /** Max zoom. Default 4. */
  maxZoom?: number;
  /** Called as the crop changes, with the area in the image's own pixels. */
  onCropChange?: (area: CropArea) => void;
  /** Width of the frame on screen in px. Default 280. */
  size?: number;
  className?: string;
}

/**
 * برش تصویر. Drag to move the photo under a fixed frame, pinch or use the slider to zoom,
 * rotate by quarter turns. Arrow keys move it, + and − zoom. The image always covers the
 * frame, so the result never has empty corners. Pair with `cropToBlob` to get the file.
 */
export function ImageCropper({ src, aspect = 1, round, maxZoom = 4, onCropChange, size = 280, className }: ImageCropperProps) {
  const fw = size, fh = size / aspect;
  const [nat, setNat] = React.useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const [rot, setRot] = React.useState(0);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinch = React.useRef<{ d: number; z: number } | null>(null);

  // Size of the (rotated) image at zoom 1, scaled to just cover the frame.
  const turned = rot % 180 !== 0;
  const iw = nat ? (turned ? nat.h : nat.w) : 1;
  const ih = nat ? (turned ? nat.w : nat.h) : 1;
  const cover = Math.max(fw / iw, fh / ih);
  const dw = iw * cover * zoom, dh = ih * cover * zoom;
  const clamp = React.useCallback((p: { x: number; y: number }, z = zoom) => {
    const w = iw * cover * z, h = ih * cover * z;
    const mx = (w - fw) / 2, my = (h - fh) / 2;
    return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
  }, [iw, ih, cover, zoom, fw, fh]);

  React.useEffect(() => {
    if (!nat || !onCropChange) return;
    const s = cover * zoom;
    // Frame position inside the rotated image, then expressed in source pixels.
    const left = (dw - fw) / 2 - pos.x, top = (dh - fh) / 2 - pos.y;
    onCropChange({ x: Math.round(left / s), y: Math.round(top / s), width: Math.round(fw / s), height: Math.round(fh / s), rotation: rot });
  }, [nat, cover, zoom, pos, dw, dh, fw, fh, rot, onCropChange]);

  const setZoomTo = (z: number) => {
    const nz = Math.min(maxZoom, Math.max(1, z));
    setZoom(nz);
    setPos((p) => clamp(p, nz));
  };

  function down(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: zoom };
    }
  }
  function move(e: React.PointerEvent) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      setZoomTo(pinch.current.z * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.d));
    } else if (pointers.current.size === 1) {
      setPos((p) => clamp({ x: p.x + e.clientX - prev.x, y: p.y + e.clientY - prev.y }));
    }
  }
  function up(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  }
  function key(e: React.KeyboardEvent) {
    const d = e.shiftKey ? 40 : 10;
    const moves: Record<string, [number, number]> = { ArrowLeft: [d, 0], ArrowRight: [-d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] };
    if (moves[e.key]) { e.preventDefault(); setPos((p) => clamp({ x: p.x + moves[e.key][0], y: p.y + moves[e.key][1] })); }
    else if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoomTo(zoom + 0.2); }
    else if (e.key === "-") { e.preventDefault(); setZoomTo(zoom - 0.2); }
  }

  return (
    <div className={cn("inline-flex flex-col items-center gap-3", className)} style={{ width: fw + 40 }}>
      <div
        role="application"
        tabIndex={0}
        aria-label="ناحیه‌ی برش. با کشیدن یا کلیدهای جهت تصویر را جابه‌جا کنید و با + و − بزرگ‌نمایی کنید."
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onWheel={(e) => setZoomTo(zoom - e.deltaY * 0.002)}
        onKeyDown={key}
        className="relative cursor-grab touch-none select-none overflow-hidden rounded-surface bg-black outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ width: fw + 40, height: fh + 40 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
          style={{
            width: nat ? (turned ? dh : dw) : "100%",
            height: nat ? (turned ? dw : dh) : "auto",
            transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${rot}deg)`,
          }}
        />
        {/* Dim everything outside the frame with one huge shadow. */}
        <div aria-hidden className={cn("pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/90 shadow-[0_0_0_9999px_rgb(0_0_0/0.55)]", round ? "rounded-full" : "rounded-md")} style={{ width: fw, height: fh }}>
          {!round && (
            <span className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }, (_, i) => <span key={i} className="border-[0.5px] border-white/25" />)}
            </span>
          )}
        </div>
      </div>
      <div dir="ltr" className="flex w-full items-center gap-2 text-muted-foreground">
        <button type="button" aria-label="کوچک‌نمایی" onClick={() => setZoomTo(zoom - 0.25)} className="rounded-control p-1.5 hover:bg-accent hover:text-foreground"><ZoomOut className="size-4" /></button>
        <input type="range" min={1} max={maxZoom} step={0.01} value={zoom} onChange={(e) => setZoomTo(Number(e.target.value))} aria-label="بزرگ‌نمایی" aria-valuetext={`${fa(Math.round(zoom * 100))}٪`} className="h-1 flex-1 cursor-pointer accent-[var(--primary)]" />
        <button type="button" aria-label="بزرگ‌نمایی" onClick={() => setZoomTo(zoom + 0.25)} className="rounded-control p-1.5 hover:bg-accent hover:text-foreground"><ZoomIn className="size-4" /></button>
        <button type="button" aria-label="چرخش ۹۰ درجه" onClick={() => { setRot((r) => (r + 90) % 360); setPos({ x: 0, y: 0 }); }} className="rounded-control p-1.5 hover:bg-accent hover:text-foreground"><RotateCw className="size-4" /></button>
      </div>
    </div>
  );
}

/** Draws the crop to a canvas and returns a Blob (JPEG by default) at `outputWidth` px wide. */
export async function cropToBlob(src: string, area: CropArea, { outputWidth = 512, type = "image/jpeg", quality = 0.9, round = false }: { outputWidth?: number; type?: string; quality?: number; round?: boolean } = {}): Promise<Blob> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();
  const scale = outputWidth / area.width;
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = Math.round(area.height * scale);
  const ctx = canvas.getContext("2d")!;
  if (round) { ctx.beginPath(); ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, 0, 0, Math.PI * 2); ctx.clip(); }
  // Rotate the whole image about its rotated bounding box, then shift so the crop sits at 0,0.
  const turned = area.rotation % 180 !== 0;
  const bw = turned ? img.naturalHeight : img.naturalWidth, bh = turned ? img.naturalWidth : img.naturalHeight;
  ctx.scale(scale, scale);
  ctx.translate(-area.x + bw / 2, -area.y + bh / 2);
  ctx.rotate((area.rotation * Math.PI) / 180);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("crop failed"))), type, quality));
}
