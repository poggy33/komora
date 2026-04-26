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
  marketType: "" | "new_building" | "secondary";
  yearBuilt: string;
  livingArea: string;
  kitchenArea: string;

  heatingType: "" | "individual" | "central" | "electric" | "solid_fuel";
  parkingType: "" | "parking" | "underground";
  renovationType: "" | "no_repair" | "livable" | "good" | "euro";

  documentsReady: boolean;
  petsAllowed: boolean;
  isFurnished: boolean;

  lotArea: string;
  landPurpose: "" | "residential" | "agricultural" | "commercial";
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
  marketType: "",
  yearBuilt: "",
  livingArea: "",
  kitchenArea: "",

  heatingType: "",
  parkingType: "",
  renovationType: "",

  documentsReady: false,
  petsAllowed: false,
  isFurnished: false,

  lotArea: "",
  landPurpose: "",
};

const LIMITS = {
  title: 80,
  description: 2000,
  city: 60,
  region: 60,
  district: 80,
  addressLine: 120,
  sellerName: 60,
  sellerPhone: 20,
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
  const [submitMode, setSubmitMode] = useState<"draft" | "active">("active");

  const updateField = (key: keyof FormState, value: string) => {
    if (isSubmitting) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateBooleanField = (key: keyof FormState, value: boolean) => {
    if (isSubmitting) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagesChange = (files: FileList | null) => {
    if (isSubmitting) return;
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
    if (isSubmitting) return;
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

    if (submitMode === "active" && images.length < 1) {
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
        marketType: form.marketType,
        yearBuilt: form.yearBuilt,
        livingArea: form.livingArea,
        kitchenArea: form.kitchenArea,

        heatingType: form.heatingType,
        parkingType: form.parkingType,
        renovationType: form.renovationType,

        documentsReady: form.documentsReady,
        petsAllowed: form.petsAllowed,
        isFurnished: form.isFurnished,

        lotArea: form.lotArea,
        landPurpose: form.landPurpose,
      });

      if (images.length > 0) {
        const uploadedImages = await uploadPropertyImages(id, images);
        await attachPropertyImages(id, uploadedImages);
      }

      router.replace(`/property/${id}`);
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

  const [imagePreviews, setImagePreviews] = useState<
    { file: File; url: string }[]
  >([]);

  useEffect(() => {
    const previews = images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [images]);
  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={{ display: "grid", gap: "6px" }}>
        <h1 style={titleStyle}>Створити оголошення</h1>
        <div style={hintStyle}>
          Заповни основну інформацію про об’єкт. Перше фото стане головним.
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <fieldset
        disabled={isSubmitting}
        style={{
          border: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: "18px",
          opacity: isSubmitting ? 0.75 : 1,
        }}
      >
        {/* ===== Основне ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Основне</h2>

          <label style={fieldStyle}>
            <span style={labelStyle}>Назва</span>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              maxLength={LIMITS.title}
              placeholder="Напр. 2-кімнатна квартира біля парку"
              style={inputStyle}
            />
            <span style={hintStyle}>
              {form.title.length}/{LIMITS.title}
            </span>
          </label>

          <div style={gridStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Тип об’єкта</span>
              <select
                value={form.propertyType}
                onChange={(e) => updateField("propertyType", e.target.value)}
                style={inputStyle}
              >
                <option value="apartment">Квартира</option>
                <option value="house">Будинок</option>
                <option value="land">Земля</option>
                <option value="commercial">Комерція</option>
              </select>
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Тип угоди</span>
              <select
                value={form.dealType}
                onChange={(e) => updateField("dealType", e.target.value)}
                style={inputStyle}
              >
                <option value="sale">Продаж</option>
                <option value="rent">Оренда</option>
              </select>
            </label>
          </div>

          <div style={gridStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Ціна</span>
              <input
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                inputMode="numeric"
                placeholder="Напр. 35000"
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Площа, м²</span>
              <input
                value={form.area}
                onChange={(e) => updateField("area", e.target.value)}
                inputMode="decimal"
                placeholder="Напр. 56"
                style={inputStyle}
              />
            </label>
          </div>

          {form.propertyType !== "land" && (
            <div style={gridStyle}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Кімнати</span>
                <input
                  value={form.rooms}
                  onChange={(e) => updateField("rooms", e.target.value)}
                  inputMode="numeric"
                  placeholder="Напр. 2"
                  style={inputStyle}
                />
              </label>

              {form.propertyType === "apartment" && (
                <label style={fieldStyle}>
                  <span style={labelStyle}>Поверх</span>
                  <input
                    value={form.floor}
                    onChange={(e) => updateField("floor", e.target.value)}
                    inputMode="numeric"
                    placeholder="Напр. 5"
                    style={inputStyle}
                  />
                </label>
              )}

              <label style={fieldStyle}>
                <span style={labelStyle}>Всього поверхів</span>
                <input
                  value={form.totalFloors}
                  onChange={(e) => updateField("totalFloors", e.target.value)}
                  inputMode="numeric"
                  placeholder="Напр. 9"
                  style={inputStyle}
                />
              </label>
            </div>
          )}
        </section>

        {/* ===== Деталі обʼєкта ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Деталі об’єкта</h2>

          {(form.propertyType === "apartment" ||
            form.propertyType === "house") && (
            <div style={gridStyle}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Ринок</span>
                <select
                  value={form.marketType}
                  onChange={(e) => updateField("marketType", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Не вказано</option>
                  <option value="new_building">Новобудова</option>
                  <option value="secondary">Вторинний ринок</option>
                </select>
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Рік будівництва</span>
                <input
                  value={form.yearBuilt}
                  onChange={(e) => updateField("yearBuilt", e.target.value)}
                  inputMode="numeric"
                  placeholder="Напр. 2018"
                  style={inputStyle}
                />
              </label>
            </div>
          )}

          {form.propertyType === "apartment" && (
            <div style={gridStyle}>
              <label style={fieldStyle}>
                <span style={labelStyle}>Житлова площа, м²</span>
                <input
                  value={form.livingArea}
                  onChange={(e) => updateField("livingArea", e.target.value)}
                  inputMode="decimal"
                  placeholder="Напр. 38"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle}>
                <span style={labelStyle}>Площа кухні, м²</span>
                <input
                  value={form.kitchenArea}
                  onChange={(e) => updateField("kitchenArea", e.target.value)}
                  inputMode="decimal"
                  placeholder="Напр. 12"
                  style={inputStyle}
                />
              </label>
            </div>
          )}

          {(form.propertyType === "house" || form.propertyType === "land") && (
            <label style={fieldStyle}>
              <span style={labelStyle}>Площа ділянки, соток</span>
              <input
                value={form.lotArea}
                onChange={(e) => updateField("lotArea", e.target.value)}
                inputMode="decimal"
                placeholder="Напр. 10"
                style={inputStyle}
              />
            </label>
          )}

          {form.propertyType === "land" && (
            <label style={fieldStyle}>
              <span style={labelStyle}>Призначення землі</span>
              <select
                value={form.landPurpose}
                onChange={(e) => updateField("landPurpose", e.target.value)}
                style={inputStyle}
              >
                <option value="">Не вказано</option>
                <option value="residential">Під житлову забудову</option>
                <option value="agricultural">Сільськогосподарська</option>
                <option value="commercial">Комерційна</option>
              </select>
            </label>
          )}

          {form.propertyType !== "land" && (
            <>
              <div style={gridStyle}>
                <label style={fieldStyle}>
                  <span style={labelStyle}>Опалення</span>
                  <select
                    value={form.heatingType}
                    onChange={(e) => updateField("heatingType", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Не вказано</option>
                    <option value="individual">Індивідуальне</option>
                    <option value="central">Центральне</option>
                    <option value="electric">Електричне</option>
                    <option value="solid_fuel">Твердопаливне</option>
                  </select>
                </label>

                <label style={fieldStyle}>
                  <span style={labelStyle}>Ремонт</span>
                  <select
                    value={form.renovationType}
                    onChange={(e) =>
                      updateField("renovationType", e.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Не вказано</option>
                    <option value="no_repair">Без ремонту</option>
                    <option value="livable">Житловий стан</option>
                    <option value="good">Хороший ремонт</option>
                    <option value="euro">Євроремонт</option>
                  </select>
                </label>
              </div>

              <label style={fieldStyle}>
                <span style={labelStyle}>Паркінг</span>
                <select
                  value={form.parkingType}
                  onChange={(e) => updateField("parkingType", e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Не вказано</option>
                  <option value="parking">Паркомісце</option>
                  <option value="underground">Підземний паркінг</option>
                </select>
              </label>
            </>
          )}

          <div style={checkboxGridStyle}>
            <label style={checkboxStyle}>
              <input
                type="checkbox"
                checked={form.documentsReady}
                onChange={(e) =>
                  updateBooleanField("documentsReady", e.target.checked)
                }
              />
              Документи готові
            </label>

            {form.propertyType !== "land" && (
              <label style={checkboxStyle}>
                <input
                  type="checkbox"
                  checked={form.isFurnished}
                  onChange={(e) =>
                    updateBooleanField("isFurnished", e.target.checked)
                  }
                />
                З меблями
              </label>
            )}

            {form.dealType === "rent" && form.propertyType !== "land" && (
              <label style={checkboxStyle}>
                <input
                  type="checkbox"
                  checked={form.petsAllowed}
                  onChange={(e) =>
                    updateBooleanField("petsAllowed", e.target.checked)
                  }
                />
                Можна з тваринами
              </label>
            )}
          </div>
        </section>

        {/* ===== Адреса ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Адреса</h2>

          <div style={gridStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Місто</span>
              <input
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                maxLength={LIMITS.city}
                placeholder="Напр. Івано-Франківськ"
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Регіон</span>
              <input
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
                maxLength={LIMITS.region}
                placeholder="Напр. Івано-Франківська область"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={gridStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Район</span>
              <input
                value={form.district}
                onChange={(e) => updateField("district", e.target.value)}
                maxLength={LIMITS.district}
                placeholder="Напр. Центр"
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Адреса</span>
              <input
                value={form.addressLine}
                onChange={(e) => updateField("addressLine", e.target.value)}
                maxLength={LIMITS.addressLine}
                placeholder="Вулиця, будинок"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={gridStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Широта</span>
              <input
                value={form.lat}
                onChange={(e) => updateField("lat", e.target.value)}
                inputMode="decimal"
                placeholder="48.9226"
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Довгота</span>
              <input
                value={form.lng}
                onChange={(e) => updateField("lng", e.target.value)}
                inputMode="decimal"
                placeholder="24.7111"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={mapPickerWrapStyle}>
            <div style={{ display: "grid", gap: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#111" }}>
                Вибери точку на карті
              </div>

              <div style={hintStyle}>
                Натисни на карту, щоб поставити маркер. Координати заповняться
                автоматично.
              </div>
            </div>

            <LocationPickerMap
              lat={form.lat ? Number(form.lat) : null}
              lng={form.lng ? Number(form.lng) : null}
              onPick={(next) => {
                if (isSubmitting) return;

                updateField("lat", String(next.lat));
                updateField("lng", String(next.lng));
              }}
            />
          </div>
        </section>

        {/* ===== Фото ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Фото</h2>

          <div style={hintStyle}>
            Додай від 1 до 10 фото. Перше фото стане головним.
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            disabled={isSubmitting}
            onChange={(e) => {
              handleImagesChange(e.target.files);
              e.currentTarget.value = "";
            }}
            style={{
              ...fileInputStyle,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          />

          {images.length > 0 && (
            <>
              <div style={{ ...hintStyle, fontWeight: 700, color: "#111" }}>
                Вибрано {images.length} з 10 фото
              </div>

              <div style={imagesGridStyle}>
                {imagePreviews.map(({ file, url }, index) => (
                  <div key={`${file.name}-${index}`} style={imageCardStyle}>
                    <div style={imagePreviewWrapStyle}>
                      <img
                        src={url}
                        alt={file.name}
                        style={imagePreviewStyle}
                      />

                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => removeImage(index)}
                        style={{
                          ...removeImageButtonStyle,
                          opacity: isSubmitting ? 0.5 : 1,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        ✕
                      </button>

                      {index === 0 && (
                        <div style={mainPhotoBadgeStyle}>Головне</div>
                      )}
                    </div>

                    <div style={imageCardTitleStyle}>
                      {index === 0 ? "Головне фото" : `Фото ${index + 1}`}
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
        </section>

        {/* ===== Опис ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Опис</h2>

          <label style={fieldStyle}>
            <span style={labelStyle}>Опис оголошення</span>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={LIMITS.description}
              placeholder="Опиши об’єкт, стан, переваги, інфраструктуру..."
              style={textareaStyle}
            />
            <span style={hintStyle}>
              {form.description.length}/{LIMITS.description}
            </span>
          </label>
        </section>

        {/* ===== Контакти ===== */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Контакти</h2>

          <div style={gridStyle}>
            <label style={fieldStyle}>
              <span style={labelStyle}>Ім’я продавця</span>
              <input
                value={form.sellerName}
                onChange={(e) => updateField("sellerName", e.target.value)}
                maxLength={LIMITS.sellerName}
                placeholder="Напр. Олег"
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span style={labelStyle}>Телефон</span>
              <input
                value={form.sellerPhone}
                onChange={(e) => updateField("sellerPhone", e.target.value)}
                maxLength={LIMITS.sellerPhone}
                type="tel"
                inputMode="tel"
                placeholder="+380..."
                style={inputStyle}
              />
            </label>
          </div>
        </section>
      </fieldset>

      {/* ===== Кнопки ===== */}
      <div style={gridStyle}>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setSubmitMode("active")}
          style={{
            ...submitButtonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting && submitMode === "active"
            ? "Публікуємо..."
            : "Опублікувати"}
        </button>

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
  width: "100%",
  height: "46px",
  border: "none",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "15px",
  fontWeight: 700,
};

const secondarySubmitButtonStyle: React.CSSProperties = {
  width: "100%",
  height: "46px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
  color: "#111",
  fontSize: "15px",
  fontWeight: 700,
};

const imagesGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "12px",
};

const imageCardStyle: React.CSSProperties = {
  position: "relative",
  display: "grid",
  gap: "8px",
  padding: "10px",
  border: "1px solid #e5e5e5",
  borderRadius: "16px",
  background: "#fff",
  overflow: "hidden",
};

const imagePreviewWrapStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "12px",
  overflow: "hidden",
  background: "#f3f3f3",
};

const imagePreviewStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const removeImageButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "30px",
  height: "30px",
  borderRadius: "999px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.95)",
  color: "#111",
  fontSize: "16px",
  lineHeight: "28px",
  fontWeight: 700,
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
};

const mainPhotoBadgeStyle: React.CSSProperties = {
  position: "absolute",
  left: "8px",
  bottom: "8px",
  padding: "4px 8px",
  borderRadius: "999px",
  background: "rgba(17,17,17,0.86)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 700,
};

const imageCardTitleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 800,
  color: "#111",
};

const imageCardNameStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#333",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const imageCardSizeStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#777",
};

const checkboxGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
};

const checkboxStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
  fontWeight: 600,
  color: "#222",
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
  padding: "16px",
  border: "1px solid #e5e5e5",
  borderRadius: "16px",
  background: "#fff",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: "#111",
  margin: 0,
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#333",
};

const mapPickerWrapStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
};
