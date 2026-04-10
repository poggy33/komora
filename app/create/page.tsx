import CreatePropertyForm from "./CreatePropertyForm";

export default function CreatePage() {
  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#111",
      }}
    >
      <CreatePropertyForm />
    </main>
  );
}