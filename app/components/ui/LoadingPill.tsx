"use client";

type Props = {
  label?: string;
  size?: "sm" | "md";
};

export default function LoadingPill({
  label = "Завантаження...",
  size = "md",
}: Props) {
  const isSmall = size === "sm";

  return (
    <>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: isSmall ? "8px" : "10px",
          height: isSmall ? "34px" : "38px",
          padding: isSmall ? "0 12px" : "0 14px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(17,17,17,0.08)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#111",
          fontSize: isSmall ? "13px" : "14px",
          fontWeight: 600,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            position: "relative",
            width: isSmall ? "16px" : "18px",
            height: isSmall ? "16px" : "18px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span className="loading-pill__dot loading-pill__dot--1" />
          <span className="loading-pill__dot loading-pill__dot--2" />
          <span className="loading-pill__dot loading-pill__dot--3" />
        </span>

        <span>{label}</span>
      </div>

      <style jsx>{`
        .loading-pill__dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #111;
          opacity: 0.22;
          animation: loading-pill-blink 1.2s infinite ease-in-out;
        }

        .loading-pill__dot--1 {
          left: 0;
          animation-delay: 0s;
        }

        .loading-pill__dot--2 {
          left: 6px;
          animation-delay: 0.16s;
        }

        .loading-pill__dot--3 {
          left: 12px;
          animation-delay: 0.32s;
        }

        @keyframes loading-pill-blink {
          0%,
          80%,
          100% {
            transform: scale(0.9);
            opacity: 0.22;
          }
          40% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}