// "use client";

// import type { Property } from "../types/property";

// type Props = {
//   properties: Property[];
//   dealType: "sale" | "rent";
//   propertyType: "apartment" | "house" | "land";
//   setDealType: (v: "sale" | "rent") => void;
//   setPropertyType: (v: "apartment" | "house" | "land") => void;
//   onSelect: (p: Property) => void;
//   onHover: (id: string | null) => void;
// };

// export default function Sidebar({
//   properties,
//   dealType,
//   propertyType,
//   setDealType,
//   setPropertyType,
//   onSelect,
//   onHover, // 🔥 ДОДАЙ
// }: Props) {
//   return (
//     <div
//       style={{
//         width: "360px",
//         maxWidth: "100%",
//         height: "100vh",
//         overflowY: "auto",
//         background: "#fff",
//         borderRight: "1px solid #eee",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* 🔥 FILTERS */}
//       <div style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
//         {/* PROPERTY TYPE (dropdown) */}
//         <select
//           value={propertyType}
//           onChange={(e) => setPropertyType(e.target.value as any)}
//           style={{
//             width: "100%",
//             padding: "8px",
//             marginBottom: "10px",
//           }}
//         >
//           <option value="apartment">Квартири</option>
//           <option value="house">Будинки</option>
//           <option value="land">Земля</option>
//         </select>

//         {/* DEAL TYPE */}
//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             onClick={() => setDealType("sale")}
//             style={{
//               flex: 1,
//               background: dealType === "sale" ? "#000" : "#eee",
//               color: dealType === "sale" ? "#fff" : "#000",
//               padding: "8px",
//               borderRadius: "6px",
//             }}
//           >
//             Продаж
//           </button>

//           <button
//             onClick={() => setDealType("rent")}
//             style={{
//               flex: 1,
//               background: dealType === "rent" ? "#000" : "#eee",
//               color: dealType === "rent" ? "#fff" : "#000",
//               padding: "8px",
//               borderRadius: "6px",
//             }}
//           >
//             Оренда
//           </button>
//         </div>
//       </div>

//       {/* 🔥 LIST */}
//       <div style={{ padding: "12px" }}>
//         {properties.map((p) => (
//           <a
//             key={p.id}
//             href={`/property/${p.id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//             }}
//           >
//             <div
//               onMouseEnter={() => onHover(p.id)}
//               onMouseLeave={() => onHover(null)}
//               style={{
//                 padding: "12px",
//                 marginBottom: "10px",
//                 borderRadius: "10px",
//                 border: "1px solid #eee",
//                 cursor: "pointer",
//               }}
//             >
//               <div style={{ fontWeight: 600 }}>{p.title}</div>

//               <div>💰 ${p.price.toLocaleString()}</div>

//               {p.propertyType === "apartment" && (
//                 <div>
//                   📐 {p.area} м² • 🛏 {p.rooms}
//                 </div>
//               )}

//               {p.propertyType === "house" && (
//                 <div>
//                   🏠 {p.area} м² • 🛏 {p.rooms} • 🏢 {p.floors} пов.
//                 </div>
//               )}

//               {p.propertyType === "land" && <div>🌍 {p.area} сот.</div>}
//             </div>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import type { Property } from "../types/property";

// type Props = {
//   properties: Property[];
//   dealType: "sale" | "rent";
//   propertyType: "apartment" | "house" | "land";
//   setDealType: (v: "sale" | "rent") => void;
//   setPropertyType: (v: "apartment" | "house" | "land") => void;
//   onSelect: (p: Property) => void;
//   onHover: (id: string | null) => void;
// };

// export default function Sidebar({
//   properties,
//   dealType,
//   propertyType,
//   setDealType,
//   setPropertyType,
//   onSelect,
//   onHover,
// }: Props) {
//   return (
//     <div
//       style={{
//         width: "360px",
//         maxWidth: "100%",
//         height: "100vh",
//         overflowY: "auto",
//         background: "#fff",
//         borderRight: "1px solid #eee",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
//         <select
//           value={propertyType}
//           onChange={(e) =>
//             setPropertyType(e.target.value as "apartment" | "house" | "land")
//           }
//           style={{
//             width: "100%",
//             padding: "8px",
//             marginBottom: "10px",
//             borderRadius: "8px",
//             border: "1px solid #ddd",
//             background: "#fff",
//           }}
//         >
//           <option value="apartment">Квартири</option>
//           <option value="house">Будинки</option>
//           <option value="land">Земля</option>
//         </select>

