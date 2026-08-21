export type Priority = "low" | "medium" | "high" | null;

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  status: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
