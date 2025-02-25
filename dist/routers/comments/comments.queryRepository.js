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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../app/db");
const CustomError_1 = require("../../helpers/CustomError");
const comments_service_1 = require("./comments.service");
class CommentsQueryRepository {
    getCommentsByPostId(sortingData, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield db_1.commentsCollection.find({ postId }, { projection: { postId: 0 } }).skip((pageNumber - 1) * pageSize)
                .limit(sortingData.pageSize)
                .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 'asc' : 'desc' })
                .toArray();
            if (!comments)
                return false;
            return this.mapCommentsToCommentType(comments);
        });
    }
    getLastCreatedCommentForPostBy(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield db_1.commentsCollection
                .find({ _id: commentId })
                .toArray();
            if (!comments) {
                throw new CustomError_1.CustomError(comments_service_1.CommentsErrors.NO_COMMENTS_FOUND);
            }
            return this.mapToCommentType(comments[0]);
        });
    }
    getCommentBy(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.commentsCollection.findOne({ _id: commentId });
            if (!comment) {
                throw new CustomError_1.CustomError(comments_service_1.CommentsErrors.NO_COMMENTS_FOUND);
            }
            return this.mapToCommentType(comment);
        });
    }
    mapCommentsToCommentType(comments) {
        return comments.map(comment => {
            const { _id } = comment, rest = __rest(comment, ["_id"]);
            return Object.assign(Object.assign({}, rest), { id: _id.toString() });
        });
    }
    mapToCommentType(comment) {
        const { postId, _id } = comment, rest = __rest(comment, ["postId", "_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id });
    }
}
exports.default = new CommentsQueryRepository();
