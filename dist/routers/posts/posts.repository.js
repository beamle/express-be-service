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
exports.postsRepository = void 0;
const db_1 = require("../../app/db");
const blogs_repository_1 = require("../blogs/blogs.repository");
const mongodb_1 = require("mongodb");
exports.postsRepository = {
    getPosts(sortingData, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;
            const posts = yield db_1.postsCollection
                .find(blogId ? { blogId: blogId.toString() } : {}, { projection: { _id: 0 } })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
                .toArray();
            console.log(posts);
            return posts;
        });
    },
    getPostsByBlogId(blogId, sortingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;
            return yield db_1.postsCollection
                .find({ blogId: blogId.toString() }, { projection: { _id: 0 } })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
                .toArray();
        });
    },
    create(input, blogIdAsParam) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog;
            if (blogIdAsParam) {
                blog = yield blogs_repository_1.blogsRepository.findBy(blogIdAsParam);
            }
            else {
                blog = yield blogs_repository_1.blogsRepository.findBy(new mongodb_1.ObjectId(input.blogId));
            }
            if (!blog) {
                return false;
            }
            const newPost = Object.assign(Object.assign({ id: String(Math.floor(Math.random() * 223)) }, input), { blogName: blog.name, blogId: input.blogId || String(blogIdAsParam), createdAt: new Date().toISOString() });
            const resultOfCreatingNewPost = yield db_1.postsCollection.insertOne(newPost);
            const updatePostId = yield db_1.postsCollection.updateOne({ _id: resultOfCreatingNewPost.insertedId }, {
                $set: {
                    id: resultOfCreatingNewPost.insertedId.toString()
                }
            });
            return resultOfCreatingNewPost.insertedId;
        });
    },
    findBy(searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ _id: searchablePostId }, { projection: { _id: 0 } });
            if (!post) {
                return null;
            }
            return post;
        });
    },
    updatePost(dataForUpdate, searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findBy(searchablePostId);
            if (!post) {
                return false;
            }
            const resultOfUpdatingPost = yield db_1.postsCollection.updateOne({ _id: searchablePostId }, { $set: Object.assign({}, dataForUpdate) });
            return resultOfUpdatingPost.acknowledged;
        });
    },
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ _id: postId });
            if (!post) {
                return false;
            }
            const resultOfDeletingPost = yield db_1.postsCollection.deleteOne({ _id: postId });
            return resultOfDeletingPost.acknowledged;
        });
    },
    createComment(postId, commentatorInfo, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                postId: postId.toString(),
                content: content,
                commentatorInfo: commentatorInfo,
                createdAt: new Date().toISOString()
            };
            const createdComment = yield db_1.commentsCollection.insertOne(newComment);
            return createdComment.insertedId;
        });
    },
    getCommentsBy(postId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, sortingData = sortingBase) {
            const { pageNumber, pageSize, sortBy, sortDirection } = sortingData;
            return yield db_1.commentsCollection
                .find({ postId: postId.toString() }, { projection: { _id: 0 } })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
                .toArray();
        });
    }
};
const sortingBase = { pageNumber: 1, pageSize: 10, sortBy: 'createdAt', sortDirection: 'desc' };
