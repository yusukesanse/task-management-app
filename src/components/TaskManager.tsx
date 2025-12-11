"use client";

import { useState, useEffect, useCallback } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { tasksApi, Task } from "@/lib/supabase";

export type { Task };

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabaseからタスクを読み込む
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tasksApi.getAll();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError("タスクの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // タスクを追加
  const addTask = useCallback(async (title: string) => {
    try {
      setError(null);
      const newTask = await tasksApi.create(title.trim());
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error("Failed to add task:", err);
      setError("タスクの追加に失敗しました");
    }
  }, []);

  // タスクの完了状態を切り替え
  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      setError(null);
      const updatedTask = await tasksApi.toggleComplete(id, !task.completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Failed to toggle task:", err);
      setError("タスクの更新に失敗しました");
    }
  }, [tasks]);

  // タスクを削除
  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("タスクの削除に失敗しました");
    }
  }, []);

  // 完了したタスクをすべて削除
  const clearCompleted = useCallback(async () => {
    try {
      setError(null);
      await tasksApi.deleteCompleted();
      setTasks((prev) => prev.filter((task) => !task.completed));
    } catch (err) {
      console.error("Failed to clear completed:", err);
      setError("完了済みタスクの削除に失敗しました");
    }
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskInput onAdd={addTask} />

      {/* エラー表示 */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 統計情報 */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex gap-4 text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              残り: <span className="font-semibold text-blue-500">{pendingCount}</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              完了: <span className="font-semibold text-emerald-500">{completedCount}</span>
            </span>
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
            >
              完了済みを削除
            </button>
          )}
        </div>
      )}

      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />

      {tasks.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-slate-500 dark:text-slate-400">
            タスクがありません。<br />
            上の入力欄から新しいタスクを追加しましょう！
          </p>
        </div>
      )}
    </div>
  );
}
