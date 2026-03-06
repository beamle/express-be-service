import { Router } from 'express'; import 'reflect-metadata';
import { authMiddleware } from '../../authorization/middlewares/authorization.middleware';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import container from '../../config/container';
import { PostsController } from './posts.controller';
import { middlewareObjectIdChecker, postCommentContentValidator, postInputValidators } from './posts.middlewares';

const postsController = container.get(PostsController);
export const postsRouter = Router({ mergeParams: true });

postsRouter.get('/', postsController.getPosts.bind(postsController));

postsRouter.get('/:id', postsController.getPostById.bind(postsController));

postsRouter.post(
  '/',
  authMiddleware,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.createPost.bind(postsController),
);

postsRouter.post(
  '/:blogId',
  authMiddleware,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.createPost.bind(postsController),
);

postsRouter.put(
  '/:id',
  authMiddleware,
  ...postInputValidators,
  inputCheckErrorsFormatter,
  postsController.updatePost.bind(postsController),
);

postsRouter.delete(
  '/:id',
  authMiddleware,
  middlewareObjectIdChecker,
  inputCheckErrorsFormatter,
  postsController.deletePost.bind(postsController),
);

postsRouter.post(
  '/:postId/comments',
  bearerAuthorizationValidator,
  postCommentContentValidator,
  inputCheckErrorsFormatter,
  postsController.createCommentForPost.bind(postsController),
);

import { optionalBearerAuthorizationValidator } from '../../authorization/middlewares/optionalBearerAuthorizationValidator';

postsRouter.get(
  '/:postId/comments',
  optionalBearerAuthorizationValidator,
  inputCheckErrorsFormatter,
  postsController.getCommentsByPostId.bind(postsController),
);

import { body } from 'express-validator';
import { LikeStatus } from '../../app/LikeStatus';

const likeStatusValidator = body('likeStatus')
  .isString().withMessage('likeStatus must be a string')
  .isIn([LikeStatus.None, LikeStatus.Like, LikeStatus.Dislike]).withMessage('likeStatus must be one of: None, Like, Dislike');

postsRouter.put(
  '/:id/like-status',
  bearerAuthorizationValidator,
  likeStatusValidator,
  inputCheckErrorsFormatter,
  postsController.updatePostLikeStatus.bind(postsController)
);
