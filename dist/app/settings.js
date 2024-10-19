"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // добавление переменных из файла .env в process.env
exports.SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: {
            ALL_DATA: '/testing/all-data',
        },
    },
};
