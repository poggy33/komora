export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
          Оголошення не знайдено
        </h1>
        <p style={{ color: "#666" }}>
          Можливо, об’єкт був видалений або посилання некоректне.
        </p>
      </div>
    </main>
  );
}