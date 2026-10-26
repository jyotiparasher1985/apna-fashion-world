# Apna Fashion World — Chatbot Q&A (Devanagari Hindi)

**Live site:** https://apnafashionworld.web.app
**Backend API:** https://apna-fashion-backend.vercel.app/chat

> Language rule: हिंदी/Hinglish सवाल → Devanagari जवाब, pure English सवाल → English जवाब।
> Product से जुड़े सवालों के जवाब live MongoDB catalog से आते हैं (price, discount, availability)।

## Welcome message

```
नमस्ते! 👋 Welcome to Apna Fashion World!

मैं आपका shopping assistant हूँ। 😊

मैं आपकी मदद कर सकता हूँ:
- 👗 Products और latest collection खोजने में
- 💰 Price, size और colour की जानकारी पाने में
- 🛍️ Order और payment से जुड़े सवालों में
- 🚚 Delivery, cancellation, return और refund की जानकारी में
- 🙋 Customer support तक पहुँचने में

बताइए, मैं आपकी क्या मदद कर सकता हूँ?
```

## Fallback answers (4)

| Situation | Devanagari reply |
|---|---|
| सवाल समझ नहीं आया | माफ़ कीजिए, मैं आपका सवाल पूरी तरह समझ नहीं पाया। कृपया product, order, payment या delivery से संबंधित अपना सवाल थोड़े अलग शब्दों में पूछें। |
| जानकारी catalog/policy में उपलब्ध नहीं | इस जानकारी की पुष्टि अभी उपलब्ध catalog या store policy से नहीं हो रही है। कृपया customer support से इसकी पुष्टि करें। |
| गुस्सा / शिकायत | आपको हुई परेशानी के लिए हमें खेद है। मैं आपकी समस्या समझने और सही next step बताने में मदद करूँगा। कृपया समस्या का संक्षिप्त विवरण और order reference साझा करें। |
| सिर्फ product का नाम लिखा गया | आप इस product के बारे में क्या जानना चाहते हैं—price, size, colour, availability या order करने का तरीका? |

## Q&A (63 intents)

_(catalog वाले intents में reply के आगे live products की list और site link भी जुड़ता है)_

### greeting

- **Keywords:** hi, hello, hey, namaste, namaskar, good morning, good evening, good afternoon, hii, hiii, hey there, kaise ho, start
- **हिंदी (Devanagari):** नमस्ते! 👋 मैं आपका शॉपिंग सहायक हूँ। 😊 बताइए, मैं आपकी क्या मदद कर सकता हूँ?
- **English:** Namaste! 👋 I'm your shopping assistant. 😊 How can I help you today?

### thanks

- **Keywords:** thanks, thank you, thankx, thx, dhanyavaad, dhanyawad, shukriya, thank u, thanks a lot
- **हिंदी (Devanagari):** आपका दिन शुभ हो! 😊 कोई और सवाल हो तो ज़रूर पूछें।
- **English:** You're welcome! 😊 Feel free to ask anything else.

### ack

- **Keywords:** ok, okay, oke, hmm, hmmm, acha, achha, accha, theek, thik, thik hai, sahi hai, fine, alright, haan, haan ji, han ji, yes, yeah, yep, done, ok done
- **हिंदी (Devanagari):** ठीक है! 😊 और कुछ मदद चाहिए तो बताइए — products, order, payment या delivery से जुड़ा कोई भी सवाल पूछ सकते हैं।
- **English:** Okay! 😊 Let me know if you need anything else — products, orders, payment or delivery, anything at all.

### about_store

- **Keywords:** what is apna fashion world, apna fashion world kya hai, about apna fashion world, tum kaun ho, aap kaun ho, who are you, what are you, about you, what is this website, ye website kya hai, site ke bare me, store ke bare me, what is this store, apna fashion world kya hai
- **हिंदी (Devanagari):** अपना फैशन वर्ल्ड में आपका स्वागत है! मैं उपलब्ध फैशन उत्पाद खोजने और खरीदारी से जुड़ी जानकारी पाने में आपकी मदद कर सकता हूँ।
- **English:** Welcome to Apna Fashion World! I can help you find available fashion products and get shopping-related information.

### capabilities

- **Keywords:** what can you do, what can you help, how can you help, kya help kar sakte, madad kar sakte ho, kya kar sakte ho, what do you do, help me with what, aap kya jaante ho, kya kya kar sakte ho
- **हिंदी (Devanagari):** मैं उत्पादों, कीमतों, साइज़, रंगों, उपलब्धता, ऑर्डर, भुगतान, डिलीवरी और स्टोर की नीतियों से जुड़े सवालों में मदद कर सकता हूँ।
- **English:** I can help with questions about products, prices, sizes, colours, stock availability, orders, payments, delivery and store policies.

