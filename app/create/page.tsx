import CreatePropertyForm from "./CreatePropertyForm";

export default function CreatePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "32px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #ececec",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        <CreatePropertyForm />
      </div>
    </main>
  );
}