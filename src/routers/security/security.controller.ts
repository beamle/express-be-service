import { Request, Response } from 'express';
import { SETTINGS } from '../../app/settings';
import JwtService from '../../authorization/services/jwt-service';
import { handleError } from '../../helpers/validationHelpers';
import { SessionService } from '../session/session.service';

export class SecurityController {
  constructor(private sessionService: SessionService) {
    this.sessionService = sessionService;
  }
  async getAllSessions(req: Request, res: Response) {
    const sessionData = await JwtService.parseAndValidateRefreshToken(req.cookies?.refreshToken, SETTINGS.JWT_SECRET);

    try {
      const sessions = await this.sessionService.getAllSessionsBy(sessionData.userId, sessionData.iat);
      res.status(200).json(sessions);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteAllSessionsExceptCurrent(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await this.sessionService.deleteAllSessionsExceptCurrent(refreshToken);
      res.sendStatus(204);
    } catch (e) {
      handleError(res, e);
    }
  }

  async deleteDeviceSessionByDeviceId(req: Request, res: Response) {
    try {
      const userId = req.context.user?.userId;
      const { deviceId } = req.params;

      await this.sessionService.deleteDeviceSessionByDeviceId(userId, deviceId);
      res.sendStatus(204);
    } catch (e) {
      handleError(res, e);
    }
  }
}