### how_to_shop

- **Keywords:** how to shop, how can i shop, shopping kaise kare, shopping kaise, kharidna kaise, kaise kharidu, how to buy, buy kaise kare, purchase kaise, kaise kharidein, shopping kaise karte hain
- **हिंदी (Devanagari):** वेबसाइट पर उपलब्ध उत्पाद देखें, अपनी पसंद का उत्पाद चुनें और खरीदारी के लिए दिए गए निर्देशों का पालन करें।
- **English:** Browse the available products on the website, pick your favourite and follow the shopping instructions given on the site.

### online_store

- **Keywords:** online store, online shopping, online hai, is this online, online shop, do you sell online, online available hai, online kharid sakte, website par order
- **हिंदी (Devanagari):** आप अपना फैशन वर्ल्ड की वेबसाइट पर उपलब्ध उत्पाद देख सकते हैं। ऑर्डर और ऑनलाइन भुगतान की सुविधा वेबसाइट के मौजूदा विकल्पों पर निर्भर करती है।
- **English:** You can view available products on the Apna Fashion World website. Order placement and online payment depend on the website's current features.

### human_support

- **Keywords:** real person, human agent, human se baat, insaan se baat, insaan, live agent, agent se baat, customer care se baat, representative, baat karni hai, human help, person se baat, customer support team, contact support, insaan se baat karni hai, human support, customer care number, customer care do, support number, contact number, phone number, helpline, customer care number do, support number do
- **हिंदी (Devanagari):** ज़रूर! कृपया वेबसाइट पर ‘Contact Us’ या ग्राहक सहायता विकल्प देखें। संपर्क जानकारी उपलब्ध न हो, तो स्टोर से सही जानकारी की पुष्टि करें।
- **English:** Of course! Please use the Contact Us or customer support option on the website. If contact details aren't available, I'll suggest verifying the right contact information.

### show_products

- **Keywords:** show me all products, all products, sab products, products dikhao, catalog, sare products, list products, kya kya hai, kya kya products, show products, product list, sab dikhao, sab kuch dikhado, sab dikhado, available products, sare products dikhao
- **हिंदी (Devanagari):** ज़रूर! आप किस श्रेणी या उत्पाद की तलाश कर रहे हैं? उसका नाम बताइए, मैं उपलब्ध कैटलॉग में खोजने में मदद करूँगा।
- **English:** Sure! Tell me the category or product you're looking for and I'll help you search the available catalogue.

### mens

- **Keywords:** men clothing, mens clothing, men wear, mens wear, men ke kapde, men section, gents, gents wear, men ka saman, men fashion, men's clothing, men's wear, purush ke kapde, boys clothing, male clothing, men ke liye
- **हिंदी (Devanagari):** जी! पुरुषों की श्रेणी में उपलब्ध उत्पादों में से कुछ विकल्प ये हैं:
- **English:** Yes! Here are some top picks from our Men's category:

### womens

- **Keywords:** women clothing, womens clothing, women wear, women's clothing, women's wear, ladies, ladies wear, women ke kapde, mahila ke kapde, girl ke kapde, female clothing, womens, women section, women ke liye, girls clothing
- **हिंदी (Devanagari):** जी! महिलाओं की श्रेणी में उपलब्ध उत्पादों में से कुछ विकल्प ये हैं:
- **English:** Yes! Here are some top picks from our Women's category:

### kids

- **Keywords:** kids clothing, kid clothing, kids wear, kid's clothing, kids' clothing, bacchon ke kapde, bachche ke kapde, children clothing, child clothing, kids section, kids ke liye, bacchon ka saman, boys kids, girls kids
- **हिंदी (Devanagari):** जी! बच्चों की श्रेणी में उपलब्ध उत्पादों में से कुछ विकल्प ये हैं:
- **English:** Yes! Here are some top picks from our Kids category:

### product_availability

- **Keywords:** is this product available, product available, available hai, stock hai, in stock, available kya, mil jayega, milta hai kya, available nahi, is it available, availability, stock available, product mil jayega, yeh product available
- **हिंदी (Devanagari):** कृपया उत्पाद का नाम या लिंक भेजें। मैं कैटलॉग में उपलब्ध जानकारी के आधार पर मदद करूँगा।
- **English:** Please send the product name or link. I'll help based on the available product information.

### new_arrivals

