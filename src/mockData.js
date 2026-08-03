// Comprehensive mock data for MSME Global Trade Marketplace

export const CURRENT_USER = {
  name: "Alexander Vance",
  company: "Vance Agro & Tech MSME",
  role: "Verified Exporter / Importer",
  country: "India",
  flag: "🇮🇳",
  verificationBadge: "Gold Verified MSME",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  creditScore: 785,
  tradeLimit: "$2,500,000"
};

export const MOCK_KPIS = {
  activeListings: 14,
  activeListingsTrend: "+3 this month",
  pipelineValue: "$1,480,000",
  pipelineValueTrend: "+18.4% YoY",
  unreadMessages: 8,
  unreadMessagesDetail: "4 high intent",
  opportunitiesFound: 142,
  oppTrend: "+24 new today"
};

export const MOCK_MARKETS = [
  {
    id: "de",
    country: "Germany",
    flag: "🇩🇪",
    code: "DE",
    lat: 51.1657,
    lng: 10.4515,
    demandScore: 94,
    demandLevel: "Very High",
    topImports: ["Organic Spices", "Solar Inverters", "Precision Tools"],
    tariffRate: "2.1%",
    avgShippingDays: 14,
    yoyGrowth: "+24.5%",
    marketSize: "$4.2B",
    riskLevel: "Low"
  },
  {
    id: "uae",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    code: "AE",
    lat: 23.4241,
    lng: 53.8478,
    demandScore: 98,
    demandLevel: "Extreme",
    topImports: ["Basmati Rice", "Textiles", "Leather Goods"],
    tariffRate: "0.0% (CEPA)",
    avgShippingDays: 5,
    yoyGrowth: "+38.2%",
    marketSize: "$6.8B",
    riskLevel: "Low"
  },
  {
    id: "us",
    country: "United States",
    flag: "🇺🇸",
    code: "US",
    lat: 37.0902,
    lng: -95.7129,
    demandScore: 89,
    demandLevel: "High",
    topImports: ["Handicrafts", "Ceramic Tiles", "Agro-chemicals"],
    tariffRate: "3.4%",
    avgShippingDays: 21,
    yoyGrowth: "+12.8%",
    marketSize: "$18.5B",
    riskLevel: "Low"
  },
  {
    id: "jp",
    country: "Japan",
    flag: "🇯🇵",
    code: "JP",
    lat: 36.2048,
    lng: 138.2529,
    demandScore: 85,
    demandLevel: "High",
    topImports: ["Herbal Extracts", "Software Solutions", "Silk Fabrics"],
    tariffRate: "1.8%",
    avgShippingDays: 12,
    yoyGrowth: "+19.1%",
    marketSize: "$3.9B",
    riskLevel: "Low"
  },
  {
    id: "au",
    country: "Australia",
    flag: "🇦🇺",
    code: "AU",
    lat: -25.2744,
    lng: 133.7751,
    demandScore: 78,
    demandLevel: "Moderate",
    topImports: ["Auto Components", "Tea & Coffee", "Steel Fittings"],
    tariffRate: "0.0% (AI-ECTA)",
    avgShippingDays: 16,
    yoyGrowth: "+15.3%",
    marketSize: "$2.1B",
    riskLevel: "Low"
  },
  {
    id: "br",
    country: "Brazil",
    flag: "🇧🇷",
    code: "BR",
    lat: -14.2350,
    lng: -51.9253,
    demandScore: 72,
    demandLevel: "Moderate",
    topImports: ["Agro Equipment", "Pharmaceutical Intermediates"],
    tariffRate: "6.5%",
    avgShippingDays: 28,
    yoyGrowth: "+8.4%",
    marketSize: "$1.4B",
    riskLevel: "Medium"
  }
];

export const MOCK_OPPORTUNITIES = [
  {
    id: "OPP-9021",
    title: "Premium Organic Cardamom & Black Pepper Bulk Supply",
    hsCode: "0908.31",
    category: "Agriculture & Spices",
    destination: "Germany",
    flag: "🇩🇪",
    importerName: "BioHerb Logistics GmBH",
    verified: true,
    volumeRequired: "45 Metric Tons / Mo",
    targetPrice: "$18.50 / kg",
    estimatedMargin: "34%",
    opportunityScore: 96,
    matchingRate: "98%",
    type: "Import Demand",
    deadline: "In 6 days"
  },
  {
    id: "OPP-8832",
    title: "Industrial Grade Solar Inverters (5kW - 50kW)",
    hsCode: "8504.40",
    category: "Renewable Energy",
    destination: "United Arab Emirates",
    flag: "🇦🇪",
    importerName: "Al-Maktoum CleanTech LLC",
    verified: true,
    volumeRequired: "1,200 Units",
    targetPrice: "$420 / unit",
    estimatedMargin: "28%",
    opportunityScore: 92,
    matchingRate: "95%",
    type: "Import Demand",
    deadline: "In 12 days"
  },
  {
    id: "OPP-7741",
    title: "Handcrafted Jute Fabrics & Eco Tote Bags",
    hsCode: "5307.10",
    category: "Textiles & Goods",
    destination: "United States",
    flag: "🇺🇸",
    importerName: "EcoStyle Retailers USA",
    verified: true,
    volumeRequired: "50,000 Pcs",
    targetPrice: "$3.80 / pc",
    estimatedMargin: "41%",
    opportunityScore: 88,
    matchingRate: "91%",
    type: "Import Demand",
    deadline: "In 3 days"
  },
  {
    id: "OPP-6612",
    title: "Cold-Pressed Neem Oil & Organic Pesticides",
    hsCode: "3808.99",
    category: "Agro-chemicals",
    destination: "Australia",
    flag: "🇦🇺",
    importerName: "Queensland Agro Distribution",
    verified: true,
    volumeRequired: "12,000 Liters",
    targetPrice: "$14.20 / L",
    estimatedMargin: "30%",
    opportunityScore: 84,
    matchingRate: "88%",
    type: "Import Demand",
    deadline: "In 18 days"
  },
  {
    id: "OPP-5509",
    title: "Precision CNC Turned Brass Fittings",
    hsCode: "7412.20",
    category: "Engineering & Metals",
    destination: "Japan",
    flag: "🇯🇵",
    importerName: "Nippon Engineering KK",
    verified: true,
    volumeRequired: "100,000 Pcs",
    targetPrice: "$1.15 / pc",
    estimatedMargin: "25%",
    opportunityScore: 81,
    matchingRate: "85%",
    type: "Import Demand",
    deadline: "In 9 days"
  }
];

