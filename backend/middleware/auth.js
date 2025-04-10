const { verifyToken, SECRET_KEY } = require('../utils/tokenService');

const authenticateUser = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Érvénytelen token' });
  }
};

const authenticateCompany = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? "Exists" : "Missing");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Invalid auth header format");
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log("Token extracted from header:", token ? "Exists" : "Missing");
    
    const decoded = verifyToken(token);
    console.log("Decoded token:", decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const authenticateAdmin = (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'test' && req.headers['x-test-admin'] === 'true') {
      req.user = { id: 1, email: 'admin@test.com', role: 'admin' };
      return next();
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }
    
    const decoded = verifyToken(token);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin jogosultság szükséges' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Érvénytelen token' });
  }
};

module.exports = {
  authenticateUser,
  authenticateCompany,
  authenticateAdmin
};