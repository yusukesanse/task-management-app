"use client";

import { Task } from "./TaskManager";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
        task.completed
          ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10"
          : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700"
      }`}
    >
      {/* チェックボックス */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        }`}
        aria-label={task.completed ? "未完了にする" : "完了にする"}
      >
        {task.completed && (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* タスクタイトル */}
      <span
        className={`flex-1 text-lg transition-all duration-200 ${
          task.completed
            ? "text-slate-400 dark:text-slate-500 line-through"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {task.title}
      </span>

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="削除"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
