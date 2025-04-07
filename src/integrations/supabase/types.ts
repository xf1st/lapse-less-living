export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_at: string | null
          achievement_number: number | null
          days: number
          habit_id: string
          id: string
          type: string
          user_id: string
          viewed: boolean | null
        }
        Insert: {
          achieved_at?: string | null
          achievement_number?: number | null
          days: number
          habit_id: string
          id?: string
          type: string
          user_id: string
          viewed?: boolean | null
        }
        Update: {
          achieved_at?: string | null
          achievement_number?: number | null
          days?: number
          habit_id?: string
          id?: string
          type?: string
          user_id?: string
          viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      habit_entries: {
        Row: {
          completed_at: string | null
          habit_id: string
          id: string
          is_relapse: boolean | null
          notes: string | null
        }
        Insert: {
          completed_at?: string | null
          habit_id: string
          id?: string
          is_relapse?: boolean | null
          notes?: string | null
        }
        Update: {
          completed_at?: string | null
          habit_id?: string
          id?: string
          is_relapse?: boolean | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_entries_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_folders: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          color: string | null
          created_at: string | null
          current_streak: number | null
          description: string | null
          folder_id: string | null
          frequency: string
          id: string
          longest_streak: number | null
          name: string
          plan_id: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          current_streak?: number | null
          description?: string | null
          folder_id?: string | null
          frequency: string
          id?: string
          longest_streak?: number | null
          name: string
          plan_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          current_streak?: number | null
          description?: string | null
          folder_id?: string | null
          frequency?: string
          id?: string
          longest_streak?: number | null
          name?: string
          plan_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "habit_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          has_achievements: boolean | null
          has_statistics: boolean | null
          id: string
          max_habits: number
          name: string
          price: number | null
        }
        Insert: {
          has_achievements?: boolean | null
          has_statistics?: boolean | null
          id: string
          max_habits: number
          name: string
          price?: number | null
        }
        Update: {
          has_achievements?: boolean | null
          has_statistics?: boolean | null
          id?: string
          max_habits?: number
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          telegram_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          telegram_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          telegram_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          last_sign_in_at: string
        }[]
      }
      get_user_email_by_telegram_id: {
        Args: {
          telegram_id_param: string
        }
        Returns: {
          email: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
