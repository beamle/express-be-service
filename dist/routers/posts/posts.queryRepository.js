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
const posts_service_1 = require("./posts.service");
const db_1 = require("../../app/db");
const posts_repository_1 = require("./posts.repository");
const CustomError_1 = require("../../helpers/CustomError");
const comments_queryRepository_1 = __importDefault(require("../comments/comments.queryRepository"));
class PostsQueryRepository {
    getPosts(sortingData, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = blogId
                ? yield posts_repository_1.postsRepository.getPosts(sortingData, blogId)
                : yield posts_repository_1.postsRepository.getPosts(sortingData);
            if (!posts) {
                throw new CustomError_1.CustomError({ message: "no error description", field: "", status: 400 });
            }
            const postsLength = yield db_1.postsCollection.countDocuments(blogId ? { blogId: blogId.toString() } : {});
            return {
                pagesCount: Math.ceil(postsLength / sortingData.pageSize),
                page: sortingData.pageNumber,
                pageSize: sortingData.pageSize,
                totalCount: postsLength,
                items: posts
            };
        });
    }
    getPostById(searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_repository_1.postsRepository.findBy(searchablePostId);
            if (!post) {
                throw new CustomError_1.CustomError(posts_service_1.PostErrors.NO_POST_WITH_SUCH_ID);
            }
            return post;
        });
    }
    getPostCommentsByPostId(sortingData, searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const post = await postsRepository.findBy(searchablePostId)
            const posts = yield comments_queryRepository_1.default.getCommentsByPostId(sortindData, searchablePostId.toString());
            if (!posts) {
                throw new CustomError_1.CustomError({ message: "no error description", field: "", status: 400 });
            }
            const postsLength = yield db_1.commentsCollection.countDocuments(searchablePostId ? { postId: searchablePostId.toString() } : {});
            return {
                pagesCount: Math.ceil(postsLength / sortingData.pageSize),
                page: sortingData.pageNumber,
                pageSize: sortingData.pageSize,
                totalCount: postsLength,
                items: posts
            };
        });
    }
}
exports.default = new PostsQueryRepository();
