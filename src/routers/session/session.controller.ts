import { Response } from "express";
import { ObjectId } from "mongodb";
import { handleError } from "../../helpers/validationHelpers";
import { RequestWithRouteParams, RoutePathWithIdParam } from "../RequestTypes";
import sessionService from "./session.service";

class SessionController {
  async create(
    req: RequestWithRouteParams<RoutePathWithIdParam>,
    res: Response
  ) {
    const { ip } = req;
    try {
      const createdSession = await sessionService.createSession();
      res.status(200).json(createdSession);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}

export default new SessionController();
