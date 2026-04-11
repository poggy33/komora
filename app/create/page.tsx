import Link from "next/link";
import { createClient } from "lib/supabase/server";
import CreatePropertyForm from "./CreatePropertyForm";

export default async function CreatePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        {!user ? (
          <div
            style={{
              display: "grid",
              gap: "18px",
              justifyItems: "start",
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
              Увійдіть, щоб створити оголошення
            </h1>

            <div
              style={{
                fontSize: "15px",
                color: "#666",
                lineHeight: 1.6,
                maxWidth: "640px",
              }}
            >
              Створення оголошень доступне лише авторизованим користувачам.
              Після входу ти зможеш додавати об’єкти, завантажувати фото та
              керувати своїми оголошеннями.
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
              }}
            >
              Увійти
            </Link>
          </div>
        ) : (
          <CreatePropertyForm />
        )}
      </div>
    </main>
  );
}