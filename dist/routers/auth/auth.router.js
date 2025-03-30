"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const auth_controller_1 = __importDefault(require("./controller/auth.controller"));
const express_1 = require("express");
const bearerAuthorizationValidator_1 = require("../../authorization/middlewares/bearerAuthorizationValidator");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post("/login", auth_controller_1.default.login);
exports.authRouter.post("/registration", auth_controller_1.default.registration);
exports.authRouter.post("/confirm-email", auth_controller_1.default.confirmEmail);
exports.authRouter.get("/me", bearerAuthorizationValidator_1.bearerAuthorizationValidator, auth_controller_1.default.me);
