"use client";

import * as React from "react";
import { MoreHorizontal, Phone, Plus, Mail } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { DataTable, type Column } from "@/registry/ui/data-table";
import { Dialog } from "@/registry/ui/dialog";
import { DropdownMenu } from "@/registry/ui/dropdown-menu";
import { Field, Input } from "@/registry/ui/input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Select } from "@/registry/ui/select";
import { Stat } from "@/registry/ui/stat";
import { TagsInput } from "@/registry/ui/tags-input";
import { AgendaView } from "@/registry/calendar/agenda-view";
import { fa, faNumber, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import { addDays, atMinutes, dayKey, type CalendarEvent } from "@/lib/calendar-utils";

type Stage = "lead" | "active" | "vip" | "churn";
type Customer = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  stage: Stage;
  spend: number;
  last: Date;
  tags: string[];
  [k: string]: unknown;
};

const STAGE: Record<Stage, { label: string; tone: "secondary" | "success" | "brand" | "warning" }> = {
  lead: { label: "سرنخ", tone: "secondary" },
  active: { label: "فعال", tone: "success" },
  vip: { label: "ویژه", tone: "brand" },
  churn: { label: "راکد", tone: "warning" },
};

const customers: Customer[] = [
  { id: "1", name: "سارا محمدی", company: "فروشگاه آفتاب", phone: "09121234567", email: "sara@aftab.shop", stage: "vip", spend: 48_200_000, last: new Date(), tags: ["عمده", "تهران"] },
  { id: "2", name: "علی رضایی", company: "کافه نوژا", phone: "09351234567", email: "ali@nozha.cafe", stage: "active", spend: 12_400_000, last: new Date(Date.now() - 2 * 864e5), tags: ["خرده‌فروشی"] },
  { id: "3", name: "نگار کریمی", company: "استودیو خط", phone: "09199876543", email: "negar@khat.studio", stage: "lead", spend: 0, last: new Date(Date.now() - 5 * 864e5), tags: ["طراحی"] },
  { id: "4", name: "رضا موسوی", company: "انبار سپهر", phone: "09211234567", email: "reza@sepehr.ir", stage: "active", spend: 31_800_000, last: new Date(Date.now() - 864e5), tags: ["عمده", "اصفهان"] },
  { id: "5", name: "مینا صادقی", company: "داروخانه سلامت", phone: "09131112233", email: "mina@salamat.ph", stage: "churn", spend: 6_100_000, last: new Date(Date.now() - 40 * 864e5), tags: ["دارو"] },
  { id: "6", name: "حسین نوری", company: "چاپخانه رنگ", phone: "09125556677", email: "hossein@rang.print", stage: "vip", spend: 72_000_000, last: new Date(Date.now() - 3 * 864e5), tags: ["چاپ", "قرارداد"] },
];

/** A follow-up `day` days from today at minutes past midnight, Tehran time. */
function followUp(id: string, day: number, minutes: number, length: number, title: string, color: number, location?: string): CalendarEvent {
  const key = dayKey(addDays(new Date(), day));
  return { id, title, start: atMinutes(key, minutes), end: atMinutes(key, minutes + length), color, location };
}

/** Follow-ups for the coming days. Replace with your tasks API. */
const followUps: CalendarEvent[] = [
  followUp("f1", 0, 660, 30, "تماس با سارا محمدی", 1, "تمدید قرارداد عمده"),
  followUp("f2", 0, 900, 45, "دمو برای استودیو خط", 3, "گوگل میت"),
  followUp("f3", 1, 600, 30, "پیگیری فاکتور انبار سپهر", 4),
  followUp("f4", 2, 720, 60, "جلسه با چاپخانه رنگ", 2, "خیابان ولیعصر"),
  followUp("f5", 4, 570, 30, "تماس با داروخانه سلامت", 5, "مشتری راکد"),
];

