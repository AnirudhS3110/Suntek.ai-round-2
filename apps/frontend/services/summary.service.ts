import { api } from "@/lib/axios";
import { SummaryToday, SummaryWeekly } from "@/types";

export const summaryService = {
  async getTodaySummary(): Promise<SummaryToday> {
    const res = await api.get("/summary/today");
    return res.data;
  },

  async getWeeklySummary(): Promise<SummaryWeekly> {
    const res = await api.get("/summary/weekly");
    return res.data;
  },
};
