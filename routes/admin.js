const express = require("express");
const router = express.Router();
const db = require("../db");

function checkAdmin(req, res, next){
  const secret = req.headers["x-admin-secret"];
  if (secret && secret === process.env.ADMIN_SECRET) return next();
  return res.status(401).json({ error: "unauthorized" });
}
router.use(checkAdmin);

router.get("/usage", async (req, res) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const offset = parseInt(req.query.offset) || 0;
    const result = await db.query("SELECT * FROM usage_logs ORDER BY timestamp DESC LIMIT $1 OFFSET $2", [limit, offset]);
    res.json({ rows: result.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/subscriptions", async (req, res) => {
  try {
    const r = await db.query("SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 200");
    res.json({ rows: r.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
