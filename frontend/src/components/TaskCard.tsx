import { useState } from "react";
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

interface Props {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDropBefore: (draggedTaskId: number, targetTaskId: number, before: boolean) => void;
}

export function TaskCard({ task, onClick, onDelete, onDropBefore }: Props) {
  const [dragOverEdge, setDragOverEdge] = useState<"top" | "bottom" | null>(null);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(task.id));
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const before = e.clientY - rect.top < rect.height / 2;
        setDragOverEdge(before ? "top" : "bottom");
      }}
      onDragLeave={() => setDragOverEdge(null)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const before = dragOverEdge === "top";
        setDragOverEdge(null);
        const draggedId = Number(e.dataTransfer.getData("text/plain"));
        if (draggedId) onDropBefore(draggedId, task.id, before);
      }}
      onClick={() => onClick(task)}
      className={`relative cursor-pointer rounded-md bg-white p-3 shadow-sm hover:shadow-md ${
        dragOverEdge === "top"
          ? "shadow-[0_-3px_0_0_#0369a1]"
          : dragOverEdge === "bottom"
            ? "shadow-[0_3px_0_0_#0369a1]"
            : ""
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task);
        }}
        title="削除"
        className="absolute top-1 right-1.5 leading-none text-slate-400 hover:text-red-500"
      >
        ✕
      </button>
      <div className="mb-1 pr-4 text-sm font-semibold text-slate-800 break-words">
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
