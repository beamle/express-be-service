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
const users_repository_1 = __importDefault(require("./users.repository"));
const CustomError_1 = require("../../helpers/CustomError");
const Errors_1 = require("./meta/Errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsersService {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this.generateHash(userData.password, 10);
            const newUser = {
                login: userData.login,
                password: passwordHash,
                email: userData.email,
                createdAt: new Date().toISOString()
            };
            const newUserId = yield users_repository_1.default.createUser(newUser);
            if (!newUserId) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.USER_NOT_CREATED);
            }
            return newUserId;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_repository_1.default.deleteUser(new mongodb_1.ObjectId(id));
            return result;
        });
    }
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.default.findUserBy({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
            if (!user) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN);
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.INCORRECT_PASSWORD);
            }
            return true;
        });
    }
    generateSalt(rounds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.genSalt(rounds);
        });
    }
    generateHash(password, rounds) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield this.generateSalt(rounds);
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
}
exports.default = new UsersService();
