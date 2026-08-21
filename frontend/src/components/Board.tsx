import type { Task } from "../types/task";
import { Column } from "./Column";

export const COLUMNS = [
  { id: "todo", title: "未着手" },
  { id: "doing", title: "進行中" },
  { id: "done", title: "完了" },
];

interface Props {
  tasks: Task[];
  onAddClick: (columnId: string) => void;
}

export function Board({ tasks, onAddClick }: Props) {
  return (
    <div className="flex items-start gap-4">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          columnId={col.id}
          title={col.title}
          tasks={tasks.filter((t) => t.status === col.id)}
          onAddClick={onAddClick}
        />
      ))}
    </div>
  );
}
