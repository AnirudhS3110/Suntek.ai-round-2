"use client";

import { Task, TaskStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/services/tasks.service";
import { timelogsService } from "@/services/timelogs.service";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Play, Square, Trash2, CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditTaskModal } from "./edit-task-modal";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  isActiveTimer?: boolean;
  isTimerDisabled?: boolean;
}

export function TaskCard({ task, isActiveTimer, isTimerDisabled }: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (status: TaskStatus) => tasksService.updateTask(task.id, { status }),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          ["tasks"],
          previousTasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
        );
      }
      return { previousTasks };
    },
    onError: (err, newStatus, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      toast.error("Failed to update task status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksService.deleteTask(task.id),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
    },
  });

  const startTimerMutation = useMutation({
    mutationFn: () => timelogsService.startTimer(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to start timer");
    },
  });

  const stopTimerMutation = useMutation({
    mutationFn: () => timelogsService.stopTimer(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to stop timer");
    },
  });

  const formatTimeSpent = (seconds?: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const statusConfig = {
    PENDING: { label: "Pending", color: "bg-muted text-muted-foreground", icon: Circle },
    IN_PROGRESS: { label: "In Progress", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
    COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
  };

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <Card className={cn(
      "group transition-all duration-300 border border-border/50 bg-card/40 backdrop-blur-sm hover:shadow-md hover:border-border overflow-hidden",
      isActiveTimer && "ring-1 ring-primary shadow-sm shadow-primary/20 bg-primary/5 border-primary/20"
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0 relative">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className={cn(
            "font-medium text-base truncate transition-colors",
            task.status === "COMPLETED" && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              Edit Task Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => updateStatusMutation.mutate("PENDING")}>
              Mark as Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatusMutation.mutate("IN_PROGRESS")}>
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatusMutation.mutate("COMPLETED")}>
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteMutation.mutate()} 
              className="text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <EditTaskModal 
        task={task} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
      <CardFooter className="p-4 pt-4 flex items-center justify-between border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", statusConfig[task.status].color)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[task.status].label}
          </Badge>
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatTimeSpent(task.timeSpent)}
          </div>
        </div>
        
        {task.status !== "COMPLETED" && (
          <div>
            {isActiveTimer ? (
              <Button 
                size="sm" 
                variant="destructive" 
                className="h-8 rounded-full px-4 animate-pulse shadow-sm shadow-destructive/20"
                onClick={() => stopTimerMutation.mutate()}
                disabled={stopTimerMutation.isPending}
              >
                {stopTimerMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Square className="h-3.5 w-3.5 mr-1 fill-current" />
                    Stop
                  </>
                )}
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-8 rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => startTimerMutation.mutate()}
                disabled={isTimerDisabled || startTimerMutation.isPending}
              >
                {startTimerMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1 fill-current" />
                    Start
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
