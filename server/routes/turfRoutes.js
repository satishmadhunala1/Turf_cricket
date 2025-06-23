const express = require('express');
const router = express.Router();
const { getTurfs, getTurfById } = require('../controllers/turfController');

router.get('/', getTurfs);
router.get('/:id', getTurfById);

module.exports = router;