const express = require('express');
const app = express();

app.use(express.json()); // 🧩 JSON body parser

// 🌍 Dynamic port (Render or Local)
const PORT = process.env.PORT || 5000;

// ✅ Workflow Registration API
app.post("/api/register_workflows", (req, res) => {
  try {
    const data = req.body;

    // 🧠 Security check (ADMIN_SECRET check)
    if (!req.headers["x-admin-secret"] || req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    console.log("✅ Workflow Registered:", data.name);
    res.status(200).json({
      status: "success",
      message: "Workflow registered successfully",
      received: data,
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 🧩 Default route
app.get('/', (req, res) => {
  res.send('🚀 AIVANA Backend API running on port ' + PORT);
});

// 🧠 Existing routes
const usageRoutes = require("./routes/usage");
const adminRoutes = require("./routes/admin");
const internalRoutes = require("./routes/internal");

app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internal", internalRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend active on port ${PORT}`);
});
