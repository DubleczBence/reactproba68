const express = require('express');
const bodyParser = require('body-parser');
const corsMiddleware = require('./middleware/corsMiddleware');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const szuresRoutes = require('./routes/szuresRoutes');
const errorHandler = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware)
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/main', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/main', szuresRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;