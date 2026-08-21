import type { Task } from "../types/task";
import { TaskCard } from "./TaskCard";

interface Props {
  columnId: string;
  title: string;
  tasks: Task[];
  onAddClick: (columnId: string) => void;
}

export function Column({ columnId, title, tasks, onAddClick }: Props) {
  return (
    <div className="w-70 shrink-0 rounded-lg bg-slate-100 p-2.5">
      <h2 className="mb-2.5 px-1 text-sm font-semibold text-slate-800">
        {title}
      </h2>
      <div className="mb-2 flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAddClick(columnId)}
        className="w-full rounded px-1.5 py-2 text-left text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-800"
      >
        + カードを追加
      </button>
    </div>
  );
}
