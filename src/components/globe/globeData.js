/**
 * Fixed example country set for the PortsAI hero globe — a landing-page visual,
 * not analysis output. Real recommendations come from global_imports_hs4.csv.
 *
 * These are VISUAL EXAMPLES that demonstrate the kind of output a user receives
 * after analyzing their own product. They carry qualitative labels only — the
 * real trade values, ranks and shares are computed per analysis from
 * global_imports_hs4.csv and shown on the results page.
 *
 * Countries are joined to the Natural Earth GeoJSON on `ADM0_A3`, not ISO_A2/ISO_A3 —
 * Natural Earth codes France, Norway and Kosovo as -99 in those fields.
 */

/** Qualitative categories. Not a ranked scale — colours are categorical. */
export const DEMAND_LEVELS = {
  HIGH_OPPORTUNITY: { label: 'High Opportunity', color: '#0047b3' },
  MANUFACTURING: { label: 'Strong Manufacturing Demand', color: '#0066ff' },
  PREMIUM: { label: 'Premium Market', color: '#4d94ff' },
  GROWING: { label: 'Growing Market', color: '#9dc0f5' }
};

/** Neutral fill for every country we are not highlighting. */
export const UNHIGHLIGHTED_COLOR = 'rgba(226, 232, 240, 0.30)';
export const UNHIGHLIGHTED_LABEL = 'Not part of this example';

/** Origin of the illustrated trade routes. */
export const ORIGIN = {
  iso: 'IND',
  name: 'India',
  lat: 20.5937,
  lng: 78.9629,
  color: '#090d16'
};

/**
 * Highlighted example markets.
 * `iso` = Natural Earth ADM0_A3. `hasPolygon: false` for city-states that are
 * absent from the 110m dataset — they render as a marker only.
 */
export const HIGHLIGHTED_MARKETS = [
  { iso: 'DEU', name: 'Germany', lat: 51.1657, lng: 10.4515, level: 'MANUFACTURING' },
  { iso: 'ARE', name: 'United Arab Emirates', lat: 23.4241, lng: 53.8478, level: 'HIGH_OPPORTUNITY' },
  { iso: 'USA', name: 'United States', lat: 37.0902, lng: -95.7129, level: 'PREMIUM' },
  { iso: 'JPN', name: 'Japan', lat: 36.2048, lng: 138.2529, level: 'PREMIUM' },
  { iso: 'FRA', name: 'France', lat: 46.2276, lng: 2.2137, level: 'PREMIUM' },
  { iso: 'AUS', name: 'Australia', lat: -25.2744, lng: 133.7751, level: 'GROWING' },
  { iso: 'CAN', name: 'Canada', lat: 56.1304, lng: -106.3468, level: 'GROWING' },
  { iso: 'SGP', name: 'Singapore', lat: 1.3521, lng: 103.8198, level: 'HIGH_OPPORTUNITY', hasPolygon: false }
];

/** ADM0_A3 -> market, for O(1) polygon lookup. */
export const MARKET_BY_ISO = Object.fromEntries(
  HIGHLIGHTED_MARKETS.map((m) => [m.iso, m])
);

/** Trade routes drawn from India to each highlighted market. */
export const TRADE_ROUTES = HIGHLIGHTED_MARKETS.map((m) => ({
  startLat: ORIGIN.lat,
  startLng: ORIGIN.lng,
  endLat: m.lat,
  endLng: m.lng,
  color: DEMAND_LEVELS[m.level].color,
  name: m.name
}));

/** Every point rendered on the globe, origin included. */
export const MARKER_POINTS = [
  { ...ORIGIN, isOrigin: true, levelLabel: 'Your base' },
  ...HIGHLIGHTED_MARKETS.map((m) => ({
    ...m,
    isOrigin: false,
    color: DEMAND_LEVELS[m.level].color,
    levelLabel: DEMAND_LEVELS[m.level].label
  }))
];

/** Legend entries, in display order. */
export const LEGEND_ITEMS = [
  DEMAND_LEVELS.HIGH_OPPORTUNITY,
  DEMAND_LEVELS.MANUFACTURING,
  DEMAND_LEVELS.PREMIUM,
  DEMAND_LEVELS.GROWING
];

export const GEOJSON_URL = '/geo/countries-110m.geojson';
export const TEXTURES = {
  earth: '/textures/earth-blue-marble.jpg',
  bump: '/textures/earth-topology.png',
  specular: '/textures/earth-water.png'
};
