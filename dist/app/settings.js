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
        TESTING: '/testing',
    },
    DB_NAME: process.env.DB_NAME || "lesson-2-3"
};
