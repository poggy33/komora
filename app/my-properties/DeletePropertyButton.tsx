"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePropertyInSupabase } from "lib/properties";

type Props = {
  propertyId: string;
  disabled?: boolean;
};

export default function DeletePropertyButton({
  propertyId,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Видалити оголошення назавжди? Це неможливо скасувати.",
    );
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await deletePropertyInSupabase(propertyId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={disabled || isSubmitting}
      style={{
        height: "46px",
        padding: "0 16px",
        borderRadius: "14px",
        border: "1px solid #fca5a5",
        background: "#fff",
        color: "#b91c1c",
        fontSize: "14px",
        fontWeight: 700,
        cursor: disabled || isSubmitting ? "not-allowed" : "pointer",
        opacity: disabled || isSubmitting ? 0.6 : 1,
      }}
    >
      {isSubmitting ? "Видаляємо..." : "Видалити"}
    </button>
  );
}