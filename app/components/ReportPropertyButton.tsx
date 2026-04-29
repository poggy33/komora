"use client";

import { useEffect, useState } from "react";
import { createReport, hasReported } from "../../lib/reports";

type Props = {
  propertyId: string;
};

export default function ReportPropertyButton({ propertyId }: Props) {
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    hasReported(propertyId).then(setReported);
  }, [propertyId]);

  const handleReport = async () => {
    try {
      setLoading(true);

      await createReport({
        propertyId,
        reason: "other",
      });

      setReported(true);
    } catch (e) {
      console.error(e);
      alert("Помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (reported) {
    return (
      <div
        style={{
          fontSize: "13px",
          color: "#16a34a",
          fontWeight: 600,
        }}
      >
        ✓ Скаргу прийнято
      </div>
    );
  }

  return (
    <button
      onClick={handleReport}
      disabled={loading}
      style={{
        fontSize: "13px",
        color: "#666",
        textDecoration: "underline",
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      {loading ? "Відправляємо..." : "Поскаржитися"}
    </button>
  );
}