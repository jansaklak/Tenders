const Offer = require('../models/offerModel');
const Tender = require('../models/tenderModel');

// Get all offers for a tender
exports.getAllOffers = (req, res) => {
  const tenderId = req.params.tenderId;
  
  Tender.getById(tenderId, (err, tender) => {
    if (err) {
      console.error('Error fetching tender:', err);
      return res.status(500).render('error', { 
        message: 'Error fetching tender', 
        error: err 
      });
    }
    
    if (!tender) {
      return res.status(404).render('error', { 
        message: 'Tender not found', 
        error: { status: 404 } 
      });
    }
    
    Offer.getAllForTender(tenderId, (err, offers) => {
      if (err) {
        console.error('Error fetching offers:', err);
        return res.status(500).render('error', { 
          message: 'Error fetching offers', 
          error: err 
        });
      }
      
      res.render('offers', { 
        title: `Offers for ${tender.title}`,
        tender: tender,
        offers: offers 
      });
    });
  });
};

// Display add offer form
exports.showAddOfferForm = (req, res) => {
  const tenderId = req.params.tenderId;
  
  Tender.getById(tenderId, (err, tender) => {
    if (err) {
      console.error('Error fetching tender:', err);
      return res.status(500).render('error', { 
        message: 'Error fetching tender', 
        error: err 
      });
    }
    
    if (!tender) {
      return res.status(404).render('error', { 
        message: 'Tender not found', 
        error: { status: 404 } 
      });
    }
    
    if (tender.status !== 'active') {
      return res.status(400).render('error', { 
        message: 'Cannot add offers to closed tenders', 
        error: { status: 400 } 
      });
    }
    
    res.render('addOffer', { 
      title: `Submit Offer for ${tender.title}`,
      tender: tender 
    });
  });
};

// Create a new offer
exports.createOffer = (req, res) => {
  const tenderId = req.params.tenderId;
  
  const offerData = {
    tender_id: tenderId,
    company_name: req.body.company_name,
    contact_email: req.body.contact_email,
    price: parseFloat(req.body.price),
    proposal: req.body.proposal
  };
  
  Offer.create(offerData, (err, result) => {
    if (err) {
      console.error('Error creating offer:', err);
      return res.status(500).render('error', { 
        message: 'Error creating offer', 
        error: err 
      });
    }
    
    res.redirect(`/tenders/${tenderId}`);
  });
};

// Delete an offer
exports.deleteOffer = (req, res) => {
  const offerId = req.params.id;
  const tenderId = req.params.tenderId;
  
  Offer.delete(offerId, (err, result) => {
    if (err) {
      console.error('Error deleting offer:', err);
      return res.status(500).render('error', { 
        message: 'Error deleting offer', 
        error: err 
      });
    }
    
    res.redirect(`/tenders/${tenderId}`);
  });
};