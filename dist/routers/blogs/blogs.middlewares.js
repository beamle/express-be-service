"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputValidators = exports.blogIdAsParamValidator = exports.blogWebsiteUrlInputValidator = exports.blogDescriptionInputValidator = exports.blogTitleInputValidator = void 0;
const express_validator_1 = require("express-validator");
const controllerValidation_1 = require("./controller/controllerValidation");
const posts_middlewares_1 = require("../posts/posts.middlewares");
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
exports.blogIdAsParamValidator = (0, express_validator_1.param)('blogId').isAlphanumeric().trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Blog id is required");
// export const blogIdAsParamValidator = param('blogId')
//   // .optional()
//   .custom(async (id) => {
//     const blog = await blogsRepository.findBy(id)
//     if (!blog) {
//       throw new Error('No blog with such id has been found!')
//     }
//     return true
//   })
exports.blogInputValidators = [
    posts_middlewares_1.middlewareObjectIdChecker,
    exports.blogTitleInputValidator,
    exports.blogDescriptionInputValidator,
    exports.blogWebsiteUrlInputValidator,
];
