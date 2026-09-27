"use client";

import * as React from "react";
import {
  Copy,
  Home,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Settings,
  ShoppingBag,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { Select } from "@/registry/ui/select";
import { Combobox } from "@/registry/ui/combobox";
import { OtpField } from "@/registry/ui/otp-field";
import { NumberField } from "@/registry/ui/number-field";
import { Checkbox, CheckboxGroup } from "@/registry/ui/checkbox";
import { RadioGroup } from "@/registry/ui/radio-group";
import { Switch } from "@/registry/ui/switch";
import { Slider } from "@/registry/ui/slider";
import { RangeSlider } from "@/registry/ui/range-slider";
import { Rating } from "@/registry/ui/rating";
import { FileUpload } from "@/registry/ui/file-upload";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { Command, CommandDialog } from "@/registry/ui/command";
import { Dialog } from "@/registry/ui/dialog";
import { AlertDialog } from "@/registry/ui/alert-dialog";
import { DropdownMenu } from "@/registry/ui/dropdown-menu";
import { Tooltip } from "@/registry/ui/tooltip";
import { Sheet } from "@/registry/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { Pagination } from "@/registry/ui/pagination";
import { Breadcrumb } from "@/registry/ui/breadcrumb";
import { Stepper } from "@/registry/ui/stepper";
import { Sidebar, SidebarGroup, SidebarItem } from "@/registry/ui/sidebar";
import { ToastCard, ToastProvider, useToast } from "@/registry/ui/toast";
import { Alert } from "@/registry/ui/alert";
import { Progress } from "@/registry/ui/progress";
import { Skeleton, SkeletonRow } from "@/registry/ui/skeleton";
import { EmptyState } from "@/registry/ui/empty-state";
import { Badge } from "@/registry/ui/badge";
import { Avatar, AvatarGroup } from "@/registry/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table";
import { Stat } from "@/registry/ui/stat";
import { Price } from "@/registry/ui/price";
import { Timeline } from "@/registry/ui/timeline";
import { Accordion } from "@/registry/ui/accordion";
import { Kbd } from "@/registry/ui/kbd";
import { PromptInput } from "@/registry/ui/prompt-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card";
import { faNumber, formatToman } from "@/lib/utils";
import { DataTable, type Column } from "@/registry/ui/data-table";
import {
  BarChart,
  LineChart,
  Sparkline,
  jalaliDayLabels,
  jalaliWeekLabels,
} from "@/registry/ui/chart";
import { Popover } from "@/registry/ui/popover";
import { ContextMenu } from "@/registry/ui/context-menu";
import { HoverCard } from "@/registry/ui/hover-card";
import { Carousel } from "@/registry/ui/carousel";
import { ComboboxAsync } from "@/registry/ui/combobox-async";
import { PasswordInput } from "@/registry/ui/password-input";
import { IbanInput } from "@/registry/ui/iban-input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { NationalIdInput } from "@/registry/ui/national-id-input";
import { CardNumberInput } from "@/registry/ui/card-number-input";
import { PlateInput } from "@/registry/ui/plate-input";
import { DateRangePicker, RangeCalendar, type DateRange } from "@/registry/ui/date-range-picker";
import { TimePicker } from "@/registry/ui/time-picker";
import { AmountInput } from "@/registry/ui/amount-input";
import { NotificationInbox } from "@/registry/ui/notification-inbox";
import { FormField, FormErrors, rules, useForm } from "@/registry/ui/form";
import { Slider as SliderUi } from "@/registry/ui/slider";
import { formatJalali } from "@/lib/jalali";
import { SearchInput } from "@/registry/ui/search-input";
import { TagsInput } from "@/registry/ui/tags-input";
import { MultiSelect } from "@/registry/ui/multi-select";
import { Toggle, ToggleGroup } from "@/registry/ui/toggle";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Separator } from "@/registry/ui/separator";
import { LoadingOverlay, Spinner } from "@/registry/ui/spinner";
import { Collapsible } from "@/registry/ui/collapsible";
import { ScrollArea } from "@/registry/ui/scroll-area";
import { Countdown } from "@/registry/ui/countdown";
import { educationCardDemos, educationDemos } from "./education";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, LayoutGrid, List, Underline } from "lucide-react";

type Order = {
  id: number;
  customer: string;
  amount: number;
  status: string;
  date: Date;
  [k: string]: unknown;
};
const tableRows: Order[] = [
  "مریم احمدی",
  "علی رضایی",
  "نگار کریمی",
  "رضا موسوی",
  "سارا محمدی",
  "امیر حسینی",
  "مینا صادقی",
  "حسین نوری",
  "الهام رحیمی",
  "کامران زارع",
].map((customer, i) => ({
  id: 14052 - i,
  customer,
  amount: (i * 937 + 350) * 1000 + 240_000,
  status: ["پرداخت‌شده", "در انتظار", "ارسال‌شده"][i % 3],
  date: new Date(Date.now() - i * 864e5),
}));
const tableCols: Column<Order>[] = [
  {
    key: "id",
    header: "شماره",
    sortable: true,
    cell: (o) => (
      <span className="font-mono text-xs text-muted-foreground" dir="ltr">
        #{o.id}
      </span>
    ),
  },
  { key: "customer", header: "مشتری", sortable: true },
  {
    key: "date",
    header: "تاریخ",
    sortable: true,
    cell: (o) => formatJalali(o.date),
  },
  {
    key: "amount",
    header: "مبلغ",
    sortable: true,
    numeric: true,
    cell: (o) => formatToman(o.amount),
  },
  {
    key: "status",
    header: "وضعیت",
    cell: (o) => (
      <Badge
        variant={
          o.status === "پرداخت‌شده"
            ? "success"
            : o.status === "در انتظار"
              ? "warning"
              : "brand"
        }
      >
        {o.status}
      </Badge>
    ),
  },
];
function DataTableDemo({ compact }: { compact?: boolean }) {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="w-full space-y-2">
      <DataTable
        rows={tableRows}
        columns={
          compact ? tableCols.filter((c) => c.key !== "date") : tableCols
        }
        rowKey={(o) => String(o.id)}
        searchKeys={["customer", "id"]}
        pageSize={compact ? 4 : 5}
        loading={loading}
        toolbar={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1200);
            }}
          >
            بارگذاری دوباره
          </Button>
        }
      />
    </div>
  );
}
const CITIES = [
  "تهران",
  "اصفهان",
  "شیراز",
  "مشهد",
  "تبریز",
  "اهواز",
  "کرج",
  "قم",
  "کرمانشاه",
  "رشت",
  "ارومیه",
  "زاهدان",
  "همدان",
  "یزد",
  "اردبیل",
  "بندرعباس",
  "اراک",
  "کرمان",
  "قزوین",
  "ساری",
];
const loadCities = (q: string, signal: AbortSignal) =>
  new Promise<{ value: string; label: string; hint?: string }[]>(
    (resolve, reject) => {
      const t = setTimeout(
        () =>
          resolve(
            CITIES.filter((c) => c.includes(q)).map((c) => ({
              value: c,
              label: c,
              hint: "ایران",
            })),
          ),
        500,
      );
      signal.addEventListener("abort", () => {
        clearTimeout(t);
        reject(new DOMException("aborted", "AbortError"));
      });
    },
  );
