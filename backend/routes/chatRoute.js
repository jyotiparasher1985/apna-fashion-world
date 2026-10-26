const express = require("express");

const chatRoute = express.Router();

// Persona: "Apna Buddy" - warm, polite, enthusiastic female shopping assistant & personal stylist for Apna Fashion World.
// Speak in first-person female Hindi/Hinglish grammar (karti hoon, bata sakti hoon, meri expertise).
// Off-topic (non-fashion) queries are politely redirected to shopping/fashion/outfits.

// Knowledge base for Apna Fashion World support chatbot
const replies = [
  // Greetings
  { keywords: ["hi", "hello", "namaste", "hey", "good morning", "good evening"], reply: "Namaste! Main Apna Buddy hoon, aapki personal stylist aur shopping assistant. Main aapko products, orders, delivery, returns, payment, size, coupon, offers, account, wishlist aur cart ke baare me bata sakti hoon." },

  // Products & Categories
  { keywords: ["categories", "category", "kin kin", "kaun kaun", "what products", "kaunse products", "collection"], reply: "Hamare paas Men's Wear, Women's Wear, Kids' Wear, Festive Collections, Traditional Outfits, Casual Daily Wear aur Fashion Accessories ka latest collection uplabdh hai." },
  { keywords: ["party wear", "wedding", "festive", "shaadi", "lehenga", "sherwani", "saree", "designer suit"], reply: "Haan, hamare paas shaadi, party aur tyoharon ke anusaar lehenga, sherwani, designer suits, sarees aur stylish party wear outfits ka special collection hai." },
  { keywords: ["daily casual", "t-shirt", "tshirt", "jeans", "shirt", "trouser", "lower", "casuals"], reply: "Ji haan, branded aur comfortable daily wear jaise cotton t-shirts, formal/casual shirts, denim jeans, trousers aur lower collection uplabdh hain." },
  { keywords: ["original", "quality", "authentic", "genuine", "fabric quality"], reply: "Bilkul, hum fabric quality aur finishing par vishesh dhyan dete hain taaki aapko behtareen comfort aur durable kapde milein." },

  // Sizing & Fitting
  { keywords: ["size", "sizes", "size guide", "sahi size", "size chart", "measurement", "chest", "waist", "length", "fit", "fitting"], reply: "Har product page par ek standard Size Chart (S, M, L, XL, XXL) chest, waist aur length measurements ke sath di gayi hai. Agar aap do sizes ke beech me confuse hain, toh ek size bada chunna behtar rehta hai." },
  { keywords: ["alteration", "customized fitting", "fitting", "stitch", "tailor"], reply: "Haan, agar aap hamare offline store se visit karte hain ya local delivery lete hain, toh basic alteration suvidha uplabdh karwayi jaati hai." },
  { keywords: ["plus size", "3xl", "4xl", "xxl", "big size", "large size"], reply: "Select categories aur specific designs me plus-size options uplabdh hain. Aap filter me apna required size select karke dekh sakte hain." },

  // Orders & Payment
  { keywords: ["order kaise", "place order", "order place", "kaise order", "order karen"], reply: "Apna pasandida item chunein -> Sahi size aur color select karein -> Add to Cart karein -> Checkout par click karke shipping address bharein aur payment complete karein." },
  { keywords: ["payment", "pay", "payment options", "payment methods", "upi", "net banking", "debit card", "credit card"], reply: "Hum UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit/Credit Cards aur eligible locations ke liye Cash on Delivery (COD) accept karte hain." },
  { keywords: ["cod", "cash on delivery"], reply: "Haan, adhiktam pincodes par Cash on Delivery ki suvidha uplabdh hai. Kuch items par nominal COD confirmation lag sakti hai." },
  { keywords: ["payment failed", "payment kat gaya", "amount deducted", "order confirm nahi", "transaction id"], reply: "Ghabrayein nahi. Bank server issue ki wajah se agar amount deduct ho gaya hai toh 24 se 48 ghante me auto-refund ho jata hai ya order update ho jata hai. Turant madad ke liye transaction ID hamare WhatsApp support par bhejein." },

  // Shipping, Delivery & Tracking
  { keywords: ["delivery", "shipping", "ship", "deliver", "kitne din", "delivery time", "deliver hoga", "kab milega", "shipping time"], reply: "Standard delivery me aamtaur par 3 se 7 working days lagte hain (aapke location aur pincode par nirbhar karta hai). Local orders 24 se 48 ghante me deliver ho jate hain." },
  { keywords: ["track", "tracking", "order", "order status", "awb", "tracking link"], reply: "Order dispatch hote hi aapko SMS/WhatsApp par tracking link aur AWB number mil jata hai. Aap website ke 'Track Order' section me jakar apna tracking number daal kar live status dekh sakte hain." },
  { keywords: ["delivery charges", "shipping charge", "free delivery", "delivery fee"], reply: "Ek nishchit cart value (jaise Rs. 999 ya usse upar) par delivery bilkul FREE rehti hai. Usse kam ke orders par standard shipping charge lagta hai." },

  // Returns, Exchange & Refund
  { keywords: ["return", "exchange", "refund", "size galat", "pasand na aaye"], reply: "Haan, hamare paas hassle-free return aur exchange policy hai. Delivery ke 5 se 7 dino ke andar aap return ya size exchange request daal sakte hain." },
  { keywords: ["return condition", "return shartein", "unused", "unwashed", "tags", "packaging"], reply: "Product unused, unwashed hona chahiye aur uske original price tags, labels aur packaging surakshit honi chahiye." },
  { keywords: ["refund kab", "refund time", "refund aayega", "refund kitne din"], reply: "Return product hamare warehouse pahunch kar check hone ke 2 se 4 working days ke andar aapka refund aapke original payment source ya UPI me credit kar diya jata hai." },

  // Store Visit & Direct Support
  { keywords: ["physical store", "offline store", "store visit", "shop visit", "store timing", "store hours"], reply: "Ji bilkul! Aap hamare physical store par visit karke fabric try kar sakte hain aur live shopping ka anubhav le sakte hain. Store timings: Subah 10:00 AM se Raat 9:00 PM tak." },
  { keywords: ["customer care", "whatsapp", "support number", "contact", "help number", "email support"], reply: "Aap hamare official customer support number par direct call ya WhatsApp kar sakte hain, ya support email par message bhej sakte hain." },

  // Previously added topics
  { keywords: ["coupon", "promo", "voucher", "promo code", "coupon code"], reply: "Coupon/promo code checkout page par 'Apply Coupon' box me enter karein. Valid hone par discount turant apply ho jayega." },
  { keywords: ["offer", "offers", "deal", "deals", "sale", "discount"], reply: "Latest offers aur deals 'Home' page banners aur 'Flash Deals' section me milte hain. Cart me bhi applicable discounts auto-apply hote hain." },
  { keywords: ["account", "register", "signup", "sign up", "login", "profile", "password"], reply: "Naya account 'Sign Up' se banayein, existing users 'Login' karein. Profile/password update account settings se kar sakte hain." },
  { keywords: ["wishlist", "favourite", "favorite", "saved", "save for later"], reply: "Product page par heart icon click karke wishlist me add karein. Wishlist page par saved items dekh aur cart me move kar sakte hain." },
  { keywords: ["cart", "bag", "checkout", "add to cart", "basket"], reply: "Product page se 'Add to Cart' karein. Cart page par quantity update, remove aur checkout kar sakte hain." },
  { keywords: ["cancel"], reply: "Order ship hone se pehle cancel kar sakte hain. Shipped hone ke baad return process use karein." },
];

chatRoute.post("/", (req, res) => {
  const message = (req.body && req.body.message ? req.body.message : "").toLowerCase();
  let reply = "Main Apna Buddy hoon, aapki shopping assistant. Main sirf fashion, clothing, styling, orders, delivery, sizes aur store policies ke baare me madad kar sakti hoon. Kya aap koi outfit, size ya order ke baare me poochna chahenge? Agar aapko kisi specific product, price ya order status ki madad chahiye jo yahan na mile, toh apna Order ID ya Product Name bhejein, ya hamare WhatsApp support se sampark karein.";

  // Try to find best matching reply by counting keyword hits
  let bestScore = 0;
  let bestReply = null;
  for (const item of replies) {
    let score = 0;
    for (const k of item.keywords) {
      if (message.includes(k)) score += k.split(" ").length; // prefer multi-word matches
    }
    if (score > bestScore) {
      bestScore = score;
      bestReply = item.reply;
    }
  }
  if (bestReply) reply = bestReply;

  res.json({ reply });
});

module.exports = { chatRoute };