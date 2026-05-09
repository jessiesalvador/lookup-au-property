import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Property, PropertySearchResult } from '../models/property.model';
import { environment } from '../../environments/environment';
import { EXTRA_MOCK_PROPERTIES } from './mock-properties-extra';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  — replace with real PropTrack API calls once you have a key
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    address: {
      displayAddress: '42 Wattle Street, Ultimo NSW 2007',
      streetNumber: '42',
      streetName: 'Wattle Street',
      suburb: 'Ultimo',
      state: 'NSW',
      postcode: '2007'
    },
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    floorArea: 218,
    lotArea: 465,
    yearBuilt: 1998,
    landValue: 1250000,
    lastSalePrice: 1850000,
    lastSaleDate: '2022-08-14',
    images: []
  },
  {
    id: 'prop-002',
    address: {
      displayAddress: '7/15 Crown Street, Surry Hills NSW 2010',
      streetNumber: '15',
      streetName: 'Crown Street',
      suburb: 'Surry Hills',
      state: 'NSW',
      postcode: '2010'
    },
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    carSpaces: 1,
    floorArea: 85,
    lotArea: null,
    yearBuilt: 2011,
    landValue: null,
    lastSalePrice: 920000,
    lastSaleDate: '2023-03-22',
    images: []
  },
  {
    id: 'prop-003',
    address: {
      displayAddress: '88 Acacia Drive, Sunnybank QLD 4109',
      streetNumber: '88',
      streetName: 'Acacia Drive',
      suburb: 'Sunnybank',
      state: 'QLD',
      postcode: '4109'
    },
    propertyType: 'House',
    bedrooms: 5,
    bathrooms: 3,
    carSpaces: 3,
    floorArea: 340,
    lotArea: 720,
    yearBuilt: 2005,
    landValue: 980000,
    lastSalePrice: 1540000,
    lastSaleDate: '2024-01-10',
    images: []
  },
  {
    id: 'prop-004',
    address: {
      displayAddress: '3 Eucalyptus Court, South Yarra VIC 3141',
      streetNumber: '3',
      streetName: 'Eucalyptus Court',
      suburb: 'South Yarra',
      state: 'VIC',
      postcode: '3141'
    },
    propertyType: 'Townhouse',
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    floorArea: 162,
    lotArea: 210,
    yearBuilt: 2017,
    landValue: 820000,
    lastSalePrice: 1320000,
    lastSaleDate: '2023-11-05',
    images: []
  },
  {
    id: 'prop-005',
    address: {
      displayAddress: '21 Banksia Road, Cottesloe WA 6011',
      streetNumber: '21',
      streetName: 'Banksia Road',
      suburb: 'Cottesloe',
      state: 'WA',
      postcode: '6011'
    },
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    floorArea: 268,
    lotArea: 550,
    yearBuilt: 1985,
    landValue: 1680000,
    lastSalePrice: 2250000,
    lastSaleDate: '2024-03-28',
    images: []
  }
];

@Injectable({ providedIn: 'root' })
export class PropertyService {

  // ─── Toggle this to true once you have a PropTrack API key ───────────────
  private useRealApi = false;
  // ─────────────────────────────────────────────────────────────────────────

  constructor(private http: HttpClient) {}

  search(query: string): Observable<PropertySearchResult[]> {
    if (this.useRealApi) {
      return this.searchPropTrack(query);
    }
    return this.searchMock(query);
  }

  // ─── MOCK ────────────────────────────────────────────────────────────────
  private searchMock(query: string): Observable<PropertySearchResult[]> {
    const q = query.toLowerCase().trim();
    const ALL_PROPERTIES = [...MOCK_PROPERTIES, ...EXTRA_MOCK_PROPERTIES];
    const matched = ALL_PROPERTIES.filter(p =>
      p.address.displayAddress.toLowerCase().includes(q) ||
      p.address.suburb.toLowerCase().includes(q) ||
      p.address.postcode.includes(q) ||
      p.address.streetName.toLowerCase().includes(q)
    );
    const results: PropertySearchResult[] = matched.map(p => ({
      property: p,
      confidence: 'high' as const
    }));
    // Simulate network latency
    return of(results).pipe(delay(600));
  }

  // ─── PROPTRACK (wire this up once you have a key) ─────────────────────────
  private searchPropTrack(query: string): Observable<PropertySearchResult[]> {
    // PropTrack base URL — confirm with your account contact
    const baseUrl = 'https://api.proptrack.com.au/v1';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.propTrackApiKey}`,
      'Content-Type': 'application/json'
    });

    // Step 1: Suggest addresses
    return this.http.get<any>(
      `${baseUrl}/properties/suggest?q=${encodeURIComponent(query)}`,
      { headers }
    );

    // TODO: After getting suggestions, fetch full property detail:
    // GET /properties/{propertyId}
    // Returns: bedrooms, bathrooms, carSpaces, floorArea, lotArea, yearBuilt
  }
}
