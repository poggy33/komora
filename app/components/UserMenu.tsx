"use client";

import Link from "next/link";
import { createClient } from "lib/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";

type Props = {
  onClose?: () => void;
};

export default function UserMenu({ onClose }: Props) {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error && error.name !== "AuthSessionMissingError") {
        console.error("Sign out error:", error);
      }
    } catch (error: any) {
      if (error?.name !== "AuthSessionMissingError") {
        console.error("Failed to sign out:", error);
      }
    } finally {
      onClose?.();
      window.location.replace("/");
    }
  };

  if (isLoading) {
    return (
      <div style={menuStyle}>
        <div style={mutedTextStyle}>Завантаження...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={menuStyle}>
        <div style={sectionStyle}>
          <div style={menuTitleStyle}>Увійдіть</div>
          <div style={mutedTextStyle}>
            Щоб створювати оголошення, керувати своїми об’єктами та мати
            збережені дані.
          </div>
        </div>

        <Link href="/auth" style={primaryLinkStyle} onClick={onClose}>
          Увійти
        </Link>
      </div>
    );
  }

  return (
    <div style={menuStyle}>
      <div style={sectionStyle}>
        <div style={menuTitleStyle}>Користувач</div>
        <div style={mutedTextStyle}>
          {user?.phone || "Авторизований користувач"}
        </div>
      </div>

      <div style={linksListStyle}>
        <Link href="/my-properties" style={menuLinkStyle} onClick={onClose}>
          Мої оголошення
        </Link>

        <Link href="/saved" style={menuLinkStyle} onClick={onClose}>
          Збережені
        </Link>

        <Link href="/create" style={menuLinkStyle} onClick={onClose}>
          Створити оголошення
        </Link>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        style={secondaryButtonStyle}
      >
        Вийти
      </button>
    </div>
  );
}

const menuStyle: React.CSSProperties = {
  width: "280px",
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "18px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
  padding: "14px",
  display: "grid",
  gap: "12px",
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
};

const menuTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#111",
};

const mutedTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666",
  lineHeight: 1.5,
};

const linksListStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
};

const menuLinkStyle: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  padding: "10px 12px",
  borderRadius: "12px",
  background: "#fafafa",
};

const primaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  height: "44px",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: "44px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};