const NOW = Date.now();
function InboxDemo() {
  const [items, setItems] = React.useState([
    {
      id: "1",
      title: "سفارش #۱۴۰۵۳ ثبت شد",
      description: "مریم احمدی · ۲٬۸۹۰٬۰۰۰ تومان",
      date: new Date(NOW - 5 * 60e3),
      read: false,
      icon: ShoppingBag,
    },
    {
      id: "2",
      title: "پرداخت تأیید شد",
      description: "درگاه ملت",
      date: new Date(NOW - 3 * 3600e3),
      read: false,
    },
    {
      id: "3",
      title: "موجودی «هدفون X۲» کم است",
      description: "۳ عدد باقی مانده",
      date: new Date(NOW - 26 * 3600e3),
      read: true,
      icon: Package,
    },
    {
      id: "4",
      title: "به‌روزرسانی ۲٫۴ منتشر شد",
      date: new Date(NOW - 5 * 864e5),
      read: true,
    },
  ]);
  return (
    <NotificationInbox
      items={items}
      onRead={(id) =>
        setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))
      }
      onReadAll={() => setItems((l) => l.map((n) => ({ ...n, read: true })))}
    />
  );
}
function FormDemo() {
  const form = useForm({
    initial: { name: "", phone: "", nationalId: "" },
    schema: {
      name: [rules.required()],
      phone: [rules.required(), rules.mobile()],
      nationalId: [rules.nationalId()],
    },
    onSubmit: () => new Promise((r) => setTimeout(r, 600)),
  });
  return (
    <form
      onSubmit={form.handleSubmit}
      className="w-full max-w-xs space-y-3"
      noValidate
    >
      <FormField
        label="نام"
        htmlFor="name"
        error={form.field("name").error}
        required
      >
        <Input {...form.field("name")} placeholder="مثلاً: سارا" />
      </FormField>
      <FormField
        label="موبایل"
        htmlFor="phone"
        error={form.field("phone").error}
        required
      >
        <Input
          {...form.field("phone")}
          dir="ltr"
          inputMode="tel"
          placeholder="0912…"
        />
      </FormField>
      <FormField
        label="کد ملی"
        htmlFor="nationalId"
        error={form.field("nationalId").error}
        hint="اختیاری"
      >
        <Input {...form.field("nationalId")} dir="ltr" inputMode="numeric" />
      </FormField>
      <FormErrors
        errors={form.errors}
        labels={{ name: "نام", phone: "موبایل", nationalId: "کد ملی" }}
      />
      <Button type="submit" className="w-full" disabled={form.submitting}>
        {form.submitting ? "در حال ثبت…" : "ثبت"}
      </Button>
    </form>
  );
}
const week = jalaliWeekLabels();
const sales = [44, 62, 54, 78, 70, 96, 64].map((v) => v * 180_000);
const ProductSlide = ({ i }: { i: number }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex h-24 items-center justify-center rounded-lg bg-secondary text-3xl">
      🎧
    </div>
    <p className="mt-3 text-sm font-medium">محصول {i}</p>
    <p className="text-xs text-muted-foreground">
      {formatToman(890_000 + i * 100_000)}
    </p>
  </div>
);

function PaginationCardDemo() {
  const [p, setP] = React.useState(2);
  return (
    <Pagination page={p} total={12} onChange={setP} siblings={0} size="sm" />
  );
}

/* ---- small stateful wrappers ---- */

