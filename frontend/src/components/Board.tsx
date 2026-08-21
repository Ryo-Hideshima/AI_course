import type { Task } from "../types/task";
import { Column } from "./Column";

const COLUMNS = [
  { id: "todo", title: "未着手" },
  { id: "doing", title: "進行中" },
  { id: "done", title: "完了" },
];

export function Board({ tasks }: { tasks: Task[] }) {
  return (
    <div className="flex items-start gap-4">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          title={col.title}
          tasks={tasks.filter((t) => t.status === col.id)}
        />
      ))}
    </div>
  );
}