- **Keywords:** new arrivals, new arrival, latest products, naye products, naya collection, new collection, latest collection, naye kapde, what's new, whats new, new products, latest arrivals, naya aaya
- **हिंदी (Devanagari):** नए उत्पाद देखने के लिए वेबसाइट का ‘New Arrivals’ या ‘Latest Products’ विभाग देखें, यदि उपलब्ध हो।
- **English:** To see the latest collection or new products, check the New Arrivals or Latest Products section on the website, if available.

### recommend

- **Keywords:** recommend, suggest, recommend something, suggest something, kuch suggest karo, kuch dikhao, kuch recommend, best products, top products, kya lelu, kya lu, kya kharedu, kharidne ke liye suggest, recommendations, suggest me, help me choose, pasand nahi aaye kuch naya, kya lena chahiye, dikhao kuch
- **हिंदी (Devanagari):** बिल्कुल! बताइए कि उत्पाद किसके लिए चाहिए, किस अवसर पर पहनना है, कौन-सा साइज़ चाहिए और आपका बजट कितना है।
- **English:** Sure! Tell me the occasion, size and budget you have in mind.

### colour_availability

- **Keywords:** another colour, dusra colour, do you have this in another colour, red colour, colour milega, color available, kaunse colour, koi aur colour, colour options, color options, colour hai, color hai, colour milta, colour milega, red colour milega, colour available hai
- **हिंदी (Devanagari):** कृपया उत्पाद का नाम और पसंदीदा रंग बताएं। दूसरे रंगों की पुष्टि तभी कर सकता हूँ जब उनकी जानकारी कैटलॉग में उपलब्ध हो।
- **English:** Please share the product name and your preferred colour. Other colours can only be confirmed if that information is in the catalogue.

### budget_products

- **Keywords:** sasta kuch dikhao, sasta, sasti cheez, cheap, affordable, kam price, low budget, budget, under, below, less than, tak ke, saste me, sasta kuch, budget me, budget products, low price
- **हिंदी (Devanagari):** अपना बजट (जैसे ₹500 या ₹1000) और उत्पाद का प्रकार बताइए—मैं कैटलॉग में खोजूँगा।
- **English:** Tell me your budget (e.g. ₹500 or ₹1000) and product type — I'll search the catalogue.

### product_price

- **Keywords:** price kya hai, price batao, price kya, kitne ka, kitna hai, cost, rate, daam, kimat, how much, kitne ka hai, kitne ka hai ye, price list, price kya h, what is the price, price kitna, price kitni, price kya hai ye, kitne ka hoga
- **हिंदी (Devanagari):** कृपया उत्पाद का नाम या लिंक भेजें। मैं कैटलॉग में उपलब्ध मौजूदा कीमत बताऊँगा।
- **English:** Please send the product name or link. I'll help with the current price available in the catalogue.

### discount_info

- **Keywords:** discount, discount hai, any discount, sale, off, chhoot, coupon, promo code, voucher, kitna discount, discount kitna, discount milta, coupon code, promo, offer code, discounted price, discounted
- **हिंदी (Devanagari):** अगर उत्पाद पर छूट उपलब्ध है, तो उसकी जानकारी उत्पाद की सूची में दिखाई देगी। कृपया उत्पाद का नाम बताएं।
- **English:** If a discount is available on the product, it will show in the product listing. Please share the product name.

### size_availability

- **Keywords:** size, sizes, size chart, meri size, size mil jayegi, available sizes, size kya hai, size hai, what size, sizes available, kaunse size, size available, size milega, size kaunsa, size milta, size milegi, size chart kya, size guide
- **हिंदी (Devanagari):** कृपया उत्पाद का नाम या लिंक भेजें। उपलब्ध साइज़ की पुष्टि उत्पाद की जानकारी से की जाएगी।
- **English:** Please send the product name or link. Available sizes can be confirmed from the product's size information.

### size_suggest

- **Keywords:** size suggest, suggest my size, size kaunsi, kaunsi size, which size, size confusion, size pata nahi, measurements, chest, waist, hip, measurement bata du, meri size pata nahi, size suggest karo, size kya lunga, size kya lungi, sahi size, size chart suggest
- **हिंदी (Devanagari):** अपना सीना, कमर और कूल्हे का माप तथा उत्पाद का प्रकार बताएं। साइज़ चार्ट उपलब्ध होने पर उसके अनुसार साइज़ चुनने में मदद करूँगा।
- **English:** Share your chest, waist and hip measurements along with the product type. If a size chart is available, I'll help you choose accordingly.

### material_info

- **Keywords:** material, fabric, kis cheez ka bana, made of, cloth material, quality, fabric quality, kya material, kis fabric, kapda kya, material kya hai, fabric kya hai, quality kaisi, quality kya
- **हिंदी (Devanagari):** कृपया उत्पाद का नाम या लिंक भेजें। कपड़े या सामग्री की जानकारी उत्पाद के विवरण में उपलब्ध होने पर बताऊँगा।
- **English:** Please send the product name or link. Fabric/material information will be shared if available in the product description.

