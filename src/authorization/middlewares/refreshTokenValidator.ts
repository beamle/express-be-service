import { NextFunction, Request, Response } from 'express';
import { SETTINGS } from '../../app/settings';
import { handleError } from '../../helpers/validationHelpers';
import { AuthQueryRepository } from '../../routers/auth/auth.queryRepository';
import { UsersQueryRepository } from '../../routers/users/users.queryRepository';
import { UsersRepository } from '../../routers/users/users.repository';
import JwtService from '../services/jwt-service';

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const authQueryRepository = new AuthQueryRepository(usersQueryRepository);

export async function refreshTokenValidator(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token is missing or expired.' });
    return;
  }

  try {
    const jwtData = await JwtService.parseAndValidateRefreshToken(
      refreshToken,
      SETTINGS.JWT_SECRET, // Use the appropriate secret for Refresh Tokens
    );

    if (jwtData.userId) {
      const user = await authQueryRepository.getMeBy(jwtData.userId);

      if (!user) {
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      req.context.user = user;
      next();
    } else {
      res.status(401).json({ message: 'Invalid refresh token payload.' });
      return;
    }
  } catch (e) {
    handleError(res, e);
  }
}
