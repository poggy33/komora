"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restorePropertyInSupabase } from "lib/properties";

type Props = {
  propertyId: string;
  disabled?: boolean;
};

export default function RestorePropertyButton({
  propertyId,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRestore = async () => {
    const confirmed = window.confirm("Відновити оголошення з архіву?");
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      await restorePropertyInSupabase(propertyId);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Не вдалося відновити оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRestore}
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
      {isSubmitting ? "Відновлюємо..." : "Відновити"}
    </button>
  );
}