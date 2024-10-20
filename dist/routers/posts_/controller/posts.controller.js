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
const posts_controller_1 = __importDefault(require("./posts.controller"));
const posts_repository_1 = require("../posts.repository");
class PostsController {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(yield posts_repository_1.postsRepository.getPosts());
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { createdPost } = yield posts_repository_1.postsRepository.create(req.body);
            res.status(201).json(createdPost);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchablePostId } = req.params;
            if (!searchablePostId)
                return yield posts_controller_1.default.getPosts(req, res); // if undefined
            const post = yield posts_repository_1.postsRepository.findBy(searchablePostId);
            if (post) {
                res.status(200).json(post);
            }
            else {
                res.status(404).json({ message: 'Post with such id was not found', field: 'id' });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedPost = yield posts_repository_1.postsRepository.updatePost(Object.assign({}, req.body), String(req.params.id));
            if (!updatedPost) {
                res.status(404).json({ message: "Post not found", field: "id" });
                return;
            }
            res.sendStatus(204);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_repository_1.postsRepository.delete(req.params.id);
            if (!post) {
                res.status(404).json({ message: "Post not found", field: "id" });
                return;
            }
            res.sendStatus(204);
        });
    }
}
exports.default = new PostsController();
