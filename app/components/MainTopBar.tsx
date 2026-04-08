"use client";

type PropertyType = "apartment" | "house" | "land";
type DealType = "sale" | "rent";

type Props = {
  propertyType: PropertyType;
  dealType: DealType;
  setPropertyType: (value: PropertyType) => void;
  setDealType: (value: DealType) => void;
  onOpenFilters?: () => void;
  onOpenUserMenu?: () => void;
};

export default function MainTopBar({
  propertyType,
  dealType,
  setPropertyType,
  setDealType,
  onOpenFilters,
  onOpenUserMenu,
}: Props) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#fff",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <div
        className="main-topbar-inner"
        style={{
          maxWidth: "100%",
          padding: "12px 16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          position: "relative",
        }}
      >
        <div
          className="main-topbar-logo"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111",
            whiteSpace: "nowrap",
          }}
        >
          HomeMap
        </div>

        <div
          className="main-topbar-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <select
            className="main-topbar-select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            style={selectStyle}
          >
            <option value="apartment">Квартири</option>
            <option value="house">Будинки</option>
            <option value="land">Земля</option>
          </select>

          <div
            className="main-topbar-toggle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#f3f3f3",
              borderRadius: "999px",
              padding: "4px",
              gap: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => setDealType("sale")}
              style={{
                ...toggleButtonStyle,
                background: dealType === "sale" ? "#111" : "transparent",
                color: dealType === "sale" ? "#fff" : "#111",
              }}
            >
              Продаж
            </button>

            <button
              type="button"
              onClick={() => setDealType("rent")}
              style={{
                ...toggleButtonStyle,
                background: dealType === "rent" ? "#111" : "transparent",
                color: dealType === "rent" ? "#fff" : "#111",
              }}
            >
              Оренда
            </button>
          </div>

          <button
            type="button"
            className="main-topbar-filters"
            onClick={onOpenFilters}
            style={pillButtonStyle}
            aria-label="Відкрити розширені фільтри"
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>⚙</span>
            <span>Фільтри</span>
          </button>
        </div>

        <button
          type="button"
          className="main-topbar-user"
          onClick={onOpenUserMenu}
          style={userButtonStyle}
          aria-label="Відкрити меню користувача"
        >
          👤
        </button>
      </div>
    </header>
  );
}

const selectStyle: React.CSSProperties = {
  minWidth: "170px",
  height: "44px",
  padding: "0 14px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "14px",
  color: "#111",
  outline: "none",
  cursor: "pointer",
};

const toggleButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const pillButtonStyle: React.CSSProperties = {
  height: "44px",
  padding: "0 16px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

const userButtonStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  flexShrink: 0,
};