function PaginationDemo() {
  const [p, setP] = React.useState(2);
  return <Pagination page={p} total={12} onChange={setP} />;
}
function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        ویرایش آدرس
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="ویرایش آدرس"
        description="آدرس پیش‌فرض ارسال را تغییر دهید."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>ذخیره</Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              انصراف
            </Button>
          </>
        }
      >
        <Input defaultValue="تهران، خیابان ولیعصر، پلاک ۱۲۰" />
      </Dialog>
    </>
  );
}
function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        حذف محصول
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="این محصول حذف شود؟"
        description="این کار قابل بازگشت نیست. «هدفون بی‌سیم» از فروشگاه برداشته می‌شود."
        confirmText="حذف"
        destructive
        onConfirm={() => new Promise((r) => setTimeout(r, 800))}
      />
    </>
  );
}
function SheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        باز کردن فیلترها
      </Button>
      <Sheet open={open} onOpenChange={setOpen} title="فیلترها">
        <div className="space-y-4">
          <Slider
            label="حداکثر قیمت"
            min={100_000}
            max={10_000_000}
            step={100_000}
            defaultValue={6_500_000}
            format={formatToman}
          />
          <CheckboxGroup
            defaultValue={["ship"]}
            options={[
              { value: "ship", label: "ارسال رایگان" },
              { value: "stock", label: "فقط موجود" },
            ]}
          />
          <Button className="w-full" onClick={() => setOpen(false)}>
            اعمال
          </Button>
        </div>
      </Sheet>
    </>
  );
}
function CommandDemo() {
  const [open, setOpen] = React.useState(false);
  const items = [
    {
      id: "new",
      label: "افزودن محصول",
      group: "عمل‌ها",
      icon: Package,
      shortcut: "N",
    },
    {
      id: "orders",
      label: "سفارش‌های امروز",
      group: "رفتن به",
      icon: ShoppingBag,
    },
    {
      id: "settings",
      label: "تنظیمات فروشگاه",
      group: "رفتن به",
      icon: Settings,
    },
  ];
  return (
    <div className="w-full max-w-sm space-y-3">
      <Command items={items} />
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          باز کردن با
        </Button>
        <Kbd keys={["⌘", "K"]} />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen} items={items} hotkey={false} />
    </div>
  );
}
function ToastDemoInner() {
  const { toast } = useToast();
  return (
    <div className="flex flex-col items-center gap-3">
      <ToastCard
        toast={{
          title: "تغییرات ذخیره شد",
          description: "۲ ثانیه پیش",
          variant: "success",
          action: { label: "واگرد", onClick: () => {} },
        }}
        className="w-full max-w-[300px]"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: "سفارش ثبت شد",
              description: "شماره‌ی #۱۴۰۵۳",
              variant: "success",
            })
          }
        >
          نمایش موفق
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: "پرداخت ناموفق",
              description: "موجودی کافی نیست.",
              variant: "error",
            })
          }
        >
          نمایش خطا
        </Button>
      </div>
    </div>
  );
}
function ToastDemo() {
  return (
    <ToastProvider>
      <ToastDemoInner />
    </ToastProvider>
  );
}
function TabsDemo() {
  return (
    <Tabs defaultValue="preview">
      <TabsList aria-label="نمایش">
        <TabsTrigger value="preview">پیش‌نمایش</TabsTrigger>
        <TabsTrigger value="code">کد</TabsTrigger>
        <TabsTrigger value="prompt">پرامپت</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="text-sm text-muted-foreground">
        این‌جا پیش‌نمایش است.
      </TabsContent>
      <TabsContent value="code" className="text-sm text-muted-foreground">
        این‌جا کد است.
      </TabsContent>
      <TabsContent value="prompt" className="text-sm text-muted-foreground">
        این‌جا پرامپت است.
      </TabsContent>
    </Tabs>
  );
}

const faces = [
  { name: "سارا", src: "/avatars/sara.jpg" },
  { name: "علی", src: "/avatars/ali.jpg" },
  { name: "نگار", src: "/avatars/negar.jpg" },
  { name: "رضا", src: "/avatars/reza.jpg" },
  { name: "مینا", src: "/avatars/mina.jpg" },
  { name: "امیر" },
];

const orders = [
  {
    id: "۱۴۰۵۲",
    name: "مریم احمدی",
    amount: 2_890_000,
    status: "پرداخت‌شده",
    tone: "success" as const,
  },
  {
    id: "۱۴۰۵۱",
    name: "علی رضایی",
    amount: 640_000,
    status: "در انتظار",
    tone: "warning" as const,
  },
  {
    id: "۱۴۰۵۰",
    name: "نگار کریمی",
    amount: 1_215_000,
    status: "ارسال‌شده",
    tone: "brand" as const,
  },
];

const sampleRange: DateRange = (() => {
  const from = new Date();
  from.setDate(from.getDate() - 9);
  const to = new Date();
  to.setDate(to.getDate() + 4);
  return { from, to };
})();

function RangeDemo() {
  const [range, setRange] = React.useState<DateRange>(sampleRange);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-xs">
        <DateRangePicker value={range} onChange={setRange} />
      </div>
      <RangeCalendar months={2} value={range} onChange={setRange} />
    </div>
  );
}

const SKILLS = [
  { value: "react", label: "ری‌اکت" },
  { value: "next", label: "نکست" },
  { value: "ts", label: "تایپ‌اسکریپت" },
  { value: "tailwind", label: "تیلویند" },
  { value: "node", label: "نود" },
  { value: "figma", label: "فیگما" },
  { value: "flutter", label: "فلاتر", disabled: true },
];

function SearchDemo({ compact }: { compact?: boolean }) {
  const [loading, setLoading] = React.useState(false);
  const [hits, setHits] = React.useState<string | null>(null);
  return (
    <div className={compact ? "w-full space-y-2" : "w-full max-w-xs space-y-2"}>
      <SearchInput
        placeholder="نام محصول…"
        loading={loading}
        shortcut={compact ? undefined : "⌘K"}
        onSearch={(q) => {
          if (!q) return setHits(null);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setHits(`${faNumber(q.length * 7)} نتیجه برای «${q}»`);
          }, 600);
        }}
      />
      <p className="h-5 text-xs text-muted-foreground" aria-live="polite">{hits}</p>
    </div>
  );
}

function SegmentedDemo() {
  const [range, setRange] = React.useState("week");
  const totals: Record<string, number> = { day: 4_800_000, week: 31_200_000, month: 126_000_000 };
  return (
    <div className="w-full max-w-xs space-y-3">
      <SegmentedControl
        aria-label="بازه"
        fullWidth
        value={range}
        onChange={setRange}
        options={[{ value: "day", label: "روزانه" }, { value: "week", label: "هفتگی" }, { value: "month", label: "ماهانه" }]}
      />
      <div className="text-center">
        <p className="text-xs text-muted-foreground">فروش</p>
        <p className="text-lg font-semibold">{formatToman(totals[range])}</p>
      </div>
    </div>
  );
}

