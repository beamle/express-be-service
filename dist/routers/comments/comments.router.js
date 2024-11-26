"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const posts_middlewares_1 = require("../posts_/posts.middlewares");
exports.commentsRouter = (0, express_1.Router)({ mergeParams: true });
exports.commentsRouter.get("/", commentsController.getPosts);
exports.commentsRouter.get("/:id", commentsController.getPostById, posts_middlewares_1.postCommentContentValidator);
// postsRouter.post("/",
//   authMiddleware,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   postsController.createPost
// )
