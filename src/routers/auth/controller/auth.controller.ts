import usersService from "../../users/users.service";
import { Request, Response } from "express";
import { handleError } from "../../../helpers/validationHelpers";

class AuthController {
  async authenticate(req: Request, res: Response) {
    try {
      debugger
      const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      res.send(204)
    } catch (e) {
      debugger
      handleError(res, e)
    }
  }
}

export default new AuthController()