function SpinnerDemo() {
  const [loading, setLoading] = React.useState(true);
  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex items-center justify-around">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" className="text-brand" />
      </div>
      <div className="relative rounded-lg border border-border p-3 text-sm">
        <LoadingOverlay loading={loading} label="در حال دریافت…" />
        <p className="font-medium">سفارش ۱۴۰۵۲</p>
        <p className="text-xs text-muted-foreground">۳ قلم، ارسال با پست پیشتاز</p>
      </div>
      <Button size="sm" variant="outline" className="w-full" onClick={() => setLoading((v) => !v)}>
        {loading ? "توقف" : "بارگذاری دوباره"}
      </Button>
    </div>
  );
}

export const componentDemos: Record<string, React.ReactNode> = {
  button: (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button>ثبت سفارش</Button>
        <Button variant="brand">ارتقا به پرو</Button>
        <Button variant="secondary">پیش‌نمایش</Button>
        <Button variant="outline">انصراف</Button>
        <Button variant="ghost">بیشتر</Button>
        <Button variant="destructive">حذف</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm">کوچک</Button>
        <Button>متوسط</Button>
        <Button size="lg">بزرگ</Button>
        <Button size="icon" aria-label="افزودن">
          <Plus />
        </Button>
        <Button disabled>غیرفعال</Button>
      </div>
    </div>
  ),
  input: (
    <div className="w-full max-w-xs space-y-4">
      <Field label="نام و نام خانوادگی" htmlFor="d-name">
        <Input id="d-name" placeholder="مثلاً: سارا محمدی" />
      </Field>
      <Field
        label="شماره‌ی موبایل"
        htmlFor="d-phone"
        hint="کد تأیید به این شماره پیامک می‌شود"
      >
        <Input
          id="d-phone"
          dir="ltr"
          inputMode="tel"
          startAddon="+98"
          placeholder="912 345 6789"
        />
      </Field>
      <Field label="مبلغ" htmlFor="d-amount">
        <Input
          id="d-amount"
          defaultValue="۱٬۸۹۰٬۰۰۰"
          endAddon="تومان"
          error="حداقل مبلغ ۲ میلیون تومان است"
        />
      </Field>
    </div>
  ),
  textarea: (
    <div className="w-full max-w-xs">
      <Textarea
        defaultValue="سلام، سفارشم هنوز نرسیده."
        maxLength={120}
        showCount
        autoResize
      />
    </div>
  ),
  select: (
    <div className="w-full max-w-xs">
      <Select
        defaultValue="thr"
        options={[
          { value: "thr", label: "تهران" },
          { value: "mhd", label: "مشهد" },
          { value: "shz", label: "شیراز" },
          { value: "tbz", label: "تبریز" },
        ]}
      />
    </div>
  ),
  combobox: (
    <div className="w-full max-w-xs">
      <Combobox
        options={[
          "اصفهان",
          "اهواز",
          "اراک",
          "اردبیل",
          "تهران",
          "تبریز",
          "شیراز",
          "مشهد",
        ]}
        placeholder="نام شهر…"
      />
    </div>
  ),
  "otp-field": <OtpField />,
  "number-field": (
    <NumberField defaultValue={2} min={1} max={9} aria-label="تعداد" />
  ),
  "checkbox-group": (
    <div className="space-y-4">
      <CheckboxGroup
        defaultValue={["ship", "gift"]}
        options={[
          { value: "ship", label: "ارسال رایگان" },
          {
            value: "gift",
            label: "بسته‌بندی هدیه",
            description: "۲۰ هزار تومان",
          },
          { value: "ins", label: "بیمه‌ی مرسوله" },
        ]}
      />
      <Checkbox checked="indeterminate" label="انتخاب همه" />
    </div>
  ),
  "radio-group": (
    <div className="w-full max-w-xs">
      <RadioGroup
        variant="cards"
        defaultValue="post"
        options={[
          {
            value: "post",
            label: "پست پیشتاز",
            description: "۳ تا ۵ روز کاری",
          },
          {
            value: "bike",
            label: "پیک موتوری",
            description: "امروز، فقط تهران",
          },
        ]}
      />
    </div>
  ),
  switch: (
    <ul className="w-full max-w-xs divide-y divide-border">
      {[
        ["اعلان ایمیلی", true],
        ["احراز هویت دومرحله‌ای", true],
        ["حالت آزمایشی", false],
      ].map(([l, on]) => (
        <li
          key={String(l)}
          className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0"
        >
          <span>{l}</span>
          <Switch defaultChecked={Boolean(on)} aria-label={String(l)} />
        </li>
      ))}
    </ul>
  ),
  slider: (
    <div className="w-full max-w-xs">
      <Slider
        label="حداکثر قیمت"
        min={100_000}
        max={10_000_000}
        step={100_000}
        defaultValue={6_500_000}
        format={formatToman}
      />
    </div>
  ),
  "range-slider": (
    <div className="w-full max-w-xs">
      <RangeSlider
        label="محدوده قیمت"
        min={0}
        max={150_000_000}
        step={1_000_000}
        defaultValue={[20_000_000, 50_000_000]}
        format={formatToman}
        fullRangeLabel="همه قیمت‌ها"
      />
    </div>
  ),
  rating: <Rating defaultValue={4} showValue />,
  "file-upload": (
    <div className="w-full max-w-xs">
      <FileUpload
        accept=".pdf,.png"
        maxSize={5 * 1024 * 1024}
        hint="PDF یا PNG، تا ۵ مگابایت"
      />
    </div>
  ),
  calendar: <Calendar defaultValue={new Date()} />,
  "date-picker": (
    <div className="w-full max-w-xs">
      <DatePicker placeholder="تاریخ ارسال" />
    </div>
  ),
  command: <CommandDemo />,
  dialog: <DialogDemo />,
  "alert-dialog": <AlertDialogDemo />,
  "dropdown-menu": (
    <DropdownMenu
      trigger={
        <Button variant="outline" size="icon" aria-label="بیشتر">
          <MoreHorizontal />
        </Button>
      }
      items={[
        { label: "ویرایش", icon: Pencil, shortcut: "E" },
        { label: "کپی لینک", icon: Copy, shortcut: "⌘C" },
        { type: "separator" },
        { label: "حذف", icon: Trash2, danger: true },
      ]}
    />
  ),
  tooltip: (
    <Tooltip content="افزودن به علاقه‌مندی‌ها">
      <Button size="icon" variant="outline" aria-label="علاقه‌مندی">
        <Star />
      </Button>
    </Tooltip>
  ),
  sheet: <SheetDemo />,
  tabs: <TabsDemo />,
  pagination: <PaginationDemo />,
  breadcrumb: (
    <Breadcrumb
      items={[
        { label: "خانه", href: "#" },
        { label: "فروشگاه", href: "#" },
        { label: "هدفون بی‌سیم" },
      ]}
    />
  ),
  stepper: (
    <div className="w-full max-w-xs">
      <Stepper
        current={1}
        steps={[{ label: "سبد" }, { label: "آدرس" }, { label: "پرداخت" }]}
      />
    </div>
  ),
  sidebar: (
    <Sidebar
      className="w-52"
      header={<span className="text-sm font-bold">فروشگاه من</span>}
    >
      <SidebarItem icon={Home} label="خانه" />
      <SidebarGroup title="فروش" collapsible>
        <SidebarItem icon={ShoppingBag} label="سفارش‌ها" badge={12} active />
        <SidebarItem icon={Package} label="محصولات" />
        <SidebarItem icon={Users} label="مشتریان" />
      </SidebarGroup>
    </Sidebar>
  ),
  toast: <ToastDemo />,
  alert: (
    <div className="w-full max-w-sm space-y-3">
      <Alert variant="success" title="پرداخت با موفقیت انجام شد">
        رسید به شماره‌ی ۰۹۱۲۳۴۵۶۷۸۹ پیامک شد.
      </Alert>
      <Alert variant="warning" title="موجودی انبار رو به اتمام است">
        از «هدفون بی‌سیم» فقط ۳ عدد باقی مانده.
      </Alert>
      <Alert variant="destructive" title="پرداخت ناموفق">
        موجودی کارت کافی نیست.
      </Alert>
    </div>
  ),
  progress: (
    <div className="w-full max-w-xs">
      <Progress value={72} label="آپلود فایل‌ها" showValue />
    </div>
  ),
  skeleton: (
    <div className="w-full max-w-xs space-y-4">
      <Skeleton shimmer className="h-24 w-full rounded-lg" />
      <SkeletonRow />
    </div>
  ),
  "empty-state": (
    <EmptyState
      title="هنوز سفارشی ندارید"
      description="اولین محصول را اضافه کنید تا این‌جا پر شود."
      action={
        <Button size="sm" variant="outline">
          افزودن محصول
        </Button>
      }
      className="w-full max-w-xs"
    />
  ),
  badge: (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge>پیش‌فرض</Badge>
      <Badge variant="secondary">ثانویه</Badge>
      <Badge variant="outline">ساده</Badge>
      <Badge variant="brand">جدید</Badge>
      <Badge variant="success">فعال</Badge>
      <Badge variant="warning">در انتظار</Badge>
      <Badge variant="destructive">لغو شده</Badge>
    </div>
  ),
  avatar: (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar name="سارا محمدی" src="/avatars/sara.jpg" size="sm" />
        <Avatar name="علی رضایی" src="/avatars/ali.jpg" />
        <Avatar name="نگار کریمی" src="/avatars/negar.jpg" size="lg" />
        <Avatar name="امیر" />
      </div>
      <AvatarGroup people={faces} />
    </div>
  ),
  table: (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>شماره</TableHead>
          <TableHead>مشتری</TableHead>
          <TableHead>مبلغ</TableHead>
          <TableHead>وضعیت</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell className="  text-xs text-muted-foreground" dir="ltr">
              #{o.id}
            </TableCell>
            <TableCell>{o.name}</TableCell>
            <TableCell numeric>{formatToman(o.amount)}</TableCell>
            <TableCell>
              <Badge variant={o.tone}>{o.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  stat: (
    <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
      <Stat
        label="درآمد این ماه"
        value={faNumber(216_000_000)}
        unit="تومان"
        delta={18}
      />
      <Stat label="مشتریان جدید" value="۳۸" delta={-4} />
    </div>
  ),
  price: (
    <div className="flex flex-wrap items-end justify-center gap-8">
      <Price amount={12_450_000} original={14_900_000} />
      <Price amount={290_000} unit="تومان / ماه" size="sm" />
    </div>
  ),
  timeline: (
    <Timeline
      items={[
        { date: new Date(), title: "سفارش تحویل شد" },
        {
          date: new Date(Date.now() - 2 * 864e5),
          title: "بسته ارسال شد",
          description: "پست پیشتاز، کد رهگیری پیامک شد",
        },
        { date: new Date(Date.now() - 3 * 864e5), title: "پرداخت تأیید شد" },
      ]}
    />
  ),
  accordion: (
    <div className="w-full max-w-sm">
      <Accordion
        defaultOpen={["free"]}
        items={[
          {
            id: "free",
            title: "آیا واقعاً رایگان است؟",
            content: "بله. بدون پلن پولی و بدون قفل روی هیچ کامپوننتی.",
          },
          {
            id: "next",
            title: "با Next.js کار می‌کند؟",
            content: "بله، و با هر پروژه‌ی React که Tailwind دارد.",
          },
        ]}
      />
    </div>
  ),
  kbd: (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">ذخیره</span>
      <Kbd keys={["⌘", "S"]} />
      <span className="text-muted-foreground">جست‌وجو</span>
      <Kbd keys={["⌘", "K"]} />
    </div>
  ),
  "prompt-input": (
    <div className="w-full max-w-md">
      <PromptInput placeholder="یک فرم ثبت‌نام فارسی بساز…" />
    </div>
  ),
  "data-table": <DataTableDemo />,
  chart: (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          فروش هفتگی (میله‌ای)
        </p>
        <BarChart
          data={week.map((label, i) => ({ label, value: sales[i] }))}
          highlight={6}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          بازدید ۱۰ روز اخیر (خطی)
        </p>
        <LineChart
          data={jalaliDayLabels(10).map((label, i) => ({
            label,
            value: [320, 410, 380, 520, 610, 590, 700, 660, 740, 820][i],
          }))}
        />
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">اسپارک‌لاین:</span>
        <Sparkline data={[3, 5, 4, 8, 7, 9, 11]} />
        <Sparkline data={[9, 8, 8, 6, 5, 4, 3]} positive={false} />
      </div>
    </div>
  ),
  popover: (
    <Popover trigger={<Button variant="outline">فیلتر قیمت</Button>}>
      <div className="space-y-3">
        <p className="font-medium">بازه‌ی قیمت</p>
        <SliderUi
          label="حداکثر"
          min={100_000}
          max={10_000_000}
          step={100_000}
          defaultValue={6_500_000}
          format={formatToman}
        />
        <Button size="sm" className="w-full">
          اعمال
        </Button>
      </div>
    </Popover>
  ),
  "context-menu": (
    <ContextMenu
      items={[
        { label: "ویرایش", icon: Pencil, shortcut: "E" },
        { label: "کپی لینک", icon: Copy },
        { type: "separator" },
        { label: "حذف", icon: Trash2, danger: true },
      ]}
    >
      <div className="flex h-32 w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-input text-sm text-muted-foreground">
        این‌جا راست‌کلیک کنید
      </div>
    </ContextMenu>
  ),
  "hover-card": (
    <HoverCard
      trigger={
        <a href="#" className="text-sm underline underline-offset-4">
          @negar
        </a>
      }
    >
      <div className="flex items-start gap-3">
        <Avatar name="نگار کریمی" src="/avatars/negar.jpg" />
        <div>
          <p className="text-sm font-semibold">نگار کریمی</p>
          <p className="text-xs text-muted-foreground">
            طراح رابط کاربری · تهران
          </p>
          <p className="mt-2 text-xs leading-6">
            درباره‌ی تایپوگرافی فارسی و سیستم‌های طراحی می‌نویسد.
          </p>
        </div>
      </div>
    </HoverCard>
  ),
  carousel: (
    <div className="w-full">
      <Carousel slideWidth={0.5}>
        {[1, 2, 3, 4, 5].map((i) => (
          <ProductSlide key={i} i={i} />
        ))}
      </Carousel>
    </div>
  ),
  "combobox-async": (
    <div className="w-full max-w-xs">
      <ComboboxAsync
        loadOptions={loadCities}
        placeholder="نام شهر را بنویسید…"
      />
    </div>
  ),
  "password-input": (
    <div className="w-full max-w-xs">
      <PasswordInput strength placeholder="حداقل ۸ کاراکتر" />
    </div>
  ),
  "iban-input": (
    <div className="w-full max-w-sm">
      <IbanInput />
    </div>
  ),
  "phone-input": (
    <div className="w-full max-w-xs">
      <PhoneInput />
    </div>
  ),
  "national-id-input": (
    <div className="w-full max-w-xs">
      <NationalIdInput id="d-nid" />
    </div>
  ),
  "card-number-input": (
    <div className="w-full max-w-xs">
      <CardNumberInput id="d-card" />
    </div>
  ),
  "plate-input": <PlateInput defaultValue={{ left: "12", letter: "ب", middle: "345", region: "11" }} />,
  "date-range-picker": <RangeDemo />,
  "time-picker": (
    <div className="w-full max-w-[200px]">
      <TimePicker defaultValue="14:30" step={15} min="08:00" max="20:00" />
    </div>
  ),
  "amount-input": (
    <div className="w-full max-w-xs">
      <AmountInput id="d-amount" defaultValue={1_250_000} quick={[100_000, 500_000, 1_000_000, 5_000_000]} />
    </div>
  ),
  "notification-inbox": <InboxDemo />,
  form: <FormDemo />,
  card: (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>هدف ماهانه</CardTitle>
        <CardDescription>۷۲٪ از هدف ۳۰۰ میلیون تومانی</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={72} />
      </CardContent>
    </Card>
  ),
  "search-input": <SearchDemo />,
  "tags-input": (
    <div className="w-full max-w-xs">
      <TagsInput defaultValue={["ری‌اکت", "تیلویند"]} max={5} />
    </div>
  ),
  "multi-select": (
    <div className="w-full max-w-xs">
      <MultiSelect options={SKILLS} defaultValue={["react", "ts"]} placeholder="مهارت‌ها…" max={4} aria-label="مهارت‌ها" />
    </div>
  ),
  toggle: (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <ToggleGroup
        type="multiple"
        variant="outline"
        defaultValue={["bold"]}
        aria-label="قالب متن"
        items={[
          { value: "bold", label: <Bold />, "aria-label": "پررنگ" },
          { value: "italic", label: <Italic />, "aria-label": "مورب" },
          { value: "underline", label: <Underline />, "aria-label": "زیرخط" },
        ]}
      />
      <ToggleGroup
        type="single"
        defaultValue="all"
        aria-label="فیلتر"
        items={[{ value: "all", label: "همه" }, { value: "instock", label: "موجود" }, { value: "sale", label: "تخفیف‌دار" }]}
      />
      <div className="flex items-center gap-2">
        <Toggle size="sm" defaultPressed aria-label="نمای شبکه‌ای"><LayoutGrid /></Toggle>
        <Toggle size="sm" aria-label="نمای فهرستی"><List /></Toggle>
      </div>
    </div>
  ),
  "segmented-control": <SegmentedDemo />,
  separator: (
    <div className="w-full max-w-xs space-y-4 text-sm">
      <Button variant="outline" className="w-full">ورود با گوگل</Button>
      <Separator label="یا" />
      <Button className="w-full">ورود با شماره‌ی موبایل</Button>
      <Separator />
      <div className="flex h-5 items-center justify-center gap-3 text-muted-foreground">
        <span>ویرایش</span>
        <Separator orientation="vertical" />
        <span>کپی</span>
        <Separator orientation="vertical" />
        <span className="text-destructive">حذف</span>
      </div>
    </div>
  ),
  spinner: <SpinnerDemo />,
  collapsible: (
    <div className="w-full max-w-xs rounded-lg border border-border p-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">هزینه‌ی ارسال</span>
        <span>{formatToman(45_000)}</span>
      </div>
      <Collapsible trigger="نمایش جزئیات" openLabel="پنهان کردن" className="mt-2">
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li>پست پیشتاز، تحویل ۲ تا ۳ روز کاری</li>
          <li>بسته‌بندی استاندارد رایگان</li>
          <li>برای خرید بالای {formatToman(2_000_000)} رایگان می‌شود</li>
        </ul>
      </Collapsible>
    </div>
  ),
  "scroll-area": (
    <ScrollArea className="h-48 w-full max-w-xs rounded-lg border border-border px-3">
      {[
        "هدفون بی‌سیم پرو",
        "کیبورد مکانیکی",
        "ماوس ارگونومیک",
        "مانیتور ۲۷ اینچ",
        "پایه‌ی لپ‌تاپ",
        "هاب USB-C",
        "وب‌کم Full HD",
        "اسپیکر رومیزی",
        "کابل HDMI",
        "شارژر ۶۵ وات",
      ].map((item) => (
        <p key={item} className="border-b border-border py-2.5 text-sm last:border-0">
          {item}
        </p>
      ))}
    </ScrollArea>
  ),
  countdown: (
    <Countdown
      target={new Date(Date.now() + 2 * 864e5 + 5 * 36e5 + 23 * 60e3)}
      className="w-full max-w-sm"
      size="sm"
    />
  ),
  ...educationDemos,
};

/**
 * Narrow-card variants for the landing catalog (≈226px inner width).
 * Falls back to the full demo for everything not listed here.
 */
export const componentCardDemos: Record<string, React.ReactNode> = {
  ...componentDemos,
  "search-input": <SearchDemo compact />,
  toggle: (
    <div className="flex w-full flex-col items-center gap-3">
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="sm"
        defaultValue={["right"]}
        aria-label="چینش"
        items={[
          { value: "right", label: <AlignRight />, "aria-label": "راست‌چین" },
          { value: "center", label: <AlignCenter />, "aria-label": "وسط‌چین" },
          { value: "left", label: <AlignLeft />, "aria-label": "چپ‌چین" },
        ]}
      />
      <ToggleGroup
        type="single"
        size="sm"
        defaultValue="all"
        aria-label="فیلتر"
        items={[{ value: "all", label: "همه" }, { value: "instock", label: "موجود" }, { value: "sale", label: "تخفیف‌دار" }]}
      />
    </div>
  ),
  "segmented-control": (
    <div className="w-full">
      <SegmentedControl
        aria-label="بازه"
        fullWidth
        defaultValue="week"
        options={[{ value: "day", label: "روزانه" }, { value: "week", label: "هفتگی" }, { value: "month", label: "ماهانه" }]}
      />
    </div>
  ),
  spinner: (
    <div className="flex w-full items-center justify-around">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" className="text-brand" />
    </div>
  ),
  button: (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm">ثبت سفارش</Button>
        <Button size="sm" variant="secondary">
          پیش‌نمایش
        </Button>
        <Button size="sm" variant="outline">
          انصراف
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="ghost">
          بیشتر
        </Button>
        <Button size="sm" variant="destructive">
          حذف
        </Button>
        <Button size="icon" aria-label="افزودن" className="size-8">
          <Plus />
        </Button>
      </div>
    </div>
  ),
  input: (
    <div className="w-full space-y-3">
      <Field label="نام" htmlFor="c-name">
        <Input id="c-name" placeholder="مثلاً: سارا محمدی" />
      </Field>
      <Field label="موبایل" htmlFor="c-phone">
        <Input
          id="c-phone"
          dir="ltr"
          inputMode="tel"
          startAddon="+98"
          placeholder="912 345 6789"
        />
      </Field>
    </div>
  ),
  textarea: (
    <div className="w-full">
      <Textarea
        defaultValue="سلام، سفارشم هنوز نرسیده."
        maxLength={120}
        showCount
        rows={2}
      />
    </div>
  ),
  select: (
    <div className="w-full">
      <Select
        defaultValue="thr"
        options={[
          { value: "thr", label: "تهران" },
          { value: "mhd", label: "مشهد" },
          { value: "shz", label: "شیراز" },
        ]}
      />
    </div>
  ),
  combobox: (
    <div className="w-full">
      <Combobox
        options={["اصفهان", "اهواز", "اراک", "اردبیل", "تهران", "تبریز"]}
        placeholder="نام شهر…"
      />
    </div>
  ),
  "otp-field": <OtpField size="sm" defaultValue="482" />,
  "checkbox-group": (
    <CheckboxGroup
      defaultValue={["ship", "gift"]}
      options={[
        { value: "ship", label: "ارسال رایگان" },
        { value: "gift", label: "بسته‌بندی هدیه" },
        { value: "ins", label: "بیمه‌ی مرسوله" },
      ]}
    />
  ),
  "radio-group": (
    <div className="w-full">
      <RadioGroup
        variant="cards"
        defaultValue="post"
        options={[
          {
            value: "post",
            label: "پست پیشتاز",
            description: "۳ تا ۵ روز کاری",
          },
          {
            value: "bike",
            label: "پیک موتوری",
            description: "امروز، فقط تهران",
          },
        ]}
      />
    </div>
  ),
  slider: (
    <div className="w-full">
      <Slider
        label="حداکثر قیمت"
        min={100_000}
        max={10_000_000}
        step={100_000}
        defaultValue={6_500_000}
        format={formatToman}
      />
    </div>
  ),
  "range-slider": (
    <div className="w-full">
      <RangeSlider
        label="محدوده قیمت"
        min={0}
        max={150_000_000}
        step={1_000_000}
        defaultValue={[20_000_000, 50_000_000]}
        format={formatToman}
      />
    </div>
  ),
  "file-upload": (
    <div className="w-full">
      <FileUpload
        accept=".pdf,.png"
        maxSize={5 * 1024 * 1024}
        hint="PDF یا PNG، تا ۵ مگابایت"
      />
    </div>
  ),
  calendar: <Calendar defaultValue={new Date()} />,
  "date-picker": (
    <div className="w-full">
      <DatePicker placeholder="تاریخ ارسال" compact />
    </div>
  ),
  command: (
    <Command
      className="w-full"
      items={[
        { id: "new", label: "افزودن محصول", icon: Package, shortcut: "N" },
        { id: "orders", label: "سفارش‌های امروز", icon: ShoppingBag },
        { id: "settings", label: "تنظیمات", icon: Settings },
      ]}
    />
  ),
  pagination: <PaginationCardDemo />,
  stepper: (
    <div className="mx-auto w-full max-w-[360px]">
      <Stepper
        current={1}
        steps={[
          { label: "سبد خرید" },
          { label: "آدرس", description: "کجا بفرستیم؟" },
          { label: "پرداخت" },
          { label: "پایان" },
        ]}
      />
    </div>
  ),
  sidebar: (
    <Sidebar className="w-full">
      <SidebarItem icon={Home} label="خانه" />
      <SidebarItem icon={ShoppingBag} label="سفارش‌ها" badge={12} active />
      <SidebarItem icon={Package} label="محصولات" />
      <SidebarItem icon={Settings} label="تنظیمات" />
    </Sidebar>
  ),
  toast: (
    <ToastCard
      toast={{
        title: "تغییرات ذخیره شد",
        description: "۲ ثانیه پیش",
        variant: "success",
        action: { label: "واگرد", onClick: () => {} },
      }}
      className="w-full"
    />
  ),
  alert: (
    <div className="w-full space-y-2">
      <Alert variant="success" title="پرداخت انجام شد">
        رسید پیامک شد.
      </Alert>
      <Alert variant="destructive" title="پرداخت ناموفق">
        موجودی کافی نیست.
      </Alert>
    </div>
  ),
  progress: (
    <div className="w-full">
      <Progress value={72} label="آپلود فایل‌ها" showValue />
    </div>
  ),
  skeleton: (
    <div className="w-full space-y-3">
      <Skeleton shimmer className="h-16 w-full rounded-lg" />
      <SkeletonRow />
    </div>
  ),
  "empty-state": (
    <EmptyState
      title="هنوز سفارشی ندارید"
      description="اولین محصول را اضافه کنید."
      action={
        <Button size="sm" variant="outline">
          افزودن محصول
        </Button>
      }
      className="w-full p-5"
    />
  ),
  avatar: (
    <AvatarGroup people={faces} />
  ),
  stat: (
    <Stat
      label="درآمد این ماه"
      value={faNumber(216_000_000)}
      unit="تومان"
      delta={18}
      className="w-full"
    />
  ),
  price: <Price amount={12_450_000} original={14_900_000} />,
  accordion: (
    <div className="w-full">
      <Accordion
        defaultOpen={["free"]}
        items={[
          {
            id: "free",
            title: "آیا رایگان است؟",
            content: "بله. بدون پلن پولی.",
          },
          {
            id: "next",
            title: "با Next.js کار می‌کند؟",
            content: "بله، با هر پروژه‌ی React و Tailwind.",
          },
        ]}
      />
    </div>
  ),
  "prompt-input": (
    <div className="w-full max-w-md">
      <PromptInput placeholder="یک فرم ثبت‌نام فارسی بساز، با شماره‌ی موبایل و کد تأیید…" />
    </div>
  ),
  "data-table": <DataTableDemo compact />,
  chart: (
    <div className="w-full">
      <BarChart
        data={week.map((label, i) => ({ label, value: sales[i] }))}
        highlight={6}
        height={160}
      />
    </div>
  ),
  carousel: (
    <div className="w-full">
      <Carousel slideWidth={0.5} showDots={false}>
        {[1, 2, 3, 4].map((i) => (
          <ProductSlide key={i} i={i} />
        ))}
      </Carousel>
    </div>
  ),
  "combobox-async": (
    <div className="w-full">
      <ComboboxAsync loadOptions={loadCities} placeholder="نام شهر…" />
    </div>
  ),
  "password-input": (
    <div className="w-full">
      <PasswordInput strength placeholder="حداقل ۸ کاراکتر" />
    </div>
  ),
  "iban-input": (
    <div className="w-full">
      <IbanInput />
    </div>
  ),
  "phone-input": (
    <div className="w-full">
      <PhoneInput />
    </div>
  ),
  "national-id-input": (
    <div className="w-full">
      <NationalIdInput />
    </div>
  ),
  "card-number-input": (
    <div className="w-full">
      <CardNumberInput />
    </div>
  ),
  "date-range-picker": (
    <RangeCalendar months={2} compact defaultValue={sampleRange} />
  ),
  "time-picker": (
    <div className="w-full max-w-[180px]">
      <TimePicker defaultValue="14:30" step={15} />
    </div>
  ),
  "amount-input": (
    <div className="w-full">
      <AmountInput defaultValue={1_250_000} quick={[100_000, 500_000, 1_000_000]} />
    </div>
  ),
  form: <FormDemo />,
  card: (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>هدف ماهانه</CardTitle>
        <CardDescription>۷۲٪ از ۳۰۰ میلیون تومان</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={72} />
      </CardContent>
    </Card>
  ),
  "scroll-area": (
    <ScrollArea className="h-36 w-full rounded-lg border border-border px-3">
      {["هدفون بی‌سیم پرو", "کیبورد مکانیکی", "ماوس ارگونومیک", "مانیتور ۲۷ اینچ", "پایه‌ی لپ‌تاپ", "هاب USB-C"].map((item) => (
        <p key={item} className="border-b border-border py-2 text-sm last:border-0">{item}</p>
      ))}
    </ScrollArea>
  ),
  countdown: (
    <Countdown
      target={new Date(Date.now() + 2 * 864e5 + 5 * 36e5)}
      units={["hours", "minutes", "seconds"]}
      size="sm"
      className="w-full"
    />
  ),
  ...educationCardDemos,
};
