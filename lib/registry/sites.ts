import type { SiteDoc, SitePage } from "./types";

const dir = (slug: string) => `registry/sites/${slug}`;
const page = (path: string, label: string, name: string, title: string): SitePage => ({
  path,
  label,
  file: `${path || "home"}.tsx`,
  export: name,
  title,
});

export const sites: SiteDoc[] = [
  {
    slug: "agency-site",
    name: "استودیو طراحی",
    nameEn: "Studio",
    file: `${dir("agency-site")}/shell.tsx`,
    dir: dir("agency-site"),
    tags: ["آژانس", "نمونه‌کار", "پورتفولیو"],
    desc: "سایت کامل یک استودیوی طراحی و برنامه‌نویسی با تیتر بزرگ، نمونه‌کارها با فیلتر، خدمات و فرایند، تیم و فرم شروع پروژه با بودجه.",
    features: ["۵ صفحه", "فیلتر نمونه‌کار", "فرم بریف پروژه", "منوی موبایل"],
    pages: [
      page("", "خانه", "HomePage", "استودیو نقش · طراحی و ساخت محصول دیجیتال"),
      page("work", "نمونه‌کارها", "WorkPage", "نمونه‌کارها · استودیو نقش"),
      page("services", "خدمات", "ServicesPage", "خدمات · استودیو نقش"),
      page("about", "درباره‌ی ما", "AboutPage", "درباره‌ی ما · استودیو نقش"),
      page("contact", "شروع پروژه", "ContactPage", "شروع پروژه · استودیو نقش"),
    ],
    registryDeps: ["avatar", "counter", "reveal", "button", "input", "textarea", "segmented-control", "select", "marquee", "word-rotate", "arrow-link", "grain", "accordion", "sheet"],
    usage: "",
    promptBullets: [
      "Five routes sharing one Shell (sticky header with active link, mobile Sheet menu, big footer CTA): home, work, services, about, contact.",
      "Home: oversized two-line headline with a WordRotate word, client Marquee, three featured case studies with photo covers (token art with a screen mock as fallback), numbers with Counter, services list with ArrowLink rows.",
      "Work: category filter chips that filter a masonry-like grid; each card shows client, year in Persian digits and a result metric.",
      "Contact: brief form with project-type checkboxes, budget SegmentedControl in تومان ranges, timeline, and a success state.",
    ],
  },
  {
    slug: "saas-site",
    name: "سایت نرم‌افزار",
    nameEn: "SaaS",
    file: `${dir("saas-site")}/shell.tsx`,
    dir: dir("saas-site"),
    tags: ["SaaS", "قیمت", "وبلاگ"],
    desc: "سایت کامل یک نرم‌افزار حسابداری آنلاین با پیش‌نمایش محصول در هیرو، بنتوی امکانات، قیمت ماهانه و سالانه، وبلاگ و ورود پیامکی.",
    features: ["۵ صفحه", "قیمت ماهانه/سالانه", "ورود با کد تأیید", "جدول مقایسه"],
    pages: [
      page("", "خانه", "HomePage", "حسابینو · حسابداری آنلاین برای کسب‌وکارهای کوچک"),
      page("features", "امکانات", "FeaturesPage", "امکانات · حسابینو"),
      page("pricing", "قیمت", "PricingPage", "قیمت · حسابینو"),
      page("blog", "وبلاگ", "BlogPage", "وبلاگ · حسابینو"),
      page("login", "ورود", "LoginPage", "ورود · حسابینو"),
    ],
    registryDeps: ["avatar", "input", "button", "reveal", "accordion", "marquee", "gradient-text", "spotlight-card", "counter", "grid", "phone-input", "otp-field", "segmented-control", "sheet"],
    usage: "",
    promptBullets: [
      "Five routes sharing one Shell with a blurred sticky header, «ورود» and «شروع رایگان» actions and a mobile Sheet.",
      "Home: hero with GradientText, a product mock drawn only with tokens (sidebar, stat cards, bar chart, invoice rows), logo Marquee, bento of SpotlightCards, testimonials, FAQ Accordion, final CTA on a GridBackground.",
      "Pricing: monthly/yearly SegmentedControl that swaps تومان prices and shows the yearly saving, three plans with the middle highlighted, and a comparison table.",
      "Login: two steps, PhoneInput then OtpField with a resend countdown in Persian digits.",
    ],
  },
  {
    slug: "shop-site",
    name: "فروشگاه قهوه",
    nameEn: "Coffee shop",
    file: `${dir("shop-site")}/shell.tsx`,
    dir: dir("shop-site"),
    tags: ["فروشگاه", "سبد خرید", "محصول"],
    desc: "فروشگاه کامل یک برشته‌کار قهوه با سبد خریدی که بین صفحه‌ها می‌مونه، فیلتر و مرتب‌سازی، صفحه‌ی محصول با وزن و آسیاب و صفحه‌ی سبد.",
    features: ["۵ صفحه", "سبد مشترک بین صفحه‌ها", "فیلتر و مرتب‌سازی", "ارسال رایگان"],
    pages: [
      page("", "خانه", "HomePage", "رُست · قهوه‌ی تازه‌برشته"),
      page("shop", "فروشگاه", "ShopPage", "فروشگاه · رُست"),
      page("product", "محصول", "ProductPage", "اتیوپی یرگاچف · رُست"),
      page("cart", "سبد خرید", "CartPage", "سبد خرید · رُست"),
      page("about", "داستان ما", "AboutPage", "داستان ما · رُست"),
    ],
    registryDeps: ["reveal", "counter", "button", "input", "number-field", "progress", "marquee", "grain", "price", "rating", "segmented-control", "radio-group", "sheet", "select"],
    usage: "",
    promptBullets: [
      "Five routes sharing one Shell; the cart is a tiny localStorage store read with useSyncExternalStore, so the header badge and the cart page stay in sync across routes and tabs.",
      "Shop: category chips, roast-level filter, sort Select and an empty state; product cards with tasting notes, Rating and Price with discount.",
      "Product: photo gallery with a drawn-bag colourway, weight SegmentedControl that changes the price, grind RadioGroup cards, NumberField quantity and add-to-cart feedback.",
      "Cart: line items with quantity steppers and remove, free-shipping progress to ۱٬۵۰۰٬۰۰۰ تومان, discount code and a sticky summary.",
    ],
  },
  {
    slug: "clinic-site",
    name: "کلینیک دندانپزشکی",
    nameEn: "Clinic",
    file: `${dir("clinic-site")}/shell.tsx`,
    dir: dir("clinic-site"),
    tags: ["کلینیک", "نوبت‌دهی", "پزشک"],
    desc: "سایت کامل یک کلینیک دندانپزشکی با خدمات و تعرفه، معرفی پزشک‌ها، نوبت‌دهی آنلاین با تقویم شمسی و ساعت‌های خالی و صفحه‌ی تماس.",
    features: ["۵ صفحه", "نوبت‌دهی با تقویم شمسی", "تعرفه‌ی خدمات", "بیمه‌های طرف قرارداد"],
    pages: [
      page("", "خانه", "HomePage", "کلینیک دندانپزشکی لبخند"),
      page("services", "خدمات", "ServicesPage", "خدمات و تعرفه · کلینیک لبخند"),
      page("doctors", "پزشکان", "DoctorsPage", "پزشکان · کلینیک لبخند"),
      page("booking", "نوبت‌دهی", "BookingPage", "نوبت‌دهی آنلاین · کلینیک لبخند"),
      page("contact", "تماس", "ContactPage", "تماس و مسیر · کلینیک لبخند"),
    ],
    registryDeps: ["button", "stepper", "radio-group", "slot-picker", "phone-input", "input", "textarea", "success-check", "rating", "reveal", "accordion", "counter", "compare-slider", "sheet"],
    usage: "",
    promptBullets: [
      "Five routes sharing one Shell with an emergency phone bar, sticky header, «نوبت بگیرید» action and a mobile Sheet.",
      "Home: calm hero with trust stats, services grid, before/after CompareSlider, doctor cards with Rating, insurance chips and FAQ Accordion.",
      "Booking: Stepper with service RadioGroup cards, doctor choice, Jalali Calendar with Fridays closed and past days disabled, time-slot chips with taken slots struck through, PhoneInput and a SuccessCheck confirmation with a tracking code.",
      "Services: price ranges per treatment in تومان with duration and an insurance note.",
    ],
  },
  {
    slug: "restaurant-site",
    name: "رستوران ایرانی",
    nameEn: "Restaurant",
    file: `${dir("restaurant-site")}/shell.tsx`,
    dir: dir("restaurant-site"),
    tags: ["رستوران", "منو", "رزرو"],
    desc: "سایت کامل یک رستوران ایرانی با نقش گره در پس‌زمینه، منوی دسته‌بندی‌شده با قیمت تومانی، رزرو میز با تاریخ و ساعت و شعبه‌ها.",
    features: ["۵ صفحه", "منوی دسته‌بندی‌شده", "رزرو میز", "نقش گره‌ی ایرانی"],
    pages: [
      page("", "خانه", "HomePage", "رستوران نارنج · آشپزی ایرانی"),
      page("menu", "منو", "MenuPage", "منو · رستوران نارنج"),
      page("reserve", "رزرو میز", "ReservePage", "رزرو میز · رستوران نارنج"),
      page("about", "داستان ما", "AboutPage", "داستان ما · رستوران نارنج"),
      page("contact", "شعبه‌ها", "ContactPage", "شعبه‌ها و تماس · رستوران نارنج"),
    ],
    registryDeps: ["reveal", "girih", "segmented-control", "marquee", "button", "date-picker", "number-field", "phone-input", "input", "textarea", "select", "success-check", "sheet"],
    usage: "",
    promptBullets: [
      "Five routes sharing one Shell; header and footer carry a subtle GirihBackground pattern; opening hours in Persian digits.",
      "Menu: sticky category chips with scroll-spy, dishes with Persian descriptions, تومان price, «محبوب» / «گیاهی» badges and a dietary filter.",
      "Reserve: Jalali DatePicker, guests NumberField, time chips grouped into ناهار and شام, seating SegmentedControl, PhoneInput and a confirmation card.",
      "Home: editorial hero, signature dishes, chef quote, a Marquee of reviews and branch cards.",
    ],
  },
  {
    slug: "lodge-site",
    name: "اقامتگاه بوم‌گردی",
    nameEn: "Eco-lodge",
    file: `${dir("lodge-site")}/shell.tsx`,
    dir: dir("lodge-site"),
    tags: ["گردشگری", "هتل", "رزرو"],
    desc: "سایت کامل یک اقامتگاه بوم‌گردی کویری با اتاق‌ها و امکانات، تجربه‌ها و تورها، رزرو با بازه‌ی تاریخ شمسی و محاسبه‌ی هزینه‌ی شب‌ها.",
    features: ["۵ صفحه", "بازه‌ی تاریخ شمسی", "محاسبه‌ی هزینه", "گالری اتاق‌ها"],
    pages: [
      page("", "خانه", "HomePage", "اقامتگاه کاهگل · کویر مصر"),
      page("rooms", "اتاق‌ها", "RoomsPage", "اتاق‌ها · اقامتگاه کاهگل"),
      page("experiences", "تجربه‌ها", "ExperiencesPage", "تجربه‌ها و تورها · اقامتگاه کاهگل"),
      page("book", "رزرو", "BookPage", "رزرو · اقامتگاه کاهگل"),
      page("about", "درباره‌ی ما", "AboutPage", "درباره‌ی ما · اقامتگاه کاهگل"),
    ],
    registryDeps: ["avatar", "reveal", "button", "date-range-picker", "number-field", "radio-group", "checkbox", "phone-input", "input", "success-check", "accordion", "rating", "counter", "sheet"],
    usage: "",
    promptBullets: [
      "Five routes sharing one Shell with a transparent header over a full-bleed night photo of the lodge and a solid header elsewhere.",
      "Rooms: room photos with capacity, meters, amenities and a nightly تومان price, plus a small gallery strip.",
      "Book: Jalali DateRangePicker, adults/children NumberFields, room RadioGroup cards, live nights × price + breakfast + tax summary, PhoneInput and a confirmation state.",
      "Experiences: tour cards with duration, group size and difficulty; home has a guest Rating block and an FAQ Accordion.",
    ],
  },
];

