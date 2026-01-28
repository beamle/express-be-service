import { Router } from 'express';
import { authMiddleware } from '../../authorization/middlewares/authorization.middleware';
import { bearerAuthorizationValidator } from '../../authorization/middlewares/bearerAuthorizationValidator';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import { PostsController } from './controller/posts.controller';
import { middlewareObjectIdChecker, postCommentContentValidator, postInputValidators } from './posts.middlewares';

export const postsRouter = Router({ mergeParams: true });
export const postsController = new PostsController();

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

postsRouter.get(
  '/:postId/comments',
  inputCheckErrorsFormatter,
  postsController.getCommentsByPostId.bind(postsController),
);
