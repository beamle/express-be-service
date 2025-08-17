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
exports.sessionRepository = void 0;
const db_1 = require("../../app/db");
exports.sessionRepository = {
    findSession() {
        return __awaiter(this, void 0, void 0, function* () {
            // const posts = await postsCollection
            //   .find(blogId ? { blogId: blogId.toString() } : {}, { projection: { _id: 0 } })
            //   .skip((pageNumber - 1) * pageSize)
            //   .limit(pageSize)
            //   .sort({ [sortBy]: sortDirection === 'asc' ? 'asc' : 'desc' })
            //   .toArray()
            // return session
        });
    },
    // async addRefreshTokenToBlackList (refreshToken: string) {
    //
    //   const newSession: PostType = {
    //     id: String(Math.floor(Math.random() * 223)),
    //     ...input,
    //     blogName: blog.name,
    //     blogId: input.blogId || String(blogIdAsParam),
    //     createdAt: new Date().toISOString()
    //   }
    //
    //   const posts = await sessionCollection.insertOne(refreshToken)
    // },
    addRefreshTokenToBlackList(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenObj = {
                refreshToken
            };
            return yield db_1.refreshTokenBlacklistCollection.insertOne(refreshTokenObj);
        });
    },
    checkIfRefreshTokenInBlackList(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield db_1.refreshTokenBlacklistCollection.findOne({ refreshToken });
            return !!found;
        });
    },
};
