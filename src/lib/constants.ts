export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export const INITIAL_VIEW = {
  longitude: 85.3250,
  latitude: 27.6910,
  zoom: 14,
  bearing: 0,
  pitch: 45,
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
