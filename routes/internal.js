const express = require("express");
const router = express.Router();

// 🧠 Internal route for fetching all registered workflows
router.get("/list_workflows", (req, res) => {
  const adminSecret = process.env.ADMIN_SECRET;
  const clientSecret = req.headers["x-admin-secret"];

  if (!clientSecret || clientSecret !== adminSecret) {
    return res.status(403).json({
      status: "error",
      message: "Unauthorized: Invalid admin secret key",
    });
  }

  // Demo mock data (replace later with DB fetch)
  const workflows = [
    {
      id: 1,
      name: "AI Health Monitor",
      sector: "Healthcare",
      framework: "TensorFlow",
      status: "active",
    },
    {
      id: 2,
      name: "Finance Forecast Engine",
      sector: "Finance",
      framework: "PyTorch",
      status: "active",
    },
    {
      id: 3,
      name: "AgriSmart Crop Vision",
      sector: "Agriculture",
      framework: "PyTorch",
      status: "active",
    },
  ];

  res.status(200).json({
    status: "success",
    message: "Fetched registered workflows",
    data: workflows,
  });
});

module.exports = router;
