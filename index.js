const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
require('./routes/dialogFlowRoutes')(app);

app.listen(PORT);