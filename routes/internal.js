const express = require("express");
const router = express.Router();
const checkTrials = require("../cron/checkTrials");

function checkInternal(req, res, next){
  const token = req.headers["x-internal-secret"] || req.query.secret;
  if (token && token === process.env.INTERNAL_CRON_SECRET) return next();
  return res.status(401).json({ error: "unauthorized" });
}

router.post("/run-check-trials", checkInternal, async (req, res) => {
  try {
    await checkTrials();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
