import { handleError } from "../../helpers/validationHelpers";
import authQueryRepository from "../../routers/auth/auth.queryRepository";
import { SETTINGS } from "../../app/settings";
import { NextFunction, Request, Response } from "express";
import jwtService from "../services/jwt-service";

export async function refreshTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is missing or expired." });
    return;
  }

  try {
    const jwtData = await jwtService.parseAndValidateRefreshToken(
      refreshToken,
      SETTINGS.JWT_SECRET // Use the appropriate secret for Refresh Tokens
    );

    if (jwtData.userId) {
      const user = await authQueryRepository.getMeBy(jwtData.userId);

      if (!user) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      req.context.user = user;
      next();
    } else {
      res.status(401).json({ message: "Invalid refresh token payload." });
      return;
    }
  } catch (e) {
    handleError(res, e);
  }
}