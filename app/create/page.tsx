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
        minHeight: "100dvh",
        background: "#f7f7f7",
        padding: "16px 12px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #ececec",
          borderRadius: "20px",
          padding: "18px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        }}
      >
        {!user ? (
          <div
            style={{
              display: "grid",
              gap: "14px",
              justifyItems: "start",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                lineHeight: 1.15,
                fontWeight: 800,
                color: "#111",
              }}
            >
              Увійдіть, щоб створити оголошення
            </h1>

            <div
              style={{
                fontSize: "16px",
                color: "#666",
                lineHeight: 1.45,
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
                height: "44px",
                padding: "0 16px",
                borderRadius: "12px",
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
