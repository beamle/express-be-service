import usersService from "../../users/users.service";
import { Request, Response } from "express";
import { handleError } from "../../../helpers/validationHelpers";
import jwtService from "../../../authorization/services/jwt-service";
import usersQueryRepository from "../../users/users.queryRepository";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      if (user) {
        const token = await jwtService.createJWT(user)
        res.status(200).json({ accessToken: token })
        return
      }
    } catch (e) {
      handleError(res, e)
    }
  }

  async register(req: Request, res: Response) {
    const { email, password, login } = req.body
    try {
      await usersQueryRepository.getUserBy({ email })
      await usersQueryRepository.getUserBy({ login })

      const createdUserId = await usersService.createUser({ email, password, login })
      if (createdUserId) {
        const user = await usersQueryRepository.getUserBy({ id: createdUserId.toString() })
        res.status(201).json(user)
        return}
    } catch (e) {
      handleError(res, e)
    }
  }

  async me(req: Request, res: Response) {
    debugger
    try {
      res.status(200).json(req.context.user)
      return
    } catch (e) {
      handleError(res, e)
    }
  }
}

export default new AuthController()