import { NextFunction, Request, Response } from 'express';
import { handleError } from '../../helpers/validationHelpers';
import { AuthQueryRepository } from '../../routers/auth/auth.queryRepository';
import { UsersQueryRepository } from '../../routers/users/users.queryRepository';
import { UsersRepository } from '../../routers/users/users.repository';
import JwtService from '../services/jwt-service';

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const authQueryRepository = new AuthQueryRepository(usersQueryRepository);

export async function bearerAuthorizationValidator(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers['authorization'];
  debugger;
  if (!auth) {
    res.status(401).json({ message: 'No authorization header' });
    return;
  }

  if (!auth.startsWith('Bearer')) {
    res.status(401).json({ message: 'Invalid authorization type' });
    return;
  }

  const token = req.headers.authorization!.split(' ')[1];

  try {
    const userId = await JwtService.getUserIdByToken(token);
    if (userId) {
      const user = await authQueryRepository.getMeBy(userId);
      req.context.user = user;
      next();
    }
  } catch (e) {
    handleError(res, e);
  }
}
