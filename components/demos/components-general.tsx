"use client";

import * as React from "react";
import { BookOpen, Code2, FileText, Grid2x2, Home, LayoutTemplate, MessageCircle, Palette, Plus, Search, ShoppingBag, Sparkles, User, Wifi } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { CopyButton } from "@/registry/ui/copy-button";
import { BottomNav } from "@/registry/ui/bottom-nav";
import { Drawer } from "@/registry/ui/drawer";
import { TreeView, type TreeNode } from "@/registry/ui/tree-view";
import { SortableList } from "@/registry/ui/sortable-list";
import { ResizablePanels } from "@/registry/ui/resizable";
import { ColorInput, ColorPicker } from "@/registry/ui/color-picker";
import { ImageCropper, type CropArea } from "@/registry/ui/image-cropper";
import { SignaturePad, type SignaturePadHandle } from "@/registry/ui/signature-pad";
import { QRCode, wifiQR } from "@/registry/ui/qr-code";
import { MentionInput, MentionText, type MentionUser } from "@/registry/ui/mention-input";
import { ProductTour } from "@/registry/ui/product-tour";
import { Menubar } from "@/registry/ui/menubar";
import { NavigationMenu } from "@/registry/ui/navigation-menu";
import { fa } from "@/lib/utils";

/* ---------- copy ---------- */

function CopyDemo() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center gap-2 rounded-field border-line-field border-input bg-field px-3 py-2 shadow-field">
        <span className="text-xs text-muted-foreground">شبا</span>
        <bdi dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm">IR82 0540 1026 8002 0817 9090 02</bdi>
        <CopyButton value="IR820540102680020817909002" label="کپی شماره‌ی شبا" size="sm" />
      </div>
      <div className="flex gap-2">
        <CopyButton value="https://example.ir/invite/k7Lq" variant="outline">کپی لینک دعوت</CopyButton>
        <CopyButton value="SALE1405" variant="secondary">کد تخفیف</CopyButton>
      </div>
    </div>
  );
}

/* ---------- bottom nav ---------- */

function BottomNavDemo({ action = true }: { action?: boolean }) {
  const [tab, setTab] = React.useState("home");
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-surface border-line border-border bg-background">
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">صفحه‌ی «{({ home: "خانه", search: "جست‌وجو", chat: "گفت‌وگو", me: "من" } as Record<string, string>)[tab]}»</div>
      <BottomNav
        position="static"
        value={tab}
        onChange={setTab}
        items={[
          { value: "home", label: "خانه", icon: Home },
          { value: "search", label: "جست‌وجو", icon: Search },
          { value: "chat", label: "گفت‌وگو", icon: MessageCircle, badge: 3 },
          { value: "me", label: "من", icon: User, badge: true },
        ]}
        action={action ? { label: "ثبت آگهی", icon: Plus, onClick: () => {} } : undefined}
      />
    </div>
  );
}

/* ---------- drawer ---------- */

function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  const brands = ["سامسونگ", "شیائومی", "اپل", "نوکیا", "هواوی", "آنر"];
  const [picked, setPicked] = React.useState<string[]>(["شیائومی"]);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>فیلترها</Button>
      <Drawer open={open} onOpenChange={setOpen} title="فیلترها" description="دستگیره را بکشید تا بزرگ‌تر بشه" footer={<Button className="w-full" onClick={() => setOpen(false)}>نمایش {fa(124)} کالا</Button>}>
        <p className="mb-2 text-sm font-medium">برند</p>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button key={b} type="button" aria-pressed={picked.includes(b)} onClick={() => setPicked((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]))} className="rounded-full border-line border-border px-3 py-1.5 text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">{b}</button>
          ))}
        </div>
        <p className="mb-2 mt-6 text-sm font-medium">ویژگی‌ها</p>
        {["فقط کالاهای موجود", "ارسال سریع", "دارای گارانتی", "تخفیف‌دار"].map((f) => (
          <label key={f} className="flex items-center justify-between border-b border-border py-3 text-sm">{f}<input type="checkbox" className="size-4 accent-[var(--primary)]" /></label>
        ))}
      </Drawer>
    </>
  );
}

/* ---------- tree ---------- */

