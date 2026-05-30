"use client";

import { useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSocketEvents() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTimerStarted = (data: any) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
      toast.info("A timer was started.");
    };

    const handleTimerStopped = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["timelogs"] });
      queryClient.invalidateQueries({ queryKey: ["summary-today"] });
      queryClient.invalidateQueries({ queryKey: ["summary-weekly"] });
      toast.success("Timer stopped.");
    };

    socket.on("timerStarted", handleTimerStarted);
    socket.on("timerStopped", handleTimerStopped);

    return () => {
      socket.off("timerStarted", handleTimerStarted);
      socket.off("timerStopped", handleTimerStopped);
    };
  }, [socket, isConnected, queryClient]);
}
