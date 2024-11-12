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
const db_1 = require("../../app/db");
class UsersRepository {
    getUsers(sortingData, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield db_1.usersCollection
                // .find(blogId ? { blogId: blogId.toString() } : {}, { projection: { _id: 0 } })
                .find(filter ? filter : {}, { projection: { _id: 0 } })
                .skip((sortingData.pageNumber - 1) * sortingData.pageSize)
                .limit(sortingData.pageSize)
                .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 'asc' : 'desc' })
                .toArray();
            return users;
        });
    }
}
exports.default = new UsersRepository();
