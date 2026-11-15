"use client";

import { BarChart3, Globe, Shield, Sparkles, Zap } from "lucide-react";
import { HeroBlock } from "@/registry/blocks/hero";
import { FeaturesBlock } from "@/registry/blocks/features";
import { PricingBlock } from "@/registry/blocks/pricing";
import { FaqBlock } from "@/registry/blocks/faq";
import { StatsBlock } from "@/registry/blocks/stats";
import { TestimonialsBlock } from "@/registry/blocks/testimonials";
import { AuthCard } from "@/registry/blocks/auth-card";
import { CtaBlock } from "@/registry/blocks/cta";
import { AnnouncementBanner } from "@/registry/blocks/banner";
import { Navbar } from "@/registry/blocks/navbar";
import { LogoCloud } from "@/registry/blocks/logo-cloud";
import { FeatureSplit } from "@/registry/blocks/feature-split";
import { BentoGrid } from "@/registry/blocks/bento";
import { StepsBlock } from "@/registry/blocks/steps";
import { TeamBlock } from "@/registry/blocks/team";
import { ContactBlock } from "@/registry/blocks/contact";
import { NewsletterBlock } from "@/registry/blocks/newsletter";
import { ProductGrid } from "@/registry/blocks/product-grid";
import { BlogGrid } from "@/registry/blocks/blog-grid";
import { ComparisonTable } from "@/registry/blocks/comparison";
import { DashboardStats } from "@/registry/blocks/dashboard-stats";
import { SignupCard } from "@/registry/blocks/signup-card";
import { FooterBlock } from "@/registry/blocks/footer";
import { extraBlockDemos } from "./blocks-extra";

/** Faint page lines under thin bars (navbar, banner) so their previews read as a page. */
const ghostPage = (
  <div aria-hidden className="mx-auto max-w-6xl space-y-4 px-6 py-14">
    <div className="h-4 w-24 rounded bg-secondary" />
    <div className="h-10 w-2/3 rounded-lg bg-secondary" />
    <div className="h-10 w-1/2 rounded-lg bg-secondary" />
    <div className="h-4 w-1/3 rounded bg-secondary/70" />
    <div className="flex gap-3 pt-2"><div className="h-10 w-32 rounded-full bg-secondary" /><div className="h-10 w-32 rounded-full border border-border" /></div>
  </div>
);

