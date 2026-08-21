import { useState } from "react";
import type { CreateTaskInput } from "./api/tasks";
import { Board } from "./components/Board";
import { TaskFormModal } from "./components/TaskFormModal";
import { useTasks } from "./hooks/useTasks";
import type { Task } from "./types/task";

function App() {
  const { tasks, loading, error, create, update, remove, moveToEnd, moveBefore } =
    useTasks();
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = async (input: CreateTaskInput) => {
    if (!addingColumnId) return;
    await create({ ...input, status: addingColumnId });
    setAddingColumnId(null);
  };

  const handleEditSubmit = async (input: CreateTaskInput) => {
    if (!editingTask) return;
    await update(editingTask.id, input);
    setEditingTask(null);
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
          onDeleteTask={(task) => remove(task.id)}
          onDropAtEnd={moveToEnd}
          onDropBefore={moveBefore}
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
