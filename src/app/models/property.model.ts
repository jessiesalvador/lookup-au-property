export interface Property {
  id: string;
  address: {
    displayAddress: string;
    streetNumber: string;
    streetName: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  floorArea: number | null;       // m²
  lotArea: number | null;         // m²
  yearBuilt: number | null;
  landValue: number | null;
  lastSalePrice: number | null;
  lastSaleDate: string | null;
  images: string[];
}

export interface PropertySearchResult {
  property: Property;
  confidence: 'high' | 'medium' | 'low';
}
