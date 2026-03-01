import { Router } from 'express';
import 'reflect-metadata';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import { postCommentContentValidator } from '../posts/posts.middlewares';
import requestLimiterMiddleware from '../request-cases-limiter/request-cases.middleware';
import container from './../composition-root';
import { CommentsController } from './comments.controller';

const commentsController = container.get(CommentsController);

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/:id', requestLimiterMiddleware, commentsController.getCommentById.bind(commentsController));

commentsRouter.put(
  '/:id',
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  postCommentContentValidator,
  inputCheckErrorsFormatter,
  commentsController.updateCommentForPost.bind(commentsController),
);

commentsRouter.delete(
  '/:id',
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  inputCheckErrorsFormatter,
  commentsController.deleteCommentById.bind(commentsController),
);
