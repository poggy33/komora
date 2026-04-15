import type { DealType } from "@/types/property";
import type { SupportedPropertyType } from "./filters.types";

export type FilterFieldType = "range" | "multi_select" | "toggle";

export type FilterSection = "main" | "building" | "comfort" | "legal";

export type FilterField = {
  key: string;
  label: string;
  type: FilterFieldType;
  section: FilterSection;
  hiddenInTop?: boolean;
};

type FiltersConfig = Record<
  SupportedPropertyType,
  Record<DealType, FilterField[]>
>;

export const filtersConfig: FiltersConfig = {
  apartment: {
    sale: [
      { key: "price", label: "Ціна", type: "range", section: "main" },
      { key: "rooms", label: "Кімнати", type: "multi_select", section: "main" },
      { key: "area", label: "Площа", type: "range", section: "main" },
      {
        key: "marketType",
        label: "Новобудова / вторинка",
        type: "multi_select",
        section: "building",
      },
      {
        key: "notFirstFloor",
        label: "Не перший поверх",
        type: "toggle",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "notLastFloor",
        label: "Не останній поверх",
        type: "toggle",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "pricePerSqm",
        label: "Ціна за м²",
        type: "range",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "yearBuilt",
        label: "Рік будівництва",
        type: "range",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "heating",
        label: "Опалення",
        type: "multi_select",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "renovation",
        label: "Стан ремонту",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
      {
        key: "parking",
        label: "Паркінг",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
      {
        key: "documentsReady",
        label: "Документи",
        type: "toggle",
        section: "legal",
        hiddenInTop: true,
      },
    ],

    rent: [
      { key: "price", label: "Ціна", type: "range", section: "main" },
      { key: "rooms", label: "Кімнати", type: "multi_select", section: "main" },
      { key: "area", label: "Площа", type: "range", section: "main" },
      { key: "furnished", label: "Меблі", type: "toggle", section: "comfort" },
      {
        key: "petsAllowed",
        label: "Тварини",
        type: "toggle",
        section: "comfort",
      },
      {
        key: "notFirstFloor",
        label: "Не перший поверх",
        type: "toggle",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "notLastFloor",
        label: "Не останній поверх",
        type: "toggle",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "marketType",
        label: "Новобудова / вторинка",
        type: "multi_select",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "yearBuilt",
        label: "Рік будівництва",
        type: "range",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "heating",
        label: "Опалення",
        type: "multi_select",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "renovation",
        label: "Стан ремонту",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
      {
        key: "parking",
        label: "Паркінг",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
    ],
  },

  house: {
    sale: [
      { key: "price", label: "Ціна", type: "range", section: "main" },
      { key: "rooms", label: "Кімнати", type: "multi_select", section: "main" },
      { key: "area", label: "Площа будинку", type: "range", section: "main" },
      { key: "lotArea", label: "Площа ділянки", type: "range", section: "main" },
      {
        key: "floors",
        label: "Поверховість",
        type: "range",
        section: "building",
      },
      {
        key: "yearBuilt",
        label: "Рік будівництва",
        type: "range",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "heating",
        label: "Опалення",
        type: "multi_select",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "renovation",
        label: "Ремонт",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
      {
        key: "parking",
        label: "Паркінг / гараж",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
      {
        key: "documentsReady",
        label: "Документи",
        type: "toggle",
        section: "legal",
        hiddenInTop: true,
      },
    ],

    rent: [
      { key: "price", label: "Ціна", type: "range", section: "main" },
      { key: "rooms", label: "Кімнати", type: "multi_select", section: "main" },
      { key: "area", label: "Площа", type: "range", section: "main" },
      { key: "furnished", label: "Меблі", type: "toggle", section: "comfort" },
      {
        key: "petsAllowed",
        label: "Тварини",
        type: "toggle",
        section: "comfort",
      },
      {
        key: "lotArea",
        label: "Площа ділянки",
        type: "range",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "yearBuilt",
        label: "Рік будівництва",
        type: "range",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "heating",
        label: "Опалення",
        type: "multi_select",
        section: "building",
        hiddenInTop: true,
      },
      {
        key: "renovation",
        label: "Ремонт",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
      {
        key: "parking",
        label: "Паркінг",
        type: "multi_select",
        section: "comfort",
        hiddenInTop: true,
      },
    ],
  },

  land: {
    sale: [
      { key: "price", label: "Ціна", type: "range", section: "main" },
      { key: "area", label: "Площа", type: "range", section: "main" },
      {
        key: "landPurpose",
        label: "Призначення",
        type: "multi_select",
        section: "legal",
      },
      {
        key: "documentsReady",
        label: "Документи",
        type: "toggle",
        section: "legal",
        hiddenInTop: true,
      },
    ],

    rent: [
      { key: "price", label: "Ціна", type: "range", section: "main" },
      { key: "area", label: "Площа", type: "range", section: "main" },
      {
        key: "landPurpose",
        label: "Призначення",
        type: "multi_select",
        section: "legal",
      },
      {
        key: "documentsReady",
        label: "Документи",
        type: "toggle",
        section: "legal",
        hiddenInTop: true,
      },
    ],
  },
commercial: {
  sale: [
    { key: "price", label: "Ціна", type: "range", section: "main" },
    { key: "area", label: "Площа", type: "range", section: "main" },
    {
      key: "yearBuilt",
      label: "Рік будівництва",
      type: "range",
      section: "building",
    },
    {
      key: "heating",
      label: "Опалення",
      type: "multi_select",
      section: "building",
      hiddenInTop: true,
    },
    {
      key: "renovation",
      label: "Стан",
      type: "multi_select",
      section: "comfort",
      hiddenInTop: true,
    },
    {
      key: "parking",
      label: "Паркінг",
      type: "multi_select",
      section: "comfort",
      hiddenInTop: true,
    },
    {
      key: "documentsReady",
      label: "Документи",
      type: "toggle",
      section: "legal",
      hiddenInTop: true,
    },
  ],
  rent: [
    { key: "price", label: "Ціна", type: "range", section: "main" },
    { key: "area", label: "Площа", type: "range", section: "main" },
    {
      key: "furnished",
      label: "Меблі",
      type: "toggle",
      section: "comfort",
    },
    {
      key: "yearBuilt",
      label: "Рік будівництва",
      type: "range",
      section: "building",
      hiddenInTop: true,
    },
    {
      key: "heating",
      label: "Опалення",
      type: "multi_select",
      section: "building",
      hiddenInTop: true,
    },
    {
      key: "renovation",
      label: "Стан",
      type: "multi_select",
      section: "comfort",
      hiddenInTop: true,
    },
    {
      key: "parking",
      label: "Паркінг",
      type: "multi_select",
      section: "comfort",
      hiddenInTop: true,
    },
  ],
},
};