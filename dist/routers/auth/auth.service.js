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
const users_repository_1 = __importDefault(require("../users/users.repository"));
const mongodb_1 = require("mongodb");
class AuthService {
    confirmEmail(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_repository_1.default.findUserBy({ "emailConfirmation.confirmationCode": code });
            if (!user)
                return false;
            if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
                return yield users_repository_1.default.updateConfirmation(new mongodb_1.ObjectId(user.id));
            }
            return false;
        });
    }
}
exports.default = new AuthService();
