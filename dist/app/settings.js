"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // добавление переменных из файла .env в process.env
exports.SETTINGS = {
    PORT: process.env.PORT || 3004,
    MONGO_URI: process.env.MONGO_URL || "",
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        COMMENTS: '/comments',
        EMAIL: '/email',
        SESSION: '/session',
        REFRESH_TOKEN_BLACKLIST: '/refresh-token-blacklist',
        REQUEST_CASES: '/request-cases-list',
        TESTING: '/testing',
    },
    DB_NAME: process.env.DB_NAME || "lesson-2-3",
    JWT_SECRET: process.env.JWT_SECRET || "!23"
    // require('crypto').randomBytes(64).toString('hex') // dynamic import is asyncrounoys, dynamic require is syncrounous
};
