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
exports.postsRepository = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.posts;
        });
    },
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlog = db_1.db.blogs.find(blog => input.blogId);
            if (!findBlog) {
                throw new Error("No blog with such id!");
            }
            const newPost = Object.assign(Object.assign({ id: String(db_1.db.posts.length + 1) }, input), { blogName: findBlog.name });
            db_1.db.posts = [...db_1.db.posts, newPost];
            return { createdPost: newPost };
        });
    },
    findBy(searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.posts.find(post => post.id === searchablePostId);
        });
    },
    updatePost(dataForUpdate, searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { title, shortDescription, content, blogName } = dataForUpdate
            const post = db_1.db.posts.find(post => post.id === searchablePostId);
            if (!post) {
                return false;
            }
            // const postDto = new PostsDto(title, shortDescription, content, blogName)
            Object.assign(post, dataForUpdate);
            return true;
        });
    },
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = db_1.db.posts.find(post => post.id === postId);
            if (!post) {
                return false;
            }
            db_1.db.posts = db_1.db.posts.filter(post => post.id !== postId);
            return true;
        });
    }
};