const tree: TreeNode[] = [
  { id: "app", label: "app", children: [
    { id: "layout", label: "layout.tsx", icon: FileText },
    { id: "page", label: "page.tsx", icon: FileText },
    { id: "shop", label: "(shop)", children: [
      { id: "cart", label: "cart", children: [{ id: "cart-page", label: "page.tsx", icon: FileText }] },
      { id: "product", label: "[slug]", children: [{ id: "product-page", label: "page.tsx", icon: FileText }] },
    ] },
  ] },
  { id: "components", label: "components", meta: 24, children: [
    { id: "ui", label: "ui", meta: 18, children: [{ id: "button", label: "button.tsx", icon: FileText }, { id: "drawer", label: "drawer.tsx", icon: FileText }] },
    { id: "calendar", label: "calendar", meta: 6 },
  ] },
  { id: "lib", label: "lib", children: [{ id: "jalali", label: "jalali.ts", icon: FileText }, { id: "utils", label: "utils.ts", icon: FileText }] },
  { id: "readme", label: "README.md", icon: BookOpen },
];

function TreeDemo() {
  const [sel, setSel] = React.useState<string | null>("page");
  return (
    <div className="w-full max-w-xs rounded-surface border-line border-border bg-card p-2" dir="rtl">
      {/* File names are Latin; the tree itself is still RTL, so indentation grows leftward. */}
      <TreeView aria-label="فایل‌های پروژه" items={tree} selected={sel} onSelect={(n) => setSel(n.id)} defaultExpanded={["app", "shop", "components"]} />
    </div>
  );
}

/* ---------- sortable ---------- */

function SortableDemo() {
  const [items, setItems] = React.useState([
    { id: "a", title: "قهوه", count: 4 },
    { id: "b", title: "نوشیدنی سرد", count: 3 },
    { id: "c", title: "صبحانه و غذا", count: 3 },
    { id: "d", title: "دسر", count: 2 },
  ]);
  return (
    <SortableList
      className="w-full max-w-sm"
      label="ترتیب دسته‌های منو"
      items={items}
      getKey={(i) => i.id}
      getLabel={(i) => i.title}
      onReorder={setItems}
      renderItem={(i, { index }) => (
        <div className="flex items-center justify-between gap-2 text-sm">
          <span><span className="me-2 text-xs tabular-nums text-muted-foreground">{fa(index + 1)}</span>{i.title}</span>
          <span className="text-xs text-muted-foreground">{fa(i.count)} آیتم</span>
        </div>
      )}
    />
  );
}

/* ---------- resizable ---------- */

function ResizableDemo({ compact }: { compact?: boolean }) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-surface border-line border-border bg-card">
      <ResizablePanels defaultSizes={[30, 70]} collapseBelow={12} labels={["فهرست", "محتوا"]}>
        <div className="h-full space-y-1 p-3 text-sm">
          <p className="mb-2 text-xs font-medium text-muted-foreground">صندوق ورودی</p>
          {["سفارش جدید", "پیام پشتیبانی", "گزارش هفتگی"].map((t) => <p key={t} className="truncate rounded-control px-2 py-1.5 hover:bg-accent">{t}</p>)}
        </div>
        {compact ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">محتوا</div>
        ) : (
          <ResizablePanels direction="vertical" defaultSizes={[60, 40]} labels={["پیش‌نمایش", "پاسخ"]}>
            <div className="h-full p-4 text-sm leading-7"><p className="font-semibold">سفارش جدید</p><p className="text-muted-foreground">سفارش ۱۴۰۵۲ ثبت شد و منتظر تأییده.</p></div>
            <div className="flex h-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">جداکننده‌ها را بکشید یا با Tab و فلش جابه‌جا کنید</div>
          </ResizablePanels>
        )}
      </ResizablePanels>
    </div>
  );
}

/* ---------- color ---------- */

function ColorDemo() {
  const [c, setC] = React.useState("#7c3aed");
  return (
    <div className="flex flex-wrap items-start gap-6">
      <ColorPicker value={c} onChange={setC} />
      <div className="space-y-3">
        <ColorInput label="رنگ برند" value={c} onChange={setC} />
        <div className="rounded-surface p-4 text-sm font-semibold text-white" style={{ background: c }}>دکمه با رنگ برند</div>
      </div>
    </div>
  );
}

/* ---------- cropper ---------- */

// A generated picture so the demo needs no network: sky, sun and hills.
const SAMPLE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="900" height="600" fill="url(#s)"/><circle cx="600" cy="230" r="90" fill="#fde68a"/><path d="M0 430 Q200 330 420 420 T900 400 V600 H0Z" fill="#1e1b4b"/><path d="M0 500 Q260 420 520 500 T900 480 V600 H0Z" fill="#0f0a2e"/></svg>`)}`;

