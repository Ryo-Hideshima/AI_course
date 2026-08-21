import { useEffect, useState } from "react";
import { createTask, fetchTasks, type CreateTaskInput } from "./api/tasks";
import { AddTaskModal } from "./components/AddTaskModal";
import { Board } from "./components/Board";
import type { Task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-sky-700 p-6">
      <h1 className="mb-4 text-xl font-semibold text-white">タスクボード</h1>
      {loading && <p className="text-white">読み込み中...</p>}
      {error && <p className="text-red-100">{error}</p>}
      {!loading && !error && (
        <Board tasks={tasks} onAddClick={setAddingColumnId} />
      )}
      {addingColumnId && (
        <AddTaskModal
          onCancel={() => setAddingColumnId(null)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

export default App;
