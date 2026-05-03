"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "lib/supabase/client";

function normalizePhone(input: string): string {
  let value = input.trim();

  // прибираємо пробіли, дужки, тире
  value = value.replace(/[^\d+]/g, "");

  // якщо починається з 0 → +380
  if (value.startsWith("0")) {
    value = "+38" + value;
  }

  // якщо без + але починається з 380
  if (!value.startsWith("+") && value.startsWith("380")) {
    value = "+" + value;
  }

  return value;
}

function isValidPhone(phone: string): boolean {
  return /^\+\d{10,15}$/.test(phone);
}

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const rawNextUrl = searchParams.get("next");
  const nextUrl =
    rawNextUrl && rawNextUrl.startsWith("/") && !rawNextUrl.startsWith("//")
      ? rawNextUrl
      : "/";

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalized = normalizePhone(phone);

    if (!isValidPhone(normalized)) {
      setError("Введіть номер у форматі +380XXXXXXXXX");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOtp({
        phone: normalized,
      });

      if (error) throw error;

      setPhone(normalized); // 🔥 важливо
      setStep("code");
      setCooldown(60); // 60 секунд
    } catch (err) {
      console.error(err);
      setError("Не вдалося надіслати код. Спробуйте пізніше.");
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

      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Невірний код або код уже неактуальний.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const isPhoneValid = isValidPhone(normalizePhone(phone));
  const isCodeValid = code.length === 6;
  const isSubmitDisabled =
    isLoading ||
    (step === "phone" && !isPhoneValid) ||
    (step === "code" && !isCodeValid);

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

          <input
            value={code}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setCode(raw.slice(0, 6));
            }}
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
        disabled={isSubmitDisabled}
        style={{
          ...buttonStyle,
          opacity: isSubmitDisabled ? 0.6 : 1,
          cursor: isSubmitDisabled ? "not-allowed" : "pointer",
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
          disabled={cooldown > 0}
          onClick={sendCode}
          style={{
            ...secondaryButtonStyle,
            opacity: cooldown > 0 ? 0.5 : 1,
            cursor: cooldown > 0 ? "not-allowed" : "pointer",
          }}
        >
          {cooldown > 0
            ? `Надіслати ще раз (${cooldown})`
            : "Надіслати код ще раз"}
        </button>
      )}
      {step === "code" && (
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setError(null);
            setCooldown(0);
          }}
          style={secondaryButtonStyle}
        >
          Змінити номер
        </button>
      )}
    </form>
  );
}

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
