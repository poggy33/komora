export type SupportedPropertyType =
  | "apartment"
  | "house"
  | "land"
  | "commercial";

export type MarketType = "new_building" | "secondary";
export type HeatingType = "individual" | "central" | "electric" | "solid_fuel";
export type ParkingType = "parking" | "underground";
export type RenovationType = "no_repair" | "livable" | "good" | "euro";
export type LandPurposeType = "residential" | "agricultural" | "commercial";

export type FiltersState = {
  priceMin: string;
  priceMax: string;

  pricePerSqmMin: string;
  pricePerSqmMax: string;

  areaMin: string;
  areaMax: string;

  lotAreaMin: string;
  lotAreaMax: string;

  rooms: string[];

  notFirstFloor: boolean;
  notLastFloor: boolean;

  floorsMin: string;
  floorsMax: string;

  yearBuiltFrom: string;
  yearBuiltTo: string;

  marketType: MarketType[];

  heating: HeatingType[];
  parking: ParkingType[];
  renovation: RenovationType[];

  documentsReady: boolean;

  furnished: boolean;
  petsAllowed: boolean;

  landPurpose: LandPurposeType[];
};

export const DEFAULT_FILTERS_STATE: FiltersState = {
  priceMin: "",
  priceMax: "",

  pricePerSqmMin: "",
  pricePerSqmMax: "",

  areaMin: "",
  areaMax: "",

  lotAreaMin: "",
  lotAreaMax: "",

  rooms: [],

  notFirstFloor: false,
  notLastFloor: false,

  floorsMin: "",
  floorsMax: "",

  yearBuiltFrom: "",
  yearBuiltTo: "",

  marketType: [],

  heating: [],
  parking: [],
  renovation: [],

  documentsReady: false,

  furnished: false,
  petsAllowed: false,

  landPurpose: [],
};