// import { useState } from "react";

// type Props = {
//   id: string;
//   price: number;
//   rooms: number;
//   area: number;
//   images: string[];
// };

// export default function PopupCard({ id, price, rooms, area, images }: Props) {
//   const [index, setIndex] = useState(0);

//   const next = () => {
//     setIndex((prev) => (prev + 1) % images.length);
//   };

//   const prev = () => {
//     setIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const safeImages = images?.length
//     ? images
//     : ["https://via.placeholder.com/300"];

//   const safeIndex = index % safeImages.length;

//   return (
//     <a
//       href={`/property/${id}`}
//       target="_blank"
//       style={{
//         textDecoration: "none",
//         color: "inherit",
//         display: "block",
//         width: "220px",
//         fontFamily: "Arial",
//       }}
//     >
//       {/* IMAGE */}
//       <div style={{ position: "relative" }}>
//         <img
//             // src={images[index]}
//           src={safeImages[safeIndex]}
//         //   src={images[index] || images[0]}
//   alt=""
//           style={{
//             width: "100%",
//             height: "130px",
//             objectFit: "cover",
//             borderRadius: "12px",
//           }}
//         />

//         {/* LEFT */}
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             prev();
//           }}
//           style={{
//             position: "absolute",
//             left: 5,
//             top: "50%",
//             transform: "translateY(-50%)",
//           }}
//         >
//           ◀
//         </button>

//         {/* RIGHT */}
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             next();
//           }}
//           style={{
//             position: "absolute",
//             right: 5,
//             top: "50%",
//             transform: "translateY(-50%)",
//           }}
//         >
//           ▶
//         </button>
//       </div>

//       {/* INFO */}
//       <div style={{ marginTop: "6px" }}>
//         <div style={{ fontWeight: 600 }}>${price.toLocaleString()}</div>

//         <div style={{ fontSize: "13px", color: "#555" }}>
//           {rooms} кімн. • {area} м²
//         </div>
//       </div>
//     </a>
//   );
// }

// import { useState } from "react";

// type Props = {
//   id: string;
//   price: number;
//   rooms: number;
//   area: number;
//   images: string[];
// };

// export default function PopupCard({ id, price, rooms, area, images }: Props) {
//   const safeImages =
//     Array.isArray(images) && images.length > 0
//       ? images
//       : ["https://via.placeholder.com/300"];

//   const [index, setIndex] = useState(0);

//   const next = () => {
//     setIndex((prev) => (prev + 1) % safeImages.length);
//   };

//   const prev = () => {
//     setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
//   };

//   const safeIndex = index % safeImages.length;

//   return (
//     <div
//       style={{
//         width: "220px",
//         fontFamily: "Arial",
//       }}
//     >
//       <div style={{ position: "relative" }}>
//         <a
//           href={`/property/${id}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ display: "block" }}
//         >
//           <img
//             src={safeImages[safeIndex]}
//             alt=""
//             style={{
//               width: "100%",
//               height: "130px",
//               objectFit: "cover",
//               borderRadius: "12px",
//               display: "block",
//             }}
//           />
//         </a>

//         {safeImages.length > 1 && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 prev();
//               }}
//               style={{
//                 position: "absolute",
//                 left: 5,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 zIndex: 2,
//               }}
//             >
//               ◀
//             </button>

//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 next();
//               }}
//               style={{
//                 position: "absolute",
//                 right: 5,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 zIndex: 2,
//               }}
//             >
//               ▶
//             </button>
//           </>
//         )}
//       </div>

//       <a
//         href={`/property/${id}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{
//           textDecoration: "none",
//           color: "inherit",
//           display: "block",
//           marginTop: "6px",
//         }}
//       >
//         <div style={{ fontWeight: 600 }}>${price.toLocaleString()}</div>

//         <div style={{ fontSize: "13px", color: "#555" }}>
//           {rooms} кімн. • {area} м²
//         </div>
//       </a>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

type Props = {
  id: string;
  price: number;
  rooms?: number;
  area: number;
  images: string[];
};

export default function PopupCard({ id, price, rooms, area, images }: Props) {
  const safeImages =
    Array.isArray(images) && images.length > 0
      ? images
      : ["https://via.placeholder.com/300"];

  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const safeIndex = index % safeImages.length;

  return (
    <div
      style={{
        width: "220px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ position: "relative" }}>
        <a
          href={`/property/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block" }}
        >
          <img
            src={safeImages[safeIndex]}
            alt={`Property ${id}`}
            style={{
              width: "100%",
              height: "130px",
              objectFit: "cover",
              borderRadius: "12px",
              display: "block",
            }}
          />
        </a>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prev();
              }}
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: "28px",
                height: "28px",
                borderRadius: "999px",
                border: "none",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              ◀
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                next();
              }}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: "28px",
                height: "28px",
                borderRadius: "999px",
                border: "none",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              ▶
            </button>
          </>
        )}
      </div>

      <a
        href={`/property/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          marginTop: "8px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "16px" }}>
          ${price.toLocaleString()}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#555",
            marginTop: "4px",
          }}
        >
          {rooms !== undefined && `${rooms} кімн. • `}{area} м²
        </div>
      </a>
    </div>
  );
}
