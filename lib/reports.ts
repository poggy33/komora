// lib/reports.ts
import { createClient } from "../lib/supabase/client";

export async function hasReported(propertyId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("property_reports")
    .select("id")
    .eq("property_id", propertyId)
    .eq("reporter_id", user.id)
    .maybeSingle();

  return !!data;
}

export async function createReport({
  propertyId,
  reason,
  message,
}: {
  propertyId: string;
  reason: string;
  message?: string;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("NOT_AUTH");

  const { error } = await supabase.from("property_reports").insert({
    property_id: propertyId,
    reporter_id: user.id,
    reason,
    message,
  });

  if (error) throw error;
}