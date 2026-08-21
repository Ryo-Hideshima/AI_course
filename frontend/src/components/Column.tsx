import type { Task } from "../types/task";
import { TaskCard } from "./TaskCard";

export function Column({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div className="w-70 shrink-0 rounded-lg bg-slate-100 p-2.5">
      <h2 className="mb-2.5 px-1 text-sm font-semibold text-slate-800">
        {title}
      </h2>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
