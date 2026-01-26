import { NextFunction, Request, Response } from 'express';
import JwtService from '../../authorization/services/jwt-service';

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!req.headers.authorization || !refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const payload = await JwtService.isTokenValid(refreshToken, 'refresh token');
    // req.user = payload;
    return res.sendStatus(200);
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
