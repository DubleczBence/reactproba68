const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message, err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Érvénytelen vagy lejárt token' });
    }
    
    if (err.name === 'UnauthorizedError') {
      return res.status(403).json({ error: 'Nincs megfelelő jogosultság' });
    }
    
    res.status(500).json({ 
      error: 'Szerver hiba történt',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
  module.exports = errorHandler;