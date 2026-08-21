import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  moveTask,
  updateTask,
  type CreateTaskInput,
} from "./api/tasks";
import { Board } from "./components/Board";
import { TaskFormModal } from "./components/TaskFormModal";
import type { Task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (input: CreateTaskInput) => {
    if (!addingColumnId) return;
    const created = await createTask({ ...input, status: addingColumnId });
    setTasks((prev) => [...prev, created]);
    setAddingColumnId(null);
  };

  const handleEditSubmit = async (input: CreateTaskInput) => {
    if (!editingTask) return;
    const updated = await updateTask(editingTask.id, input);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const handleDropAtEnd = async (taskId: number, columnId: string) => {
    try {
      await moveTask(taskId, columnId, null);
      setTasks(await fetchTasks());
    } catch (e) {
      setError(e instanceof Error ? e.message : "並び替えに失敗しました");
    }
  };

  const handleDropBefore = async (
    draggedTaskId: number,
    targetTaskId: number,
    before: boolean,
  ) => {
    const targetTask = tasks.find((t) => t.id === targetTaskId);
    if (!targetTask || draggedTaskId === targetTaskId) return;

    const columnTasks = tasks
      .filter((t) => t.status === targetTask.status)
      .sort((a, b) => a.position - b.position);
    const targetIndex = columnTasks.findIndex((t) => t.id === targetTaskId);

    let beforeTaskId: number | null;
    if (before) {
      beforeTaskId = targetTaskId;
    } else {
      const next = columnTasks[targetIndex + 1];
      beforeTaskId = next && next.id !== draggedTaskId ? next.id : null;
    }

    try {
      await moveTask(draggedTaskId, targetTask.status, beforeTaskId);
      setTasks(await fetchTasks());
    } catch (e) {
      setError(e instanceof Error ? e.message : "並び替えに失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-sky-700 p-6">
      <h1 className="mb-4 text-xl font-semibold text-white">タスクボード</h1>
      {loading && <p className="text-white">読み込み中...</p>}
      {error && <p className="text-red-100">{error}</p>}
      {!loading && !error && (
        <Board
          tasks={tasks}
          onAddClick={setAddingColumnId}
          onCardClick={setEditingTask}
          onDeleteTask={handleDeleteTask}
          onDropAtEnd={handleDropAtEnd}
          onDropBefore={handleDropBefore}
        />
      )}
      {addingColumnId && (
        <TaskFormModal
          heading="カードを追加"
          submitLabel="追加"
          initialValues={{
            title: "",
            description: "",
            priority: null,
            dueDate: "",
            status: addingColumnId,
          }}
          onCancel={() => setAddingColumnId(null)}
          onSubmit={handleCreate}
        />
      )}
      {editingTask && (
        <TaskFormModal
          heading="カードを編集"
          submitLabel="保存"
          showStatus
          initialValues={{
            title: editingTask.title,
            description: editingTask.description ?? "",
            priority: editingTask.priority,
            dueDate: editingTask.dueDate ?? "",
            status: editingTask.status,
          }}
          onCancel={() => setEditingTask(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}

export default App;
