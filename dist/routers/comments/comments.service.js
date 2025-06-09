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
exports.CommentsErrors = void 0;
const CustomError_1 = require("../../helpers/CustomError");
const comments_repository_1 = __importDefault(require("./comments.repository"));
exports.CommentsErrors = {
    NO_COMMENTS_FOUND: { message: "Comment with such Id was not found!", field: "id", status: 404 },
};
class CommentsService {
    updateComment(contentObj, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_repository_1.default.updateCommentById(contentObj.content, commentId);
            if (!result) {
                throw new CustomError_1.CustomError(exports.CommentsErrors.NO_COMMENTS_FOUND);
            }
            return result;
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_repository_1.default.deleteCommentById(commentId);
            if (!result) {
                throw new CustomError_1.CustomError(exports.CommentsErrors.NO_COMMENTS_FOUND);
            }
            return result;
        });
    }
}
exports.default = new CommentsService();