### photos_accurate

- **Keywords:** photos accurate, photo real hai, picture accurate, photo sahi hai, images real, photo kaisi hai, actual photo, photo real, image real, photo same, photo jaisi
- **हिंदी (Devanagari):** हम उपलब्ध उत्पाद जानकारी के आधार पर मदद करेंगे। रोशनी या स्क्रीन की सेटिंग के कारण असली रंग में थोड़ा अंतर हो सकता है।
- **English:** We'll help based on the available product information. Actual colour may vary slightly due to lighting or screen settings.

### branded

- **Keywords:** branded, brand, original brand, brand kya hai, konsa brand, which brand, brand hai, branded hai, original, genuine, authentic, first copy, brand name, kaunsa brand, brand ka naam
- **हिंदी (Devanagari):** कृपया उत्पाद का नाम या लिंक भेजें। ब्रांड की पुष्टि केवल उपलब्ध उत्पाद जानकारी से की जा सकती है।
- **English:** Please send the product name or link. Brand can only be confirmed from the available product information.

### price_change

- **Keywords:** price change, price badlega, price badal, price increase, will the price change, price badh jayega, price fluctuate, price change hoga, price kab badlega
- **हिंदी (Devanagari):** कीमतें बदल सकती हैं। खरीदने से पहले वेबसाइट पर दिखाई गई मौजूदा कीमत ज़रूर देखें।
- **English:** Prices may change. Please check the current price shown on the website before buying.

### place_order

- **Keywords:** place order, order kaise, order kaise kare, order kaise karen, kaise order, order karne ka tarika, how to order, order place, buy kaise, kharid kaise, order karna hai, order karna chahta, want to order, order kar du, place an order, order kaise place, order kaise karna, kaise order kare
- **हिंदी (Devanagari):** अपना पसंदीदा उत्पाद चुनें, उपलब्ध साइज़ और रंग चुनें, फिर वेबसाइट पर दिए गए कार्ट और चेकआउट निर्देशों का पालन करें।
- **English:** Choose your favourite product, select the available size and colour, and follow the cart and checkout instructions on the website.

### guest_order

- **Keywords:** without account, without creating account, without creating, without an account, guest, guest checkout, guest order, guest user, account ke bina, bina account, bina login, without login, bina signup, without signup, without registration
- **हिंदी (Devanagari):** यह वेबसाइट की चेकआउट सेटिंग पर निर्भर करता है। चेकआउट के समय देखें कि बिना खाता बनाए खरीदारी की सुविधा उपलब्ध है या नहीं।
- **English:** This depends on the website's checkout settings. Check at checkout whether guest checkout is available or an account is required.

### multi_product

- **Keywords:** multiple products, many products, ek se jyada, ek saath order, multiple items, alag alag products, saare products ek saath, one order many, kai products, ek order me kai, multiple items ek saath, kai items ek saath
- **हिंदी (Devanagari):** अगर कार्ट की सुविधा उपलब्ध है, तो उसमें कई उत्पाद जोड़कर एक साथ चेकआउट कर सकते हैं।
- **English:** If the cart feature is available, you can add multiple products to it and check out.

### change_order

- **Keywords:** change my order, order change, order modify, modify order, order edit, order badalna hai, order me badlav, order update karna, change order, order ko change, order modification
- **हिंदी (Devanagari):** ऑर्डर में बदलाव स्टोर की नीति पर निर्भर करता है। कृपया जल्द ग्राहक सहायता से संपर्क करके अपना ऑर्डर नंबर दें।
- **English:** Order modification depends on store policy. Contact customer support quickly and share your order number.

### order_failing

- **Keywords:** can't place order, cannot place order, order place nahi ho raha, order nahi ho raha, order fail, checkout nahi ho raha, order place karne me problem, unable to place, order nahi ho raha hai, order error, checkout error, order nahi ho raha hai kya, why can't i place my order, why can't i, can't place, unable to order, order place nahi
- **हिंदी (Devanagari):** कृपया उत्पाद की उपलब्धता, ज़रूरी जानकारी, डिलीवरी पता और भुगतान की स्थिति जाँचें। समस्या बनी रहे तो ग्राहक सहायता से संपर्क करें।
- **English:** Please check product availability, required fields, delivery address and payment status. If the problem persists, contact support.

### whatsapp_order

