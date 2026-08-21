import { useEffect, useState } from "react";
import { fetchTasks } from "./api/tasks";
import { Board } from "./components/Board";
import type { Task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-sky-700 p-6">
      <h1 className="mb-4 text-xl font-semibold text-white">タスクボード</h1>
      {loading && <p className="text-white">読み込み中...</p>}
      {error && <p className="text-red-100">{error}</p>}
      {!loading && !error && <Board tasks={tasks} />}
    </div>
  );
}

export default App;
