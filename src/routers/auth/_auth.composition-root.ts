import { JwtService } from '../../authorization/services/jwt-service';
import { SessionRepository } from '../session/session.repository';
import { SessionService } from '../session/session.service';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthController } from './controller/auth.controller';

const jwtService = new JwtService();
const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const usersService = new UsersService(usersQueryRepository, usersRepository);
const authService = new AuthService(usersService, jwtService, usersRepository);
const sessionRepository = new SessionRepository();
const sessionService = new SessionService(usersService, sessionRepository);

export const authController = new AuthController(sessionService, authService);
