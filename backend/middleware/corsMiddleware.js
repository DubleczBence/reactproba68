const cors = require('cors');

// Basic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from these origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://optify-frontend.vercel.app',
      'https://optify-survey.vercel.app',
      'https://optify.onrender.com',
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200 // For legacy browser support
};

// Export the configured CORS middleware
module.exports = cors(corsOptions);