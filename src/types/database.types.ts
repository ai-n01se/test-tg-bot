export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ADMIN_PROFILES: {
        Row: {
          created_at: string
          id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ADMIN_PROFILES_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "PROFILES"
            referencedColumns: ["id"]
          },
        ]
      }
      BALANCE_TRANSACTIONS: {
        Row: {
          amount: number
          created_at: string
          id: number
          payment_id: number | null
          relation_id: number
          slot_id: number | null
          type: Database["public"]["Enums"]["balance_transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          payment_id?: number | null
          relation_id: number
          slot_id?: number | null
          type: Database["public"]["Enums"]["balance_transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          payment_id?: number | null
          relation_id?: number
          slot_id?: number | null
          type?: Database["public"]["Enums"]["balance_transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "BALANCE_TRANSACTIONS_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "PAYMENTS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BALANCE_TRANSACTIONS_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "STUDENT_TEACHER_RELATIONS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BALANCE_TRANSACTIONS_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "SLOTS"
            referencedColumns: ["id"]
          },
        ]
      }
      PAYMENTS: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string
          id: number
          relation_id: number
          screenshot_file_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string
          id?: number
          relation_id: number
          screenshot_file_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string
          id?: number
          relation_id?: number
          screenshot_file_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "PAYMENTS_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "STUDENT_TEACHER_RELATIONS"
            referencedColumns: ["id"]
          },
        ]
      }
      PROFILES: {
        Row: {
          created_at: string
          full_name: string
          id: number
          telegram_id: number
          username_tg: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: number
          telegram_id: number
          username_tg: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: number
          telegram_id?: number
          username_tg?: string
        }
        Relationships: []
      }
      SLOTS: {
        Row: {
          appointment_time: string
          created_at: string
          duration_minutes: number
          id: number
          relation_id: number | null
          reminder_sent: boolean
          status: Database["public"]["Enums"]["status"]
          teacher_id: number
        }
        Insert: {
          appointment_time: string
          created_at?: string
          duration_minutes?: number
          id?: number
          relation_id?: number | null
          reminder_sent?: boolean
          status?: Database["public"]["Enums"]["status"]
          teacher_id: number
        }
        Update: {
          appointment_time?: string
          created_at?: string
          duration_minutes?: number
          id?: number
          relation_id?: number | null
          reminder_sent?: boolean
          status?: Database["public"]["Enums"]["status"]
          teacher_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "SLOTS_relation_id_fkey"
            columns: ["relation_id"]
            isOneToOne: false
            referencedRelation: "STUDENT_TEACHER_RELATIONS"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SLOTS_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "TEACHER_PROFILES"
            referencedColumns: ["id"]
          },
        ]
      }
      STUDENT_TEACHER_RELATIONS: {
        Row: {
          balance: number
          created_at: string
          id: number
          teacher_id: number
          users_id: number
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: number
          teacher_id: number
          users_id: number
        }
        Update: {
          balance?: number
          created_at?: string
          id?: number
          teacher_id?: number
          users_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "STUDENT_TEACHER_RELATIONS_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "TEACHER_PROFILES"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "STUDENT_TEACHER_RELATIONS_users_id_fkey"
            columns: ["users_id"]
            isOneToOne: false
            referencedRelation: "PROFILES"
            referencedColumns: ["id"]
          },
        ]
      }
      TEACHER_PROFILES: {
        Row: {
          bio: string | null
          created_at: string
          full_name_teacher: string | null
          id: number
          is_public: boolean
          number_card: string | null
          price_per_lesson: number
          subjects: string | null
          subscription_expires_at: string | null
          subscription_status: boolean
          user_id: number
          working_hours: Json | null
          zoom_link: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name_teacher?: string | null
          id?: number
          is_public?: boolean
          number_card?: string | null
          price_per_lesson?: number
          subjects?: string | null
          subscription_expires_at?: string | null
          subscription_status?: boolean
          user_id: number
          working_hours?: Json | null
          zoom_link?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name_teacher?: string | null
          id?: number
          is_public?: boolean
          number_card?: string | null
          price_per_lesson?: number
          subjects?: string | null
          subscription_expires_at?: string | null
          subscription_status?: boolean
          user_id?: number
          working_hours?: Json | null
          zoom_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TEACHER_PROFILES_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "PROFILES"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      balance_transaction_type: "topup" | "lesson_charge" | "refund" | "manual"
      payment_status: "pending" | "confirmed" | "rejected"
      status: "free" | "booked" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      balance_transaction_type: ["topup", "lesson_charge", "refund", "manual"],
      payment_status: ["pending", "confirmed", "rejected"],
      status: ["free", "booked", "completed"],
    },
  },
} as const
