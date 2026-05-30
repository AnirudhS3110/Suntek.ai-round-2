"use client";

import { useQuery } from "@tanstack/react-query";
import { summaryService } from "@/services/summary.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

export function ProductivityChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["summary-weekly"],
    queryFn: summaryService.getWeeklySummary,
  });

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map((day) => {
    // Parse the date (YYYY-MM-DD) and get abbreviated day name (Mon, Tue, etc.)
    const parsedDate = parseISO(day.date);
    const dayName = format(parsedDate, "EEE");
    
    return {
      name: dayName,
      hours: Number((day.totalDuration / 3600).toFixed(2)),
      fullDate: format(parsedDate, "MMM d, yyyy"),
    };
  }) || [];

  return (
    <Card className="glass-card shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>Weekly Productivity</CardTitle>
        <CardDescription>Time tracked over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={100}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl">
                        <p className="text-[13px] font-medium mb-1 text-muted-foreground">{payload[0].payload.fullDate}</p>
                        <p className="text-sm font-semibold text-primary">
                          {payload[0].value} hours
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="hours" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
