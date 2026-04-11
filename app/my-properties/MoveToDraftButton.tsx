"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { unpublishPropertyToDraftInSupabase } from "lib/properties";

type Props = {
  propertyId: string;
};

export default function MoveToDraftButton({ propertyId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoveToDraft = async () => {
    try {
      setIsSubmitting(true);
      await unpublishPropertyToDraftInSupabase(propertyId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Не вдалося зняти з публікації");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleMoveToDraft}
      disabled={isSubmitting}
      style={actionButtonStyle}
    >
      {isSubmitting ? "..." : "Зняти з публікації"}
    </button>
  );
}

const actionButtonStyle: React.CSSProperties = {
  height: "46px",
  padding: "0 16px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};