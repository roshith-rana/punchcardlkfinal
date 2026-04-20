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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      business_users: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          role: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          forever_free: boolean
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          subscription_status: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          forever_free?: boolean
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          subscription_status?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          forever_free?: boolean
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          subscription_status?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_business_profiles: {
        Row: {
          birthday: string | null
          business_id: string
          created_at: string
          first_visit_at: string | null
          id: string
          last_visit_at: string | null
          notes: string | null
          total_cards_issued: number
          total_rewards_redeemed: number
          total_stamps_earned: number
          updated_at: string
          user_id: string
          visit_count: number
        }
        Insert: {
          birthday?: string | null
          business_id: string
          created_at?: string
          first_visit_at?: string | null
          id?: string
          last_visit_at?: string | null
          notes?: string | null
          total_cards_issued?: number
          total_rewards_redeemed?: number
          total_stamps_earned?: number
          updated_at?: string
          user_id: string
          visit_count?: number
        }
        Update: {
          birthday?: string | null
          business_id?: string
          created_at?: string
          first_visit_at?: string | null
          id?: string
          last_visit_at?: string | null
          notes?: string | null
          total_cards_issued?: number
          total_rewards_redeemed?: number
          total_stamps_earned?: number
          updated_at?: string
          user_id?: string
          visit_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_business_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_cards: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string
          cycle_number: number
          id: string
          issued_at: string
          loyalty_card_id: string
          redeemed_at: string | null
          stamps_collected: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string
          cycle_number?: number
          id?: string
          issued_at?: string
          loyalty_card_id: string
          redeemed_at?: string | null
          stamps_collected?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string
          cycle_number?: number
          id?: string
          issued_at?: string
          loyalty_card_id?: string
          redeemed_at?: string | null
          stamps_collected?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_cards_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          business_id: string
          created_at: string
          id: string
          report_data: Json | null
          report_date: string
          sent_at: string | null
          total_customers_served: number
          total_redemptions: number
          total_stamps: number
          total_transactions: number
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          report_data?: Json | null
          report_date: string
          sent_at?: string | null
          total_customers_served?: number
          total_redemptions?: number
          total_stamps?: number
          total_transactions?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          report_data?: Json | null
          report_date?: string
          sent_at?: string | null
          total_customers_served?: number
          total_redemptions?: number
          total_stamps?: number
          total_transactions?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_card_outlets: {
        Row: {
          id: string
          loyalty_card_id: string
          outlet_id: string
        }
        Insert: {
          id?: string
          loyalty_card_id: string
          outlet_id: string
        }
        Update: {
          id?: string
          loyalty_card_id?: string
          outlet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_card_outlets_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_card_outlets_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_cards: {
        Row: {
          auto_renew: boolean
          business_id: string
          collect_bill_value: boolean
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          max_stamps_per_visit: number
          name: string
          outlet_scope: string
          redemption_scope: string
          reward_description: string | null
          reward_title: string
          stamps_required: number
          start_date: string | null
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean
          business_id: string
          collect_bill_value?: boolean
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_stamps_per_visit?: number
          name: string
          outlet_scope?: string
          redemption_scope?: string
          reward_description?: string | null
          reward_title: string
          stamps_required: number
          start_date?: string | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean
          business_id?: string
          collect_bill_value?: boolean
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          max_stamps_per_visit?: number
          name?: string
          outlet_scope?: string
          redemption_scope?: string
          reward_description?: string | null
          reward_title?: string
          stamps_required?: number
          start_date?: string | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      outlets: {
        Row: {
          address: string | null
          business_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outlets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      report_recipients: {
        Row: {
          business_id: string
          created_at: string
          email: string
          id: string
          is_active: boolean
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "report_recipients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_outlet_assignments: {
        Row: {
          business_user_id: string
          created_at: string
          id: string
          outlet_id: string
        }
        Insert: {
          business_user_id: string
          created_at?: string
          id?: string
          outlet_id: string
        }
        Update: {
          business_user_id?: string
          created_at?: string
          id?: string
          outlet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_outlet_assignments_business_user_id_fkey"
            columns: ["business_user_id"]
            isOneToOne: false
            referencedRelation: "business_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_outlet_assignments_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_pins: {
        Row: {
          business_user_id: string
          created_at: string
          id: string
          pin_hash: string
          updated_at: string
        }
        Insert: {
          business_user_id: string
          created_at?: string
          id?: string
          pin_hash: string
          updated_at?: string
        }
        Update: {
          business_user_id?: string
          created_at?: string
          id?: string
          pin_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_pins_business_user_id_fkey"
            columns: ["business_user_id"]
            isOneToOne: true
            referencedRelation: "business_users"
            referencedColumns: ["id"]
          },
        ]
      }
      superadmins: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          bill_value: number | null
          business_id: string
          created_at: string
          customer_card_id: string
          id: string
          loyalty_card_id: string
          notes: string | null
          outlet_id: string | null
          quantity: number
          staff_business_user_id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          bill_value?: number | null
          business_id: string
          created_at?: string
          customer_card_id: string
          id?: string
          loyalty_card_id: string
          notes?: string | null
          outlet_id?: string | null
          quantity?: number
          staff_business_user_id: string
          transaction_type: string
          user_id: string
        }
        Update: {
          bill_value?: number | null
          business_id?: string
          created_at?: string
          customer_card_id?: string
          id?: string
          loyalty_card_id?: string
          notes?: string | null
          outlet_id?: string | null
          quantity?: number
          staff_business_user_id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_card_id_fkey"
            columns: ["customer_card_id"]
            isOneToOne: false
            referencedRelation: "customer_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_staff_business_user_id_fkey"
            columns: ["staff_business_user_id"]
            isOneToOne: false
            referencedRelation: "business_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birthday: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          mobile_number: string
          updated_at: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          mobile_number: string
          updated_at?: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          mobile_number?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_business_id: { Args: never; Returns: string }
      is_admin_of: { Args: { p_business_id: string }; Returns: boolean }
      is_staff_of: { Args: { p_business_id: string }; Returns: boolean }
      is_superadmin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