- **Keywords:** whatsapp par order, order by whatsapp, whatsapp se order, whatsapp order, whatsapp par kharid, whatsapp se kharid, whatsapp ordering
- **हिंदी (Devanagari):** अगर वेबसाइट पर आधिकारिक WhatsApp ऑर्डर का विकल्प दिया गया है, तो उसका उपयोग करें। अन्यथा स्टोर से उपलब्ध संपर्क माध्यम पर पुष्टि करें।
- **English:** If an official WhatsApp ordering option is on the website, use it. Otherwise confirm with the store through the available contact method.

### payment_methods

- **Keywords:** payment methods, payment options, payment kaise, pay kaise, payment karne ka tarika, which payment, how to pay, payment mode, pay karu, payment karu, paise kaise, payment method kya, payment kaunsa, payment options kya
- **हिंदी (Devanagari):** चेकआउट पेज पर क्रेडिट कार्ड, UPI, नेट बैंकिंग और कैश ऑन डिलीवरी (COD) के विकल्प उपलब्ध हैं।
- **English:** The checkout page currently offers Credit Card, UPI, Net Banking and Cash on Delivery (COD) options.

### cod

- **Keywords:** cod, cash on delivery, cod hai, cod available, cod kar sakte, cod option, cod milta, cod uplabdh, cod available hai, cash on delivery hai
- **हिंदी (Devanagari):** कैश ऑन डिलीवरी (COD) की उपलब्धता आपके ऑर्डर और स्टोर की सेटिंग पर निर्भर करती है। चेकआउट पर इसकी पुष्टि करें।
- **English:** Cash on Delivery (COD) availability depends on your order and store settings. Please confirm it at checkout.

### upi

- **Keywords:** upi, upi se payment, google pay, gpay, phonepe, paytm, upi id, upi accepted, upi payment, upi se pay, upi milta
- **हिंदी (Devanagari):** अगर चेकआउट पर UPI का विकल्प उपलब्ध है, तो आप उसका उपयोग कर सकते हैं।
- **English:** If the UPI option is available at checkout, you can use it.

### payment_deducted

- **Keywords:** payment deducted, amount deducted, paisa kat gaya, paise kat gaye, payment deducted but order, money deducted, payment ho gaya order nahi, amount deducted but, payment cut gaya, double payment, do baar payment, payment deducted but order not, payment kat gaya order nahi, payment fail, payment failed, payment nahi hua, payment fail ho gaya, payment failed ho gaya, payment issue, payment problem, payment was deducted, order was not placed, deducted but, payment deducted but
- **हिंदी (Devanagari):** भुगतान का ट्रांज़ैक्शन आईडी और समय सुरक्षित रखें। पहले ऑर्डर की स्थिति जाँचें, फिर भुगतान सेवा प्रदाता या स्टोर सहायता से संपर्क करें। दोबारा भुगतान करने से पहले स्थिति की पुष्टि करें।
- **English:** Please keep your payment transaction ID and time safe. First check order status, then contact the payment provider or store support. Confirm the status before paying again.

### payment_secure

- **Keywords:** payment secure, safe hai, online payment safe, is payment safe, secure hai, payment safe, safe hai kya, website secure, payment secure hai, safe payment, secure payment
- **हिंदी (Devanagari):** केवल वेबसाइट पर दिए गए अधिकृत भुगतान विकल्प का उपयोग करें। अपना OTP, UPI PIN या पासवर्ड किसी के साथ साझा न करें।
- **English:** Use only the authorised payment gateway available on the website. Never share your OTP, UPI PIN or password with anyone.

### invoice

- **Keywords:** invoice, bill, receipt, gst bill, invoice chahiye, bill chahiye, bill bhejo, invoice bhejo, tax invoice, receipt chahiye
- **हिंदी (Devanagari):** इनवॉइस की उपलब्धता ऑर्डर और स्टोर की बिलिंग व्यवस्था पर निर्भर करती है। ऑर्डर की पुष्टि या खाते में ऑर्डर विवरण देखें।
- **English:** Invoice availability depends on the order and store billing system. Check order confirmation or your account's order details section.

### delivery_time

- **Keywords:** delivery time, how long delivery, kitne din, delivery kitne, how long does delivery, delivery kab hogi, delivery time kitna, deliver kab, kab milega, delivery duration, shipping time, delivery me kitna time, kitne dino me, delivery kab tak, delivery me kitne din
- **हिंदी (Devanagari):** डिलीवरी का अनुमानित समय शिपिंग नीति, आपके पते और ऑर्डर की जानकारी पर निर्भर करता है। चेकआउट या ऑर्डर की पुष्टि में दिया गया समय देखें।
- **English:** Estimated delivery time depends on shipping policy, delivery location and order details. Check the time shown at checkout or in order confirmation.

