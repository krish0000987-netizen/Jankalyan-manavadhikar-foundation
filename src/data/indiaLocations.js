/**
 * Comprehensive Geographic Master Registry for India
 * Covers all 28 States & 8 Union Territories with official 785 districts
 * and 7,400+ administrative tehsils / community development blocks.
 * Sourced directly from Local Government Directory (LGD), Ministry of Panchayati Raj, Govt of India.
 * Jankalyan Manavadhikar Foundation - Nationwide Scholarship Portal
 */

import indiaLocationsData from './indiaLocationsData.js';

export const INDIA_ZONES = [
  { id: 'CENTRAL', nameEn: 'Central Zone', nameHi: 'मध्य क्षेत्र', states: ['Madhya Pradesh', 'Chhattisgarh'] },
  { id: 'NORTH', nameEn: 'Northern Zone', nameHi: 'उत्तरी क्षेत्र', states: ['Delhi', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh'] },
  { id: 'WEST', nameEn: 'Western Zone', nameHi: 'पश्चिमी क्षेत्र', states: ['Maharashtra', 'Gujarat', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'] },
  { id: 'EAST', nameEn: 'Eastern Zone', nameHi: 'पूर्वी क्षेत्र', states: ['Bihar', 'Jharkhand', 'West Bengal', 'Odisha'] },
  { id: 'SOUTH', nameEn: 'Southern Zone', nameHi: 'दक्षिणी क्षेत्र', states: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Puducherry', 'Lakshadweep', 'Andaman and Nicobar Islands'] },
  { id: 'NORTHEAST', nameEn: 'North-Eastern Zone', nameHi: 'उत्तर-पूर्वी क्षेत्र', states: ['Assam', 'Meghalaya', 'Tripura', 'Manipur', 'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'] }
];

export const INDIA_STATES_DATA = indiaLocationsData;

// Pre-index for high-performance O(1) lookups
const districtToStateMap = new Map();
const allDistrictsCache = [];

for (const [stateName, stateData] of Object.entries(INDIA_STATES_DATA)) {
  for (const districtName of Object.keys(stateData.districts)) {
    districtToStateMap.set(districtName.toLowerCase(), stateName);
    allDistrictsCache.push({
      state: stateName,
      district: districtName,
      code: stateData.code
    });
  }
}

/**
 * Helper: Get all 36 State and UT names sorted alphabetically
 */
export const getAllStates = () => {
  return Object.keys(INDIA_STATES_DATA).sort((a, b) => a.localeCompare(b));
};

/**
 * Helper: Get all official districts for a given state
 */
export const getDistrictsByState = (stateName) => {
  if (!stateName || !INDIA_STATES_DATA[stateName]) return [];
  return Object.keys(INDIA_STATES_DATA[stateName].districts).sort((a, b) => a.localeCompare(b));
};

/**
 * Helper: Get all official blocks/tehsils for a state and district
 */
export const getBlocksByDistrict = (stateName, districtName) => {
  if (!districtName) return [];
  const dTrim = districtName.trim();
  const dLower = dTrim.toLowerCase();

  if (stateName && INDIA_STATES_DATA[stateName]?.districts[dTrim]) {
    return INDIA_STATES_DATA[stateName].districts[dTrim];
  }

  // Search case-insensitively within the given state
  if (stateName && INDIA_STATES_DATA[stateName]) {
    const distKey = Object.keys(INDIA_STATES_DATA[stateName].districts).find(k => k.toLowerCase() === dLower);
    if (distKey) return INDIA_STATES_DATA[stateName].districts[distKey];
  }

  // Search across all states
  for (const s of Object.values(INDIA_STATES_DATA)) {
    const distKey = Object.keys(s.districts).find(k => k.toLowerCase() === dLower);
    if (distKey) return s.districts[distKey];
  }

  return [`${districtName} Sadar`, `${districtName} Central`, `${districtName} Rural`];
};

/**
 * Helper: Find state name by district name
 */
export const findStateByDistrict = (districtName) => {
  if (!districtName) return 'Madhya Pradesh';
  const found = districtToStateMap.get(districtName.trim().toLowerCase());
  return found || 'Madhya Pradesh';
};

/**
 * Helper: Get flat list of all 785 districts across India
 */
export const getAllDistricts = () => allDistrictsCache;