function CropperDemo({ size = 240 }: { size?: number }) {
  const [area, setArea] = React.useState<CropArea | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <ImageCropper src={SAMPLE} round size={size} onCropChange={setArea} />
      {area && <p dir="ltr" className="font-mono text-[11px] text-muted-foreground">{area.width}×{area.height} @ {area.x},{area.y}</p>}
    </div>
  );
}

/* ---------- signature ---------- */

function SignatureDemo() {
  const pad = React.useRef<SignaturePadHandle>(null);
  const [empty, setEmpty] = React.useState(true);
  const [img, setImg] = React.useState("");
  return (
    <div className="w-full max-w-md space-y-3">
      <SignaturePad ref={pad} onChange={setEmpty} />
      <Button disabled={empty} onClick={() => setImg(pad.current?.toDataURL() ?? "")}>تأیید امضا</Button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="امضای ثبت‌شده" className="h-16 rounded-control border border-border bg-card p-1" />}
    </div>
  );
}

/* ---------- qr ---------- */

function QrDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <figure className="text-center">
        <QRCode value="https://vibefarsi.ir/components/qr-code" label="صفحه‌ی کد QR" />
        <figcaption className="mt-2 text-xs text-muted-foreground">لینک</figcaption>
      </figure>
      <figure className="text-center">
        <QRCode value={wifiQR({ ssid: "naranj-guest", password: "cafe1403" })} label="وای‌فای کافه" rounded color="#4c1d95" />
        <figcaption className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground"><Wifi className="size-3.5" />وای‌فای</figcaption>
      </figure>
      <figure className="text-center">
        <QRCode value="سلام! این متن فارسی داخل کد QR است." label="متن فارسی">
          <span className="flex size-full items-center justify-center rounded-md bg-primary text-primary-foreground"><Sparkles className="size-1/2" /></span>
        </QRCode>
        <figcaption className="mt-2 text-xs text-muted-foreground">متن فارسی با لوگو</figcaption>
      </figure>
    </div>
  );
}

/* ---------- mention ---------- */

const team: MentionUser[] = [
  { id: "1", name: "سارا احمدی", handle: "sara", subtitle: "طراح محصول" },
  { id: "2", name: "علی رضایی", handle: "ali.r", subtitle: "فرانت‌اند" },
  { id: "3", name: "مریم کاظمی", handle: "maryam", subtitle: "مدیر محصول" },
  { id: "4", name: "کیان محمدی", handle: "kian", subtitle: "بک‌اند" },
  { id: "5", name: "نگار رحیمی", handle: "negar", subtitle: "پشتیبانی" },
];

function MentionDemo() {
  const [text, setText] = React.useState("");
  const [sent, setSent] = React.useState<string[]>(["@sara طرح جدید صفحه‌ی پرداخت آماده‌ست، یه نگاه بنداز."]);
  return (
    <div className="w-full max-w-md space-y-3">
      <ul className="space-y-2">
        {sent.map((m, i) => <li key={i} className="rounded-surface bg-secondary px-3 py-2 text-sm"><MentionText users={team}>{m}</MentionText></li>)}
      </ul>
      <MentionInput users={team} value={text} onChange={(t) => setText(t)} aria-label="نظر" placeholder="بنویسید و با @ هم‌تیمی‌ها را صدا بزنید" rows={2} />
      <Button size="sm" disabled={!text.trim()} onClick={() => { setSent((s) => [...s, text.trim()]); setText(""); }}>ارسال</Button>
    </div>
  );
}

/* ---------- tour ---------- */

function TourDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center gap-2 rounded-surface border-line border-border bg-card p-3">
        <span id="tour-logo" className="font-display font-black">دکان</span>
        <label id="tour-search" className="relative flex-1">
          <span className="sr-only">جست‌وجو</span>
          <input placeholder="جست‌وجو" className="h-9 w-full rounded-field bg-secondary px-3 text-sm outline-none" />
        </label>
        <button id="tour-cart" type="button" aria-label="سبد خرید" className="rounded-control p-2 hover:bg-accent"><ShoppingBag className="size-5" /></button>
      </div>
      <Button onClick={() => setOpen(true)}>شروع تور</Button>
      <ProductTour
        open={open}
        onOpenChange={setOpen}
        steps={[
          { title: "خوش اومدید!", body: "در سه قدم کوتاه بخش‌های اصلی را نشون‌تون میدیم." },
          { target: "#tour-search", title: "جست‌وجو", body: "اسم کالا یا کد را بنویسید. غلط تایپی را هم می‌فهمه." },
          { target: "#tour-cart", title: "سبد خرید", body: "هر چی اضافه کنید این‌جا می‌مونه، حتی اگه از سایت برید." },
        ]}
      />
    </div>
  );
}

