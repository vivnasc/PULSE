"use client";

import { BottomNav } from "./bottom-nav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
