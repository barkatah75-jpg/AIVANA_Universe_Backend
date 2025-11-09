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
