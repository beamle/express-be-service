import { Request, Response, NextFunction } from "express";
import jwtService from "../../authorization/services/jwt-service";

export const accessTokenGuard = async (req:Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  if(!req.headers.authorization || !refreshToken) {
    return res.sendStatus(401) // Unauthorized
  }

  try {
    const payload = await jwtService.isTokenValid(refreshToken, "refresh token");
    // req.user = payload;
    return res.sendStatus(200)
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}