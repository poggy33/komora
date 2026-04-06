export type PropertyType = "apartment" | "house" | "land";

export type DealType = "sale" | "rent";

export type OwnerType = "owner" | "realtor" | "developer";

export type HouseType = "detached" | "semi-detached";

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
  district?: string;
  street?: string;
  building?: string;
  fullAddress: string;
};

export type PropertyStatus =
  | "active"
  | "draft"
  | "sold"
  | "rented"
  | "archived";

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

  owner?: PropertyOwner;
  location?: PropertyLocation;

  description?: string;
  publishedAt?: string;
  status?: PropertyStatus;
};