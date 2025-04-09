const mysql = require('mysql2');


const db = mysql.createConnection({
  host: process.env.DB_HOST || 'interchange.proxy.rlwy.net', 
  user: process.env.DB_USER || 'root',      
  password: process.env.DB_PASS || 'tcAjUKLaLDSDhJaShJTtxXgzNmFmERjG',      
  database: process.env.DB_NAME || 'railway', 
  port: process.env.DB_PORT || '26399',
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