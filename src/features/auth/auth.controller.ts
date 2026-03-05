import { Request, Response } from 'express';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { handleError, handleErrorAsArrayOfErrors } from '../../helpers/validationHelpers';
import { SessionService } from '../session/session.service';
import { AuthService } from './auth.service';
import { getDeviceInfo } from './helpers/auth.errors';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(SessionService) private sessionService: SessionService,
  ) {
    this.authService = authService;
    this.sessionService = sessionService;
  }
  async login(req: Request, res: Response) {
    try {
      const userAgent = req.headers['user-agent'] || 'Default';
      const ip = req.ip;
      const { deviceType, deviceName } = getDeviceInfo(userAgent);
      const normalizedDeviceName = `${deviceType}${deviceName ? ` - ${deviceName}` : ''}`;

      const { accessToken, refreshToken, refreshPayload, user } = await this.authService.login(
        req.body.loginOrEmail,
        req.body.password,
        normalizedDeviceName,
        userAgent,
        String(ip),
      );

      // TODO: move this to createSession service method
      await this.sessionService.createSession({
        deviceId: refreshPayload.deviceId,
        ip: String(ip),
        lastActiveDate: new Date(refreshPayload.iat * 1000),
        title: String(new Date().getMilliseconds() * 0.0035 + 1 + ` user-agent: ${userAgent}`),
        userId: user.id,
        // deviceName: normalizedDeviceName
      });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'development',
        })
        .json({ accessToken });
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await this.sessionService.logout(refreshToken);
      res.clearCookie('refreshToken');

      res.sendStatus(204);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
  async updateTokens(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } = await this.sessionService.updateTokens(refreshToken);

      res
        .status(200)
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'development',
        })
        .json({ accessToken });
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async registration(req: Request, res: Response): Promise<void> {
    const { email, password, login } = req.body;
    try {
      const user = await this.authService.registration({ email, password, login });
      res.status(204).json(user);
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async resendEmail(req: Request, res: Response) {
    try {
      await this.authService.resendEmail(req.body.email);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      await this.authService.confirmEmail(req.body.code, req.body.email);
      res.status(204).send();
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async me(req: Request, res: Response) {
    try {
      res.status(200).json(req.context.user);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async passwordRecovery(req: Request, res: Response) {
    try {
      await this.authService.passwordRecovery(req.body.email);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async newPassword(req: Request, res: Response) {
    try {
      await this.authService.newPassword(req.body.newPassword, req.body.recoveryCode);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }
}
