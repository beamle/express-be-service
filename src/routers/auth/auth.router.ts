import { Router } from 'express';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import requestLimiterMiddleware from '../request-cases-limiter/request-cases.middleware';
import { authController } from './auth.composition-root';
import { authValidators, newPasswordValidators, recoveryPasswordValidators } from './auth.middlewares';

export const authRouter = Router({});

authRouter.post(
  '/login',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.login.bind(authController),
);
authRouter.post(
  '/registration',
  requestLimiterMiddleware,
  ...authValidators,
  inputCheckErrorsFormatter,
  authController.registration.bind(authController),
);
authRouter.post(
  '/registration-confirmation',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.confirmEmail.bind(authController),
);
authRouter.post(
  '/registration-email-resending',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.resendEmail.bind(authController),
);
authRouter.post(
  '/refresh-token',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.updateTokens.bind(authController),
);
authRouter.post(
  '/logout',
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  authController.logout.bind(authController),
);
authRouter.get(
  '/me',
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  inputCheckErrorsFormatter,
  authController.me.bind(authController),
);

authRouter.post(
  '/password-recovery',
  requestLimiterMiddleware,
  ...recoveryPasswordValidators,
  inputCheckErrorsFormatter,
  authController.passwordRecovery.bind(authController),
);

authRouter.post(
  '/new-password',
  requestLimiterMiddleware,
  ...newPasswordValidators,
  inputCheckErrorsFormatter,
  authController.newPassword.bind(authController),
);
