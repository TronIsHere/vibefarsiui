"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";
import { Dialog } from "@/registry/ui/dialog";
import { Field, Input } from "@/registry/ui/input";
import { EventCalendar } from "@/registry/calendar/event-calendar";
import { OccasionsList } from "@/registry/calendar/occasions-list";
import { addDays, atMinutes, dayKey, eventColor, formatTimeRange, startOfJalaliWeek, type CalendarEvent } from "@/lib/calendar-utils";
import { formatJalali } from "@/lib/jalali";
import { fa } from "@/lib/utils";

const TEAM = [
  { id: "design", name: "طراحی", color: 5 },
  { id: "product", name: "محصول", color: 1 },
  { id: "dev", name: "توسعه", color: 2 },
  { id: "sales", name: "فروش", color: 4 },
];

/** A timed event `day` days after this week's شنبه, at Tehran times. Replace with your API. */
function at(id: string, team: string, day: number, from: number, to: number, title: string, location?: string): CalendarEvent {
  const key = dayKey(addDays(startOfJalaliWeek(new Date()), day));
  const color = TEAM.find((t) => t.id === team)!.color;
  return { id, title, start: atMinutes(key, from), end: atMinutes(key, to), color, resourceId: team, location };
}

const seed: CalendarEvent[] = [
  at("1", "product", 0, 600, 660, "جلسه‌ی هفتگی محصول", "اتاق جلسه‌ی ۲"),
  at("2", "design", 0, 630, 720, "بازبینی طرح صفحه‌ی پرداخت"),
  at("3", "dev", 1, 540, 570, "استندآپ"),
  at("4", "sales", 1, 840, 900, "دمو برای فروشگاه آفتاب", "گوگل میت"),
  at("5", "dev", 2, 900, 990, "بازبینی کد ماژول سفارش"),
  at("6", "product", 3, 660, 720, "مصاحبه با کاربران"),
  at("7", "design", 4, 600, 690, "کارگاه سیستم طراحی"),
  at("8", "sales", 5, 570, 630, "تماس با سرمایه‌گذار"),
  at("9", "dev", 7, 540, 570, "استندآپ"),
  at("10", "product", 8, 600, 690, "برنامه‌ریزی اسپرینت"),
  at("11", "sales", 10, 960, 1020, "جلسه با چاپخانه رنگ", "خیابان ولیعصر"),
  { id: "12", title: "مرخصی سارا", allDay: true, start: addDays(startOfJalaliWeek(new Date()), 2), end: addDays(startOfJalaliWeek(new Date()), 5), color: 7 },
];

/** تقویم تیمی: تقویم رویداد با فیلتر تیم‌ها، ساخت رویداد با کشیدن روی زمان خالی و تعطیلات پیش رو. */
export function TeamCalendarPage() {
  const [events, setEvents] = React.useState(seed);
  const [hidden, setHidden] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState<{ start: Date; end: Date } | null>(null);
  const [title, setTitle] = React.useState("");
  const [team, setTeam] = React.useState(TEAM[0].id);

  const visible = events.filter((e) => !e.resourceId || !hidden.includes(e.resourceId));
  const save = () => {
    if (!draft || !title.trim()) return;
    const t = TEAM.find((x) => x.id === team)!;
    setEvents((list) => [...list, { id: `n${Date.now()}`, title: title.trim(), ...draft, color: t.color, resourceId: t.id }]);
    setDraft(null);
    setTitle("");
  };
  const newEvent = () => {
    const key = dayKey(new Date());
    setDraft({ start: atMinutes(key, 600), end: atMinutes(key, 660) });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <h1 className="text-base font-bold">تقویم تیم</h1>
          <span className="text-xs text-muted-foreground">{fa(visible.length)} رویداد</span>
          <Button size="sm" className="ms-auto" onClick={newEvent}>
            <Plus />
            رویداد جدید
          </Button>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[15rem_1fr]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-bold">تیم‌ها</h2>
            <ul className="space-y-2">
              {TEAM.map((t, i) => (
                <li key={t.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={!hidden.includes(t.id)}
                    onCheckedChange={(on) => setHidden((h) => (on ? h.filter((x) => x !== t.id) : [...h, t.id]))}
                    label={
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="size-2.5 rounded-full" style={{ background: eventColor(t.color, i) }} />
                        {t.name}
                      </span>
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
          <OccasionsList range="upcoming" limit={5} title="تعطیلات و مناسبت‌های پیش رو" />
        </aside>
        <EventCalendar
          events={visible}
          defaultView="week"
          startHour={8}
          endHour={19}
          onSlotSelect={(start, end) => setDraft({ start, end })}
          onEventChange={(e, start, end) => setEvents((list) => list.map((x) => (x.id === e.id ? { ...x, start, end } : x)))}
        />
      </main>

      <Dialog
        open={!!draft}
        onOpenChange={(o) => !o && setDraft(null)}
        title="رویداد جدید"
        description={draft ? `${formatJalali(draft.start, { weekday: true })}، ${formatTimeRange(draft.start, draft.end)}` : undefined}
        footer={
          <>
            <Button onClick={save} disabled={!title.trim()}>
              ذخیره
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              انصراف
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="عنوان" htmlFor="tc-title">
            <Input id="tc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: جلسه با مشتری" onKeyDown={(e) => e.key === "Enter" && save()} />
          </Field>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">تیم</legend>
            <div className="flex flex-wrap gap-2">
              {TEAM.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={team === t.id}
                  onClick={() => setTeam(t.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs transition-colors hover:bg-accent aria-pressed:border-foreground aria-pressed:bg-secondary"
                >
                  <span aria-hidden className="size-2 rounded-full" style={{ background: eventColor(t.color, i) }} />
                  {t.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </Dialog>
    </div>
  );
}
