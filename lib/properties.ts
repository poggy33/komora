// підключаємо Supabase до списку
import type { Property } from "@/types/property";
import { createClient } from "../lib/supabase/client";
import type { Database } from "@/types/database.types";

function buildFullAddress(row: {
  address_line: string | null;
  district: string | null;
  city: string;
  region: string | null;
}) {
  return [row.address_line, row.district, row.city, row.region]
    .filter(Boolean)
    .join(", ");
}

function mapDbPropertyToUi(row: any): Property {
  const images =
    row.property_media
      ?.slice()
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.map((img: any) => img.public_url)
      ?.filter(Boolean) ?? [];
      console.log("DB house row:", row.property_type, row.floor, row.total_floors);
        console.log("Mapped floors:", {
  propertyType: row.property_type,
  floors:
    row.property_type === "house"
      ? row.total_floors ?? row.floor ?? undefined
      : undefined,
});
    return {
    id: String(row.id),
    title: row.title,
    propertyType: row.property_type,
    dealType: row.listing_type,
    price: row.price,
    area: row.area_total_m2 ?? 0,

    rooms: row.rooms_count ?? undefined,

    floor: row.floor ?? undefined,
    totalFloors: row.total_floors ?? undefined,

    floors:
        row.property_type === "house"
        ? row.total_floors ?? row.floor ?? undefined
        : undefined,

    ownerType: "owner",
    coordinates: [row.lng, row.lat],

    images,
    coverImage: row.cover_image_url ?? images[0] ?? null,

    location: {
        city: row.city,
        region: row.region ?? undefined,
        district: row.district ?? undefined,
        addressLine: row.address_line ?? undefined,
        fullAddress: buildFullAddress(row),
    },

    description: row.description ?? undefined,
    publishedAt: row.created_at ?? undefined,
    status: "active",
    currency: row.currency ?? "USD",

    owner: {
        id: row.owner_id ? String(row.owner_id) : "",
        type: "owner",
        name: row.seller_name ?? "Власник",
        isVerified: false,
        phone: row.seller_phone ?? "",
    },
    };
}

export type GetPropertiesParams = {
  dealType?: "sale" | "rent";
  propertyType?: "apartment" | "house" | "land";
  filters?: {
    priceMin: string;
    priceMax: string;
    rooms: string;
    areaMin: string;
  };
};

export async function getPropertiesFromSupabase({
  dealType,
  propertyType,
  filters,
}: GetPropertiesParams): Promise<Property[]> {
  const supabase = createClient();

  let query = supabase
    .from("properties")
    .select(`
      id,
      owner_id,
      title,
      description,
      property_type,
      listing_type,
      price,
      currency,
      area_total_m2,
      rooms_count,
      floor,
      total_floors,
      address_line,
      city,
      region,
      district,
      lat,
      lng,
      seller_name,
      seller_phone,
      cover_image_url,
      created_at,
      property_media (
        public_url,
        position
      )
    `)
    .eq("status", "published")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (dealType) {
    query = query.eq("listing_type", dealType);
  }

  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }

  const priceMin = filters?.priceMin ? Number(filters.priceMin) : null;
  const priceMax = filters?.priceMax ? Number(filters.priceMax) : null;
  const rooms = filters?.rooms ? Number(filters.rooms) : null;
  const areaMin = filters?.areaMin ? Number(filters.areaMin) : null;

  if (priceMin !== null) {
    query = query.gte("price", priceMin);
  }

  if (priceMax !== null) {
    query = query.lte("price", priceMax);
  }

  if (rooms !== null && propertyType !== "land") {
    query = query.gte("rooms_count", rooms);
  }

  if (areaMin !== null) {
    query = query.gte("area_total_m2", areaMin);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load properties: ${error.message}`);
  }

  return (data ?? []).map(mapDbPropertyToUi);
}

export async function getPropertyByIdFromSupabase(
  id: string,
): Promise<Property | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      id,
      owner_id,
      title,
      description,
      property_type,
      listing_type,
      price,
      currency,
      area_total_m2,
      rooms_count,
      floor,
      total_floors,
      address_line,
      city,
      region,
      district,
      lat,
      lng,
      seller_name,
      seller_phone,
      cover_image_url,
      created_at,
      property_media (
        public_url,
        position
      )
    `)
    .eq("id", id)
    .eq("status", "published")
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load property: ${error.message}`);
  }

  if (!data) return null;

  return mapDbPropertyToUi(data);
}

export async function getPropertiesCountFromSupabase({
  dealType,
  propertyType,
  filters,
}: GetPropertiesParams): Promise<number> {
  const supabase = createClient();

  let query = supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("is_published", true);

  if (dealType) {
    query = query.eq("listing_type", dealType);
  }

  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }

  const priceMin = filters?.priceMin ? Number(filters.priceMin) : null;
  const priceMax = filters?.priceMax ? Number(filters.priceMax) : null;
  const rooms = filters?.rooms ? Number(filters.rooms) : null;
  const areaMin = filters?.areaMin ? Number(filters.areaMin) : null;

  if (priceMin !== null) {
    query = query.gte("price", priceMin);
  }

  if (priceMax !== null) {
    query = query.lte("price", priceMax);
  }

  if (rooms !== null && propertyType !== "land") {
    query = query.gte("rooms_count", rooms);
  }

  if (areaMin !== null) {
    query = query.gte("area_total_m2", areaMin);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to load properties count: ${error.message}`);
  }

  return count ?? 0;
}