/* ---------- menubar ---------- */

function MenubarDemo() {
  const [ruler, setRuler] = React.useState(true);
  const [grid, setGrid] = React.useState(false);
  const [last, setLast] = React.useState("");
  const act = (l: string) => () => setLast(l);
  return (
    <div className="space-y-3">
      <Menubar
        menus={[
          { label: "فایل", items: [{ label: "سند جدید", shortcut: "⌘N", onSelect: act("سند جدید") }, { label: "باز کردن…", shortcut: "⌘O", onSelect: act("باز کردن") }, { type: "separator" }, { label: "خروجی PDF", onSelect: act("خروجی PDF") }, { label: "چاپ", shortcut: "⌘P", disabled: true }, { type: "separator" }, { label: "حذف سند", danger: true, onSelect: act("حذف سند") }] },
          { label: "ویرایش", items: [{ label: "برگشت", shortcut: "⌘Z", onSelect: act("برگشت") }, { label: "انجام دوباره", shortcut: "⇧⌘Z", onSelect: act("انجام دوباره") }, { type: "separator" }, { label: "یافتن", shortcut: "⌘F", onSelect: act("یافتن") }] },
          { label: "نما", items: [{ type: "checkbox", label: "خط‌کش", checked: ruler, onCheckedChange: setRuler }, { type: "checkbox", label: "شبکه", checked: grid, onCheckedChange: setGrid }] },
          { label: "راهنما", items: [{ label: "میانبرهای کیبورد", onSelect: act("میانبرها") }] },
        ]}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">{last ? `آخرین فرمان: ${last}` : `خط‌کش ${ruler ? "روشن" : "خاموش"}، شبکه ${grid ? "روشن" : "خاموش"}`}</p>
    </div>
  );
}

/* ---------- navigation menu ---------- */

function NavMenuDemo() {
  return (
    <div className="flex w-full min-h-72 items-start justify-center">
      <NavigationMenu
        items={[
          { label: "کتابخانه", links: [
            { title: "کامپوننت‌ها", href: "#", description: "دکمه تا تقویم شمسی، همه راست‌چین", icon: Code2 },
            { title: "بلاک‌ها", href: "#", description: "هیرو، قیمت، فوتر و ورود آماده", icon: Grid2x2 },
            { title: "قالب‌ها", href: "#", description: "صفحه‌های کامل برای شروع سریع", icon: LayoutTemplate },
            { title: "تم‌ها", href: "#", description: "سیستم‌های طراحی با یک فرمان", icon: Palette },
          ], featured: { title: "نسخه‌ی ۳", description: "یازده قالب تازه، نمودار سنکی و نقشه‌ی استان‌ها", href: "#", cta: "تازه‌ها" } },
          { label: "مستندات", links: [
            { title: "شروع سریع", href: "#", description: "نصب با CLI در یک دقیقه" },
            { title: "راست‌چین", href: "#", description: "قاعده‌های جهت و ارقام فارسی" },
          ], columns: 1 },
          { label: "قیمت", href: "#" },
        ]}
      />
    </div>
  );
}

export const generalDemos: Record<string, React.ReactNode> = {
  "copy-button": <CopyDemo />,
  "bottom-nav": <BottomNavDemo />,
  drawer: <DrawerDemo />,
  "tree-view": <TreeDemo />,
  "sortable-list": <SortableDemo />,
  resizable: <ResizableDemo />,
  "color-picker": <ColorDemo />,
  "image-cropper": <CropperDemo />,
  "signature-pad": <SignatureDemo />,
  "qr-code": <QrDemo />,
  "mention-input": <MentionDemo />,
  "product-tour": <TourDemo />,
  menubar: <MenubarDemo />,
  "navigation-menu": <NavMenuDemo />,
};

export const generalCardDemos: Record<string, React.ReactNode> = {
  ...generalDemos,
  "bottom-nav": <BottomNavDemo action={false} />,
  resizable: <ResizableDemo compact />,
  "color-picker": <ColorPicker defaultValue="#7c3aed" contrast={false} swatches={[]} />,
  "image-cropper": <CropperDemo size={150} />,
  "qr-code": <QRCode value="https://vibefarsi.ir" label="سایت" size={128} />,
  "navigation-menu": <NavMenuDemo />,
};
