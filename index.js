const express = require('express');
const app = express();
require('newrelic');
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const cors = require('cors');
require('dotenv').config();
app.use(express.static('./temp'));
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
require('./routes/dialogFlowRoutes')(app);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));