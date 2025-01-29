"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersValidators = exports.userEmailInputValidator = exports.userLoginInputValidator = exports.userPasswordInputValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userPasswordInputValidator = (0, express_validator_1.body)('password').trim().isString()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password should exist, should be less or equal to 20 symbols and at least 6");
exports.userLoginInputValidator = (0, express_validator_1.body)('login').trim().isString()
    .isLength({ min: 3, max: 10 })
    .withMessage("Login should exist, should be less or equal to 10 symbols and at least 3")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Email should have a valid pattern: ^[a-zA-Z0-9_-]*$");
exports.userEmailInputValidator = (0, express_validator_1.body)('email').isString().trim()
    .isLength({ min: 1 })
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Email should have a valid pattern: ^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
exports.usersValidators = [exports.userPasswordInputValidator, exports.userLoginInputValidator, exports.userEmailInputValidator];
