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
const mongodb_1 = require("mongodb");
const blogs_service_1 = __importDefault(require("../blogs.service"));
const posts_service_1 = require("../../posts_/posts.service");
const blogs_queryRepository_1 = __importDefault(require("../blogs.queryRepository"));
const blogs_queryRepository_2 = __importDefault(require("../blogs.queryRepository"));
const objectGenerators_1 = require("../../../helpers/objectGenerators");
function handleError(res, error) {
    if (error.constructor.name === 'CustomError') {
        res.status(error.status).json({ message: error.message, field: error.field });
        return;
    }
    else {
        res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
        return;
    }
}
class BlogsController {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortingData = (0, objectGenerators_1.generateSortingDataObject)(req);
            try {
                const blogs = yield blogs_queryRepository_1.default.getBlogs(sortingData);
                res.status(200).json(blogs);
                return;
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdBlog = yield blogs_service_1.default.createBlog(Object.assign({}, req.body));
                res.status(201).json(createdBlog);
                return;
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchableBlogId } = req.params;
            if (!searchableBlogId) {
                return yield blogs_controller_1.default.getBlogs(req, res);
            }
            try {
                const blog = yield blogs_queryRepository_2.default.getBlogById(searchableBlogId);
                res.status(200).json(blog);
                return;
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBlog = yield blogs_service_1.default.updateBlog(Object.assign({}, req.body), new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(204);
                return;
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield blogs_service_1.default.deleteBlog(new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(204);
            }
            catch (error) {
                handleError(res, error);
            }
        });
    }
}
exports.default = new BlogsController();
