"use client";

import type { ReactNode } from "react";
import { AppProvider } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { LeadDrawer } from "./LeadDrawer";
import { PromotionWizard } from "./PromotionWizard";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: 224, minWidth: 0 }}>{children}</main>
      </div>
      <PromotionWizard />
      <LeadDrawer />
    </AppProvider>
  );
}
