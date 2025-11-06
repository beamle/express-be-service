import { Request, Response } from 'express';
import { handleError } from '../../helpers/validationHelpers';
import sessionService from '../session/session.service';

class SecurityController {
  async getAllSessions(req: Request, res: Response) {
    try {
      // const me = await authService;
      const sessions = await sessionService.getAllSessionsBy(req.context.user?.userId);
      res.status(200).json(sessions);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }

  // async getCurrentSession(req:Request, res: Response) {
  //   try {
  //     // const me = await authService;
  //     const sessions = await sessionService.getCurrentSession(req.context.user?.userId);
  //     res.status(200).json(sessions);
  //     return;
  //   } catch (error) {
  //     handleError(res, error);
  //   }
  // }

  async deleteAllSessionsExceptCurrent(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await sessionService.deleteAllSessionsExceptCurrent(refreshToken);
      res.sendStatus(204);
    } catch (e) {
      handleError(res, e);
    }
  }


  async deleteDeviceSession(req: Request, res: Response) {}
}

export default new SecurityController();
