"use client";

type Props = {
  active: boolean;
  size?: number;
};

export default function FavoriteHeart({
  active,
  size = 20,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? "#E31B23" : "rgba(255,255,255,0.92)"}
      stroke={active ? "#E31B23" : "#111"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.5s-7-4.35-9.5-8.28C.6 9.4 1.35 5.95 4.4 4.4c2.2-1.12 4.77-.43 6.1 1.42C11.83 3.97 14.4 3.28 16.6 4.4c3.05 1.55 3.8 5 1.9 7.82C19 16.15 12 20.5 12 20.5z" />
    </svg>
  );
}