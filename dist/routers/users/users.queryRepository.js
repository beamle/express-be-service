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
const users_repository_1 = __importDefault(require("./users.repository"));
const db_1 = require("../../app/db");
const CustomError_1 = require("../../helpers/CustomError");
const Errors_1 = require("./meta/Errors");
const objectGenerators_1 = require("../../helpers/objectGenerators");
const mongodb_1 = require("mongodb");
class UsersQueryRepository {
    getUsers(sortingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = (0, objectGenerators_1.createFilter)(sortingData);
            const users = yield users_repository_1.default.getUsers(sortingData, filter);
            const usersLength = yield db_1.usersCollection.countDocuments(filter);
            if (!users) {
                throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USERS);
            }
            return {
                pagesCount: Math.ceil(usersLength / sortingData.pageSize),
                page: sortingData.pageNumber,
                pageSize: sortingData.pageSize,
                totalCount: usersLength,
                items: this.mapUserOrUsersWithId(users)
            };
        });
    }
    // TODO: get rid if UserTypeViewModel[]
    //   async getUserById(userId: ObjectId): Promise<UserTypeViewModel | UserTypeViewModel[]> {
    //     const user = await usersRepository.findUserById(userId)
    //
    //     if (!user) {
    //       throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)
    //     }
    //
    //     return this.mapUserOrUsersWithId(user)
    //   }
    getUserBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, login, id }) {
            if (id) {
                const user = yield users_repository_1.default.findUserBy({ _id: new mongodb_1.ObjectId(id) });
                if (!user) {
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.NO_USER_WITH_SUCH_ID);
                }
                return this.mapUserOrUsersWithId(user);
            }
            else if (email) {
                const existingUserByEmail = yield users_repository_1.default.findUserBy({ email: email });
                if (existingUserByEmail) {
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.USER_WITH_SUCH_EMAIL_ALREADY_EXIST);
                }
                return null;
            }
            else if (login) {
                const existingUserByLogin = yield users_repository_1.default.findUserBy({ login: login });
                if (existingUserByLogin) {
                    throw new CustomError_1.CustomError(Errors_1.UsersErrors.USER_WITH_SUCH_LOGIN_ALREADY_EXIST);
                }
                return null;
            }
            return null;
        });
    }
    mapUserOrUsersWithId(userOrUsers) {
        debugger;
        if (Array.isArray(userOrUsers)) {
            return userOrUsers.map((_a) => {
                var { _id } = _a, restOfUser = __rest(_a, ["_id"]);
                return (Object.assign(Object.assign({}, restOfUser), { id: _id.toString(), createdAt: new Date() }));
            });
        }
        const { _id } = userOrUsers, rest = __rest(userOrUsers, ["_id"]);
        return Object.assign(Object.assign({}, rest), { id: _id.toString(), createdAt: new Date() });
    }
}
exports.default = new UsersQueryRepository();
