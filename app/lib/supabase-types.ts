
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "distributors": {
                  Row: {
                    "distributor_id": number,"distributor_name": string,"distributor_name_lower": string | null,"distributor_slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "distributor_id"?: number,"distributor_name": string,"distributor_name_lower"?: never,"distributor_slug": string
                  }
                  Update: {
                    "distributor_id"?: number,"distributor_name"?: string,"distributor_name_lower"?: never,"distributor_slug"?: string
                  }
                  Relationships: [
                    
                  ]
                },"genres": {
                  Row: {
                    "genre_id": number,"genre_name": string,"genre_slug": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "genre_id"?: number,"genre_name": string,"genre_slug"?: string | null
                  }
                  Update: {
                    "genre_id"?: number,"genre_name"?: string,"genre_slug"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"tapes": {
                  Row: {
                    "barcode": string | null,"cover_back_url": string | null,"cover_front_url": string | null,"date_added": string | null,"date_updated": string | null,"description": string,"tape_id": number,"title": string,"title_lower": string | null,"uuid": string | null,"year": number
                  }
                  ComputedFields: never
                  Insert: {
                    "barcode"?: string | null,"cover_back_url"?: string | null,"cover_front_url"?: string | null,"date_added"?: string | null,"date_updated"?: string | null,"description": string,"tape_id"?: number,"title": string,"title_lower"?: never,"uuid"?: string | null,"year": number
                  }
                  Update: {
                    "barcode"?: string | null,"cover_back_url"?: string | null,"cover_front_url"?: string | null,"date_added"?: string | null,"date_updated"?: string | null,"description"?: string,"tape_id"?: number,"title"?: string,"title_lower"?: never,"uuid"?: string | null,"year"?: number
                  }
                  Relationships: [
                    
                  ]
                },"tapes_distributors": {
                  Row: {
                    "distributor_id": number | null,"tape_distributor_id": number,"tape_id": number,"uuid": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "distributor_id"?: number | null,"tape_distributor_id"?: number,"tape_id": number,"uuid"?: string | null
                  }
                  Update: {
                    "distributor_id"?: number | null,"tape_distributor_id"?: number,"tape_id"?: number,"uuid"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "tapes_distributors_distributor_id_fkey"
      columns: ["distributor_id"]
isOneToOne: false
      referencedRelation: "distributors"
      referencedColumns: ["distributor_id"]
    },{
      foreignKeyName: "tapes_distributors_tape_id_fkey"
      columns: ["tape_id"]
isOneToOne: true
      referencedRelation: "tapes"
      referencedColumns: ["tape_id"]
    }
                  ]
                },"tapes_genres": {
                  Row: {
                    "genre_id": number | null,"tape_genre_id": number,"tape_id": number | null,"uuid": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "genre_id"?: number | null,"tape_genre_id"?: number,"tape_id"?: number | null,"uuid"?: string | null
                  }
                  Update: {
                    "genre_id"?: number | null,"tape_genre_id"?: number,"tape_id"?: number | null,"uuid"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "tapes_genres_genre_id_fkey"
      columns: ["genre_id"]
isOneToOne: false
      referencedRelation: "genres"
      referencedColumns: ["genre_id"]
    },{
      foreignKeyName: "tapes_genres_tape_id_fkey"
      columns: ["tape_id"]
isOneToOne: false
      referencedRelation: "tapes"
      referencedColumns: ["tape_id"]
    }
                  ]
                },"users": {
                  Row: {
                    "email": string,"user_id": number,"user_role": string | null,"username": string,"uuid": string
                  }
                  ComputedFields: never
                  Insert: {
                    "email": string,"user_id"?: number,"user_role"?: string | null,"username": string,"uuid": string
                  }
                  Update: {
                    "email"?: string,"user_id"?: number,"user_role"?: string | null,"username"?: string,"uuid"?: string
                  }
                  Relationships: [
                    
                  ]
                },"users_tapes": {
                  Row: {
                    "tape_id": number | null,"user_tape_id": number,"uuid": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "tape_id"?: number | null,"user_tape_id"?: number,"uuid"?: string | null
                  }
                  Update: {
                    "tape_id"?: number | null,"user_tape_id"?: number,"uuid"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "users_tapes_tape_id_fkey"
      columns: ["tape_id"]
isOneToOne: false
      referencedRelation: "tapes"
      referencedColumns: ["tape_id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "check_user_tape":
{ Args: { "tape_id_query": number,"user_id_query": string }; Returns: boolean
                           },
"delete_user_tape":
{ Args: { "tape_id_query": number,"user_id_query": string }; Returns: undefined
                           },
"get_tape_by_barcode":
{ Args: { "barcodequery": string }; Returns: {
              "barcode": string,"cover_front_url": string,"date_added": string,"date_updated": string,"description": string,"genres": Json,"tape_id": number,"title": string,"year": number
            }[]
                           },
"get_tape_by_search_query":
{ Args: { "querystring": string }; Returns: {
              "barcode": string,"cover_front_url": string,"date_added": string,"date_updated": string,"description": string,"genres": Json,"tape_id": number,"title": string,"year": number
            }[]
                           },
"get_tape_by_tape_id":
{ Args: { "tapeidquery": number }; Returns: {
              "barcode": string,"cover_front_url": string,"date_added": string,"date_updated": string,"description": string,"genres": Json,"tape_id": number,"title": string,"year": number
            }[]
                           },
"get_tape_genres":
{ Args: { "tape_id_query": number }; Returns: Json
                           },
"get_tapes_by_user_id":
{ Args: { "useridquery": string }; Returns: {
              "barcode": string,"cover_front_url": string,"date_added": string,"date_updated": string,"description": string,"genres": Json,"tape_id": number,"title": string,"year": number
            }[]
                           },
"get_tapes_with_genres":
{ Args: Record<PropertyKey, never>; Returns: {
              "barcode": string,"cover_front_url": string,"date_added": string,"date_updated": string,"description": string,"genres": Json,"tape_id": number,"title": string,"year": number
            }[]
                           },
"get_user_id":
{ Args: { "usernamequery": string }; Returns: number
                           },
"get_users_by_meta_value":
{ Args: { "meta_key": string,"meta_value": string }; Returns: Database["public"]['Tables']["users"]['Row'][]
                          SetofOptions: {
        from: "*"
        to: "users"
        isOneToOne: false
        isSetofReturn: true
      } },
"insert_distributor":
{ Args: { "p_distributor_name": string }; Returns: undefined
                           },
"insert_genre":
{ Args: { "p_genre_name": string }; Returns: undefined
                           },
"insert_new_tape":
{ Args: { "data": Json }; Returns: {
              "tape_id": number
            }[]
                           },
"insert_tape_distributor":
{ Args: { "distributor_id": number,"tape_id": number,"uuid": string }; Returns: undefined
                           },
"insert_tape_genre":
{ Args: { "genre_id": number,"tape_id": number,"uuid": string }; Returns: undefined
                           },
"insert_user_tape":
{ Args: { "tape_id_query": number,"user_id_query": string }; Returns: undefined
                           },
"update_tape":
{ Args: { "data": Json }; Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