/** Full-width block demos; the landing scales them down, the docs show them at size. */
export const blockDemos: Record<string, React.ReactNode> = {
  hero: (
    <HeroBlock
      badge="نسخه‌ی ۲ منتشر شد"
      title={<>فروشگاه‌تان را امروز باز کنید، <span className="text-brand">نه ماه بعد</span></>}
      description="درگاه بانکی، پست، فاکتور شمسی و هوش مصنوعی که به زبان مشتری‌های شما حرف می‌زند؛ همه آماده."
      primary={{ label: "ساخت فروشگاه رایگان" }}
      proof={{ people: [{ name: "سارا" }, { name: "علی" }, { name: "نگار" }, { name: "رضا" }], text: "فروشگاه‌های فعال روی دکان" }}
    />
  ),
  features: (
    <FeaturesBlock
      eyebrow="چرا دکان"
      title="همه‌چیز برای فروش آنلاین"
      features={[
        { icon: Zap, title: "سریع راه می‌افتد", description: "در کمتر از ده دقیقه فروشگاه‌تان بالا است؛ بدون کدنویسی." },
        { icon: Shield, title: "پرداخت امن", description: "درگاه‌های بانکی ایران با تأیید دومرحله‌ای و رسید پیامکی." },
        { icon: Sparkles, title: "هوش مصنوعی فارسی", description: "توضیح محصول و پاسخ به مشتری را خودش می‌نویسد." },
      ]}
    />
  ),
  pricing: (
    <PricingBlock
      plans={[
        { name: "شروع", monthly: 0, description: "برای امتحان کردن", features: ["۱۰ محصول", "دامنه‌ی رایگان", "پشتیبانی تلگرامی"] },
        { name: "حرفه‌ای", monthly: 290_000, description: "برای کسب‌وکار در حال رشد", features: ["محصول نامحدود", "دامنه‌ی اختصاصی", "گزارش فروش", "پشتیبانی تلفنی"], highlighted: true },
        { name: "سازمانی", monthly: 990_000, description: "برای تیم‌های بزرگ", features: ["چند فروشگاه", "API اختصاصی", "مدیر حساب"] },
      ]}
    />
  ),
  faq: (
    <FaqBlock
      items={[
        { id: "1", title: "برای شروع به کارت بانکی نیاز دارم؟", content: "نه. پلن شروع رایگان است و تا وقتی نخواهید ارتقا دهید، چیزی پرداخت نمی‌کنید." },
        { id: "2", title: "درگاه پرداخت چطور وصل می‌شود؟", content: "با وارد کردن ترمینال بانک‌تان در تنظیمات؛ حدود پنج دقیقه طول می‌کشد." },
        { id: "3", title: "می‌توانم دامنه‌ی خودم را وصل کنم؟", content: "بله، در پلن حرفه‌ای و بالاتر. راهنمای قدم‌به‌قدم داخل پنل هست." },
      ]}
    />
  ),
  stats: <StatsBlock items={[{ value: "۲٬۴۰۰+", label: "فروشگاه فعال" }, { value: "۹۹٫۹٪", label: "آپ‌تایم", hint: "۱۲ ماه گذشته" }, { value: "۴٫۸", label: "امتیاز کاربران", hint: "از ۵" }, { value: "۲۴/۷", label: "پشتیبانی" }]} />,
  testimonials: (
    <TestimonialsBlock
      items={[
        { name: "نگار کریمی", role: "مدیر فروشگاه لوازم خانگی", quote: "فاکتور شمسی و درگاه بانکی همان روز اول کار کرد. قبلش دو هفته با افزونه‌ها کلنجار می‌رفتم.", rating: 5 },
        { name: "علی رضایی", role: "توسعه‌دهنده‌ی فرانت‌اند", quote: "برای مشتری‌هایم استفاده می‌کنم؛ راست‌چین بودن را یک بار برای همیشه حل کرده.", rating: 5 },
        { name: "مینا صادقی", role: "طراح محصول", quote: "کامپوننت‌ها همان چیزی‌اند که در فیگما می‌کشم، بدون این‌که برای فارسی دست‌کاری کنم.", rating: 4 },
      ]}
    />
  ),
  "auth-card": <div className="flex justify-center px-6 py-12"><AuthCard /></div>,
  cta: <CtaBlock title="همین امروز شروع کنید" description="بدون کارت بانکی، در کمتر از ده دقیقه. هر وقت خواستید لغو کنید." action="ساخت حساب رایگان" note="بیش از ۲ هزار فروشگاه با دکان کار می‌کنند" />,
  banner: (
    <>
      <AnnouncementBanner message="تا پایان مهر، پلن حرفه‌ای ۳۰٪ تخفیف داره." action={{ label: "دیدن پلن‌ها", href: "#" }} />
      {ghostPage}
    </>
  ),
  navbar: (
    <>
    <Navbar
      sticky={false}
      logo={<><span className="inline-block size-6 rounded-md bg-foreground" />دکان</>}
      links={[{ label: "ویژگی‌ها", href: "#" }, { label: "قیمت", href: "#", active: true }, { label: "مشتری‌ها", href: "#" }, { label: "وبلاگ", href: "#" }]}
    />
    {ghostPage}
    </>
  ),
  "logo-cloud": <LogoCloud logos={[{ name: "دیجی‌کالا" }, { name: "اسنپ" }, { name: "تپسی" }, { name: "کافه‌بازار" }, { name: "علی‌بابا" }, { name: "دیوار" }]} />,
  "feature-split": (
    <FeatureSplit
      items={[
        { eyebrow: "فاکتور", title: "فاکتور شمسی، بدون افزونه", description: "هر سفارش خودش فاکتور رسمی با تاریخ شمسی و مالیات می‌سازد و برای مشتری پیامک می‌کند.", bullets: ["مالیات بر ارزش افزوده", "چاپ A5 و A4", "ارسال خودکار پیامک"] },
        { eyebrow: "ارسال", title: "پست و پیک با یک کلیک", description: "آدرس مشتری را می‌گیرد، هزینه‌ی ارسال را حساب می‌کند و بارنامه را آماده تحویل می‌دهد.", bullets: ["پست پیشتاز و تیپاکس", "پیک درون‌شهری", "رهگیری برای مشتری"] },
      ]}
    />
  ),
  bento: (
    <BentoGrid
      eyebrow="یک پنل"
      title="همه‌چیز همین‌جا"
      cells={[
        { icon: BarChart3, title: "گزارش فروش", description: "روند فروش هفتگی و ماهانه، با مقایسه‌ی دوره‌ی قبل.", span: 4, visual: <div className="flex h-24 w-full items-end gap-1.5">{[5, 8, 6, 9, 7, 11, 9, 12, 10, 14, 13, 16].map((v, i) => <span key={i} className="flex-1 rounded-t-sm bg-foreground/20" style={{ height: `${v * 6}%` }} />)}</div> },
        { icon: Shield, title: "درگاه بانکی", description: "زرین‌پال، سامان و ملت، بدون قرارداد جدا.", span: 2, visual: <span className="text-4xl font-black tabular-nums">۹۹٫۹٪</span> },
        { icon: Sparkles, title: "هوش مصنوعی", description: "توضیح محصول را از روی عکس می‌نویسد.", span: 2 },
        { icon: Zap, title: "سرعت", description: "صفحه‌ها زیر یک ثانیه باز می‌شوند.", span: 2, visual: <span className="text-4xl font-black tabular-nums">۰٫۸ ثانیه</span> },
        { icon: Globe, title: "دامنه‌ی اختصاصی", description: "دامنه‌تان را وصل کنید، SSL خودکار است.", span: 2 },
      ]}
    />
  ),
  steps: (
    <StepsBlock
      eyebrow="چطور کار می‌کند"
      title="در سه قدم بفروشید"
      steps={[
        { title: "ثبت‌نام کنید", description: "با شماره‌ی موبایل و بدون کارت بانکی، زیر یک دقیقه." },
        { title: "محصول بگذارید", description: "عکس و قیمت را بدهید، توضیح را هوش مصنوعی می‌نویسد." },
        { title: "بفروشید", description: "درگاه و پست از روز اول وصل است، فقط لینک را بفرستید." },
      ]}
    />
  ),
  team: (
    <TeamBlock
      description="آدم‌هایی که دکان را می‌سازند."
      members={[
        { name: "سارا محمدی", role: "هم‌بنیان‌گذار و مدیرعامل", links: [{ label: "لینکدین", href: "#" }] },
        { name: "علی رضایی", role: "مدیر فنی", links: [{ label: "گیت‌هاب", href: "#" }] },
        { name: "نگار کریمی", role: "طراح محصول", links: [{ label: "دریبل", href: "#" }] },
        { name: "رضا احمدی", role: "مدیر رشد", links: [{ label: "توییتر", href: "#" }] },
      ]}
    />
  ),
  contact: <ContactBlock info={{ address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲۰", phone: "021-88000000", hours: "شنبه تا چهارشنبه، ۹ تا ۱۸" }} onSubmit={() => new Promise((r) => setTimeout(r, 800))} />,
  newsletter: <NewsletterBlock channel="sms" title="خبر انتشار را پیامک کنیم؟" description="فقط یک پیامک، همان روزی که نسخه‌ی جدید منتشر می‌شود." />,
  "product-grid": (
    <ProductGrid
      title="پرفروش‌ها"
      products={[
        { id: "1", name: "هدفون بی‌سیم با حذف نویز", price: 2_450_000, original: 2_900_000, rating: 4.5, reviews: 128, badge: "پرفروش" },
        { id: "2", name: "ساعت هوشمند سری ۵", price: 5_800_000, rating: 4, reviews: 64 },
        { id: "3", name: "کیبورد مکانیکی کم‌صدا", price: 1_950_000, original: 2_300_000, rating: 5, reviews: 41, badge: "تخفیف" },
        { id: "4", name: "پایه‌ی لپ‌تاپ آلومینیومی", price: 640_000, rating: 4.5, reviews: 210, outOfStock: true },
      ]}
    />
  ),
  "blog-grid": (
    <BlogGrid
      posts={[
        { href: "#", title: "راست‌چین کردن Next.js، یک بار برای همیشه", excerpt: "از dir روی html تا کلاس‌های منطقی تیل‌ویند، همه‌ی چیزهایی که برای یک سایت فارسی درست لازم است.", category: "آموزش", date: new Date(2026, 8, 15), readingTime: 6, author: { name: "علی رضایی" } },
        { href: "#", title: "چرا فونت فارسی باید ۱۶ پیکسل باشد", excerpt: "سافاری موبایل روی فیلدهای کوچک‌تر زوم می‌کند و خواندن فارسی زیر ۱۴ پیکسل سخت است.", category: "طراحی", date: new Date(2026, 8, 9), readingTime: 4, author: { name: "نگار کریمی" } },
        { href: "#", title: "تقویم شمسی بدون کتابخانه", excerpt: "الگوریتم تبدیل تاریخ در ۶۰ خط، با تست سال‌های کبیسه.", category: "کد", date: new Date(2026, 8, 2), readingTime: 8, author: { name: "سارا محمدی" } },
      ]}
    />
  ),
  comparison: (
    <ComparisonTable
      plans={[{ name: "شروع", price: "رایگان" }, { name: "حرفه‌ای", price: "۲۹۰ هزار تومان / ماه", highlighted: true }, { name: "سازمانی", price: "۹۹۰ هزار تومان / ماه" }]}
      rows={[
        { feature: "تعداد محصول", values: ["۱۰", "نامحدود", "نامحدود"] },
        { feature: "دامنه‌ی اختصاصی", values: [false, true, true] },
        { feature: "گزارش فروش", values: [false, true, true] },
        { feature: "چند فروشگاه", values: [false, false, true] },
        { feature: "پشتیبانی", values: ["تلگرام", "تلفنی", "مدیر حساب"] },
      ]}
    />
  ),
  "dashboard-stats": (
    <div className="p-6">
      <DashboardStats
        items={[
          { label: "فروش امروز", value: "۱۲٬۴۵۰٬۰۰۰", unit: "تومان", delta: 12.5, trend: [4, 6, 5, 8, 7, 9, 8, 11, 10, 12] },
          { label: "سفارش‌ها", value: "۸۴", delta: -3.2, trend: [9, 8, 8, 7, 9, 8, 7, 8, 7, 7] },
          { label: "مشتری جدید", value: "۲۳", delta: 8, trend: [2, 3, 2, 4, 3, 5, 4, 5, 6, 6] },
          { label: "میانگین سبد", value: "۴۸۰٬۰۰۰", unit: "تومان", delta: 1.4, trend: [5, 5, 6, 5, 6, 6, 5, 6, 6, 6] },
        ]}
      />
    </div>
  ),
  "signup-card": <div className="flex justify-center px-6 py-12"><SignupCard onSubmit={() => new Promise((r) => setTimeout(r, 800))} /></div>,
  footer: (
    <FooterBlock
      logo="دکان"
      description="فروشگاه‌ساز فارسی برای کسب‌وکارهای کوچک؛ درگاه، پست و فاکتور شمسی از روز اول."
      columns={[
        { title: "محصول", links: [{ label: "ویژگی‌ها", href: "#" }, { label: "قیمت", href: "#" }, { label: "تغییرات", href: "#" }] },
        { title: "شرکت", links: [{ label: "درباره‌ی ما", href: "#" }, { label: "وبلاگ", href: "#" }, { label: "فرصت‌های شغلی", href: "#" }] },
        { title: "پشتیبانی", links: [{ label: "مرکز راهنما", href: "#" }, { label: "تماس با ما", href: "#" }, { label: "وضعیت سرویس", href: "#" }] },
      ]}
      seals={<><span className="flex size-14 items-center justify-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">نماد</span><span className="flex size-14 items-center justify-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">ساماندهی</span></>}
    />
  ),
  ...extraBlockDemos,
};

export function BlockDemo({ slug }: { slug: string }) {
  return blockDemos[slug] ?? null;
}
