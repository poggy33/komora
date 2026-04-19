type Props = {
  isActive: boolean;
  size?: number;
};

export default function HeartIcon({ isActive, size = 18 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isActive ? "#ef4444" : "none"}
      stroke={isActive ? "#ef4444" : "#9ca3af"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.5 1.5-1.5 4 0 5.5L12 19l8.8-8.9c1.5-1.5 1.5-4 0-5.5z" />
    </svg>
  );
}