"use client";

import { useAuth } from "@/contexts/AuthContext";
import TaskManager from "@/components/TaskManager";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import { isSupabaseConfigured } from "@/lib/supabase";

function SetupGuide() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h2 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">
              Supabaseの設定が必要です
            </h2>
            <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
              アプリを使用するには、Supabaseの環境変数を設定してください。
            </p>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                1. プロジェクトルートに <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">.env.local</code> ファイルを作成：
              </p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs overflow-x-auto mb-4">
{`NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクトID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon-key`}
              </pre>
              
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                2. Supabaseダッシュボードから取得：
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Settings → API → Project URL と anon key をコピー
              </p>
              
              <p className="font-medium text-slate-700 dark:text-slate-300">
                3. 開発サーバーを再起動してください
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-2">
            タスク管理
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {!isSupabaseConfigured
              ? "Supabaseの設定を完了してください"
              : user
              ? "シンプルで使いやすいタスク管理アプリ"
              : "ログインしてタスクを管理しましょう"}
          </p>
        </header>

        {!isSupabaseConfigured ? (
          <SetupGuide />
        ) : user ? (
          <>
            <Header />
            <TaskManager />
          </>
        ) : (
          <AuthForm />
        )}
      </div>
    </main>
  );
}
