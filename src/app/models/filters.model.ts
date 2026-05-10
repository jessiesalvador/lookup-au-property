export interface PropertyFilters {
  bedroomsMin: number | null;
  bedroomsMax: number | null;
  bathroomsMin: number | null;
  bathroomsMax: number | null;
  carSpacesMin: number | null;
  carSpacesMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
}

export const EMPTY_FILTERS: PropertyFilters = {
  bedroomsMin: null,
  bedroomsMax: null,
  bathroomsMin: null,
  bathroomsMax: null,
  carSpacesMin: null,
  carSpacesMax: null,
  priceMin: null,
  priceMax: null,
};
