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
exports.PostErrors = void 0;
const email_manager_1 = __importDefault(require("../../managers/email.manager"));
exports.PostErrors = {
    NO_POSTS: { message: "Something went wrong, try again.", field: "", status: 404 },
    NO_BLOG_WITH_SUCH_ID: { message: "No blog with such id has been found!", field: "blogId", status: 404 },
    POST_NOT_CREATED: { message: "Post was not created!", field: "", status: 404 },
    NO_POST_WITH_SUCH_ID: { message: "Post with such id was not found!", field: "id", status: 404 },
    INTERNAL_SERVER_ERROR: { message: "Internal server error", field: "", status: 500 },
    DID_NOT_CREATE_COMMENT: { message: "Didn't create comment", field: "", status: 400 }
};
class EmailService {
    sendEmail(userEmail, password, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // savet orepo
            // get usr  from repo
            yield email_manager_1.default.sendEmailRecoveryMessage(userEmail, password, message);
        });
    }
}
exports.default = new EmailService();
