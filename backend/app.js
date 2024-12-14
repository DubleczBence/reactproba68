const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use('/api/users', userRoutes); // A felhasználói API végpontok
app.use('/api/companies', companyRoutes);

// Indítsd el a szervert
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});