for (const s of sites) s.usage = siteRouteSource(s, s.pages[0]);

/** Where a site's component file lands in the user's project. */
export function siteComponentTarget(slug: string, file: string) {
  return `components/sites/${slug}/${file}`;
}

/** Where the generated route file for a page lands in the user's project. */
export function siteRouteTarget(p: SitePage) {
  return p.path ? `app/${p.path}/page.tsx` : "app/page.tsx";
}

/** The tiny App Router file that mounts one page of a site. */
export function siteRouteSource(site: Pick<SiteDoc, "slug">, p: SitePage) {
  const mod = p.file.replace(/\.tsx$/, "");
  return [
    `import type { Metadata } from "next"`,
    `import { ${p.export} } from "@/components/sites/${site.slug}/${mod}"`,
    "",
    `export const metadata: Metadata = { title: "${p.title}" }`,
    "",
    "export default function Page() {",
    `  return <${p.export} />`,
    "}",
  ].join("\n");
}

/** Every file of a site in this repo: the shared shell first, then one per page. */
export function siteSourceFiles(site: SiteDoc) {
  return ["shell.tsx", ...site.pages.map((p) => p.file)].map((file) => ({
    file,
    src: `${site.dir}/${file}`,
    target: siteComponentTarget(site.slug, file),
  }));
}

/** Live preview URL of one page, mounted under /preview/site/<slug>. */
export function sitePreviewHref(slug: string, path = "") {
  return path ? `/preview/site/${slug}/${path}` : `/preview/site/${slug}`;
}
