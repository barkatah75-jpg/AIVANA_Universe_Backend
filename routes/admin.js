const express = require("express");
const router = express.Router();

// 🧠 Secure Admin Route - Demo Mode (No DB required)
router.get("/usage", (req, res) => {
  const adminSecret = process.env.ADMIN_SECRET;
  const clientSecret = req.headers["x-admin-secret"];

  // 🔐 Security validation
  if (!clientSecret || clientSecret !== adminSecret) {
    return res.status(403).json({
      status: "error",
      message: "Unauthorized: Invalid admin secret key",
    });
  }

  // 📊 Demo usage logs
  const mockLogs = [
    {
      userId: 1,
      toolId: 401,
      input: "AI Workflow Register Test",
      output: "Success",
      timestamp: new Date().toISOString(),
    },
    {
      userId: 2,
      toolId: 402,
      input: "Sync Validation",
      output: "Data Synced",
      timestamp: new Date().toISOString(),
    },
    {
      userId: 3,
      toolId: 403,
      input: "System Health Check",
      output: "Backend Online",
      timestamp: new Date().toISOString(),
    },
  ];

  res.status(200).json({
    status: "success",
    message: "Demo usage log (no DB connected)",
    total: mockLogs.length,
    data: mockLogs,
  });
});

module.exports = router;
