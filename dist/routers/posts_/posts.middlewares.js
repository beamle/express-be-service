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
exports.postInputValidators = exports.middlewareObjectIdChecker = exports.postBlogIdAsForeignKeyIdInputValidator = exports.postContentInputValidator = exports.postShortDescriptionInputValidator = exports.postTitleInputValidator = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../blogs/blogs.repository");
const mongodb_1 = require("mongodb");
const posts_service_1 = require("./posts.service");
exports.postTitleInputValidator = (0, express_validator_1.body)('title').trim().isString()
    .isLength({ min: 1, max: 30 })
    .withMessage("Title should exist and should be less or equal to 30 symbols");
exports.postShortDescriptionInputValidator = (0, express_validator_1.body)('shortDescription').trim().isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("Short description should exist and should be less or equal to 100 symbols");
exports.postContentInputValidator = (0, express_validator_1.body)('content').isString().trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content should exist and should be less or equal to 1000 symbols");
exports.postBlogIdAsForeignKeyIdInputValidator = (0, express_validator_1.body)('blogId')
    .trim()
    .isLength({ min: 24, max: 24 })
    .withMessage("Invalid blog ID length!")
    .isHexadecimal()
    .withMessage("Blog ID must be a valid hexadecimal value!")
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repository_1.blogsRepository.findBy(new mongodb_1.ObjectId(blogId));
    if (!blog) {
        throw new posts_service_1.CustomError({ message: 'No blog with such id has been found!', field: 'blogId', status: 400 });
    }
}));
const middlewareObjectIdChecker = (req, res, next) => {
    // if(!ObjectId.isValid(req.params.id)){
    //   res.status(404).json({message: "Not found", field: "id"})
    //   return
    // }
    next();
}; // : TODO VYTASHI V ODNELINYJ FAIL
exports.middlewareObjectIdChecker = middlewareObjectIdChecker;
// .custom(async (blogId) => {
//   const blog = await blogsRepository.findBy(new ObjectId(blogId))
//   if (!blog) {
//     throw new Error('No blog with such id has been found!')
//   }
//   return true
// })
// export const postIdInputValidator = param('id')
//   .optional()
//   .custom(async (id) => {
//     const post = await postsRepository.findBy(id)
//     if (!post && id !== undefined) {
//       throw new Error('No post with such id has been found!')
//     }
//     return true
//   })
exports.postInputValidators = [
    exports.middlewareObjectIdChecker,
    exports.postTitleInputValidator,
    exports.postShortDescriptionInputValidator,
    exports.postBlogIdAsForeignKeyIdInputValidator,
    exports.postContentInputValidator,
];