/** مدیریت مشتریان: آمار، جدول با مرحله‌ی فروش، پیگیری‌های این هفته و افزودن مشتری جدید. */
export function CrmPage() {
  const [stage, setStage] = React.useState("all");
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>(["عمده"]);

  const rows = customers.filter((c) => stage === "all" || c.stage === stage);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "مشتری",
      sortable: true,
      cell: (c) => (
        <span className="flex items-center gap-2">
          <Avatar name={c.name} size="sm" />
          <span>
            <span className="block text-sm font-medium">{c.name}</span>
            <span className="block text-xs text-muted-foreground">{c.company}</span>
          </span>
        </span>
      ),
    },
    {
      key: "phone",
      header: "تماس",
      cell: (c) => (
        <span className="space-y-0.5 text-xs">
          <span className="flex items-center gap-1 tabular-nums" dir="ltr"><Phone className="size-3" />{c.phone}</span>
          <span className="flex items-center gap-1 text-muted-foreground" dir="ltr"><Mail className="size-3" />{c.email}</span>
        </span>
      ),
    },
    {
      key: "stage",
      header: "مرحله",
      sortable: true,
      cell: (c) => <Badge variant={STAGE[c.stage].tone}>{STAGE[c.stage].label}</Badge>,
    },
    {
      key: "spend",
      header: "خرید تجمعی",
      sortable: true,
      numeric: true,
      className: "whitespace-nowrap",
      cell: (c) => formatToman(c.spend),
    },
    {
      key: "last",
      header: "آخرین تماس",
      sortable: true,
      cell: (c) => formatJalali(c.last),
    },
    {
      key: "tags",
      header: "برچسب",
      cell: (c) => (
        <span className="flex flex-wrap gap-1">
          {c.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      cell: () => (
        <DropdownMenu
          align="end"
          trigger={<Button variant="ghost" size="icon" className="size-8" aria-label="بیشتر"><MoreHorizontal /></Button>}
          items={[
            { label: "مشاهده پرونده" },
            { label: "ثبت تماس" },
            { type: "separator" },
            { label: "بایگانی", danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="min-h-dvh bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">مشتریان</h1>
            <p className="text-sm text-muted-foreground">پیگیری سرنخ تا مشتری ویژه</p>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}><Plus />مشتری جدید</Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="کل مشتریان" value={fa(customers.length)} />
          <Stat label="فعال این ماه" value={fa(customers.filter((c) => c.stage === "active" || c.stage === "vip").length)} delta={8} />
          <Stat label="خرید تجمعی" value={faNumber(customers.reduce((s, c) => s + c.spend, 0))} unit="تومان" className="col-span-2 sm:col-span-1" />
          <Stat label="سرنخ باز" value={fa(customers.filter((c) => c.stage === "lead").length)} className="col-span-2 sm:col-span-1" />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(c) => c.id}
          searchKeys={["name", "company"]}
          searchPlaceholder="نام یا شرکت…"
          toolbar={
            <div className="w-40">
              <Select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="h-9"
                options={[
                  { value: "all", label: "همه مراحل" },
                  { value: "lead", label: "سرنخ" },
                  { value: "active", label: "فعال" },
                  { value: "vip", label: "ویژه" },
                  { value: "churn", label: "راکد" },
                ]}
              />
            </div>
          }
        />
          <section className="space-y-3" aria-labelledby="crm-followups">
            <h2 id="crm-followups" className="text-sm font-bold">پیگیری‌های این هفته</h2>
            <AgendaView events={followUps} days={7} toolbar={false} />
          </section>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="مشتری جدید"
        description="اطلاعات تماس و مرحله‌ی اولیه‌ی فروش را وارد کنید."
        footer={<><Button onClick={() => setOpen(false)}>ذخیره</Button><Button variant="ghost" onClick={() => setOpen(false)}>انصراف</Button></>}
      >
        <div className="space-y-4">
          <Field label="نام و نام خانوادگی" htmlFor="cn"><Input id="cn" placeholder="مثلاً: سارا محمدی" /></Field>
          <Field label="شرکت یا فروشگاه" htmlFor="cc"><Input id="cc" placeholder="نام کسب‌وکار" /></Field>
          <div className="space-y-1.5"><span className="text-sm font-medium">شماره‌ی موبایل</span><PhoneInput /></div>
          <Field label="ایمیل" htmlFor="ce"><Input id="ce" type="email" dir="ltr" placeholder="name@example.com" /></Field>
          <Field label="برچسب‌ها"><TagsInput value={tags} onChange={setTags} placeholder="برچسب جدید…" /></Field>
        </div>
      </Dialog>
    </div>
  );
}
