const express = require('express');
const router = express.Router();
router.use('/contact', require('./nodemail'));
module.exports = router;