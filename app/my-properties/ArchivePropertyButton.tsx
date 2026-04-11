"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { archivePropertyInSupabase } from "lib/properties";

type Props = {
  propertyId: string;
  disabled?: boolean;
};

export default function ArchivePropertyButton({
  propertyId,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArchive = async () => {
    const confirmed = window.confirm("Перемістити оголошення в архів?");
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await archivePropertyInSupabase(propertyId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Не вдалося архівувати оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={disabled || isSubmitting}
      style={{
        height: "46px",
        padding: "0 16px",
        borderRadius: "14px",
        border: "1px solid #ddd",
        background: "#fff",
        color: "#111",
        fontSize: "14px",
        fontWeight: 700,
        cursor: disabled || isSubmitting ? "not-allowed" : "pointer",
        opacity: disabled || isSubmitting ? 0.6 : 1,
      }}
    >
      {isSubmitting ? "Архівуємо..." : disabled ? "В архіві" : "Архівувати"}
    </button>
  );
}