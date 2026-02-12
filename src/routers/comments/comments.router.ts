import { Router } from 'express';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import { postCommentContentValidator } from '../posts/posts.middlewares';
import requestLimiterMiddleware from '../request-cases-limiter/request-cases.middleware';
import { CommentsController } from './comments.controller';
import { commentsController } from '../composition-root';

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