### delivery_india

- **Keywords:** across india, all india, pan india, india bhar, deliver to india, delivery india, poore india, do you deliver, deliver karte ho, delivery kahan tak, delivery available hai, sheher me delivery, mere sheher me delivery, delivery hogi kya, mere area me delivery
- **हिंदी (Devanagari):** डिलीवरी की उपलब्धता जानने के लिए चेकआउट पर अपना PIN कोड दर्ज करें।
- **English:** Confirm delivery locations by entering your PIN code at checkout.

### shipping_charges

- **Keywords:** shipping charges, delivery charges, shipping charge, delivery charge, shipping fee, delivery fee, shipping cost, delivery cost, free delivery, free shipping, shipping charges kitne, delivery charges kitne, delivery free, shipping free, free delivery hai, free shipping hai
- **हिंदी (Devanagari):** शिपिंग शुल्क की जानकारी चेकआउट या स्टोर की शिपिंग नीति में देखें। पुष्टि न हो तो ग्राहक सहायता से पूछें।
- **English:** Shipping charges information should be available at checkout or in the store's shipping policy.

### track_order

- **Keywords:** track, tracking, track my order, order status, mera order kahan, order kahan hai, where is my order, order kaha hai, order kab aayega, awb, tracking link, track order, track karna, order status kya, mera order kahan hai, kahan hai mera order, shipment, track my parcel, parcel track
- **हिंदी (Devanagari):** अगर ट्रैकिंग की सुविधा उपलब्ध है, तो ऑर्डर की पुष्टि वाला संदेश या ट्रैकिंग लिंक देखें।
- **English:** If tracking is available, use the order confirmation or tracking link.

### order_delayed

- **Keywords:** order delayed, late delivery, order late, der se aa raha, order der, delayed, delivery late ho gayi, order nahi aaya, abhi tak nahi aaya, order stuck, late ho gaya, still not delivered, not delivered, delivery late, order late aa raha
- **हिंदी (Devanagari):** ऑर्डर की पुष्टि और ट्रैकिंग स्थिति जाँचें। अनुमानित समय से अधिक देरी हो तो ग्राहक सहायता से संपर्क करें।
- **English:** Check your order confirmation and tracking status. If delivery is delayed beyond the estimate, contact customer support.

### change_address

- **Keywords:** change delivery address, address change, address badalna, change address, delivery address change, address update, naya address, address galat, wrong address, pincode change, address change karna, shipping address change, change my delivery address, change my address, my delivery address
- **हिंदी (Devanagari):** शिपिंग से पहले पता बदलना संभव हो सकता है, लेकिन यह स्टोर की नीति पर निर्भर करता है। तुरंत ग्राहक सहायता से संपर्क करें।
- **English:** Changing the address before shipping may be possible, but it depends on store policy. Contact support immediately.

### unavailable_at_delivery

- **Keywords:** not at home, unavailable at delivery, ghar par nahi hounga, out of town, delivery ke time, main available nahi, missed delivery, courier ne nahi diya, missed delivery, delivery miss, ghar par nahi, delivery time nahi
- **हिंदी (Devanagari):** कूरियर के डिलीवरी निर्देश देखें। सुविधा उपलब्ध हो तो कूरियर से दोबारा डिलीवरी की व्यवस्था पूछें।
- **English:** Follow the delivery instructions given by the courier, or ask the courier to arrange redelivery if available.

### return_policy

- **Keywords:** return policy, return kaise, how to return, return kar sakte, return karne ka tarika, return rules, return window, return kitne din, return karna hai, want to return, return request, return kab tak, can i return, return allowed, return kaise kare, return karu, return karna chahta, unused, unwashed, tags, packaging, return condition, return shartein
- **हिंदी (Devanagari):** वापसी की पात्रता, समय-सीमा और शर्तों की पुष्टि स्टोर की आधिकारिक रिटर्न नीति से करें।
- **English:** Confirm return eligibility, time limit and conditions from the store's official Return Policy.

### exchange

- **Keywords:** exchange, exchange policy, exchange karna, exchange kar sakte, size exchange, exchange kar sakte ho, swap, badal ke, exchange karna hai, exchange possible, exchange kar sakte hain
- **हिंदी (Devanagari):** एक्सचेंज की सुविधा उत्पाद की श्रेणी और स्टोर की नीति पर निर्भर करती है। कृपया आधिकारिक नीति देखें।
- **English:** Exchange availability depends on the product category and store policy. Please check the official policy.

### damaged_product