export type CreatePropertyInput = {
  title: string;
  description: string;
  propertyType: "apartment" | "house" | "land";
  dealType: "sale" | "rent";
  price: number;
  area: number;
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  city: string;
  region?: string;
  district?: string;
  addressLine?: string;
  lat: number;
  lng: number;
  sellerName: string;
  sellerPhone: string;
};

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

// export async function createPropertyInSupabase(
//   input: CreatePropertyInput,
// ): Promise<string> {
//   const supabase = createClient();

//   const payload: PropertyInsert = {
//     title: input.title,
//     description: input.description || null,
//     property_type: input.propertyType,
//     listing_type: input.dealType,
//     status: "published",
//     price: input.price,
//     currency: "USD",
//     area_total_m2: input.area,
//     rooms_count:
//       input.propertyType === "land" ? null : (input.rooms ?? null),
//     floor:
//       input.propertyType === "apartment" ? (input.floor ?? null) : null,
//     total_floors:
//       input.propertyType === "land" ? null : (input.totalFloors ?? null),
//     address_line: input.addressLine || null,
//     city: input.city,
//     region: input.region || null,
//     district: input.district || null,
//     lat: input.lat,
//     lng: input.lng,
//     seller_name: input.sellerName,
//     seller_phone: input.sellerPhone,
//     cover_image_url: null,
//     is_published: true,
//     owner_id: null,
//   };

//   const { data, error } = await supabase
//     .from("properties")
//     .insert([payload])
//     .select("id")
//     .single();

//   if (error) {
//     throw new Error(`Failed to create property: ${error.message}`);
//   }

//   return String(data.id);
// }

export async function createPropertyInSupabase(
  input: CreatePropertyInput,
): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to get auth user: ${userError.message}`);
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const payload: Database["public"]["Tables"]["properties"]["Insert"] = {
    owner_id: user.id,
    title: input.title,
    description: input.description || null,
    property_type: input.propertyType,
    listing_type: input.dealType,
    status: "published",
    price: input.price,
    currency: "USD",
    area_total_m2: input.area,
    rooms_count:
      input.propertyType === "land" ? null : (input.rooms ?? null),
    floor:
      input.propertyType === "apartment" ? (input.floor ?? null) : null,
    total_floors:
      input.propertyType === "land" ? null : (input.totalFloors ?? null),
    address_line: input.addressLine || null,
    city: input.city,
    region: input.region || null,
    district: input.district || null,
    lat: input.lat,
    lng: input.lng,
    seller_name: input.sellerName,
    seller_phone: input.sellerPhone,
    cover_image_url: null,
    is_published: true,
  };

  const { data, error } = await supabase
    .from("properties")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to create property: ${error.message}`);
  }

  return String(data.id);
}

export async function uploadPropertyImages(
  propertyId: string,
  files: File[],
): Promise<{ path: string; publicUrl: string; position: number }[]> {
  const supabase = createClient();

  const uploaded: { path: string; publicUrl: string; position: number }[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${propertyId}/${index + 1}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("property-media")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("property-media")
      .getPublicUrl(fileName);

    uploaded.push({
      path: fileName,
      publicUrl: publicUrlData.publicUrl,
      position: index,
    });
  }

  return uploaded;
}

export async function attachPropertyImages(
  propertyId: string,
  images: { path: string; publicUrl: string; position: number }[],
): Promise<void> {
  const supabase = createClient();

  const rows = images.map((image) => ({
    property_id: propertyId,
    storage_path: image.path,
    public_url: image.publicUrl,
    alt_text: null,
    position: image.position,
  }));

  const { error: mediaError } = await supabase
    .from("property_media")
    .insert(rows as any);

  if (mediaError) {
    throw new Error(`Failed to attach images: ${mediaError.message}`);
  }

  if (images[0]?.publicUrl) {
    const { error: coverError } = await supabase
      .from("properties")
      .update({
        cover_image_url: images[0].publicUrl,
      } as any)
      .eq("id", propertyId);

    if (coverError) {
      throw new Error(`Failed to update cover image: ${coverError.message}`);
    }
  }
}

export async function getMyPropertiesFromSupabase(
  ownerId: string,
): Promise<Property[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      id,
      owner_id,
      title,
      description,
      property_type,
      listing_type,
      status,
      price,
      currency,
      area_total_m2,
      rooms_count,
      floor,
      total_floors,
      address_line,
      city,
      region,
      district,
      lat,
      lng,
      seller_name,
      seller_phone,
      cover_image_url,
      created_at,
      property_media (
        public_url,
        position
      )
    `)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load my properties: ${error.message}`);
  }

  return (data ?? []).map(mapDbPropertyToUi);
}