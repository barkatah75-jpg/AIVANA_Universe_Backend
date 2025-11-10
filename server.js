const express = require('express');
const app = express();

// Dynamic port (Render or Local)
const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', (req, res) => {
  res.send('🚀 AIVANA Backend API running on port ' + PORT);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend active on port ${PORT}`);
});

const usageRoutes = require("./routes/usage");
const adminRoutes = require("./routes/admin");
const internalRoutes = require("./routes/internal");

app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/internal", internalRoutes);
