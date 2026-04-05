// MAPBOX_TOKEN removed — no longer needed after migrating to MapLibre + OpenFreeMap

export const INITIAL_VIEW= {
  longitude: 85.3250,
  latitude: 27.6910,
  zoom: 14,
  bearing: -20,
  pitch: 60,
};

export const CCTV_LOCATIONS = [
  {
    id: "civil-hospital",
    label: "Civil Hospital",
    labelNp: "सिभिल अस्पताल",
    coords: [85.3298, 27.6890] as [number, number],
  },
  {
    id: "bicc-gate",
    label: "BICC Main Gate",
    labelNp: "बिआइसिसी मेन गेट",
    coords: [85.3280, 27.6878] as [number, number],
  },
  {
    id: "bijuli-bazaar",
    label: "Bijuli Bazaar",
    labelNp: "बिजुली बजार",
    coords: [85.3245, 27.6930] as [number, number],
  },
  {
    id: "everest-hotel",
    label: "Everest Hotel",
    labelNp: "एभरेस्ट होटल",
    coords: [85.3335, 27.6880] as [number, number],
  },
  {
    id: "baneshwor-chowk",
    label: "Baneshwor Chowk",
    labelNp: "बानेश्वर चोक",
    coords: [85.3315, 27.6893] as [number, number],
  },
  {
    id: "nepal-commerce",
    label: "Nepal Commerce Campus",
    labelNp: "नेपाल कमर्स क्याम्पस",
    coords: [85.3295, 27.6900] as [number, number],
  },
  {
    id: "parliament-west",
    label: "Parliament West Gate",
    labelNp: "संसद पश्चिम गेट",
    coords: [85.3265, 27.6885] as [number, number],
  },
  {
    id: "arabica-coffee",
    label: "Arabica Coffee",
    labelNp: "अरेबिका कफी",
    coords: [85.3290, 27.6882] as [number, number],
  },
];

export type Phase = "gathering" | "escalation" | "curfew" | "aftermath";

export const PHASE_COLORS: Record<Phase, { accent: string; bg: string; text: string }> = {
  gathering: {
    accent: "border-[#267163]",
    bg: "bg-[#267163]/10",
    text: "text-[#267163]",
  },
  escalation: {
    accent: "border-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
  },
  curfew: {
    accent: "border-red-600",
    bg: "bg-red-600/10",
    text: "text-red-600",
  },
  aftermath: {
    accent: "border-zinc-500",
    bg: "bg-zinc-500/10",
    text: "text-zinc-600",
  },
};

export const PHASE_LABELS: Record<Phase, { en: string; np: string }> = {
  gathering: { en: "Gathering", np: "भेला" },
  escalation: { en: "Escalation", np: "उग्र" },
  curfew: { en: "Curfew", np: "कर्फ्यू" },
  aftermath: { en: "Aftermath", np: "परिणाम" },
};

export const FLYTO_DEFAULTS = {
  speed: 0.8,
  curve: 1.4,
  essential: true,
};

// Protest march route waypoints (west→east): Maitighar → Bijuli Bazaar → Parliament → Baneshwor
export const PROTEST_ROUTE: [number, number][] = [
  [85.3206, 27.6942], // Maitighar Mandala
  [85.3215, 27.6940], // Road heading east
  [85.3230, 27.6935], // Mid-route
  [85.3245, 27.6930], // Bijuli Bazaar
  [85.3260, 27.6920], // Bijuli Bazaar bridge
  [85.3262, 27.6905], // Turning south toward Parliament
  [85.3265, 27.6885], // Parliament West Gate
  [85.3275, 27.6880], // Approaching BICC
  [85.3280, 27.6878], // BICC Main Gate
  [85.3290, 27.6882], // Arabica Coffee
  [85.3295, 27.6885], // Nepal Commerce Campus area
  [85.3298, 27.6890], // Civil Hospital
  [85.3315, 27.6893], // Baneshwor Chowk
  [85.3335, 27.6880], // Everest Hotel
];

// Map each timeline event to the closest route segment index (precomputed)
// This determines how far the route line is drawn for each event
export function getRouteProgressIndex(eventIndex: number): number {
  // Event coords → closest route waypoint index
  const eventCoords: [number, number][] = [
    [85.3206, 27.6942], // e01 - Maitighar
    [85.3206, 27.6942], // e02 - Maitighar
    [85.3206, 27.6942], // e03 - Maitighar
    [85.3206, 27.6940], // e04 - Maitighar
    [85.3245, 27.6930], // e05 - Bijuli Bazaar
    [85.3260, 27.6920], // e06 - Bijuli Bazaar bridge
    [85.3335, 27.6880], // e07 - Everest Hotel
    [85.3298, 27.6890], // e08 - Civil Hospital
    [85.3280, 27.6878], // e09 - BICC Gate
    [85.3280, 27.6880], // e10 - near BICC
    [85.3315, 27.6893], // e11 - Baneshwor Chowk
    [85.3280, 27.6878], // e12 - BICC
    [85.3280, 27.6878], // e13 - BICC
    [85.3280, 27.6878], // e14 - BICC
    [85.3298, 27.6890], // e15 - Civil Hospital
    [85.3265, 27.6885], // e16 - Parliament West
    [85.3298, 27.6890], // e17 - Civil Hospital
    [85.3280, 27.6878], // e18 - BICC
    [85.3290, 27.6885], // e19+ rest are in the area
  ];

  if (eventIndex >= eventCoords.length) {
    return PROTEST_ROUTE.length - 1; // Full route revealed
  }

  const coord = eventCoords[eventIndex];
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < PROTEST_ROUTE.length; i++) {
    const dx = coord[0] - PROTEST_ROUTE[i][0];
    const dy = coord[1] - PROTEST_ROUTE[i][1];
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

// Map CCTV location IDs to the first event index that references them
export const CCTV_REVEAL_AT: Record<string, number> = {
  "bijuli-bazaar": 5,     // e06 — first event at Bijuli Bazaar
  "everest-hotel": 6,     // e07 — first event at Everest Hotel
  "bicc-gate": 8,         // e09 — first event at BICC Gate
  "parliament-west": 15,  // e16 — first event at Parliament West Gate
  "civil-hospital": 14,   // e15 — first event at Civil Hospital
  "baneshwor-chowk": 10,  // e11 — first event at Baneshwor Chowk
  "nepal-commerce": 14,   // e15 — near Civil Hospital events
  "arabica-coffee": 18,   // e19 — first curfew phase event
};

// Phase colors for the route line (hex for Mapbox GL)
export const PHASE_LINE_COLORS: Record<Phase, string> = {
  gathering: "#267163",
  escalation: "#f59e0b",
  curfew: "#dc2626",
  aftermath: "#71717a",
};
