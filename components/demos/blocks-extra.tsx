"use client";

import * as React from "react";
import { BarChart3, Boxes, CreditCard, Receipt, ShoppingCart, Truck, Users } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { HeroSplit } from "@/registry/blocks/hero-split";
import { HeroApp } from "@/registry/blocks/hero-app";
import { HeroSearch } from "@/registry/blocks/hero-search";
import { FooterMinimal } from "@/registry/blocks/footer-minimal";
import { FooterMega } from "@/registry/blocks/footer-mega";
import { FooterCentered } from "@/registry/blocks/footer-centered";
import { PricingSingle } from "@/registry/blocks/pricing-single";
import { PricingUsage } from "@/registry/blocks/pricing-usage";
import { PricingRows } from "@/registry/blocks/pricing-rows";
import { TestimonialsWall } from "@/registry/blocks/testimonials-wall";
import { TestimonialSpotlight } from "@/registry/blocks/testimonial-spotlight";
import { TestimonialsMarquee } from "@/registry/blocks/testimonials-marquee";
import { NavbarFloating } from "@/registry/blocks/navbar-floating";
import { NavbarShop } from "@/registry/blocks/navbar-shop";
import { NavbarMega } from "@/registry/blocks/navbar-mega";
import { LoginSplit } from "@/registry/blocks/login-split";
import { TrustBadges } from "@/registry/blocks/trust-badges";
import { AppDownload, StoreButton } from "@/registry/blocks/app-download";
import { SocialLinks, type SocialLink } from "@/registry/blocks/social-links";
import { CartDrawer, type CartItem } from "@/registry/blocks/cart-drawer";
import { ProductDetail } from "@/registry/blocks/product-detail";
import { OrderTracking } from "@/registry/blocks/order-tracking";
import { Reviews, type Review } from "@/registry/blocks/reviews";

const logo = <><span className="inline-block size-6 rounded-md bg-foreground" />دکان</>;

/** Faint page lines under thin bars so their previews read as a page. */
const ghostPage = (
  <div aria-hidden className="mx-auto max-w-6xl space-y-4 px-6 py-14">
    <div className="h-4 w-24 rounded bg-secondary" />
    <div className="h-10 w-2/3 rounded-lg bg-secondary" />
    <div className="h-10 w-1/2 rounded-lg bg-secondary" />
    <div className="h-4 w-1/3 rounded bg-secondary/70" />
    <div className="flex gap-3 pt-2"><div className="h-10 w-32 rounded-full bg-secondary" /><div className="h-10 w-32 rounded-full border border-border" /></div>
  </div>
);

const wait = (ms = 700) => new Promise<void>((r) => setTimeout(r, ms));

const socials: SocialLink[] = [
  { network: "telegram", href: "#", handle: "@dokan" },
  { network: "eitaa", href: "#", handle: "@dokan" },
  { network: "bale", href: "#", handle: "@dokan" },
  { network: "instagram", href: "#", handle: "@dokan.ir" },
  { network: "aparat", href: "#", handle: "aparat.com/dokan" },
  { network: "linkedin", href: "#", handle: "company/dokan" },
];

const seals = [
  { name: "نماد اعتماد الکترونیکی", caption: "مجوز کسب‌وکار اینترنتی از مرکز توسعه‌ی تجارت الکترونیکی" },
  { name: "ساماندهی", caption: "ثبت‌شده در ستاد ساماندهی پایگاه‌های اینترنتی" },
  { name: "اتحادیه‌ی کسب‌وکارهای مجازی", caption: "عضو رسمی اتحادیه" },
];

