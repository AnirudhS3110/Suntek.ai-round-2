import { api } from "@/lib/axios";
import { TimeLog } from "@/types";

export const timelogsService = {
  async getTimelogs(): Promise<TimeLog[]> {
    const res = await api.get("/timelogs");
    return res.data;
  },

  async startTimer(taskId: string): Promise<TimeLog> {
    const res = await api.post("/timelogs/start", { taskId });
    return res.data;
  },

  async stopTimer(taskId: string): Promise<TimeLog> {
    const res = await api.post("/timelogs/stop", { taskId });
    return res.data;
  },
};
