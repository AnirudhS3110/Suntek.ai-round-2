import { TaskList } from "@/features/tasks/components/task-list";

export const metadata = {
  title: "Tasks | Tracker",
  description: "Manage your tasks and track time",
};

export default function TasksPage() {
  return (
    <div className="py-6 animate-in fade-in duration-500">
      <TaskList />
    </div>
  );
}
