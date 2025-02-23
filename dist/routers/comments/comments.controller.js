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
const mongodb_1 = require("mongodb");
const validationHelpers_1 = require("../../helpers/validationHelpers");
const comments_queryRepository_1 = __importDefault(require("./comments.queryRepository"));
const comments_service_1 = __importDefault(require("./comments.service"));
class CommentsController {
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: searchableCommentId } = req.params;
            // if (!searchableCommentId) {
            //   try {
            //     const posts = await postsQueryRepository.getPosts({
            //       pageNumber,
            //       pageSize,
            //       sortBy,
            //       sortDirection
            //     }, new ObjectId(searchablePostId))
            //     res.status(200).json(posts)
            //   } catch (e) {
            //     handleError(res, e)
            //   }
            // }
            try {
                const comment = yield comments_queryRepository_1.default.getCommentBy(new mongodb_1.ObjectId(searchableCommentId));
                res.status(200).json(comment);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
    updateCommentForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id: searchableCommentId } = req.params;
            debugger;
            try {
                const comment = yield comments_queryRepository_1.default.getCommentBy(new mongodb_1.ObjectId(searchableCommentId));
                // const me = await authQueryRepository.getMeBy(req.context.user)
                if (comment.commentatorInfo.userId !== ((_a = req.context.user) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return res.status(403).json({ message: "You are not owner of the comment" });
                }
                const isCommentUpdated = yield comments_service_1.default.updateComment(Object.assign({}, req.body), new mongodb_1.ObjectId(searchableCommentId));
                if (isCommentUpdated)
                    res.sendStatus(204);
                return;
            }
            catch (error) {
                (0, validationHelpers_1.handleError)(res, error);
            }
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: commentIdToDelete } = req.params;
            try {
                const comment = yield comments_service_1.default.deleteComment(new mongodb_1.ObjectId(commentIdToDelete));
                res.status(204).json(comment);
                return;
            }
            catch (e) {
                (0, validationHelpers_1.handleError)(res, e);
            }
        });
    }
}
exports.default = new CommentsController();
