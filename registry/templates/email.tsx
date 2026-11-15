/**
 * قالب‌های ایمیل راست‌چین. Email clients ignore most CSS, so these are
 * table-based HTML strings with inline styles and `dir="rtl"` on every
 * structural element. Render them server-side and send the string.
 */

const FONT = "Tahoma, 'Segoe UI', Arial, sans-serif";
const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const fa = (v: string | number) => String(v).replace(/\d/g, (d) => FA[Number(d)]);
const toman = (n: number) => fa(n.toLocaleString("en-US")).replace(/,/g, "٬") + " تومان";

/** Name and accent color in the header and buttons. */
export type EmailBrand = { name: string; color?: string };
const DEFAULT_BRAND: EmailBrand = { name: "دکان", color: "#18181b" };
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function shell(opts: { title: string; preheader?: string; body: string; footer?: string; brand?: EmailBrand }) {
  const brand = opts.brand ?? DEFAULT_BRAND;
  return `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${opts.title}</title></head>
<body dir="rtl" style="margin:0;padding:0;background:#f4f4f5;font-family:${FONT};">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#f4f4f5;">${opts.preheader}</div>` : ""}
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
  <tr><td align="center">
    <table dir="rtl" role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;">
      <tr><td dir="rtl" style="padding:24px 28px 0;text-align:right;font-size:18px;font-weight:bold;color:${brand.color ?? "#18181b"};">${esc(brand.name)}</td></tr>
      <tr><td dir="rtl" style="padding:20px 28px 28px;text-align:right;font-size:15px;line-height:1.9;color:#27272a;">${opts.body}</td></tr>
      <tr><td dir="rtl" style="padding:16px 28px;border-top:1px solid #e4e4e7;text-align:right;font-size:12px;line-height:1.8;color:#71717a;">${opts.footer ?? "این ایمیل خودکار است؛ لطفاً به آن پاسخ ندهید. اگر این درخواست از طرف شما نبوده، همین ایمیل را نادیده بگیرید."}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const button = (label: string, href = "#", color = "#18181b") =>
  `<table dir="rtl" role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background:${color};border-radius:10px;"><a href="${href}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;font-family:${FONT};">${label}</a></td></tr></table>`;

/** کد تأیید: بزرگ، LTR و قابل کپی. */
export function otpEmail({ name, code, minutes = 5, brand = DEFAULT_BRAND }: { name: string; code: string; minutes?: number; brand?: EmailBrand }) {
  return shell({
    brand,
    title: "کد تأیید",
    preheader: `کد تأیید شما: ${fa(code)}`,
    body: `<p style="margin:0 0 8px;">سلام ${name}،</p>
<p style="margin:0 0 16px;">برای ورود، این کد را وارد کنید. تا ${fa(minutes)} دقیقه معتبر است.</p>
<div dir="ltr" style="text-align:center;margin:8px 0 20px;"><span style="display:inline-block;padding:14px 24px;border-radius:12px;background:#f4f4f5;font-family:Consolas,Menlo,monospace;font-size:28px;letter-spacing:8px;color:#18181b;">${code}</span></div>
<p style="margin:0;color:#71717a;font-size:13px;">این کد را با کسی به اشتراک نگذارید؛ حتی اگر خودش را کارمند ما معرفی کند.</p>`,
  });
}

/** تأیید سفارش: جدول اقلام با تومان و لینک پیگیری. */
export function orderEmail({ name, orderId, items, shipping = 0, brand = DEFAULT_BRAND }: { name: string; orderId: number; items: { title: string; qty: number; price: number }[]; shipping?: number; brand?: EmailBrand }) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const rows = items.map((i) => `<tr><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;text-align:right;">${i.title} <span style="color:#71717a;">× ${fa(i.qty)}</span></td><td style="padding:10px 0;border-bottom:1px solid #f4f4f5;text-align:left;white-space:nowrap;">${toman(i.qty * i.price)}</td></tr>`).join("");
  return shell({
    brand,
    title: `سفارش #${fa(orderId)} ثبت شد`,
    preheader: `سفارش شما ثبت شد و در حال آماده‌سازی است.`,
    body: `<p style="margin:0 0 8px;">سلام ${name}،</p>
<p style="margin:0 0 16px;">سفارش <strong>#${fa(orderId)}</strong> ثبت شد. تا ارسال، از همین ایمیل خبردارتان می‌کنیم.</p>
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
${rows}
<tr><td style="padding:10px 0;text-align:right;color:#71717a;">هزینه‌ی ارسال</td><td style="padding:10px 0;text-align:left;">${shipping ? toman(shipping) : "رایگان"}</td></tr>
<tr><td style="padding:12px 0;text-align:right;font-weight:bold;border-top:1px solid #e4e4e7;">جمع کل</td><td style="padding:12px 0;text-align:left;font-weight:bold;border-top:1px solid #e4e4e7;">${toman(subtotal + shipping)}</td></tr>
</table>
${button("پیگیری سفارش", "#", brand.color)}`,
  });
}

