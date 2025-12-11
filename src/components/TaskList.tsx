"use client";

import { Task } from "./TaskManager";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }

  // 未完了タスクを上に、完了タスクを下に表示
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <ul className="space-y-3">
      {sortedTasks.map((task, index) => (
        <li
          key={task.id}
          style={{
            animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both`,
          }}
        >
          <TaskItem task={task} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ul>
  );
}
