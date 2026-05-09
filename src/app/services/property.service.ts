import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Property, PropertySearchResult } from '../models/property.model';
import { environment } from '../../environments/environment';

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
  },
  // ─────────────────────────────────────────────────────────────────────────────
// 93 ADDITIONAL MOCK PROPERTIES — paste these inside MOCK_PROPERTIES array
// Covers: NSW, VIC, QLD, WA, SA, TAS, ACT, NT
// ─────────────────────────────────────────────────────────────────────────────

  // ── NEW SOUTH WALES (20 properties) ────────────────────────────────────────
  {
    id: 'prop-099',
    address: {
      displayAddress: '14 Jacaranda Avenue, New Farm QLD 4005',
      streetNumber: '14', streetName: 'Jacaranda Avenue',
      suburb: 'New Farm', state: 'QLD', postcode: '4005'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 185, lotArea: 405, yearBuilt: 2003,
    landValue: 1100000, lastSalePrice: 1650000, lastSaleDate: '2023-06-18', images: []
  },
  {
    id: 'prop-100',
    address: {
      displayAddress: '5/22 Harris Street, Pyrmont NSW 2009',
      streetNumber: '22', streetName: 'Harris Street',
      suburb: 'Pyrmont', state: 'NSW', postcode: '2009'
    },
    propertyType: 'Apartment',
    bedrooms: 1, bathrooms: 1, carSpaces: 1,
    floorArea: 62, lotArea: null, yearBuilt: 2008,
    landValue: null, lastSalePrice: 780000, lastSaleDate: '2023-09-12', images: []
  },
  {
    id: 'prop-008',
    address: {
      displayAddress: '33 Boundary Road, Mosman NSW 2088',
      streetNumber: '33', streetName: 'Boundary Road',
      suburb: 'Mosman', state: 'NSW', postcode: '2088'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 3, carSpaces: 2,
    floorArea: 420, lotArea: 680, yearBuilt: 1992,
    landValue: 2800000, lastSalePrice: 4200000, lastSaleDate: '2024-02-10', images: []
  },
  {
    id: 'prop-009',
    address: {
      displayAddress: '8 Coastal View Drive, Manly NSW 2095',
      streetNumber: '8', streetName: 'Coastal View Drive',
      suburb: 'Manly', state: 'NSW', postcode: '2095'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 310, lotArea: 520, yearBuilt: 1978,
    landValue: 2100000, lastSalePrice: 3100000, lastSaleDate: '2023-11-25', images: []
  },
  {
    id: 'prop-010',
    address: {
      displayAddress: '12/88 Elizabeth Street, Sydney NSW 2000',
      streetNumber: '88', streetName: 'Elizabeth Street',
      suburb: 'Sydney', state: 'NSW', postcode: '2000'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 98, lotArea: null, yearBuilt: 2015,
    landValue: null, lastSalePrice: 1250000, lastSaleDate: '2024-01-08', images: []
  },
  {
    id: 'prop-011',
    address: {
      displayAddress: '45 Newtown Road, Newtown NSW 2042',
      streetNumber: '45', streetName: 'Newtown Road',
      suburb: 'Newtown', state: 'NSW', postcode: '2042'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 175, lotArea: 230, yearBuilt: 2010,
    landValue: 950000, lastSalePrice: 1380000, lastSaleDate: '2023-07-20', images: []
  },
  {
    id: 'prop-012',
    address: {
      displayAddress: '19 Parramatta Road, Strathfield NSW 2135',
      streetNumber: '19', streetName: 'Parramatta Road',
      suburb: 'Strathfield', state: 'NSW', postcode: '2135'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 280, lotArea: 610, yearBuilt: 1965,
    landValue: 1350000, lastSalePrice: 1980000, lastSaleDate: '2023-05-14', images: []
  },
  {
    id: 'prop-013',
    address: {
      displayAddress: '3 Coral Sea Court, Cronulla NSW 2230',
      streetNumber: '3', streetName: 'Coral Sea Court',
      suburb: 'Cronulla', state: 'NSW', postcode: '2230'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 340, lotArea: 580, yearBuilt: 2000,
    landValue: 1750000, lastSalePrice: 2650000, lastSaleDate: '2024-03-05', images: []
  },
  {
    id: 'prop-014',
    address: {
      displayAddress: '77 Victoria Road, Parramatta NSW 2150',
      streetNumber: '77', streetName: 'Victoria Road',
      suburb: 'Parramatta', state: 'NSW', postcode: '2150'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 1, carSpaces: 1,
    floorArea: 80, lotArea: null, yearBuilt: 2019,
    landValue: null, lastSalePrice: 680000, lastSaleDate: '2023-10-30', images: []
  },
  {
    id: 'prop-015',
    address: {
      displayAddress: '55 Blue Mountains Highway, Katoomba NSW 2780',
      streetNumber: '55', streetName: 'Blue Mountains Highway',
      suburb: 'Katoomba', state: 'NSW', postcode: '2780'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 2,
    floorArea: 145, lotArea: 820, yearBuilt: 1955,
    landValue: 480000, lastSalePrice: 720000, lastSaleDate: '2023-08-18', images: []
  },
  {
    id: 'prop-016',
    address: {
      displayAddress: '2/14 Pacific Highway, Chatswood NSW 2067',
      streetNumber: '14', streetName: 'Pacific Highway',
      suburb: 'Chatswood', state: 'NSW', postcode: '2067'
    },
    propertyType: 'Apartment',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 118, lotArea: null, yearBuilt: 2017,
    landValue: null, lastSalePrice: 1420000, lastSaleDate: '2024-02-28', images: []
  },
  {
    id: 'prop-017',
    address: {
      displayAddress: '28 Hunter Street, Newcastle NSW 2300',
      streetNumber: '28', streetName: 'Hunter Street',
      suburb: 'Newcastle', state: 'NSW', postcode: '2300'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 168, lotArea: 215, yearBuilt: 2014,
    landValue: 620000, lastSalePrice: 890000, lastSaleDate: '2023-12-12', images: []
  },
  {
    id: 'prop-018',
    address: {
      displayAddress: '91 Kingsway, Miranda NSW 2228',
      streetNumber: '91', streetName: 'Kingsway',
      suburb: 'Miranda', state: 'NSW', postcode: '2228'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 240, lotArea: 550, yearBuilt: 1982,
    landValue: 980000, lastSalePrice: 1450000, lastSaleDate: '2023-06-30', images: []
  },
  {
    id: 'prop-019',
    address: {
      displayAddress: '6 Darling Street, Balmain NSW 2041',
      streetNumber: '6', streetName: 'Darling Street',
      suburb: 'Balmain', state: 'NSW', postcode: '2041'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 195, lotArea: 310, yearBuilt: 1910,
    landValue: 1650000, lastSalePrice: 2400000, lastSaleDate: '2024-01-20', images: []
  },
  {
    id: 'prop-020',
    address: {
      displayAddress: '40 Glenmore Road, Paddington NSW 2021',
      streetNumber: '40', streetName: 'Glenmore Road',
      suburb: 'Paddington', state: 'NSW', postcode: '2021'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 190, lotArea: 200, yearBuilt: 1890,
    landValue: 1800000, lastSalePrice: 2750000, lastSaleDate: '2023-09-05', images: []
  },
  {
    id: 'prop-021',
    address: {
      displayAddress: '17 Illawarra Road, Wollongong NSW 2500',
      streetNumber: '17', streetName: 'Illawarra Road',
      suburb: 'Wollongong', state: 'NSW', postcode: '2500'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 220, lotArea: 640, yearBuilt: 1990,
    landValue: 720000, lastSalePrice: 1050000, lastSaleDate: '2023-10-15', images: []
  },
  {
    id: 'prop-022',
    address: {
      displayAddress: '9/5 Erskine Street, Sydney NSW 2000',
      streetNumber: '5', streetName: 'Erskine Street',
      suburb: 'Sydney', state: 'NSW', postcode: '2000'
    },
    propertyType: 'Apartment',
    bedrooms: 1, bathrooms: 1, carSpaces: 0,
    floorArea: 55, lotArea: null, yearBuilt: 2002,
    landValue: null, lastSalePrice: 650000, lastSaleDate: '2023-07-08', images: []
  },
  {
    id: 'prop-023',
    address: {
      displayAddress: '62 Merrylands Road, Merrylands NSW 2160',
      streetNumber: '62', streetName: 'Merrylands Road',
      suburb: 'Merrylands', state: 'NSW', postcode: '2160'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 1,
    floorArea: 140, lotArea: 500, yearBuilt: 1970,
    landValue: 680000, lastSalePrice: 950000, lastSaleDate: '2024-03-18', images: []
  },
  {
    id: 'prop-024',
    address: {
      displayAddress: '25 Pittwater Road, Mona Vale NSW 2103',
      streetNumber: '25', streetName: 'Pittwater Road',
      suburb: 'Mona Vale', state: 'NSW', postcode: '2103'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 290, lotArea: 700, yearBuilt: 2001,
    landValue: 1850000, lastSalePrice: 2850000, lastSaleDate: '2023-11-08', images: []
  },
  {
    id: 'prop-025',
    address: {
      displayAddress: '18 Orange Grove, Bowral NSW 2576',
      streetNumber: '18', streetName: 'Orange Grove',
      suburb: 'Bowral', state: 'NSW', postcode: '2576'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 3, carSpaces: 3,
    floorArea: 380, lotArea: 1200, yearBuilt: 2008,
    landValue: 950000, lastSalePrice: 1750000, lastSaleDate: '2024-02-14', images: []
  },

  // ── VICTORIA (20 properties) ────────────────────────────────────────────────
  {
    id: 'prop-026',
    address: {
      displayAddress: '11 Collins Street, Melbourne VIC 3000',
      streetNumber: '11', streetName: 'Collins Street',
      suburb: 'Melbourne', state: 'VIC', postcode: '3000'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 105, lotArea: null, yearBuilt: 2018,
    landValue: null, lastSalePrice: 980000, lastSaleDate: '2023-08-22', images: []
  },
  {
    id: 'prop-027',
    address: {
      displayAddress: '34 Chapel Street, Prahran VIC 3181',
      streetNumber: '34', streetName: 'Chapel Street',
      suburb: 'Prahran', state: 'VIC', postcode: '3181'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 182, lotArea: 190, yearBuilt: 2012,
    landValue: 880000, lastSalePrice: 1250000, lastSaleDate: '2023-10-05', images: []
  },
  {
    id: 'prop-028',
    address: {
      displayAddress: '7 Toorak Road, Toorak VIC 3142',
      streetNumber: '7', streetName: 'Toorak Road',
      suburb: 'Toorak', state: 'VIC', postcode: '3142'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 4, carSpaces: 3,
    floorArea: 520, lotArea: 850, yearBuilt: 1995,
    landValue: 3500000, lastSalePrice: 5800000, lastSaleDate: '2024-01-15', images: []
  },
  {
    id: 'prop-029',
    address: {
      displayAddress: '55 Brunswick Road, Brunswick VIC 3056',
      streetNumber: '55', streetName: 'Brunswick Road',
      suburb: 'Brunswick', state: 'VIC', postcode: '3056'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 1,
    floorArea: 155, lotArea: 370, yearBuilt: 1930,
    landValue: 920000, lastSalePrice: 1280000, lastSaleDate: '2023-06-25', images: []
  },
  {
    id: 'prop-030',
    address: {
      displayAddress: '22 Fitzroy Street, St Kilda VIC 3182',
      streetNumber: '22', streetName: 'Fitzroy Street',
      suburb: 'St Kilda', state: 'VIC', postcode: '3182'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 1, carSpaces: 1,
    floorArea: 88, lotArea: null, yearBuilt: 2006,
    landValue: null, lastSalePrice: 850000, lastSaleDate: '2023-09-18', images: []
  },
  {
    id: 'prop-031',
    address: {
      displayAddress: '43 Hawthorn Road, Hawthorn VIC 3122',
      streetNumber: '43', streetName: 'Hawthorn Road',
      suburb: 'Hawthorn', state: 'VIC', postcode: '3122'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 295, lotArea: 560, yearBuilt: 1960,
    landValue: 1650000, lastSalePrice: 2400000, lastSaleDate: '2024-03-10', images: []
  },
  {
    id: 'prop-032',
    address: {
      displayAddress: '8/30 Docklands Drive, Docklands VIC 3008',
      streetNumber: '30', streetName: 'Docklands Drive',
      suburb: 'Docklands', state: 'VIC', postcode: '3008'
    },
    propertyType: 'Apartment',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 142, lotArea: null, yearBuilt: 2016,
    landValue: null, lastSalePrice: 1380000, lastSaleDate: '2023-12-02', images: []
  },
  {
    id: 'prop-033',
    address: {
      displayAddress: '16 Beach Road, Brighton VIC 3186',
      streetNumber: '16', streetName: 'Beach Road',
      suburb: 'Brighton', state: 'VIC', postcode: '3186'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 3, carSpaces: 2,
    floorArea: 460, lotArea: 750, yearBuilt: 2005,
    landValue: 3200000, lastSalePrice: 4800000, lastSaleDate: '2024-02-20', images: []
  },
  {
    id: 'prop-034',
    address: {
      displayAddress: '29 Sydney Road, Coburg VIC 3058',
      streetNumber: '29', streetName: 'Sydney Road',
      suburb: 'Coburg', state: 'VIC', postcode: '3058'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 1,
    floorArea: 138, lotArea: 420, yearBuilt: 1945,
    landValue: 780000, lastSalePrice: 1050000, lastSaleDate: '2023-07-14', images: []
  },
  {
    id: 'prop-035',
    address: {
      displayAddress: '5 Flinders Lane, Melbourne VIC 3000',
      streetNumber: '5', streetName: 'Flinders Lane',
      suburb: 'Melbourne', state: 'VIC', postcode: '3000'
    },
    propertyType: 'Apartment',
    bedrooms: 1, bathrooms: 1, carSpaces: 0,
    floorArea: 58, lotArea: null, yearBuilt: 2000,
    landValue: null, lastSalePrice: 520000, lastSaleDate: '2023-11-20', images: []
  },
  {
    id: 'prop-036',
    address: {
      displayAddress: '14 Whitehorse Road, Balwyn VIC 3103',
      streetNumber: '14', streetName: 'Whitehorse Road',
      suburb: 'Balwyn', state: 'VIC', postcode: '3103'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 312, lotArea: 680, yearBuilt: 1975,
    landValue: 1420000, lastSalePrice: 2100000, lastSaleDate: '2024-01-30', images: []
  },
  {
    id: 'prop-037',
    address: {
      displayAddress: '38 High Street, Geelong VIC 3220',
      streetNumber: '38', streetName: 'High Street',
      suburb: 'Geelong', state: 'VIC', postcode: '3220'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 175, lotArea: 520, yearBuilt: 1988,
    landValue: 480000, lastSalePrice: 720000, lastSaleDate: '2023-08-08', images: []
  },
  {
    id: 'prop-038',
    address: {
      displayAddress: '11 Ocean Boulevard, Torquay VIC 3228',
      streetNumber: '11', streetName: 'Ocean Boulevard',
      suburb: 'Torquay', state: 'VIC', postcode: '3228'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 265, lotArea: 600, yearBuilt: 2012,
    landValue: 850000, lastSalePrice: 1350000, lastSaleDate: '2023-05-28', images: []
  },
  {
    id: 'prop-039',
    address: {
      displayAddress: '2/19 Smith Street, Collingwood VIC 3066',
      streetNumber: '19', streetName: 'Smith Street',
      suburb: 'Collingwood', state: 'VIC', postcode: '3066'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 1, carSpaces: 1,
    floorArea: 78, lotArea: null, yearBuilt: 2009,
    landValue: null, lastSalePrice: 720000, lastSaleDate: '2024-03-22', images: []
  },
  {
    id: 'prop-040',
    address: {
      displayAddress: '67 Camberwell Road, Camberwell VIC 3124',
      streetNumber: '67', streetName: 'Camberwell Road',
      suburb: 'Camberwell', state: 'VIC', postcode: '3124'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 330, lotArea: 620, yearBuilt: 1998,
    landValue: 1580000, lastSalePrice: 2350000, lastSaleDate: '2023-10-28', images: []
  },
  {
    id: 'prop-041',
    address: {
      displayAddress: '30 Nepean Highway, Frankston VIC 3199',
      streetNumber: '30', streetName: 'Nepean Highway',
      suburb: 'Frankston', state: 'VIC', postcode: '3199'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 2,
    floorArea: 148, lotArea: 580, yearBuilt: 1972,
    landValue: 420000, lastSalePrice: 620000, lastSaleDate: '2023-09-25', images: []
  },
  {
    id: 'prop-042',
    address: {
      displayAddress: '4 Elgin Street, Carlton VIC 3053',
      streetNumber: '4', streetName: 'Elgin Street',
      suburb: 'Carlton', state: 'VIC', postcode: '3053'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 172, lotArea: 180, yearBuilt: 2015,
    landValue: 920000, lastSalePrice: 1320000, lastSaleDate: '2023-12-18', images: []
  },
  {
    id: 'prop-043',
    address: {
      displayAddress: '52 Burwood Highway, Burwood VIC 3125',
      streetNumber: '52', streetName: 'Burwood Highway',
      suburb: 'Burwood', state: 'VIC', postcode: '3125'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 260, lotArea: 590, yearBuilt: 1968,
    landValue: 1100000, lastSalePrice: 1620000, lastSaleDate: '2024-02-05', images: []
  },
  {
    id: 'prop-044',
    address: {
      displayAddress: '19 Phillip Island Road, Cowes VIC 3922',
      streetNumber: '19', streetName: 'Phillip Island Road',
      suburb: 'Cowes', state: 'VIC', postcode: '3922'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 185, lotArea: 650, yearBuilt: 2006,
    landValue: 480000, lastSalePrice: 780000, lastSaleDate: '2023-07-30', images: []
  },
  {
    id: 'prop-045',
    address: {
      displayAddress: '3 Yarra Road, Healesville VIC 3777',
      streetNumber: '3', streetName: 'Yarra Road',
      suburb: 'Healesville', state: 'VIC', postcode: '3777'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 3,
    floorArea: 220, lotArea: 2000, yearBuilt: 1999,
    landValue: 560000, lastSalePrice: 920000, lastSaleDate: '2023-06-12', images: []
  },

  // ── QUEENSLAND (15 properties) ──────────────────────────────────────────────
  {
    id: 'prop-046',
    address: {
      displayAddress: '10 Queen Street, Brisbane QLD 4000',
      streetNumber: '10', streetName: 'Queen Street',
      suburb: 'Brisbane', state: 'QLD', postcode: '4000'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 96, lotArea: null, yearBuilt: 2020,
    landValue: null, lastSalePrice: 880000, lastSaleDate: '2024-01-25', images: []
  },
  {
    id: 'prop-047',
    address: {
      displayAddress: '24 Surf Parade, Broadbeach QLD 4218',
      streetNumber: '24', streetName: 'Surf Parade',
      suburb: 'Broadbeach', state: 'QLD', postcode: '4218'
    },
    propertyType: 'Apartment',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 132, lotArea: null, yearBuilt: 2014,
    landValue: null, lastSalePrice: 1150000, lastSaleDate: '2023-11-15', images: []
  },
  {
    id: 'prop-048',
    address: {
      displayAddress: '8 Waterfront Drive, Hamilton QLD 4007',
      streetNumber: '8', streetName: 'Waterfront Drive',
      suburb: 'Hamilton', state: 'QLD', postcode: '4007'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 3, carSpaces: 3,
    floorArea: 450, lotArea: 780, yearBuilt: 2010,
    landValue: 1850000, lastSalePrice: 3200000, lastSaleDate: '2024-02-28', images: []
  },
  {
    id: 'prop-049',
    address: {
      displayAddress: '15 Gold Coast Highway, Surfers Paradise QLD 4217',
      streetNumber: '15', streetName: 'Gold Coast Highway',
      suburb: 'Surfers Paradise', state: 'QLD', postcode: '4217'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 110, lotArea: null, yearBuilt: 2005,
    landValue: null, lastSalePrice: 820000, lastSaleDate: '2023-08-30', images: []
  },
  {
    id: 'prop-050',
    address: {
      displayAddress: '33 Kenmore Road, Kenmore QLD 4069',
      streetNumber: '33', streetName: 'Kenmore Road',
      suburb: 'Kenmore', state: 'QLD', postcode: '4069'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 260, lotArea: 700, yearBuilt: 1994,
    landValue: 780000, lastSalePrice: 1180000, lastSaleDate: '2023-10-10', images: []
  },
  {
    id: 'prop-051',
    address: {
      displayAddress: '6 Esplanade, Noosa Heads QLD 4567',
      streetNumber: '6', streetName: 'Esplanade',
      suburb: 'Noosa Heads', state: 'QLD', postcode: '4567'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 320, lotArea: 600, yearBuilt: 2003,
    landValue: 2200000, lastSalePrice: 3800000, lastSaleDate: '2024-03-15', images: []
  },
  {
    id: 'prop-052',
    address: {
      displayAddress: '42 Ipswich Road, Woolloongabba QLD 4102',
      streetNumber: '42', streetName: 'Ipswich Road',
      suburb: 'Woolloongabba', state: 'QLD', postcode: '4102'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 165, lotArea: 210, yearBuilt: 2016,
    landValue: 720000, lastSalePrice: 1020000, lastSaleDate: '2023-09-08', images: []
  },
  {
    id: 'prop-053',
    address: {
      displayAddress: '18 Caloundra Road, Caloundra QLD 4551',
      streetNumber: '18', streetName: 'Caloundra Road',
      suburb: 'Caloundra', state: 'QLD', postcode: '4551'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 190, lotArea: 550, yearBuilt: 2002,
    landValue: 680000, lastSalePrice: 980000, lastSaleDate: '2023-07-22', images: []
  },
  {
    id: 'prop-054',
    address: {
      displayAddress: '9 Wickham Street, Fortitude Valley QLD 4006',
      streetNumber: '9', streetName: 'Wickham Street',
      suburb: 'Fortitude Valley', state: 'QLD', postcode: '4006'
    },
    propertyType: 'Apartment',
    bedrooms: 1, bathrooms: 1, carSpaces: 1,
    floorArea: 65, lotArea: null, yearBuilt: 2011,
    landValue: null, lastSalePrice: 490000, lastSaleDate: '2024-01-05', images: []
  },
  {
    id: 'prop-055',
    address: {
      displayAddress: '27 Hinterland Drive, Buderim QLD 4556',
      streetNumber: '27', streetName: 'Hinterland Drive',
      suburb: 'Buderim', state: 'QLD', postcode: '4556'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 245, lotArea: 750, yearBuilt: 2007,
    landValue: 680000, lastSalePrice: 1050000, lastSaleDate: '2023-11-28', images: []
  },
  {
    id: 'prop-056',
    address: {
      displayAddress: '5 Riverview Terrace, Indooroopilly QLD 4068',
      streetNumber: '5', streetName: 'Riverview Terrace',
      suburb: 'Indooroopilly', state: 'QLD', postcode: '4068'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 308, lotArea: 660, yearBuilt: 1996,
    landValue: 980000, lastSalePrice: 1580000, lastSaleDate: '2024-02-08', images: []
  },
  {
    id: 'prop-057',
    address: {
      displayAddress: '13 Lake Street, Cairns QLD 4870',
      streetNumber: '13', streetName: 'Lake Street',
      suburb: 'Cairns', state: 'QLD', postcode: '4870'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 165, lotArea: 600, yearBuilt: 1988,
    landValue: 350000, lastSalePrice: 550000, lastSaleDate: '2023-06-05', images: []
  },
  {
    id: 'prop-058',
    address: {
      displayAddress: '20 Reef Street, Port Douglas QLD 4877',
      streetNumber: '20', streetName: 'Reef Street',
      suburb: 'Port Douglas', state: 'QLD', postcode: '4877'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 280, lotArea: 800, yearBuilt: 2004,
    landValue: 850000, lastSalePrice: 1480000, lastSaleDate: '2023-10-20', images: []
  },
  {
    id: 'prop-059',
    address: {
      displayAddress: '7 Military Road, Toowoomba QLD 4350',
      streetNumber: '7', streetName: 'Military Road',
      suburb: 'Toowoomba', state: 'QLD', postcode: '4350'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 230, lotArea: 720, yearBuilt: 1997,
    landValue: 380000, lastSalePrice: 620000, lastSaleDate: '2023-08-12', images: []
  },
  {
    id: 'prop-060',
    address: {
      displayAddress: '3/55 Mooloolaba Esplanade, Mooloolaba QLD 4557',
      streetNumber: '55', streetName: 'Mooloolaba Esplanade',
      suburb: 'Mooloolaba', state: 'QLD', postcode: '4557'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 92, lotArea: null, yearBuilt: 2013,
    landValue: null, lastSalePrice: 780000, lastSaleDate: '2024-03-01', images: []
  },

  // ── WESTERN AUSTRALIA (10 properties) ──────────────────────────────────────
  {
    id: 'prop-061',
    address: {
      displayAddress: '25 St Georges Terrace, Perth WA 6000',
      streetNumber: '25', streetName: 'St Georges Terrace',
      suburb: 'Perth', state: 'WA', postcode: '6000'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 102, lotArea: null, yearBuilt: 2017,
    landValue: null, lastSalePrice: 720000, lastSaleDate: '2024-01-18', images: []
  },
  {
    id: 'prop-062',
    address: {
      displayAddress: '14 Marine Terrace, Fremantle WA 6160',
      streetNumber: '14', streetName: 'Marine Terrace',
      suburb: 'Fremantle', state: 'WA', postcode: '6160'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 180, lotArea: 380, yearBuilt: 1920,
    landValue: 820000, lastSalePrice: 1250000, lastSaleDate: '2023-09-30', images: []
  },
  {
    id: 'prop-063',
    address: {
      displayAddress: '8 Stirling Highway, Claremont WA 6010',
      streetNumber: '8', streetName: 'Stirling Highway',
      suburb: 'Claremont', state: 'WA', postcode: '6010'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 260, lotArea: 560, yearBuilt: 1965,
    landValue: 1350000, lastSalePrice: 1980000, lastSaleDate: '2024-02-22', images: []
  },
  {
    id: 'prop-064',
    address: {
      displayAddress: '31 Wanneroo Road, Joondalup WA 6027',
      streetNumber: '31', streetName: 'Wanneroo Road',
      suburb: 'Joondalup', state: 'WA', postcode: '6027'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 220, lotArea: 630, yearBuilt: 2003,
    landValue: 480000, lastSalePrice: 720000, lastSaleDate: '2023-07-05', images: []
  },
  {
    id: 'prop-065',
    address: {
      displayAddress: '6 Durak Street, Subiaco WA 6008',
      streetNumber: '6', streetName: 'Durak Street',
      suburb: 'Subiaco', state: 'WA', postcode: '6008'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 195, lotArea: 240, yearBuilt: 2009,
    landValue: 980000, lastSalePrice: 1420000, lastSaleDate: '2023-11-10', images: []
  },
  {
    id: 'prop-066',
    address: {
      displayAddress: '12 Ocean Drive, Busselton WA 6280',
      streetNumber: '12', streetName: 'Ocean Drive',
      suburb: 'Busselton', state: 'WA', postcode: '6280'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 240, lotArea: 680, yearBuilt: 2011,
    landValue: 550000, lastSalePrice: 880000, lastSaleDate: '2024-01-12', images: []
  },
  {
    id: 'prop-067',
    address: {
      displayAddress: '44 Canning Highway, Applecross WA 6153',
      streetNumber: '44', streetName: 'Canning Highway',
      suburb: 'Applecross', state: 'WA', postcode: '6153'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 3, carSpaces: 2,
    floorArea: 320, lotArea: 700, yearBuilt: 1985,
    landValue: 1450000, lastSalePrice: 2150000, lastSaleDate: '2023-08-25', images: []
  },
  {
    id: 'prop-068',
    address: {
      displayAddress: '19 Victoria Avenue, Dalkeith WA 6009',
      streetNumber: '19', streetName: 'Victoria Avenue',
      suburb: 'Dalkeith', state: 'WA', postcode: '6009'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 4, carSpaces: 3,
    floorArea: 480, lotArea: 900, yearBuilt: 2000,
    landValue: 2800000, lastSalePrice: 4500000, lastSaleDate: '2024-03-08', images: []
  },
  {
    id: 'prop-069',
    address: {
      displayAddress: '2 Margaret River Road, Margaret River WA 6285',
      streetNumber: '2', streetName: 'Margaret River Road',
      suburb: 'Margaret River', state: 'WA', postcode: '6285'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 260, lotArea: 1500, yearBuilt: 2007,
    landValue: 620000, lastSalePrice: 1050000, lastSaleDate: '2023-10-05', images: []
  },
  {
    id: 'prop-070',
    address: {
      displayAddress: '37 Beaufort Street, Mount Lawley WA 6050',
      streetNumber: '37', streetName: 'Beaufort Street',
      suburb: 'Mount Lawley', state: 'WA', postcode: '6050'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 175, lotArea: 480, yearBuilt: 1940,
    landValue: 950000, lastSalePrice: 1380000, lastSaleDate: '2023-12-20', images: []
  },

  // ── SOUTH AUSTRALIA (10 properties) ────────────────────────────────────────
  {
    id: 'prop-071',
    address: {
      displayAddress: '15 King William Street, Adelaide SA 5000',
      streetNumber: '15', streetName: 'King William Street',
      suburb: 'Adelaide', state: 'SA', postcode: '5000'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 95, lotArea: null, yearBuilt: 2019,
    landValue: null, lastSalePrice: 650000, lastSaleDate: '2023-09-15', images: []
  },
  {
    id: 'prop-072',
    address: {
      displayAddress: '8 Unley Road, Unley SA 5061',
      streetNumber: '8', streetName: 'Unley Road',
      suburb: 'Unley', state: 'SA', postcode: '5061'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 268, lotArea: 620, yearBuilt: 1960,
    landValue: 780000, lastSalePrice: 1150000, lastSaleDate: '2024-02-10', images: []
  },
  {
    id: 'prop-073',
    address: {
      displayAddress: '22 Jetty Road, Glenelg SA 5045',
      streetNumber: '22', streetName: 'Jetty Road',
      suburb: 'Glenelg', state: 'SA', postcode: '5045'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 195, lotArea: 520, yearBuilt: 1985,
    landValue: 920000, lastSalePrice: 1380000, lastSaleDate: '2023-11-05', images: []
  },
  {
    id: 'prop-074',
    address: {
      displayAddress: '5 Kensington Road, Kensington SA 5068',
      streetNumber: '5', streetName: 'Kensington Road',
      suburb: 'Kensington', state: 'SA', postcode: '5068'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 1,
    floorArea: 155, lotArea: 430, yearBuilt: 1935,
    landValue: 680000, lastSalePrice: 980000, lastSaleDate: '2023-07-28', images: []
  },
  {
    id: 'prop-075',
    address: {
      displayAddress: '18 Beachport Road, Victor Harbor SA 5211',
      streetNumber: '18', streetName: 'Beachport Road',
      suburb: 'Victor Harbor', state: 'SA', postcode: '5211'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 180, lotArea: 690, yearBuilt: 2001,
    landValue: 380000, lastSalePrice: 620000, lastSaleDate: '2023-10-18', images: []
  },
  {
    id: 'prop-076',
    address: {
      displayAddress: '9 McLaren Vale Road, McLaren Vale SA 5171',
      streetNumber: '9', streetName: 'McLaren Vale Road',
      suburb: 'McLaren Vale', state: 'SA', postcode: '5171'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 3,
    floorArea: 240, lotArea: 1800, yearBuilt: 2005,
    landValue: 520000, lastSalePrice: 880000, lastSaleDate: '2024-01-22', images: []
  },
  {
    id: 'prop-077',
    address: {
      displayAddress: '3/28 Hindmarsh Square, Adelaide SA 5000',
      streetNumber: '28', streetName: 'Hindmarsh Square',
      suburb: 'Adelaide', state: 'SA', postcode: '5000'
    },
    propertyType: 'Apartment',
    bedrooms: 1, bathrooms: 1, carSpaces: 1,
    floorArea: 58, lotArea: null, yearBuilt: 2014,
    landValue: null, lastSalePrice: 385000, lastSaleDate: '2023-08-05', images: []
  },
  {
    id: 'prop-078',
    address: {
      displayAddress: '44 Greenhill Road, Burnside SA 5066',
      streetNumber: '44', streetName: 'Greenhill Road',
      suburb: 'Burnside', state: 'SA', postcode: '5066'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 3, carSpaces: 2,
    floorArea: 390, lotArea: 830, yearBuilt: 1992,
    landValue: 1150000, lastSalePrice: 1750000, lastSaleDate: '2024-03-12', images: []
  },
  {
    id: 'prop-079',
    address: {
      displayAddress: '11 Magill Road, Magill SA 5072',
      streetNumber: '11', streetName: 'Magill Road',
      suburb: 'Magill', state: 'SA', postcode: '5072'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 2,
    floorArea: 145, lotArea: 510, yearBuilt: 1958,
    landValue: 520000, lastSalePrice: 780000, lastSaleDate: '2023-06-18', images: []
  },
  {
    id: 'prop-080',
    address: {
      displayAddress: '29 Barossa Valley Way, Tanunda SA 5352',
      streetNumber: '29', streetName: 'Barossa Valley Way',
      suburb: 'Tanunda', state: 'SA', postcode: '5352'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 210, lotArea: 950, yearBuilt: 2003,
    landValue: 420000, lastSalePrice: 720000, lastSaleDate: '2023-12-08', images: []
  },

  // ── TASMANIA (8 properties) ─────────────────────────────────────────────────
  {
    id: 'prop-081',
    address: {
      displayAddress: '5 Macquarie Street, Hobart TAS 7000',
      streetNumber: '5', streetName: 'Macquarie Street',
      suburb: 'Hobart', state: 'TAS', postcode: '7000'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 1, carSpaces: 1,
    floorArea: 82, lotArea: null, yearBuilt: 2010,
    landValue: null, lastSalePrice: 520000, lastSaleDate: '2023-10-25', images: []
  },
  {
    id: 'prop-082',
    address: {
      displayAddress: '18 Sandy Bay Road, Sandy Bay TAS 7005',
      streetNumber: '18', streetName: 'Sandy Bay Road',
      suburb: 'Sandy Bay', state: 'TAS', postcode: '7005'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 258, lotArea: 650, yearBuilt: 1968,
    landValue: 680000, lastSalePrice: 1050000, lastSaleDate: '2024-02-15', images: []
  },
  {
    id: 'prop-083',
    address: {
      displayAddress: '7 Charles Street, Launceston TAS 7250',
      streetNumber: '7', streetName: 'Charles Street',
      suburb: 'Launceston', state: 'TAS', postcode: '7250'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 1,
    floorArea: 148, lotArea: 490, yearBuilt: 1952,
    landValue: 320000, lastSalePrice: 520000, lastSaleDate: '2023-07-12', images: []
  },
  {
    id: 'prop-084',
    address: {
      displayAddress: '14 Salamanca Place, Hobart TAS 7004',
      streetNumber: '14', streetName: 'Salamanca Place',
      suburb: 'Hobart', state: 'TAS', postcode: '7004'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 165, lotArea: 180, yearBuilt: 2008,
    landValue: 580000, lastSalePrice: 880000, lastSaleDate: '2023-11-18', images: []
  },
  {
    id: 'prop-085',
    address: {
      displayAddress: '3 Cygnet Road, Huonville TAS 7109',
      streetNumber: '3', streetName: 'Cygnet Road',
      suburb: 'Huonville', state: 'TAS', postcode: '7109'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 2,
    floorArea: 135, lotArea: 820, yearBuilt: 1975,
    landValue: 220000, lastSalePrice: 380000, lastSaleDate: '2023-09-02', images: []
  },
  {
    id: 'prop-086',
    address: {
      displayAddress: '21 George Street, Devonport TAS 7310',
      streetNumber: '21', streetName: 'George Street',
      suburb: 'Devonport', state: 'TAS', postcode: '7310'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 158, lotArea: 560, yearBuilt: 1985,
    landValue: 245000, lastSalePrice: 420000, lastSaleDate: '2024-01-08', images: []
  },
  {
    id: 'prop-087',
    address: {
      displayAddress: '9 Mount Wellington Road, Fern Tree TAS 7054',
      streetNumber: '9', streetName: 'Mount Wellington Road',
      suburb: 'Fern Tree', state: 'TAS', postcode: '7054'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 210, lotArea: 1200, yearBuilt: 1998,
    landValue: 520000, lastSalePrice: 850000, lastSaleDate: '2023-08-18', images: []
  },
  {
    id: 'prop-088',
    address: {
      displayAddress: '16 Bay Road, Bicheno TAS 7215',
      streetNumber: '16', streetName: 'Bay Road',
      suburb: 'Bicheno', state: 'TAS', postcode: '7215'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 168, lotArea: 700, yearBuilt: 2004,
    landValue: 280000, lastSalePrice: 480000, lastSaleDate: '2023-12-30', images: []
  },

  // ── AUSTRALIAN CAPITAL TERRITORY (5 properties) ─────────────────────────────
  {
    id: 'prop-089',
    address: {
      displayAddress: '12 London Circuit, Canberra ACT 2601',
      streetNumber: '12', streetName: 'London Circuit',
      suburb: 'Canberra', state: 'ACT', postcode: '2601'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 105, lotArea: null, yearBuilt: 2018,
    landValue: null, lastSalePrice: 720000, lastSaleDate: '2023-10-12', images: []
  },
  {
    id: 'prop-090',
    address: {
      displayAddress: '4 Mugga Way, Red Hill ACT 2603',
      streetNumber: '4', streetName: 'Mugga Way',
      suburb: 'Red Hill', state: 'ACT', postcode: '2603'
    },
    propertyType: 'House',
    bedrooms: 5, bathrooms: 3, carSpaces: 3,
    floorArea: 420, lotArea: 920, yearBuilt: 2002,
    landValue: 1450000, lastSalePrice: 2350000, lastSaleDate: '2024-02-18', images: []
  },
  {
    id: 'prop-091',
    address: {
      displayAddress: '33 Gungahlin Drive, Gungahlin ACT 2912',
      streetNumber: '33', streetName: 'Gungahlin Drive',
      suburb: 'Gungahlin', state: 'ACT', postcode: '2912'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 245, lotArea: 600, yearBuilt: 2015,
    landValue: 680000, lastSalePrice: 980000, lastSaleDate: '2023-09-20', images: []
  },
  {
    id: 'prop-092',
    address: {
      displayAddress: '7 Bougainville Street, Manuka ACT 2603',
      streetNumber: '7', streetName: 'Bougainville Street',
      suburb: 'Manuka', state: 'ACT', postcode: '2603'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 178, lotArea: 220, yearBuilt: 2012,
    landValue: 750000, lastSalePrice: 1120000, lastSaleDate: '2023-11-30', images: []
  },
  {
    id: 'prop-093',
    address: {
      displayAddress: '22 Emu Bank, Belconnen ACT 2617',
      streetNumber: '22', streetName: 'Emu Bank',
      suburb: 'Belconnen', state: 'ACT', postcode: '2617'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 1, carSpaces: 1,
    floorArea: 78, lotArea: null, yearBuilt: 2016,
    landValue: null, lastSalePrice: 520000, lastSaleDate: '2024-03-05', images: []
  },

  // ── NORTHERN TERRITORY (5 properties) ──────────────────────────────────────
  {
    id: 'prop-094',
    address: {
      displayAddress: '10 Mitchell Street, Darwin NT 0800',
      streetNumber: '10', streetName: 'Mitchell Street',
      suburb: 'Darwin', state: 'NT', postcode: '0800'
    },
    propertyType: 'Apartment',
    bedrooms: 2, bathrooms: 2, carSpaces: 1,
    floorArea: 98, lotArea: null, yearBuilt: 2012,
    landValue: null, lastSalePrice: 420000, lastSaleDate: '2023-08-28', images: []
  },
  {
    id: 'prop-095',
    address: {
      displayAddress: '5 Gilruth Avenue, Fannie Bay NT 0820',
      streetNumber: '5', streetName: 'Gilruth Avenue',
      suburb: 'Fannie Bay', state: 'NT', postcode: '0820'
    },
    propertyType: 'House',
    bedrooms: 4, bathrooms: 2, carSpaces: 2,
    floorArea: 230, lotArea: 780, yearBuilt: 1995,
    landValue: 680000, lastSalePrice: 980000, lastSaleDate: '2023-11-22', images: []
  },
  {
    id: 'prop-096',
    address: {
      displayAddress: '18 Rapid Creek Road, Rapid Creek NT 0810',
      streetNumber: '18', streetName: 'Rapid Creek Road',
      suburb: 'Rapid Creek', state: 'NT', postcode: '0810'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 2, carSpaces: 2,
    floorArea: 175, lotArea: 620, yearBuilt: 2000,
    landValue: 480000, lastSalePrice: 680000, lastSaleDate: '2024-01-14', images: []
  },
  {
    id: 'prop-097',
    address: {
      displayAddress: '7 Todd Street, Alice Springs NT 0870',
      streetNumber: '7', streetName: 'Todd Street',
      suburb: 'Alice Springs', state: 'NT', postcode: '0870'
    },
    propertyType: 'House',
    bedrooms: 3, bathrooms: 1, carSpaces: 2,
    floorArea: 148, lotArea: 700, yearBuilt: 1988,
    landValue: 250000, lastSalePrice: 420000, lastSaleDate: '2023-07-18', images: []
  },
  {
    id: 'prop-098',
    address: {
      displayAddress: '23 Parap Road, Parap NT 0820',
      streetNumber: '23', streetName: 'Parap Road',
      suburb: 'Parap', state: 'NT', postcode: '0820'
    },
    propertyType: 'Townhouse',
    bedrooms: 3, bathrooms: 2, carSpaces: 1,
    floorArea: 158, lotArea: 200, yearBuilt: 2008,
    landValue: 520000, lastSalePrice: 750000, lastSaleDate: '2023-10-08', images: []
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
    const matched = MOCK_PROPERTIES.filter(p =>
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
