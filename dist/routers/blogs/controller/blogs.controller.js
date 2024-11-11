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
function generateSortingDataObject(req) {
    let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
    let sortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';
    let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : null;
    return { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm };
}
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
            const sortingData = generateSortingDataObject(req);
            const blogs = yield blogs_service_1.default.getBlogs(sortingData);
            res.status(200).json({
                pagesCount: Math.ceil(blogs.totalCount / sortingData.pageSize),
                page: sortingData.pageNumber,
                pageSize: sortingData.pageSize,
                totalCount: blogs.totalCount,
                items: blogs.blogs
            });
            return;
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
                return yield blogs_controller_1.default.getBlogs(req, res); // if undefined
            }
            try {
                const blog = yield blogs_service_1.default.getBlogById(new mongodb_1.ObjectId(searchableBlogId));
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
