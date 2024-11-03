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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.BlogErrors = void 0;
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("./blogs.repository");
exports.BlogErrors = {
    NO_BLOGS: { message: "Something went wrong, try again.", field: "", status: 404 },
    NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "id", status: 400 },
    BLOG_NOT_CREATED: { message: "Blog was not created!", field: "", status: 404 },
    INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 }
};
class CustomError extends Error {
    constructor({ message, field, status }) {
        super(message);
        this.status = status;
        this.field = field;
    }
}
exports.CustomError = CustomError;
class BlogsService {
    getBlogs(sortingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogs_repository_1.blogsRepository.getBlogs(sortingData);
            if (!blogs) {
                throw new CustomError(exports.BlogErrors.NO_BLOGS);
            }
            return blogs;
        });
    }
    createBlog(blogCreatingInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlogId = yield blogs_repository_1.blogsRepository.create(blogCreatingInput); // TODO: vsju logiku po sozdaniju vynesti sjuda
            if (!(createdBlogId instanceof mongodb_1.ObjectId)) {
                throw new CustomError(exports.BlogErrors.NO_BLOG_WITH_SUCH_ID);
            }
            const createdBlog = yield blogs_repository_1.blogsRepository.findBy(new mongodb_1.ObjectId(createdBlogId));
            if (!createdBlog) {
                throw new CustomError(exports.BlogErrors.BLOG_NOT_CREATED);
            }
            return createdBlog;
        });
    }
    getBlogById(searchableBlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.findBy(searchableBlogId);
            if (!blog) {
                throw new CustomError(exports.BlogErrors.NO_BLOG_WITH_SUCH_ID);
            }
            return blog;
        });
    }
    updateBlog(dataForUpdate, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBlog = yield blogs_repository_1.blogsRepository.updateBlog(dataForUpdate, blogId);
            if (!updatedBlog) {
                throw new CustomError(exports.BlogErrors.NO_BLOG_WITH_SUCH_ID);
            }
            return updatedBlog;
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.delete(blogId);
            if (!blog) {
                throw new CustomError(exports.BlogErrors.NO_BLOG_WITH_SUCH_ID);
            }
            return blog;
        });
    }
}
exports.default = new BlogsService();
