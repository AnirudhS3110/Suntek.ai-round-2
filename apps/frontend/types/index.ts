export type User = {
  id: string;
  email: string;
  username: string;
};

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  timeSpent?: number; // Total time spent in seconds
};

export type TimeLog = {
  id: string;
  taskId: string;
  userId: string;
  startedAt: string;
  endedAt?: string | null;
  durationSeconds?: number | null;
};

export type SummaryToday = {
  totalTrackedSeconds: number; // in seconds
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  workedTasks: Task[];
};

export type SummaryWeekly = {
  date: string; // YYYY-MM-DD
  totalDuration: number; // in seconds
}[];
