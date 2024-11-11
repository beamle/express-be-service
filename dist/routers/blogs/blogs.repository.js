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
exports.blogsRepository = {
    getBlogs(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pageNumber, pageSize, sortBy, sortDirection, searchNameTerm }) {
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' }; // ignore Cc
            }
            const blogs = yield db_1.blogsCollection
                .find(filter, { projection: { _id: 0 } })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
                .toArray();
            return blogs;
        });
    },
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = input;
            let newBlog = {
                name,
                description,
                websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            const result = yield db_1.blogsCollection.insertOne(newBlog);
            const updateId = yield db_1.blogsCollection.updateOne({ _id: result.insertedId }, {
                $set: {
                    id: result.insertedId.toString()
                }
            });
            return result.insertedId;
        });
    },
    findBy(searchableBlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.findOne({ _id: searchableBlogId }, { projection: { _id: 0 } });
        });
    },
    updateBlog(dataForUpdate, searchableBlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = dataForUpdate;
            const blog = yield this.findBy(searchableBlogId);
            if (!blog) {
                return false;
            }
            const resultOfUpdatingBlog = yield db_1.blogsCollection.updateOne({ _id: searchableBlogId }, {
                $set: {
                    name,
                    description,
                    websiteUrl
                }
            });
            return resultOfUpdatingBlog.matchedCount;
        });
    },
    delete(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ _id: blogId });
            if (!blog) {
                return false;
            }
            const deleteBlogResult = yield db_1.blogsCollection.deleteOne({ _id: blogId });
            if (deleteBlogResult.deletedCount === 0) {
                return false;
            }
            const deletePostsResult = yield db_1.postsCollection.deleteMany({ blogId: blogId.toString() });
            return deletePostsResult.acknowledged;
        });
    }
};
