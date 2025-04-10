export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      distributors: {
        Row: {
          distributor_id: number
          distributor_name: string
          distributor_name_lower: string | null
          distributor_slug: string
        }
        Insert: {
          distributor_id?: number
          distributor_name: string
          distributor_name_lower?: string | null
          distributor_slug: string
        }
        Update: {
          distributor_id?: number
          distributor_name?: string
          distributor_name_lower?: string | null
          distributor_slug?: string
        }
        Relationships: []
      }
      genres: {
        Row: {
          genre_id: number
          genre_name: string
          genre_slug: string | null
        }
        Insert: {
          genre_id?: number
          genre_name: string
          genre_slug?: string | null
        }
        Update: {
          genre_id?: number
          genre_name?: string
          genre_slug?: string | null
        }
        Relationships: []
      }
      tapes: {
        Row: {
          barcode: string | null
          cover_front_url: string | null
          date_added: string | null
          date_updated: string | null
          description: string
          tape_id: number
          title: string
          title_lower: string | null
          uuid: string | null
          year: number
        }
        Insert: {
          barcode?: string | null
          cover_front_url?: string | null
          date_added?: string | null
          date_updated?: string | null
          description: string
          tape_id?: number
          title: string
          title_lower?: string | null
          uuid?: string | null
          year: number
        }
        Update: {
          barcode?: string | null
          cover_front_url?: string | null
          date_added?: string | null
          date_updated?: string | null
          description?: string
          tape_id?: number
          title?: string
          title_lower?: string | null
          uuid?: string | null
          year?: number
        }
        Relationships: []
      }
      tapes_distributors: {
        Row: {
          distributor_id: number
          tape_distributor_id: number
          tape_id: number
          uuid: string | null
        }
        Insert: {
          distributor_id: number
          tape_distributor_id?: number
          tape_id: number
          uuid?: string | null
        }
        Update: {
          distributor_id?: number
          tape_distributor_id?: number
          tape_id?: number
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tapes_distributors_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["distributor_id"]
          },
          {
            foreignKeyName: "tapes_distributors_tape_id_fkey"
            columns: ["tape_id"]
            isOneToOne: false
            referencedRelation: "tapes"
            referencedColumns: ["tape_id"]
          },
        ]
      }
      tapes_genres: {
        Row: {
          genre_id: number | null
          tape_genre_id: number
          tape_id: number | null
          uuid: string | null
        }
        Insert: {
          genre_id?: number | null
          tape_genre_id?: number
          tape_id?: number | null
          uuid?: string | null
        }
        Update: {
          genre_id?: number | null
          tape_genre_id?: number
          tape_id?: number | null
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tapes_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["genre_id"]
          },
          {
            foreignKeyName: "tapes_genres_tape_id_fkey"
            columns: ["tape_id"]
            isOneToOne: false
            referencedRelation: "tapes"
            referencedColumns: ["tape_id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          user_id: number
          user_role: string | null
          username: string
          uuid: string
        }
        Insert: {
          email: string
          user_id?: number
          user_role?: string | null
          username: string
          uuid: string
        }
        Update: {
          email?: string
          user_id?: number
          user_role?: string | null
          username?: string
          uuid?: string
        }
        Relationships: []
      }
      users_tapes: {
        Row: {
          tape_id: number | null
          user_tape_id: number
          uuid: string | null
        }
        Insert: {
          tape_id?: number | null
          user_tape_id?: number
          uuid?: string | null
        }
        Update: {
          tape_id?: number | null
          user_tape_id?: number
          uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tapes_tape_id_fkey"
            columns: ["tape_id"]
            isOneToOne: false
            referencedRelation: "tapes"
            referencedColumns: ["tape_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_tape: {
        Args: {
          user_id_query: string
          tape_id_query: number
        }
        Returns: boolean
      }
      delete_user_tape: {
        Args: {
          user_id_query: string
          tape_id_query: number
        }
        Returns: undefined
      }
      get_tape_by_barcode: {
        Args: {
          barcodequery: string
        }
        Returns: {
          tape_id: number
          barcode: string
          title: string
          description: string
          year: number
          cover_front_url: string
          date_added: string
          date_updated: string
          genres: Json
        }[]
      }
      get_tape_by_search_query: {
        Args: {
          querystring: string
        }
        Returns: {
          tape_id: number
          barcode: string
          title: string
          description: string
          year: number
          cover_front_url: string
          date_added: string
          date_updated: string
          genres: Json
        }[]
      }
      get_tape_by_tape_id: {
        Args: {
          tapeidquery: number
        }
        Returns: {
          tape_id: number
          barcode: string
          title: string
          description: string
          year: number
          cover_front_url: string
          date_added: string
          date_updated: string
          genres: Json
        }[]
      }
      get_tape_genres: {
        Args: {
          tape_id_query: number
        }
        Returns: Json
      }
      get_tapes_by_user_id: {
        Args: {
          useridquery: string
        }
        Returns: {
          tape_id: number
          barcode: string
          title: string
          description: string
          year: number
          cover_front_url: string
          date_added: string
          date_updated: string
          genres: Json
        }[]
      }
      get_tapes_with_genres: {
        Args: Record<PropertyKey, never>
        Returns: {
          tape_id: number
          barcode: string
          title: string
          description: string
          year: number
          cover_front_url: string
          date_added: string
          date_updated: string
          genres: Json
        }[]
      }
      get_user_id: {
        Args: {
          usernamequery: string
        }
        Returns: number
      }
      get_users_by_meta_value: {
        Args: {
          meta_key: string
          meta_value: string
        }
        Returns: unknown[]
      }
      insert_distributor: {
        Args: {
          p_distributor_name: string
        }
        Returns: undefined
      }
      insert_genre: {
        Args: {
          p_genre_name: string
        }
        Returns: undefined
      }
      insert_new_tape: {
        Args: {
          data: Json
        }
        Returns: {
          tape_id: number
        }[]
      }
      insert_tape_distributor: {
        Args: {
          tape_id: number
          distributor_id: number
          uuid: string
        }
        Returns: undefined
      }
      insert_tape_genre: {
        Args: {
          tape_id: number
          genre_id: number
          uuid: string
        }
        Returns: undefined
      }
      insert_user_tape: {
        Args: {
          user_id_query: string
          tape_id_query: number
        }
        Returns: undefined
      }
      update_tape: {
        Args: {
          data: Json
        }
        Returns: undefined
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
