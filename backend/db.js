const mysql = require('mysql2');

// Kapcsolat létrehozása
const db = mysql.createConnection({
  host: 'localhost', // Az adatbázis szerver címe
  user: 'roote',      // Az adatbázis felhasználónév
  password: 'antiszoci',      // Az adatbázis jelszó (ha van)
  database: 'survey_app', // Az adatbázis neve
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

module.exports = db;