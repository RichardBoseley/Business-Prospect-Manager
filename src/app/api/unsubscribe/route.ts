import { NextRequest, NextResponse } from "next/server";
import { addToDnc } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe endpoint linked from every outbound email footer.
 * Writes a permanent DNC entry (Spam Act 2003). Deliberately unauthenticated —
 * recipients must be able to unsubscribe without logging in.
 */
export function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get("b");
  if (!businessId) {
    return NextResponse.json({ error: "missing b parameter" }, { status: 400 });
  }
  const date = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const entry = addToDnc(businessId, "Unsubscribed via link", date);
  if (!entry) {
    return NextResponse.json({ error: "unknown business" }, { status: 404 });
  }
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><title>Unsubscribed</title>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;color:#0A1628">
<h1 style="font-size:22px">You're unsubscribed</h1>
<p style="color:#6C757D;line-height:1.6">${entry.businessName} has been permanently removed from all current and future campaigns. You won't hear from us again.</p>
</body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