//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             type="button"
//             onClick={() => setDealType("sale")}
//             style={{
//               flex: 1,
//               background: dealType === "sale" ? "#000" : "#eee",
//               color: dealType === "sale" ? "#fff" : "#000",
//               padding: "10px",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             Продаж
//           </button>

//           <button
//             type="button"
//             onClick={() => setDealType("rent")}
//             style={{
//               flex: 1,
//               background: dealType === "rent" ? "#000" : "#eee",
//               color: dealType === "rent" ? "#fff" : "#000",
//               padding: "10px",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             Оренда
//           </button>
//         </div>
//       </div>

//       <div style={{ padding: "12px" }}>
//         {properties.map((p) => (
//           <div
//             key={p.id}
//             onMouseEnter={() => onHover(String(p.id))}
//             onMouseLeave={() => onHover(null)}
//             onClick={() => onSelect(p)}
//             style={{
//               padding: "12px",
//               marginBottom: "10px",
//               borderRadius: "10px",
//               border: "1px solid #eee",
//               cursor: "pointer",
//               transition: "0.2s ease",
//               background: "#fff",
//             }}
//           >
//             <div style={{ fontWeight: 700, marginBottom: "6px" }}>{p.title}</div>

//             <div style={{ marginBottom: "6px" }}>💰 ${p.price.toLocaleString()}</div>

//             {p.propertyType === "apartment" && (
//               <div style={{ color: "#555", fontSize: "14px" }}>
//                 📐 {p.area} м² • 🛏 {p.rooms}
//               </div>
//             )}

//             {p.propertyType === "house" && (
//               <div style={{ color: "#555", fontSize: "14px" }}>
//                 🏠 {p.area} м² • 🛏 {p.rooms} • 🏢 {p.floors} пов.
//               </div>
//             )}

//             {p.propertyType === "land" && (
//               <div style={{ color: "#555", fontSize: "14px" }}>
//                 🌍 {p.area} сот.
//               </div>
//             )}

//             <a
//               href={`/property/${p.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={(e) => e.stopPropagation()}
//               style={{
//                 display: "inline-block",
//                 marginTop: "10px",
//                 textDecoration: "none",
//                 color: "#2563eb",
//                 fontWeight: 600,
//                 fontSize: "14px",
//               }}
//             >
//               Відкрити оголошення
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import type { Property } from "../types/property";

type Props = {
  properties: Property[];
  dealType: "sale" | "rent";
  propertyType: "apartment" | "house" | "land";
  setDealType: (v: "sale" | "rent") => void;
  setPropertyType: (v: "apartment" | "house" | "land") => void;
  onSelect: (p: Property) => void;
  onHover: (id: string | null) => void;
};

export default function Sidebar({
  properties,
  dealType,
  propertyType,
  setDealType,
  setPropertyType,
  onSelect,
  onHover,
}: Props) {
  return (
    <div
      style={{
        width: "360px",
        maxWidth: "100%",
        height: "100vh",
        overflowY: "auto",
        background: "#fff",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(e.target.value as "apartment" | "house" | "land")
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <option value="apartment">Квартири</option>
          <option value="house">Будинки</option>
          <option value="land">Земля</option>
        </select>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setDealType("sale")}
            style={{
              flex: 1,
              background: dealType === "sale" ? "#000" : "#eee",
              color: dealType === "sale" ? "#fff" : "#000",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Продаж
          </button>

          <button
            type="button"
            onClick={() => setDealType("rent")}
            style={{
              flex: 1,
              background: dealType === "rent" ? "#000" : "#eee",
              color: dealType === "rent" ? "#fff" : "#000",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Оренда
          </button>
        </div>
      </div>

      <div style={{ padding: "12px" }}>
        {properties.map((p) => (
          <a
            key={p.id}
            href={`/property/${p.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => onHover(String(p.id))}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(p)}
            style={{
              display: "block",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              border: "1px solid #eee",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>{p.title}</div>

            <div style={{ marginBottom: "6px" }}>
              💰 ${p.price.toLocaleString()}
            </div>

            {p.propertyType === "apartment" && (
              <div>
                📐 {p.area} м² • 🛏 {p.rooms}
              </div>
            )}

            {p.propertyType === "house" && (
              <div>
                🏠 {p.area} м² • 🛏 {p.rooms} • 🏢 {p.floors} пов.
              </div>
            )}

            {p.propertyType === "land" && <div>🌍 {p.area} сот.</div>}
          </a>
        ))}
      </div>
    </div>
  );
}
