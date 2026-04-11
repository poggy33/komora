export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          owner_id: string | null;
          title: string;
          description: string | null;
          property_type: "apartment" | "house" | "land";
          listing_type: "sale" | "rent";
          status: string;
          price: number;
          currency: string;
          area_total_m2: number | null;
          rooms_count: number | null;
          floor: number | null;
          total_floors: number | null;
          address_line: string | null;
          city: string;
          region: string | null;
          district: string | null;
          lat: number;
          lng: number;
          seller_name: string | null;
          seller_phone: string | null;
          cover_image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          title: string;
          description?: string | null;
          property_type: "apartment" | "house" | "land";
          listing_type: "sale" | "rent";
          status?: string;
          price: number;
          currency?: string;
          area_total_m2?: number | null;
          rooms_count?: number | null;
          floor?: number | null;
          total_floors?: number | null;
          address_line?: string | null;
          city: string;
          region?: string | null;
          district?: string | null;
          lat: number;
          lng: number;
          seller_name?: string | null;
          seller_phone?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          title?: string;
          description?: string | null;
          property_type?: "apartment" | "house" | "land";
          listing_type?: "sale" | "rent";
          status?: string;
          price?: number;
          currency?: string;
          area_total_m2?: number | null;
          rooms_count?: number | null;
          floor?: number | null;
          total_floors?: number | null;
          address_line?: string | null;
          city?: string;
          region?: string | null;
          district?: string | null;
          lat?: number;
          lng?: number;
          seller_name?: string | null;
          seller_phone?: string | null;
          cover_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

            saved_properties: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_properties_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_properties_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };

      property_media: {
        Row: {
          id: string;
          property_id: string;
          storage_path: string | null;
          public_url: string | null;
          alt_text: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          storage_path?: string | null;
          public_url?: string | null;
          alt_text?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          storage_path?: string | null;
          public_url?: string | null;
          alt_text?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};