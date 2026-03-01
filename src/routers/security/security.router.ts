import { Router } from 'express';import 'reflect-metadata';
import { refreshTokenValidator } from '../../authorization/middlewares/refreshTokenValidator';
import container from '../composition-root';
import { SecurityController } from './security.controller';

const securityController = container.get(SecurityController);

export const securityRouter = Router({ mergeParams: true });
export const sessionMetaRouter = Router({ mergeParams: true });

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
