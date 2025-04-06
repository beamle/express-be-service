"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const auth_controller_1 = __importDefault(require("./controller/auth.controller"));
const express_1 = require("express");
const bearerAuthorizationValidator_1 = require("../../authorization/middlewares/bearerAuthorizationValidator");
const auth_middlewares_1 = require("./auth.middlewares");
const validationHelpers_1 = require("../../helpers/validationHelpers");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post("/login", auth_controller_1.default.login);
exports.authRouter.post("/registration", ...auth_middlewares_1.authValidators, validationHelpers_1.inputCheckErrorsFormatter, auth_controller_1.default.registration);
exports.authRouter.post("/registration-confirmation", auth_controller_1.default.confirmEmail);
exports.authRouter.get("/registration-email-resending", auth_controller_1.default.resendEmail);
exports.authRouter.get("/me", bearerAuthorizationValidator_1.bearerAuthorizationValidator, auth_controller_1.default.me);
