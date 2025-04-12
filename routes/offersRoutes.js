const express = require('express');
const router = express.Router();
const offersController = require('../controllers/offersController');

// Dodanie oferty do przetargu
router.post('/:tenderId', offersController.addOffer);

module.exports = router;
