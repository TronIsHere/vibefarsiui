import type { CalendarCat, CalendarDoc } from "./types";

const cal = (slug: string) => `registry/calendar/${slug}.tsx`;
const DEPS = ["calendar-core", "calendar-utils"];

export const calendarCats: { key: CalendarCat; label: string }[] = [
  { key: "kit", label: "پایه" },
  { key: "views", label: "نماهای تقویم" },
  { key: "occasions", label: "تعطیلات و مناسبت‌ها" },
  { key: "booking", label: "نوبت‌دهی" },
  { key: "planning", label: "برنامه‌ریزی" },
];

const list: CalendarDoc[] = [
  {
    slug: "calendar-core",
    name: "هسته‌ی تقویم",
    cat: "kit",
    tags: ["core", "holidays", "hijri", "a11y", "keyboard"],
    file: cal("calendar-core"),
    deps: ["lucide-react"],
    registryDeps: ["calendar-utils", "iran-holidays", "hijri"],
    desc: "پایه‌ی مشترک همه‌ی نماهای تقویم که منطقه‌ی زمانی، تعطیلات رسمی ایران، تاریخ قمری زیر هر روز، نوار ابزار، چیپ رویداد و ناوبری با کیبورد را یک‌جا فراهم می‌کنه.",
    usage: `import { CalendarProvider } from "@/components/calendar/calendar-core"

// همه‌ی نماها بدون Provider هم کار می‌کنن. برای تنظیم مشترک:
<CalendarProvider timeZone="Asia/Tehran" secondary="hijri" weekend={[6]}>
  <MonthView events={events} />
  <AgendaView events={events} />
</CalendarProvider>`,
    props: [
      { name: "timeZone", type: "string", default: '"Asia/Tehran"', desc: "رویدادهای ساعت‌دار در این منطقه چیده میشن، حتی اگه مرورگر کاربر جای دیگه‌ای باشه." },
      { name: "occasions", type: "OccasionProvider | false", default: "iranOccasions", desc: "تعطیلات رسمی ایران به‌صورت پیش‌فرض روشنه. تابع خودتون را بدید تا از API بخونه، یا false تا خاموش بشه." },
      { name: "secondary", type: '"hijri" | "gregorian" | null', default: '"hijri"', desc: "تاریخ دومی که کوچک زیر هر روز شمسی می‌آد." },
      { name: "weekend", type: "number[]", default: "[6]", desc: "روزهای تعطیل هفته، ۰ شنبه و ۶ جمعه. برای پنجشنبه هم [5, 6] بدید." },
    ],
    notes: [
      "روزها با کلید «YYYY-MM-DD» شناخته میشن و رویدادهای ساعت‌دار لحظه‌ی واقعی (Date) هستن، پس تقویم با هر بک‌اندی جور درمیاد.",
      "کلید جهت چپ روز بعد و جهت راست روز قبله، چون در راست‌چین روز بعد سمت چپ نشسته. PageUp و PageDown ماه را عوض می‌کنن.",
      "رنگ رویدادها همون --chart-1 تا --chart-7 نمودارهاست، پس با سیستم طراحی شما یکی میشن.",
    ],
    promptBullets: [
      "Export CalendarProvider/useCalendar (timeZone, occasions provider, secondary date, weekend), useToday, useNow (useSyncExternalStore, null on the server), useControllable, dayInfo/useDayInfo, secondaryDay, secondaryMonthTitle, CalendarToolbar, WeekdayHeader, DayNumber, OccasionLine, EventChip, useRovingDays, useWidth, SrOnly, CalendarEmpty.",
      "Holidays come from an OccasionProvider keyed by day; never hard-code dates in components.",
      "Holiday and weekend states use color plus a dot or a line of text, never color alone; today is a ring, selected is filled.",
    ],
  },
  {
    slug: "event-calendar",
    name: "تقویم رویدادها",
    cat: "views",
    tags: ["calendar", "events", "month", "week", "day", "agenda"],
    file: cal("event-calendar"),
    wide: true,
    registryDeps: [...DEPS, "month-view", "time-grid", "agenda-view", "segmented-control"],
    desc: "تقویم کامل با نمای ماه، هفته، روز و فهرست، نوار ابزار مشترک و تعطیلات رسمی ایران، مثل تقویم گوگل ولی راست‌چین و شمسی.",
    usage: `import { EventCalendar } from "@/components/calendar/event-calendar"

const [events, setEvents] = useState<CalendarEvent[]>(initial)

<EventCalendar
  events={events}
  defaultView="week"
  onSlotSelect={(start, end) => openNewEventDialog(start, end)}
  onEventClick={(e) => openEvent(e.id)}
  onEventChange={(e, start, end) =>
    setEvents((list) => list.map((x) => (x.id === e.id ? { ...x, start, end } : x)))
  }
/>`,
    props: [
      { name: "events", type: "CalendarEvent[]", desc: "هر رویداد id، title، start و end داره و allDay، color (۱ تا ۷ یا رنگ CSS) و location اختیاریه." },
      { name: "view / defaultView", type: '"month" | "week" | "day" | "agenda"', default: '"month"', desc: "نمای فعلی، کنترل‌شده یا آزاد." },
      { name: "views", type: "CalendarView[]", desc: "نماهایی که سوییچ نشون میده. اگه فقط یکی بدید، سوییچ پنهان میشه." },
      { name: "onSlotSelect", type: "(start, end) => void", desc: "بعد از کشیدن روی زمان خالی در نمای هفته یا روز صدا زده میشه." },
      { name: "onEventChange", type: "(event, start, end) => void", desc: "کشیدن و تغییر اندازه‌ی رویداد را روشن می‌کنه. state را خودتون به‌روز کنید." },
      { name: "startHour / endHour / slotMinutes", type: "number", default: "7 / 22 / 30", desc: "ساعت‌های نمایش داده‌شده و گام چسبیدن." },
      { name: "occasions / secondary / weekend / timeZone", type: "…", desc: "مثل CalendarProvider." },
    ],
    notes: [
      "کلیک روی یک روز در نمای ماه همون روز را در نمای روز باز می‌کنه، مگه این‌که onDayClick بدید.",
      "هر نما جدا هم کامپوننت خودشه، پس اگه فقط نمای ماه لازم دارید MonthView را نصب کنید.",
    ],
    promptBullets: [
      "Shell over MonthView, TimeGrid (days 7 and 1) and AgendaView with toolbar=false; one shared CalendarToolbar with a SegmentedControl view switcher.",
      "Prev/next step by a Jalali month, a week, a day or the agenda span depending on the view.",
    ],
  },
  {
    slug: "month-view",
    name: "نمای ماه",
    cat: "views",
    tags: ["month", "grid", "multi-day", "overflow"],
    file: cal("month-view"),
    wide: true,
    registryDeps: [...DEPS, "popover"],
    desc: "ماه شمسی با رویدادهای چندروزه به شکل نوار از راست به چپ، اسم تعطیلی داخل خونه‌ی روز و «+۲ مورد دیگر» برای روزهای شلوغ.",
    usage: `import { MonthView } from "@/components/calendar/month-view"

<MonthView
  events={events}
  selected={selectedKey}
  onDayClick={(date) => setSelectedKey(dayKey(date))}
  onEventClick={(e) => openEvent(e.id)}
/>`,
    props: [
      { name: "month / defaultMonth", type: "Date", desc: "هر روزی از ماهی که نمایش داده میشه." },
      { name: "selected", type: "string", desc: "کلید روز انتخاب‌شده مثل «2026-10-12»." },
      { name: "maxLanes", type: "number", default: "3", desc: "چند ردیف رویداد در هر هفته قبل از «+۲ مورد دیگر»." },
      { name: "fixedWeeks", type: "boolean", default: "true", desc: "همیشه شش هفته تا ارتفاع بین ماه‌ها نپره." },
    ],
    notes: ["زیر حدود ۵۶۰ پیکسل نوارها به نقطه‌های رنگی تبدیل میشن تا روی موبایل خونه‌ها شلوغ نشن."],
    promptBullets: [
      "Six fixed week rows; multi-day bars from layoutSpans placed with inset-inline-start so Saturday is on the right.",
      "Day cells are role=gridcell buttons with roving tabindex; overflow opens a Popover with that day's events.",
    ],
  },
  {
    slug: "time-grid",
    name: "نمای هفته و روز",
    cat: "views",
    tags: ["week", "day", "drag", "resize", "now line"],
    file: cal("time-grid"),
    wide: true,
    registryDeps: DEPS,
    desc: "ستون ساعت‌ها سمت راست، شنبه اولین ستون، رویدادهای هم‌زمان کنار هم و خط قرمز «الان». روی زمان خالی بکشید تا رویداد بسازید و رویداد را بکشید تا جابه‌جا بشه.",
    usage: `import { TimeGrid } from "@/components/calendar/time-grid"

<TimeGrid
  days={7}
  events={events}
  startHour={8}
  endHour={20}
  onSlotSelect={(start, end) => create({ start, end })}
  onEventChange={(e, start, end) => move(e.id, start, end)}
/>`,
    props: [
      { name: "days", type: "1 | 7", default: "7", desc: "نمای هفته از شنبه تا جمعه یا یک روز." },
      { name: "startHour / endHour", type: "number", default: "7 / 22", desc: "ساعت‌های نمایش داده‌شده." },
      { name: "slotMinutes", type: "number", default: "30", desc: "گام چسبیدن هنگام انتخاب و کشیدن." },
      { name: "hourHeight / maxHeight", type: "number", default: "48 / 560", desc: "ارتفاع هر ساعت و حداکثر ارتفاع بخش اسکرول‌شونده." },
      { name: "onEventChange", type: "(event, start, end) => void", desc: "بدون این پراپ رویدادها فقط کلیک می‌خورن." },
    ],
    notes: [
      "رویداد فوکوس‌شده با Alt و کلیدهای جهت جابه‌جا میشه: بالا و پایین به اندازه‌ی یک گام و چپ و راست یک روز.",
      "رویدادهای تمام‌روز و چندروزه در ردیف بالای جدول می‌نشینن.",
    ],
    promptBullets: [
      "Hours gutter on the right; columns from layoutTimed (overlap clusters share a column count); positions in minutes of the time zone, not local time.",
      "Pointer capture for select/move/resize with snapping; a ghost shows the new time while dragging.",
      "Now line from useNow so the server render never mismatches.",
    ],
  },
  {
    slug: "agenda-view",
    name: "فهرست رویدادها",
    cat: "views",
    tags: ["agenda", "list", "upcoming"],
    file: cal("agenda-view"),
    deps: ["lucide-react"],
    registryDeps: DEPS,
    desc: "روزهای دارای رویداد با برچسب «امروز» و «فردا»، ساعت و مکان هر رویداد، و تعطیلی‌ها به‌عنوان یک خط جدا تا روز خلوت با روز تعطیل اشتباه نشه.",
    usage: `import { AgendaView } from "@/components/calendar/agenda-view"

<AgendaView events={events} days={7} onEventClick={(e) => openEvent(e.id)} />`,
    props: [
      { name: "days", type: "number", default: "14", desc: "چند روز از تاریخ شروع پوشش داده میشه." },
      { name: "showOccasions", type: "boolean", default: "true", desc: "تعطیلات و مناسبت‌ها هم در روز خودشون بیان." },
      { name: "toolbar", type: "boolean", default: "true", desc: "برای کارت داشبورد خاموشش کنید." },
    ],
    promptBullets: ["Groups by day with dayLabel («امروز»، «فردا»، weekday); all-day events first; Hijri date under the Jalali date when secondary is hijri."],
  },
  {
    slug: "year-view",
    name: "نمای سال",
    cat: "occasions",
    tags: ["year", "holidays", "overview"],
    file: cal("year-view"),
    wide: true,
    registryDeps: DEPS,
    desc: "دوازده ماه شمسی در یک نگاه با همه‌ی تعطیلی‌ها، تا برنامه‌ریزی سفر یا انتشار نسخه دور تعطیلات با یک نگاه انجام بشه.",
    usage: `import { YearView } from "@/components/calendar/year-view"

<YearView defaultYear={1405} events={events} onDayClick={(d) => goTo(d)} />`,
    props: [
      { name: "year / defaultYear", type: "number", desc: "سال شمسی." },
      { name: "events", type: "CalendarEvent[]", desc: "روزهایی که رویداد دارن یک نقطه‌ی رنگی می‌گیرن." },
      { name: "columns", type: "3 | 4 | 6", default: "4", desc: "تعداد ماه در هر ردیف روی صفحه‌ی بزرگ." },
    ],
    notes: ["زیر عنوان، تعداد روزهای تعطیل رسمی سال به‌جز جمعه‌ها نوشته میشه."],
    promptBullets: ["Twelve mini months, holidays filled with a light red and named in the title attribute; arrow keys move across month boundaries and years."],
  },
  {
    slug: "occasions-list",
    name: "فهرست مناسبت‌ها",
    cat: "occasions",
    tags: ["holidays", "occasions", "hijri", "badge"],
    file: cal("occasions-list"),
    registryDeps: DEPS,
    desc: "تعطیلات و مناسبت‌های امروز، این هفته، این ماه یا چند مورد بعدی، با تاریخ شمسی و قمری و این‌که چند روز مونده.",
    usage: `import { OccasionsList, HolidayBadge } from "@/components/calendar/occasions-list"

<OccasionsList range="upcoming" limit={5} holidaysOnly />`,
    props: [
      { name: "range", type: '"today" | "week" | "month" | "upcoming"', default: '"month"', desc: "upcoming از امروز به بعد تا سقف limit می‌گرده." },
      { name: "holidaysOnly", type: "boolean", desc: "فقط تعطیلی‌های رسمی." },
      { name: "limit", type: "number", desc: "حداکثر تعداد ردیف." },
    ],
    notes: ["تاریخ قمری بیرون از جدول رسمی با «تقریبی» علامت می‌خوره، چون ممکنه یک روز جابه‌جا بشه."],
    promptBullets: ["Rows show a date block, the title, a «تعطیل» badge, weekday, Hijri date for lunar days and «۳ روز دیگر»."],
  },
  {
    slug: "slot-picker",
    name: "انتخاب نوبت",
    cat: "booking",
    tags: ["booking", "slots", "appointment", "capacity"],
    file: cal("slot-picker"),
    registryDeps: DEPS,
    desc: "نوار روزها با جمعه‌ها و تعطیلات غیرفعال و دلیلشون، و زیرش ساعت‌های خالی همون روز در سه دسته‌ی صبح، بعدازظهر و عصر، با ظرفیت باقی‌مانده.",
    usage: `import { SlotPicker } from "@/components/calendar/slot-picker"

<SlotPicker
  value={slot}
  onChange={setSlot}
  duration={45}
  hours={{ 0: [["09:00", "13:00"], ["16:00", "20:00"]], 5: [["09:00", "13:00"]] }}
  busy={(key) => bookedIntervals[key] ?? []}
/>`,
    props: [
      { name: "value / onChange", type: "{ start, end } | null", desc: "نوبت انتخاب‌شده به‌صورت دو لحظه‌ی واقعی." },
      { name: "hours", type: "[from, to][] | Record<weekday, [from, to][]>", desc: "ساعت کاری برای همه‌ی روزها یا برای هر روز هفته جدا." },
      { name: "duration / step", type: "number", default: "30", desc: "مدت هر نوبت و فاصله‌ی شروع نوبت‌ها به دقیقه." },
      { name: "capacity", type: "number", default: "1", desc: "بیشتر از یک یعنی چند نفر هم‌زمان، و تعداد جای خالی نشون داده میشه." },
      { name: "busy", type: "{ start, end }[] | (key) => …", desc: "بازه‌های رزروشده. هر هم‌پوشانی یک جا را پر می‌کنه." },
      { name: "closedWeekdays / closeOnHolidays / closedDays", type: "…", default: "[6] / true / []", desc: "روزهای بسته که در نوار غیرفعال میشن." },
      { name: "closedReason", type: "(date) => string | null", desc: "دلیل خودتون برای بسته بودن یک روز، مثلاً «دکتر سه‌شنبه‌ها نیستن». null یعنی قاعده‌های بالا تصمیم بگیرن." },
    ],
    notes: ["ساعت‌های گذشته و پرشده پنهان نمیشن و خط‌خورده می‌مونن تا کاربر بدونه چرا انتخاب نمیشن."],
    promptBullets: [
      "Slots from generateSlots in the calendar time zone; past slots use useNow so server and client agree.",
      "Day strip is a listbox moved with arrow keys (ArrowLeft = next day); closed days stay focusable with aria-disabled and the reason in the label.",
    ],
  },
  {
    slug: "gantt-chart",
    name: "گانت",
    cat: "planning",
    tags: ["gantt", "timeline", "project", "dependencies"],
    file: cal("gantt-chart"),
    wide: true,
    registryDeps: [...DEPS, "segmented-control"],
    desc: "کارها روی محور زمان شمسی که از راست به چپ جلو می‌ره، با فهرست کارها سمت راست، پیشرفت داخل هر نوار، فلش وابستگی، نقطه‌ی عطف، خط امروز و تعطیلی‌های رنگی.",
    usage: `import { GanttChart } from "@/components/calendar/gantt-chart"

<GanttChart
  tasks={[
    { id: "design", title: "طراحی", start: d(1), end: d(5), progress: 1 },
    { id: "build", title: "پیاده‌سازی", start: d(6), end: d(15), progress: 0.4, dependsOn: ["design"] },
    { id: "launch", title: "انتشار", start: d(16), end: d(16), milestone: true, dependsOn: ["build"] },
  ]}
  onTaskChange={(t, start, end) => update(t.id, { start, end })}
/>`,
    props: [
      { name: "tasks", type: "GanttTask[]", desc: "start و end روزهای اول و آخرن و هر دو حساب میشن. progress بین ۰ و ۱ و dependsOn آرایه‌ی id کارهای قبلیه." },
      { name: "zoom / defaultZoom", type: '"day" | "week" | "month"', default: '"day"', desc: "بزرگ‌نمایی محور زمان." },
      { name: "from / to", type: "Date", desc: "بازه‌ی نمایش. پیش‌فرض از اولین تا آخرین کار با کمی حاشیه است." },
      { name: "onTaskChange", type: "(task, start, end) => void", desc: "کشیدن نوار و لبه‌هاش را روشن می‌کنه." },
      { name: "listWidth / rowHeight", type: "number", default: "200 / 36", desc: "عرض فهرست کارها و ارتفاع هر ردیف." },
    ],
    notes: ["روی نوار فوکوس‌شده Alt و چپ یا راست کار را یک روز جابه‌جا می‌کنه و با Shift فقط پایانش را."],
    promptBullets: [
      "Bars positioned with inset-inline-start in day units; dependency arrows in an SVG with physical x = width − offset, from the predecessor's left edge to the successor's right edge.",
      "sr-only table of tasks with Jalali start, end and progress.",
    ],
  },
  {
    slug: "shift-scheduler",
    name: "برنامه‌ی شیفت",
    cat: "planning",
    tags: ["shifts", "roster", "staff", "hours"],
    file: cal("shift-scheduler"),
    wide: true,
    deps: ["lucide-react"],
    registryDeps: [...DEPS, "popover"],
    desc: "اسم افراد سمت راست و شنبه تا جمعه جلوشون، شیفت صبح و عصر و شب در هر خونه، جمع ساعت هفتگی با هشدار بیش از ۴۴ ساعت و پرچم وقتی استراحت بین دو شیفت کمه.",
    usage: `import { ShiftScheduler } from "@/components/calendar/shift-scheduler"

<ShiftScheduler
  resources={[{ id: "sara", title: "سارا احمدی", subtitle: "پرستار" }]}
  shifts={shifts}
  onShiftsChange={setShifts}
/>`,
    props: [
      { name: "resources", type: "Resource[]", desc: "افراد یا اتاق‌ها با id، title و subtitle." },
      { name: "shifts / onShiftsChange", type: "Shift[]", desc: "هر شیفت resourceId، date و type داره." },
      { name: "shiftTypes", type: "ShiftType[]", default: "صبح، عصر، شب", desc: "نوع شیفت‌ها با ساعت شروع و پایان. پایان کمتر از شروع یعنی روز بعد تموم میشه." },
      { name: "maxHours / minRest", type: "number", default: "44 / 12", desc: "سقف ساعت هفتگی و حداقل استراحت بین دو شیفت." },
      { name: "onCellClick", type: "(resourceId, date) => void", desc: "اگه بدید، منوی داخلی خاموش میشه تا دیالوگ خودتون را باز کنید." },
    ],
    notes: ["ردیف پوشش پایین جدول تعداد هر شیفت در هر روز را نشون میده و صفرها قرمز میشن."],
    promptBullets: ["Semantic <table> with row and column headers; cells open a Popover menu of menuitemcheckbox shift types; warnings use an icon plus text, not color alone."],
  },
];

export const calendar = list;
