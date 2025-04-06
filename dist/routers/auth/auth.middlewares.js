"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidators = exports.authEmailInputValidator = exports.authLoginInputValidator = exports.authPasswordInputValidator = void 0;
const express_validator_1 = require("express-validator");
exports.authPasswordInputValidator = (0, express_validator_1.body)('password').trim().isString()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password should exist, should be less or equal to 20 symbols and at least 6");
exports.authLoginInputValidator = (0, express_validator_1.body)('login').trim().isString()
    .isLength({ min: 3, max: 10 })
    .withMessage("Login should exist, should be less or equal to 10 symbols and at least 3")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Email should have a valid pattern: ^[a-zA-Z0-9_-]*$");
exports.authEmailInputValidator = (0, express_validator_1.body)('email').isString().trim()
    .isLength({ min: 1 })
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("Email should have a valid pattern: ^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
exports.authValidators = [exports.authPasswordInputValidator, exports.authLoginInputValidator, exports.authEmailInputValidator];
