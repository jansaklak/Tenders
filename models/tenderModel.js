const db = require('../db/db');

class Tender {
  static getAll(callback) {
    const query = `SELECT id, title, description, budget, deadline, status, created_at 
                  FROM tenders 
                  ORDER BY created_at DESC`;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, rows);
    });
  }

  static getById(id, callback) {
    const query = `SELECT id, title, description, budget, deadline, status, created_at 
                  FROM tenders 
                  WHERE id = ?`;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, row);
    });
  }

  static getActive(callback) {
    const query = `SELECT id, title, description, budget, deadline, status, created_at 
                  FROM tenders 
                  WHERE status = 'active' AND deadline >= date('now')
                  ORDER BY created_at DESC`;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, rows);
    });
  }

  static create(tenderData, callback) {
    const query = `INSERT INTO tenders (title, description, budget, deadline, status) 
                  VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [
      tenderData.title,
      tenderData.description,
      tenderData.budget,
      tenderData.deadline,
      tenderData.status || 'active'
    ], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id: this.lastID, ...tenderData });
    });
  }

  static update(id, tenderData, callback) {
    const query = `UPDATE tenders 
                  SET title = ?, description = ?, budget = ?, deadline = ?, status = ? 
                  WHERE id = ?`;
    
    db.run(query, [
      tenderData.title,
      tenderData.description,
      tenderData.budget,
      tenderData.deadline,
      tenderData.status,
      id
    ], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id, ...tenderData, changes: this.changes });
    });
  }

  static delete(id, callback) {
    const query = `DELETE FROM tenders WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id, deleted: this.changes > 0 });
    });
  }

  static endTender(id, callback) {
    const query = `UPDATE tenders SET status = 'ended' WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      return callback(null, { id, ended: this.changes > 0 });
    });
  }
}

module.exports = Tender;