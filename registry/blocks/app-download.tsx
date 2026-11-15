import { Download, MonitorSmartphone, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppStore {
  /** Store name, e.g. «کافه‌بازار», «مایکت», «سیب‌اپ», «نسخه‌ی وب (PWA)». */
  store: string;
  caption?: string;
  href: string;
  /** Your own copy of the store logo. */
  icon?: React.ReactNode;
  /** Platform hint shown as a small tag. */
  platform?: "android" | "ios" | "web";
}

export interface AppDownloadProps {
  title: string;
  description?: string;
  stores: AppStore[];
  /** A QR image or component for desktop visitors. A placeholder glyph is drawn without it. */
  qr?: React.ReactNode;
  qrCaption?: string;
  className?: string;
}

const PLATFORM = { android: "اندروید", ios: "آیفون", web: "وب" };

/** One store button. Exported so headers and footers can reuse it on its own. */
export function StoreButton({ store, caption = "دریافت از", href, icon, platform, primary }: AppStore & { primary?: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        "flex h-14 items-center gap-3 rounded-xl border px-4 transition-colors",
        primary ? "border-foreground bg-foreground text-background hover:bg-foreground/90" : "border-border bg-card hover:bg-accent",
      )}
    >
      <span className="flex size-7 shrink-0 items-center justify-center [&_svg]:size-5">{icon ?? (platform === "web" ? <MonitorSmartphone /> : <Download />)}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] leading-4 opacity-70">{caption}</span>
        <span className="truncate text-sm font-bold leading-5">{store}</span>
      </span>
      {platform && <span className="rounded-full border border-current/20 px-2 py-0.5 text-[10px] opacity-70">{PLATFORM[platform]}</span>}
    </a>
  );
}

/** دریافت اپلیکیشن. Bazaar, Myket and Sibapp buttons with a QR code for people on desktop. */
export function AppDownload({ title, description, stores, qr, qrCaption = "با دوربین گوشی اسکن کنید", className }: AppDownloadProps) {
  return (
    <section className={cn("px-6 py-16", className)}>
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-border bg-card p-8 md:flex-row md:items-center md:p-10">
        <div className="flex-1">
          <h2 className="text-2xl font-bold leading-10">{title}</h2>
          {description && <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>}
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stores.map((s, i) => <li key={s.store}><StoreButton {...s} primary={i === 0} /></li>)}
          </ul>
        </div>
        <figure className="hidden shrink-0 flex-col items-center gap-3 md:flex">
          <div className="flex size-36 items-center justify-center rounded-2xl bg-white p-3 text-black [&_img]:size-full [&_svg]:size-full">{qr ?? <QrCode strokeWidth={1} />}</div>
          <figcaption className="text-xs text-muted-foreground">{qrCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
