import { isAdminSession } from "@/lib/analytics/auth";
import { getSubmission, MEDIA_RE, readMedia } from "@/lib/community/store";
import { COMMUNITY_ENABLED } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" } as const;

/** Showcase screenshots. Public once the entry is approved; pending ones only for the admin. */
export async function GET(_request: Request, ctx: RouteContext<"/api/community/media/[name]">) {
  const { name } = await ctx.params;
  if (!MEDIA_RE.test(name)) return new Response(null, { status: 404 });

  const item = await getSubmission(name.split(".")[0]);
  if (!item || item.kind !== "showcase" || item.image !== name) return new Response(null, { status: 404 });
  const approved = COMMUNITY_ENABLED && item.status === "approved";
  if (!approved && !(await isAdminSession())) return new Response(null, { status: 404 });

  const bytes = await readMedia(name);
  if (!bytes) return new Response(null, { status: 404 });
  const ext = name.split(".").pop() as keyof typeof TYPES;
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": TYPES[ext],
      "Cache-Control": approved ? "public, max-age=86400" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
