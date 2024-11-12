import { Request, Response } from "express";
import usersQueryRepository from "../users.queryRepository";
import { generateSortingDataObject } from "../../../helpers/objectGenerators";
import { handleError } from "../../../helpers/validationHelpers";

class UsersController {
  async getUsers(req: Request, res: Response) {
    const sortingData = generateSortingDataObject(req)
    try {
      const users = await usersQueryRepository.getUsers(sortingData)
      res.status(200).json(users)
    } catch (e) {
      handleError(e, res)
    }
  }
}

export default new UsersController();