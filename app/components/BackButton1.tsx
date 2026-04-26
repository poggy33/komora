"use client";

import { useRouter } from "next/navigation";
import CloseIcon from "@/components/icons/CloseIcon";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      aria-label="Назад"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "999px",
        border: "1px solid rgba(17,17,17,0.08)",
        background: "rgba(255,255,255,0.96)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
        cursor: "pointer",
      }}
    >
      <CloseIcon size={18} />
    </button>
  );
}

const floatingButtonStyle: React.CSSProperties = {
  position: "fixed",
  top: "12px",
  zIndex: 1000,

  width: "36px",
  height: "36px",
  borderRadius: "999px", // 👈 той самий круг

  background: "rgba(255,255,255,0.5)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",

  border: "1px solid rgba(0,0,0,0.04)",
  color: "rgba(0,0,0,0.6)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",

  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};