/** بازیابی رمز: لینک یک‌بارمصرف. */
export function resetEmail({ name, minutes = 30, href = "#", brand = DEFAULT_BRAND }: { name: string; minutes?: number; href?: string; brand?: EmailBrand }) {
  return shell({
    brand,
    title: "بازیابی رمز عبور",
    body: `<p style="margin:0 0 8px;">سلام ${name}،</p>
<p style="margin:0;">درخواست تغییر رمز عبور رسید. با دکمه‌ی زیر رمز جدید بگذارید؛ لینک تا ${fa(minutes)} دقیقه معتبر است.</p>
${button("تغییر رمز عبور", href, brand.color)}
<p style="margin:0;color:#71717a;font-size:13px;">اگر شما درخواست نداده‌اید، کاری لازم نیست؛ رمز فعلی‌تان تغییری نمی‌کند.</p>`,
  });
}

const muted = "color:#71717a;";
const dateFa = (d: Date) => new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Tehran" }).format(d);

/** خوش‌آمد: سه قدم شروع و یک دکمه، با کد هدیه‌ی اختیاری. */
export function welcomeEmail({ name, steps = ["پروفایل‌تان را کامل کنید", "اولین پروژه را بسازید", "هم‌تیمی‌هایتان را دعوت کنید"], giftCode, cta = "شروع کنید", href = "#", brand = DEFAULT_BRAND }: { name: string; steps?: string[]; giftCode?: string; cta?: string; href?: string; brand?: EmailBrand }) {
  const list = steps
    .map((t, i) => `<tr><td width="36" valign="top" style="padding:6px 0;"><span style="display:inline-block;width:26px;height:26px;line-height:26px;border-radius:13px;background:#f4f4f5;text-align:center;font-weight:bold;font-size:13px;">${fa(i + 1)}</span></td><td style="padding:6px 0;text-align:right;">${esc(t)}</td></tr>`)
    .join("");
  return shell({
    brand,
    title: `به ${brand.name} خوش آمدید`,
    preheader: `${name} عزیز، حساب‌تان آماده است.`,
    body: `<p style="margin:0 0 8px;font-size:20px;font-weight:bold;">خوش آمدید، ${esc(name)}!</p>
<p style="margin:0 0 16px;">حساب‌تان ساخته شد. برای شروع، این سه قدم کافی است:</p>
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${list}</table>
${giftCode ? `<p style="margin:20px 0 6px;">هدیه‌ی اولین خرید، ۲۰٪ تخفیف با این کد:</p><div dir="ltr" style="text-align:right;"><span style="display:inline-block;padding:8px 16px;border:1px dashed #a1a1aa;border-radius:10px;font-family:Consolas,Menlo,monospace;font-size:18px;letter-spacing:3px;">${esc(giftCode)}</span></div>` : ""}
${button(cta, href, brand.color)}`,
  });
}

const STAGES = ["ثبت سفارش", "آماده‌سازی", "تحویل به پست", "تحویل"];

/** ارسال شد: مراحل سفارش، کد رهگیری LTR و نشانی. */
export function shippedEmail({ name, orderId, carrier, trackingCode, eta, address, stage = 2, href = "#", brand = DEFAULT_BRAND }: { name: string; orderId: number; carrier: string; trackingCode: string; eta: string; address: string; /** 0–3 in STAGES. */ stage?: number; href?: string; brand?: EmailBrand }) {
  const accent = brand.color ?? "#18181b";
  const cells = STAGES.map((t, i) => {
    const done = i <= stage;
    return `<td width="25%" valign="top" style="padding:0 2px;text-align:center;"><div style="height:6px;border-radius:3px;background:${done ? accent : "#e4e4e7"};"></div><div style="padding-top:6px;font-size:11px;${done ? "color:#18181b;font-weight:bold;" : muted}">${t}</div></td>`;
  }).join("");
  return shell({
    brand,
    title: `سفارش #${fa(orderId)} ارسال شد`,
    preheader: `بسته‌تان با ${carrier} در راه است. کد رهگیری: ${trackingCode}`,
    body: `<p style="margin:0 0 8px;">سلام ${esc(name)}،</p>
<p style="margin:0 0 18px;">سفارش <strong>#${fa(orderId)}</strong> به ${esc(carrier)} تحویل شد و ${esc(eta)} به دست‌تان می‌رسد.</p>
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr>${cells}</tr></table>
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;background:#fafafa;border-radius:12px;">
<tr><td style="padding:12px 16px 4px;text-align:right;${muted}">کد رهگیری ${esc(carrier)}</td></tr>
<tr><td dir="ltr" style="padding:0 16px 12px;text-align:right;font-family:Consolas,Menlo,monospace;font-size:17px;letter-spacing:1px;">${esc(trackingCode)}</td></tr>
<tr><td style="padding:12px 16px 4px;border-top:1px solid #f0f0f0;text-align:right;${muted}">نشانی تحویل</td></tr>
<tr><td style="padding:0 16px 12px;text-align:right;">${esc(address)}</td></tr>
</table>
${button("رهگیری مرسوله", href, brand.color)}`,
  });
}

