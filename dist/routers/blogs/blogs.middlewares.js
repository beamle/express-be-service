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
exports.inputCheckErrorsFormatter = exports.blogInputValidators = exports.blogIdInputValidator = exports.blogWebsiteUrlInputValidator = exports.blogDescriptionInputValidator = exports.blogTitleInputValidator = void 0;
const express_validator_1 = require("express-validator");
const controllerValidation_1 = require("./controller/controllerValidation");
const blogs_repository_1 = require("./blogs.repository");
exports.blogTitleInputValidator = (0, express_validator_1.body)('name').trim().isString()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name should exist and should be less or equal to 15 symbols");
exports.blogDescriptionInputValidator = (0, express_validator_1.body)('description').trim().isString()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description should exist and should be less or equal to 15 symbols");
exports.blogWebsiteUrlInputValidator = (0, express_validator_1.body)('websiteUrl').isString().trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Website URL should exist and should be less or equal to 100 symbols")
    .matches(controllerValidation_1.urlRegex)
    .withMessage("Invalid URL format");
exports.blogIdInputValidator = (0, express_validator_1.param)('id')
    .optional()
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repository_1.blogsRepository.findBy(blogId);
    if (!blog && blogId !== undefined) {
        return new Error('No blog with such id has been found!');
    }
    return true;
}));
exports.blogInputValidators = [
    exports.blogTitleInputValidator,
    exports.blogDescriptionInputValidator,
    exports.blogWebsiteUrlInputValidator,
];
const inputCheckErrorsFormatter = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
        const formattedErrors = errors.map((err) => {
            console.log(errors, "ERRORS");
            return {
                message: err.msg,
                field: err.path
            };
        });
        return res.status(400).json({ errorsMessages: formattedErrors });
    }
    next();
};
exports.inputCheckErrorsFormatter = inputCheckErrorsFormatter;
