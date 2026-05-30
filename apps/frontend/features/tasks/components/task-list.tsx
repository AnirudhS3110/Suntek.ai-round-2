"use client";

import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import { timelogsService } from "@/services/timelogs.service";
import { TaskCard } from "./task-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTaskModal } from "./create-task-modal";
import { CheckSquare } from "lucide-react";

export function TaskList() {
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksService.getTasks,
  });

  const { data: timelogs, isLoading: isTimelogsLoading } = useQuery({
    queryKey: ["timelogs"],
    queryFn: timelogsService.getTimelogs,
  });

  const isLoading = isTasksLoading || isTimelogsLoading;

  // Find the active timer (a timelog with no endedAt)
  const activeTimelog = timelogs?.find((log) => !log.endedAt);
  const activeTaskId = activeTimelog?.taskId;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const sortedTasks = [...(tasks || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your daily tasks and track your time.
          </p>
        </div>
        <CreateTaskModal />
      </div>

      {tasks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-2xl border-dashed">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckSquare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first task to start tracking your time and boosting productivity.
          </p>
          <CreateTaskModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isActiveTimer={activeTaskId === task.id}
              isTimerDisabled={!!activeTaskId && activeTaskId !== task.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
