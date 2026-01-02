import express from "express";
import cors from "cors";

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   ROOT TEST
========================= */
app.get("/", (req, res) => {
  res.send("AIVANA Backend is LIVE");
});

/* =========================
   ORDERS APIs
========================= */
app.get("/api/orders", (req, res) => {
  res.json([
    { id: "ORD-1001", country: "Germany", amount: 49.99, profit: 22.5, status: "Shipped" },
    { id: "ORD-1002", country: "USA", amount: 69.99, profit: 31.2, status: "Processing" }
  ]);
});

/* =========================
   STATS
========================= */
app.get("/api/stats", (req, res) => {
  res.json({
    totalOrders: 124,
    totalProfit: 4520,
    delayedShipments: 3,
    returnRate: "4.2%"
  });
});

/* =========================
   GEMINI AI (FINAL FIX)
========================= */
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 AIVANA Backend API running on port ${PORT}`);
});
