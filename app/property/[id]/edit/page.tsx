import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "lib/supabase/server";
import { getEditablePropertyByIdFromSupabase } from "lib/properties";
import EditPropertyForm from "./EditPropertyForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
            display: "grid",
            gap: "18px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 800,
              color: "#111",
            }}
          >
            Увійдіть, щоб редагувати оголошення
          </h1>

          <div
            style={{
              fontSize: "15px",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Редагування оголошень доступне лише авторизованим користувачам.
          </div>

          <Link
            href="/auth"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              padding: "0 18px",
              borderRadius: "14px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            Увійти
          </Link>
        </div>
      </main>
    );
  }

  const property = await getEditablePropertyByIdFromSupabase(id, user.id);

  if (!property) {
    notFound();
  }

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
        <EditPropertyForm property={property} />
      </div>
    </main>
  );
}