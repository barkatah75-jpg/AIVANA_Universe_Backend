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
   ORDERS
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
    status: "Shipped"
  });
});

/* =========================
   ANALYTICS
========================= */
app.get("/api/analytics/profit", (req, res) => {
  res.json({
    revenue: 12000,
    profit: 5200,
    margin: 43
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
      eta: "2025-01-25"
    }
  ]);
});

/* =========================
   RETURNS
========================= */
app.get("/api/returns", (req, res) => {
  res.json([
    { id: "RET-001", orderId: "ORD-1001", status: "Pending" }
  ]);
});

app.post("/api/returns/:id/approve", (req, res) => {
  res.json({ success: true, id: req.params.id });
});

/* =========================
   SUPPORT
========================= */
app.get("/api/support/messages", (req, res) => {
  res.json([
    { from: "Customer", message: "Where is my order?" }
  ]);
});

app.post("/api/support/reply", (req, res) => {
  res.json({ success: true });
});

/* =========================
   STATS
========================= */
app.get("/api/stats", (req, res) => {
  res.json({
    orders: 124,
    profit: 4520,
    delayed: 3,
    returns: 5
  });
});

/* =========================
   SERVER START (RENDER SAFE)
========================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 AIVANA Backend API running on port ${PORT}`);
});
