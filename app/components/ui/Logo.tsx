// components/Logo.tsx

export default function Logo() {
  return (
    <div style={styles.wrapper} aria-label="ZUNO">
      <svg
        width="94"
        height="30"
        viewBox="0 0 94 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        {/* asymmetric roof accent */}
        <path
          d="M32 9.5L44 4.5L60 9.5"
          stroke="#111111"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* wordmark */}
        <text
          x="17"
          y="22"
          fill="#111111"
          fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="15"
          fontWeight="600"
          letterSpacing="4.2"
        >
          ZUNO
        </text>
      </svg>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
  },
  svg: {
    display: "block",
  },
};


