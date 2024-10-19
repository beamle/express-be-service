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
const db_1 = require("../../app/db");
const blogs_controller_1 = __importDefault(require("./blogs.controller"));
const blogs_repository_1 = require("./blogs.repository");
const urlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
function validateBlogInput(data, id) {
    const errors = {
        errorsMessages: []
    };
    const { name, description, websiteUrl } = data;
    if (!name) {
        errors.errorsMessages.push({ message: "Name is mandatory", field: "name" });
    }
    if (!name || name.length > 15) {
        errors.errorsMessages.push({ message: "Name should less or equal to 15 symbols", field: "name" });
    }
    if (!name || name.trim().length < 1) {
        errors.errorsMessages.push({ message: "Name should be at least 1 symbol long", field: "name" });
    }
    if (!description) {
        errors.errorsMessages.push({ message: "Description is mandatory", field: "description" });
    }
    if (!description || description.length > 500) {
        errors.errorsMessages.push({ message: "Description should be maximum 500 symbols long", field: "description" });
    }
    if (!description || description.trim().length < 1) {
        errors.errorsMessages.push({ message: "Description should be at least 1 symbol long", field: "description" });
    }
    if (!websiteUrl) {
        errors.errorsMessages.push({ message: "WebsiteUrl is mandatory", field: "websiteUrl" });
    }
    if (!websiteUrl || websiteUrl.length > 100 || !urlRegex.test(websiteUrl)) {
        errors.errorsMessages.push({
            message: "Invalid URL. Url should be maximum 100 symbols long and correspond to " +
                `${urlRegex} pattern `, field: "websiteUrl"
        });
    }
    if (!websiteUrl || websiteUrl.length < 1) {
        errors.errorsMessages.push({ message: "Invalid URL. Url should be at least 1 symbol long", field: "description" });
    }
    if (id !== undefined && String(id).trim().length < 1) {
        errors.errorsMessages.push({ message: "No id provided", field: "id" });
    }
    return errors;
}
function createBlogValidation(req) {
    return validateBlogInput(Object.assign({}, req.body));
}
function updateBlogValidation(req) {
    const { id } = req.params;
    return validateBlogInput(Object.assign({}, req.body), id);
}
function validateDeleteBlog(id) {
    const errors = { errorsMessages: [] };
    if (!id || String(id).trim().length < 1) {
        errors.errorsMessages.push({ message: "No id provided", field: "id" });
    }
    return errors;
}
class BlogsController {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(db_1.db.blogs);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = createBlogValidation(req);
            if (errors.errorsMessages.length > 0) {
                res.status(400).json(errors.errorsMessages[0]);
                return;
            }
            const { createdBlog } = yield blogs_repository_1.blogsRepository.create(req.body);
            res.status(201).json(createdBlog);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchableBlogId } = req.params;
            if (searchableBlogId === undefined) {
                const allBlogs = yield blogs_controller_1.default.getBlogs(req, res);
                return allBlogs;
            }
            const blog = yield blogs_repository_1.blogsRepository.findBy(searchableBlogId);
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
            const errors = updateBlogValidation(req);
            if (errors.errorsMessages.length > 0) {
                res.status(400).json(errors.errorsMessages[0]);
                return;
            }
            const updatedBlog = yield blogs_repository_1.blogsRepository.updateBlog(Object.assign({}, req.body), String(req.params.id));
            if (!updatedBlog) {
                res.status(404).json({ message: "Blog not found", field: "id" });
                return;
            }
            res.sendStatus(204);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateDeleteBlog(String(req.params.id));
            if (errors.errorsMessages.length > 0) {
                res.status(400).json(errors.errorsMessages[0]);
                return;
            }
            const blog = db_1.db.blogs.find(blog => blog.id === req.params.id);
            if (!blog) {
                res.status(404).json({ message: "Blog not found", field: "id" });
                return;
            }
            db_1.db.blogs.filter(blog => blog.id !== req.params.id);
            res.sendStatus(204);
        });
    }
}
exports.default = new BlogsController();
