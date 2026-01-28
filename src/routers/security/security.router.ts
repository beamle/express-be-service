import { Router } from 'express';
import { refreshTokenValidator } from '../../authorization/middlewares/refreshTokenValidator';
import { SessionRepository } from '../session/session.repository';
import { SessionService } from '../session/session.service';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { SecurityController } from './security.controller';

export const securityRouter = Router({ mergeParams: true });
export const sessionMetaRouter = Router({ mergeParams: true });

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const usersService = new UsersService(usersQueryRepository, usersRepository);
const sessionRepository = new SessionRepository();
const sessionService = new SessionService(usersService, sessionRepository);
const securityController = new SecurityController(sessionService);

securityRouter.get('/devices', refreshTokenValidator, securityController.getAllSessions.bind(securityController));

securityRouter.delete(
  '/devices/:deviceId',
  refreshTokenValidator,
  securityController.deleteDeviceSessionByDeviceId.bind(securityController),
);

securityRouter.delete(
  '/devices',
  refreshTokenValidator,
  securityController.deleteAllSessionsExceptCurrent.bind(securityController),
);