/** رسید پرداخت: مبلغ درشت، شماره‌ی پیگیری، کارت ماسک‌شده و زمان به شمسی. */
export function receiptEmail({ name, amount, description, reference, card, gateway, paidAt, brand = DEFAULT_BRAND }: { name: string; amount: number; description: string; /** شماره‌ی پیگیری بانک. */ reference: string; /** Last four digits, or a masked number. */ card?: string; gateway?: string; paidAt: Date; brand?: EmailBrand }) {
  const row = (label: string, value: string, ltr = false) =>
    `<tr><td style="padding:9px 0;border-bottom:1px solid #f4f4f5;text-align:right;${muted}">${label}</td><td ${ltr ? 'dir="ltr" ' : ""}style="padding:9px 0;border-bottom:1px solid #f4f4f5;text-align:left;${ltr ? "font-family:Consolas,Menlo,monospace;" : ""}">${value}</td></tr>`;
  const masked = card ? (card.length <= 4 ? `****-****-****-${card}` : card) : "";
  return shell({
    brand,
    title: "رسید پرداخت",
    preheader: `پرداخت ${toman(amount)} با موفقیت انجام شد.`,
    body: `<p style="margin:0 0 8px;">سلام ${esc(name)}،</p>
<p style="margin:0 0 16px;">پرداخت شما با موفقیت انجام شد. این ایمیل رسید شماست.</p>
<div style="text-align:center;margin:0 0 18px;padding:18px;border-radius:12px;background:#f0fdf4;">
  <div style="font-size:13px;color:#15803d;">✓ پرداخت موفق</div>
  <div style="font-size:26px;font-weight:bold;color:#14532d;margin-top:4px;">${toman(amount)}</div>
</div>
<table dir="rtl" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("بابت", esc(description))}
${row("شماره‌ی پیگیری", esc(reference), true)}
${masked ? row("کارت", esc(masked), true) : ""}
${gateway ? row("درگاه", esc(gateway)) : ""}
${row("زمان", dateFa(paidAt))}
</table>
<p style="margin:16px 0 0;${muted}font-size:13px;">اگر مبلغ از حساب‌تان کم شده ولی سفارش ثبت نشده، تا ۷۲ ساعت به حساب‌تان برمی‌گردد.</p>`,
  });
}

/** Preview helper for the docs: renders all three in isolated iframes. */
export function EmailPreview() {
  const samples = [
    { name: "کد تأیید", html: otpEmail({ name: "سارا", code: "482913" }) },
    { name: "تأیید سفارش", html: orderEmail({ name: "مریم", orderId: 14052, items: [{ title: "هدفون بی‌سیم مدل X۲", qty: 1, price: 1_890_000 }, { title: "کابل شارژ ۲ متری", qty: 2, price: 120_000 }], shipping: 45_000 }) },
    { name: "بازیابی رمز", html: resetEmail({ name: "علی" }) },
    { name: "خوش‌آمد", html: welcomeEmail({ name: "نیلوفر", giftCode: "WELCOME20" }) },
    { name: "ارسال شد", html: shippedEmail({ name: "مریم", orderId: 14052, carrier: "پست پیشتاز", trackingCode: "123456789012345678901234", eta: "تا پنجشنبه", address: "تهران، خیابان ولیعصر، کوچه‌ی نسترن، پلاک ۱۲، واحد ۴" }) },
    { name: "رسید پرداخت", html: receiptEmail({ name: "رضا", amount: 2_130_000, description: "اشتراک سالانه‌ی پلن حرفه‌ای", reference: "190254873621", card: "4821", gateway: "زرین‌پال", paidAt: new Date(Date.UTC(2026, 10, 14, 9, 42)) }) },
  ];
  return (
    <div className="grid min-h-dvh grid-cols-1 gap-4 bg-background p-4 text-foreground lg:grid-cols-3">
      {samples.map((s) => (
        <div key={s.name} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
          <p className="border-b border-border px-3 py-2 text-xs font-semibold">{s.name}</p>
          <iframe title={s.name} srcDoc={s.html} className="h-[560px] w-full bg-white" />
        </div>
      ))}
    </div>
  );
}
