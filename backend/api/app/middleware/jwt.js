const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("[JWT]: Failed to parse authorization header");
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.log("Failed to parse authorization header");
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("[JWT]: Failed to verify JWT");
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
};

module.exports = verifyToken;