const db = require('../db/db');

class Offer {
  static getAllForTender(tenderId, callback) {
    const query = `SELECT id, tender_id, company_name, contact_email, price, proposal, submitted_at 
                  FROM offers 
                  WHERE tender_id = ?
                  ORDER BY price ASC`;
    
    db.all(query, [tenderId], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, rows);
    });
  }

  static getById(id, callback) {
    const query = `SELECT id, tender_id, company_name, contact_email, price, proposal, submitted_at 
                  FROM offers 
                  WHERE id = ?`;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, row);
    });
  }

  static create(offerData, callback) {
    const query = `INSERT INTO offers (tender_id, company_name, contact_email, price, proposal) 
                  VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [
      offerData.tender_id,
      offerData.company_name,
      offerData.contact_email,
      offerData.price,
      offerData.proposal
    ], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id: this.lastID, ...offerData });
    });
  }

  static update(id, offerData, callback) {
    const query = `UPDATE offers 
                  SET company_name = ?, contact_email = ?, price = ?, proposal = ? 
                  WHERE id = ?`;
    
    db.run(query, [
      offerData.company_name,
      offerData.contact_email,
      offerData.price,
      offerData.proposal,
      id
    ], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id, ...offerData, changes: this.changes });
    });
  }

  static delete(id, callback) {
    const query = `DELETE FROM offers WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id, deleted: this.changes > 0 });
    });
  }
}

module.exports = Offer;