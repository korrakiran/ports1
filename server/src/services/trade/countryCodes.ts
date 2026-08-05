/**
 * ISO-3166 alpha-3 -> lowercase alpha-2, for the 226 countries and territories
 * present in global_imports_hs4.csv.
 *
 * Generated once from the dataset's country list cross-referenced with the
 * country paths in WorldSVGMap, so the results heat map can paint every country
 * the data contains. The alpha-2 code is the id the map keys on.
 */
export const ISO3_TO_ISO2: Record<string, string> = {
  ABW: 'aw', // Aruba
  AFG: 'af', // Afghanistan
  AGO: 'ao', // Angola
  AIA: 'ai', // Anguilla
  ALB: 'al', // Albania
  AND: 'ad', // Andorra
  ARE: 'ae', // United Arab Emirates
  ARG: 'ar', // Argentina
  ARM: 'am', // Armenia
  ASM: 'as', // American Samoa
  ATF: 'tf', // French Southern Territories
  ATG: 'ag', // Antigua and Barbuda
  AUS: 'au', // Australia
  AUT: 'at', // Austria
  AZE: 'az', // Azerbaijan
  BDI: 'bi', // Burundi
  BEL: 'be', // Belgium
  BEN: 'bj', // Benin
  BES: 'bq', // Bonaire
  BFA: 'bf', // Burkina Faso
  BGD: 'bd', // Bangladesh
  BGR: 'bg', // Bulgaria
  BHR: 'bh', // Bahrain
  BHS: 'bs', // Bahamas
  BIH: 'ba', // Bosnia and Herzegovina
  BLM: 'bl', // Saint Barthélemy
  BLR: 'by', // Belarus
  BLZ: 'bz', // Belize
  BMU: 'bm', // Bermuda
  BOL: 'bo', // Bolivia
  BRA: 'br', // Brazil
  BRB: 'bb', // Barbados
  BRN: 'bn', // Brunei
  BTN: 'bt', // Bhutan
  BWA: 'bw', // Botswana
  CAF: 'cf', // Central African Republic
  CAN: 'ca', // Canada
  CCK: 'cc', // Cocos (Keeling) Islands
  CHE: 'ch', // Switzerland
  CHL: 'cl', // Chile
  CHN: 'cn', // China
  CIV: 'ci', // Cote d'Ivoire
  CMR: 'cm', // Cameroon
  COD: 'cd', // Democratic Republic of the Congo
  COG: 'cg', // Republic of the Congo
  COK: 'ck', // Cook Islands
  COL: 'co', // Colombia
  COM: 'km', // Comoros
  CPV: 'cv', // Cape Verde
  CRI: 'cr', // Costa Rica
  CUB: 'cu', // Cuba
  CUW: 'cw', // Curaçao
  CXR: 'cx', // Christmas Island
  CYM: 'ky', // Cayman Islands
  CYP: 'cy', // Cyprus
  CZE: 'cz', // Czechia
  DEU: 'de', // Germany
  DJI: 'dj', // Djibouti
  DMA: 'dm', // Dominica
  DNK: 'dk', // Denmark
  DOM: 'do', // Dominican Republic
  DZA: 'dz', // Algeria
  ECU: 'ec', // Ecuador
  EGY: 'eg', // Egypt
  ERI: 'er', // Eritrea
  ESP: 'es', // Spain
  EST: 'ee', // Estonia
  ETH: 'et', // Ethiopia
  FIN: 'fi', // Finland
  FJI: 'fj', // Fiji
  FLK: 'fk', // Falkland Islands
  FRA: 'fr', // France
  FSM: 'fm', // Micronesia
  GAB: 'ga', // Gabon
  GBR: 'gb', // United Kingdom
  GEO: 'ge', // Georgia
  GHA: 'gh', // Ghana
  GIB: 'gi', // Gibraltar
  GIN: 'gn', // Guinea
  GMB: 'gm', // Gambia
  GNB: 'gw', // GuineaBissau
  GNQ: 'gq', // Equatorial Guinea
  GRC: 'gr', // Greece
  GRD: 'gd', // Grenada
  GRL: 'gl', // Greenland
  GTM: 'gt', // Guatemala
  GUM: 'gu', // Guam
  GUY: 'gy', // Guyana
  HKG: 'hk', // Hong Kong
  HND: 'hn', // Honduras
  HRV: 'hr', // Croatia
  HTI: 'ht', // Haiti
  HUN: 'hu', // Hungary
  IDN: 'id', // Indonesia
  IND: 'in', // India
  IOT: 'io', // British Indian Ocean Territory
  IRL: 'ie', // Ireland
  IRN: 'ir', // Iran
  IRQ: 'iq', // Iraq
  ISL: 'is', // Iceland
  ISR: 'il', // Israel
  ITA: 'it', // Italy
  JAM: 'jm', // Jamaica
  JOR: 'jo', // Jordan
  JPN: 'jp', // Japan
  KAZ: 'kz', // Kazakhstan
  KEN: 'ke', // Kenya
  KGZ: 'kg', // Kyrgyzstan
  KHM: 'kh', // Cambodia
  KIR: 'ki', // Kiribati
  KNA: 'kn', // Saint Kitts and Nevis
  KOR: 'kr', // South Korea
  KWT: 'kw', // Kuwait
  LAO: 'la', // Laos
  LBN: 'lb', // Lebanon
  LBR: 'lr', // Liberia
  LBY: 'ly', // Libya
  LCA: 'lc', // Saint Lucia
  LKA: 'lk', // Sri Lanka
  LSO: 'ls', // Lesotho
  LTU: 'lt', // Lithuania
  LUX: 'lu', // Luxembourg
  LVA: 'lv', // Latvia
  MAC: 'mo', // Macau
  MAF: 'sx', // Saint Martin
  MAR: 'ma', // Morocco
  MDA: 'md', // Moldova
  MDG: 'mg', // Madagascar
  MDV: 'mv', // Maldives
  MEX: 'mx', // Mexico
  MHL: 'mh', // Marshall Islands
  MKD: 'mk', // North Macedonia
  MLI: 'ml', // Mali
  MLT: 'mt', // Malta
  MMR: 'mm', // Burma
  MNE: 'me', // Montenegro
  MNG: 'mn', // Mongolia
  MNP: 'mp', // Northern Mariana Islands
  MOZ: 'mz', // Mozambique
  MRT: 'mr', // Mauritania
  MSR: 'ms', // Montserrat
  MUS: 'mu', // Mauritius
  MWI: 'mw', // Malawi
  MYS: 'my', // Malaysia
  NAM: 'na', // Namibia
  NCL: 'nc', // New Caledonia
  NER: 'ne', // Niger
  NFK: 'nf', // Norfolk Island
  NGA: 'ng', // Nigeria
  NIC: 'ni', // Nicaragua
  NIU: 'nu', // Niue
  NLD: 'nl', // Netherlands
  NOR: 'no', // Norway
  NPL: 'np', // Nepal
  NRU: 'nr', // Nauru
  NZL: 'nz', // New Zealand
  OMN: 'om', // Oman
  PAK: 'pk', // Pakistan
  PAN: 'pa', // Panama
  PCN: 'pn', // Pitcairn Islands
  PER: 'pe', // Peru
  PHL: 'ph', // Philippines
  PLW: 'pw', // Palau
  PNG: 'pg', // Papua New Guinea
  POL: 'pl', // Poland
  PRK: 'kp', // North Korea
  PRT: 'pt', // Portugal
  PRY: 'py', // Paraguay
  PSE: 'ps', // Palestine
  PYF: 'pf', // French Polynesia
  QAT: 'qa', // Qatar
  ROU: 'ro', // Romania
  RUS: 'ru', // Russia
  RWA: 'rw', // Rwanda
  SAU: 'sa', // Saudi Arabia
  SDN: 'sd', // Sudan
  SEN: 'sn', // Senegal
  SGP: 'sg', // Singapore
  SHN: 'sh', // Saint Helena
  SLB: 'sb', // Solomon Islands
  SLE: 'sl', // Sierra Leone
  SLV: 'sv', // El Salvador
  SMR: 'sm', // San Marino
  SOM: 'so', // Somalia
  SPM: 'pm', // Saint Pierre and Miquelon
  SRB: 'rs', // Serbia
  SSD: 'ss', // South Sudan
  STP: 'st', // Sao Tome and Principe
  SUR: 'sr', // Suriname
  SVK: 'sk', // Slovakia
  SVN: 'si', // Slovenia
  SWE: 'se', // Sweden
  SWZ: 'sz', // Eswatini
  SYC: 'sc', // Seychelles
  SYR: 'sy', // Syria
  TCA: 'tc', // Turks and Caicos Islands
  TCD: 'td', // Chad
  TGO: 'tg', // Togo
  THA: 'th', // Thailand
  TJK: 'tj', // Tajikistan
  TKL: 'tk', // Tokelau
  TKM: 'tm', // Turkmenistan
  TLS: 'tl', // TimorLeste
  TON: 'to', // Tonga
  TTO: 'tt', // Trinidad and Tobago
  TUN: 'tn', // Tunisia
  TUR: 'tr', // Turkey
  TUV: 'tv', // Tuvalu
  TWN: 'tw', // Chinese Taipei
  TZA: 'tz', // Tanzania
  UGA: 'ug', // Uganda
  UKR: 'ua', // Ukraine
  URY: 'uy', // Uruguay
  USA: 'us', // United States
  UZB: 'uz', // Uzbekistan
  VCT: 'vc', // Saint Vincent and the Grenadines
  VEN: 've', // Venezuela
  VGB: 'vg', // British Virgin Islands
  VNM: 'vn', // Vietnam
  VUT: 'vu', // Vanuatu
  WLF: 'wf', // Wallis and Futuna
  WSM: 'ws', // Samoa
  YEM: 'ye', // Yemen
  ZAF: 'za', // South Africa
  ZMB: 'zm', // Zambia
  ZWE: 'zw', // Zimbabwe
};

/** OEC country ids are a two-letter region prefix followed by ISO alpha-3. */
export const REGION_BY_PREFIX: Record<string, string> = {
  af: 'Africa',
  an: 'Antarctica',
  as: 'Asia',
  eu: 'Europe',
  na: 'North America',
  oc: 'Oceania',
  sa: 'South America'
};
