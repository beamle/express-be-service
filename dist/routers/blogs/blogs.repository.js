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
exports.blogsRepository = void 0;
// dat access layer
// isolates how we work with database
const db_1 = require("../../app/db");
const blogs_dto_1 = require("./blogs.dto");
exports.blogsRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.blogs;
        });
    },
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = input;
            const newBlog = {
                id: String(db_1.db.blogs.length + 1),
                name,
                description,
                websiteUrl
            };
            db_1.db.blogs = [...db_1.db.blogs, newBlog];
            return { createdBlog: newBlog };
        });
    },
    findBy(searchableBlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.blogs.find(blog => blog.id === searchableBlogId);
        });
    },
    updateBlog(dataForUpdate, searchableBlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = dataForUpdate;
            const blog = db_1.db.blogs.find(blog => blog.id === searchableBlogId);
            if (!blog) {
                return false;
            }
            const blogDto = new blogs_dto_1.BlogDto(name, description, websiteUrl);
            Object.assign(blog, blogDto);
            return true;
        });
    },
    delete(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = db_1.db.blogs.find(blog => blog.id === blogId);
            if (!blog) {
                return false;
            }
            db_1.db.blogs = db_1.db.blogs.filter(blog => blog.id !== blogId);
            db_1.db.posts = db_1.db.posts.filter(post => post.blogId !== blogId);
            return true;
        });
    }
};
