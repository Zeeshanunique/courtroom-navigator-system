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
      cases: {
        Row: {
          case_number: string | null
          created_at: string
          defendant: string | null
          description: string | null
          filed_by: string
          id: string
          judge_id: string | null
          plaintiff: string | null
          priority: Database["public"]["Enums"]["case_priority"]
          status: Database["public"]["Enums"]["case_status"]
          title: string
          type: Database["public"]["Enums"]["case_type"]
          updated_at: string
        }
        Insert: {
          case_number?: string | null
          created_at?: string
          defendant?: string | null
          description?: string | null
          filed_by: string
          id?: string
          judge_id?: string | null
          plaintiff?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          type: Database["public"]["Enums"]["case_type"]
          updated_at?: string
        }
        Update: {
          case_number?: string | null
          created_at?: string
          defendant?: string | null
          description?: string | null
          filed_by?: string
          id?: string
          judge_id?: string | null
          plaintiff?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          type?: Database["public"]["Enums"]["case_type"]
          updated_at?: string
        }
        Relationships: []
      }
      decisions: {
        Row: {
          case_id: string
          content: string
          created_at: string
          decided_by: string
          document_id: string | null
          id: string
          title: string
        }
        Insert: {
          case_id: string
          content: string
          created_at?: string
          decided_by: string
          document_id?: string | null
          id?: string
          title: string
        }
        Update: {
          case_id?: string
          content?: string
          created_at?: string
          decided_by?: string
          document_id?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decisions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          description: string | null
          file_path: string
          file_size: string
          file_type: string
          id: string
          name: string
          uploaded_by: string
        }
        Insert: {
          case_id: string
          category: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          file_path: string
          file_size: string
          file_type: string
          id?: string
          name: string
          uploaded_by: string
        }
        Update: {
          case_id?: string
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: string
          file_type?: string
          id?: string
          name?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      hearing_participants: {
        Row: {
          hearing_id: string
          id: string
          is_required: boolean | null
          notification_sent: boolean | null
          role: string
          user_id: string
        }
        Insert: {
          hearing_id: string
          id?: string
          is_required?: boolean | null
          notification_sent?: boolean | null
          role: string
          user_id: string
        }
        Update: {
          hearing_id?: string
          id?: string
          is_required?: boolean | null
          notification_sent?: boolean | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hearing_participants_hearing_id_fkey"
            columns: ["hearing_id"]
            isOneToOne: false
            referencedRelation: "hearings"
            referencedColumns: ["id"]
          },
        ]
      }
      hearings: {
        Row: {
          case_id: string
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number
          id: string
          location: string | null
          notes: string | null
          scheduled_date: string
          status: Database["public"]["Enums"]["hearing_status"] | null
          title: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date: string
          status?: Database["public"]["Enums"]["hearing_status"] | null
          title: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["hearing_status"] | null
          title?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hearings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          related_case_id: string | null
          related_hearing_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          related_case_id?: string | null
          related_hearing_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          related_case_id?: string | null
          related_hearing_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_case_id_fkey"
            columns: ["related_case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_hearing_id_fkey"
            columns: ["related_hearing_id"]
            isOneToOne: false
            referencedRelation: "hearings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          user_id: string
          title: string
          content: string
          related_case_id?: string
          related_hearing_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      case_priority: "Low" | "Medium" | "High"
      case_status: "Pending" | "In Progress" | "Adjourned" | "Closed"
      case_type: "Civil" | "Criminal" | "Family" | "Administrative"
      document_category:
        | "Pleading"
        | "Evidence"
        | "Motion"
        | "Verdict"
        | "Report"
        | "Agreement"
        | "Other"
      hearing_status: "Scheduled" | "Completed" | "Cancelled" | "Adjourned"
      user_role: "Judge" | "Lawyer" | "Clerk" | "Public"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      case_priority: ["Low", "Medium", "High"],
      case_status: ["Pending", "In Progress", "Adjourned", "Closed"],
      case_type: ["Civil", "Criminal", "Family", "Administrative"],
      document_category: [
        "Pleading",
        "Evidence",
        "Motion",
        "Verdict",
        "Report",
        "Agreement",
        "Other",
      ],
      hearing_status: ["Scheduled", "Completed", "Cancelled", "Adjourned"],
      user_role: ["Judge", "Lawyer", "Clerk", "Public"],
    },
  },
} as const
