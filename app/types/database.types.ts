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
    property_type: "apartment" | "house" | "land" | "commercial";
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
    market_type: "new_building" | "secondary" | null;
    year_built: number | null;
    heating_type:
      | "individual"
      | "central"
      | "electric"
      | "solid_fuel"
      | null;
    parking_type: "parking" | "underground" | null;
    renovation_type:
      | "no_repair"
      | "livable"
      | "good"
      | "euro"
      | null;
    documents_ready: boolean;
    pets_allowed: boolean;
    is_furnished: boolean;
    land_purpose:
      | "residential"
      | "agricultural"
      | "commercial"
      | null;
    lot_area: number | null;
    living_area: number | null;
    kitchen_area: number | null;
  };
  Insert: {
    id?: string;
    owner_id?: string | null;
    title: string;
    description?: string | null;
    property_type: "apartment" | "house" | "land" | "commercial";
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
    market_type?: "new_building" | "secondary" | null;
    year_built?: number | null;
    heating_type?:
      | "individual"
      | "central"
      | "electric"
      | "solid_fuel"
      | null;
    parking_type?: "parking" | "underground" | null;
    renovation_type?:
      | "no_repair"
      | "livable"
      | "good"
      | "euro"
      | null;
    documents_ready?: boolean;
    pets_allowed?: boolean;
    is_furnished?: boolean;
    land_purpose?:
      | "residential"
      | "agricultural"
      | "commercial"
      | null;
    lot_area?: number | null;
    living_area?: number | null;
    kitchen_area?: number | null;
  };
  Update: {
    id?: string;
    owner_id?: string | null;
    title?: string;
    description?: string | null;
    property_type?: "apartment" | "house" | "land" | "commercial";
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
    market_type?: "new_building" | "secondary" | null;
    year_built?: number | null;
    heating_type?:
      | "individual"
      | "central"
      | "electric"
      | "solid_fuel"
      | null;
    parking_type?: "parking" | "underground" | null;
    renovation_type?:
      | "no_repair"
      | "livable"
      | "good"
      | "euro"
      | null;
    documents_ready?: boolean;
    pets_allowed?: boolean;
    is_furnished?: boolean;
    land_purpose?:
      | "residential"
      | "agricultural"
      | "commercial"
      | null;
    lot_area?: number | null;
    living_area?: number | null;
    kitchen_area?: number | null;
  };
  Relationships: [];
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
          },
        ];
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
            foreignKeyName: "saved_properties_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};