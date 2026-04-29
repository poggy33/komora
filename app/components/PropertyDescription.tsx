"use client";

type Props = {
  description?: string;
};

export default function PropertyDescription({ description }: Props) {

  return (
    <section style={{ marginBottom: "18px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "12px",
          color: "#111",
          lineHeight: 1.15,
        }}
      >
        Опис
      </h2>

      <div
        style={{
          border: "1px solid #e7e7e7",
          borderRadius: "16px",
          padding: "14px 16px",
          background: "#fff",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.45,
            color: "#333",
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {description?.trim() ||
            "Опис для цього об’єкта поки не додано. Тут може бути детальна інформація про стан нерухомості, планування, переваги локації, умови продажу або оренди та інші важливі характеристики."}
        </p>
      </div>
    </section>
  );
}
