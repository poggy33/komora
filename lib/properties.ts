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
  publicationStatus: "draft" | "published";
};

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];



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

  const { draftCount } = await getMyPropertyStatusCountsFromSupabase();

  if (input.publicationStatus === "draft" && draftCount >= 3) {
    throw new Error("Draft limit reached");
  }

  const payload: Database["public"]["Tables"]["properties"]["Insert"] = {
    owner_id: user.id,
    title: input.title,
    description: input.description || null,
    property_type: input.propertyType,
    listing_type: input.dealType,
    // status: "published",
    status: input.publicationStatus,
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
    // is_published: true,
    is_published: input.publicationStatus === "published",
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


export async function getEditablePropertyByIdFromSupabase(
  id: string,
  ownerId: string,
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
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load editable property: ${error.message}`);
  }

  if (!data) return null;

  return mapDbPropertyToUi(data);
}

export type UpdatePropertyInput = {
  id: string;
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

export async function updatePropertyInSupabase(
  input: UpdatePropertyInput,
): Promise<void> {
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

  const payload: Database["public"]["Tables"]["properties"]["Update"] = {
    title: input.title,
    description: input.description || null,
    property_type: input.propertyType,
    listing_type: input.dealType,
    price: input.price,
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
  };

  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", input.id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to update property: ${error.message}`);
  }
}

export async function archivePropertyInSupabase(id: string): Promise<void> {
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

  const { archivedCount } = await getMyPropertyStatusCountsFromSupabase();

  if (archivedCount >= 10) {
    throw new Error("Archived limit reached");
  }

  const payload: Database["public"]["Tables"]["properties"]["Update"] = {
    status: "archived",
    is_published: false,
  };

  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to archive property: ${error.message}`);
  }
}

export async function restorePropertyInSupabase(id: string): Promise<void> {
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

  const payload: Database["public"]["Tables"]["properties"]["Update"] = {
    status: "published",
    is_published: true,
  };

  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to restore property: ${error.message}`);
  }
}

export type EditablePropertyMediaItem = {
  id: string;
  propertyId: string;
  publicUrl: string;
  storagePath: string | null;
  position: number;
};

export async function uploadAdditionalPropertyImages(
  propertyId: string,
  files: File[],
  startPosition: number,
): Promise<EditablePropertyMediaItem[]> {
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

  const uploadedRows: Database["public"]["Tables"]["property_media"]["Insert"][] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${propertyId}/${crypto.randomUUID()}-${index}.${fileExt}`;

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

    uploadedRows.push({
      property_id: propertyId,
      storage_path: fileName,
      public_url: publicUrlData.publicUrl,
      alt_text: null,
      position: startPosition + index,
    });
  }

  const { data, error } = await supabase
    .from("property_media")
    .insert(uploadedRows)
    .select("id, property_id, public_url, storage_path, position");

  if (error) {
    throw new Error(`Failed to attach uploaded images: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    propertyId: String(row.property_id),
    publicUrl: row.public_url ?? "",
    storagePath: row.storage_path ?? null,
    position: row.position ?? 0,
  }));
}

export async function deletePropertyImageFromSupabase(
  propertyId: string,
  mediaId: string,
): Promise<void> {
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

  const { data: mediaRow, error: mediaLoadError } = await supabase
    .from("property_media")
    .select("id, property_id, public_url, storage_path")
    .eq("id", mediaId)
    .eq("property_id", propertyId)
    .single();

  if (mediaLoadError) {
    throw new Error(`Failed to load media row: ${mediaLoadError.message}`);
  }

  const { data: propertyRow, error: propertyLoadError } = await supabase
    .from("properties")
    .select("cover_image_url")
    .eq("id", propertyId)
    .eq("owner_id", user.id)
    .single();

  if (propertyLoadError) {
    throw new Error(`Failed to load property: ${propertyLoadError.message}`);
  }

  const { error: deleteRowError } = await supabase
    .from("property_media")
    .delete()
    .eq("id", mediaId)
    .eq("property_id", propertyId);

  if (deleteRowError) {
    throw new Error(`Failed to delete media row: ${deleteRowError.message}`);
  }

  if (mediaRow.storage_path) {
    const { error: storageDeleteError } = await supabase.storage
      .from("property-media")
      .remove([mediaRow.storage_path]);

    if (storageDeleteError) {
      console.error("Failed to delete file from storage:", storageDeleteError);
    }
  }

  if (propertyRow.cover_image_url === mediaRow.public_url) {
    const { data: remainingRows, error: remainingError } = await supabase
      .from("property_media")
      .select("public_url")
      .eq("property_id", propertyId)
      .order("position", { ascending: true })
      .limit(1);

    if (remainingError) {
      throw new Error(`Failed to load remaining media: ${remainingError.message}`);
    }

    const nextCoverUrl = remainingRows?.[0]?.public_url ?? null;

    const { error: coverUpdateError } = await supabase
      .from("properties")
      .update({
        cover_image_url: nextCoverUrl,
      })
      .eq("id", propertyId)
      .eq("owner_id", user.id);

    if (coverUpdateError) {
      throw new Error(`Failed to update cover image: ${coverUpdateError.message}`);
    }
  }
}

export async function setPropertyCoverImageInSupabase(
  propertyId: string,
  publicUrl: string,
): Promise<void> {
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

  const { error } = await supabase
    .from("properties")
    .update({
      cover_image_url: publicUrl,
    })
    .eq("id", propertyId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to update cover image: ${error.message}`);
  }
}

export async function getSavedPropertyIdsFromSupabase(): Promise<string[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to get auth user: ${userError.message}`);
  }

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_properties")
    .select("property_id")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to load saved properties: ${error.message}`);
  }

  return (data ?? []).map((row) => String(row.property_id));
}

export async function savePropertyInSupabase(propertyId: string): Promise<void> {
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

  const payload: Database["public"]["Tables"]["saved_properties"]["Insert"] = {
    user_id: user.id,
    property_id: propertyId,
  };

  const { error } = await supabase
    .from("saved_properties")
    .insert([payload]);

  if (error && error.code !== "23505") {
    throw new Error(`Failed to save property: ${error.message}`);
  }
}

export async function unsavePropertyInSupabase(propertyId: string): Promise<void> {
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

  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .eq("user_id", user.id)
    .eq("property_id", propertyId);

  if (error) {
    throw new Error(`Failed to unsave property: ${error.message}`);
  }
}

export async function publishPropertyInSupabase(id: string): Promise<void> {
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

  const payload: Database["public"]["Tables"]["properties"]["Update"] = {
    status: "published",
    is_published: true,
  };

  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to publish property: ${error.message}`);
  }
}

export async function unpublishPropertyToDraftInSupabase(
  id: string,
): Promise<void> {
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

  const payload: Database["public"]["Tables"]["properties"]["Update"] = {
    status: "draft",
    is_published: false,
  };

  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to move property to draft: ${error.message}`);
  }
}

export async function getMyPropertyStatusCountsFromSupabase(): Promise<{
  draftCount: number;
  archivedCount: number;
}> {
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

  const { data, error } = await supabase
    .from("properties")
    .select("status")
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Failed to load property counts: ${error.message}`);
  }

  const rows = data ?? [];

  return {
    draftCount: rows.filter((row) => row.status === "draft").length,
    archivedCount: rows.filter((row) => row.status === "archived").length,
  };
}