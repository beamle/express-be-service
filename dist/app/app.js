"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.addContext = addContext;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("./settings");
const blogs_router_1 = require("../routers/blogs/blogs.router");
const posts_router_1 = require("../routers/posts/posts.router");
const testing_router_1 = require("../routers/testing/testing.router");
const users_router_1 = require("../routers/users/users.router");
const auth_router_1 = require("../routers/auth/auth.router");
const comments_router_1 = require("../routers/comments/comments.router");
function addContext(req, res, next) {
    req.context = { user: null };
    next();
}
exports.app = (0, express_1.default)();
exports.app.options('*', (0, cors_1.default)()); // Enable preflight for all rou
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json()); // The request body will be available as a raw stream of data in req.body, but req.body will be undefined unless you manually parse it.
exports.app.use(addContext);
exports.app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' });
});
exports.app.use(settings_1.SETTINGS.PATH.AUTH, auth_router_1.authRouter);
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, posts_router_1.postsRouter);
exports.app.use(settings_1.SETTINGS.PATH.USERS, users_router_1.usersRouter);
exports.app.use(settings_1.SETTINGS.PATH.COMMENTS, comments_router_1.commentsRouter);
exports.app.use(settings_1.SETTINGS.PATH.TESTING, testing_router_1.testingRouter);
