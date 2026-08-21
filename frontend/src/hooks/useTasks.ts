import { useEffect, useState } from "react";
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  fetchTasks,
  moveTask as apiMoveTask,
  updateTask as apiUpdateTask,
  type CreateTaskInput,
} from "../api/tasks";
import type { Task } from "../types/task";

// タスク一覧の取得・作成・更新・削除・並び替えをまとめて扱うフック。
// 並び替えはサーバー側で列内のposition値を再計算するため、移動後は再取得して同期する。
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetchTasks()
      .then((data) => {
        if (!ignore) setTasks(data);
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const reload = async () => {
    try {
      setTasks(await fetchTasks());
    } catch (e) {
      setError(e instanceof Error ? e.message : "タスクの再取得に失敗しました");
    }
  };

  const create = async (input: CreateTaskInput) => {
    const created = await apiCreateTask(input);
    setTasks((prev) => [...prev, created]);
    return created;
  };

  const update = async (id: number, input: CreateTaskInput) => {
    const updated = await apiUpdateTask(id, input);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  };

  const remove = async (id: number) => {
    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const moveToEnd = async (taskId: number, status: string) => {
    try {
      await apiMoveTask(taskId, status, null);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "並び替えに失敗しました");
    }
  };

  const moveBefore = async (
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
      await apiMoveTask(draggedTaskId, targetTask.status, beforeTaskId);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "並び替えに失敗しました");
    }
  };

  return { tasks, loading, error, create, update, remove, moveToEnd, moveBefore };
}
