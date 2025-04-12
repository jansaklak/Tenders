const express = require('express');
const router = express.Router();
const tendersController = require('../controllers/tendersController');
const offersController = require('../controllers/offersController');

// Tender routes
router.get('/', tendersController.getAllTenders);
router.get('/active', tendersController.getActiveTenders);
router.get('/ended', tendersController.getEndedTenders);
router.get('/add', tendersController.showAddTenderForm);
router.post('/add', tendersController.createTender);
router.get('/:id', tendersController.getTenderDetails);
router.post('/:id/end', tendersController.endTender);
router.post('/:id/delete', tendersController.deleteTender);

// Offer routes
router.get('/:tenderId/offers', offersController.getAllOffers);
router.get('/:tenderId/offers/add', offersController.showAddOfferForm);
router.post('/:tenderId/offers/add', offersController.createOffer);
router.post('/:tenderId/offers/:id/delete', offersController.deleteOffer);

module.exports = router;