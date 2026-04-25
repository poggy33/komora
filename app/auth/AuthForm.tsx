"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "lib/supabase/client";

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClient();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        throw error;
      }

      setStep("code");
    } catch (err) {
      console.error(err);
      setError("Не вдалося надіслати код. Перевір номер телефону.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
      });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Невірний код або код уже неактуальний.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={step === "phone" ? sendCode : verifyCode}
      style={{ display: "grid", gap: "16px" }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: 800,
          color: "#111",
        }}
      >
        Вхід по телефону
      </h1>

      <div
        style={{
          fontSize: "16px",
          color: "#666",
          lineHeight: 1.5,
        }}
      >
        Введи номер телефону у міжнародному форматі, наприклад
        <strong> +380...</strong>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "#fee2e2",
            color: "#991b1b",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "8px" }}>
        <label
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#222",
          }}
        >
          Телефон
        </label>

        {/* <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+380..."
          disabled={step === "code"}
          style={inputStyle}
        /> */}
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+380..."
          disabled={step === "code"}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          style={inputStyle}
        />
      </div>

      {step === "code" && (
        <div style={{ display: "grid", gap: "8px" }}>
          <label
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#222",
            }}
          >
            Код з SMS
          </label>

          {/* <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            style={inputStyle}
          /> */}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            style={inputStyle}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          ...buttonStyle,
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading
          ? "Зачекай..."
          : step === "phone"
            ? "Надіслати код"
            : "Підтвердити код"}
      </button>

      {step === "code" && (
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setError(null);
          }}
          style={secondaryButtonStyle}
        >
          Змінити номер
        </button>
      )}
    </form>
  );
}

// const inputStyle: React.CSSProperties = {
//   width: "100%",
//   height: "46px",
//   borderRadius: "14px",
//   border: "1px solid #ddd",
//   padding: "0 14px",
//   fontSize: "16px",
//   outline: "none",
//   boxSizing: "border-box",
//   background: "#fff",
// };

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "46px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  padding: "0 14px",
  fontSize: "16px",
  lineHeight: "20px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  WebkitTextSizeAdjust: "100%",
};

const buttonStyle: React.CSSProperties = {
  height: "48px",
  border: "none",
  borderRadius: "14px",
  background: "#111",
  color: "#fff",
  fontSize: "15px",
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: "46px",
  border: "1px solid #ddd",
  borderRadius: "14px",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};
