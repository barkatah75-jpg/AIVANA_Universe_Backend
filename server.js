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
    {
      id: "ORD-1001",
      country: "Germany",
      amount: 49.99,
      profit: 22.5,
      status: "Shipped"
    },
    {
      id: "ORD-1002",
      country: "USA",
      amount: 69.99,
      profit: 31.2,
      status: "Processing"
    }
  ]);
});

app.get("/api/orders/:id", (req, res) => {
  res.json({
    id: req.params.id,
    country: "Germany",
    amount: 49.99,
    profit: 22.5,
    status: "Shipped",
    items: [{ sku: "SKU-BOHO-01", qty: 1 }]
  });
});

/* =========================
   ANALYTICS
========================= */
app.get("/api/analytics/profit", (req, res) => {
  res.json({
    revenue: 12000,
    profit: 5200,
    margin: 43,
    countries: {
      Germany: 3200,
      USA: 4800,
      UK: 2000
    }
  });
});

/* =========================
   SHIPMENTS
========================= */
app.get("/api/shipments", (req, res) => {
  res.json([
    {
      orderId: "ORD-1001",
      carrier: "Aramex",
      status: "In Transit",
      tracking: "ARX123456",
      eta: "2025-01-25"
    }
  ]);
});

/* =========================
   RETURNS
========================= */
app.get("/api/returns", (req, res) => {
  res.json([
    {
      id: "RET-001",
      orderId: "ORD-1001",
      reason: "Damaged item",
      status: "Pending"
    }
  ]);
});

app.post("/api/returns/:id/approve", (req, res) => {
  res.json({
    success: true,
    returnId: req.params.id,
    action: "Refund Approved"
  });
});

/* =========================
   CUSTOMER SUPPORT
========================= */
app.get("/api/support/messages", (req, res) => {
  res.json([
    {
      from: "Customer",
      message: "Where is my order?",
      time: "2 hours ago"
    }
  ]);
});

app.post("/api/support/reply", (req, res) => {
  res.json({
    success: true,
    reply: req.body.message
  });
});

/* =========================
   REAL-TIME STATS
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
   GEMINI AI ENDPOINT
========================= */
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

/* =========================
   SERVER START (RENDER SAFE)
========================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 AIVANA Backend API running on port ${PORT}`);
});
