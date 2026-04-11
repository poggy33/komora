"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { DealType, Property } from "@/types/property";
import { updatePropertyInSupabase } from "lib/properties";
import type { EditablePropertyMediaItem } from "lib/properties";
import PropertyPhotoManager from "./PropertyPhotoManager";

const LocationPickerMap = dynamic(
  () => import("app/create/LocationPickerMap"),
  { ssr: false },
);

type SupportedPropertyType = "apartment" | "house" | "land";

type Props = {
  property: Property;
  media: EditablePropertyMediaItem[];
  coverImageUrl: string | null;
};

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

function toSupportedPropertyType(
  value: Property["propertyType"],
): SupportedPropertyType {
  if (value === "apartment" || value === "house" || value === "land") {
    return value;
  }

  return "apartment";
}

export default function EditPropertyForm({
  property,
  media,
  coverImageUrl,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: property.title || "",
    description: property.description || "",
    propertyType: toSupportedPropertyType(property.propertyType),
    dealType: property.dealType,
    price: String(property.price ?? ""),
    area: String(property.area ?? ""),
    rooms: property.rooms ? String(property.rooms) : "",
    floor: property.floor ? String(property.floor) : "",
    totalFloors: property.totalFloors ? String(property.totalFloors) : "",
    city: property.location?.city || "",
    region: property.location?.region || "",
    district: property.location?.district || "",
    addressLine: property.location?.addressLine || "",
    lat: String(property.coordinates?.[1] ?? ""),
    lng: String(property.coordinates?.[0] ?? ""),
    sellerName: property.owner?.name || "",
    sellerPhone: property.owner?.phone || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLand = form.propertyType === "land";
  const isApartment = form.propertyType === "apartment";

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

      await updatePropertyInSupabase({
        id: property.id,
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
      });

      router.push(`/property/${property.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Не вдалося оновити оголошення");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h1 style={titleStyle}>Редагувати оголошення</h1>

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
        <div style={hintStyle}>Клікни на мапі, щоб змінити точку об’єкта.</div>
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

      <PropertyPhotoManager
        propertyId={property.id}
        initialMedia={media}
        initialCoverImageUrl={coverImageUrl}
      />
      
      <div style={fieldStyle}>
        <label style={labelStyle}>Опис</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          style={textareaStyle}
          placeholder="Короткий опис об’єкта"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          ...submitButtonStyle,
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Зберігаємо..." : "Зберегти зміни"}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: "24px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "30px",
  fontWeight: 800,
  color: "#111",
  margin: 0,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#222",
};

const hintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666",
  lineHeight: 1.45,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "46px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  padding: "0 14px",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "140px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  padding: "14px",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: 1.5,
};

const submitButtonStyle: React.CSSProperties = {
  height: "50px",
  border: "none",
  borderRadius: "14px",
  background: "#111",
  color: "#fff",
  fontSize: "15px",
  fontWeight: 700,
};

const errorStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: 600,
};