const quotes = [
  { name: "نگار کریمی", role: "مدیر فروشگاه لوازم خانگی", quote: "فاکتور شمسی و درگاه بانکی همان روز اول کار کرد. قبلش دو هفته با افزونه‌ها کلنجار می‌رفتم.", source: "نظر در بازار" },
  { name: "علی رضایی", role: "توسعه‌دهنده‌ی فرانت‌اند", quote: "راست‌چین بودن را یک بار برای همیشه حل کرده.", source: "توییتر" },
  { name: "مینا صادقی", role: "طراح محصول", quote: "کامپوننت‌ها همان چیزی‌اند که در فیگما می‌کشم، بدون این‌که برای فارسی دست‌کاری کنم. تیم ما حالا هر صفحه را در یک بعدازظهر تحویل می‌دهد.", source: "لینکدین" },
  { name: "رضا احمدی", role: "صاحب کافه", quote: "منوی دیجیتال را خودم ساختم. مشتری‌ها با QR سفارش می‌دهند و من فقط قهوه درست می‌کنم.", source: "اینستاگرام" },
  { name: "سارا محمدی", role: "مدیر بازاریابی", quote: "گزارش فروش هفتگی دقیقاً همان چیزی است که هر شنبه صبح لازم دارم.", source: "ایمیل" },
  { name: "حامد نوری", role: "بنیان‌گذار استارتاپ", quote: "پشتیبانی تلفنی واقعاً جواب می‌دهد، آن هم به فارسی و بدون منشی تلفنی. برای ما که شب‌ها کار می‌کنیم خیلی مهم بود.", source: "نظر در بازار" },
  { name: "لیلا حسینی", role: "فروشنده‌ی صنایع دستی", quote: "ارسال با پست و تیپاکس یک کلیک است. بارنامه را هم خودش چاپ می‌کند.", source: "توییتر" },
  { name: "امیر جعفری", role: "مدیر فنی", quote: "API مستندات فارسی دارد و نمونه‌کدهایش کار می‌کند.", source: "گیت‌هاب" },
];

const cartSeed: CartItem[] = [
  { id: "1", name: "هدفون بی‌سیم با حذف نویز", variant: "مشکی", price: 2_450_000, original: 2_900_000, quantity: 1, max: 4 },
  { id: "2", name: "کیبورد مکانیکی کم‌صدا", variant: "حروف فارسی، سوییچ قهوه‌ای", price: 1_950_000, quantity: 1 },
  { id: "3", name: "پایه‌ی لپ‌تاپ آلومینیومی", price: 640_000, original: 720_000, quantity: 2 },
];

function CartDrawerDemo() {
  // Open on the standalone preview page so its screenshot shows the drawer, closed inside the docs.
  const [open, setOpen] = React.useState(() => typeof window !== "undefined" && window.location.pathname.startsWith("/preview/"));
  const [items, setItems] = React.useState(cartSeed);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return (
    <>
      <NavbarShop
        sticky={false}
        logo={logo}
        cartCount={count}
        location="تهران"
        categories={[{ label: "شگفت‌انگیزها", href: "#", highlight: true }, { label: "موبایل", href: "#" }, { label: "لپ‌تاپ", href: "#" }, { label: "صوتی", href: "#" }]}
        onCartClick={() => setOpen(true)}
      />
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">روی آیکون سبد بزنید یا از این دکمه استفاده کنید.</p>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}><ShoppingCart />باز کردن سبد</Button>
          <Button variant="outline" onClick={() => setItems(cartSeed)}>پر کردن دوباره</Button>
        </div>
      </div>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        freeShippingFrom={8_000_000}
        onQuantityChange={(id, quantity) => setItems((list) => list.map((i) => (i.id === id ? { ...i, quantity } : i)))}
        onRemove={(id) => setItems((list) => list.filter((i) => i.id !== id))}
        onCheckout={() => setOpen(false)}
      />
    </>
  );
}

const day = 864e5;
const at = (daysAgo: number, h: number, m: number) => {
  const d = new Date(Date.now() - daysAgo * day);
  d.setHours(h, m, 0, 0);
  return d;
};

