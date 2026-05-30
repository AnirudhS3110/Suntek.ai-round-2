import { api } from "@/lib/axios";
import { Task } from "@/types";

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    const res = await api.get("/tasks");
    return res.data;
  },

  async createTask(data: { title: string; description?: string }): Promise<Task> {
    const res = await api.post("/tasks", data);
    return res.data;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
