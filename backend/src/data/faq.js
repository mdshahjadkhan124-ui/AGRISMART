// Curated Hindi + English FAQ set for the keyword-matched support chatbot.
// No AI/LLM generation anywhere — see utils/faqChatbot.js for the matching
// logic. Keep entries short and specific so keyword overlap stays precise.
const FAQ_ENTRIES = [
  {
    id: 'crop-suggestion',
    keywords: {
      en: ['crop suggestion', 'which crop', 'best crop', 'suggest crop', 'what to grow'],
      hi: ['फसल सुझाव', 'कौन सी फसल', 'फसल चुनें', 'क्या उगाएं'],
    },
    answer: {
      en: 'Go to "Crop Suggestion" from your dashboard, enter your soil (N/P/K, pH) and climate readings, and we\'ll match you against known crop requirements.',
      hi: 'डैशबोर्ड से "Crop Suggestion" खोलें, अपनी मिट्टी (N/P/K, pH) और मौसम की जानकारी भरें — हम उपयुक्त फसलें सुझाएंगे।',
    },
  },
  {
    id: 'fertilizer-recommendation',
    keywords: {
      en: ['fertilizer', 'which fertilizer', 'urea', 'dap', 'nutrient deficiency'],
      hi: ['उर्वरक', 'खाद', 'यूरिया', 'डीएपी'],
    },
    answer: {
      en: 'Open "Fertilizer Recommendation," pick one of your farms (to use its latest soil report) or enter N/P/K/pH manually, and you\'ll get a fertilizer + dosage recommendation.',
      hi: '"Fertilizer Recommendation" खोलें, अपना खेत चुनें (नवीनतम मिट्टी रिपोर्ट के लिए) या N/P/K/pH खुद भरें — आपको उर्वरक और मात्रा की सलाह मिलेगी।',
    },
  },
  {
    id: 'disease-report',
    keywords: {
      en: ['disease', 'pest', 'leaf spot', 'sick plant', 'infected', 'report disease'],
      hi: ['बीमारी', 'रोग', 'कीट', 'पत्ती पर धब्बे', 'फसल बीमार'],
    },
    answer: {
      en: 'Go to "Disease Reports," upload a clear photo of the affected leaf/plant with a symptom description. An agricultural expert will review it and reply with a diagnosis and treatment.',
      hi: '"Disease Reports" में जाएं, प्रभावित पत्ती/पौधे की साफ फोटो और लक्षण अपलोड करें। एक कृषि विशेषज्ञ इसकी समीक्षा कर निदान और उपचार बताएगा।',
    },
  },
  {
    id: 'soil-health-score',
    keywords: {
      en: ['soil health', 'health score', 'soil report', 'soil test'],
      hi: ['मिट्टी स्वास्थ्य', 'सॉइल रिपोर्ट', 'मिट्टी परीक्षण'],
    },
    answer: {
      en: 'Under a farm\'s "Soil health" tab, log a soil test (N/P/K, pH, organic carbon) and you\'ll get a 0-100 health score with plain-language recommendations.',
      hi: 'खेत के "Soil health" टैब में मिट्टी परीक्षण (N/P/K, pH, ऑर्गेनिक कार्बन) दर्ज करें — आपको 0-100 का स्वास्थ्य स्कोर और सुझाव मिलेंगे।',
    },
  },
  {
    id: 'weather',
    keywords: {
      en: ['weather', 'rain', 'forecast', 'temperature'],
      hi: ['मौसम', 'बारिश', 'तापमान', 'पूर्वानुमान'],
    },
    answer: {
      en: 'Open any farm with a location set to see current weather and a 5-day forecast at the top of the page.',
      hi: 'किसी भी खेत को खोलें जिसमें स्थान सेट हो — पेज के ऊपर वर्तमान मौसम और 5-दिन का पूर्वानुमान दिखेगा।',
    },
  },
  {
    id: 'book-expert',
    keywords: {
      en: ['book expert', 'consultation', 'talk to expert', 'appointment', 'ask expert'],
      hi: ['विशेषज्ञ से बात', 'परामर्श', 'अपॉइंटमेंट', 'एक्सपर्ट बुक'],
    },
    answer: {
      en: 'Go to "Find an Expert," pick one, and request a consultation with your preferred date/time and what you need help with.',
      hi: '"Find an Expert" में जाएं, किसी विशेषज्ञ को चुनें और अपनी पसंदीदा तारीख/समय के साथ परामर्श का अनुरोध करें।',
    },
  },
  {
    id: 'marketplace-buy',
    keywords: {
      en: ['buy', 'marketplace', 'order', 'seeds', 'purchase'],
      hi: ['खरीदें', 'मार्केटप्लेस', 'ऑर्डर', 'बीज खरीदना'],
    },
    answer: {
      en: 'Browse "Marketplace" for seeds, fertilizers, tools and more. Open a product, choose a quantity and payment method (cash on delivery or simulated online), and place your order.',
      hi: '"Marketplace" में बीज, उर्वरक, औजार आदि देखें। उत्पाद खोलें, मात्रा और भुगतान का तरीका (कैश ऑन डिलीवरी या ऑनलाइन) चुनें, और ऑर्डर करें।',
    },
  },
  {
    id: 'government-schemes',
    keywords: {
      en: ['scheme', 'subsidy', 'government', 'loan', 'insurance'],
      hi: ['योजना', 'सब्सिडी', 'सरकारी', 'ऋण', 'बीमा'],
    },
    answer: {
      en: 'Check "Government Schemes" for subsidies, loans, insurance, and training programs — search by keyword or filter by category.',
      hi: '"Government Schemes" में सब्सिडी, ऋण, बीमा और प्रशिक्षण कार्यक्रम देखें — कीवर्ड से खोजें या श्रेणी के अनुसार फ़िल्टर करें।',
    },
  },
  {
    id: 'account-help',
    keywords: {
      en: ['login', 'password', 'register', 'account', 'sign up'],
      hi: ['लॉगिन', 'पासवर्ड', 'रजिस्टर', 'खाता', 'साइन अप'],
    },
    answer: {
      en: 'Use the "Register" page to create a farmer account, or "Login" if you already have one. If you\'re stuck, contact your regional agricultural office.',
      hi: 'खाता बनाने के लिए "Register" पेज और लॉगिन के लिए "Login" उपयोग करें। समस्या होने पर अपने क्षेत्रीय कृषि कार्यालय से संपर्क करें।',
    },
  },
  {
    id: 'contact-support',
    keywords: {
      en: ['help', 'support', 'contact', 'human', 'talk to someone'],
      hi: ['मदद', 'सहायता', 'संपर्क', 'सहायता चाहिए'],
    },
    answer: {
      en: 'For anything this bot can\'t answer, book a consultation with an agricultural expert from "Find an Expert," or reach your local agricultural office.',
      hi: 'अगर यह बॉट मदद नहीं कर पा रहा, तो "Find an Expert" से किसी कृषि विशेषज्ञ से परामर्श लें, या अपने स्थानीय कृषि कार्यालय से संपर्क करें।',
    },
  },
];

const FALLBACK_ANSWER = {
  en: "I don't have an answer for that yet. Try asking about crop suggestions, fertilizer, disease reports, weather, experts, the marketplace, or government schemes — or book a consultation with an expert.",
  hi: 'माफ़ करें, मेरे पास इसका जवाब नहीं है। फसल सुझाव, उर्वरक, रोग रिपोर्ट, मौसम, विशेषज्ञ, मार्केटप्लेस या सरकारी योजनाओं के बारे में पूछें — या किसी विशेषज्ञ से परामर्श लें।',
};

module.exports = { FAQ_ENTRIES, FALLBACK_ANSWER };
