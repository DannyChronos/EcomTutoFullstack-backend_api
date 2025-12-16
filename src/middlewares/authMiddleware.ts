import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      name: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Token expired'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }

    return res.status(500).json({
      message: 'Token verification failed',
      error: String(error)
    });
  }
}

export function verifyAdminToken(req: AuthRequest, res: Response, next: NextFunction) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  });
}

export function verifySellerToken(req: AuthRequest, res: Response, next: NextFunction) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'seller' || 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  });
}
