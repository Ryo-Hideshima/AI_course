import { useState } from "react";
import type { Priority } from "../types/task";
import type { CreateTaskInput } from "../api/tasks";

interface Props {
  onCancel: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

export function AddTaskModal({ onCancel, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(null);
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        status: "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "登録に失敗しました");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-90 max-w-[90vw] rounded-lg bg-white p-5">
        <h3 className="mb-3.5 text-base font-semibold text-slate-800">
          カードを追加
        </h3>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-slate-800">
            タイトル(必須)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスク名"
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-slate-800">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="詳細"
            className="min-h-15 w-full resize-y rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-slate-800">
            優先度
          </label>
          <select
            value={priority ?? ""}
            onChange={(e) =>
              setPriority((e.target.value || null) as Priority)
            }
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          >
            <option value="">未設定</option>
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-semibold text-slate-800">
            期限
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded bg-slate-100 px-3.5 py-1.5 text-sm text-slate-800"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded bg-sky-700 px-3.5 py-1.5 text-sm text-white disabled:opacity-60"
          >
            {submitting ? "追加中..." : "追加"}
          </button>
        </div>
      </div>
    </div>
  );
}
