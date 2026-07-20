import { NextResponse } from "next/server";
import { getWorkspaceBootstrap } from "@/lib/db/repository";
import { isAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    authEnabled: isAuthConfigured(),
    ...getWorkspaceBootstrap(),
  });
}
