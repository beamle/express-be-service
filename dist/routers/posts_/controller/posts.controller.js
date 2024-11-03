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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const posts_service_1 = __importStar(require("../posts.service"));
class PostsController {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
            let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
            let sortBy = req.query.sortBy ? String(req.query.sortBy) : 'createdAt';
            let sortDirection = req.query.sortDirection && String(req.query.sortDirection) === 'asc' ? 'asc' : 'desc';
            try {
                const posts = blogId
                    ? yield posts_service_1.default.getPostsByBlogId(new mongodb_1.ObjectId(blogId), { pageNumber, pageSize, sortBy, sortDirection })
                    : yield posts_service_1.default.getPosts({ pageNumber, pageSize, sortBy, sortDirection });
                res.status(200).json(posts);
                return;
            }
            catch (error) {
                if (error instanceof posts_service_1.CustomError) {
                    res.status(error.status).json({ message: error.message, field: error.field });
                    return;
                }
                else {
                    res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
                    return;
                }
            }
        });
    }
    //https://stackoverflow.com/questions/59117885/handling-errors-in-express-js-in-service-controller-layers
    //https://github.com/goldbergyoni/nodebestpractices
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
                if (error instanceof posts_service_1.CustomError) {
                    res.status(error.status).json({ message: error.message, field: error.field });
                    return;
                }
                else {
                    res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
                    return;
                }
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchablePostId } = req.params;
            if (!searchablePostId) { // if undefined
                try {
                    const posts = yield posts_service_1.default.getPosts();
                    res.status(200).json(posts);
                }
                catch (error) {
                    if (error instanceof posts_service_1.CustomError) {
                        res.status(error.status).json({ message: error.message, field: error.field });
                        return;
                    }
                    else {
                        res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
                        return;
                    }
                }
            }
            try {
                const post = yield posts_service_1.default.getPostById(new mongodb_1.ObjectId(searchablePostId));
                res.status(200).json(post);
                return;
            }
            catch (error) {
                if (error instanceof posts_service_1.CustomError) {
                    res.status(error.status).json({ message: error.message, field: error.field });
                    return;
                }
                else {
                    res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
                    return;
                }
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
            catch (error) {
                if (error instanceof posts_service_1.CustomError) {
                    res.status(error.status).json({ message: error.message, field: error.field });
                    return;
                }
                else {
                    res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
                    return;
                }
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
            catch (error) {
                if (error instanceof posts_service_1.CustomError) {
                    res.status(error.status).json({ message: error.message, field: error.field });
                    return;
                }
                else {
                    res.status(500).json(posts_service_1.PostErrors.INTERNAL_SERVER_ERROR);
                    return;
                }
            }
        });
    }
}
exports.default = new PostsController();
