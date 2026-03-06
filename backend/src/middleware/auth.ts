import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

/**
 * RLS Simulation helper to filter queries based on user role and ID.
 * Since SQLite doesn't natively support RLS like PostgreSQL, we implement this at the data access layer.
 */
export const getRLSFilter = (user: AuthRequest['user']) => {
  if (!user) return {};

  if (user.role === 'PASSENGER') {
    return { passengerId: user.id };
  } else if (user.role === 'DRIVER') {
    return { driverId: user.id };
  } else if (user.role === 'MANAGER') {
    return {}; 
  }
  return {};
};
