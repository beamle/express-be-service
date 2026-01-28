import { Router } from 'express';
import { authMiddleware } from '../../authorization/middlewares/authorization.middleware';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import { usersController } from './users.compositionRepository';
import { usersValidators } from './users.middlewares';

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
