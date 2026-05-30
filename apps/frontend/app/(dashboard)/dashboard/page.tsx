import { StatsCards } from "@/features/summary/components/stats-cards";
import { ProductivityChart } from "@/features/summary/components/productivity-chart";
import { TaskList } from "@/features/tasks/components/task-list";

export const metadata = {
  title: "Dashboard | Tracker",
  description: "Overview of your tasks and productivity",
};

export default function DashboardPage() {
  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here's what's happening with your projects today.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProductivityChart />
        </div>
        <div className="lg:col-span-1 glass-card rounded-xl p-6 border-border/50 shadow-sm h-[400px]">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center h-[280px] text-center text-muted-foreground">
            <p className="text-sm">Activity feed coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
