import type { BlockDoc } from "./types";

const bl = (slug: string) => `registry/blocks/${slug}.tsx`;

export const blocks: BlockDoc[] = [
  {
    slug: "hero", name: "هیرو", file: bl("hero"), tags: ["لندینگ", "شروع"], deps: ["lucide-react"], registryDeps: ["button", "badge", "avatar"],
    desc: "تیتر بزرگ وسط‌چین با دو دکمه و یک خط اثبات اجتماعی، روی شبکه‌ی محو.",
    usage: `import { HeroBlock } from "@/components/blocks/hero"

<HeroBlock
  badge="نسخه‌ی ۲ منتشر شد"
  title={<>فروشگاه‌تان را امروز باز کنید، <span className="text-brand">نه ماه بعد</span></>}
  description="درگاه بانکی، پست، فاکتور شمسی و هوش مصنوعی فارسی، همه از روز اول آماده."
  primary={{ label: "ساخت فروشگاه رایگان" }}
  proof={{ people: [{ name: "سارا" }, { name: "علی" }, { name: "نگار" }], text: "بیش از ۲ هزار فروشگاه" }}
/>`,
    props: [{ name: "title", type: "ReactNode", desc: "تیتر. می‌تونید یک کلمه را با text-brand برجسته کنید." }, { name: "proof", type: "{ people; text }", desc: "آواتارها و متن اثبات اجتماعی." }],
    promptBullets: ["Headline 48–60px with line-height 1.2, description at most ~65 characters per line, two rounded buttons.", "Grid background with a radial mask from the top; no large image needed."],
  },
  {
    slug: "features", name: "ویژگی‌ها", file: bl("features"), tags: ["لندینگ"], registryDeps: [],
    desc: "شبکه‌ی سه یا چهارتایی از ویژگی‌ها با کاشی آیکون و جداکننده‌ی یک‌پیکسلی.",
    usage: `import { FeaturesBlock } from "@/components/blocks/features"

<FeaturesBlock eyebrow="چرا دکان" title="همه‌چیز برای فروش آنلاین" features={[{ icon: Zap, title: "سریع", description: "…" }]} />`,
    props: [{ name: "columns", type: "3 | 4", default: "3", desc: "تعداد ستون در دسکتاپ." }],
    promptBullets: ["Divider trick: grid with gap-px and bg-border, each cell bg-card; no double borders.", "Icon in a 40px tile; description with line-height 1.8."],
  },
  {
    slug: "pricing", name: "ردیف قیمت", file: bl("pricing"), tags: ["قیمت", "تبدیل"], deps: ["lucide-react"], registryDeps: ["button", "badge", "price", "tabs"],
    desc: "سه پلن با قیمت تومانی، تب ماهانه/سالانه با دو ماه رایگان و پلن پیشنهادی برجسته.",
    usage: `import { PricingBlock } from "@/components/blocks/pricing"

<PricingBlock plans={[
  { name: "شروع", monthly: 0, description: "برای امتحان", features: ["۱۰ محصول"] },
  { name: "حرفه‌ای", monthly: 290_000, description: "برای رشد", features: ["نامحدود", "دامنه"], highlighted: true },
]} />`,
    promptBullets: ["Yearly price = monthly × 10 (two months free) and unit «تومان / سال».", "Highlighted plan with a stronger border and a «پیشنهادی» badge; its button is default, the others outline."],
  },
  {
    slug: "faq", name: "پرسش‌های متداول", file: bl("faq"), tags: ["لندینگ", "پشتیبانی"], registryDeps: ["accordion"],
    desc: "پرسش‌های متداول با معرفی در ستون راست و آکاردئون در ستون چپ، که اولین پرسش بازه.",
    usage: `import { FaqBlock } from "@/components/blocks/faq"

<FaqBlock items={[{ id: "1", title: "رایگان است؟", content: "بله…" }]} />`,
    promptBullets: ["Two columns 2/5 and 3/5 on desktop; stacked on mobile.", "Accordion with the chevron on the left and a grid-rows height animation."],
  },
  {
    slug: "stats", name: "آمار", file: bl("stats"), tags: ["اثبات"], registryDeps: [],
    desc: "نوار چهار عدد کلیدی با جداکننده‌ی نازک. اعداد را از قبل فارسی بدید.",
    usage: `import { StatsBlock } from "@/components/blocks/stats"

<StatsBlock items={[{ value: "۲٬۴۰۰+", label: "فروشگاه فعال" }, { value: "۹۹٫۹٪", label: "دسترس‌پذیری" }]} />`,
    promptBullets: ["Figures use tabular-nums and Persian digits; label under the number, optional small caption.", "Only real numbers you have; do not invent stats."],
  },
  {
    slug: "testimonials", name: "نظر مشتریان", file: bl("testimonials"), tags: ["اثبات"], registryDeps: ["avatar", "rating"],
    desc: "سه ستون کارت نقل‌قول با «گیومه»، ستاره و آواتار.",
    usage: `import { TestimonialsBlock } from "@/components/blocks/testimonials"

<TestimonialsBlock items={[{ name: "نگار کریمی", role: "مدیر فروشگاه", quote: "…", rating: 5 }]} />`,
    promptBullets: ["Quotes inside Persian guillemets «»; semantic figure/blockquote/figcaption.", "Stars are read-only and small, above the quote."],
  },
  {
    slug: "auth-card", name: "کارت ورود", file: bl("auth-card"), tags: ["فرم", "کد تأیید"], registryDeps: ["phone-input", "otp-field", "button"],
    desc: "کارت ورود با موبایل و کد تأیید که مستقله و روی هر پس‌زمینه‌ای می‌نشینه.",
    usage: `import { AuthCard } from "@/components/blocks/auth-card"

<div className="flex min-h-dvh items-center justify-center"><AuthCard onVerified={(phone) => login(phone)} /></div>`,
    promptBullets: ["«دریافت کد» stays disabled until the phone number is valid; 90-second resend countdown.", "Card max 384px, soft shadow, no image."],
  },
  {
    slug: "cta", name: "فراخوان پایانی", file: bl("cta"), tags: ["تبدیل"], deps: ["lucide-react"], registryDeps: ["button"],
    desc: "بنر گرم با یک دکمه که درخشش‌اش از توکن برند می‌آد.",
    usage: `import { CtaBlock } from "@/components/blocks/cta"

<CtaBlock title="همین امروز شروع کنید" description="بدون کارت بانکی، در کمتر از ده دقیقه." action="ساخت حساب رایگان" note="بدون تعهد، هر وقت خواستید لغو کنید" />`,
    promptBullets: ["radial-gradient of brand color at the top of the banner at ~20% opacity; one large rounded button.", "Short copy: headline, one sentence, one button, one trust note."],
  },
  {
    slug: "banner", name: "نوار اعلان", file: bl("banner"), tags: ["لندینگ", "اعلان"], deps: ["lucide-react"], registryDeps: [],
    desc: "نوار یک‌خطی بالای هدر برای خبر یا تخفیف، با یک لینک و دکمه‌ی بستن که یادش می‌مونه.",
    usage: `import { AnnouncementBanner } from "@/components/blocks/banner"

<AnnouncementBanner message="تا پایان مهر، پلن حرفه‌ای ۳۰٪ تخفیف داره." action={{ label: "دیدن پلن‌ها", href: "/pricing" }} storageKey="mehr-sale" />`,
    props: [{ name: "storageKey", type: "string", desc: "اگر بدید، بستن نوار در localStorage ذخیره میشه و دفعه‌ی بعد نشون داده نمیشه." }, { name: "tone", type: '"brand" | "neutral"', default: '"brand"', desc: "رنگ برند یا معکوس متن." }],
    promptBullets: ["One line, centered, brand background; the link has an arrow pointing left (forward in RTL).", "Dismiss button at the inline end; optional localStorage memory."],
  },
  {
    slug: "navbar", name: "نوار بالا", file: bl("navbar"), tags: ["لندینگ", "ناوبری"], deps: ["lucide-react"], registryDeps: ["button", "sheet"],
    desc: "هدر چسبان با لوگو در راست، لینک‌ها در وسط و دو دکمه در چپ، که در موبایل به یک کشو از سمت راست تبدیل میشه.",
    usage: `import { Navbar } from "@/components/blocks/navbar"

<Navbar
  logo="دکان"
  links={[{ label: "ویژگی‌ها", href: "#features" }, { label: "قیمت", href: "#pricing", active: true }, { label: "وبلاگ", href: "/blog" }]}
  primary={{ label: "شروع رایگان" }}
  secondary={{ label: "ورود" }}
/>`,
    props: [{ name: "links", type: "NavLink[]", desc: "لینک فعال با aria-current علامت می‌خوره." }, { name: "sticky", type: "boolean", default: "true", desc: "چسبیدن به بالای صفحه با پس‌زمینه‌ی مات." }],
    promptBullets: ["Sticky header with backdrop-blur; logo first in reading order (right), actions last (left).", "Below md the links move into a Sheet from the right; the trigger is an icon button labelled «باز کردن منو»."],
  },
  {
    slug: "logo-cloud", name: "لوگوی مشتریان", file: bl("logo-cloud"), tags: ["لندینگ", "اثبات"], registryDeps: [],
    desc: "یک ردیف آرام از اسم یا لوگوی مشتری‌ها زیر هیرو، کم‌رنگ و با هاور پررنگ.",
    usage: `import { LogoCloud } from "@/components/blocks/logo-cloud"

<LogoCloud logos={[{ name: "دیجی‌کالا" }, { name: "اسنپ" }, { name: "تپسی" }, { name: "کافه‌بازار" }]} />`,
    props: [{ name: "logos", type: "{ name; node? }[]", desc: "اگر node ندید، اسم با فونت سیاه رندر میشه." }],
    promptBullets: ["Muted wordmarks at 60% opacity that turn full on hover; wrap on mobile with generous gaps.", "No carousel; a static row reads calmer."],
  },
  {
    slug: "feature-split", name: "ویژگی دو ستونه", file: bl("feature-split"), tags: ["لندینگ"], deps: ["lucide-react"], registryDeps: [],
    desc: "ردیف‌های متن و عکس که جای‌شون یکی‌درمیان عوض میشه، با تیتر کوچک، توضیح و چند تیک.",
    usage: `import { FeatureSplit } from "@/components/blocks/feature-split"

<FeatureSplit items={[
  { eyebrow: "فاکتور", title: "فاکتور شمسی، بدون افزونه", description: "…", bullets: ["مالیات بر ارزش افزوده", "چاپ A5"] },
  { eyebrow: "ارسال", title: "پست و پیک با یک کلیک", description: "…" },
]} />`,
    props: [{ name: "media", type: "ReactNode", desc: "عکس یا ویدئوی هر ردیف؛ نباشه، جاگیر گرادیانی کشیده میشه." }],
    promptBullets: ["Two equal columns; odd rows swap order with CSS order, not by reordering the DOM.", "Media box is 4:3 with a hairline border; bullets use a brand check."],
  },
  {
    slug: "bento", name: "شبکه‌ی بنتو", file: bl("bento"), tags: ["لندینگ", "بنتو"], registryDeps: [],
    desc: "شبکه‌ی شش‌ستونی از کارت‌های نابرابر که هر کدام یک تصویر بالا و یک تیتر و یک خط پایین دارن.",
    usage: `import { BentoGrid } from "@/components/blocks/bento"

<BentoGrid title="همه‌چیز در یک پنل" cells={[
  { title: "گزارش فروش", description: "…", span: 4, visual: <Chart /> },
  { title: "درگاه بانکی", description: "…", span: 2 },
]} />`,
    props: [{ name: "span", type: "2 | 3 | 4", default: "2", desc: "تعداد ستون از شش ستون در دسکتاپ." }, { name: "visual", type: "ReactNode", desc: "هر چیز تصویری برای بالای کارت." }],
    promptBullets: ["Six-column grid; mix 4+2, 3+3 and 2+2+2 rows; every card has the same border and radius.", "Visual area is fixed-height and clips its content at the bottom edge."],
  },
  {
    slug: "steps", name: "مراحل کار", file: bl("steps"), tags: ["لندینگ"], registryDeps: [],
    desc: "سه قدم شماره‌دار با اعداد فارسی که در دسکتاپ با یک خط نقطه‌چین به هم وصل میشن.",
    usage: `import { StepsBlock } from "@/components/blocks/steps"

<StepsBlock eyebrow="چطور کار می‌کند" title="در سه قدم بفروشید" steps={[
  { title: "ثبت‌نام", description: "با شماره‌ی موبایل، بدون کارت بانکی." },
  { title: "محصول بگذارید", description: "عکس و قیمت، بقیه با ما." },
  { title: "بفروشید", description: "درگاه و پست از روز اول وصله." },
]} />`,
    props: [{ name: "icon", type: "Component", desc: "به‌جای شماره، آیکون نشون میده." }],
    promptBullets: ["Numbers are Persian digits inside a 48px circle with tabular-nums; a dashed line sits behind the circles on md+.", "Center-aligned text, at most ~40 words per step."],
  },
  {
    slug: "team", name: "تیم", file: bl("team"), tags: ["درباره‌ی ما"], registryDeps: ["avatar"],
    desc: "کارت اعضای تیم با آواتار، نقش، یک خط معرفی و لینک‌های کوتاه.",
    usage: `import { TeamBlock } from "@/components/blocks/team"

<TeamBlock members={[{ name: "سارا محمدی", role: "هم‌بنیان‌گذار", links: [{ label: "لینکدین", href: "#" }] }]} />`,
    promptBullets: ["Four-up on desktop, two-up on mobile; Avatar falls back to the initial when there is no photo.", "Role in muted small text; links as plain underlined words, not icons."],
  },
  {
    slug: "contact", name: "تماس با ما", file: bl("contact"), tags: ["فرم", "پشتیبانی"], deps: ["lucide-react"], registryDeps: ["input", "textarea", "button"],
    desc: "فرم نام، موبایل و پیام در راست و کارت آدرس با ساعت کاری و جای نقشه در چپ.",
    usage: `import { ContactBlock } from "@/components/blocks/contact"

<ContactBlock
  info={{ address: "تهران، خیابان ولیعصر، پلاک ۱۲۰", phone: "021-88000000", hours: "شنبه تا چهارشنبه، ۹ تا ۱۸" }}
  onSubmit={async (v) => { await fetch("/api/contact", { method: "POST", body: JSON.stringify(v) }) }}
/>`,
    props: [{ name: "map", type: "ReactNode", desc: "iframe نقشه یا عکس؛ نباشه، جاگیر شطرنجی کشیده میشه." }, { name: "onSubmit", type: "(values) => Promise", desc: "بعد از resolve، پیام «ثبت شد» نمایش داده میشه." }],
    promptBullets: ["3/5 form, 2/5 info card; phone field is ltr with a numeric keyboard; message textarea 5 rows.", "Address list uses dl with sr-only dt and icons; phone number rendered ltr with tabular-nums."],
  },
  {
    slug: "newsletter", name: "خبرنامه", file: bl("newsletter"), tags: ["تبدیل", "فرم"], registryDeps: ["input", "button"],
    desc: "یک فیلد و یک دکمه در یک کارت نرم، برای ایمیل یا شماره‌ی موبایل، با پیام موفقیت.",
    usage: `import { NewsletterBlock } from "@/components/blocks/newsletter"

<NewsletterBlock channel="sms" title="خبر انتشار را پیامک کنیم؟" onSubscribe={(phone) => subscribe(phone)} />`,
    props: [{ name: "channel", type: '"email" | "sms"', default: '"email"', desc: "نوع فیلد، کیبورد موبایل و placeholder را عوض می‌کنه." }],
    promptBullets: ["Field and button side by side on sm+, stacked on mobile; the field is ltr for both email and phone.", "A one-line opt-out reassurance under the form."],
  },
  {
    slug: "product-grid", name: "شبکه‌ی محصول", file: bl("product-grid"), tags: ["فروشگاه", "قیمت"], deps: ["lucide-react"], registryDeps: ["price", "rating", "badge", "button"],
    desc: "کارت‌های محصول چهارتایی با قیمت تومانی، درصد تخفیف، امتیاز و دکمه‌ی افزودن به سبد.",
    usage: `import { ProductGrid } from "@/components/blocks/product-grid"

<ProductGrid title="پرفروش‌ها" products={[
  { id: "1", name: "هدفون بی‌سیم", price: 2_450_000, original: 2_900_000, rating: 4.5, reviews: 128, badge: "پرفروش" },
]} onAdd={(p) => addToCart(p)} />`,
    props: [{ name: "original", type: "number", desc: "قیمت قبل از تخفیف؛ درصدش خودکار حساب میشه." }, { name: "outOfStock", type: "boolean", desc: "کارت را کم‌رنگ می‌کنه و دکمه را غیرفعال." }],
    promptBullets: ["Square image area with the badge at the inline-end corner; name clamps to two lines.", "Price at the bottom start, add-to-cart icon button at the bottom end; «ناموجود» overlay when out of stock."],
  },
  {
    slug: "blog-grid", name: "مقالات", file: bl("blog-grid"), tags: ["محتوا", "شمسی"], registryDeps: ["badge", "avatar", "jalali"],
    desc: "سه کارت مقاله با دسته، تاریخ شمسی، زمان مطالعه و نویسنده.",
    usage: `import { BlogGrid } from "@/components/blocks/blog-grid"

<BlogGrid posts={[{ href: "/blog/rtl", title: "راست‌چین کردن Next.js", excerpt: "…", category: "آموزش", date: new Date(), readingTime: 6, author: { name: "علی رضایی" } }]} />`,
    props: [{ name: "date", type: "Date", desc: "با formatJalali به «۲۵ شهریور ۱۴۰۵» تبدیل میشه." }, { name: "readingTime", type: "number", desc: "دقیقه؛ با اعداد فارسی نشون داده میشه." }],
    promptBullets: ["16:10 cover with a slow zoom on hover; category as a brand badge; excerpt clamps to two lines.", "Footer row: author avatar and name, then a time element with a Jalali date."],
  },
  {
    slug: "comparison", name: "جدول مقایسه", file: bl("comparison"), tags: ["قیمت", "جدول"], deps: ["lucide-react"], registryDeps: ["badge", "button"],
    desc: "امکانات در ستون راست و پلن‌ها در بالا، با تیک و خط تیره در خانه‌ها و پلن پیشنهادی هایلایت.",
    usage: `import { ComparisonTable } from "@/components/blocks/comparison"

<ComparisonTable
  plans={[{ name: "شروع", price: "رایگان" }, { name: "حرفه‌ای", price: "۲۹۰ هزار تومان / ماه", highlighted: true }]}
  rows={[{ feature: "تعداد محصول", values: ["۱۰", "نامحدود"] }, { feature: "دامنه‌ی اختصاصی", values: [false, true] }]}
/>`,
    props: [{ name: "values", type: "(boolean | string)[]", desc: "true تیک سبز، false خط تیره، رشته همون‌طور که هست." }],
    promptBullets: ["Real table with th scope=row/col; feature column is the first (right) column.", "Highlighted plan's whole column gets a secondary tint; footer row holds the buttons; horizontal scroll under 640px."],
  },
  {
    slug: "dashboard-stats", name: "کارت‌های آمار", file: bl("dashboard-stats"), tags: ["داشبورد", "آمار"], registryDeps: ["stat"],
    desc: "چهار کارت شاخص برای بالای داشبورد، با درصد تغییر و یک روند میله‌ای کوچک.",
    usage: `import { DashboardStats } from "@/components/blocks/dashboard-stats"

<DashboardStats items={[
  { label: "فروش امروز", value: "۱۲٬۴۵۰٬۰۰۰", unit: "تومان", delta: 12.5, trend: [4, 6, 5, 8, 7, 9, 11] },
  { label: "سفارش‌ها", value: "۸۴", delta: -3.2, trend: [9, 8, 8, 7, 9, 8, 7] },
]} />`,
    props: [{ name: "trend", type: "number[]", desc: "چند عدد برای میله‌های کوچک؛ آخرین میله رنگ برند می‌گیره." }],
    promptBullets: ["Four equal cards; Stat component for the number and delta; bars are aria-hidden and relative to the max.", "Numbers are pre-formatted Persian strings with «٬» thousands separator."],
  },
  {
    slug: "signup-card", name: "کارت ثبت‌نام", file: bl("signup-card"), tags: ["فرم", "ایمیل"], registryDeps: ["input", "password-input", "checkbox-group", "button"],
    desc: "ثبت‌نام با نام، ایمیل و رمز عبور با سنجش قدرت، تیک قوانین و لینک ورود.",
    usage: `import { SignupCard } from "@/components/blocks/signup-card"

<div className="flex min-h-dvh items-center justify-center"><SignupCard onSubmit={(v) => register(v)} /></div>`,
    props: [{ name: "onSubmit", type: "(values) => Promise", desc: "تا resolve بشه دکمه «در حال ساخت…» می‌مونه." }],
    promptBullets: ["Email and password fields are ltr; PasswordInput with the strength meter and minLength 8.", "Submit stays disabled until the terms checkbox is checked; sign-in link at the bottom."],
  },
  {
    slug: "footer", name: "پابرگ", file: bl("footer"), tags: ["لندینگ", "ناوبری"], registryDeps: ["jalali"],
    desc: "پابرگ با ستون برند در راست، چند ستون لینک و خط کپی‌رایت با سال شمسی.",
    usage: `import { FooterBlock } from "@/components/blocks/footer"

<FooterBlock
  logo="دکان"
  description="فروشگاه‌ساز فارسی برای کسب‌وکارهای کوچک."
  columns={[{ title: "محصول", links: [{ label: "قیمت", href: "/pricing" }] }, { title: "شرکت", links: [{ label: "درباره‌ی ما", href: "/about" }] }]}
  seals={<img src="/enamad.png" alt="نماد اعتماد الکترونیکی" width={64} height={64} />}
/>`,
    props: [{ name: "seals", type: "ReactNode", desc: "جای نماد اعتماد، ساماندهی یا آیکون شبکه‌های اجتماعی." }, { name: "copyright", type: "string", desc: "پیش‌فرض «© ۱۴۰۵ تمام حقوق محفوظ است.» با سال شمسی جاری." }],
    promptBullets: ["Five-column grid on lg: brand blurb spans two, then link columns; two columns on mobile.", "Bottom bar with a Jalali year from toJalali(new Date()); each column is a nav with aria-label."],
  },
  {
    slug: "hero-split", name: "هیروی دوستونه", file: bl("hero-split"), tags: ["لندینگ", "شروع"], deps: ["lucide-react"], registryDeps: ["button", "badge"],
    desc: "هیرویی که متن سمت راسته و عکس محصول سمت چپ، با چند نکته‌ی تیک‌دار و یک پنجره‌ی نمونه که تا وقتی اسکرین‌شات ندارید جای خالی را پر می‌کنه.",
    usage: `import { HeroSplit } from "@/components/blocks/hero-split"

<HeroSplit
  badge="تازه"
  title={<>حسابداری فروشگاه، <span className="text-brand">بدون حسابدار</span></>}
  description="فاکتور، انبار و گزارش فصلی را خودش جمع می‌کند."
  bullets={["فاکتور رسمی شمسی", "اتصال به سامانه‌ی مودیان"]}
  visual={<img src="/app.webp" alt="نمای داشبورد" className="rounded-2xl border border-border" />}
/>`,
    props: [{ name: "bullets", type: "string[]", desc: "چند نکته‌ی کوتاه زیر توضیح که با تیک نشون داده میشن." }, { name: "visual", type: "ReactNode", desc: "اسکرین‌شات یا ویدئو. اگه ندید، یک پنجره‌ی نمونه با توکن‌های تم کشیده میشه." }],
    promptBullets: ["Two columns on lg: copy first in source order (right in RTL), product visual second; stacked on mobile with the copy on top.", "Left-aligned-to-start headline 36–48px, checked bullets, primary button with ArrowLeft; a soft brand glow behind the visual."],
  },
  {
    slug: "hero-app", name: "هیروی اپلیکیشن", file: bl("hero-app"), tags: ["لندینگ", "اپلیکیشن"], deps: ["lucide-react"], registryDeps: ["rating"],
    desc: "هیروی معرفی اپلیکیشن با دکمه‌های کافه‌بازار، مایکت و سیب‌اپ، امتیاز کاربرها و یک قاب گوشی که از پایین صفحه بیرون می‌آد.",
    usage: `import { HeroApp } from "@/components/blocks/hero-app"

<HeroApp
  title="خرج‌هایتان را در جیب‌تان نگه دارید"
  description="دخل و خرج ماهانه، قسط‌ها و یادآور قبض، همه در یک اپ فارسی."
  stores={[
    { store: "کافه‌بازار", href: "https://cafebazaar.ir/app/…" },
    { store: "مایکت", href: "https://myket.ir/app/…" },
    { store: "سیب‌اپ", caption: "نسخه‌ی آیفون در", href: "https://sibapp.com/…" },
  ]}
  rating={{ value: 4.7, count: "۲۰۰ هزار" }}
/>`,
    props: [{ name: "stores", type: "{ store; href; caption?; icon? }[]", desc: "دکمه‌های دریافت. اولی پررنگ نشون داده میشه و لوگوی هر فروشگاه را خودتون در icon می‌گذارید." }, { name: "screen", type: "ReactNode", desc: "محتوای صفحه‌ی گوشی. بدون اون یک فید نمونه کشیده میشه." }],
    notes: ["لوگوی فروشگاه‌ها علامت تجاری هستن و داخل بلاک نیومدن. فایل رسمی هر فروشگاه را از صفحه‌ی برندش بگیرید و در icon بگذارید."],
    promptBullets: ["Store buttons 56px tall with a small caption line above the store name; the first one is filled, the rest outlined.", "Phone frame drawn with borders and a pill notch, bottom-clipped by the section so it rises from the edge; rating row under the buttons."],
  },
  {
    slug: "hero-search", name: "هیروی جست‌وجو", file: bl("hero-search"), tags: ["لندینگ", "جست‌وجو"], deps: ["lucide-react"], registryDeps: ["button"],
    desc: "هیرویی برای سایت آگهی، املاک یا نوبت‌دهی که کار اصلی‌اش جست‌وجوئه، با یک فیلد بزرگ، چیپ پرجست‌وجوها و چند عدد کوتاه زیرش.",
    usage: `import { HeroSearch } from "@/components/blocks/hero-search"

<HeroSearch
  title="پزشک‌تان را پیدا کنید"
  placeholder="نام پزشک، تخصص یا بیمارستان"
  popular={["دندانپزشک", "پوست و مو", "چشم‌پزشک"]}
  facts={["۱۲ هزار پزشک", "نوبت همان روز"]}
  onSearch={(q) => router.push("/search?q=" + encodeURIComponent(q))}
/>`,
    props: [{ name: "popular", type: "string[]", desc: "جست‌وجوهای پرتکرار. با کلیک روی هر کدام فیلد پر میشه و onSearch صدا زده میشه." }, { name: "onSearch", type: "(query) => void", desc: "متن جست‌وجو بعد از حذف فاصله‌های اضافه." }],
    promptBullets: ["A real form with role=search, a visually hidden label and a 56px pill field holding the icon, input and submit button.", "Popular chips fill the field and submit; a row of short facts with brand dots under them."],
  },
  {
    slug: "footer-minimal", name: "پابرگ ساده", file: bl("footer-minimal"), tags: ["پابرگ"], registryDeps: ["jalali"],
    desc: "پابرگ یک‌ردیفه با لوگو، چند لینک و جای آیکون شبکه‌ها که سال شمسی کپی‌رایت را خودش حساب می‌کنه.",
    usage: `import { FooterMinimal } from "@/components/blocks/footer-minimal"

<FooterMinimal logo="دکان" links={[{ label: "قوانین", href: "/terms" }, { label: "تماس", href: "/contact" }]} />`,
    props: [{ name: "end", type: "ReactNode", desc: "جای آیکون شبکه‌های اجتماعی یا نماد اعتماد در انتهای ردیف." }],
    promptBullets: ["One row on md: logo with copyright, centered link list, end slot; stacked and centered on mobile.", "Copyright year from toJalali(new Date()) in Persian digits."],
  },
  {
    slug: "footer-mega", name: "پابرگ کامل", file: bl("footer-mega"), tags: ["پابرگ", "فروشگاه", "نماد اعتماد"], deps: ["lucide-react"], registryDeps: ["button", "jalali"],
    desc: "پابرگ فروشگاهی با خبرنامه، ستون‌های لینک، تلفن و نشانی، نماد اعتماد، دکمه‌ی اپلیکیشن و خط قوانین.",
    usage: `import { FooterMega } from "@/components/blocks/footer-mega"
import { TrustBadges } from "@/components/blocks/trust-badges"
import { SocialLinks } from "@/components/blocks/social-links"

<FooterMega
  logo="دکان"
  columns={[{ title: "خرید", links: [{ label: "رویه‌ی ارسال", href: "/shipping" }] }]}
  contact={{ phone: "021-91000000", hours: "هر روز ۸ تا ۲۲", address: "تهران، خیابان ولیعصر" }}
  newsletter={{ title: "از تخفیف‌ها باخبر شوید" }}
  seals={<TrustBadges seals={[{ name: "نماد اعتماد الکترونیکی" }]} />}
  social={<SocialLinks links={[{ network: "telegram", href: "https://t.me/dokan" }]} />}
/>`,
    props: [{ name: "newsletter", type: "{ title; description?; placeholder? }", desc: "تیتر خبرنامه. اگه ندید، نوار خبرنامه نشون داده نمیشه." }, { name: "seals / social / apps", type: "ReactNode", desc: "جای نمادها، شبکه‌های اجتماعی و دکمه‌های اپلیکیشن که از بلاک‌های دیگه می‌آن." }, { name: "legal", type: "{ label; href }[]", desc: "لینک‌های قوانین و حریم خصوصی در خط آخر." }],
    promptBullets: ["Three bands: newsletter strip, a six-column grid (brand + contact spans two, link columns, seals and apps last), and a legal bottom line.", "Phone number is an ltr tel: link with Persian digits; email field is ltr; slots for seals, social icons and app buttons."],
  },
  {
    slug: "footer-centered", name: "پابرگ وسط‌چین", file: bl("footer-centered"), tags: ["پابرگ"], registryDeps: ["jalali"],
    desc: "پابرگ وسط‌چین با لوگو، یک خط شعار، ردیف لینک‌ها و آیکون شبکه‌ها که برای لندینگ‌های تک‌صفحه‌ای خوبه.",
    usage: `import { FooterCentered } from "@/components/blocks/footer-centered"

<FooterCentered logo="دکان" tagline="فروشگاه‌ساز فارسی" links={[{ label: "قیمت", href: "#pricing" }]} />`,
    promptBullets: ["Everything centered in one column: logo, tagline, wrapping link row, social slot, then a divider and the Jalali copyright."],
  },
  {
    slug: "pricing-single", name: "قیمت تک‌پلن", file: bl("pricing-single"), tags: ["قیمت", "تبدیل"], deps: ["lucide-react"], registryDeps: ["button", "price"],
    desc: "قیمت یک محصول تکی مثل دوره یا کتاب، که امکانات سمت راست میان و جعبه‌ی قیمت با تخفیف و دکمه‌ی خرید سمت چپ.",
    usage: `import { PricingSingle } from "@/components/blocks/pricing-single"

<PricingSingle
  title="دوره‌ی جامع ری‌اکت"
  amount={1_490_000}
  original={2_400_000}
  unit="تومان، یک‌بار پرداخت"
  features={["۴۲ ساعت ویدئو", "پروژه‌ی عملی", "گواهی پایان دوره"]}
  note="تا ۷ روز اگه راضی نبودید پول‌تون برمی‌گرده"
/>`,
    props: [{ name: "original", type: "number", desc: "قیمت قبل از تخفیف. درصد تخفیف خودش حساب میشه." }, { name: "note", type: "string", desc: "جمله‌ی اطمینان‌بخش زیر دکمه." }],
    promptBullets: ["One card split in two: feature list in two columns on the start side, a tinted price box on the end side with Price, a full-width button and a reassurance line.", "A labelled divider «شامل این‌ها میشه» above the features."],
  },
  {
    slug: "pricing-usage", name: "قیمت مصرفی", file: bl("pricing-usage"), tags: ["قیمت", "اسلایدر"], deps: ["lucide-react"], registryDeps: ["button", "slider"],
    desc: "قیمت‌گذاری بر اساس مصرف، که با اسلایدر تعداد را انتخاب می‌کنید و نرخ هر واحد پله‌پله ارزون‌تر میشه و جمع ماهانه همون لحظه عوض میشه.",
    usage: `import { PricingUsage } from "@/components/blocks/pricing-usage"

<PricingUsage
  unit="پیامک"
  max={100_000}
  step={1000}
  tiers={[{ upTo: 10_000, unitPrice: 180 }, { upTo: 50_000, unitPrice: 150 }, { upTo: 100_000, unitPrice: 120 }]}
  onSelect={(volume, total) => checkout(volume, total)}
/>`,
    props: [{ name: "tiers", type: "{ upTo; unitPrice }[]", desc: "پله‌های قیمت به ترتیب صعودی. کل تعداد با نرخ پله‌ای که در اون افتاده حساب میشه." }, { name: "base", type: "number", default: "0", desc: "اشتراک پایه‌ی ماهانه که به هزینه‌ی مصرف اضافه میشه." }],
    notes: ["تابع tierFor هم export شده تا همین محاسبه را سمت سرور تکرار کنید. قیمت نهایی را هیچ‌وقت از کلاینت قبول نکنید."],
    promptBullets: ["Slider for monthly volume with the value formatted as «۲۵٬۰۰۰ پیامک»; tier cards under it with the active one highlighted via aria-current.", "Total in an aria-live region with a one-line breakdown; volume tiers (whole volume billed at its tier rate)."],
  },
  {
    slug: "pricing-rows", name: "قیمت ردیفی", file: bl("pricing-rows"), tags: ["قیمت", "اشتراک"], registryDeps: ["button"],
    desc: "دوره‌های اشتراک به شکل ردیف‌های انتخابی، که قیمت ماهانه و درصد صرفه‌جویی هر ردیف نسبت به کوتاه‌ترین دوره خودش حساب میشه.",
    usage: `import { PricingRows } from "@/components/blocks/pricing-rows"

<PricingRows
  rows={[
    { id: "1m", name: "یک‌ماهه", months: 1, price: 99_000 },
    { id: "3m", name: "سه‌ماهه", months: 3, price: 249_000, tag: "محبوب" },
    { id: "12m", name: "سالانه", months: 12, price: 790_000 },
  ]}
  defaultValue="3m"
  onSelect={(row) => pay(row.id)}
/>`,
    props: [{ name: "rows", type: "{ id; name; months; price; tag? }[]", desc: "price قیمت کل دوره به تومانه، نه قیمت ماهانه." }],
    promptBullets: ["Real radio inputs (sr-only) inside label rows; the selected row gets a stronger border and a filled dot.", "Per-month price and a «۱۶٪ صرفه‌جویی» pill computed against the shortest period; one full-width continue button."],
  },
  {
    slug: "testimonials-wall", name: "دیوار نظرات", file: bl("testimonials-wall"), tags: ["اثبات"], registryDeps: ["avatar"],
    desc: "دیوار نظرات با کارت‌هایی که ارتفاع‌شون فرق داره و پایینش محو میشه، برای وقتی که نظر زیاد دارید.",
    usage: `import { TestimonialsWall } from "@/components/blocks/testimonials-wall"

<TestimonialsWall items={[{ name: "نگار کریمی", role: "مدیر فروشگاه", quote: "…", source: "توییتر" }]} />`,
    props: [{ name: "fade", type: "boolean", default: "true", desc: "ارتفاع را محدود می‌کنه و پایین دیوار را محو نشون میده." }],
    promptBullets: ["CSS columns (1/2/3) with break-inside-avoid cards, so heights stay uneven without JavaScript.", "Author row on top with avatar, role and a small source label; quote in «» below; optional bottom fade with mask-image."],
  },
  {
    slug: "testimonial-spotlight", name: "نظر برجسته", file: bl("testimonial-spotlight"), tags: ["اثبات", "تب"], registryDeps: ["avatar"],
    desc: "هر بار یک نظر بزرگ وسط صفحه با یک عدد شاخص، که با آواتارهای زیرش بین مشتری‌ها جابه‌جا میشید.",
    usage: `import { TestimonialSpotlight } from "@/components/blocks/testimonial-spotlight"

<TestimonialSpotlight
  interval={6}
  items={[{ name: "سارا محمدی", role: "مدیر بازاریابی", quote: "…", metric: { value: "۳ برابر", label: "فروش در شش ماه" } }]}
/>`,
    props: [{ name: "interval", type: "number", default: "0", desc: "فاصله‌ی جابه‌جایی خودکار به ثانیه. صفر یعنی خاموش. با هاور و فوکوس می‌ایسته." }],
    promptBullets: ["Avatars are a tablist with roving tabindex; ArrowLeft moves to the next person (RTL); the quote is the tabpanel.", "Quote 24–30px with line-height 1.8–1.9 in «»; optional metric pill; auto-advance pauses on hover and focus."],
  },
  {
    slug: "testimonials-marquee", name: "نوار نظرات", file: bl("testimonials-marquee"), tags: ["اثبات", "انیمیشن"], registryDeps: ["avatar", "marquee"],
    desc: "دو ردیف کارت نظر که با سرعت متفاوت آروم حرکت می‌کنن و با هاور یا تنظیم «کاهش حرکت» می‌ایستن.",
    usage: `import { TestimonialsMarquee } from "@/components/blocks/testimonials-marquee"

<TestimonialsMarquee items={[{ name: "علی رضایی", role: "توسعه‌دهنده", quote: "…" }]} />`,
    props: [{ name: "duration", type: "number", default: "50", desc: "زمان یک دور کامل ردیف اول به ثانیه. ردیف دوم کمی کندتره." }],
    promptBullets: ["Items split into two Marquee rows with different durations; fixed-width 320px quote cards.", "Animation pauses on hover and under prefers-reduced-motion."],
  },
  {
    slug: "navbar-floating", name: "نوار شناور", file: bl("navbar-floating"), tags: ["ناوبری"], deps: ["lucide-react"], registryDeps: ["button"],
    desc: "نوار بالای کپسولی که از لبه‌های صفحه فاصله داره و در موبایل لینک‌هاش زیر خودش باز میشن.",
    usage: `import { NavbarFloating } from "@/components/blocks/navbar-floating"

<NavbarFloating logo="دکان" links={[{ label: "ویژگی‌ها", href: "#features" }, { label: "قیمت", href: "#pricing" }]} />`,
    props: [{ name: "fixed", type: "boolean", default: "true", desc: "نوار را به بالای صفحه می‌چسبونه. داخل قاب پیش‌نمایش خاموشش کنید." }],
    promptBullets: ["A max-w-3xl pill with backdrop-blur, 16px away from the viewport edges; active link gets a filled pill.", "Mobile menu is a grid-rows disclosure inside the same pill (aria-expanded, aria-controls, inert when closed, Escape closes)."],
  },
  {
    slug: "navbar-shop", name: "نوار فروشگاه", file: bl("navbar-shop"), tags: ["ناوبری", "فروشگاه"], deps: ["lucide-react"], registryDeps: ["button", "sheet"],
    desc: "نوار بالای فروشگاه با جست‌وجو در وسط، دکمه‌ی ورود و سبد با شمارنده، و ردیف دسته‌بندی‌ها که در موبایل داخل کشو میره.",
    usage: `import { NavbarShop } from "@/components/blocks/navbar-shop"

<NavbarShop
  logo="دکان"
  cartCount={3}
  location="تهران"
  categories={[{ label: "شگفت‌انگیزها", href: "/offers", highlight: true }, { label: "موبایل", href: "/c/mobile" }]}
  onSearch={(q) => router.push("/search?q=" + encodeURIComponent(q))}
  onCartClick={() => setCartOpen(true)}
/>`,
    props: [{ name: "cartCount", type: "number", default: "0", desc: "تعداد کالاهای سبد. وقتی صفره، نشان عددی دیده نمیشه." }, { name: "categories", type: "{ label; href; highlight? }[]", desc: "لینک‌های ردیف دوم. highlight لینک را به رنگ برند درمی‌آره." }],
    promptBullets: ["Row one: logo, a search form (role=search) in the middle, «ورود | ثبت‌نام» and a cart button with a count badge whose aria-label reads the count.", "Row two (md+): category links with an optional «ارسال به تهران»; on mobile the search drops under the logo row and categories move into a Sheet."],
  },
  {
    slug: "navbar-mega", name: "نوار با مگامنو", file: bl("navbar-mega"), tags: ["ناوبری", "منو"], deps: ["lucide-react"], registryDeps: ["button", "sheet"],
    desc: "نوار بالا با منوی بزرگ تمام‌عرض که لینک‌ها را گروه‌بندی‌شده با آیکون و توضیح نشون میده و یک کارت ویژه هم کنارش داره.",
    usage: `import { NavbarMega } from "@/components/blocks/navbar-mega"
import { BarChart3, Receipt } from "lucide-react"

<NavbarMega
  logo="دکان"
  items={[
    { label: "محصول", groups: [{ title: "فروش", links: [{ label: "فاکتور", href: "/invoice", description: "فاکتور رسمی شمسی", icon: Receipt }] }], feature: { title: "نسخه‌ی ۲", description: "گزارش‌های جدید را ببینید", href: "/changelog" } },
    { label: "قیمت", href: "/pricing" },
  ]}
/>`,
    props: [{ name: "items", type: "MegaItem[]", desc: "هر آیتم یا یک لینک ساده‌ست یا groups داره که پنل را باز می‌کنه." }],
    promptBullets: ["Top-level items with groups are buttons (aria-expanded, aria-controls); the panel is absolutely positioned under the header at full width.", "Escape closes and returns focus to the trigger; pointerdown outside closes; on mobile the groups become native <details> inside a Sheet."],
  },
  {
    slug: "login-split", name: "ورود دوستونه", file: bl("login-split"), tags: ["فرم", "کد تأیید"], deps: ["lucide-react"], registryDeps: ["button", "phone-input", "otp-field"],
    desc: "صفحه‌ی ورود با موبایل و کد پیامکی در یک ستون و پنل برند در ستون دیگه، با تایمر ارسال دوباره و پیام خطا.",
    usage: `import { LoginSplit } from "@/components/blocks/login-split"

<LoginSplit
  logo="دکان"
  onRequestCode={(phone) => sendOtp(phone)}
  onVerify={async (phone, code) => { await verifyOtp(phone, code); router.push("/panel") }}
  aside={<blockquote>«راه‌اندازی فروشگاه ده دقیقه طول کشید.»</blockquote>}
/>`,
    props: [{ name: "onRequestCode", type: "(phone) => Promise<void>", desc: "با ده رقم ملی شماره صدا زده میشه. اگه خطا بده، پیام «ارسال نشد» نشون داده میشه." }, { name: "onVerify", type: "(phone, code) => Promise<void>", desc: "بعد از پر شدن کد صدا زده میشه. اگه خطا بده، خانه‌ها خالی میشن و «کد درست نیست» می‌آد." }, { name: "resendAfter", type: "number", default: "120", desc: "ثانیه تا فعال شدن ارسال دوباره." }],
    notes: ["اگه فقط یک کارت کوچیک می‌خواید، بلاک auth-card همین جریان را در یک کارت داره."],
    promptBullets: ["Step 1: PhoneInput and a button disabled until the number is valid. Step 2: OtpField whose onComplete verifies, a mm:ss resend countdown and a «تغییر شماره» back link with ArrowRight.", "Errors in a role=alert line; the OTP remounts by key after a wrong code. The brand panel is hidden below lg."],
  },
  {
    slug: "trust-badges", name: "نشان‌های اعتماد", file: bl("trust-badges"), tags: ["اثبات", "نماد اعتماد", "فروشگاه"], deps: ["lucide-react"],
    desc: "جای نماد اعتماد الکترونیکی، ساماندهی و نشان اتحادیه، هم به شکل ردیف کوچک برای پابرگ و هم به شکل یک بخش کامل با توضیح.",
    usage: `import { TrustBadges } from "@/components/blocks/trust-badges"

<TrustBadges
  variant="cards"
  title="با خیال راحت خرید کنید"
  seals={[
    { name: "نماد اعتماد الکترونیکی", caption: "مجوز کسب‌وکار اینترنتی", href: "https://trustseal.enamad.ir/?id=…", image: <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=…" alt="نماد اعتماد" /> },
    { name: "ساماندهی", caption: "ثبت در ستاد ساماندهی" },
  ]}
/>`,
    props: [{ name: "seals", type: "{ name; href?; image?; caption? }[]", desc: "image همان تگ img رسمی‌ایه که هر نهاد بهتون میده. بدون اون یک جای خالی خط‌چین کشیده میشه." }, { name: "variant", type: '"row" | "cards"', default: '"row"', desc: "row برای پابرگ و صفحه‌ی پرداخت، cards برای یک بخش کامل." }],
    notes: ["کد رسمی نماد را دست نزنید. نماد اعتماد فقط وقتی معتبره که لینکش به صفحه‌ی تأیید دامنه‌ی خودتون بره و referrerPolicy همونی باشه که در کد رسمی اومده.", "جای خالی خط‌چین فقط برای زمان طراحیه و نباید با اون منتشر کنید."],
    promptBullets: ["Seal slots render the issuer's official <img> untouched on a white tile; a dashed placeholder with a shield icon when no image is given.", "Each seal links to the issuer's verification page in a new tab with rel=noopener; row variant for footers, cards variant with name, caption and a check icon."],
  },
  {
    slug: "app-download", name: "دریافت اپلیکیشن", file: bl("app-download"), tags: ["اپلیکیشن", "تبدیل"], deps: ["lucide-react"],
    desc: "بخش دریافت اپلیکیشن با دکمه‌ی کافه‌بازار، مایکت، سیب‌اپ و نسخه‌ی وب، به‌همراه کد QR برای کسایی که با دسکتاپ اومدن.",
    usage: `import { AppDownload, StoreButton } from "@/components/blocks/app-download"

<AppDownload
  title="اپلیکیشن دکان را نصب کنید"
  stores={[
    { store: "کافه‌بازار", platform: "android", href: "https://cafebazaar.ir/app/…" },
    { store: "مایکت", platform: "android", href: "https://myket.ir/app/…" },
    { store: "سیب‌اپ", platform: "ios", href: "https://sibapp.com/…" },
    { store: "نسخه‌ی وب", caption: "بدون نصب", platform: "web", href: "/pwa" },
  ]}
  qr={<img src="/qr.svg" alt="کد QR دریافت اپلیکیشن" />}
/>`,
    props: [{ name: "stores", type: "{ store; href; caption?; platform?; icon? }[]", desc: "دکمه‌ها. platform یک برچسب کوچک «اندروید»، «آیفون» یا «وب» کنار دکمه می‌گذاره." }, { name: "qr", type: "ReactNode", desc: "عکس یا کامپوننت کد QR. فقط در دسکتاپ نشون داده میشه." }],
    notes: ["StoreButton جدا هم export شده تا در پابرگ یا هیرو ازش استفاده کنید.", "لوگوی فروشگاه‌ها داخل بلاک نیست. نسخه‌ی رسمی هر کدام را در icon بگذارید."],
    promptBullets: ["Store buttons in a two-column grid, each with a caption line, the store name and a platform tag; the first is filled.", "QR tile on white with a caption, hidden below md since phone users tap the buttons instead."],
  },
  {
    slug: "social-links", name: "شبکه‌های اجتماعی", file: bl("social-links"), tags: ["تماس", "پابرگ"], deps: ["lucide-react"],
    desc: "لینک شبکه‌هایی که کسب‌وکارهای ایرانی واقعاً دارن، یعنی تلگرام، ایتا، بله، روبیکا، اینستاگرام و آپارات، در سه شکل آیکونی، فهرستی و کارتی.",
    usage: `import { SocialLinks } from "@/components/blocks/social-links"

<SocialLinks
  variant="cards"
  links={[
    { network: "telegram", href: "https://t.me/dokan", handle: "@dokan" },
    { network: "eitaa", href: "https://eitaa.com/dokan", handle: "@dokan" },
    { network: "bale", href: "https://ble.ir/dokan", handle: "@dokan" },
    { network: "instagram", href: "https://instagram.com/dokan.ir", handle: "@dokan.ir" },
  ]}
/>`,
    props: [{ name: "variant", type: '"icons" | "list" | "cards"', default: '"icons"', desc: "icons برای پابرگ، list برای صفحه‌ی تماس و cards برای صفحه‌ی لینک‌ها." }, { name: "links", type: "{ network; href; handle?; label?; icon? }[]", desc: "network یکی از telegram، eitaa، bale، rubika، instagram، whatsapp، aparat، linkedin، email، phone و website است." }],
    notes: ["هر شبکه یک آیکون خنثی داره چون لوگوها علامت تجاری هستن. لوگوی رسمی را می‌تونید در icon بگذارید."],
    promptBullets: ["A network table mapping each key to a Persian label and a neutral lucide glyph, overridable per link.", "Icon variant: 40px round buttons with aria-label; list and cards variants show the label and an ltr handle in <bdi>."],
  },
  {
    slug: "cart-drawer", name: "سبد کشویی", file: bl("cart-drawer"), tags: ["فروشگاه", "سبد"], deps: ["lucide-react"], registryDeps: ["sheet", "button", "number-field"],
    desc: "سبد خرید کشویی با تعداد هر کالا، نوار «چقدر تا ارسال رایگان مونده»، سود خرید و جمع کل چسبان در پایین.",
    usage: `import { CartDrawer } from "@/components/blocks/cart-drawer"

<CartDrawer
  open={open}
  onOpenChange={setOpen}
  items={items}
  freeShippingFrom={1_500_000}
  onQuantityChange={(id, quantity) => update(id, quantity)}
  onRemove={(id) => remove(id)}
  onCheckout={() => router.push("/checkout")}
/>`,
    props: [{ name: "items", type: "{ id; name; price; quantity; original?; variant?; max? }[]", desc: "price قیمت واحده. اگه original بدید، سود خرید هم حساب میشه." }, { name: "freeShippingFrom", type: "number", desc: "حد ارسال رایگان به تومان. نوار پیشرفت بالای سبد از این حساب میشه." }, { name: "side", type: '"start" | "end"', default: '"end"', desc: "لبه‌ای که کشو ازش می‌آد. end در فارسی یعنی سمت چپ." }],
    notes: ["تابع cartTotals هم export شده و جمع، سود و تعداد را برمی‌گردونه.", "کشو state نداره و فقط چیزی را که بهش میدید نشون میده، پس با هر مدیریت state‌ای کار می‌کنه."],
    promptBullets: ["A controlled Sheet: scrollable line items (thumb, name, variant, NumberField, remove button with aria-label, line total), sticky footer with saving, total and checkout.", "Free-shipping progress in an aria-live line; an empty state with an icon and «ادامه‌ی خرید»."],
  },
  {
    slug: "product-detail", name: "جزئیات محصول", file: bl("product-detail"), tags: ["فروشگاه", "محصول"], deps: ["lucide-react"], registryDeps: ["button", "number-field", "price", "rating"],
    desc: "بخش بالای صفحه‌ی محصول با گالری، انتخاب رنگ و مدل، ویژگی‌های اصلی و جعبه‌ی فروشنده با گارانتی، ارسال و افزودن به سبد.",
    usage: `import { ProductDetail } from "@/components/blocks/product-detail"

<ProductDetail
  title="هدفون بی‌سیم با حذف نویز"
  subtitle="Sound Pro X2"
  price={2_450_000}
  original={2_900_000}
  rating={{ value: 4.5, count: 128 }}
  options={[{ name: "رنگ", values: [{ id: "black", label: "مشکی", color: "#111" }, { id: "white", label: "سفید", color: "#eee" }] }]}
  seller="دکان" warranty="گارانتی ۱۸ ماهه" shipping="ارسال از فردا"
  stock={4}
  onAddToCart={(selection, quantity) => add(selection, quantity)}
/>`,
    props: [{ name: "options", type: "{ name; values: { id; label; color?; disabled? }[] }[]", desc: "گزینه‌های محصول. color یک دایره‌ی رنگی کنار اسم می‌گذاره و disabled گزینه را خط‌خورده نشون میده." }, { name: "stock", type: "number", desc: "موجودی. زیر ۶ عدد هشدار قرمز می‌آد و صفر یعنی ناموجود." }, { name: "onAddToCart", type: "(selection, quantity) => void", desc: "selection یک شیء از اسم گزینه به id انتخاب‌شده‌ست." }],
    promptBullets: ["Three columns on lg (4/5/3): gallery with thumbnail buttons, details with radio-based option chips and a spec grid, sticky seller box.", "Seller box lists seller, warranty, shipping and returns with icons, then Price, a low-stock warning, NumberField and the add-to-cart button; «ناموجود» when stock is 0."],
  },
  {
    slug: "order-tracking", name: "پیگیری سفارش", file: bl("order-tracking"), tags: ["فروشگاه", "شمسی", "ارسال"], deps: ["lucide-react"], registryDeps: ["jalali"],
    desc: "وضعیت سفارش با مرحله‌ها و تاریخ و ساعت شمسی، کد رهگیری پست که با یک کلیک کپی میشه، نشانی تحویل و اقلام سفارش.",
    usage: `import { OrderTracking } from "@/components/blocks/order-tracking"

<OrderTracking
  orderId="DK-48213"
  current={2}
  steps={[
    { title: "ثبت سفارش", at: new Date("2026-11-10T09:12:00+03:30") },
    { title: "آماده‌سازی", at: new Date("2026-11-10T14:40:00+03:30") },
    { title: "تحویل به پست", at: new Date("2026-11-11T10:05:00+03:30") },
    { title: "تحویل به مشتری" },
  ]}
  carrier={{ name: "پست", code: "052340981200045871230114", href: "https://tracking.post.ir" }}
  eta={new Date("2026-11-14")}
/>`,
    props: [{ name: "steps", type: "{ title; at?; note? }[]", desc: "مرحله‌ها به ترتیب. at را برای مرحله‌هایی که هنوز نرسیده خالی بگذارید." }, { name: "current", type: "number", desc: "شماره‌ی مرحله‌ی فعلی، از صفر." }, { name: "carrier", type: "{ name; code; href? }", desc: "شرکت حمل و کد رهگیری که دکمه‌ی کپی داره." }],
    promptBullets: ["An ordered list: horizontal with a connecting line on md+, vertical on mobile; done steps filled with a check, the current step ringed with aria-current=step.", "Jalali date and Persian-digit time per step; the tracking code is an ltr mono button that copies and announces «کپی شد» through role=status."],
  },
  {
    slug: "reviews", name: "دیدگاه‌ها", file: bl("reviews"), tags: ["فروشگاه", "اثبات", "شمسی"], deps: ["lucide-react"], registryDeps: ["avatar", "button", "rating", "jalali"],
    desc: "دیدگاه خریدارها با میانگین امتیاز، نمودار ستاره‌ها که فیلتر هم می‌کنه، مرتب‌سازی، نقاط قوت و ضعف، پاسخ فروشگاه و دکمه‌ی «مفید بود».",
    usage: `import { Reviews } from "@/components/blocks/reviews"

<Reviews
  reviews={[
    { id: "1", author: "نگار کریمی", rating: 5, date: new Date(), verified: true, body: "…", pros: ["باتری قوی"], cons: ["کیف ندارد"], helpful: 12 },
  ]}
  onWrite={() => setOpen(true)}
  onHelpful={(id) => vote(id)}
/>`,
    props: [{ name: "reviews", type: "Review[]", desc: "هر دیدگاه author، rating، date و body داره و verified، pros، cons، helpful و reply اختیاری هستن." }],
    notes: ["تابع reviewStats میانگین و سهم هر ستاره را برمی‌گردونه تا برای داده‌ی ساختاریافته‌ی AggregateRating هم ازش استفاده کنید."],
    promptBullets: ["Sticky summary column: big average, read-only stars, five bars that act as toggle filters (aria-pressed) and a write button.", "Sort chips (جدیدترین، مفیدترین، بیشترین و کمترین امتیاز); each review an article with avatar, «خریدار» badge, Jalali date, pros with plus and cons with minus icons, shop reply with border-s, and a one-time helpful vote."],
  },
];
