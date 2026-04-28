"use client";

type Props = {
  direction: "prev" | "next";
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  size?: "sm" | "md";
};

export default function ImageNavButton({
  direction,
  onClick,
  ariaLabel,
  size = "md",
}: Props) {
  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`image-nav-button image-nav-button--${direction}`}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 5,
        [direction === "prev" ? "left" : "right"]: isSmall ? "10px" : "14px",

        width: isSmall ? "30px" : "38px",
        height: isSmall ? "30px" : "38px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.18)",

        background: "rgba(17,17,17,0.36)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",

        color: "#fff",
        cursor: "pointer",

        display: "grid",
        placeItems: "center",

        boxShadow: "0 4px 14px rgba(0,0,0,0.14)",
        transition:
          "background 0.18s ease, transform 0.18s ease, opacity 0.18s ease",
      }}
    >
      <span
        style={{
          fontSize: isSmall ? "24px" : "30px",
          lineHeight: 1,
          fontWeight: 300,
          transform:
            direction === "prev" ? "translateX(-1px)" : "translateX(1px)",
        }}
      >
        {direction === "prev" ? "‹" : "›"}
      </span>

      <style jsx>{`
        .image-nav-button:hover {
          background: rgba(17, 17, 17, 0.48) !important;
          transform: translateY(-50%) scale(1.04) !important;
        }

        .image-nav-button:active {
          transform: translateY(-50%) scale(0.96) !important;
        }
      `}</style>
    </button>
  );
}