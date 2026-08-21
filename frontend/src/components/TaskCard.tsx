import type { Task } from "../types/task";

const PRIORITY_LABEL: Record<string, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const PRIORITY_CLASS: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-400 text-slate-900",
  high: "bg-red-500",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-md bg-white p-3 shadow-sm">
      <div className="mb-1 text-sm font-semibold text-slate-800 break-words">
        {task.title}
      </div>
      {task.description && (
        <div className="mb-2 whitespace-pre-wrap break-words text-xs text-slate-500">
          {task.description}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {task.priority && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white ${PRIORITY_CLASS[task.priority] ?? "bg-slate-400"}`}
          >
            {PRIORITY_LABEL[task.priority] ?? task.priority}
          </span>
        )}
        {task.dueDate && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
            {task.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}
