// "use client";

// import { useState } from "react";

// type Props = {
//   count: number;
//   title: string;
//   subtitle: string;
//   isLoading: boolean;
//   onClick: () => void;
//   onDragStart?: (clientY: number) => void;
//   onDragMove?: (clientY: number) => void;
//   onDragEnd?: () => void;
// };

// export default function MobileMapHeader({
//   count,
//   title,
//   subtitle,
//   isLoading,
//   onClick,
//   onDragStart,
//   onDragMove,
//   onDragEnd,
// }: Props) {
//   const [isPressed, setIsPressed] = useState(false);

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       onMouseDown={() => setIsPressed(true)}
//       onMouseUp={() => setIsPressed(false)}
//       onMouseLeave={() => setIsPressed(false)}
//       onTouchStart={(e) => {
//         setIsPressed(true);
//         onDragStart?.(e.touches[0].clientY);
//       }}
//       onTouchMove={(e) => {
//         onDragMove?.(e.touches[0].clientY);
//       }}
//       onTouchEnd={() => {
//         setIsPressed(false);
//         onDragEnd?.();
//       }}
//       style={{
//         width: "100%",
//         minHeight: "48px",
//         padding: "4px 16px 8px",
//         border: "none",
//         borderTop: "1px solid #eee",
//         background: "rgba(255,255,255,0.96)",
//         backdropFilter: "blur(8px)",
//         WebkitBackdropFilter: "blur(8px)",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         textAlign: "left",
//         boxSizing: "border-box",
//         appearance: "none",
//         WebkitAppearance: "none",
//         opacity: isPressed ? 0.72 : 1,
//         transition: "opacity 0.16s ease",
//         touchAction: "none",
//       }}
//       aria-label={
//         isLoading ? "Відкрити список" : `${count} ${title}. Відкрити список`
//       }
//     >
//       {isLoading ? (
//         <>
//           <div
//             style={{
//               fontSize: "12.5px",
//               fontWeight: 700,
//               color: "#111",
//               marginBottom: "1px",
//               lineHeight: 1.15,
//             }}
//           >
//             Завантажуємо список...
//           </div>

//           <div
//             style={{
//               fontSize: "10.5px",
//               lineHeight: 1.15,
//               color: "#666",
//             }}
//           >
//             Оновлюємо видимі оголошення
//           </div>
//         </>
//       ) : (
//         <>
//           <div
//             style={{
//               fontSize: "13px",
//               fontWeight: 700,
//               color: "#111",
//               marginBottom: "2px",
//               lineHeight: 1.2,
//             }}
//           >
//             {count} {title}
//           </div>

//           <div
//             style={{
//               fontSize: "11px",
//               color: "#666",
//               lineHeight: 1.2,
//             }}
//           >
//             {subtitle}
//           </div>
//         </>
//       )}
//     </button>
//   );
// }

"use client";

import { useState } from "react";

type Props = {
  count: number;
  title: string;
  subtitle: string;
  isLoading: boolean;
  onClick: () => void;
  onDragStart?: (clientY: number) => void;
  onDragMove?: (clientY: number) => void;
  onDragEnd?: () => void;
};

export default function MobileMapHeader({
  count,
  title,
  subtitle,
  isLoading,
  onClick,
  onDragStart,
  onDragMove,
  onDragEnd,
}: Props) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={(e) => {
        setIsPressed(true);
        onDragStart?.(e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        onDragMove?.(e.touches[0].clientY);
      }}
      onTouchEnd={() => {
        setIsPressed(false);
        onDragEnd?.();
      }}
      style={{
        width: "100%",
        minHeight: "74px",
        padding: "10px 18px 12px",
        border: "none",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderTopLeftRadius: "22px",
        borderTopRightRadius: "22px",
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        cursor: "grab",
        display: "grid",
        gap: "6px",
        alignContent: "start",
        textAlign: "left",
        boxSizing: "border-box",
        appearance: "none",
        WebkitAppearance: "none",
        opacity: isPressed ? 0.84 : 1,
        transition: "opacity 0.16s ease",
        touchAction: "none",
        boxShadow: "0 -10px 30px rgba(0,0,0,0.08)",
      }}
      aria-label={
        isLoading ? "Відкрити список" : `${count} ${title}. Відкрити список`
      }
    >
      <div
        style={{
          width: "42px",
          height: "5px",
          borderRadius: "999px",
          background: "rgba(0,0,0,0.18)",
          justifySelf: "center",
          marginBottom: "4px",
        }}
      />

      {isLoading ? (
        <div style={{ display: "grid", gap: "2px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.15,
            }}
          >
            Завантажуємо список...
          </div>

          <div
            style={{
              fontSize: "11px",
              lineHeight: 1.15,
              color: "#666",
            }}
          >
            Оновлюємо видимі оголошення
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "2px" }}>
          <div
            style={{
              fontSize: "13.5px",
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.2,
            }}
          >
            {count} {title}
          </div>

          <div
            style={{
              fontSize: "11.5px",
              color: "#666",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </div>
        </div>
      )}
    </button>
  );
}

