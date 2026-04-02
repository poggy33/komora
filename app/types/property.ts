export type PropertyType = "apartment" | "house" | "land";

export type DealType = "sale" | "rent";

export type OwnerType = "owner" | "realtor" | "developer";

export type HouseType = "detached" | "semi-detached";

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
};