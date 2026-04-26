"use client";

import { useRouter } from "next/navigation";
import CloseIcon from "../components/icons/CloseIcon";

type Props = {
  href?: string;
};

export default function ClosePageButton({ href = "/" }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.replace(href)}
      aria-label="Закрити"
      style={{
        ...floatingButtonStyle,
        right: "12px",
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