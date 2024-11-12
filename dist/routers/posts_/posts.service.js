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
exports.CustomError = exports.PostErrors = void 0;
const posts_repository_1 = require("../posts_/posts.repository");
const mongodb_1 = require("mongodb");
exports.PostErrors = {
    NO_POSTS: { message: "Something went wrong, try again.", field: "", status: 404 },
    NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "blogId", status: 404 },
    POST_NOT_CREATED: { message: "Post was not created!", field: "", status: 404 },
    NO_POST_WITH_SUCH_ID: { message: "Post with such id was not found!", field: "id", status: 404 },
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
class PostsService {
    // async getPosts(sortingData: PostsSortingData, blogId?: ObjectId): Promise<PostType[]> {
    // if(blogId) {
    //   const blog = await blogsRepository.findBy(blogId)
    //
    //   if (!blog) {
    //     throw new CustomError(PostErrors.NO_BLOG_WITH_SUCH_ID)
    //   }
    //   const blogPosts = await postsRepository.getPosts(sortingData, blogId)
    //   if (!blogPosts) {
    //     throw new CustomError({ message: "no error description", field: "", status: 400 })
    //   }
    //   return blogPosts
    // }
    // return await postsRepository.getPosts(sortingData)
    // }
    createPost(postCreatingInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPostId = yield posts_repository_1.postsRepository.create(postCreatingInput);
            if (!(createdPostId instanceof mongodb_1.ObjectId)) {
                throw new CustomError(exports.PostErrors.NO_BLOG_WITH_SUCH_ID);
            }
            const createdPost = yield posts_repository_1.postsRepository.findBy(new mongodb_1.ObjectId(createdPostId));
            if (!createdPost) {
                throw new CustomError(exports.PostErrors.POST_NOT_CREATED);
            }
            return createdPost;
        });
    }
    createPostForBlog(postCreatingInput, blogIdAsParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPostId = yield posts_repository_1.postsRepository.create(postCreatingInput, blogIdAsParam ? new mongodb_1.ObjectId(blogIdAsParam) : undefined);
            if (!(createdPostId instanceof mongodb_1.ObjectId)) {
                throw new CustomError(exports.PostErrors.NO_BLOG_WITH_SUCH_ID);
            }
            const createdPost = yield posts_repository_1.postsRepository.findBy(new mongodb_1.ObjectId(createdPostId));
            if (!createdPost) {
                throw new CustomError(exports.PostErrors.POST_NOT_CREATED);
            }
            return createdPost;
        });
    }
    // async getPostById(searchablePostId: ObjectId): Promise<PostType> {
    // const post = await postsRepository.findBy(searchablePostId)
    // if (!post) {
    //   throw new CustomError(PostErrors.NO_POST_WITH_SUCH_ID)
    // }
    // return post;
    // }
    updatePost(dataForUpdate, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedPost = yield posts_repository_1.postsRepository.updatePost(dataForUpdate, postId);
            if (!updatedPost) {
                throw new CustomError(exports.PostErrors.NO_POST_WITH_SUCH_ID);
            }
            return updatedPost;
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_repository_1.postsRepository.delete(postId);
            if (!post) {
                throw new CustomError(exports.PostErrors.NO_POST_WITH_SUCH_ID);
            }
            return post;
        });
    }
}
exports.default = new PostsService();
