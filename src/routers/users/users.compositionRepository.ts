import { UsersController } from './controller/users.controller';
import { UsersQueryRepository } from './users.queryRepository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository(usersRepository);
const usersService = new UsersService(usersQueryRepository, usersRepository);
export const usersController = new UsersController(usersService, usersQueryRepository);
