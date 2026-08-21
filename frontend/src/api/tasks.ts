import type { Task } from "../types/task";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error(`タスクの取得に失敗しました (status: ${res.status})`);
  }
  return res.json();
}