export const MOCK_TRANSACTIONS = [
  {
    id: "TRX-44910",
    product: "Organic Cardamom (Batch #DE-90)",
    partner: "BioHerb Logistics GmBH (Germany)",
    value: "$185,000",
    status: "Customs Clearance",
    step: 3,
    totalSteps: 5,
    eta: "Aug 12, 2026",
    paymentStatus: "Escrow Locked (70%)",
    hsCode: "0908.31",
    carrier: "Maersk Line (Container #MSK-9921)",
    docsReady: 4,
    docsTotal: 5
  },
  {
    id: "TRX-44882",
    product: "Solar Inverters 50kW (Batch #AE-12)",
    partner: "Al-Maktoum CleanTech (UAE)",
    value: "$420,000",
    status: "In Transit (Maritime)",
    step: 2,
    totalSteps: 5,
    eta: "Aug 08, 2026",
    paymentStatus: "LC Confirmed by HSBC",
    hsCode: "8504.40",
    carrier: "Hapag-Lloyd (Ship ID: HL-772)",
    docsReady: 5,
    docsTotal: 5
  },
  {
    id: "TRX-44701",
    product: "Eco Jute Bags (Batch #US-88)",
    partner: "EcoStyle Retailers (USA)",
    value: "$95,000",
    status: "Completed & Delivered",
    step: 5,
    totalSteps: 5,
    eta: "Delivered Aug 01",
    paymentStatus: "Released ($95,000)",
    hsCode: "5307.10",
    carrier: "FedEx Trade Networks",
    docsReady: 5,
    docsTotal: 5
  },
  {
    id: "TRX-44610",
    product: "Cold-Pressed Neem Oil",
    partner: "Queensland Agro (Australia)",
    value: "$168,000",
    status: "Contract Signing",
    step: 1,
    totalSteps: 5,
    eta: "Pending Shipment",
    paymentStatus: "Draft Escrow",
    hsCode: "3808.99",
    carrier: "Pending Allocation",
    docsReady: 2,
    docsTotal: 5
  }
];

export const MOCK_NETWORK = [
  {
    id: "NET-101",
    name: "BioHerb Logistics GmBH",
    type: "Importer / Distributor",
    country: "Germany",
    flag: "🇩🇪",
    trustRating: 4.9,
    completedDeals: 142,
    certifications: ["ISO 9001", "EU Organic", "GMP"],
    contactPerson: "Dr. Klaus Weber",
    email: "k.weber@bioherb.de",
    responseRate: "99%",
    verifiedSince: "2021"
  },
  {
    id: "NET-102",
    name: "Al-Maktoum CleanTech LLC",
    type: "Enterprise Buyer",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    trustRating: 4.8,
    completedDeals: 88,
    certifications: ["CE Mark", "IEC Certified", "DEWA Approved"],
    contactPerson: "Tariq Al-Maktoum",
    email: "tariq@cleantech.ae",
    responseRate: "95%",
    verifiedSince: "2022"
  },
  {
    id: "NET-103",
    name: "EcoStyle Retailers USA",
    type: "Retail Chain Importer",
    country: "United States",
    flag: "🇺🇸",
    trustRating: 4.7,
    completedDeals: 215,
    certifications: ["FairTrade", "FSC Certified"],
    contactPerson: "Sarah Jenkins",
    email: "s.jenkins@ecostyle.com",
    responseRate: "97%",
    verifiedSince: "2020"
  }
];

export const DEMAND_TREND_CHART = [
  { month: "Jan", Spices: 4000, CleanTech: 2400, Textiles: 2400 },
  { month: "Feb", Spices: 4500, CleanTech: 2800, Textiles: 2200 },
  { month: "Mar", Spices: 5100, CleanTech: 3500, Textiles: 2800 },
  { month: "Apr", Spices: 5800, CleanTech: 4200, Textiles: 3100 },
  { month: "May", Spices: 6400, CleanTech: 4900, Textiles: 3900 },
  { month: "Jun", Spices: 7200, CleanTech: 5800, Textiles: 4300 },
  { month: "Jul", Spices: 8100, CleanTech: 6700, Textiles: 4800 }
];
