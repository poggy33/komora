// export type Database = {
//   public: {
//     Tables: {
//       properties: {
//         Row: {
//           id: string;
//           owner_id: string;
//           title: string;
//           description: string | null;
//           property_type: "apartment" | "house" | "land" | "commercial";
//           listing_type: "sale" | "rent";
//           status: "draft" | "published" | "archived";
//           price: number;
//           currency: string;
//           area_total_m2: number | null;
//           rooms_count: number | null;
//           floor: number | null;
//           total_floors: number | null;
//           address_line: string | null;
//           city: string;
//           region: string | null;
//           district: string | null;
//           lat: number;
//           lng: number;
//           seller_name: string | null;
//           seller_phone: string | null;
//           cover_image_url: string | null;
//           is_published: boolean;
//           created_at: string;
//           updated_at: string;
//         };
//       };

//       property_media: {
//         Row: {
//           id: string;
//           property_id: string;
//           storage_path: string;
//           public_url: string | null;
//           alt_text: string | null;
//           position: number;
//           created_at: string;
//         };
//       };

//       profiles: {
//         Row: {
//           id: string;
//           phone: string | null;
//           full_name: string | null;
//           avatar_url: string | null;
//           is_agent: boolean;
//           created_at: string;
//           updated_at: string;
//         };
//       };

//       saved_properties: {
//         Row: {
//           user_id: string;
//           property_id: string;
//           created_at: string;
//         };
//       };
//     };
//   };
// };

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
        };
      };
    };
  };
};