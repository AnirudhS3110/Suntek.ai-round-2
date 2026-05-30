"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timelogsService } from "@/services/timelogs.service";
import { tasksService } from "@/services/tasks.service";
import { Loader2, Square, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ActiveTimerWidget() {
  const queryClient = useQueryClient();
  const [elapsed, setElapsed] = useState(0);

  const { data: timelogs } = useQuery({
    queryKey: ["timelogs"],
    queryFn: timelogsService.getTimelogs,
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksService.getTasks,
  });

  const activeTimelog = timelogs?.find((log) => !log.endedAt);
  const activeTask = tasks?.find((t) => t.id === activeTimelog?.taskId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimelog && activeTimelog.startedAt) {
      // Calculate initial elapsed time based on how long it's been since it started
      // PLUS any previously recorded time for this task
      const startTime = new Date(activeTimelog.startedAt).getTime();
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const sessionSeconds = Math.floor((now - startTime) / 1000);
        // If the backend doesn't already aggregate the previous time into the active task object, 
        // we just show the session time + total previous time.
        // Assuming task.timeSpent is the total time up to the LAST stopped timer.
        const previousTime = activeTask?.timeSpent || 0;
        setElapsed(previousTime + sessionSeconds);
      };
      
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [activeTimelog, activeTask]);

  const stopTimerMutation = useMutation({
    mutationFn: () => timelogsService.stopTimer(activeTimelog!.taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
      toast.success("Timer stopped");
    },
  });

  if (!activeTimelog || !activeTask) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="glass-panel rounded-full p-2 pr-4 flex items-center gap-4 shadow-2xl border-primary/20 ring-1 ring-primary/30">
        <div className="bg-primary/10 text-primary rounded-full p-2 h-10 w-10 flex items-center justify-center animate-pulse shadow-inner">
          <Clock className="h-5 w-5" />
        </div>
        
        <div className="flex flex-col max-w-[200px] sm:max-w-[300px]">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Tracking Time</span>
          <span className="text-sm font-medium truncate text-foreground">{activeTask.title}</span>
        </div>
        
        <div className="text-xl font-mono font-medium tracking-tighter w-[100px] text-right">
          {formatTime(elapsed)}
        </div>
        
        <div className="pl-2 border-l border-border/50">
          <Button 
            size="icon" 
            variant="destructive" 
            className="h-10 w-10 rounded-full hover:scale-105 transition-transform shadow-md"
            onClick={() => stopTimerMutation.mutate()}
            disabled={stopTimerMutation.isPending}
          >
            {stopTimerMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Square className="h-4 w-4 fill-current" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