const reviews: Review[] = [
  { id: "1", author: "نگار کریمی", rating: 5, date: at(2, 10, 0), verified: true, title: "ارزش خرید دارد", body: "دو هفته است استفاده می‌کنم. حذف نویز در مترو واقعاً خوب است و باتری با روزی سه ساعت استفاده، یک هفته کامل دوام آورد.", pros: ["باتری قوی", "حذف نویز عالی"], cons: ["کیف حمل ندارد"], helpful: 24, reply: "ممنون از دیدگاه‌تان. کیف حمل از این ماه جداگانه در فروشگاه موجود است." },
  { id: "2", author: "علی رضایی", rating: 4, date: at(9, 18, 30), verified: true, body: "کیفیت صدا خوب است ولی بالشتک‌ها بعد از دو ساعت کمی گرم می‌شوند.", pros: ["صدای شفاف"], cons: ["گرم شدن گوش"], helpful: 11 },
  { id: "3", author: "مینا صادقی", rating: 5, date: at(15, 9, 15), body: "برای جلسه‌های آنلاین گرفتم. میکروفونش از لپ‌تاپ خیلی بهتر است.", helpful: 6 },
  { id: "4", author: "رضا احمدی", rating: 2, date: at(31, 21, 0), verified: true, title: "اتصال بلوتوث قطع می‌شود", body: "با گوشی مشکلی ندارد ولی با لپ‌تاپ هر چند دقیقه یک بار قطع و وصل می‌شود.", cons: ["ناپایداری بلوتوث"], helpful: 17, reply: "این مشکل با به‌روزرسانی نرم‌افزار رفع شده. راهنمای به‌روزرسانی را برایتان پیامک کردیم." },
  { id: "5", author: "سارا محمدی", rating: 4, date: at(44, 12, 45), verified: true, body: "بسته‌بندی سالم رسید و ارسال یک‌روزه بود.", helpful: 3 },
];

