const Tender = require('../models/tenderModel');
const Offer = require('../models/offerModel');

exports.getAllTenders = (req, res) => {
  Tender.getAll((err, tenders) => {
    if (err) {
      console.error('Error fetching tenders:', err);
      return res.status(500).render('error', { 
        message: 'Error fetching tenders', 
        error: err 
      });
    }
    
    res.render('tenders', { 
      title: 'All Tenders',
      tenders: tenders 
    });
  });
};

exports.getActiveTenders = (req, res) => {
  Tender.getActive((err, tenders) => {
    if (err) {
      console.error('Error fetching active tenders:', err);
      return res.status(500).render('error', { 
        message: 'Error fetching active tenders', 
        error: err 
      });
    }
    
    res.render('tenders', { 
      title: 'Active Tenders',
      tenders: tenders 
    });
  });
};

exports.getEndedTenders = (req, res) => {
  const query = `SELECT * FROM tenders WHERE status = 'ended' ORDER BY created_at DESC`;
  
  Tender.getAll((err, allTenders) => {
    if (err) {
      console.error('Error fetching ended tenders:', err);
      return res.status(500).render('error', { 
        message: 'Error fetching ended tenders', 
        error: err 
      });
    }
    
    const endedTenders = allTenders.filter(tender => tender.status === 'ended');
    
    res.render('endedTenders', { 
      title: 'Ended Tenders',
      tenders: endedTenders 
    });
  });
};

exports.getTenderDetails = (req, res) => {
  const tenderId = req.params.id;
  
  Tender.getById(tenderId, (err, tender) => {
    if (err) {
      console.error('Error fetching tender details:', err);
      return res.status(500).render('error', { 
        message: 'Error fetching tender details', 
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
        console.error('Error fetching offers for tender:', err);
        return res.status(500).render('error', { 
          message: 'Error fetching offers', 
          error: err 
        });
      }
      
      res.render('tenderDetails', { 
        title: tender.title,
        tender: tender,
        offers: offers 
      });
    });
  });
};

exports.showAddTenderForm = (req, res) => {
  res.render('addTender', { 
    title: 'Add New Tender' 
  });
};

exports.createTender = (req, res) => {
  const tenderData = {
    title: req.body.title,
    description: req.body.description,
    budget: parseFloat(req.body.budget),
    deadline: req.body.deadline,
    status: 'active'
  };
  
  Tender.create(tenderData, (err, result) => {
    if (err) {
      console.error('Error creating tender:', err);
      return res.status(500).render('error', { 
        message: 'Error creating tender', 
        error: err 
      });
    }
    
    res.redirect('/tenders');
  });
};

exports.endTender = (req, res) => {
  const tenderId = req.params.id;
  
  Tender.endTender(tenderId, (err, result) => {
    if (err) {
      console.error('Error ending tender:', err);
      return res.status(500).render('error', { 
        message: 'Error ending tender', 
        error: err 
      });
    }
    
    res.redirect('/tenders/' + tenderId);
  });
};

exports.deleteTender = (req, res) => {
  const tenderId = req.params.id;
  
  Tender.delete(tenderId, (err, result) => {
    if (err) {
      console.error('Error deleting tender:', err);
      return res.status(500).render('error', { 
        message: 'Error deleting tender', 
        error: err 
      });
    }
    
    res.redirect('/tenders');
  });
};