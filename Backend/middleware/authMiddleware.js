import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateUser = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  // Check if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  // Get the token part after 'Bearer '
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload to request object
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check for admin rights
export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin privileges required' });
    }
    next();
  };
  

  // Middleware to check for mechanic or admin rights
  export const authorizeMechanic = (req, res, next) => {
    if (req.user.role !== 'mechanic' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, mechanic privileges required' });
    }
    next();
  };