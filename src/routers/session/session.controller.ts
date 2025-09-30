import { handleError } from "../../helpers/validationHelpers";
import sessionService from "./session.service";

class SessionController {
  async getAllSessions(req: Request, res: Response) {
    try {
      const sessions = await sessionService.getAllSessionsBy(userId);
      res.status(200).json(sessions);
      return;
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new SessionController();
