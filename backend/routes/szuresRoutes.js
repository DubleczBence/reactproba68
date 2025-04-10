const express = require('express');
const router = express.Router();
const SzuresController = require('../controllers/szuresController');

router.post('/szures', SzuresController.filterUsers);

module.exports = router;