import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されているかチェック
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// ダミークライアント（環境変数未設定時用）
const dummyClient = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
    update: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
    delete: () => Promise.resolve({ error: new Error("Supabase not configured") }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    getUser: () => Promise.resolve({ data: { user: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ error: new Error("Supabase not configured") }),
    signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured") }),
    signOut: () => Promise.resolve({}),
  },
} as unknown as SupabaseClient;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : dummyClient;

// タスクの型定義
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

// タスク関連のAPI関数
export const tasksApi = {
  // 全タスクを取得（RLSでユーザーのタスクのみ取得される）
  async getAll(): Promise<Task[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }

    return data || [];
  },

  // タスクを追加
  async create(title: string): Promise<Task> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase not configured");
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, completed: false, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw error;
    }

    return data;
  },

  // タスクの完了状態を更新
  async toggleComplete(id: string, completed: boolean): Promise<Task> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase not configured");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      throw error;
    }

    return data;
  },

  // タスクを削除
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase not configured");
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // 完了済みタスクを全削除
  async deleteCompleted(): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase not configured");
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("completed", true);

    if (error) {
      console.error("Error deleting completed tasks:", error);
      throw error;
    }
  },
};
