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
const users_repository_1 = __importDefault(require("./users.repository"));
const db_1 = require("../../app/db");
const CustomError_1 = require("../../helpers/CustomError");
const Errors_1 = require("./meta/Errors");
const objectGenerators_1 = require("../../helpers/objectGenerators");
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
                items: users
            };
        });
    }
}
exports.default = new UsersQueryRepository();
