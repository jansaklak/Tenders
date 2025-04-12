const express = require('express');
const router = express.Router();
const tendersController = require('../controllers/tendersController');

// Strona główna - aktywne przetargi
router.get('/', tendersController.listActiveTenders);

// Formularz dodawania przetargu
router.get('/tenders/new', tendersController.showAddTenderForm);

// Obsługa dodania nowego przetargu
router.post('/tenders', tendersController.addTender);

// Szczegóły przetargu
router.get('/tenders/:id', tendersController.showTenderDetails);

// Lista zakończonych przetargów
router.get('/ended-tenders', tendersController.listEndedTenders);

module.exports = router;
