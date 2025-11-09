const express = require('express');
const app = express();
let port = 5000;
function startServer(p){
  app.get('/', (req, res) => res.send('AIVANA Backend API running on port ' + p));
  app.listen(p, () => console.log('ðŸš€ Backend active on port', p));
}
startServer(port);
