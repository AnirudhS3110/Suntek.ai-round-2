"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ActiveTimerWidget } from "@/features/time-tracking/components/active-timer-widget";
import { useSocketEvents } from "@/hooks/use-socket-events";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  useSocketEvents();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <ActiveTimerWidget />
    </div>
  );
}
