import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../shared/AppError';
import { STATUS_CODES } from '../../shared/constants/statusCodes';
import { MESSAGES } from '../../shared/constants/ResponseMessages';

const JWT_SECRET = process.env.JWT_SECRET || 'Nothing';


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError(MESSAGES.AUTH.NO_TOKEN_PROVIDED, STATUS_CODES.UNAUTHORIZED));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
      console.log(decoded,'decodedddddddd')
      if (!roles.includes(decoded.role)) {
        return next(new AppError(MESSAGES.AUTH.FORBIDDEN, STATUS_CODES.FORBIDDEN));
      }
      req.user = { userId: decoded.userId, role: decoded.role };
      console.log('Authenticated user:', req.user);
      next();
    } catch (error) {
      return next(new AppError(MESSAGES.AUTH.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED));
    }
  };
};