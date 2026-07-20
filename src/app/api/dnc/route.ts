import { NextRequest, NextResponse } from "next/server";
import { addToDnc } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

/** Manual do-not-contact addition from the lead drawer. Permanent. */
export async function POST(req: NextRequest) {
  const { businessId } = (await req.json()) as { businessId?: string };
  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }
  const date = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const entry = addToDnc(businessId, "Manual — added from lead detail", date);
  if (!entry) {
    return NextResponse.json({ error: "unknown business" }, { status: 404 });
  }
  return NextResponse.json({ entry });
}