- **Keywords:** damaged, damage product, tuta hua, phata hua, kharab product, broken, tore, defective, kharab aaya, damage mila, product damage, product toota, product phata, damaged aaya
- **हिंदी (Devanagari):** हमें खेद है। उत्पाद, पैकेजिंग और शिपिंग लेबल की तस्वीरें सुरक्षित रखें। ऑर्डर नंबर के साथ ग्राहक सहायता से संपर्क करें।
- **English:** We're sorry. Keep photos of the product, packaging and shipping label. Contact customer support with your order number.

### wrong_product

- **Keywords:** wrong product, galat product, galat item, wrong item, different product, kuch aur aaya, galat saman, galat cheez, not what i ordered, galat order aaya, galti se galat, wrong colour mila, galat size mila, wrong item mila
- **हिंदी (Devanagari):** मिले हुए उत्पाद, पैकेजिंग और ऑर्डर की तस्वीरें व जानकारी सुरक्षित रखें और समस्या स्टोर सहायता को भेजें।
- **English:** Please keep photos of the received product, packaging and order details, and report the issue to store support.

### cancel_order

- **Keywords:** cancel, cancel order, order cancel, cancel karna, cancel karna hai, order cancel karna, cancel my order, cancellation, cancel kar sakte, order cancel kar du, cancel kar sakte ho, order cancel karna chahta, cancel karna chahta
- **हिंदी (Devanagari):** अगर रद्द करने की सुविधा उपलब्ध है, तो ऑर्डर विवरण में विकल्प देखें या शिपिंग से पहले ग्राहक सहायता से संपर्क करें।
- **English:** If cancellation is allowed, look for the cancellation option in order details or contact support before shipping.

### refund_time

- **Keywords:** refund, refund policy, refund kab, refund time, paise wapas, paise wapas kab, refund kab tak, when will i get refund, refund kitne din, money back, paisa wapas, refund mil jayega, refund aayega, wapas milenge, refund kab aayega, refund status
- **हिंदी (Devanagari):** रिफंड का समय स्टोर की नीति, भुगतान के तरीके और भुगतान सेवा प्रदाता पर निर्भर करता है। ग्राहक सहायता से रिफंड की स्थिति की पुष्टि करें।
- **English:** Refund timing depends on store refund policy, payment method and payment provider. Confirm refund status with support.

### return_after_use

- **Keywords:** return after using, return after use, used product return, pehnan ke baad, use karne ke baad return, pehna liya ab return, after use return, used return, return used, pehan kar return, used product, pehn ke return
- **हिंदी (Devanagari):** इस्तेमाल किए गए उत्पाद की वापसी स्टोर की नीति पर निर्भर करती है। खरीदारी की आधिकारिक वापसी शर्तें देखें।
- **English:** Return eligibility for used products depends on store policy. Check the official return conditions for your purchase.

### refund_not_arrived

- **Keywords:** refund nahi aaya, refund nahi mila, refund not received, refund nahi hua, refund nahi aaya abhi tak, refund pending, refund stuck, refund late, refund delay
- **हिंदी (Devanagari):** रिफंड संदर्भ संख्या और मूल भुगतान की जानकारी सुरक्षित रखें। पहले बैंक स्टेटमेंट जाँचें, फिर स्टोर या भुगतान सेवा प्रदाता से संपर्क करें।
- **English:** Keep the refund reference number and original payment transaction details. First check your payment statement, then contact the store or payment provider.

### unhappy_purchase

- **Keywords:** unhappy, not satisfied, pasand nahi aaya, product pasand nahi, disappointed, complaint, shikayat, problem hai product, bekar product, kharab experience, not happy, disatisfied, unhappy purchase, product kharab
- **हिंदी (Devanagari):** आपको हुई परेशानी के लिए खेद है। कृपया ऑर्डर नंबर और समस्या का विवरण दें, ताकि सहायता टीम आपकी मदद कर सके।
- **English:** We're sorry for the inconvenience. Please share your order number and problem details so the support team can help.

### out_of_stock

- **Keywords:** out of stock, stock me nahi, sold out, restock, stock kab aayega, out of stock kab, available nahi hai, stock nahi hai, when back in stock, stock kab, out of stock hai, stock khatam, stock nahi
- **हिंदी (Devanagari):** दोबारा स्टॉक आने की तारीख तभी बता सकते हैं जब स्टोर इसकी पुष्टि करे। कृपया बाद में उत्पाद की सूची देखें।
- **English:** Restock dates can only be shared once the store confirms. Please check the product listing later.

### bulk_order

- **Keywords:** bulk order, bulk discount, wholesale, badi matra me, many pieces, bulk, corporate order, group order, saste me dhher saare, wholesale price, bulk purchase, bulk quantity
- **हिंदी (Devanagari):** थोक ऑर्डर पर छूट स्टोर पर निर्भर करती है। मात्रा और उत्पाद की जानकारी के साथ ग्राहक सहायता से पूछें।
- **English:** Bulk order discount availability depends on the store. Please ask store support with quantity and product details.

