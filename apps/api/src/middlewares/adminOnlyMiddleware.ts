import type { NextFunction, Request, Response } from 'express';
import { env } from '../lib/env';

export function adminOnlyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  if (req.header('x-admin-secret') !== env.ADMIN_SECRET) {
    return res.status(403).json({
      success: false,
      message: 'Admin secret required'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
}
