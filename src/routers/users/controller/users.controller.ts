import { Request, Response } from "express";
import usersQueryRepository from "../users.queryRepository";
import { generateSortingDataObject } from "../../../helpers/objectGenerators";
import { handleError } from "../../../helpers/validationHelpers";
import usersService from "../users.service";

class UsersController {
  async getUsers(req: Request, res: Response) {
    const sortingData = generateSortingDataObject(req)
    try {
      const users = await usersQueryRepository.getUsers(sortingData)
      res.status(200).json(users)
      return
    } catch (e: any) {
      handleError(res, e)
    }
  }

  async createUser(req: Request, res: Response) {
    const { email, password, login } = req.body
    try {
      await usersQueryRepository.getUserBy({ email })
      await usersQueryRepository.getUserBy({ login })

      const createdUserId = await usersService.createUser({ email, password, login })
      const user = await usersQueryRepository.getUserBy({ id: createdUserId.toString() })
      res.status(200).json(user)
      return
    } catch (e: any) {
      handleError(res, e)
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.query
    try {
      debugger
      await usersQueryRepository.getUserBy({ id })
      await usersService.deleteUser(id as string)
      res.sendStatus(204)
      debugger
      return
    } catch (e) {
      handleError(res, e)
    }
  }

}

export default new UsersController();