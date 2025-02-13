const express = require('express');
const bodyParser = require('body-parser');
const szuresRoutes = require('./routes/szuresRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const homeRoutes = require('./routes/homeRoutes');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use('/api/users', userRoutes); 
app.use('/api/main', szuresRoutes);
app.use('/api/main', homeRoutes); 
app.use('/api/companies', companyRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});