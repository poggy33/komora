"use client";

type Props = {
  count: number;
  title: string;
  subtitle: string;
  isLoading: boolean;
  onClick: () => void;
};

export default function MobileMapHeader({
  count,
  title,
  subtitle,
  isLoading,
  onClick,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="sidebar-header"
        style={{
          padding: "10px 16px 12px",
          borderBottom: "1px solid #eee",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "72px",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {isLoading ? (
          <>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111",
                marginBottom: "2px",
                lineHeight: 1.25,
              }}
            >
              Завантажуємо список...
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#666",
                lineHeight: 1.25,
              }}
            >
              Оновлюємо видимі оголошення
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111",
                marginBottom: "2px",
                lineHeight: 1.25,
              }}
            >
              {count} {title}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#666",
                lineHeight: 1.25,
              }}
            >
              {subtitle}
            </div>
          </>
        )}
      </div>
    </div>
  );
}