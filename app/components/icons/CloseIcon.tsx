"use client";

type Props = {
  size?: number;
};

export default function CloseIcon({ size = 18 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6 18 18" />
    </svg>
  );
}