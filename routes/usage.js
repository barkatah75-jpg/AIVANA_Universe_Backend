const express = require("express");
const router = express.Router();
const db = require("../db");
const crypto = require("crypto");

router.post("/log", async (req, res) => {
  try {
    const { userId = null, toolId = null, action = "invoke", inputPreview = "", outputPreview = "", durationMs = null } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.ip || req.connection?.remoteAddress || "";
    const ua = req.headers["user-agent"] || "";

    const inputHash = crypto.createHash("sha256").update(inputPreview || "").digest("hex");
    const outputHash = crypto.createHash("sha256").update(outputPreview || "").digest("hex");

    await db.query(
      `INSERT INTO usage_logs(user_id, tool_id, action, input_hash, output_hash, input_preview, output_preview, ip_address, user_agent, duration_ms)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [userId, toolId, action, inputHash, outputHash, inputPreview ? inputPreview.slice(0,200) : null, outputPreview ? outputPreview.slice(0,200) : null, ip, ua, durationMs]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Usage log error", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
