import { Router } from "express";
import blogsController from "./controller/blogs.controller";
import { blogIdAsParamValidator, blogInputValidators } from "./blogs.middlewares";
import { authMiddleware } from "../../authorization/middlewares/authorization.middleware";
import { inputCheckErrorsFormatter } from "../../helpers/validationHelpers";
import {
  middlewareObjectIdChecker,
  postContentInputValidator,
  postShortDescriptionInputValidator,
  postTitleInputValidator
} from "../posts/posts.middlewares";
import postsController from "../posts/controller/posts.controller";

export const blogsRouter = Router({ mergeParams: true });

blogsRouter.get("/", blogsController.getBlogs)

blogsRouter.get("/test-cord", (req, res) => {
  res.json({ message: 'CORS is working!' })
})

blogsRouter.get('/:blogId/posts',
  // authMiddleware,
  blogIdAsParamValidator,
  inputCheckErrorsFormatter,
  postsController.getPosts
)

blogsRouter.get("/:id",
  // blogIdInputValidator,
  inputCheckErrorsFormatter,
  blogsController.getBlogById)

blogsRouter.post("/:blogId/posts",
  authMiddleware,
  blogIdAsParamValidator,
  postContentInputValidator,
  postShortDescriptionInputValidator,
  postTitleInputValidator,
  inputCheckErrorsFormatter,
  postsController.createPost
)

blogsRouter.post("/",
  authMiddleware,
  ...blogInputValidators,
  inputCheckErrorsFormatter,
  blogsController.createBlog
)

blogsRouter.put("/:id",
  authMiddleware,
  ...blogInputValidators,
  // blogIdInputValidator,
  inputCheckErrorsFormatter,
  blogsController.updateBlog
)
// blogsRouter.put("/:id", (req, res) => blogsController.updateBlog(req, res)) // If you pass directly like that,
// then THIS obj is lost, because This is because JavaScript’s default
// behavior is that function references lose their original THIS context
// unless they are explicitly bound. `this` is undefined inside `updateBlog

// I Pass blogsController.updateBlog reference, and express invokes it in another function from another Object. If not, the it refers to global Object -> result is undefined.
// function declaration "THIS" depends on WHERE the function is called (context)
// Not where its being declared. So i pass the METHOD without blogsController itself.
// with callback i call updateBlog explicitly from blogsController object -> BINDS THIS no blogsController object.
blogsRouter.delete("/:id",
  authMiddleware,
  // middlewareObjectIdChecker,
  // blogIdInputValidator,
  inputCheckErrorsFormatter,
  blogsController.deleteBlog)
// blogsRouter.delete("/:id", blogsController.deleteBlog.bind(blogsController))
