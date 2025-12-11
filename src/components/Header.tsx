"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <header className="flex items-center justify-between mb-8 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
          {user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
          {user.email}
        </span>
      </div>
      <button
        onClick={signOut}
        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
      >
        ログアウト
      </button>
    </header>
  );
}


