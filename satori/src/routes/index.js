// src/routes/index.js
const express = require('express');
const router = express.Router();
const { handleRequest } = require('../controllers/fileController');

router.post('/process', handleRequest);

module.exports = router;