### custom_request

- **Keywords:** custom size, custom design, customized, custom order, made to measure, apne hisab se, custom tailoring, stitching karwani, custom fitting, special design, custom order karna, customize
- **हिंदी (Devanagari):** कस्टम साइज़ या डिज़ाइन उपलब्ध है या नहीं, इसकी पुष्टि स्टोर से करनी होगी। उत्पाद और बदलाव की जानकारी साझा करें।
- **English:** Whether custom orders are available needs confirmation from the store. Please share product and customization details.

### forgot_password

- **Keywords:** forgot password, password bhool gaya, password yaad nahi, bhool gaya password, reset password, password reset, password bhul gaya, apna password nahi, password bhul, password recover, i forgot my password, forgot my password
- **हिंदी (Devanagari):** अगर खाते की सुविधा उपलब्ध है, तो लॉगिन पेज पर ‘Forgot Password’ विकल्प चुनें।
- **English:** If the account feature is available, use the Forgot Password option on the login page.

### login_issue

- **Keywords:** cannot login, can't login, login nahi ho raha, login problem, login error, account login nahi, sign in nahi, cant login, login issue, logged in nahi, login nahi ho rha, login fail
- **हिंदी (Devanagari):** अपना ईमेल या मोबाइल नंबर जाँचें। पासवर्ड रीसेट का विकल्प आज़माएँ; समस्या बनी रहे तो ग्राहक सहायता से संपर्क करें।
- **English:** Check your email or mobile number. Use the password reset option and contact support if the issue persists.

### report_issue

- **Keywords:** website issue, site issue, bug, website error, site nahi khul raha, page error, website slow, report a problem, site problem, website problem, app issue, site down, website down, page not loading
- **हिंदी (Devanagari):** स्क्रीनशॉट, पेज का लिंक और समस्या दोहराने के चरण नोट करें। यह जानकारी वेबसाइट सहायता को भेजें।
- **English:** Note the screenshot, page link and steps that caused the issue. Send them to website support.

### account_create

- **Keywords:** account banaye, account kaise banaye, sign up, signup, register, registration, naya account, account create, id banani, account kaise banate, account banana hai, create account, register karna
- **हिंदी (Devanagari):** नया खाता बनाने के लिए ‘Sign Up’ पेज खोलें: https://apnafashionworld.web.app/signup । लॉगिन के लिए: https://apnafashionworld.web.app/login
- **English:** A new account can be created on the Sign Up page: https://apnafashionworld.web.app/signup . Use https://apnafashionworld.web.app/login to log in.

### cart_info

- **Keywords:** cart, add to cart, cart me kaise, cart kaise, bag, cart me add, remove from cart, cart items, cart kya hai, cart page, cart me product, mera cart, cart dekho, shopping bag
- **हिंदी (Devanagari):** उत्पाद पेज पर ‘Add to Cart’ दबाएँ। कार्ट में मात्रा बदलकर चेकआउट कर सकते हैं (लॉगिन ज़रूरी है): https://apnafashionworld.web.app/cart
- **English:** Use the 'Add to Cart' button on the product page. On the cart page you can update quantity and checkout (login required): https://apnafashionworld.web.app/cart

### wishlist_info

- **Keywords:** wishlist, wish list, favourite, favorite, saved items, heart icon, wishlist me kaise, wishlist kya hai, wishlist page, my wishlist, favourites, saved for later
- **हिंदी (Devanagari):** उत्पाद पेज पर दिल के निशान को दबाकर उसे विशलिस्ट में जोड़ें। सेव किए उत्पाद देखने के लिए लॉगिन के बाद यह पेज खोलें: https://apnafashionworld.web.app/wishlist
- **English:** Click the heart icon on the product page to add to wishlist. View saved items and move them to cart on the wishlist page (after login): https://apnafashionworld.web.app/wishlist

### offers

- **Keywords:** offer, offers, deal, deals, sale, koi offer, offer chal raha, any offer, current offers, running offer, promotion, sale chal raha hai, offer hai kya, discount chal raha, sale hai kya, offers kya
- **हिंदी (Devanagari):** नए ऑफ़र और सौदे देखने के लिए होमपेज के बैनर देखें: https://apnafashionworld.web.app । किसी उत्पाद की छूट जानने के लिए उसका नाम बताएं।
- **English:** Check the homepage banners for latest offers and deals: https://apnafashionworld.web.app . Share a product name to know its discount.

