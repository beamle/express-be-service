"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogs_controller_1 = __importDefault(require("./blogs.controller"));
const posts_repository_1 = require("../posts.repository");
const controllerValidation_1 = require("./controllerValidation");
class BlogsController {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(yield posts_repository_1.postsRepository.getBlogs());
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, controllerValidation_1.createBlogValidation)(req);
            if (errors.errorsMessages.length > 0) {
                res.status(400).json(errors.errorsMessages[0]);
                return;
            }
            const { createdBlog } = yield posts_repository_1.postsRepository.create(req.body);
            res.status(201).json(createdBlog);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchableBlogId } = req.params;
            if (!searchableBlogId)
                return yield blogs_controller_1.default.getBlogs(req, res); // if undefined
            const blog = yield posts_repository_1.postsRepository.findBy(searchableBlogId);
            if (blog) {
                res.status(200).json(blog);
            }
            else {
                res.status(404).json({ message: 'Blog with such id was not found', field: 'id' });
            }
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, controllerValidation_1.updateBlogValidation)(req);
            if (errors.errorsMessages.length > 0) {
                res.status(400).json(errors.errorsMessages[0]);
                return;
            }
            const updatedBlog = yield posts_repository_1.postsRepository.updateBlog(Object.assign({}, req.body), String(req.params.id));
            if (!updatedBlog) {
                res.status(404).json({ message: "Blog not found", field: "id" });
                return;
            }
            res.sendStatus(204);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, controllerValidation_1.validateDeleteBlog)(String(req.params.id));
            if (errors.errorsMessages.length > 0) {
                res.status(400).json(errors.errorsMessages[0]);
                return;
            }
            const blog = yield posts_repository_1.postsRepository.delete(req.params.id);
            if (!blog) {
                res.status(404).json({ message: "Blog not found", field: "id" });
                return;
            }
            res.sendStatus(204);
        });
    }
}
exports.default = new BlogsController();
