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
exports.SecurityService = exports.SessionsErrors = void 0;
const CustomError_1 = require("../../helpers/CustomError");
exports.SessionsErrors = {
    NO_SESSIONS_FOR_USER_ID: {
        message: "No sessions for such userId was found!",
        field: "id",
        status: 404,
    },
    NOT_OWNER_OF_COMMENT: {
        message: "You are not owner of the comment",
        field: "",
        status: 403,
    },
};
class SecurityService {
    updateComment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield securityRepository.getAllSessions(userId);
            if (!result) {
                throw new CustomError_1.CustomError(exports.SessionsErrors.NO_SESSIONS_FOR_USER_ID);
            }
            return result;
        });
    }
}
exports.SecurityService = SecurityService;
exports.default = new SecurityService();
