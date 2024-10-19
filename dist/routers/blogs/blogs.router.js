"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_controller_1 = __importDefault(require("./controller/blogs.controller"));
const blogs_middlewares_1 = require("./blogs.middlewares");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get("/", blogs_controller_1.default.getBlogs);
exports.blogsRouter.get("/test-cord", (req, res) => {
    res.json({ message: 'CORS is working!' });
});
exports.blogsRouter.get("/:id", blogs_controller_1.default.getBlogById);
exports.blogsRouter.post("/", ...blogs_middlewares_1.blogInputValidators, blogs_middlewares_1.inputCheckErrorsFormatter, blogs_controller_1.default.createBlog);
exports.blogsRouter.put("/:id", ...blogs_middlewares_1.blogInputValidators, blogs_middlewares_1.blogIdInputValidator, blogs_middlewares_1.inputCheckErrorsFormatter, blogs_controller_1.default.updateBlog);
// blogsRouter.put("/:id", (req, res) => blogsController.updateBlog(req, res)) // If you pass directly like that,
// then THIS obj is lost, because This is because JavaScript’s default
// behavior is that function references lose their original THIS context
// unless they are explicitly bound. `this` is undefined inside `updateBlog
// I Pass blogsController.updateBlog reference, and express invokes it in another function from another Object. If not, the it refers to global Object -> result is undefined.
// function declaration "THIS" depends on WHERE the function is called (context)
// Not where its being declared. So i pass the METHOD without blogsController itself.
// with callback i call updateBlog explicitly from blogsController object -> BINDS THIS no blogsController object.
exports.blogsRouter.delete("/:id", blogs_controller_1.default.deleteBlog);
// blogsRouter.delete("/:id", blogsController.deleteBlog.bind(blogsController))
