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
const mongodb_1 = require("mongodb");
const blogs_service_1 = require("./blogs.service");
const db_1 = require("../../app/db");
const blogs_repository_1 = require("../blogs/blogs.repository");
const posts_service_1 = require("../posts/posts.service");
const objectGenerators_1 = require("../../helpers/objectGenerators");
const CustomError_1 = require("../../helpers/CustomError");
class BlogsQueryRepository {
    getBlogs(sortingData, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, objectGenerators_1.createFilter)(sortingData);
            const blogsLength = yield db_1.blogsCollection.countDocuments(filter); // make aggregation?
            const blogs = yield blogs_repository_1.blogsRepository.getBlogs(sortingData, filter);
            if (!blogs) {
                throw new CustomError_1.CustomError(blogs_service_1.BlogErrors.NO_BLOGS);
            }
            return {
                pagesCount: Math.ceil(blogsLength / sortingData.pageSize),
                page: sortingData.pageNumber,
                pageSize: sortingData.pageSize,
                totalCount: blogsLength,
                items: blogs
            };
        });
    }
    getBlogById(searchablePostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield blogs_repository_1.blogsRepository.findBy(new mongodb_1.ObjectId(searchablePostId));
            if (!post) {
                throw new CustomError_1.CustomError(posts_service_1.PostErrors.NO_POST_WITH_SUCH_ID);
            }
            return post;
        });
    }
}
exports.default = new BlogsQueryRepository();