export const extraBlockDemos: Record<string, React.ReactNode> = {
  "hero-split": (
    <HeroSplit
      badge="نسخه‌ی پاییز ۱۴۰۵"
      title={<>حسابداری فروشگاه، <span className="text-brand">بدون حسابدار</span></>}
      description="فاکتور رسمی، موجودی انبار و گزارش فصلی مالیات را خودش جمع می‌کند و فقط چیزهایی را نشان می‌دهد که باید درباره‌شان تصمیم بگیرید."
      bullets={["فاکتور رسمی با تاریخ شمسی", "اتصال به سامانه‌ی مودیان", "گزارش سود و زیان هر شنبه صبح"]}
      primary={{ label: "۱۴ روز رایگان امتحان کنید" }}
      secondary={{ label: "دیدن نمونه" }}
    />
  ),
  "hero-app": (
    <HeroApp
      title={<>خرج‌هایتان را در <span className="text-brand">جیب‌تان</span> نگه دارید</>}
      description="دخل و خرج ماهانه، قسط‌ها و یادآور قبض، همه در یک اپ فارسی که بدون اینترنت هم کار می‌کند."
      stores={[
        { store: "کافه‌بازار", href: "#" },
        { store: "مایکت", href: "#" },
        { store: "سیب‌اپ", caption: "نسخه‌ی آیفون در", href: "#" },
      ]}
      rating={{ value: 4.5, count: "۲۰۰ هزار" }}
    />
  ),
  "hero-search": (
    <HeroSearch
      title={<>پزشک‌تان را <span className="text-brand">همین امروز</span> ببینید</>}
      description="نوبت حضوری و مشاوره‌ی آنلاین از پزشک‌های تأییدشده در سراسر کشور."
      placeholder="نام پزشک، تخصص یا بیمارستان"
      popular={["دندانپزشک", "پوست و مو", "چشم‌پزشک", "روان‌شناس"]}
      facts={["۱۲ هزار پزشک", "نوبت همان روز", "پرداخت بعد از ویزیت"]}
    />
  ),
  "footer-minimal": (
    <>
      {ghostPage}
      <FooterMinimal
        logo="دکان"
        links={[{ label: "ویژگی‌ها", href: "#" }, { label: "قیمت", href: "#" }, { label: "وبلاگ", href: "#" }, { label: "قوانین", href: "#" }, { label: "تماس", href: "#" }]}
        end={<SocialLinks links={socials.slice(0, 4)} />}
      />
    </>
  ),
  "footer-mega": (
    <FooterMega
      logo="دکان"
      description="فروشگاه اینترنتی لوازم دیجیتال با ضمانت اصالت کالا و هفت روز مهلت بازگشت."
      contact={{ phone: "021-91000000", hours: "هر روز از ۸ صبح تا ۱۰ شب", address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲۰" }}
      newsletter={{ title: "از تخفیف‌ها زودتر باخبر شوید", description: "هفته‌ای یک ایمیل، بدون تبلیغ اضافه." }}
      columns={[
        { title: "راهنمای خرید", links: [{ label: "نحوه‌ی ثبت سفارش", href: "#" }, { label: "رویه‌ی ارسال", href: "#" }, { label: "شیوه‌های پرداخت", href: "#" }] },
        { title: "خدمات مشتریان", links: [{ label: "پرسش‌های متداول", href: "#" }, { label: "بازگرداندن کالا", href: "#" }, { label: "پیگیری سفارش", href: "#" }] },
        { title: "با دکان", links: [{ label: "درباره‌ی ما", href: "#" }, { label: "فروشنده شوید", href: "#" }, { label: "فرصت‌های شغلی", href: "#" }] },
      ]}
      seals={<TrustBadges seals={seals.slice(0, 2)} />}
      social={<SocialLinks links={socials.slice(0, 5)} />}
      apps={<><StoreButton store="کافه‌بازار" href="#" primary /><StoreButton store="سیب‌اپ" href="#" /></>}
      legal={[{ label: "قوانین و مقررات", href: "#" }, { label: "حریم خصوصی", href: "#" }, { label: "گزارش تخلف", href: "#" }]}
    />
  ),
  "footer-centered": (
    <>
      {ghostPage}
      <FooterCentered
        logo={<span className="flex items-center gap-2">{logo}</span>}
        tagline="فروشگاه‌ساز فارسی برای کسب‌وکارهای کوچک، با درگاه، پست و فاکتور شمسی از روز اول."
        links={[{ label: "ویژگی‌ها", href: "#" }, { label: "قیمت", href: "#" }, { label: "مشتری‌ها", href: "#" }, { label: "وبلاگ", href: "#" }, { label: "تماس", href: "#" }]}
        social={<SocialLinks links={socials.slice(0, 4)} />}
      />
    </>
  ),
  "pricing-single": (
    <PricingSingle
      title="دوره‌ی جامع ری‌اکت و نکست"
      description="از صفر تا ساخت یک فروشگاه کامل فارسی، با پشتیبانی مدرس و دسترسی همیشگی به ویدئوها."
      amount={1_490_000}
      original={2_400_000}
      unit="تومان، یک‌بار پرداخت"
      features={["۴۲ ساعت ویدئوی ضبط‌شده", "پروژه‌ی عملی فروشگاه", "گروه پرسش و پاسخ", "گواهی پایان دوره", "به‌روزرسانی رایگان", "تمرین با بازبینی مدرس"]}
      cta="ثبت‌نام در دوره"
      note="تا ۷ روز اگه راضی نبودید، پول‌تون برمی‌گرده."
    />
  ),
  "pricing-usage": (
    <PricingUsage
      description="اشتراک ماهانه ندارید. فقط برای پیامک‌هایی که می‌فرستید پول میدید و هرچی بیشتر بفرستید، نرخ هر پیامک کمتر میشه."
      unit="پیامک"
      min={1000}
      max={100_000}
      step={1000}
      defaultValue={25_000}
      tiers={[{ upTo: 10_000, unitPrice: 180 }, { upTo: 30_000, unitPrice: 160 }, { upTo: 60_000, unitPrice: 140 }, { upTo: 100_000, unitPrice: 120 }]}
      features={["خط اختصاصی رایگان", "گزارش تحویل", "بدون تاریخ انقضا"]}
      cta="خرید بسته"
    />
  ),
  "pricing-rows": (
    <PricingRows
      description="هر وقت بخواید می‌تونید لغو کنید و باقی‌مانده‌ی دوره برمی‌گرده."
      defaultValue="3m"
      rows={[
        { id: "1m", name: "یک‌ماهه", months: 1, price: 99_000, description: "برای امتحان کردن" },
        { id: "3m", name: "سه‌ماهه", months: 3, price: 249_000, tag: "محبوب" },
        { id: "12m", name: "سالانه", months: 12, price: 790_000, description: "با دو دستگاه هم‌زمان" },
      ]}
    />
  ),
  "testimonials-wall": <TestimonialsWall description="این‌ها را خود کاربرها نوشتن و ما فقط جمع‌شون کردیم." items={quotes} />,
  "testimonial-spotlight": (
    <TestimonialSpotlight
      items={[
        { name: "سارا محمدی", role: "مدیر بازاریابی، فروشگاه نیلا", quote: "از وقتی گزارش فروش هفتگی را داریم، تصمیم‌های تبلیغاتی را با عدد می‌گیریم نه با حدس.", metric: { value: "۳ برابر", label: "فروش در شش ماه" } },
        { name: "رضا احمدی", role: "صاحب کافه‌ی دنج", quote: "مشتری پشت میز با گوشی سفارش می‌دهد و ما فقط قهوه درست می‌کنیم.", metric: { value: "۴۰٪", label: "سفارش بیشتر در ساعت شلوغ" } },
        { name: "نگار کریمی", role: "مدیر فروشگاه لوازم خانگی", quote: "راه‌اندازی درگاه بانکی که قبلاً دو هفته طول می‌کشید، این بار یک بعدازظهر بود.", metric: { value: "۱ روز", label: "تا اولین فروش" } },
      ]}
    />
  ),
  "testimonials-marquee": <TestimonialsMarquee items={quotes} />,
  "navbar-floating": (
    <>
      <NavbarFloating fixed={false} logo={logo} links={[{ label: "ویژگی‌ها", href: "#", active: true }, { label: "قیمت", href: "#" }, { label: "مشتری‌ها", href: "#" }, { label: "وبلاگ", href: "#" }]} action={{ label: "شروع رایگان" }} />
      {ghostPage}
    </>
  ),
  "navbar-shop": (
    <>
      <NavbarShop
        sticky={false}
        logo={logo}
        cartCount={3}
        location="تهران"
        categories={[{ label: "شگفت‌انگیزها", href: "#", highlight: true }, { label: "موبایل", href: "#" }, { label: "لپ‌تاپ", href: "#" }, { label: "صوتی و تصویری", href: "#" }, { label: "خانه و آشپزخانه", href: "#" }, { label: "کتاب", href: "#" }]}
      />
      {ghostPage}
    </>
  ),
  "navbar-mega": (
    <>
      <NavbarMega
        sticky={false}
        logo={logo}
        items={[
          {
            label: "محصول",
            groups: [
              { title: "فروش", links: [{ label: "فاکتور", href: "#", description: "فاکتور رسمی با تاریخ شمسی", icon: Receipt }, { label: "درگاه پرداخت", href: "#", description: "همه‌ی بانک‌ها با یک قرارداد", icon: CreditCard }] },
              { title: "انبار و ارسال", links: [{ label: "انبارداری", href: "#", description: "موجودی لحظه‌ای چند انبار", icon: Boxes }, { label: "ارسال", href: "#", description: "پست، تیپاکس و پیک", icon: Truck }] },
              { title: "رشد", links: [{ label: "گزارش‌ها", href: "#", description: "فروش، سود و مشتری", icon: BarChart3 }, { label: "باشگاه مشتریان", href: "#", description: "امتیاز و کد تخفیف", icon: Users }] },
            ],
            feature: { title: "نسخه‌ی پاییز منتشر شد", description: "اتصال به سامانه‌ی مودیان و گزارش فصلی مالیات.", href: "#", cta: "دیدن تغییرات" },
          },
          { label: "قیمت", href: "#" },
          { label: "مشتری‌ها", href: "#" },
          { label: "راهنما", href: "#" },
        ]}
      />
      {ghostPage}
    </>
  ),
  "login-split": (
    <LoginSplit
      logo={logo}
      onRequestCode={() => wait()}
      onVerify={() => wait()}
      aside={
        <figure>
          <blockquote className="text-2xl font-medium leading-[1.9]">«راه‌اندازی فروشگاه ده دقیقه طول کشید. همان شب اولین سفارش را گرفتیم.»</blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">نگار کریمی، مدیر فروشگاه لوازم خانگی</figcaption>
        </figure>
      }
    />
  ),
  "trust-badges": <TrustBadges variant="cards" title="با خیال راحت خرید کنید" description="مجوزهای این فروشگاه را می‌تونید با کلیک روی هر نشان در سایت همون نهاد بررسی کنید." seals={seals} />,
  "app-download": (
    <AppDownload
      title="اپلیکیشن دکان را نصب کنید"
      description="سفارش‌ها را از گوشی پیگیری کنید و زودتر از بقیه از تخفیف‌ها باخبر بشید."
      stores={[
        { store: "کافه‌بازار", platform: "android", href: "#" },
        { store: "مایکت", platform: "android", href: "#" },
        { store: "سیب‌اپ", platform: "ios", href: "#" },
        { store: "نسخه‌ی وب", caption: "بدون نصب", platform: "web", href: "#" },
      ]}
    />
  ),
  "social-links": (
    <div className="mx-auto max-w-2xl space-y-10 px-6 py-12">
      <div className="flex justify-center"><SocialLinks links={socials} /></div>
      <SocialLinks variant="cards" links={socials} />
    </div>
  ),
  "cart-drawer": <CartDrawerDemo />,
  "product-detail": (
    <ProductDetail
      title="هدفون بی‌سیم با حذف نویز فعال"
      subtitle="Sound Pro X2 Wireless ANC"
      price={2_450_000}
      original={2_900_000}
      rating={{ value: 4.5, count: 128 }}
      options={[
        { name: "رنگ", values: [{ id: "black", label: "مشکی", color: "#18181b" }, { id: "white", label: "سفید", color: "#f4f4f5" }, { id: "blue", label: "آبی", color: "#3b6fd4" }, { id: "green", label: "سبز", color: "#3f7d5a", disabled: true }] },
        { name: "گارانتی", values: [{ id: "18", label: "۱۸ ماهه" }, { id: "24", label: "۲۴ ماهه" }] },
      ]}
      specs={[{ label: "باتری", value: "۴۰ ساعت" }, { label: "اتصال", value: "بلوتوث ۵٫۳" }, { label: "وزن", value: "۲۵۰ گرم" }]}
      seller="دکان"
      warranty="گارانتی اصالت و سلامت فیزیکی"
      shipping="ارسال از فردا"
      returns="هفت روز مهلت بازگشت"
      stock={4}
    />
  ),
  "order-tracking": (
    <OrderTracking
      orderId="DK-48213"
      current={2}
      steps={[
        { title: "ثبت سفارش", at: at(3, 9, 12) },
        { title: "آماده‌سازی", at: at(3, 14, 40), note: "انبار مرکزی تهران" },
        { title: "تحویل به پست", at: at(2, 10, 5), note: "مرکز مبادلات تهران" },
        { title: "در مسیر شما" },
        { title: "تحویل شد" },
      ]}
      carrier={{ name: "پست", code: "052340981200045871230114", href: "#" }}
      eta={new Date(Date.now() + 2 * day)}
      recipient={{ name: "سارا محمدی", address: "شیراز، بلوار چمران، کوچه‌ی ۱۲، پلاک ۴۸، واحد ۳" }}
      items={[{ name: "هدفون بی‌سیم با حذف نویز", quantity: 1 }, { name: "پایه‌ی لپ‌تاپ آلومینیومی", quantity: 2 }]}
      total={3_730_000}
    />
  ),
  reviews: <Reviews reviews={reviews} />,
};
