"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongodb_1 = require("mongodb");
const posts_service_1 = __importStar(require("../posts.service"));
const posts_queryRepository_1 = __importDefault(require("../posts.queryRepository"));
const validationHelpers_1 = require("../../../helpers/validationHelpers");
const blogs_repository_1 = require("../../blogs/blogs.repository");
const CustomError_1 = require("../../../helpers/CustomError");
const comments_queryRepository_1 = __importDefault(require("../../comments/comments.queryRepository"));
//https://stackoverflow.com/questions/59117885/handling-errors-in-express-js-in-service-controller-layers
//https://github.com/goldbergyoni/nodebestpractices
class PostsController {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
            let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
            let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
            let sortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';
            try {
                if (blogId) {
                    const blog = yield blogs_repository_1.blogsRepository.findBy(new mongodb_1.ObjectId(blogId)); // TODO: change to blogsQueryRepository
                    if (!blog) {
                        throw new CustomError_1.CustomError(posts_service_1.PostErrors.NO_BLOG_WITH_SUCH_ID);
                    }
                }
                const posts = yield posts_queryRepository_1.default.getPosts({
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection
                }, blogId ? new mongodb_1.ObjectId(blogId) : undefined);
                res.status(200).json(posts);
            }
            catch (error) {
                (0, validationHelpers_1.handleError)(res, error);
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            try {
                let createdPost;
                if (blogId) {
                    createdPost = yield posts_service_1.default.createPostForBlog(req.body, blogId);
                }
                else {
                    createdPost = yield posts_service_1.default.createPost(req.body);
                }
                res.status(201).json(createdPost);
                return;
            }
            catch (error) {
                (0, validationHelpers_1.handleError)(res, error);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchablePostId } = req.params;
            let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
            let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
            let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
            let sortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';
            if (!searchablePostId) {
                try {
                    const posts = yield posts_queryRepository_1.default.getPosts({
                        pageNumber,
                        pageSize,
                        sortBy,
                        sortDirection
                    }, new mongodb_1.ObjectId(searchablePostId));
                    res.status(200).json(posts);
                }
                catch (e) {
                    (0, validationHelpers_1.handleError)(res, e);
                }
            }
            try {
                const post = yield posts_queryRepository_1.default.getPostById(new mongodb_1.ObjectId(searchablePostId));
                res.status(200).json(post);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postIdUpdated = yield posts_service_1.default.updatePost(Object.assign({}, req.body), new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(204);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postIsDeleted = yield posts_service_1.default.deletePost(new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(204);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    createCommentForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            const { content } = req.body;
            const { userId, login } = req.context.user;
            try {
                debugger;
                const post = yield posts_queryRepository_1.default.getPostById(new mongodb_1.ObjectId(postId));
                const createdCommentId = yield posts_service_1.default.createCommentForPost(new mongodb_1.ObjectId(post.id), {
                    userId,
                    userLogin: login
                }, content);
                const createdComment = yield comments_queryRepository_1.default.getLastCreatedCommentForPostBy(new mongodb_1.ObjectId(createdCommentId));
                res.status(200).json(createdComment);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
}
exports.default = new PostsController();
