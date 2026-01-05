import { Router } from 'express';
import { refreshTokenValidator } from '../../authorization/middlewares/refreshTokenValidator';
import securityController from './security.controller';

export const securityRouter = Router({ mergeParams: true });
export const sessionMetaRouter = Router({ mergeParams: true });

securityRouter.get('/devices', refreshTokenValidator, securityController.getAllSessions);

securityRouter.delete('/devices/:deviceId', refreshTokenValidator, securityController.deleteDeviceSessionByDeviceId);

securityRouter.delete('/devices', refreshTokenValidator, securityController.deleteAllSessionsExceptCurrent);
