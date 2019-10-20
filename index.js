// require('newrelic');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
const path = require('path');
const fs = require('fs');
const tempPath = path.join(process.cwd(), 'temp');
console.log(tempPath);
const routesPath = path.join(process.cwd(), 'routes/dialogFlowRoutes');
console.log(routesPath);

// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const cors = require('cors');
require('dotenv').config();
app.use(express.static(`${tempPath}`));
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
require(`${routesPath}`)(app);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));