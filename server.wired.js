const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

const usageRoutes = require("./routes/usage");
const adminRoutes = require("./routes/admin");
const internalRoutes = require("./routes/internal");

app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internal", internalRoutes);

app.get("/", (req,res) => res.send("AIVANA Backend is live"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("✅ Backend active on port", PORT));
