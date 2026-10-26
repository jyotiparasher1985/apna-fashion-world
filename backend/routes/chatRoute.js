const express = require("express");

const chatRoute = express.Router();

const replies = [
  { keywords: ["delivery", "shipping", "ship"], reply: "Delivery usually 3-7 business days ke andar hoti hai. Order place karne ke baad tracking link SMS/email par milega." },
  { keywords: ["return", "refund", "exchange"], reply: "30 days ke andar unused items return/exchange kar sakte hain. Product page par return policy check karein." },
  { keywords: ["size", "fit"], reply: "Size guide product page par available hai. Agar unsure ho to one size up choose karna safe hai." },
  { keywords: ["payment", "pay", "cod", "upi"], reply: "Hum UPI, cards, netbanking aur COD support karte hain (location ke according)." },
  { keywords: ["track", "order status"], reply: "Apna order track karne ke liye 'Track Your Order' page par order id enter karein." },
  { keywords: ["cancel"], reply: "Order ship hone se pehle cancel kar sakte hain. Shipped hone ke baad return process use karein." },
];

chatRoute.post("/", (req, res) => {
  const message = (req.body && req.body.message ? req.body.message : "").toLowerCase();
  let reply = "Namaste! Main Apna Fashion World support assistant hoon. Aap products, orders, delivery, returns, payment ya size ke baare me pooch sakte hain.";

  for (const item of replies) {
    if (item.keywords.some((k) => message.includes(k))) {
      reply = item.reply;
      break;
    }
  }

  if (message.includes("hi") || message.includes("hello") || message.includes("namaste")) {
    reply = "Namaste! Main aapki kya madad kar sakta hoon? Products, orders, delivery, returns ya size ke baare me poochhein.";
  }

  res.json({ reply });
});

module.exports = { chatRoute };