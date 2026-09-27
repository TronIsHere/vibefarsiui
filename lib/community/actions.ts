"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isAdminSession } from "@/lib/analytics/auth";
import { clientIp } from "@/lib/analytics/store";
import { COMMUNITY_ENABLED } from "@/lib/site";
import {
  deleteSubmission,
  imageExt,
  listSubmissions,
  newId,
  saveMedia,
  saveSubmission,
  setStatus,
  submitAllowed,
} from "./store";
import { LIMITS, type Author, type CodeKind } from "./types";

export type SubmitState = { ok: boolean; error?: string };

function text(form: FormData, key: string, max: number): string {
  const raw = form.get(key);
  if (typeof raw !== "string") return "";
  // Drop control characters except newline and tab.
  return raw.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);
}

function handle(raw: string, re: RegExp): string | undefined {
  const h = raw
    .replace(/^https?:\/\/(www\.)?(x|twitter|github)\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/.*$/, "")
    .trim();
  return re.test(h) ? h : undefined;
}

function httpUrl(raw: string): string | undefined {
  if (!raw) return undefined;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
    if (!u.hostname.includes(".")) return undefined;
    return u.href.slice(0, LIMITS.url);
  } catch {
    return undefined;
  }
}

type Checked = { error: string } | { author: Author; title: string; description: string };

async function common(form: FormData): Promise<Checked> {
  if (!COMMUNITY_ENABLED) return { error: "ارسال فعلاً بسته است." };
  // Honeypot: real people never see this field.
  if (text(form, "company", 100)) return { error: "ارسال انجام نشد." };

  const h = await headers();
  if (!submitAllowed(clientIp(h))) {
    return { error: "در یک ساعت گذشته چند بار فرستادید. کمی بعد دوباره امتحان کنید." };
  }
  const pending = await listSubmissions({ status: "pending" });
  if (pending.length >= LIMITS.pendingQueue) {
    return { error: "صف بررسی الان پره. چند روز دیگه دوباره سر بزنید." };
  }

  const title = text(form, "title", LIMITS.title);
  const name = text(form, "name", LIMITS.name);
  if (title.length < 3) return { error: "یک عنوان کوتاه بنویسید." };
  if (name.length < 2) return { error: "اسمتون را بنویسید تا کنار کار نشون داده بشه." };

  const xRaw = text(form, "x", 80);
  const ghRaw = text(form, "github", 80);
  const siteRaw = text(form, "site", LIMITS.url);
  const author: Author = { name };
  if (xRaw) {
    author.x = handle(xRaw, /^[A-Za-z0-9_]{1,15}$/);
    if (!author.x) return { error: "آیدی ایکس درست نیست." };
  }
  if (ghRaw) {
    author.github = handle(ghRaw, /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/);
    if (!author.github) return { error: "یوزرنیم گیت‌هاب درست نیست." };
  }
  if (siteRaw) {
    author.url = httpUrl(siteRaw);
    if (!author.url) return { error: "آدرس سایت شخصی درست نیست." };
  }

  return { author, title, description: text(form, "description", LIMITS.description) };
}

export async function submitCode(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const base = await common(form);
  if ("error" in base) return { ok: false, error: base.error };

  const kindRaw = text(form, "kind", 20);
  const kind: CodeKind = kindRaw === "block" ? "block" : "component";
  const rawCode = form.get("code");
  const code = typeof rawCode === "string" ? rawCode.replace(/\r\n/g, "\n") : "";
  if (!code.trim()) return { ok: false, error: "کد خالیه." };
  if (code.length > LIMITS.code) return { ok: false, error: "کد خیلی طولانیه. حداکثر ۶۰ هزار کاراکتر." };
  if (!/export\s+default/.test(code)) {
    return { ok: false, error: "کد باید یک export default داشته باشه تا در پیش‌نمایش نشون داده بشه." };
  }
  const rawCss = form.get("css");
  const css = typeof rawCss === "string" ? rawCss.trim() : "";
  if (css.length > LIMITS.css) return { ok: false, error: "CSS خیلی طولانیه." };

  await saveSubmission({
    id: newId(),
    kind,
    status: "pending",
    ...base,
    code,
    ...(css ? { css } : {}),
    createdAt: Date.now(),
  });
  revalidatePath("/vf/community");
  return { ok: true };
}

export async function submitShowcase(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const base = await common(form);
  if ("error" in base) return { ok: false, error: base.error };

  const url = httpUrl(text(form, "url", LIMITS.url));
  if (!url) return { ok: false, error: "آدرس سایت درست نیست." };

  const id = newId();
  let image: string | undefined;
  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > LIMITS.imageBytes) return { ok: false, error: "حجم عکس باید کمتر از ۱٫۵ مگابایت باشه." };
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = imageExt(bytes);
    if (!ext) return { ok: false, error: "عکس باید PNG، JPG یا WebP باشه." };
    image = `${id}.${ext}`;
    await saveMedia(image, bytes);
  }

  await saveSubmission({
    id,
    kind: "showcase",
    status: "pending",
    ...base,
    url,
    ...(image ? { image } : {}),
    createdAt: Date.now(),
  });
  revalidatePath("/vf/community");
  return { ok: true };
}

export async function moderate(form: FormData): Promise<void> {
  if (!(await isAdminSession())) throw new Error("Unauthorized");
  const id = String(form.get("id") ?? "");
  const op = String(form.get("op") ?? "");
  if (op === "approve") await setStatus(id, "approved");
  else if (op === "reject") await setStatus(id, "rejected");
  else if (op === "pending") await setStatus(id, "pending");
  else if (op === "delete") await deleteSubmission(id);
  revalidatePath("/vf/community");
  revalidatePath("/community");
  revalidatePath("/showcase");
}
