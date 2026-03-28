import type { Phase } from "@/lib/constants";

export interface EventMedia {
  type: "image" | "video" | "cctv";
  url: string;
  captionNp: string;
  captionEn: string;
  credit?: string;
  alt: string;
}

export interface TimelineEvent {
  id: string;
  time: string; // 24h format for sorting "HH:MM"
  timeDisplay: string; // Nepali display format
  descriptionNp: string;
  descriptionEn: string;
  coords: [number, number]; // [lng, lat]
  zoom: number;
  bearing: number;
  pitch: number;
  phase: Phase;
  isMajor?: boolean; // highlight key moments
  media?: EventMedia;
  locationNp?: string; // location name in Nepali
  locationEn?: string; // location name in English
}

export const timelineEvents: TimelineEvent[] = [
  // ── Phase 1: GATHERING (8:23 – 10:59) ──────────────────────────────
  {
    id: "e01",
    time: "08:23",
    timeDisplay: "८ः२३",
    descriptionNp:
      "बिहान ८ः२३ बाटै विद्यार्थीहरू माइतीघर आसपास प्लेकार्डसहित भेला हुन थालेका थिए।",
    descriptionEn:
      "Students begin assembling near Maitighar Mandala with placards.",
    coords: [85.3206, 27.6942],
    zoom: 16,
    bearing: -8,
    pitch: 55,
    phase: "gathering",
    media: {
      type: "image",
      url: "/images/events/e01-early-gathering.jpg",
      captionNp: "प्रदर्शनमा भेला भएका विद्यार्थीहरू",
      captionEn: "Students assembling for the protest in school uniforms",
      credit: "छानबिन आयोग प्रतिवेदन / Investigation Commission Report",
      alt: "Students in school uniforms gathering early morning for the Bhadra 23 protest",
    },
  },
  {
    id: "e02",
    time: "09:14",
    timeDisplay: "९ः१४",
    descriptionNp:
      "बिहान ९ः१४ सम्म थोरै संख्यामा प्रदर्शनकारीहरू राष्ट्रिय झण्डासहित माइतीघर मण्डल क्षेत्रमा जम्मा भएका देखिन्छन्। उनीहरू भ्रष्टाचारविरूद्ध नारा लगाउँदै विद्यार्थी पोसाकमा थिए।",
    descriptionEn:
      "A small group gathers at Maitighar Mandala with the national flag, chanting anti-corruption slogans in student attire.",
    coords: [85.3206, 27.6942],
    zoom: 16.5,
    bearing: 0,
    pitch: 60,
    phase: "gathering",
    media: {
      type: "image",
      url: "/images/events/e02-gathering-maitighar.jpg",
      captionNp: "माइतीघरमा #WAKEUPNEPAL प्लेकार्डसहित जेनजी प्रदर्शनकारी",
      captionEn: "Gen Z protesters with #WAKEUPNEPAL placards at Maitighar Mandala",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Large crowd of young protesters holding WAKEUPNEPAL signs at Maitighar",
    },
  },
  {
    id: "e03",
    time: "10:00",
    timeDisplay: "१०ः००",
    descriptionNp:
      "बिहान १०ः०० सम्म माइतीघर क्षेत्रमा प्रदर्शनकारीको भीड बढ्दै गयो।",
    descriptionEn:
      "The crowd of protesters at Maitighar continues to swell.",
    coords: [85.3206, 27.6942],
    zoom: 15.5,
    bearing: 8,
    pitch: 60,
    phase: "gathering",
    media: {
      type: "image",
      url: "/images/events/e03-students-joining.jpg",
      captionNp: "#WAKEUPNEPAL प्लेकार्डसहित विद्यार्थीहरू",
      captionEn: "Students with #WAKEUPNEPAL placards joining the protest",
      credit: "छानबिन आयोग प्रतिवेदन / Investigation Commission Report",
      alt: "Young protesters holding WAKEUPNEPAL placards at the gathering",
    },
  },
  {
    id: "e04",
    time: "10:25",
    timeDisplay: "१०ः२५",
    descriptionNp:
      "१०ः२५ सम्म मण्डलको दक्षिण सडक लेनमा प्रदर्शनकारीहरू थिए भने अन्य लेनमा सवारी साधनहरू सामान्य रूपमा चलिरहेका थिए।",
    descriptionEn:
      "Protesters fill the south lanes of Mandala while traffic flows normally in adjacent lanes.",
    coords: [85.3206, 27.6940],
    zoom: 16,
    bearing: -4,
    pitch: 62,
    phase: "gathering",
    media: {
      type: "image",
      url: "/images/events/e04-crowd-grows.jpg",
      captionNp: "माइतीघरमा भीड बढ्दै",
      captionEn: "Crowd grows at Maitighar as more protesters arrive",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Growing crowd of protesters gathered at Maitighar area",
    },
  },
  {
    id: "e05",
    time: "10:52",
    timeDisplay: "१०ः५२",
    descriptionNp:
      "१०ः२७ बाट केही प्रदर्शनकारीहरू बिजुली बजारतर्फ लागेका देखिन्छन्। १०ः५२ मा नेपाल टेलिकमको कार्यालय नजिकको पोलमा रहेको तत्कालीन प्रधानमन्त्री केपी ओलीको तस्बिर देखेर प्रदर्शनकारीहरू आक्रोशित भई च्यातेका थिए।",
    descriptionEn:
      "Protesters head toward Bijuli Bazaar. Enraged by a photo of PM KP Oli on a pole near Nepal Telecom, they tear it down.",
    coords: [85.3245, 27.6930],
    zoom: 16,
    bearing: 14,
    pitch: 68,
    phase: "gathering",
    media: {
      type: "image",
      url: "/images/events/e05-bijuli-bazaar.jpg",
      captionNp: "बिजुली बजारतर्फ अघि बढ्दै प्रदर्शनकारी",
      captionEn: "Protesters marching toward Bijuli Bazaar",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Protesters marching in large numbers toward Bijuli Bazaar",
    },
  },
  {
    id: "e06",
    time: "10:58",
    timeDisplay: "१०ः५८",
    descriptionNp:
      "बिजुली बजार पुल हुँदै प्रदर्शनकारीहरूको पहिलो समूह निषेधित क्षेत्रतर्फ रहेको व्यारिकेटतर्फ बढेका थिए। ११ः०० मा उनीहरू व्यारिकेटमा सुरक्षाकर्मीसँग आमनेसामने भएका थिए।",
    descriptionEn:
      "First group crosses Bijuli Bazaar bridge toward the barricade in the restricted zone. By 11:00, they stand face-to-face with security forces.",
    coords: [85.3260, 27.6920],
    zoom: 15.5,
    bearing: 37,
    pitch: 70,
    phase: "gathering",
    isMajor: true,
    locationNp: "बिजुली बजार पुल",
    locationEn: "Bijuli Bazaar Bridge",
    media: {
      type: "image",
      url: "/images/events/e06-barricade.jpg",
      captionNp: "बिजुली बजार पुलमा प्रदर्शनकारी",
      captionEn: "Protesters reach the barricade at Bijuli Bazaar bridge",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Wide view of protest march at Bijuli Bazaar bridge",
    },
  },
  {
    id: "e07",
    time: "11:40",
    timeDisplay: "११ः४०",
    descriptionNp:
      "एभरेस्ट अस्पतालतर्फबाट केही प्रदर्शनकारीहरू प्रहरीको व्यारिकेटको पछाडितर्फ पुगेका देखिन्छन्, जसलाई सशस्त्र प्रहरीको टोलीले हटाएको थियो।",
    descriptionEn:
      "Protesters reach behind the police barricade from the Everest Hospital side. An APF team pushes them back.",
    coords: [85.3335, 27.6880],
    zoom: 15.5,
    bearing: -30,
    pitch: 72,
    phase: "escalation",
    media: {
      type: "image",
      url: "/images/events/e07-everest-hotel.jpg",
      captionNp: "एभरेस्ट होटल क्षेत्रमा झण्डासहित प्रदर्शनकारी",
      captionEn: "Protesters with flags near Everest Hotel",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Marching protesters carrying Nepali flags near Everest Hotel",
    },
  },
  {
    id: "e08",
    time: "11:47",
    timeDisplay: "११ः४७",
    descriptionNp:
      "पुनः सोही दिशाबाट अघिल्लो पटकभन्दा धेरै संख्यामा प्रदर्शनकारीहरू आएका थिए। एउटा समूहले प्रहरीको व्यारिकेट तोड्न प्रयास गरेको थियो भने अर्को समूह नयाँ बानेश्वर चोकतर्फ अघि बढेको थियो।",
    descriptionEn:
      "A much larger group arrives. One faction tries to break the barricade while another advances toward New Baneshwor Chowk.",
    coords: [85.3300, 27.6890],
    zoom: 15,
    bearing: 28,
    pitch: 70,
    phase: "escalation",
    isMajor: true,
    locationNp: "नयाँ बानेश्वर",
    locationEn: "New Baneshwor",
    media: {
      type: "image",
      url: "/images/events/e08-barricade-break.jpg",
      captionNp: "संसद भवन गेट नजिक ठूलो भीड जम्मा",
      captionEn: "Large crowd gathered near Parliament gate during escalation",
      credit: "नेपाल खबर / Nepal Khabar",
      alt: "Large crowd of protesters gathered at Parliament gate area",
    },
  },
  {
    id: "e09",
    time: "11:51",
    timeDisplay: "११ः५१",
    descriptionNp:
      "सिभिल अस्पताल पिटिजेड सिसिटिभीमा ११ः५१ मा बाइक सवारसहितको पहिलो समूह संसद भवन गेट अगाडि पुगेको देखिन्छ।",
    descriptionEn:
      "CCTV at Civil Hospital captures the first group, including bike riders, reaching the Parliament gate.",
    coords: [85.3280, 27.6878],
    zoom: 16,
    bearing: -4,
    pitch: 75,
    phase: "escalation",
    isMajor: true,
    locationNp: "संसद भवन गेट",
    locationEn: "Parliament Gate",
    media: {
      type: "image",
      url: "/images/events/e09-parliament-gate.jpg",
      captionNp: "संसद् भवन गेटमा पुगेका प्रदर्शनकारी",
      captionEn: "Protesters reach the Parliament gate area",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Dense crowd of protesters near Parliament gate",
    },
  },
  {
    id: "e10",
    time: "11:54",
    timeDisplay: "११ः५४",
    descriptionNp:
      "बिआइसिसी अगाडि रहेको सिसिटिभीमा ११ः५४ मा प्रहरीद्वारा अश्रुग्यास प्रयोग गरी भीडलाई तितरवितर बनाएको थियो।",
    descriptionEn:
      "Police deploy tear gas in front of BICC to disperse the crowd.",
    coords: [85.3280, 27.6880],
    zoom: 16,
    bearing: -11,
    pitch: 73,
    phase: "escalation",
  },
  {
    id: "e11",
    time: "11:55",
    timeDisplay: "११ः५५",
    descriptionNp:
      "भीडलाई तितरबितर पार्न प्रहरीले वाटर क्यानन प्रयोग गरेको थियो। तर, भीडले प्रहरीमाथि ढुंगा प्रहार गरेपछि प्रहरीले वाटर क्यानन र अश्रुग्यास प्रयोग गर्दै बानेश्वर चोकतर्फ पछि हटेको थियो। भीडको मुख्य जमात संसद भवनतर्फ अघि बढेको थियो।",
    descriptionEn:
      "Police deploy water cannons. Protesters retaliate with stones, forcing police to retreat toward Baneshwor Chowk. The main crowd surges toward Parliament.",
    coords: [85.3315, 27.6893],
    zoom: 15,
    bearing: -23,
    pitch: 68,
    phase: "escalation",
    isMajor: true,
    locationNp: "बानेश्वर चोक",
    locationEn: "Baneshwor Chowk",
    media: {
      type: "image",
      url: "/images/events/e11-water-cannon.jpg",
      captionNp: "संसद भवनतर्फ अघि बढ्दै प्रदर्शनकारीहरू",
      captionEn: "Protesters surging toward Parliament building",
      credit: "नेपाल खबर / Nepal Khabar",
      alt: "Large crowd of protesters advancing toward Parliament",
    },
  },
  {
    id: "e12",
    time: "11:57",
    timeDisplay: "११ः५७",
    descriptionNp:
      "वाटर क्यानन पछ्याउँदै प्रदर्शनकारीहरू मेन गेट अगाडि पुगेका थिए।",
    descriptionEn:
      "Following the retreating water cannon, protesters reach the Parliament Main Gate.",
    coords: [85.3280, 27.6878],
    zoom: 16.5,
    bearing: -20,
    pitch: 75,
    phase: "escalation",
  },
  {
    id: "e13",
    time: "12:01",
    timeDisplay: "१२ः०१",
    descriptionNp:
      "१२ः०१ मा सुरूमा दुई जना प्रदर्शनकारीहरू गेटमाथि चढेका देखिन्छन् भने सिभिल अस्पताल नजिक रहेको सिसिटिभीमा १२ः०५ मा पर्खाल चढी गेटमाथि चढेको देखिन्छ। सडकपेटीमा रहेको रेलिङ तोडेर त्यही रेलिङको सहारामा प्रदर्शनकारीहरू गेटमाथि चढेका थिए।",
    descriptionEn:
      "Two protesters climb the Parliament gate. By 12:05, more scale the wall using broken roadside railings as makeshift ladders.",
    coords: [85.3280, 27.6878],
    zoom: 17,
    bearing: -12,
    pitch: 75,
    phase: "escalation",
    isMajor: true,
    locationNp: "संसद भवन गेट",
    locationEn: "Parliament Gate",
    media: {
      type: "image",
      url: "/images/events/e13-gate-climb.jpg",
      captionNp: "प्रदर्शनकारीहरू संसद भवनको पर्खाल चढ्दै",
      captionEn: "Protesters scaling the Parliament compound wall and green metal fence",
      credit: "नेपाल खबर / Nepal Khabar",
      alt: "Protesters climbing over the Parliament compound wall and green metal fence",
    },
  },
  {
    id: "e14",
    time: "12:05",
    timeDisplay: "१२ः०५",
    descriptionNp:
      "ठूलो मात्रामा प्रदर्शनकारीहरू बिआइसिसी मेन गेट अगाडि जम्मा भइसकेका थिए। बिआइसिसी गेटमाथि रहेका प्रदर्शनकारीहरूलाई लक्षित गरी अश्रुग्यास प्रहार भएको थियो भने प्रदर्शनकारीहरूले अश्रुग्यास सेल प्रहरीतर्फ नै प्रहार गरेका थिए।",
    descriptionEn:
      "A massive crowd surrounds the BICC Main Gate. Security fires tear gas at protesters atop the gate, who hurl the canisters back.",
    coords: [85.3280, 27.6878],
    zoom: 16.5,
    bearing: -4,
    pitch: 75,
    phase: "escalation",
  },
  {
    id: "e15",
    time: "12:07",
    timeDisplay: "१२ः०७",
    descriptionNp:
      "सिभिल अस्पताल इमर्जेन्सी सिसिटिभी फुटेजमा १२ः०७ मा आँखाको तल्लो भागमा चोट लागेको विद्यार्थी पोसाकमा रहेको पहिलो घाइते इमर्जेन्सी कक्षमा प्रवेश गरेको देखिन्छ।",
    descriptionEn:
      "The first casualty — a student with an eye injury — arrives at Civil Hospital's emergency room.",
    coords: [85.3298, 27.6890],
    zoom: 16.5,
    bearing: 4,
    pitch: 70,
    phase: "escalation",
    isMajor: true,
    locationNp: "सिभिल अस्पताल",
    locationEn: "Civil Hospital",
    media: {
      type: "image",
      url: "/images/events/e15-first-casualty.jpg",
      captionNp: "संसद परिसरमा हतियार ताकेको सशस्त्र प्रहरी",
      captionEn: "Armed police officer aiming weapon inside Parliament compound",
      credit: "नेपाल खबर / Nepal Khabar",
      alt: "Armed police officer in helmet aiming tear gas launcher inside Parliament grounds",
    },
  },
  {
    id: "e16",
    time: "12:15",
    timeDisplay: "१२ः१५",
    descriptionNp:
      "बानेश्वर चोक १ सिसिटिभीमा प्रदर्शनकारीको एउटा समूह बानेश्वर चोकबाट पश्चिम गेटतर्फ लागेको थियो।",
    descriptionEn:
      "A protester group splits from Baneshwor Chowk toward Parliament's West Gate.",
    coords: [85.3265, 27.6885],
    zoom: 16,
    bearing: -53,
    pitch: 72,
    phase: "escalation",
  },
  {
    id: "e17",
    time: "12:17",
    timeDisplay: "१२ः१७",
    descriptionNp:
      "१२ः१७ बाट घाइतेहरू उपचारार्थ आउने संख्यामा वृद्धि भएको थियो।",
    descriptionEn:
      "The number of injured arriving at Civil Hospital for treatment begins to surge.",
    coords: [85.3298, 27.6890],
    zoom: 16,
    bearing: 20,
    pitch: 70,
    phase: "escalation",
  },
  {
    id: "e18",
    time: "12:29",
    timeDisplay: "१२ः२९",
    descriptionNp:
      "बिआइसिसी पिटिजेडमा १२ः२९ मा बाइक सवारको आगमन देखिन्छ भने एक जना मेन गेटतर्फबाट १२ः३३ मा पेट समात्दै आएको (सम्भावित गोली प्रहारबाट)।",
    descriptionEn:
      "Bike riders arrive at BICC. At 12:33, a person staggers from the Main Gate clutching their stomach — a likely gunshot wound.",
    coords: [85.3280, 27.6878],
    zoom: 16.5,
    bearing: -12,
    pitch: 75,
    phase: "escalation",
    isMajor: true,
    locationNp: "बिआइसिसी मेन गेट",
    locationEn: "BICC Main Gate",
  },

  // ── Phase 3: CURFEW (12:30 – 13:59) ────────────────────────────────
  {
    id: "e19",
    time: "12:30",
    timeDisplay: "१२ः३०",
    descriptionNp:
      "जिल्ला प्रशासन कार्यालय, काठमाडौंले १२ः३० बाट लागु हुने गरी कर्फ्यू आदेश जारी गरेको थियो।",
    descriptionEn:
      "CURFEW DECLARED. The Kathmandu District Administration Office issues a curfew order effective immediately.",
    coords: [85.3290, 27.6885],
    zoom: 14.5,
    bearing: 16,
    pitch: 70,
    phase: "curfew",
    media: {
      type: "image",
      url: "/images/events/e19-curfew-begins.jpg",
      captionNp: "कर्फ्यू आदेशपछिको बानेश्वर क्षेत्र",
      captionEn: "Baneshwor area after curfew order at 12:30 PM",
      credit: "बाह्रखरी / Baahrakhari",
      alt: "Scene from Baneshwor area after curfew order was issued",
    },
    isMajor: true,
    locationNp: "काठमाडौं",
    locationEn: "Kathmandu",
  },
  {
    id: "e20",
    time: "12:34",
    timeDisplay: "१२ः३४",
    descriptionNp:
      "बिआइसिसीको गेट नजिक आगजनी भएको थियो भने अनलाइनखबरको समाचार अनुसार १२ः३७ मा प्रदर्शनकारी ताक्दै गोली प्रहार भएको थियो।",
    descriptionEn:
      "Fire is set near the BICC gate. At 12:37, news reports confirm gunfire aimed directly at protesters.",
    coords: [85.3280, 27.6878],
    zoom: 16.5,
    bearing: -36,
    pitch: 75,
    phase: "curfew",
    isMajor: true,
    locationNp: "बिआइसिसी गेट",
    locationEn: "BICC Gate",
  },
  {
    id: "e21",
    time: "12:40",
    timeDisplay: "१२ः४०",
    descriptionNp:
      "बिआइसिसी पिटिजेडमा प्रहरीद्वारा मेन गेट वरपर जम्मा भएका प्रदर्शनकारीहरूलाई लक्षित गरी टियर ग्यास प्रहार भएको थियो। संसद भवन परिसरबाट गेट भित्रबाट पानीको फोहोरा प्रहार गरिएको थियो।",
    descriptionEn:
      "Tear gas blankets the Main Gate area. From inside the Parliament compound, water jets are fired through the gate.",
    coords: [85.3280, 27.6878],
    zoom: 16,
    bearing: -28,
    pitch: 75,
    phase: "curfew",
  },
  {
    id: "e22",
    time: "12:42",
    timeDisplay: "१२ः४२",
    descriptionNp:
      "प्रदर्शनकारीद्वारा प्रहरी लक्षित ढुंगा प्रहार भएको थियो भने १२ः५३ मा पर्खाल चढेर रेलिङ भाँच्न सुरू भएको थियो।",
    descriptionEn:
      "Protesters stone police at the West Gate. By 12:53, they climb the wall and begin breaking the railings.",
    coords: [85.3265, 27.6885],
    zoom: 16.5,
    bearing: -45,
    pitch: 72,
    phase: "curfew",
  },
  {
    id: "e23",
    time: "12:55",
    timeDisplay: "१२ः५५",
    descriptionNp:
      "गोली प्रहारबाट घाइतेलाई उद्धार गर्दै गरेको देखिन्छ। १२ः५५ पछि गोली प्रहारबाट घाइते प्रदर्शनकारीको संख्यामा व्यापक वृद्धि भएको थियो।",
    descriptionEn:
      "Rescuers carry away gunshot victims. After 12:55, the number of protesters injured by gunfire surges dramatically.",
    coords: [85.3285, 27.6880],
    zoom: 16,
    bearing: -2,
    pitch: 74,
    phase: "curfew",
    isMajor: true,
  },
  {
    id: "e24",
    time: "13:00",
    timeDisplay: "१३ः००",
    descriptionNp:
      "१३ः०० बाट लागू हुने गरी जिल्ला प्रशासन कार्यालय काठमाडौले कर्फ्यू क्षेत्र विस्तार गरेको थियो — राष्ट्रपतिको कार्यालय शीतलनिवास, उपराष्ट्रपतिको कार्यालय, नारायणहिटी दरबार संग्रहालय र सिंहदरबार क्षेत्र।",
    descriptionEn:
      "Curfew zone expanded to include the President's office at Shital Niwas, Vice-President's office, Narayanhiti Palace Museum, and Singha Durbar.",
    coords: [85.3290, 27.6885],
    zoom: 14,
    bearing: 16,
    pitch: 55,
    phase: "curfew",
  },
  {
    id: "e25",
    time: "13:01",
    timeDisplay: "१३ः०१",
    descriptionNp:
      "प्रदर्शनकारीद्वारा प्रहरी लक्षित गरी मोलोटोभ प्रहार भएको थियो भने १३ः०५ मा प्रहरीद्वारा मेन गेट अगाडि प्रदर्शनकारीको टाउकोमा गोली प्रहार गरेको देखिन्छ।",
    descriptionEn:
      "Protesters throw Molotov cocktails at police. At 13:05, security forces shoot a protester in the head at the Main Gate — captured on camera.",
    coords: [85.3280, 27.6878],
    zoom: 17,
    bearing: -36,
    pitch: 75,
    phase: "curfew",
    isMajor: true,
    locationNp: "संसद भवन मेन गेट",
    locationEn: "Parliament Main Gate",
  },
  {
    id: "e26",
    time: "13:09",
    timeDisplay: "१३ः०९",
    descriptionNp:
      "आन्दोलनकारीद्वारा बानेश्वर चोकमा राखिएको ट्राफिक संकेत रहेको फलामे पोलको प्रयोग गरी बिआइसीसीको पर्खाल फुटाउन सुरू गरेको थियो र केही प्रदर्शनकारी संसद परिसरमा प्रवेश गरेका थिए।",
    descriptionEn:
      "Protesters use a metal traffic-signal pole to breach the BICC compound wall. Some enter the Parliament grounds.",
    coords: [85.3270, 27.6888],
    zoom: 16.5,
    bearing: -38,
    pitch: 72,
    phase: "curfew",
    isMajor: true,
    locationNp: "बिआइसिसी पर्खाल",
    locationEn: "BICC Compound Wall",
    media: {
      type: "image",
      url: "/images/events/e26-bicc-breach.jpg",
      captionNp: "बिआइसिसी पर्खाल भत्काउँदै प्रदर्शनकारी",
      captionEn: "Protesters breaching the BICC compound wall and entering Parliament grounds",
      credit: "नेपाल खबर / Nepal Khabar",
      alt: "Protesters inside the BICC Parliament compound after breaching the wall",
    },
  },
  {
    id: "e27",
    time: "13:15",
    timeDisplay: "१३ः१५",
    descriptionNp:
      "संसद भवन परिसरमा रहेको प्रहरी लक्षित गर्दै ढुंगा प्रहार गर्दै गर्दा एक प्रदर्शनकारीलाई गोली लागी हातले बोकेर लगिएको थियो।",
    descriptionEn:
      "A protester is shot while stoning police inside the Parliament compound and is carried away by hand.",
    coords: [85.3265, 27.6885],
    zoom: 16.5,
    bearing: -45,
    pitch: 72,
    phase: "curfew",
    isMajor: true,
    locationNp: "संसद पश्चिम गेट",
    locationEn: "Parliament West Gate",
  },
  {
    id: "e28",
    time: "13:17",
    timeDisplay: "१३ः१७",
    descriptionNp:
      "अरेबिका कफी शपको सिसिटिभी अनुसार गोलीले त्यहाँको अगाडिको सिसा फुटेको देखिन्छ भने एक जना प्रदर्शनकारी खुट्टामा चोट लागेर भागिरहेको देखिन्छ।",
    descriptionEn:
      "A bullet shatters the front glass of Arabica Coffee Shop. CCTV captures a protester fleeing with a leg wound.",
    coords: [85.3290, 27.6882],
    zoom: 17,
    bearing: 23,
    pitch: 70,
    phase: "curfew",
  },
  {
    id: "e29",
    time: "13:20",
    timeDisplay: "१३ः२०",
    descriptionNp:
      "अनलाइन मिडियामा पत्रकारहरू समेत घाइते भएको समाचार आएका थिए। सिभिल अस्पतालमा गम्भीर प्रकृतिका घाइतेहरूको चाप बढेको थियो। १३ः२४ मा एक जना घाइते पत्रकार इमर्जेन्सी कक्षमा उपचारार्थ आएको देखिन्छ।",
    descriptionEn:
      "Reports emerge of journalists among the wounded. Critically injured pour into Civil Hospital. An injured journalist arrives at the ER at 13:24.",
    coords: [85.3298, 27.6890],
    zoom: 16,
    bearing: 36,
    pitch: 70,
    phase: "curfew",
  },
  {
    id: "e30",
    time: "13:32",
    timeDisplay: "१३ः३२",
    descriptionNp:
      "प्रदर्शनकारीहरूले मेन गेट अगाडि ढलेका व्यारिकेट सडकमा राखी पम्पलेटसहित प्रदर्शन गरिरहेका थिए। १३ः३४ मा नगर प्रहरीको टोली शान्त प्रदर्शनकारीतर्फ बल प्रयोग गर्दै बढेको थियो भने व्यापक रूपमा अश्रुग्यास प्रयोग गरी भीडलाई तितरबितर गरेको देखिन्छ।",
    descriptionEn:
      "Protesters display pamphlets behind fallen barricades. City Police charge peaceful demonstrators at 13:34, unleashing widespread tear gas.",
    coords: [85.3280, 27.6878],
    zoom: 16,
    bearing: -36,
    pitch: 75,
    phase: "curfew",
  },
  {
    id: "e31",
    time: "13:38",
    timeDisplay: "१३ः३८",
    descriptionNp:
      "प्रदर्शनकारीको आक्रोशित भीड एकीकृत भई प्रहरीमाथि ढुंगामुढा गरेको देखिन्छ भने १३ः४३ मा घाइते प्रदर्शनकारीको उद्धारका लागि दुई एम्बुलेन्स आएका थिए। संसद भवनको सामुन्ने रहेको लुम्बिनी तन्दुरी भोजनालय अगाडि एक जना घाइतेलाई सीपीआर दिइँदै गरेको देखिन्छ।",
    descriptionEn:
      "An enraged crowd unites to stone police. Two ambulances arrive at 13:43. CPR is administered to a casualty in front of Lumbini Tandoori restaurant, opposite Parliament.",
    coords: [85.3280, 27.6880],
    zoom: 16.5,
    bearing: -3,
    pitch: 73,
    phase: "curfew",
    isMajor: true,
    locationNp: "संसद भवन अगाडि",
    locationEn: "In front of Parliament",
  },
  {
    id: "e32",
    time: "13:40",
    timeDisplay: "१३ः४०",
    descriptionNp:
      "अनलाइनखबर डटकमले सिभिल अस्पतालमा उपचारका क्रममा एक जनाको मृत्यु भएको उल्लेख गरेको थियो भने १३ः५४ मा एक जनाको मृत्यु र ७० जना घाइते भएको समाचार प्रकाशित गरेको थियो।",
    descriptionEn:
      "First death confirmed at Civil Hospital. By 13:54, reports state 1 dead and 70 injured.",
    coords: [85.3298, 27.6890],
    zoom: 16,
    bearing: 20,
    pitch: 70,
    phase: "curfew",
    isMajor: true,
    locationNp: "सिभिल अस्पताल",
    locationEn: "Civil Hospital",
  },

  // ── Phase 4: AFTERMATH (14:00 – 18:15) ─────────────────────────────
  {
    id: "e33",
    time: "14:15",
    timeDisplay: "१४ः१५",
    descriptionNp:
      "इओएन युट्युब च्यानल अनुसार बानेश्वर चोकमा १४ः१५–१४ः३० मा एक जना विद्यार्थीलाई टाउकोमा गोली लागेको उल्लेख छ।",
    descriptionEn:
      "A student is shot in the head at Baneshwor Chowk between 14:15 and 14:30, documented by EON YouTube channel.",
    coords: [85.3315, 27.6893],
    zoom: 16,
    bearing: -7,
    pitch: 68,
    phase: "aftermath",
    isMajor: true,
    locationNp: "बानेश्वर चोक",
    locationEn: "Baneshwor Chowk",
    media: {
      type: "image",
      url: "/images/events/e33-baneshwor-aftermath.jpg",
      captionNp: "बानेश्वर क्षेत्रमा तनावग्रस्त अवस्था",
      captionEn: "Destruction and aftermath at Baneshwor Chowk",
      credit: "छानबिन आयोग प्रतिवेदन / Investigation Commission Report",
      alt: "Aftermath scene in the tense Baneshwor area",
    },
  },
  {
    id: "e34",
    time: "14:22",
    timeDisplay: "१४ः२२",
    descriptionNp:
      "सशस्त्र प्रहरीको एम्बुलेन्स मेन गेट अगाडि आइपुगेको थियो र त्यसमा सवार सशस्त्र प्रहरीहरूलाई संसद परिसर भित्र पठाई प्रदर्शनकारीहरूले एम्बुलेन्समा आगो लगाइदिएका थिए।",
    descriptionEn:
      "An APF ambulance arrives at the Main Gate. After its personnel are deployed inside Parliament, protesters set the ambulance ablaze.",
    coords: [85.3280, 27.6878],
    zoom: 16.5,
    bearing: -4,
    pitch: 75,
    phase: "aftermath",
    media: {
      type: "image",
      url: "/images/events/e34-ambulance-fire.jpg",
      captionNp: "प्रदर्शनकारीहरूले एम्बुलेन्समा आगो लगाएपछिको दृश्य",
      captionEn: "Burnt vehicle aftermath near Parliament",
      credit: "छानबिन आयोग प्रतिवेदन / Investigation Commission Report",
      alt: "Burnt ambulance and vehicle destruction near the Parliament area",
    },
  },
  {
    id: "e35",
    time: "14:50",
    timeDisplay: "१४ः५०",
    descriptionNp:
      "प्रदर्शनकारीहरू संसद भवनको दक्षिण गेटबाट हटिसकेका थिए र नयाँ बानेश्वर चोकमा केन्द्रित रही प्रदर्शन गरिरहेका थिए। नेपाल प्रहरी एवं सशस्त्र प्रहरीले संयुक्त रूपमा फर्मेसनमा ड्युटी लिएको देखिन्छ।",
    descriptionEn:
      "Protesters retreat from Parliament's south gate, concentrating at New Baneshwor Chowk. Nepal Police and APF form a joint formation.",
    coords: [85.3315, 27.6893],
    zoom: 15,
    bearing: -31,
    pitch: 68,
    phase: "aftermath",
  },
  {
    id: "e36",
    time: "15:05",
    timeDisplay: "१५ः०५",
    descriptionNp:
      "अरेबिका कफी अगाडि रहेका केही प्रदर्शनकारी मेन गेट अगाडि बढेसँगै नयाँ बानेश्वर चोकमा ठूलो संख्यामा रहेका प्रदर्शनकारीहरू समेत संसद गेटमा आइपुगेका थिए र सुरक्षाकर्मीले अश्रुग्यास लगायत प्रयोग गरेर प्रदर्शनकारीलाई तितरबितर बनाएका थिए।",
    descriptionEn:
      "Protesters from Arabica Coffee and New Baneshwor Chowk surge toward the gate again. Security forces disperse them with tear gas.",
    coords: [85.3280, 27.6878],
    zoom: 15.5,
    bearing: -28,
    pitch: 75,
    phase: "aftermath",
  },
  {
    id: "e37",
    time: "15:12",
    timeDisplay: "१५ः१२",
    descriptionNp:
      "खुट्टामा गोलीद्वारा घाइते प्रदर्शनकारी देखिन्छन् भने १५ः१३ मा केही घाइते प्रदर्शनकारीहरूलाई दुई वटा एम्बुलेन्सले उद्धार गरेको देखिन्छ।",
    descriptionEn:
      "More protesters fall with gunshot leg wounds. Two ambulances rush to evacuate the injured.",
    coords: [85.3285, 27.6880],
    zoom: 16,
    bearing: -10,
    pitch: 74,
    phase: "aftermath",
  },
  {
    id: "e38",
    time: "15:54",
    timeDisplay: "१५ः५४",
    descriptionNp:
      "नेपाली सेनाको टोली गाडीसहित संसद भवनको मेन गेटमा आइपुगेपछि नयाँ बानेश्वर चोकमा रहेका प्रदर्शनकारी सुरक्षाकर्मीहरूको फर्मेसन तोड्दै मेन गेटमा आइपुगेका थिए। १५ः५९ मा सुरक्षाकर्मीले भीडलाई तितरबितर बनाएका थिए।",
    descriptionEn:
      "The Nepal Army arrives at the Main Gate. Protesters breach the security formation, but are dispersed at 15:59.",
    coords: [85.3280, 27.6878],
    zoom: 15.5,
    bearing: -12,
    pitch: 75,
    phase: "aftermath",
    isMajor: true,
    locationNp: "संसद भवन मेन गेट",
    locationEn: "Parliament Main Gate",
  },
  {
    id: "e39",
    time: "16:05",
    timeDisplay: "१६ः०५",
    descriptionNp:
      "सुरक्षाकर्मीले संसद परिसर नजिकबाट प्रदर्शनकारीहरूलाई हटाइसकेको अवस्था देखिन्छ भने प्रदर्शनकारीको समूह पनि पातलो भइसकेको थियो।",
    descriptionEn:
      "Security forces clear the area near Parliament. The crowd thins — pockets remain near Civil Hospital, Nepal Commerce Campus, and Everest Hotel.",
    coords: [85.3290, 27.6885],
    zoom: 15,
    bearing: 16,
    pitch: 70,
    phase: "aftermath",
  },
  {
    id: "e40",
    time: "16:34",
    timeDisplay: "१६ः३४",
    descriptionNp:
      "नेपाली सेनाको टोली गाडीसहित एभरेस्ट होटेल अगाडि आएपछि त्यहाँ रहेका प्रदर्शनकारीहरूलाई प्रहरीले बिजुलीबजारतिर लखेटेको थियो।",
    descriptionEn:
      "An Army convoy arrives at Everest Hotel. Police chase the remaining protesters toward Bijuli Bazaar.",
    coords: [85.3335, 27.6880],
    zoom: 15.5,
    bearing: -46,
    pitch: 72,
    phase: "aftermath",
  },
  {
    id: "e41",
    time: "17:30",
    timeDisplay: "१७ः३०",
    descriptionNp:
      "प्रहरी सिभिल अस्पताल गेटतिर गई त्यहाँ रहेका प्रदर्शनकारीहरूलाई हटाएको थियो।",
    descriptionEn:
      "Police move to Civil Hospital gate and disperse the last remaining protesters.",
    coords: [85.3298, 27.6890],
    zoom: 15.5,
    bearing: 12,
    pitch: 70,
    phase: "aftermath",
  },
  {
    id: "e42",
    time: "18:15",
    timeDisplay: "१८ः१५",
    descriptionNp:
      "नयाँ बानेश्वर संसद परिसर क्षेत्रको अवस्था सामान्य देखिन्छ।",
    descriptionEn:
      "The New Baneshwor Parliament area returns to an eerie calm. The day's toll: 19+ dead, dozens critically wounded.",
    coords: [85.3290, 27.6885],
    zoom: 14,
    bearing: 0,
    pitch: 45,
    phase: "aftermath",
    isMajor: true,
    locationNp: "नयाँ बानेश्वर",
    locationEn: "New Baneshwor",
  },
];
