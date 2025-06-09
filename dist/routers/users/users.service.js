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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const users_repository_1 = __importDefault(require("./users.repository"));
const CustomError_1 = require("../../helpers/CustomError");
const Errors_1 = require("./meta/Errors");
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const uuidv4_1 = require("uuidv4");
const users_queryRepository_1 = __importDefault(require("./users.queryRepository"));
const EXPIRATION_TIME_EXTRA = {
    ONE_MINUTE: { minutes: 1 },
    FIVE_MINUTES: { minutes: 5 }
};
class UsersService {
    // TODO: change method. Currently by id it reutnr user but email and login checks for eixstence
    getUserBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, login, id }) {
            if (id) {
                const user = yield users_repository_1.default.findUserBy({ _id: new mongodb_1.ObjectId(id) });
                if (!user)
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_ID);
                return this.mapUserWithId(user);
            }
            else if (email) {
                const existingUserByEmail = yield users_repository_1.default.findUserBy({ email: email });
                if (existingUserByEmail)
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.USER_WITH_SUCH_EMAIL_ALREADY_EXIST);
                return null;
            }
            else if (login) {
                const existingUserByLogin = yield users_repository_1.default.findUserBy({ login: login });
                if (existingUserByLogin)
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.USER_WITH_SUCH_LOGIN_ALREADY_EXIST);
                return null;
            }
            return null;
        });
    }
    findUserBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, login, id }) {
            let user;
            if (id) {
                user = yield users_repository_1.default.findUserBy({ _id: new mongodb_1.ObjectId(id) });
                if (!user)
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_ID);
                return this.mapUserWithId(user);
            }
            else if (email) {
                user = yield users_repository_1.default.findUserBy({ email });
                if (!user)
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_EMAIL);
                return this.mapUserWithId(user);
            }
            else if (login) {
                user = yield users_repository_1.default.findUserBy({ login });
                if (!user)
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_LOGIN);
                return this.mapUserWithId(user);
            }
            throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN_OR_ID);
        });
    }
    createUser(userData_1) {
        return __awaiter(this, arguments, void 0, function* (userData, isConfirmed = false, createByAdmin = false) {
            const passwordHash = yield this.generateHash(userData.password, 10);
            const newUser = {
                login: userData.login,
                password: passwordHash,
                email: userData.email,
                createdAt: new Date().toISOString(),
                // registrationData: { ip: userData.ip}, // TODO: esli za poslednie 5 minut, s odnogo Ip adressa mngoo registracij, to block for 5 minutes
                emailConfirmation: {
                    isConfirmed: createByAdmin,
                    confirmationCode: (0, uuidv4_1.uuid)(),
                    expirationDate: (0, date_fns_1.add)(new Date(), EXPIRATION_TIME_EXTRA.FIVE_MINUTES)
                }
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
            // const user = await usersRepository.findUserBy({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
            const user = yield users_queryRepository_1.default.findUserBy({ login: loginOrEmail, email: loginOrEmail });
            if (!user) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN);
            }
            if (!user.password) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_PASSWORD);
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.INCORRECT_PASSWORD);
            }
            return users_queryRepository_1.default.mapUserWithId(user);
        });
    }
    getMe(token) {
        return __awaiter(this, void 0, void 0, function* () {
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
    mapUserWithId(user) {
        const { _id, password } = user, rest = __rest(user, ["_id", "password"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString() });
    }
}
exports.default = new UsersService();
