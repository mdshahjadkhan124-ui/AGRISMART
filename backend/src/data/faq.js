// Curated Hindi + English FAQ set for the keyword-matched support chatbot.
// No AI/LLM generation anywhere — see utils/faqChatbot.js for the matching
// logic. Keywords are phrases, not exact strings the user must type verbatim:
// the matcher scores on word-overlap after stripping filler words, so a
// phrase like "book expert" still matches "how do I book an expert?".
// The "hi" keyword lists deliberately mix Devanagari and romanized Hinglish
// (e.g. both "फसल सुझाव" and "fasal") since real users type both.
const FAQ_ENTRIES = [
  {
    id: 'greeting',
    keywords: {
      en: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
      hi: ['नमस्ते', 'नमस्कार', 'हैलो', 'namaste', 'namaskar', 'hi bhai'],
    },
    answer: {
      en: 'Hello! I can help with crop suggestions, fertilizer advice, disease reports, weather, soil health, booking an expert, the marketplace, government schemes, or your farm activity diary. What do you need?',
      hi: 'नमस्ते! मैं फसल सुझाव, उर्वरक सलाह, रोग रिपोर्ट, मौसम, मिट्टी स्वास्थ्य, विशेषज्ञ बुकिंग, मार्केटप्लेस, सरकारी योजनाओं या खेत डायरी में मदद कर सकता हूं। आपको क्या चाहिए?',
    },
  },
  {
    id: 'crop-suggestion',
    keywords: {
      en: [
        'crop suggestion',
        'which crop',
        'best crop',
        'suggest crop',
        'what to grow',
        'crop recommendation',
        'recommend a crop',
        'which crop to plant',
        'best crop for my soil',
      ],
      hi: [
        'फसल सुझाव',
        'कौन सी फसल',
        'फसल चुनें',
        'क्या उगाएं',
        'fasal',
        'fasal suggestion',
        'konsi fasal',
        'kaunsi fasal ugaye',
        'kya ugaye',
        'fasal ki salah',
      ],
    },
    answer: {
      en: 'Go to "Crop Suggestion" from your dashboard, enter your soil (N/P/K, pH) and climate readings, and we\'ll match you against known crop requirements.',
      hi: 'डैशबोर्ड से "Crop Suggestion" खोलें, अपनी मिट्टी (N/P/K, pH) और मौसम की जानकारी भरें — हम उपयुक्त फसलें सुझाएंगे।',
    },
  },
  {
    id: 'fertilizer-recommendation',
    keywords: {
      en: [
        'fertilizer',
        'which fertilizer',
        'urea',
        'dap',
        'nutrient deficiency',
        'fertilizer recommendation',
        'fertilizer dosage',
        'how much fertilizer',
      ],
      hi: [
        'उर्वरक',
        'खाद',
        'यूरिया',
        'डीएपी',
        'khaad',
        'khad',
        'urvarak',
        'khaad konsi',
        'kaunsi khaad',
        'khaad ki matra',
      ],
    },
    answer: {
      en: 'Open "Fertilizer Recommendation," pick one of your farms (to use its latest soil report) or enter N/P/K/pH manually, and you\'ll get a fertilizer + dosage recommendation.',
      hi: '"Fertilizer Recommendation" खोलें, अपना खेत चुनें (नवीनतम मिट्टी रिपोर्ट के लिए) या N/P/K/pH खुद भरें — आपको उर्वरक और मात्रा की सलाह मिलेगी।',
    },
  },
  {
    id: 'disease-report',
    keywords: {
      en: [
        'disease',
        'pest',
        'leaf spot',
        'sick plant',
        'infected',
        'report disease',
        'plant disease',
        'crop disease',
      ],
      hi: [
        'बीमारी',
        'रोग',
        'कीट',
        'पत्ती पर धब्बे',
        'फसल बीमार',
        'beemari',
        'bimari',
        'rog',
        'beemari ki report',
        'fasal beemar',
        'paudhe mein bimari',
      ],
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
      hi: ['मिट्टी स्वास्थ्य', 'सॉइल रिपोर्ट', 'मिट्टी परीक्षण', 'mitti', 'mitti ki jaanch', 'mitti ka test'],
    },
    answer: {
      en: 'Under a farm\'s "Soil health" tab, log a soil test (N/P/K, pH, organic carbon) and you\'ll get a 0-100 health score with plain-language recommendations.',
      hi: 'खेत के "Soil health" टैब में मिट्टी परीक्षण (N/P/K, pH, ऑर्गेनिक कार्बन) दर्ज करें — आपको 0-100 का स्वास्थ्य स्कोर और सुझाव मिलेंगे।',
    },
  },
  {
    id: 'farm-diary',
    keywords: {
      en: ['farm diary', 'activity log', 'log activity', 'sowing', 'irrigation record', 'track activities', 'farm activities'],
      hi: ['खेत डायरी', 'गतिविधि', 'khet ki diary', 'activity kaise dalen', 'sinchai record'],
    },
    answer: {
      en: 'Open a farm\'s "Activities" tab to log sowing, irrigation, fertilizing, spraying, weeding, harvesting, and soil testing — it builds a running diary of everything done on that farm.',
      hi: 'किसी खेत के "Activities" टैब में बुवाई, सिंचाई, खाद, छिड़काव, निराई, कटाई और मिट्टी परीक्षण दर्ज करें — यह उस खेत की पूरी डायरी बन जाती है।',
    },
  },
  {
    id: 'weather',
    keywords: {
      en: ['weather', 'rain', 'forecast', 'temperature', 'check weather'],
      hi: ['मौसम', 'बारिश', 'तापमान', 'पूर्वानुमान', 'mausam', 'mosam', 'baarish', 'barish', 'mausam kaise'],
    },
    answer: {
      en: 'Open any farm with a location set to see current weather and a 5-day forecast at the top of the page.',
      hi: 'किसी भी खेत को खोलें जिसमें स्थान सेट हो — पेज के ऊपर वर्तमान मौसम और 5-दिन का पूर्वानुमान दिखेगा।',
    },
  },
  {
    id: 'book-expert',
    keywords: {
      en: [
        'book expert',
        'consultation',
        'talk to expert',
        'appointment',
        'ask expert',
        'expert consultation',
        'need expert help',
      ],
      hi: ['विशेषज्ञ से बात', 'परामर्श', 'अपॉइंटमेंट', 'एक्सपर्ट बुक', 'expert', 'salah', 'expert se baat', 'expert se salah'],
    },
    answer: {
      en: 'Go to "Find an Expert," pick one, and request a consultation with your preferred date/time and what you need help with.',
      hi: '"Find an Expert" में जाएं, किसी विशेषज्ञ को चुनें और अपनी पसंदीदा तारीख/समय के साथ परामर्श का अनुरोध करें।',
    },
  },
  {
    id: 'marketplace-buy',
    keywords: {
      en: ['buy', 'marketplace', 'order', 'seeds', 'purchase', 'buy seeds', 'buy fertilizer'],
      hi: ['खरीदें', 'मार्केटप्लेस', 'ऑर्डर', 'बीज खरीदना', 'kharidna', 'beej kharidna', 'saman kharidna'],
    },
    answer: {
      en: 'Browse "Marketplace" for seeds, fertilizers, tools and more. Open a product, choose a quantity and payment method (cash on delivery or simulated online), and place your order.',
      hi: '"Marketplace" में बीज, उर्वरक, औजार आदि देखें। उत्पाद खोलें, मात्रा और भुगतान का तरीका (कैश ऑन डिलीवरी या ऑनलाइन) चुनें, और ऑर्डर करें।',
    },
  },
  {
    id: 'government-schemes',
    keywords: {
      en: ['scheme', 'subsidy', 'government', 'loan', 'insurance', 'government scheme'],
      hi: ['योजना', 'सब्सिडी', 'सरकारी', 'ऋण', 'बीमा', 'yojana', 'sarkari yojana', 'sarkari scheme', 'subsidy kaise'],
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
      hi: ['लॉगिन', 'पासवर्ड', 'रजिस्टर', 'खाता', 'साइन अप', 'account kaise banaye', 'password bhool gaya'],
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
      hi: ['मदद', 'सहायता', 'संपर्क', 'सहायता चाहिए', 'madad', 'sahayata'],
    },
    answer: {
      en: 'For anything this bot can\'t answer, book a consultation with an agricultural expert from "Find an Expert," or reach your local agricultural office.',
      hi: 'अगर यह बॉट मदद नहीं कर पा रहा, तो "Find an Expert" से किसी कृषि विशेषज्ञ से परामर्श लें, या अपने स्थानीय कृषि कार्यालय से संपर्क करें।',
    },
  },
];

const FALLBACK_ANSWER = {
  en: "I don't have an answer for that yet. Try asking about crop suggestions, fertilizer, disease reports, weather, soil health, experts, the marketplace, government schemes, or your farm diary.",
  hi: 'माफ़ करें, मेरे पास इसका जवाब नहीं है। फसल सुझाव, उर्वरक, रोग रिपोर्ट, मौसम, मिट्टी स्वास्थ्य, विशेषज्ञ, मार्केटप्लेस, सरकारी योजनाओं या खेत डायरी के बारे में पूछें।',
};

module.exports = { FAQ_ENTRIES, FALLBACK_ANSWER };
