export type PropertyType = "apartment" | "house" | "land" | "commercial";

export type DealType = "sale" | "rent";

export type OwnerType = "owner" | "realtor" | "developer";

export type HouseType = "detached" | "semi-detached";

export type MarketType = "new_building" | "secondary";
export type HeatingType = "individual" | "central" | "electric" | "solid_fuel";
export type ParkingType = "parking" | "underground";
export type RenovationType = "no_repair" | "livable" | "good" | "euro";
export type LandPurposeType = "residential" | "agricultural" | "commercial";

export type PropertyOwner = {
  id: string;
  type: OwnerType;
  name: string;
  companyName?: string;
  isVerified: boolean;
  phone: string;
  email?: string;
  avatar?: string;
};

export type PropertyLocation = {
  city: string;
  region?: string;
  district?: string;
  street?: string;
  building?: string;
  addressLine?: string;
  fullAddress: string;
};

export type PropertyStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "rejected"
  | "sold"
  | "rented"
  | "archived"
  | "expired";

export type Property = {
  id: string;
  title: string;

  propertyType: PropertyType;
  dealType: DealType;

  price: number;
  area: number;

  rooms?: number;

  floor?: number;
  totalFloors?: number;

  floors?: number;
  houseType?: HouseType;

  ownerType: OwnerType;

  yearBuilt?: number;

  coordinates: [number, number];

  images: string[];
  coverImage?: string | null;

  owner?: PropertyOwner;
  location?: PropertyLocation;

  description?: string;
  publishedAt?: string;
  status?: PropertyStatus;
  currency?: string;

  livingArea?: number;
  kitchenArea?: number;

  renovation?: RenovationType;
  heating?: HeatingType;
  parking?: ParkingType;

  marketType?: MarketType;
  documentsReady?: boolean;
  petsAllowed?: boolean;
  isFurnished?: boolean;

  lotArea?: number;
  landPurpose?: LandPurposeType;
};