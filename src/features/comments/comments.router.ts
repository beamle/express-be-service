import { Router } from 'express';
import 'reflect-metadata';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import { postCommentContentValidator } from '../posts/posts.middlewares';
import requestLimiterMiddleware from '../request-cases-limiter/request-cases.middleware';
import container from '../../config/container';
import { CommentsController } from './comments.controller';
import { body } from 'express-validator';
import { LikeStatus } from '../../app/db';

const commentsController = container.get(CommentsController);

export const commentsRouter = Router({ mergeParams: true });

import { optionalBearerAuthorizationValidator } from '../../authorization/middlewares/optionalBearerAuthorizationValidator';

commentsRouter.get(
  '/:id',
  requestLimiterMiddleware,
  optionalBearerAuthorizationValidator,
  commentsController.getCommentById.bind(commentsController)
);

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

const likeStatusValidator = body('likeStatus')
  .isString().withMessage('likeStatus must be a string')
  .isIn([LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike]).withMessage('likeStatus must be one of: None, Like, Dislike');

commentsRouter.put(
  '/:id/like-status',
  requestLimiterMiddleware,
  bearerAuthorizationValidator,
  likeStatusValidator,
  inputCheckErrorsFormatter,
  commentsController.updateCommentLikeStatus.bind(commentsController)
);
