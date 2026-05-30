"use client";

import { useQuery } from "@tanstack/react-query";
import { summaryService } from "@/services/summary.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle2, Circle, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["summary-today"],
    queryFn: summaryService.getTodaySummary,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return "0h 0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const stats = [
    {
      title: "Time Tracked Today",
      value: formatTime(data?.totalTrackedSeconds),
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed Tasks",
      value: data?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Tasks",
      value: data?.pendingTasks || 0,
      icon: Circle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      title: "In Progress",
      value: data?.inProgressTasks || 0,
      icon: ListTodo,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="glass-card shadow-sm border-border/50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="text-2xl font-bold tracking-tight">
                {stat.value}
              </div>
            </div>
            <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", stat.bgColor, stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
