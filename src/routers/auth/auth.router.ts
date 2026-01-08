import { Router } from 'express';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import requestLimiterMiddleware from '../request-cases-limiter/request-cases.middleware';
import { authValidators } from './auth.middlewares';
import authController from './controller/auth.controller';

export const authRouter = Router({});

authRouter.post('/login', requestLimiterMiddleware, inputCheckErrorsFormatter, authController.login);
authRouter.post(
  '/registration',
  requestLimiterMiddleware,
  ...authValidators,
  inputCheckErrorsFormatter,
  authController.registration,
);
authRouter.post(
  '/registration-confirmation',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.confirmEmail,
);
authRouter.post(
  '/registration-email-resending',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.resendEmail,
);
authRouter.post('/refresh-token', requestLimiterMiddleware, inputCheckErrorsFormatter, authController.updateTokens);
authRouter.post('/logout', requestLimiterMiddleware, inputCheckErrorsFormatter, authController.logout);
authRouter.get(
  '/me',
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  inputCheckErrorsFormatter,
  authController.me,
);
