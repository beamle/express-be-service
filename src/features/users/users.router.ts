import { Router } from 'express';import 'reflect-metadata';
import { authMiddleware } from '../../authorization/middlewares/authorization.middleware';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import container from '../../config/container';
import { UsersController } from './users.controller';
import { usersValidators } from './users.middlewares';

const usersController = container.get(UsersController);
export const usersRouter = Router({ mergeParams: true });

usersRouter.get('/', usersController.getUsers.bind(usersController));

usersRouter.post(
  '/',
  authMiddleware,
  ...usersValidators,
  inputCheckErrorsFormatter,
  usersController.createUser.bind(usersController),
);

usersRouter.delete('/:id', authMiddleware, inputCheckErrorsFormatter, usersController.deleteUser.bind(usersController));
