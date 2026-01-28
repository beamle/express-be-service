import { Router } from 'express';
import { authMiddleware } from '../../authorization/middlewares/authorization.middleware';
import { inputCheckErrorsFormatter } from '../../helpers/validationHelpers';
import { PostsController } from '../posts/controller/posts.controller';
import {
  postContentInputValidator,
  postShortDescriptionInputValidator,
  postTitleInputValidator,
} from '../posts/posts.middlewares';
import requestLimiterMiddleware from '../request-cases-limiter/request-cases.middleware';
import { blogIdAsParamValidator, blogInputValidators } from './blogs.middlewares';
import { BlogsController } from './controller/blogs.controller';

export const blogsRouter = Router({ mergeParams: true });

const blogsController = new BlogsController();
const postsController = new PostsController();

blogsRouter.get('/', requestLimiterMiddleware, blogsController.getBlogs.bind(blogsController));

blogsRouter.get('/test-cord', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

blogsRouter.get(
  '/:blogId/posts',
  // authMiddleware,
  requestLimiterMiddleware,
  blogIdAsParamValidator,
  inputCheckErrorsFormatter,
  postsController.getPosts.bind(postsController),
);

blogsRouter.get(
  '/:id',
  // blogIdInputValidator,
  requestLimiterMiddleware,
  inputCheckErrorsFormatter,
  blogsController.getBlogById.bind(blogsController),
);

blogsRouter.post(
  '/:blogId/posts',
  authMiddleware,
  requestLimiterMiddleware,
  blogIdAsParamValidator,
  postContentInputValidator,
  postShortDescriptionInputValidator,
  postTitleInputValidator,
  inputCheckErrorsFormatter,
  postsController.createPost.bind(postsController),
);

blogsRouter.post(
  '/',
  authMiddleware,
  requestLimiterMiddleware,
  ...blogInputValidators,
  inputCheckErrorsFormatter,
  blogsController.createBlog.bind(blogsController),
);

blogsRouter.put(
  '/:id',
  requestLimiterMiddleware,
  authMiddleware,
  ...blogInputValidators,
  // blogIdInputValidator,
  inputCheckErrorsFormatter,
  blogsController.updateBlog.bind(blogsController),
);
// blogsRouter.put("/:id", (req, res) => blogsController.updateBlog(req, res)) // If you pass directly like that,
// then THIS obj is lost, because This is because JavaScript’s default
// behavior is that function references lose their original THIS context
// unless they are explicitly bound. `this` is undefined inside `updateBlog

// I Pass blogsController.updateBlog reference, and express invokes it in another function from another Object. If not, the it refers to global Object -> result is undefined.
// function declaration "THIS" depends on WHERE the function is called (context)
// Not where its being declared. So i pass the METHOD without blogsController itself.
// with callback i call updateBlog explicitly from blogsController object -> BINDS THIS no blogsController object.
blogsRouter.delete(
  '/:id',
  requestLimiterMiddleware,
  authMiddleware,
  // middlewareObjectIdChecker,
  // blogIdInputValidator,
  inputCheckErrorsFormatter,
  blogsController.deleteBlog.bind(blogsController),
);
// blogsRouter.delete("/:id", blogsController.deleteBlog.bind(blogsController))
