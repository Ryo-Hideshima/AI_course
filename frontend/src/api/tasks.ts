import type { Priority, Task } from "../types/task";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error(`タスクの取得に失敗しました (status: ${res.status})`);
  }
  return res.json();
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  status: string;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`タスクの登録に失敗しました (status: ${res.status})`);
  }
  return res.json();
}

export type UpdateTaskInput = CreateTaskInput;

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`タスクの更新に失敗しました (status: ${res.status})`);
  }
  return res.json();
}

export async function moveTask(
  id: number,
  status: string,
  beforeTaskId: number | null,
): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}/move`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, beforeTaskId }),
  });
  if (!res.ok) {
    throw new Error(`タスクの並び替えに失敗しました (status: ${res.status})`);
  }
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`タスクの削除に失敗しました (status: ${res.status})`);
  }
}
