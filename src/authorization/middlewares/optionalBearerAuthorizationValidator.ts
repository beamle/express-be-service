import { NextFunction, Request, Response } from 'express';
import { AuthQueryRepository } from '../../features/auth/auth.queryRepository';
import { UsersQueryRepository } from '../../features/users/users.queryRepository';
import { UsersRepository } from '../../features/users/users.repository';
import JwtService from '../services/jwt-service';

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const authQueryRepository = new AuthQueryRepository(usersQueryRepository);

export async function optionalBearerAuthorizationValidator(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];

    if (!auth || !auth.startsWith('Bearer ')) {
        return next();
    }

    const token = auth.split(' ')[1];

    try {
        const userId = await JwtService.getUserIdByToken(token);
        if (userId) {
            const user = await authQueryRepository.getMeBy(userId);
            if (user) {
                req.context = req.context || {};
                req.context.user = user;
            }
        }
    } catch (e) {
        // If token is invalid or expired, we just ignore it for optional auth and proceed as guest
    }

    next();
}
