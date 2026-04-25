"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { DealType } from "@/types/property";
import {
  attachPropertyImages,
  createPropertyInSupabase,
  uploadPropertyImages,
} from "lib/properties";
import { createClient } from "lib/supabase/client";

const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
});

type SupportedPropertyType = "apartment" | "house" | "land";

type FormState = {
  title: string;
  description: string;
  propertyType: SupportedPropertyType;
  dealType: DealType;
  price: string;
  area: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  city: string;
  region: string;
  district: string;
  addressLine: string;
  lat: string;
  lng: string;
  sellerName: string;
  sellerPhone: string;
};

const initialState: FormState = {
  title: "",
  description: "",
  propertyType: "apartment",
  dealType: "sale",
  price: "",
  area: "",
  rooms: "",
  floor: "",
  totalFloors: "",
  city: "",
  region: "",
  district: "",
  addressLine: "",
  lat: "",
  lng: "",
  sellerName: "",
  sellerPhone: "",
};

export default function CreatePropertyForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLand = form.propertyType === "land";
  const isApartment = form.propertyType === "apartment";
  const [user, setUser] = useState<any>(null);
  const [submitMode, setSubmitMode] = useState<"draft" | "published">(
    "published",
  );

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagesChange = (files: FileList | null) => {
    if (!files) return;

    const incoming = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const oversized = incoming.find((file) => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setError(`Файл "${oversized.name}" більший за 5 MB`);
      return;
    }

    setImages((prev) => {
      const combined = [...prev, ...incoming];

      const deduped = combined.filter((file, index, arr) => {
        return (
          arr.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified,
          ) === index
        );
      });

      if (deduped.length > 10) {
        setError("Можна додати максимум 10 фото");
        return deduped.slice(0, 10);
      }

      setError(null);
      return deduped;
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const validate = () => {
    if (!form.title.trim()) return "Вкажи назву оголошення";
    if (!form.price.trim()) return "Вкажи ціну";
    if (!form.area.trim()) return "Вкажи площу";
    if (!form.city.trim()) return "Вкажи місто";
    if (!form.lat.trim()) return "Оберіть точку на мапі";
    if (!form.lng.trim()) return "Оберіть точку на мапі";
    if (!form.sellerName.trim()) return "Вкажи ім’я продавця";
    if (!form.sellerPhone.trim()) return "Вкажи телефон продавця";

    if (submitMode === "published" && images.length < 1) {
      return "Щоб опублікувати оголошення, додай хоча б одне фото";
    }

    if (images.length > 10) {
      return "Максимум 10 фото";
    }

    if (!isLand && !form.totalFloors.trim()) {
      return "Вкажи кількість поверхів";
    }

    if (isApartment && !form.floor.trim()) {
      return "Вкажи поверх квартири";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const id = await createPropertyInSupabase({
        title: form.title.trim(),
        description: form.description.trim(),
        propertyType: form.propertyType,
        dealType: form.dealType,
        price: Number(form.price),
        area: Number(form.area),
        rooms: isLand ? undefined : Number(form.rooms || 0) || undefined,
        floor: isApartment ? Number(form.floor) : undefined,
        totalFloors: !isLand ? Number(form.totalFloors) : undefined,
        city: form.city.trim(),
        region: form.region.trim() || undefined,
        district: form.district.trim() || undefined,
        addressLine: form.addressLine.trim() || undefined,
        lat: Number(form.lat),
        lng: Number(form.lng),
        sellerName: form.sellerName.trim(),
        sellerPhone: form.sellerPhone.trim(),
        publicationStatus: submitMode,
      });

      if (images.length > 0) {
        const uploadedImages = await uploadPropertyImages(id, images);
        await attachPropertyImages(id, uploadedImages);
      }

      router.push(`/property/${id}`);
    } catch (err: any) {
      console.error(err);

      if (err?.message === "Draft limit reached") {
        setError("Можна мати не більше 3 чернеток");
        return;
      }

      setError("Не вдалося створити оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h1 style={titleStyle}>Створити оголошення</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Назва</label>
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            style={inputStyle}
            placeholder="Напр. 2-кімнатна квартира в центрі"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Тип нерухомості</label>
          <select
            value={form.propertyType}
            onChange={(e) =>
              updateField(
                "propertyType",
                e.target.value as SupportedPropertyType,
              )
            }
            style={inputStyle}
          >
            <option value="apartment">Квартира</option>
            <option value="house">Будинок</option>
            <option value="land">Земля</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Продаж / оренда</label>
          <select
            value={form.dealType}
            onChange={(e) =>
              updateField("dealType", e.target.value as DealType)
            }
            style={inputStyle}
          >
            <option value="sale">Продаж</option>
            <option value="rent">Оренда</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Ціна</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            style={inputStyle}
            placeholder="65000"
            inputMode="numeric"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Площа</label>
          <input
            type="number"
            value={form.area}
            onChange={(e) => updateField("area", e.target.value)}
            style={inputStyle}
            placeholder={isLand ? "8" : "56"}
            inputMode="numeric"
          />
        </div>

        {!isLand && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Кімнати</label>
            <input
              type="number"
              value={form.rooms}
              onChange={(e) => updateField("rooms", e.target.value)}
              style={inputStyle}
              placeholder="2"
              inputMode="numeric"
            />
          </div>
        )}

        {isApartment && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Поверх</label>
            <input
              type="number"
              value={form.floor}
              onChange={(e) => updateField("floor", e.target.value)}
              style={inputStyle}
              placeholder="5"
              inputMode="numeric"
            />
          </div>
        )}

        {!isLand && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Всього поверхів</label>
            <input
              type="number"
              value={form.totalFloors}
              onChange={(e) => updateField("totalFloors", e.target.value)}
              style={inputStyle}
              placeholder={isApartment ? "9" : "2"}
              inputMode="numeric"
            />
          </div>
        )}

        <div style={fieldStyle}>
          <label style={labelStyle}>Місто</label>
          <input
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            style={inputStyle}
            placeholder="Івано-Франківськ"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Область</label>
          <input
            value={form.region}
            onChange={(e) => updateField("region", e.target.value)}
            style={inputStyle}
            placeholder="Івано-Франківська область"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Район</label>
          <input
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
            style={inputStyle}
            placeholder="Центр"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Адреса</label>
          <input
            value={form.addressLine}
            onChange={(e) => updateField("addressLine", e.target.value)}
            style={inputStyle}
            placeholder="вул. Незалежності, 10"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Ім’я продавця</label>
          <input
            value={form.sellerName}
            onChange={(e) => updateField("sellerName", e.target.value)}
            style={inputStyle}
            placeholder="Іван"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Телефон продавця</label>
          <input
            value={form.sellerPhone}
            onChange={(e) => updateField("sellerPhone", e.target.value)}
            style={inputStyle}
            placeholder="+380671234567"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Точка на мапі</label>
        <LocationPickerMap
          lat={form.lat ? Number(form.lat) : null}
          lng={form.lng ? Number(form.lng) : null}
          onPick={({ lat, lng }) => {
            updateField("lat", String(lat));
            updateField("lng", String(lng));
          }}
        />
        <div style={hintStyle}>Клікни на мапі, щоб вибрати точку об’єкта.</div>
      </div>

      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Latitude</label>
          <input
            value={form.lat}
            readOnly
            style={{ ...inputStyle, background: "#f8f8f8" }}
            placeholder="Оберіть точку на мапі"
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Longitude</label>
          <input
            value={form.lng}
            readOnly
            style={{ ...inputStyle, background: "#f8f8f8" }}
            placeholder="Оберіть точку на мапі"
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Фото оголошення</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            handleImagesChange(e.target.files);
            e.currentTarget.value = "";
          }}
          style={fileInputStyle}
        />
        <div style={hintStyle}>
          Додай від 1 до 10 фото. Перше фото стане головним.
        </div>

        {images.length > 0 && (
          <>
            <div style={imagesMetaStyle}>Вибрано {images.length} з 10 фото</div>

            <div style={imagesGridStyle}>
              {images.map((file, index) => (
                <div key={`${file.name}-${index}`} style={imageCardStyle}>
                  <div style={imageCardHeaderStyle}>
                    <div style={imageCardTitleStyle}>
                      {index === 0 ? "Головне фото" : `Фото ${index + 1}`}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={removeImageButtonStyle}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={imageCardNameStyle}>{file.name}</div>
                  <div style={imageCardSizeStyle}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Опис</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          style={textareaStyle}
          placeholder="Короткий опис об’єкта"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setSubmitMode("draft")}
          style={{
            ...secondarySubmitButtonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting && submitMode === "draft"
            ? "Зберігаємо..."
            : "Зберегти як чернетку"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setSubmitMode("published")}
          style={{
            ...submitButtonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting && submitMode === "published"
            ? "Публікуємо..."
            : "Опублікувати"}
        </button>
      </div>
    </form>
  );
}

const errorStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: 600,
};

const imagesMetaStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#444",
  fontWeight: 600,
};

const imagesGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "12px",
};

const imageCardStyle: React.CSSProperties = {
  border: "1px solid #ececec",
  borderRadius: "14px",
  padding: "12px",
  fontSize: "12px",
  color: "#444",
  background: "#fafafa",
  display: "grid",
  gap: "8px",
};

const imageCardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
};

const imageCardTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#111",
  fontSize: "12px",
};

const imageCardNameStyle: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#333",
};

const imageCardSizeStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#777",
};

const removeImageButtonStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  cursor: "pointer",
  flexShrink: 0,
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  lineHeight: 1.15,
  fontWeight: 800,
  color: "#111",
  margin: 0,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#222",
};

const hintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666",
  lineHeight: 1.35,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  padding: "0 12px",
  fontSize: "16px",
  lineHeight: "20px",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  WebkitTextSizeAdjust: "100%",
};

const fileInputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid #ddd",
  padding: "10px 12px",
  fontSize: "16px",
  lineHeight: "20px",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  WebkitTextSizeAdjust: "100%",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "112px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  padding: "12px",
  fontSize: "16px",
  lineHeight: 1.4,
  outline: "none",
  background: "#fff",
  resize: "vertical",
  boxSizing: "border-box",
  WebkitTextSizeAdjust: "100%",
};

const submitButtonStyle: React.CSSProperties = {
  height: "46px",
  border: "none",
  padding: "10px 10px",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "15px",
  fontWeight: 700,
};

const secondarySubmitButtonStyle: React.CSSProperties = {
  height: "46px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
  color: "#111",
  fontSize: "15px",
  fontWeight: 700,
  padding: "0 14px",
};
