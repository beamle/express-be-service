import { Request, Response } from 'express';
import { generateUsersSortingDataObject } from '../../../helpers/objectGenerators';
import { handleError } from '../../../helpers/validationHelpers';
import { UsersQueryRepository } from '../users.queryRepository';
import { UsersService } from '../users.service';

export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {
    this.usersService = usersService;
    this.usersQueryRepository = usersQueryRepository;
  }

  async getUsers(req: Request, res: Response) {
    const sortingData = generateUsersSortingDataObject(req);
    try {
      const users = await this.usersQueryRepository.getUsers(sortingData);
      res.status(200).json(users);
      return;
    } catch (e: any) {
      handleError(res, e);
    }
  }

  async createUser(req: Request, res: Response) {
    const { email, password, login } = req.body;
    try {
      await this.usersQueryRepository.getUserBy({ email });
      await this.usersQueryRepository.getUserBy({ login });

      const createdUserId = await this.usersService.createUser({ email, password, login }, false, true);
      const user = await this.usersQueryRepository.getUserBy({ id: createdUserId.toString() });
      res.status(201).json(user);
      return;
    } catch (e: any) {
      handleError(res, e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.usersQueryRepository.getUserBy({ id });
      await this.usersService.deleteUser(id);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}
