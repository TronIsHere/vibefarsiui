import type { ComponentDoc } from "./types";

const ui = (slug: string) => `registry/ui/${slug}.tsx`;

/** General-purpose pieces most kits have, built RTL-first. */
export const generalComponents: ComponentDoc[] = [
  {
    slug: "copy-button", name: "دکمه‌ی کپی", cat: "display", file: ui("copy-button"), deps: ["lucide-react"],
    desc: "دکمه‌ی کپی آیکونی یا با متن که بعد از کپی تیک سبز نشون میده و «کپی شد» را برای صفحه‌خوان اعلام می‌کنه. جایی که Clipboard API بسته‌ست، مثل صفحه‌های http، از راه قدیمی کپی می‌کنه.",
    usage: `import { CopyButton } from "@/components/ui/copy-button"

<CopyButton value="IR820540102680020817909002" label="کپی شماره‌ی شبا" />
<CopyButton value={link} variant="outline">کپی لینک</CopyButton>`,
    props: [
      { name: "value", type: "string | () => string", desc: "متنی که کپی میشه. تابع موقع کلیک صدا زده میشه." },
      { name: "children", type: "ReactNode", desc: "اگه بدید دکمه متن‌دار میشه، وگرنه فقط آیکونه و label اسمش میشه." },
      { name: "label / copiedLabel", type: "string", default: '"کپی" / "کپی شد"', desc: "اسم دکمه و پیامی که بعد از کپی اعلام میشه." },
      { name: "onCopy", type: "(ok: boolean) => void", desc: "بعد از هر تلاش، با نتیجه." },
    ],
    notes: ["تابع copyText(text) جدا هم صادر میشه برای وقتی که دکمه‌ی خودتون را دارید."],
    promptBullets: ["Icon swaps to a check for 1.8s; an sr-only aria-live=polite span carries «کپی شد»; execCommand fallback when navigator.clipboard is missing or not in a secure context."],
  },
  {
    slug: "bottom-nav", name: "نوار پایین موبایل", cat: "nav", file: ui("bottom-nav"), wide: true, deps: ["lucide-react"],
    desc: "نوار تب پایین اپ‌های موبایلی با حداکثر پنج آیتم، قرص زیر آیتم فعال، عدد اعلان، دکمه‌ی برجسته‌ی وسط مثل «ثبت آگهی» و فاصله برای نوار خونه‌ی آیفون.",
    usage: `import { BottomNav } from "@/components/ui/bottom-nav"
import { Home, Search, ShoppingBag, User, Plus } from "lucide-react"

<BottomNav
  items={[
    { value: "home", label: "خانه", icon: Home },
    { value: "search", label: "جست‌وجو", icon: Search },
    { value: "cart", label: "سبد", icon: ShoppingBag, badge: 3 },
    { value: "me", label: "من", icon: User },
  ]}
  action={{ label: "ثبت آگهی", icon: Plus, onClick: openNew }}
  onChange={go}
/>`,
    props: [
      { name: "items", type: "BottomNavItem[]", desc: "value، label، icon و activeIcon، badge (عدد یا true برای نقطه) و href اختیاری." },
      { name: "value / defaultValue / onChange", type: "string", desc: "آیتم فعال." },
      { name: "action", type: "{ label, icon, onClick }", desc: "دکمه‌ی گرد بالاتر از نوار، وسط آیتم‌ها." },
      { name: "labels", type: '"always" | "active"', default: '"always"', desc: "با active فقط اسم آیتم فعال دیده میشه و بقیه برای صفحه‌خوان می‌مونن." },
      { name: "position", type: '"fixed" | "static"', default: '"fixed"', desc: "چسبیده به پایین صفحه یا داخل جریان صفحه." },
    ],
    promptBullets: ["nav with aria-current=page on the active item; badges have an sr-only «۳ مورد جدید»; padding-bottom uses env(safe-area-inset-bottom)."],
  },
  {
    slug: "drawer", name: "کشوی پایین", cat: "overlay", file: ui("drawer"),
    desc: "برگه‌ی پایین موبایل که با دستگیره کشیده میشه، بین چند ارتفاع جا می‌افته، با پرت کردن به پایین بسته میشه، فوکوس را داخل خودش نگه می‌داره و بعد از بستن برمی‌گردونه.",
    usage: `import { Drawer } from "@/components/ui/drawer"

<Drawer
  open={open}
  onOpenChange={setOpen}
  title="فیلترها"
  snapPoints={[0.45, 0.9]}
  footer={<Button className="w-full">نمایش ۱۲۴ کالا</Button>}
>
  …
</Drawer>`,
    props: [
      { name: "open / onOpenChange", type: "boolean", desc: "باز و بسته." },
      { name: "snapPoints", type: "number[]", default: "[0.5, 0.92]", desc: "ارتفاع‌ها به نسبت ارتفاع صفحه، از کوچیک به بزرگ." },
      { name: "defaultSnap", type: "number", default: "0", desc: "ارتفاعی که باهاش باز میشه." },
      { name: "title / description / footer", type: "ReactNode", desc: "سربرگ، توضیح و ناحیه‌ی چسبیده‌ی پایین." },
    ],
    notes: ["برای پنل کناری یا پایین ساده بدون کشیدن، Sheet کافیه. Drawer برای وقتیه که کاربر باید با انگشت اندازه‌اش را عوض کنه."],
    promptBullets: ["Handle is a real button (click cycles heights) with pointer capture for dragging; velocity > 0.6px/ms down closes, up opens fully; Tab is trapped and Escape closes."],
  },
  {
    slug: "tree-view", name: "درخت", cat: "data", file: ui("tree-view"), deps: ["lucide-react"],
    desc: "نمایش درختی پوشه‌ها، دسته‌بندی‌ها یا چارت سازمانی با خط راهنمای سطح‌ها، آیکون پوشه و فایل، و کیبورد کامل الگوی tree که کلیدهای چپ و راستش برای فارسی برعکس شدن.",
    usage: `import { TreeView } from "@/components/ui/tree-view"

<TreeView
  aria-label="دسته‌بندی کالاها"
  items={[
    { id: "digital", label: "کالای دیجیتال", children: [
      { id: "phone", label: "موبایل", meta: 128 },
      { id: "laptop", label: "لپ‌تاپ", meta: 64 },
    ] },
  ]}
  defaultExpanded={["digital"]}
  onSelect={(node) => setCategory(node.id)}
/>`,
    props: [
      { name: "items", type: "TreeNode[]", desc: "هر گره id، label، icon و meta اختیاری و children داره." },
      { name: "selected / onSelect", type: "string | (node) => void", desc: "گره انتخاب‌شده." },
      { name: "expanded / defaultExpanded / onExpandedChange", type: "string[]", desc: "شاخه‌های باز." },
      { name: "icons / guides", type: "boolean", default: "true", desc: "آیکون‌ها و خط‌های عمودی سطح‌ها." },
    ],
    notes: ["چپ شاخه را باز می‌کنه یا به داخلش میره و راست می‌بنده یا به والد برمی‌گرده. تایپ حرف اول هم به گره بعدی با همون حرف میره."],
    promptBullets: ["role=tree with flat treeitems carrying aria-level and aria-expanded; roving tabindex; the chevron points left when closed and down when open."],
  },
  {
    slug: "sortable-list", name: "فهرست مرتب‌شدنی", cat: "data", file: ui("sortable-list"), deps: ["lucide-react"],
    desc: "فهرستی که ردیف‌هاش با دستگیره کشیده و جابه‌جا میشن، با موس، لمس یا کیبورد. هر جابه‌جایی برای صفحه‌خوان اعلام میشه، مثل «جای ۲ از ۵».",
    usage: `import { SortableList } from "@/components/ui/sortable-list"

<SortableList
  label="ترتیب دسته‌های منو"
  items={sections}
  getKey={(s) => s.id}
  getLabel={(s) => s.title}
  onReorder={setSections}
  renderItem={(s) => <span>{s.title}</span>}
/>`,
    props: [
      { name: "items / onReorder", type: "T[]", desc: "فهرست و تابعی که ترتیب تازه را می‌گیره." },
      { name: "getKey / getLabel", type: "(item) => string", desc: "کلید پایدار و اسمی که اعلام میشه." },
      { name: "renderItem", type: "(item, { dragging, index }) => ReactNode", desc: "محتوای هر ردیف کنار دستگیره." },
      { name: "label", type: "string", desc: "اسم فهرست برای صفحه‌خوان." },
    ],
    notes: ["با کیبورد: فاصله ردیف را برمی‌داره، بالا و پایین جابه‌جا می‌کنه، فاصله دوباره رها می‌کنه و Escape برمی‌گردونه سر جای اول."],
    promptBullets: ["Pointer drag on the grip translates the row while neighbours slide by its height; an assertive live region narrates pick-up, each move and the drop."],
  },
  {
    slug: "resizable", name: "پنل‌های قابل تغییر اندازه", cat: "display", file: ui("resizable"), wide: true,
    desc: "تقسیم یک نما به چند پنل با جداکننده‌ی کشیدنی، افقی یا عمودی. در راست‌چین پنل اول سمت راسته و جهت کشیدن درست حساب میشه. جداکننده با کیبورد هم کار می‌کنه و می‌تونه پنل را جمع کنه.",
    usage: `import { ResizablePanels } from "@/components/ui/resizable"

<ResizablePanels defaultSizes={[25, 75]} min={15} collapseBelow={10} labels={["فهرست", "پیش‌نمایش"]} className="h-[480px]">
  <Sidebar />
  <Preview />
</ResizablePanels>`,
    props: [
      { name: "direction", type: '"horizontal" | "vertical"', default: '"horizontal"', desc: "کنار هم یا زیر هم." },
      { name: "defaultSizes / sizes / onSizesChange", type: "number[]", desc: "اندازه‌ها به درصد." },
      { name: "min", type: "number", default: "15", desc: "کمترین اندازه‌ی هر پنل." },
      { name: "collapseBelow", type: "number", desc: "زیر این درصد پنل کامل جمع میشه." },
      { name: "labels", type: "string[]", desc: "اسم پنل‌ها برای برچسب جداکننده‌ها." },
    ],
    notes: ["روی جداکننده، فلش‌ها ۲٪ و با Shift ده درصد تغییر میدن، Enter جمع و باز می‌کنه و دوبار کلیک دو پنل را هم‌اندازه می‌کنه."],
    promptBullets: ["Separator is role=separator with aria-valuenow in percent; pointer delta is negated in RTL so dragging toward the next panel always grows the current one."],
  },
  {
    slug: "color-picker", name: "انتخاب رنگ", cat: "form", file: ui("color-picker"), deps: ["lucide-react"], registryDeps: ["float"],
    desc: "انتخاب رنگ با مربع اشباع و روشنایی، نوار رنگ‌مایه، فیلد هگز، رنگ‌های آماده، قطره‌چکان صفحه در مرورگرهایی که دارن، و نسبت کنتراست با متن سفید و مشکی.",
    usage: `import { ColorInput, ColorPicker } from "@/components/ui/color-picker"

<ColorInput label="رنگ برند" value={brand} onChange={setBrand} />

// یا خود پنل، بدون پاپ‌اور:
<ColorPicker defaultValue="#6366f1" swatches={["#000", "#fff"]} />`,
    props: [
      { name: "value / defaultValue / onChange", type: "string", desc: "رنگ به شکل هگز." },
      { name: "swatches", type: "string[]", desc: "رنگ‌های آماده. آرایه‌ی خالی پنهان‌شون می‌کنه." },
      { name: "contrast", type: "boolean", default: "true", desc: "کنتراست با متن سفید و مشکی و رتبه‌ی AA و AAA." },
    ],
    notes: ["مربع و نوار رنگ در راست‌چین برعکس نمیشن چون فضای رنگ جهت متن نداره."],
    promptBullets: ["Saturation/value square and hue strip are role=slider with arrow keys (Shift ×10) and stay dir=ltr; hue is kept when the color goes gray or black."],
  },
  {
    slug: "image-cropper", name: "برش تصویر", cat: "form", file: ui("image-cropper"), deps: ["lucide-react"],
    desc: "برش عکس پروفایل یا کاور: عکس زیر قاب ثابت کشیده میشه، با اسلایدر، چرخ موس یا دو انگشت بزرگ میشه، ربع‌دور می‌چرخه و همیشه قاب را پر می‌کنه. خروجی با cropToBlob ساخته میشه.",
    usage: `import { ImageCropper, cropToBlob, type CropArea } from "@/components/ui/image-cropper"

const [area, setArea] = useState<CropArea>()

<ImageCropper src={file} round aspect={1} onCropChange={setArea} />
<Button onClick={async () => upload(await cropToBlob(file, area!, { outputWidth: 400, round: true }))}>ذخیره</Button>`,
    props: [
      { name: "src", type: "string", desc: "آدرس عکس یا object URL فایل انتخاب‌شده." },
      { name: "aspect", type: "number", default: "1", desc: "نسبت عرض به ارتفاع قاب، مثلاً 16/9 برای کاور." },
      { name: "round", type: "boolean", desc: "قاب گرد برای آواتار." },
      { name: "onCropChange", type: "(area: CropArea) => void", desc: "ناحیه به پیکسل‌های خود عکس، به‌اضافه‌ی چرخش." },
      { name: "size / maxZoom", type: "number", default: "280 / 4", desc: "عرض قاب روی صفحه و بیشترین بزرگ‌نمایی." },
    ],
    promptBullets: ["The frame dims the outside with a 9999px box-shadow; position is clamped so the image always covers it; arrows pan and +/− zoom from the keyboard."],
  },
  {
    slug: "signature-pad", name: "امضا", cat: "form", file: ui("signature-pad"), deps: ["lucide-react"],
    desc: "کادر امضا با انگشت، قلم یا موس: خط‌های نرم، ضخامت وابسته به فشار قلم، برگشت و پاک کردن، و خروجی PNG بریده‌شده یا SVG. با تغییر اندازه‌ی صفحه امضا از نو کشیده میشه، گم نمیشه.",
    usage: `import { SignaturePad, type SignaturePadHandle } from "@/components/ui/signature-pad"

const pad = useRef<SignaturePadHandle>(null)

<SignaturePad ref={pad} onChange={(empty) => setCanSubmit(!empty)} />
<Button onClick={() => submit(pad.current!.toDataURL())}>تأیید قرارداد</Button>`,
    props: [
      { name: "ref", type: "SignaturePadHandle", desc: "clear، undo، isEmpty، toDataURL و toSVG." },
      { name: "height", type: "number", default: "180", desc: "عرض خودش ظرف را پر می‌کنه." },
      { name: "color / penWidth", type: "string / number", default: "رنگ متن / 2.5", desc: "رنگ جوهر از رنگ متن میاد تا در حالت تاریک هم دیده بشه." },
      { name: "onChange", type: "(empty: boolean) => void", desc: "بعد از هر خط." },
    ],
    notes: ["برای کسایی که نمی‌تونن با موس یا لمس امضا کنن، کنارش راه دیگه‌ای مثل تایپ اسم کامل یا تأیید پیامکی بگذارید."],
    promptBullets: ["Strokes are stored as points and redrawn on resize at devicePixelRatio; quadratic smoothing through midpoints; uses getCoalescedEvents for fast pens."],
  },
  {
    slug: "qr-code", name: "کد QR", cat: "display", file: ui("qr-code"), wide: true,
    desc: "ساخت کد QR داخل مرورگر بدون هیچ وابستگی: متن فارسی، لینک و وای‌فای، کوچک‌ترین نسخه‌ای که جا بشه، بهترین الگو از هشت الگو، نقطه‌ی گرد اختیاری و جای لوگو وسطش. پس‌زمینه همیشه سفیده تا در حالت تاریک هم اسکن بشه.",
    usage: `import { QRCode, wifiQR } from "@/components/ui/qr-code"

<QRCode value="https://example.ir/pay/48213" label="لینک پرداخت" />
<QRCode value={wifiQR({ ssid: "cafe-guest", password: "1234abcd" })} rounded size={200} />`,
    props: [
      { name: "value", type: "string", desc: "متنی که کد می‌شه، به UTF-8." },
      { name: "size", type: "number", default: "168", desc: "اندازه به پیکسل." },
      { name: "ecc", type: '"L" | "M" | "Q" | "H"', default: '"M"', desc: "تصحیح خطا. با لوگو خودش H میشه." },
      { name: "margin", type: "number", default: "4", desc: "حاشیه‌ی خالی به تعداد ماژول." },
      { name: "rounded", type: "boolean", desc: "نقطه‌های گرد. سه چشم گوشه مربعی می‌مونن." },
      { name: "children", type: "ReactNode", desc: "لوگو یا آیکون وسط کد." },
    ],
    notes: ["encodeQR(text, ecc) ماتریس را برمی‌گردونه، اگه بخواید روی canvas یا PDF بکشیدش."],
    promptBullets: ["Byte-mode encoder with Reed–Solomon over GF(256), versions 1–40, all eight masks scored; drawn as a single SVG path with crispEdges; role=img labeled «کد QR: …»."],
  },
  {
    slug: "mention-input", name: "منشن", cat: "form", file: ui("mention-input"),
    desc: "جعبه‌ی متن که بعد از @ آدم‌ها را پیشنهاد میده، با جست‌وجوی اسم فارسی یا شناسه‌ی لاتین. «ي» و «ك» عربی هم پیدا میشن. MentionText هم پیام فرستاده‌شده را با منشن‌های رنگی نشون میده.",
    usage: `import { MentionInput, MentionText } from "@/components/ui/mention-input"

<MentionInput
  users={team}
  aria-label="نظر"
  placeholder="نظرتون را بنویسید. با @ هم‌تیمی‌ها را صدا بزنید"
  onChange={(text, mentioned) => setDraft({ text, mentioned })}
/>

<MentionText users={team}>{comment.text}</MentionText>`,
    props: [
      { name: "users", type: "MentionUser[]", desc: "id، name، handle لاتین، subtitle و avatar اختیاری." },
      { name: "value / defaultValue / onChange", type: "string, (text, mentions) => void", desc: "onChange فهرست افراد منشن‌شده را هم میده." },
      { name: "trigger", type: "string", default: '"@"', desc: "حرفی که فهرست را باز می‌کنه." },
      { name: "limit", type: "number", default: "6", desc: "بیشترین تعداد پیشنهاد." },
    ],
    promptBullets: ["The textarea is an ARIA combobox with aria-activedescendant into a listbox; Up/Down move, Enter or Tab insert «@handle », Escape closes."],
  },
  {
    slug: "product-tour", name: "تور معرفی", cat: "overlay", file: ui("product-tour"), deps: ["lucide-react"],
    desc: "معرفی قدم‌به‌قدم صفحه برای کاربر تازه: همه‌جا تیره میشه جز یک بخش، کارت توضیح کنارش می‌شینه با «بعدی» و «قبلی» و نقطه‌های پیشرفت، و هر بخش خودش اسکرول میشه وسط صفحه.",
    usage: `import { ProductTour } from "@/components/ui/product-tour"

<ProductTour
  open={tour}
  onOpenChange={setTour}
  onFinish={() => localStorage.setItem("tour-done", "1")}
  steps={[
    { target: "#search", title: "جست‌وجو", body: "اسم کالا یا کد را این‌جا بنویسید." },
    { target: "#cart", title: "سبد خرید", body: "هر چی اضافه کنید این‌جا می‌مونه." },
  ]}
/>`,
    props: [
      { name: "steps", type: "TourStep[]", desc: "target (سلکتور CSS)، title، body و side اختیاری. بدون target کارت وسط صفحه میاد." },
      { name: "open / onOpenChange", type: "boolean", desc: "Escape یا ضربدر تور را رد می‌کنه." },
      { name: "onFinish", type: "() => void", desc: "فقط بعد از «تموم» در آخرین قدم." },
      { name: "padding", type: "number", default: "8", desc: "فاصله‌ی دور بخش روشن." },
    ],
    promptBullets: ["Spotlight is one fixed box with a 9999px rgba shadow that animates between targets; the card is a focused dialog, ArrowLeft for next and ArrowRight for previous."],
  },
  {
    slug: "menubar", name: "نوار منو", cat: "nav", file: ui("menubar"), deps: ["lucide-react"], registryDeps: ["float"],
    desc: "نوار «فایل، ویرایش، نما» اپ‌های دسکتاپی مثل ویرایشگرها و پنل‌های مدیریت، با گزینه‌ی تیک‌دار، میانبر کیبورد، جداکننده و جابه‌جایی بین منوها با هاور وقتی یکی بازه.",
    usage: `import { Menubar } from "@/components/ui/menubar"

<Menubar
  menus={[
    { label: "فایل", items: [
      { label: "سند جدید", shortcut: "⌘N", onSelect: create },
      { type: "separator" },
      { label: "حذف", danger: true, onSelect: remove },
    ] },
    { label: "نما", items: [
      { type: "checkbox", label: "خط‌کش", checked: ruler, onCheckedChange: setRuler },
    ] },
  ]}
/>`,
    props: [
      { name: "menus", type: "{ label, items: MenubarItem[] }[]", desc: "آیتم معمولی، checkbox یا separator." },
    ],
    notes: ["چپ به منوی بعدی و راست به قبلی میره، پایین منو را باز می‌کنه و داخلش حرکت می‌کنه."],
    promptBullets: ["role=menubar with roving tabindex; the open menu is a portaled role=menu using aria-activedescendant; checkbox items are menuitemcheckbox with aria-checked."],
  },
  {
    slug: "navigation-menu", name: "منوی ناوبری سایت", cat: "nav", file: ui("navigation-menu"), deps: ["lucide-react"],
    desc: "لینک‌های سربرگ سایت که بعضی‌هاشون پنل پهنی از لینک‌ها با توضیح و یک کارت ویژه باز می‌کنن. هاور با کمی تأخیر تا پنل نپره، و وقتی پنلی بازه رفتن روی منوی دیگه پنل را سُر میده.",
    usage: `import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Code2, Palette } from "lucide-react"

<NavigationMenu
  items={[
    { label: "محصولات", links: [
      { title: "کامپوننت‌ها", href: "/components", description: "بیش از ۱۰۰ کامپوننت راست‌چین", icon: Code2 },
      { title: "تم‌ها", href: "/themes", description: "سیستم‌های طراحی آماده", icon: Palette },
    ], featured: { title: "نسخه‌ی ۳", description: "قالب‌ها و نمودارهای تازه", href: "/blog/v3", cta: "ببینید" } },
    { label: "قیمت", href: "/pricing" },
  ]}
/>`,
    props: [
      { name: "items", type: "NavMenuEntry[]", desc: "لینک ساده با href یا منو با links، featured و columns." },
      { name: "openDelay / closeDelay", type: "number", default: "120 / 220", desc: "تأخیر هاور به میلی‌ثانیه." },
    ],
    notes: ["الگوی disclosure است نه menu، پس Tab بین لینک‌ها حرکت می‌کنه که برای ناوبری سایت درست‌تره."],
    promptBullets: ["Triggers are buttons with aria-expanded/aria-controls; the panel slides with inset-inline-start to sit under the open trigger; Escape returns focus to it."],
  },
];
