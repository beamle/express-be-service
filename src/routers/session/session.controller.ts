import { Response } from "express";
import { handleError } from "../../helpers/validationHelpers";
import { RequestWithRouteParams, RoutePathWithIdParam } from "../RequestTypes";
import sessionService from "./session.service";

class SessionController {
  //TODO: Instead this logic should go to controllers where i am going to use the session.service
  async create(
    req: RequestWithRouteParams<RoutePathWithIdParam>,
    res: Response
  ) {
    const { ip } = req;
    try {
      const createdSession = await sessionService.createSession();
      const user = req.user;

      if (!user) {
        throw new Error("User not authenticated");
      }

      return {
        user_id: user.userId, // from token
        device_id: user.deviceId, // from token
        device_name: req.headers["user-agent"] || "Unknown",
        ip: getClientIp(req),
        iat: new Date(user.iat * 1000),
        exp: new Date(user.exp * 1000),
      };
      res.status(200).json(createdSession);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}

export default new SessionController();
