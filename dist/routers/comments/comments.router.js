"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_controller_1 = __importDefault(require("./comments.controller"));
exports.commentsRouter = (0, express_1.Router)({ mergeParams: true });
// commentsRouter.get("/", commentsController.getPosts)
exports.commentsRouter.get("/:id", 
// postCommentContentValidator,
comments_controller_1.default.getCommentById);
exports.commentsRouter.delete("/:id", comments_controller_1.default.deleteCommentById);
// postsRouter.post("/",
//   authMiddleware,
//   ...postInputValidators,
//   inputCheckErrorsFormatter,
//   postsController.createPost
// )
