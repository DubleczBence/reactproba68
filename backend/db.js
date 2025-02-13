const mysql = require('mysql2');


const db = mysql.createConnection({
  host: 'localhost', 
  user: 'rootee',      
  password: 'jelszo',      
  database: 'survey_app', 
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