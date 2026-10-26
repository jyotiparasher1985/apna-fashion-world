// Chatbot knowledge base + route for Apna Fashion World (Devanagari Hindi replies)
const express = require("express");
const { ProductModel } = require("../models/productModel");
require("../database");

const chatRoute = express.Router();
const SITE = "https://apnafashionworld.web.app";

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalize = (msg) =>
  " " + String(msg || "").toLowerCase()
    .replace(/[?!.,;:"'`~()\[\]{}\-–—/\\]/g, " ")
    .replace(/\s+/g, " ").trim() + " ";

const HINGLISH_HINT = /\b(kya|kyun|kyu|kaise|kaisa|kaisi|kab|kahan|kahaan|hai|hain|hoga|hongi|hota|hoti|tha|thi|mujhe|mera|meri|mere|apna|apni|apne|chahiye|karna|karni|kar|karo|karein|karke|batao|bataiye|bata|dikhao|dikhaye|dikha|dikh|milta|milti|milega|milegi|mile|dena|dijiye|dedo|liye|ke|ka|ki|ko|se|me|mein|par|pe|toh|nahi|nahin|nhi|haan|han|hmm|hmmm|acha|accha|achha|theek|thik|ok|okay|oke|ji|bhai|bhaiya|didi|yaar|namaste|namaskar|dhanyavaad|shukriya|kripya|aap|aapko|tum|hum|yeh|yah|ye|vo|woh|kaun|kaunsa|kaunsi|kyunki|isliye|phir|fir|sirf|bas|sab|sabhi|kuch|sasta|sasti|daam|abhi|jab|tab|agar|aur|ya|bhi|tak|kapde|kapda|saman|kharid|paisa|paise|hello|hey|hlo|good morning|good evening|good afternoon)\b/i;
const ENGLISH_HINT = /\b(what|whats|how|when|where|why|which|who|whom|can|could|would|should|shall|do|does|did|is|are|am|was|were|will|please|plz|pls|thanks|thank|help|want|need|looking|have|has|your|you|i|im|my|me|we|us|our|it|its|about|tell|show|give|there|their|this|that|these|those)\b/i;
const isHindiMsg = (msg) => {
  const m = String(msg || "");
  if (/[\u0900-\u097F]/.test(m)) return true;
  const t = " " + m.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
  if (HINGLISH_HINT.test(t)) return true;
  // Default Hindi — sirf clearly-English structural words wale messages English me jaate hain.
  return !ENGLISH_HINT.test(t);
};

const STOPWORDS = new Set([
  "kya","kyaa","hai","hain","ho","hoga","tha","the","thi","ka","ki","ke","ko","koi","kuch","me","mein","in","is","ye","yah","vo","woh","par","pe","se","tak","bhi","to","toh","na","nahi","nahin","haan","aur","ya","batao","bataiye","bata","dikhao","dikhaye","dikh","de","do","dena","dijiye","dedo","mujhe","mera","meri","mere","aap","aapka","aapki","tum","tumhara","main","mai","hum","hamara","please","plz","pls","yaar","bhai","didi","ji","ab","abhi","phir","fir","sirf","bas","sab","sabhi","ek","do","teen","char","kuch",
  "the","a","an","is","are","was","of","for","in","on","at","to","and","or","i","my","me","you","your","this","that","it","there","here","what","which","how","when","where","can","could","would","should","do","does","did","show","tell","give","want","need","have","has","about","from","with","under","below","please","thanks","thank","all","any","some","no","yes","ok","okay","just","also","only","very","really","too","so","if","then","than",
  "product","products","item","items","catalog","catalogue","list","price","prices","cost","rate","daam","kimat","kitna","kitne","kitni","size","sizes","colour","colours","color","colors","material","fabric","brand","brands","branded","original","genuine","available","availability","stock","discount","offer","offers","deal","deals","sale","budget","cheap","sasta","sasti","order","orders","delivery","shipping","payment","payments","refund","refunds","return","returns","exchange","policy","policies","wear","wearing","fashion","clothing","clothes","kapde","kapda","saman","chij","cheez","chahiye","karna","karni","kar","karen","karein","milta","milti","milega","milegi","mile","mil","ja","jana","jata","jati","ho","hoga","honge","nahi","nahin","wala","wali","wale","ke","ka","ki","se","me","mein","par","pe","tak","bhi","aur","ya","to","toh",
  "men","mens","women","womens","woman","kid","kids","kidz","male","female","ladies","gents","purush","mahila","ladki","ladkiyon","baccha","bachche","bacchon","children","child","boys","girls",
]);
["fail","failed","deducted","placed","place","why","after","use","used","creating","without","account","multiple","an","the","can","t","n","s","rs","rupee","rupees"].forEach(w => STOPWORDS.add(w));

const ANGRY_WORDS = ["fraud","cheat","cheated","dhoka","dhokha","bakwas","bekar","worst","pathetic","useless","gussa","angry","naraz","furious","hate","terrible","bura","complaint","shikayat","scam","thug","loot","ghotala","faltu","kharab","bad","disgusting","horrible","rubbish","trash","garbage"];

function detectCategory(msg) {
  const m = " " + String(msg || "").toLowerCase() + " ";
  if (/\b(men|mens|male|gents|purush|purushon|boys)\b/.test(m)) return "men";
  if (/\b(women|womens|female|ladies|woman|lady|ladki|ladkiyon|mahila|girls)\b/.test(m)) return "women";
  if (/\b(kid|kids|kidz|child|children|baccha|bachche|bacchon)\b/.test(m)) return "kid";
  return null;
}
function detectBudget(msg) {
  const m = String(msg || "");
  const budgetIntent = /\b(sasta|sasti|cheap|affordable|budget|under|below|less|tak|se kam|kam price|low price|price range|rupees?|rs\.?|₹)\b/i.test(m);
  const matches = m.match(/\b(\d{2,6})\b/g);
  if (!matches) return null;
  if (budgetIntent) { const n = parseInt(matches[0], 10); return isNaN(n) ? null : n; }
  return null;
}
function extractProductQuery(msg) {
  const tokens = String(msg || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097F\s]/g, " ").split(/\s+/);
  const out = [];
  for (const t of tokens) { if (!t || t.length < 2) continue; if (STOPWORDS.has(t)) continue; out.push(t); }
  return out.join(" ").trim();
}
function pickLang(lang, entry) {
  if (lang === "en" && entry && entry.en) return entry.en;
  if (entry && entry.id && DEVANAGARI_REPLIES[entry.id]) return DEVANAGARI_REPLIES[entry.id];
  return entry && entry.hi ? entry.hi : (entry || "");
}

const unclearReply = { hi: "माफ़ कीजिए, मैं आपका सवाल पूरी तरह समझ नहीं पाया। कृपया product, order, payment या delivery से संबंधित अपना सवाल थोड़े अलग शब्दों में पूछें।", en: "Sorry, I didn't fully understand your question. Please rephrase it about a product, order, payment or delivery." };
const noInfoReply = { hi: "इस जानकारी की पुष्टि अभी उपलब्ध catalog या store policy से नहीं हो रही है। कृपया customer support से इसकी पुष्टि करें।", en: "I can't confirm this information from the available catalogue or store policy right now. Please verify it with customer support." };
const angryReply = { hi: "आपको हुई परेशानी के लिए हमें खेद है। मैं आपकी समस्या समझने और सही next step बताने में मदद करूँगा। कृपया समस्या का संक्षिप्त विवरण और order reference साझा करें।", en: "We're sorry for the inconvenience. I'll help you understand the issue and the right next step. Please share a brief description of the problem and your order reference." };
const productOnlyReply = { hi: "आप इस product के बारे में क्या जानना चाहते हैं—price, size, colour, availability या order करने का तरीका?", en: "What would you like to know about this product — price, size, colour, availability or how to order?" };

// Hindi responses are intentionally written in Devanagari; English queries still get English.
const DEVANAGARI_REPLIES = {
  greeting: "नमस्ते! 👋 मैं आपका शॉपिंग सहायक हूँ। 😊 बताइए, मैं आपकी क्या मदद कर सकता हूँ?",
  thanks: "आपका दिन शुभ हो! 😊 कोई और सवाल हो तो ज़रूर पूछें।",
  about_store: "अपना फैशन वर्ल्ड में आपका स्वागत है! मैं उपलब्ध फैशन उत्पाद खोजने और खरीदारी से जुड़ी जानकारी पाने में आपकी मदद कर सकता हूँ।",
  capabilities: "मैं उत्पादों, कीमतों, साइज़, रंगों, उपलब्धता, ऑर्डर, भुगतान, डिलीवरी और स्टोर की नीतियों से जुड़े सवालों में मदद कर सकता हूँ।",
  how_to_shop: "वेबसाइट पर उपलब्ध उत्पाद देखें, अपनी पसंद का उत्पाद चुनें और खरीदारी के लिए दिए गए निर्देशों का पालन करें।",
  online_store: "आप अपना फैशन वर्ल्ड की वेबसाइट पर उपलब्ध उत्पाद देख सकते हैं। ऑर्डर और ऑनलाइन भुगतान की सुविधा वेबसाइट के मौजूदा विकल्पों पर निर्भर करती है।",
  human_support: "ज़रूर! कृपया वेबसाइट पर ‘Contact Us’ या ग्राहक सहायता विकल्प देखें। संपर्क जानकारी उपलब्ध न हो, तो स्टोर से सही जानकारी की पुष्टि करें।",
  show_products: "ज़रूर! आप किस श्रेणी या उत्पाद की तलाश कर रहे हैं? उसका नाम बताइए, मैं उपलब्ध कैटलॉग में खोजने में मदद करूँगा।",
  mens: "जी! पुरुषों की श्रेणी में उपलब्ध उत्पादों में से कुछ विकल्प ये हैं:",
  womens: "जी! महिलाओं की श्रेणी में उपलब्ध उत्पादों में से कुछ विकल्प ये हैं:",
  kids: "जी! बच्चों की श्रेणी में उपलब्ध उत्पादों में से कुछ विकल्प ये हैं:",
  product_availability: "कृपया उत्पाद का नाम या लिंक भेजें। मैं कैटलॉग में उपलब्ध जानकारी के आधार पर मदद करूँगा।",
  new_arrivals: "नए उत्पाद देखने के लिए वेबसाइट का ‘New Arrivals’ या ‘Latest Products’ विभाग देखें, यदि उपलब्ध हो।",
  recommend: "बिल्कुल! बताइए कि उत्पाद किसके लिए चाहिए, किस अवसर पर पहनना है, कौन-सा साइज़ चाहिए और आपका बजट कितना है।",
  colour_availability: "कृपया उत्पाद का नाम और पसंदीदा रंग बताएं। दूसरे रंगों की पुष्टि तभी कर सकता हूँ जब उनकी जानकारी कैटलॉग में उपलब्ध हो।",
  budget_products: "अपना बजट (जैसे ₹500 या ₹1000) और उत्पाद का प्रकार बताइए—मैं कैटलॉग में खोजूँगा।",
  product_price: "कृपया उत्पाद का नाम या लिंक भेजें। मैं कैटलॉग में उपलब्ध मौजूदा कीमत बताऊँगा।",
  discount_info: "अगर उत्पाद पर छूट उपलब्ध है, तो उसकी जानकारी उत्पाद की सूची में दिखाई देगी। कृपया उत्पाद का नाम बताएं।",
  size_availability: "कृपया उत्पाद का नाम या लिंक भेजें। उपलब्ध साइज़ की पुष्टि उत्पाद की जानकारी से की जाएगी।",
  size_suggest: "अपना सीना, कमर और कूल्हे का माप तथा उत्पाद का प्रकार बताएं। साइज़ चार्ट उपलब्ध होने पर उसके अनुसार साइज़ चुनने में मदद करूँगा।",
  material_info: "कृपया उत्पाद का नाम या लिंक भेजें। कपड़े या सामग्री की जानकारी उत्पाद के विवरण में उपलब्ध होने पर बताऊँगा।",
  photos_accurate: "हम उपलब्ध उत्पाद जानकारी के आधार पर मदद करेंगे। रोशनी या स्क्रीन की सेटिंग के कारण असली रंग में थोड़ा अंतर हो सकता है।",
  branded: "कृपया उत्पाद का नाम या लिंक भेजें। ब्रांड की पुष्टि केवल उपलब्ध उत्पाद जानकारी से की जा सकती है।",
  price_change: "कीमतें बदल सकती हैं। खरीदने से पहले वेबसाइट पर दिखाई गई मौजूदा कीमत ज़रूर देखें।",
  place_order: "अपना पसंदीदा उत्पाद चुनें, उपलब्ध साइज़ और रंग चुनें, फिर वेबसाइट पर दिए गए कार्ट और चेकआउट निर्देशों का पालन करें।",
  guest_order: "यह वेबसाइट की चेकआउट सेटिंग पर निर्भर करता है। चेकआउट के समय देखें कि बिना खाता बनाए खरीदारी की सुविधा उपलब्ध है या नहीं।",
  multi_product: "अगर कार्ट की सुविधा उपलब्ध है, तो उसमें कई उत्पाद जोड़कर एक साथ चेकआउट कर सकते हैं।",
  change_order: "ऑर्डर में बदलाव स्टोर की नीति पर निर्भर करता है। कृपया जल्द ग्राहक सहायता से संपर्क करके अपना ऑर्डर नंबर दें।",
  order_failing: "कृपया उत्पाद की उपलब्धता, ज़रूरी जानकारी, डिलीवरी पता और भुगतान की स्थिति जाँचें। समस्या बनी रहे तो ग्राहक सहायता से संपर्क करें।",
  whatsapp_order: "अगर वेबसाइट पर आधिकारिक WhatsApp ऑर्डर का विकल्प दिया गया है, तो उसका उपयोग करें। अन्यथा स्टोर से उपलब्ध संपर्क माध्यम पर पुष्टि करें।",
  payment_methods: "चेकआउट पेज पर क्रेडिट कार्ड, UPI, नेट बैंकिंग और कैश ऑन डिलीवरी (COD) के विकल्प उपलब्ध हैं।",
  cod: "कैश ऑन डिलीवरी (COD) की उपलब्धता आपके ऑर्डर और स्टोर की सेटिंग पर निर्भर करती है। चेकआउट पर इसकी पुष्टि करें।",
  upi: "अगर चेकआउट पर UPI का विकल्प उपलब्ध है, तो आप उसका उपयोग कर सकते हैं।",
  payment_deducted: "भुगतान का ट्रांज़ैक्शन आईडी और समय सुरक्षित रखें। पहले ऑर्डर की स्थिति जाँचें, फिर भुगतान सेवा प्रदाता या स्टोर सहायता से संपर्क करें। दोबारा भुगतान करने से पहले स्थिति की पुष्टि करें।",
  payment_secure: "केवल वेबसाइट पर दिए गए अधिकृत भुगतान विकल्प का उपयोग करें। अपना OTP, UPI PIN या पासवर्ड किसी के साथ साझा न करें।",
  invoice: "इनवॉइस की उपलब्धता ऑर्डर और स्टोर की बिलिंग व्यवस्था पर निर्भर करती है। ऑर्डर की पुष्टि या खाते में ऑर्डर विवरण देखें।",
  delivery_time: "डिलीवरी का अनुमानित समय शिपिंग नीति, आपके पते और ऑर्डर की जानकारी पर निर्भर करता है। चेकआउट या ऑर्डर की पुष्टि में दिया गया समय देखें।",
  delivery_india: "डिलीवरी की उपलब्धता जानने के लिए चेकआउट पर अपना PIN कोड दर्ज करें।",
  shipping_charges: "शिपिंग शुल्क की जानकारी चेकआउट या स्टोर की शिपिंग नीति में देखें। पुष्टि न हो तो ग्राहक सहायता से पूछें।",
  track_order: "अगर ट्रैकिंग की सुविधा उपलब्ध है, तो ऑर्डर की पुष्टि वाला संदेश या ट्रैकिंग लिंक देखें।",
  order_delayed: "ऑर्डर की पुष्टि और ट्रैकिंग स्थिति जाँचें। अनुमानित समय से अधिक देरी हो तो ग्राहक सहायता से संपर्क करें।",
  change_address: "शिपिंग से पहले पता बदलना संभव हो सकता है, लेकिन यह स्टोर की नीति पर निर्भर करता है। तुरंत ग्राहक सहायता से संपर्क करें।",
  unavailable_at_delivery: "कूरियर के डिलीवरी निर्देश देखें। सुविधा उपलब्ध हो तो कूरियर से दोबारा डिलीवरी की व्यवस्था पूछें।",
  return_policy: "वापसी की पात्रता, समय-सीमा और शर्तों की पुष्टि स्टोर की आधिकारिक रिटर्न नीति से करें।",
  exchange: "एक्सचेंज की सुविधा उत्पाद की श्रेणी और स्टोर की नीति पर निर्भर करती है। कृपया आधिकारिक नीति देखें।",
  damaged_product: "हमें खेद है। उत्पाद, पैकेजिंग और शिपिंग लेबल की तस्वीरें सुरक्षित रखें। ऑर्डर नंबर के साथ ग्राहक सहायता से संपर्क करें।",
  wrong_product: "मिले हुए उत्पाद, पैकेजिंग और ऑर्डर की तस्वीरें व जानकारी सुरक्षित रखें और समस्या स्टोर सहायता को भेजें।",
  cancel_order: "अगर रद्द करने की सुविधा उपलब्ध है, तो ऑर्डर विवरण में विकल्प देखें या शिपिंग से पहले ग्राहक सहायता से संपर्क करें।",
  refund_time: "रिफंड का समय स्टोर की नीति, भुगतान के तरीके और भुगतान सेवा प्रदाता पर निर्भर करता है। ग्राहक सहायता से रिफंड की स्थिति की पुष्टि करें।",
  return_after_use: "इस्तेमाल किए गए उत्पाद की वापसी स्टोर की नीति पर निर्भर करती है। खरीदारी की आधिकारिक वापसी शर्तें देखें।",
  refund_not_arrived: "रिफंड संदर्भ संख्या और मूल भुगतान की जानकारी सुरक्षित रखें। पहले बैंक स्टेटमेंट जाँचें, फिर स्टोर या भुगतान सेवा प्रदाता से संपर्क करें।",
  unhappy_purchase: "आपको हुई परेशानी के लिए खेद है। कृपया ऑर्डर नंबर और समस्या का विवरण दें, ताकि सहायता टीम आपकी मदद कर सके।",
  out_of_stock: "दोबारा स्टॉक आने की तारीख तभी बता सकते हैं जब स्टोर इसकी पुष्टि करे। कृपया बाद में उत्पाद की सूची देखें।",
  bulk_order: "थोक ऑर्डर पर छूट स्टोर पर निर्भर करती है। मात्रा और उत्पाद की जानकारी के साथ ग्राहक सहायता से पूछें।",
  custom_request: "कस्टम साइज़ या डिज़ाइन उपलब्ध है या नहीं, इसकी पुष्टि स्टोर से करनी होगी। उत्पाद और बदलाव की जानकारी साझा करें।",
  forgot_password: "अगर खाते की सुविधा उपलब्ध है, तो लॉगिन पेज पर ‘Forgot Password’ विकल्प चुनें।",
  login_issue: "अपना ईमेल या मोबाइल नंबर जाँचें। पासवर्ड रीसेट का विकल्प आज़माएँ; समस्या बनी रहे तो ग्राहक सहायता से संपर्क करें।",
  report_issue: "स्क्रीनशॉट, पेज का लिंक और समस्या दोहराने के चरण नोट करें। यह जानकारी वेबसाइट सहायता को भेजें।",
  account_create: "नया खाता बनाने के लिए ‘Sign Up’ पेज खोलें: " + SITE + "/signup । लॉगिन के लिए: " + SITE + "/login",
  cart_info: "उत्पाद पेज पर ‘Add to Cart’ दबाएँ। कार्ट में मात्रा बदलकर चेकआउट कर सकते हैं (लॉगिन ज़रूरी है): " + SITE + "/cart",
  wishlist_info: "उत्पाद पेज पर दिल के निशान को दबाकर उसे विशलिस्ट में जोड़ें। सेव किए उत्पाद देखने के लिए लॉगिन के बाद यह पेज खोलें: " + SITE + "/wishlist",
  offers: "नए ऑफ़र और सौदे देखने के लिए होमपेज के बैनर देखें: " + SITE + " । किसी उत्पाद की छूट जानने के लिए उसका नाम बताएं।",
  unclear: unclearReply.hi,
  product_only: productOnlyReply.hi,
};

function productNotFoundReply(lang) {
  if (lang === "en") return `I couldn't find a matching product in the catalogue right now. You can browse: Men (${SITE}/men), Women (${SITE}/women), Kids (${SITE}/kid). Send me a product name/link and I'll look it up.`;
  return `इस नाम से कैटलॉग में फिलहाल कोई उत्पाद नहीं मिला। श्रेणियाँ देखें: पुरुष (${SITE}/men), महिलाएँ (${SITE}/women), बच्चे (${SITE}/kid)। उत्पाद का नाम या लिंक भेजें, मैं उसकी जानकारी खोजूँगा।`;
}

async function searchProducts({ q, category, limit = 4 }) {
  const filter = {};
  if (category) filter.category = category;
  const words = q ? q.split(" ").filter(w => w.length >= 3).map(escapeRegex) : [];
  if (words.length) filter.title = { $regex: words.join("|"), $options: "i" };
  try {
    let items = await ProductModel.find(filter).limit(120).lean();
    if (words.length >= 2) {
      const rawWords = q.split(" ").filter(w => w.length >= 3);
      const allMatch = items.filter(p => rawWords.every(w => new RegExp(escapeRegex(w), "i").test(p.title || "")));
      if (allMatch.length > 0) items = allMatch;
    }
    items.sort((a, b) => (parseFloat(b.rating || 0) || 0) - (parseFloat(a.rating || 0) || 0));
    return items.slice(0, limit);
  } catch (e) { return []; }
}
function priceOf(p) {
  const d = String((p && p.discountPrice) || "");
  if (/%/.test(d)) { const o = parseFloat(String((p && p.orginalPrice) || "").replace(/[^0-9.]/g, "")); return isNaN(o) ? null : o; }
  const n = parseFloat(d.replace(/[^0-9.]/g, ""));
  if (!isNaN(n) && n > 0) return n;
  const o = parseFloat(String((p && p.orginalPrice) || "").replace(/[^0-9.]/g, ""));
  return isNaN(o) ? null : o;
}
function formatProducts(items, kind, lang, category) {
  const isHi = lang === "hi";
  const lines = items.map((p, i) => {
    const bad = /%/.test(String(p.discountPrice || ""));
    const price = bad ? (p.orginalPrice ? `₹${p.orginalPrice}` : "") : (p.discountPrice ? `₹${p.discountPrice}` : "");
    const orig = (!bad && p.orginalPrice && p.orginalPrice !== p.discountPrice) ? ` (मूल ₹${p.orginalPrice})` : "";
    const off = p.discount ? ` ${p.discount}` : (bad ? ` ${p.discountPrice}` : "");
    const brand = p.brand ? p.brand + " — " : "";
    return `${i + 1}. ${brand}${p.title}${price ? " — " + price : ""}${orig}${off}`;
  }).join("\n");
  const linkLine = items.length === 1
    ? `${isHi ? "उत्पाद का पेज" : "Product page"}: ${SITE}/${items[0].category}/${items[0]._id}`
    : `${isHi ? "पूरी श्रेणी देखें" : "Full list / category page"}: ${SITE}/${category || items[0].category}`;
  let intro = "";
  if (kind === "price") intro = isHi ? "मौजूदा कीमत:" : "Here's the current price:";
  else if (kind === "discount") intro = isHi ? "छूट की जानकारी:" : "Discount info:";
  else if (kind === "availability") intro = isHi ? "यह उत्पाद कैटलॉग में उपलब्ध है:" : "Yes, this product is in our catalogue:";
  else if (kind === "colour") intro = isHi ? "इस रंग से मिलते-जुलते उत्पाद:" : "Matching products found:";
  else if (kind === "branded") intro = isHi ? "ब्रांड की जानकारी:" : "Brand info:";
  else if (kind === "browse") intro = isHi ? "कुछ लोकप्रिय विकल्प:" : "Top picks:";
  else if (kind === "budget") intro = isHi ? "आपके बजट में ये विकल्प हैं:" : "Options in your budget:";
  else if (kind === "recommend") intro = isHi ? "ये विकल्प देखें:" : "Check these out:";
  else if (kind === "material") intro = isHi ? "उत्पाद की जानकारी:" : "Product details:";
  else intro = isHi ? "उत्पाद मिले:" : "Products found:";
  return `${intro}\n${lines}\n\n${linkLine}`;
}

const INTENTS = [
  { id: "greeting", hi: "नमस्ते! 👋 मैं आपका shopping assistant हूँ। 😊 बताइए, मैं आपकी क्या मदद कर सकता हूँ?", en: "Namaste! 👋 I'm your shopping assistant. 😊 How can I help you today?", keywords: ["hi","hello","hey","namaste","namaskar","good morning","good evening","good afternoon","hii","hiii","hey there","kaise ho","start"] },
  { id: "thanks", hi: "आपका दिन शुभ हो! 😊 और कोई सवाल हो तो बताइए।", en: "You're welcome! 😊 Feel free to ask anything else.", keywords: ["thanks","thank you","thankx","thx","dhanyavaad","dhanyawad","shukriya","thank u","thanks a lot"] },
  { id: "ack", hi: "ठीक है! 😊 और कुछ मदद चाहिए तो बताइए — products, order, payment या delivery से जुड़ा कोई भी सवाल पूछ सकते हैं।", en: "Okay! 😊 Let me know if you need anything else — products, orders, payment or delivery, anything at all.", keywords: ["ok","okay","oke","hmm","hmmm","acha","achha","accha","theek","thik","thik hai","sahi hai","fine","alright","haan","haan ji","han ji","yes","yeah","yep","done","ok done"] },
  { id: "about_store", hi: "Apna Fashion World में आपका स्वागत है! मैं आपको उपलब्ध fashion products खोजने और shopping से संबंधित जानकारी प्राप्त करने में मदद कर सकता हूँ।", en: "Welcome to Apna Fashion World! I can help you find available fashion products and get shopping-related information.", keywords: ["what is apna fashion world","apna fashion world kya hai","about apna fashion world","tum kaun ho","aap kaun ho","who are you","what are you","about you","what is this website","ye website kya hai","site ke bare me","store ke bare me","what is this store","apna fashion world kya hai"] },
  { id: "capabilities", hi: "मैं products, prices, sizes, colours, stock availability, orders, payments, delivery और store policies से संबंधित सवालों में मदद कर सकता हूँ।", en: "I can help with questions about products, prices, sizes, colours, stock availability, orders, payments, delivery and store policies.", keywords: ["what can you do","what can you help","how can you help","kya help kar sakte","madad kar sakte ho","kya kar sakte ho","what do you do","help me with what","aap kya jaante ho","kya kya kar sakte ho"] },
  { id: "how_to_shop", hi: "वेबसाइट पर उपलब्ध products देखें, अपनी पसंद का product चुनें और website पर दिए गए shopping instructions को follow करें।", en: "Browse the available products on the website, pick your favourite and follow the shopping instructions given on the site.", keywords: ["how to shop","how can i shop","shopping kaise kare","shopping kaise","kharidna kaise","kaise kharidu","how to buy","buy kaise kare","purchase kaise","kaise kharidein","shopping kaise karte hain"] },
  { id: "online_store", hi: "आप Apna Fashion World की वेबसाइट पर उपलब्ध products देख सकते हैं। Order placement और online payment की उपलब्धता website के वर्तमान features पर निर्भर करती है।", en: "You can view available products on the Apna Fashion World website. Order placement and online payment depend on the website's current features.", keywords: ["online store","online shopping","online hai","is this online","online shop","do you sell online","online available hai","online kharid sakte","website par order"] },
  { id: "human_support", hi: "ज़रूर! कृपया website के Contact Us या customer support विकल्प का उपयोग करें। यदि contact details उपलब्ध नहीं हैं, तो मैं आपको सही संपर्क जानकारी की पुष्टि करने का सुझाव दूँगा।", en: "Of course! Please use the Contact Us or customer support option on the website. If contact details aren't available, I'll suggest verifying the right contact information.", keywords: ["real person","human agent","human se baat","insaan se baat","insaan","live agent","agent se baat","customer care se baat","representative","baat karni hai","human help","person se baat","customer support team","contact support","insaan se baat karni hai","human support","customer care number","customer care do","support number","contact number","phone number","helpline","customer care number do","support number do"] },
  { id: "show_products", catalog: true, searchKind: "browse", hi: "ज़रूर! आप जिस category या product की तलाश कर रहे हैं, उसका नाम बताइए। मैं उपलब्ध catalog के अनुसार खोजने में मदद करूँगा।", en: "Sure! Tell me the category or product you're looking for and I'll help you search the available catalogue.", keywords: ["show me all products","all products","sab products","products dikhao","catalog","sare products","list products","kya kya hai","kya kya products","show products","product list","sab dikhao","sab kuch dikhado","sab dikhado","available products","sare products dikhao"] },
  { id: "mens", catalog: true, searchKind: "browse", hi: "Ji! Men's category me filhaal products uplabdh hain. Kuch top picks dekhiye:", en: "Yes! Here are some top picks from our Men's category:", keywords: ["men clothing","mens clothing","men wear","mens wear","men ke kapde","men section","gents","gents wear","men ka saman","men fashion","men's clothing","men's wear","purush ke kapde","boys clothing","male clothing","men ke liye"] },
  { id: "womens", catalog: true, searchKind: "browse", hi: "Ji! Women's category me filhaal products uplabdh hain. Kuch top picks dekhiye:", en: "Yes! Here are some top picks from our Women's category:", keywords: ["women clothing","womens clothing","women wear","women's clothing","women's wear","ladies","ladies wear","women ke kapde","mahila ke kapde","girl ke kapde","female clothing","womens","women section","women ke liye","girls clothing"] },
  { id: "kids", catalog: true, searchKind: "browse", hi: "Ji! Kids category me filhaal products uplabdh hain. Kuch top picks dekhiye:", en: "Yes! Here are some top picks from our Kids category:", keywords: ["kids clothing","kid clothing","kids wear","kid's clothing","kids' clothing","bacchon ke kapde","bachche ke kapde","children clothing","child clothing","kids section","kids ke liye","bacchon ka saman","boys kids","girls kids"] },
  { id: "product_availability", catalog: true, searchKind: "availability", hi: "कृपया product का नाम या link भेजें। मैं उपलब्ध product information के आधार पर मदद करूँगा।", en: "Please send the product name or link. I'll help based on the available product information.", keywords: ["is this product available","product available","available hai","stock hai","in stock","available kya","mil jayega","milta hai kya","available nahi","is it available","availability","stock available","product mil jayega","yeh product available"] },
  { id: "new_arrivals", hi: "Latest collection या नए products देखने के लिए website का New Arrivals या Latest Products section देखें, यदि उपलब्ध हो।", en: "To see the latest collection or new products, check the New Arrivals or Latest Products section on the website, if available.", keywords: ["new arrivals","new arrival","latest products","naye products","naya collection","new collection","latest collection","naye kapde","what's new","whats new","new products","latest arrivals","naya aaya"] },
  { id: "recommend", catalog: true, searchKind: "recommend", hi: "बिल्कुल! बताइए कि आपको किसके लिए, किस occasion पर, किस size और कितने budget में product चाहिए।", en: "Sure! Tell me the occasion, size and budget you have in mind.", keywords: ["recommend","suggest","recommend something","suggest something","kuch suggest karo","kuch dikhao","kuch recommend","best products","top products","kya lelu","kya lu","kya kharedu","kharidne ke liye suggest","recommendations","suggest me","help me choose","pasand nahi aaye kuch naya","kya lena chahiye","dikhao kuch"] },
  { id: "colour_availability", catalog: true, searchKind: "colour", hi: "कृपया product का नाम और पसंदीदा colour बताएं। दूसरे colours तभी confirm किए जा सकते हैं जब उनकी जानकारी catalog में उपलब्ध हो।", en: "Please share the product name and your preferred colour. Other colours can only be confirmed if that information is in the catalogue.", keywords: ["another colour","dusra colour","do you have this in another colour","red colour","colour milega","color available","kaunse colour","koi aur colour","colour options","color options","colour hai","color hai","colour milta","colour milega","red colour milega","colour available hai"] },
  { id: "budget_products", catalog: true, searchKind: "budget", hi: "Bataiye aapka budget (jaise ₹500 ya ₹1000) aur kis type ke product — main catalog me search kar dunga.", en: "Tell me your budget (e.g. ₹500 or ₹1000) and product type — I'll search the catalogue.", keywords: ["sasta kuch dikhao","sasta","sasti cheez","cheap","affordable","kam price","low budget","budget","under","below","less than","tak ke","saste me","sasta kuch","budget me","budget products","low price"] },
  { id: "product_price", catalog: true, searchKind: "price", hi: "कृपया product का नाम या link भेजें। मैं catalog में उपलब्ध वर्तमान price के अनुसार जानकारी देने में मदद करूँगा।", en: "Please send the product name or link. I'll help with the current price available in the catalogue.", keywords: ["price kya hai","price batao","price kya","kitne ka","kitna hai","cost","rate","daam","kimat","how much","kitne ka hai","kitne ka hai ye","price list","price kya h","what is the price","price kitna","price kitni","price kya hai ye","kitne ka hoga"] },
  { id: "discount_info", catalog: true, searchKind: "discount", hi: "यदि product पर discount उपलब्ध है, तो उसकी जानकारी product listing में दिखाई दे सकती है। कृपया product का नाम बताएं।", en: "If a discount is available on the product, it will show in the product listing. Please share the product name.", keywords: ["discount","discount hai","any discount","sale","off","chhoot","coupon","promo code","voucher","kitna discount","discount kitna","discount milta","coupon code","promo","offer code","discounted price","discounted"] },
  { id: "size_availability", hi: "Product का नाम या link भेजें। उपलब्ध sizes की पुष्टि product की size information से की जाएगी।", en: "Please send the product name or link. Available sizes can be confirmed from the product's size information.", keywords: ["size","sizes","size chart","meri size","size mil jayegi","available sizes","size kya hai","size hai","what size","sizes available","kaunse size","size available","size milega","size kaunsa","size milta","size milegi","size chart kya","size guide"] },
  { id: "size_suggest", hi: "अपनी chest, waist, hip measurements और product type बताएं। यदि product की size chart उपलब्ध है, तो उसके अनुसार size चुनने में मदद करूँगा।", en: "Share your chest, waist and hip measurements along with the product type. If a size chart is available, I'll help you choose accordingly.", keywords: ["size suggest","suggest my size","size kaunsi","kaunsi size","which size","size confusion","size pata nahi","measurements","chest","waist","hip","measurement bata du","meri size pata nahi","size suggest karo","size kya lunga","size kya lungi","sahi size","size chart suggest"] },
  { id: "material_info", catalog: true, searchKind: "material", hi: "Product का नाम या link भेजें। Fabric या material की जानकारी product description में उपलब्ध होने पर बताई जाएगी।", en: "Please send the product name or link. Fabric/material information will be shared if available in the product description.", keywords: ["material","fabric","kis cheez ka bana","made of","cloth material","quality","fabric quality","kya material","kis fabric","kapda kya","material kya hai","fabric kya hai","quality kaisi","quality kya"] },
  { id: "photos_accurate", hi: "हम product की उपलब्ध जानकारी के आधार पर मदद करेंगे। वास्तविक रंग में lighting या screen settings के कारण थोड़ा अंतर हो सकता है।", en: "We'll help based on the available product information. Actual colour may vary slightly due to lighting or screen settings.", keywords: ["photos accurate","photo real hai","picture accurate","photo sahi hai","images real","photo kaisi hai","actual photo","photo real","image real","photo same","photo jaisi"] },
  { id: "branded", catalog: true, searchKind: "branded", hi: "कृपया product का नाम या link भेजें। Brand की पुष्टि केवल उपलब्ध product information से की जा सकती है।", en: "Please send the product name or link. Brand can only be confirmed from the available product information.", keywords: ["branded","brand","original brand","brand kya hai","konsa brand","which brand","brand hai","branded hai","original","genuine","authentic","first copy","brand name","kaunsa brand","brand ka naam"] },
  { id: "price_change", hi: "Prices बदल सकते हैं। कृपया खरीदने से पहले website पर दिखाया गया वर्तमान price देखें।", en: "Prices may change. Please check the current price shown on the website before buying.", keywords: ["price change","price badlega","price badal","price increase","will the price change","price badh jayega","price fluctuate","price change hoga","price kab badlega"] },
  { id: "place_order", hi: "अपना पसंदीदा product चुनें, उपलब्ध size और colour select करें और website पर दिए गए cart तथा checkout instructions follow करें।", en: "Choose your favourite product, select the available size and colour, and follow the cart and checkout instructions on the website.", keywords: ["place order","order kaise","order kaise kare","order kaise karen","kaise order","order karne ka tarika","how to order","order place","buy kaise","kharid kaise","order karna hai","order karna chahta","want to order","order kar du","place an order","order kaise place","order kaise karna","kaise order kare"] },
  { id: "guest_order", hi: "यह website की checkout settings पर निर्भर करता है। Checkout पर देखें कि guest checkout उपलब्ध है या account बनाना जरूरी है।", en: "This depends on the website's checkout settings. Check at checkout whether guest checkout is available or an account is required.", keywords: ["without account","without creating account","without creating","without an account","guest","guest checkout","guest order","guest user","account ke bina","bina account","bina login","without login","bina signup","without signup","without registration"] },
  { id: "multi_product", hi: "यदि cart feature उपलब्ध है, तो आप उसमें कई products जोड़कर checkout कर सकते हैं।", en: "If the cart feature is available, you can add multiple products to it and check out.", keywords: ["multiple products","many products","ek se jyada","ek saath order","multiple items","alag alag products","saare products ek saath","one order many","kai products","ek order me kai","multiple items ek saath","kai items ek saath"] },
  { id: "change_order", hi: "Order modification की सुविधा store policy पर निर्भर करती है। जल्दी से customer support से संपर्क करें और अपना order number दें।", en: "Order modification depends on store policy. Contact customer support quickly and share your order number.", keywords: ["change my order","order change","order modify","modify order","order edit","order badalna hai","order me badlav","order update karna","change order","order ko change","order modification"] },
  { id: "order_failing", hi: "कृपया product availability, required fields, delivery address और payment status जाँचें। समस्या बनी रहने पर support से संपर्क करें।", en: "Please check product availability, required fields, delivery address and payment status. If the problem persists, contact support.", keywords: ["can't place order","cannot place order","order place nahi ho raha","order nahi ho raha","order fail","checkout nahi ho raha","order place karne me problem","unable to place","order nahi ho raha hai","order error","checkout error","order nahi ho raha hai kya","why can't i place my order","why can't i","can't place","unable to order","order place nahi"] },
  { id: "whatsapp_order", hi: "यदि website पर official WhatsApp ordering option दिया गया है, तो उसका उपयोग करें। अन्यथा उपलब्ध contact method से store से पुष्टि करें।", en: "If an official WhatsApp ordering option is on the website, use it. Otherwise confirm with the store through the available contact method.", keywords: ["whatsapp par order","order by whatsapp","whatsapp se order","whatsapp order","whatsapp par kharid","whatsapp se kharid","whatsapp ordering"] },
  { id: "payment_methods", hi: "Checkout page par abhi Credit Card, UPI, Net Banking aur Cash on Delivery (COD) ke options uplabdh hain.", en: "The checkout page currently offers Credit Card, UPI, Net Banking and Cash on Delivery (COD) options.", keywords: ["payment methods","payment options","payment kaise","pay kaise","payment karne ka tarika","which payment","how to pay","payment mode","pay karu","payment karu","paise kaise","payment method kya","payment kaunsa","payment options kya"] },
  { id: "cod", hi: "Cash on Delivery (COD) की उपलब्धता आपके order और store settings पर निर्भर करती है। Checkout पर इसकी पुष्टि करें।", en: "Cash on Delivery (COD) availability depends on your order and store settings. Please confirm it at checkout.", keywords: ["cod","cash on delivery","cod hai","cod available","cod kar sakte","cod option","cod milta","cod uplabdh","cod available hai","cash on delivery hai"] },
  { id: "upi", hi: "यदि checkout पर UPI विकल्प उपलब्ध है, तो आप उसका उपयोग कर सकते हैं।", en: "If the UPI option is available at checkout, you can use it.", keywords: ["upi","upi se payment","google pay","gpay","phonepe","paytm","upi id","upi accepted","upi payment","upi se pay","upi milta"] },
  { id: "payment_deducted", hi: "कृपया payment transaction ID और समय सुरक्षित रखें। पहले order status जाँचें, फिर payment provider या store support से संपर्क करें। दोबारा भुगतान करने से पहले स्थिति की पुष्टि करें।", en: "Please keep your payment transaction ID and time safe. First check order status, then contact the payment provider or store support. Confirm the status before paying again.", keywords: ["payment deducted","amount deducted","paisa kat gaya","paise kat gaye","payment deducted but order","money deducted","payment ho gaya order nahi","amount deducted but","payment cut gaya","double payment","do baar payment","payment deducted but order not","payment kat gaya order nahi","payment fail","payment failed","payment nahi hua","payment fail ho gaya","payment failed ho gaya","payment issue","payment problem","payment was deducted","order was not placed","deducted but","payment deducted but"] },
  { id: "payment_secure", hi: "केवल website पर उपलब्ध अधिकृत payment gateway का उपयोग करें। अपना OTP, UPI PIN या password किसी के साथ साझा न करें।", en: "Use only the authorised payment gateway available on the website. Never share your OTP, UPI PIN or password with anyone.", keywords: ["payment secure","safe hai","online payment safe","is payment safe","secure hai","payment safe","safe hai kya","website secure","payment secure hai","safe payment","secure payment"] },
  { id: "invoice", hi: "Invoice की उपलब्धता order और store billing system पर निर्भर करती है। Order confirmation या account के order details section में जाँचें।", en: "Invoice availability depends on the order and store billing system. Check order confirmation or your account's order details section.", keywords: ["invoice","bill","receipt","gst bill","invoice chahiye","bill chahiye","bill bhejo","invoice bhejo","tax invoice","receipt chahiye"] },
  { id: "delivery_time", hi: "Delivery का अनुमानित समय shipping policy, delivery location और order details पर निर्भर करता है। Checkout या order confirmation में दिया गया समय देखें।", en: "Estimated delivery time depends on shipping policy, delivery location and order details. Check the time shown at checkout or in order confirmation.", keywords: ["delivery time","how long delivery","kitne din","delivery kitne","how long does delivery","delivery kab hogi","delivery time kitna","deliver kab","kab milega","delivery duration","shipping time","delivery me kitna time","kitne dino me","delivery kab tak","delivery me kitne din"] },
  { id: "delivery_india", hi: "Delivery locations की पुष्टि checkout पर अपना PIN code दर्ज करके करें।", en: "Confirm delivery locations by entering your PIN code at checkout.", keywords: ["across india","all india","pan india","india bhar","deliver to india","delivery india","poore india","do you deliver","deliver karte ho","delivery kahan tak","delivery available hai","sheher me delivery","mere sheher me delivery","delivery hogi kya","mere area me delivery"] },
  { id: "shipping_charges", hi: "Shipping charges की जानकारी checkout पर या store की shipping policy में उपलब्ध होनी चाहिए।", en: "Shipping charges information should be available at checkout or in the store's shipping policy.", keywords: ["shipping charges","delivery charges","shipping charge","delivery charge","shipping fee","delivery fee","shipping cost","delivery cost","free delivery","free shipping","shipping charges kitne","delivery charges kitne","delivery free","shipping free","free delivery hai","free shipping hai"] },
  { id: "track_order", hi: "यदि tracking सुविधा उपलब्ध है, तो order confirmation या tracking link का उपयोग करें।", en: "If tracking is available, use the order confirmation or tracking link.", keywords: ["track","tracking","track my order","order status","mera order kahan","order kahan hai","where is my order","order kaha hai","order kab aayega","awb","tracking link","track order","track karna","order status kya","mera order kahan hai","kahan hai mera order","shipment","track my parcel","parcel track"] },
  { id: "order_delayed", hi: "अपना order confirmation और tracking status जाँचें। Delivery अनुमान से अधिक देर होने पर customer support से संपर्क करें।", en: "Check your order confirmation and tracking status. If delivery is delayed beyond the estimate, contact customer support.", keywords: ["order delayed","late delivery","order late","der se aa raha","order der","delayed","delivery late ho gayi","order nahi aaya","abhi tak nahi aaya","order stuck","late ho gaya","still not delivered","not delivered","delivery late","order late aa raha"] },
  { id: "change_address", hi: "Shipping से पहले address बदलना संभव हो सकता है, लेकिन यह store policy पर निर्भर करता है। तुरंत support से संपर्क करें।", en: "Changing the address before shipping may be possible, but it depends on store policy. Contact support immediately.", keywords: ["change delivery address","address change","address badalna","change address","delivery address change","address update","naya address","address galat","wrong address","pincode change","address change karna","shipping address change","change my delivery address","change my address","my delivery address"] },
  { id: "unavailable_at_delivery", hi: "Courier द्वारा दिए गए delivery instructions follow करें या उपलब्ध होने पर courier से पुनः delivery की व्यवस्था पूछें।", en: "Follow the delivery instructions given by the courier, or ask the courier to arrange redelivery if available.", keywords: ["not at home","unavailable at delivery","ghar par nahi hounga","out of town","delivery ke time","main available nahi","missed delivery","courier ne nahi diya","missed delivery","delivery miss","ghar par nahi","delivery time nahi"] },
  { id: "return_policy", hi: "Return eligibility, time limit और conditions की पुष्टि store की official Return Policy से करें।", en: "Confirm return eligibility, time limit and conditions from the store's official Return Policy.", keywords: ["return policy","return kaise","how to return","return kar sakte","return karne ka tarika","return rules","return window","return kitne din","return karna hai","want to return","return request","return kab tak","can i return","return allowed","return kaise kare","return karu","return karna chahta","unused","unwashed","tags","packaging","return condition","return shartein"] },
  { id: "exchange", hi: "Exchange की सुविधा product category और store policy पर निर्भर करती है। कृपया official policy देखें।", en: "Exchange availability depends on the product category and store policy. Please check the official policy.", keywords: ["exchange","exchange policy","exchange karna","exchange kar sakte","size exchange","exchange kar sakte ho","swap","badal ke","exchange karna hai","exchange possible","exchange kar sakte hain"] },
  { id: "damaged_product", hi: "हमें खेद है। Product, packaging और shipping label की photos सुरक्षित रखें। Order number के साथ customer support से संपर्क करें।", en: "We're sorry. Keep photos of the product, packaging and shipping label. Contact customer support with your order number.", keywords: ["damaged","damage product","tuta hua","phata hua","kharab product","broken","tore","defective","kharab aaya","damage mila","product damage","product toota","product phata","damaged aaya"] },
  { id: "wrong_product", hi: "कृपया received product की photos, packaging और order details सुरक्षित रखें और store support को समस्या भेजें।", en: "Please keep photos of the received product, packaging and order details, and report the issue to store support.", keywords: ["wrong product","galat product","galat item","wrong item","different product","kuch aur aaya","galat saman","galat cheez","not what i ordered","galat order aaya","galti se galat","wrong colour mila","galat size mila","wrong item mila"] },
  { id: "cancel_order", hi: "यदि cancellation की अनुमति है, तो order details में cancellation विकल्प देखें या shipping से पहले support से संपर्क करें।", en: "If cancellation is allowed, look for the cancellation option in order details or contact support before shipping.", keywords: ["cancel","cancel order","order cancel","cancel karna","cancel karna hai","order cancel karna","cancel my order","cancellation","cancel kar sakte","order cancel kar du","cancel kar sakte ho","order cancel karna chahta","cancel karna chahta"] },
  { id: "refund_time", hi: "Refund का समय store की refund policy, payment method और payment provider पर निर्भर करता है। Support से refund status की पुष्टि करें।", en: "Refund timing depends on store refund policy, payment method and payment provider. Confirm refund status with support.", keywords: ["refund","refund policy","refund kab","refund time","paise wapas","paise wapas kab","refund kab tak","when will i get refund","refund kitne din","money back","paisa wapas","refund mil jayega","refund aayega","wapas milenge","refund kab aayega","refund status"] },
  { id: "return_after_use", hi: "Used products की return eligibility store policy पर निर्भर करती है। खरीदारी से संबंधित official return conditions देखें।", en: "Return eligibility for used products depends on store policy. Check the official return conditions for your purchase.", keywords: ["return after using","return after use","used product return","pehnan ke baad","use karne ke baad return","pehna liya ab return","after use return","used return","return used","pehan kar return","used product","pehn ke return"] },
  { id: "refund_not_arrived", hi: "Refund reference number और original payment transaction details सुरक्षित रखें। पहले payment statement जाँचें, फिर store या payment provider से संपर्क करें।", en: "Keep the refund reference number and original payment transaction details. First check your payment statement, then contact the store or payment provider.", keywords: ["refund nahi aaya","refund nahi mila","refund not received","refund nahi hua","refund nahi aaya abhi tak","refund pending","refund stuck","refund late","refund delay"] },
  { id: "unhappy_purchase", hi: "आपको हुई परेशानी के लिए खेद है। कृपया order number और समस्या का विवरण दें, ताकि support team आपकी सहायता कर सके।", en: "We're sorry for the inconvenience. Please share your order number and problem details so the support team can help.", keywords: ["unhappy","not satisfied","pasand nahi aaya","product pasand nahi","disappointed","complaint","shikayat","problem hai product","bekar product","kharab experience","not happy","disatisfied","unhappy purchase","product kharab"] },
  { id: "out_of_stock", hi: "Restock की तारीख तभी बताई जा सकती है जब store ने इसकी पुष्टि की हो। कृपया बाद में product listing जाँचें।", en: "Restock dates can only be shared once the store confirms. Please check the product listing later.", keywords: ["out of stock","stock me nahi","sold out","restock","stock kab aayega","out of stock kab","available nahi hai","stock nahi hai","when back in stock","stock kab","out of stock hai","stock khatam","stock nahi"] },
  { id: "bulk_order", hi: "Bulk order discount की उपलब्धता store पर निर्भर करती है। कृपया quantity और product details के साथ store support से पूछें।", en: "Bulk order discount availability depends on the store. Please ask store support with quantity and product details.", keywords: ["bulk order","bulk discount","wholesale","badi matra me","many pieces","bulk","corporate order","group order","saste me dhher saare","wholesale price","bulk purchase","bulk quantity"] },
  { id: "custom_request", hi: "Custom orders उपलब्ध हैं या नहीं, इसकी पुष्टि store से करनी होगी। Product और customization की जानकारी साझा करें।", en: "Whether custom orders are available needs confirmation from the store. Please share product and customization details.", keywords: ["custom size","custom design","customized","custom order","made to measure","apne hisab se","custom tailoring","stitching karwani","custom fitting","special design","custom order karna","customize"] },
  { id: "forgot_password", hi: "यदि account सुविधा उपलब्ध है, तो login page पर Forgot Password विकल्प इस्तेमाल करें।", en: "If the account feature is available, use the Forgot Password option on the login page.", keywords: ["forgot password","password bhool gaya","password yaad nahi","bhool gaya password","reset password","password reset","password bhul gaya","apna password nahi","password bhul","password recover","i forgot my password","forgot my password"] },
  { id: "login_issue", hi: "Email या mobile number की सही जानकारी जाँचें। Password reset का विकल्प इस्तेमाल करें और समस्या बनी रहने पर support से संपर्क करें।", en: "Check your email or mobile number. Use the password reset option and contact support if the issue persists.", keywords: ["cannot login","can't login","login nahi ho raha","login problem","login error","account login nahi","sign in nahi","cant login","login issue","logged in nahi","login nahi ho rha","login fail"] },
  { id: "report_issue", hi: "समस्या का screenshot, page link और समस्या होने के steps नोट करें। इन्हें website support को भेजें।", en: "Note the screenshot, page link and steps that caused the issue. Send them to website support.", keywords: ["website issue","site issue","bug","website error","site nahi khul raha","page error","website slow","report a problem","site problem","website problem","app issue","site down","website down","page not loading"] },
  { id: "account_create", hi: "Naya account Sign Up page se banaya ja sakta hai: " + SITE + "/signup . Login ke liye " + SITE + "/login page use karein.", en: "A new account can be created on the Sign Up page: " + SITE + "/signup . Use " + SITE + "/login to log in.", keywords: ["account banaye","account kaise banaye","sign up","signup","register","registration","naya account","account create","id banani","account kaise banate","account banana hai","create account","register karna"] },
  { id: "cart_info", hi: "Product page par 'Add to Cart' button se item cart me jata hai. Cart page par aap quantity update aur checkout kar sakte hain (login zaruri hai): " + SITE + "/cart", en: "Use the 'Add to Cart' button on the product page. On the cart page you can update quantity and checkout (login required): " + SITE + "/cart", keywords: ["cart","add to cart","cart me kaise","cart kaise","bag","cart me add","remove from cart","cart items","cart kya hai","cart page","cart me product","mera cart","cart dekho","shopping bag"] },
  { id: "wishlist_info", hi: "Product page par heart icon click karke wishlist me add karein. Wishlist page par saved items dekh aur cart me move kar sakte hain (login ke baad): " + SITE + "/wishlist", en: "Click the heart icon on the product page to add to wishlist. View saved items and move them to cart on the wishlist page (after login): " + SITE + "/wishlist", keywords: ["wishlist","wish list","favourite","favorite","saved items","heart icon","wishlist me kaise","wishlist kya hai","wishlist page","my wishlist","favourites","saved for later"] },
  { id: "offers", hi: "Latest offers aur deals ke liye homepage ke banners dekhein: " + SITE + " . Kisi product par discount jaanne ke liye product ka naam bataiye.", en: "Check the homepage banners for latest offers and deals: " + SITE + " . Share a product name to know its discount.", keywords: ["offer","offers","deal","deals","sale","koi offer","offer chal raha","any offer","current offers","running offer","promotion","sale chal raha hai","offer hai kya","discount chal raha","sale hai kya","offers kya"] },
];

chatRoute.post("/", async (req, res) => {
  const raw = (req.body && req.body.message) ? req.body.message : "";
  const msg = normalize(raw);
  if (!raw.trim()) return res.json({ reply: pickLang("hi", unclearReply) });
  const lang = isHindiMsg(raw) ? "hi" : "en";
  const angry = ANGRY_WORDS.some(w => msg.includes(" " + w + " "));
  if (angry) return res.json({ reply: pickLang(lang, angryReply) });
  let best = null, bestScore = 0;
  for (const entry of INTENTS) {
    let score = 0;
    for (const kw of entry.keywords) {
      const nkw = normalize(kw); const key = nkw.trim();
      if (key && msg.includes(nkw)) score += key.split(" ").length + (key.length / 60);
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (best && best.catalog && bestScore >= 1) {
    const category = detectCategory(raw);
    const queryRaw = extractProductQuery(raw);
    const budget = detectBudget(raw);
    let query = queryRaw;
    if (best.id === "budget_products") {
      const nonNum = queryRaw.split(" ").filter(w => !/^\d+$/.test(w));
      query = nonNum.join(" ").trim();
      if (!query) query = null;
    }
    const effectiveBudget = (best.id === "budget_products" || (budget && best.id === "recommend")) ? budget : null;
    const fetchLimit = effectiveBudget ? 200 : 4;
    if (best.id === "show_products" && !category && !query) return res.json({ reply: pickLang(lang, best) });
    if (best.id === "budget_products" && !budget) return res.json({ reply: pickLang(lang, best) });
    const needsProduct = ["product_price","discount_info","product_availability","colour_availability","branded","material_info"].includes(best.id);
    if (needsProduct && !query && !category) return res.json({ reply: pickLang(lang, best) });
    let items = await searchProducts({ q: query, category, limit: fetchLimit });
    if (effectiveBudget) items = items.filter(p => { const n = priceOf(p); return n !== null && !isNaN(n) && n <= effectiveBudget; }).slice(0, 4);
    if (items.length === 0) {
      if (query || category) return res.json({ reply: productNotFoundReply(lang) });
      return res.json({ reply: pickLang(lang, best) });
    }
    let kind = best.searchKind || "browse";
    if (best.id === "material_info") kind = "material";
    let reply = formatProducts(items, kind, lang, category);
    if (best.id === "material_info") reply += (lang === "en" ? "\n\n(Fabric/material details are on the product page.)" : "\n\n(कपड़े या सामग्री का विवरण उत्पाद पेज पर देखें।)");
    return res.json({ reply });
  }
  if (best && bestScore >= 1) return res.json({ reply: pickLang(lang, best) });
  const remaining = extractProductQuery(raw);
  const remWords = remaining.split(" ").filter(Boolean);
  const showIntent = /\b(dikhao|dikhaye|dikh|show|list|dekhao|batao|bataiye|dikhana|dekho|dikha)\b/i.test(raw);
  if (showIntent && remWords.length >= 1) {
    const category = detectCategory(raw);
    const items = await searchProducts({ q: remaining, category, limit: 4 });
    if (items.length > 0) return res.json({ reply: formatProducts(items, "recommend", lang, category) });
    return res.json({ reply: productNotFoundReply(lang) });
  }
  if (remWords.length >= 2) {
    const category = detectCategory(raw);
    const items = await searchProducts({ q: remaining, category, limit: 4 });
    if (items.length > 0) return res.json({ reply: formatProducts(items, "recommend", lang, category) });
  }
  if (remWords.length === 1) return res.json({ reply: pickLang(lang, productOnlyReply) });
  return res.json({ reply: pickLang(lang, unclearReply) });
});

module.exports = { chatRoute, INTENTS, DEVANAGARI_REPLIES, unclearReply, noInfoReply, angryReply, productOnlyReply };
