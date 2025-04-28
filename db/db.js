const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.resolve(__dirname, '../database');

if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory at: ${dbDir}`);
  } catch (err) {
    console.error(`Error creating database directory: ${err.message}`);
    console.error(`Attempted to create directory at: ${dbDir}`);
    process.exit(1); // Exit the application if we can't create the directory
  }
}

const dbPath = path.join(dbDir, 'database.db');
console.log(`Attempting to connect to database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    console.error(`Check if the path exists and is writable: ${dbPath}`);
    process.exit(1);
  } else {
    console.log(`Successfully connected to the SQLite database at: ${dbPath}`);
    
    db.run(`CREATE TABLE IF NOT EXISTS tenders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      budget REAL,
      deadline TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating tenders table:', err.message);
      } else {
        console.log('Tenders table ready');
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tender_id INTEGER,
      company_name TEXT NOT NULL,
      contact_email TEXT,
      price REAL NOT NULL,
      proposal TEXT,
      submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tender_id) REFERENCES tenders (id)
    )`, (err) => {
      if (err) {
        console.error('Error creating offers table:', err.message);
      } else {
        console.log('Offers table ready');
      }
    });
  }
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database connection:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = db;