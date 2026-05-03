import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      task_history: {
        Row: {
          id: string;
          user_id: string;
          instruction: string;
          status: "pending" | "running" | "completed" | "failed";
          steps: string[];
          result: string | null;
          created_at: string;
          updated_at: string;
          tools_used: string[];
          duration_seconds: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["task_history"]["Row"], "id" | "created_at" | "updated_at">;
      };
      user_integrations: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          access_token: string;
          refresh_token: string | null;
          expires_at: string | null;
          connected: boolean;
          created_at: string;
        };
      };
    };
  };
};
