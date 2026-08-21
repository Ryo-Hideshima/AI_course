import { useState } from "react";
import type { Task } from "../types/task";
import { TaskCard } from "./TaskCard";

interface Props {
  columnId: string;
  title: string;
  tasks: Task[];
  onAddClick: (columnId: string) => void;
  onCardClick: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onDropAtEnd: (taskId: number, columnId: string) => void;
  onDropBefore: (draggedTaskId: number, targetTaskId: number, before: boolean) => void;
}

export function Column({
  columnId,
  title,
  tasks,
  onAddClick,
  onCardClick,
  onDeleteTask,
  onDropAtEnd,
  onDropBefore,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = Number(e.dataTransfer.getData("text/plain"));
        if (taskId) onDropAtEnd(taskId, columnId);
      }}
      className={`w-70 shrink-0 rounded-lg bg-slate-100 p-2.5 ${dragOver ? "outline-2 outline-sky-500" : ""}`}
    >
      <h2 className="mb-2.5 px-1 text-sm font-semibold text-slate-800">
        {title}
      </h2>
      <div className="mb-2 flex flex-col gap-2">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onCardClick}
            onDelete={onDeleteTask}
            onDropBefore={onDropBefore}
          />
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
