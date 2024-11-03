"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputValidators = exports.middlewareObjectIdChecker = exports.postBlogIdAsForeignKeyIdInputValidator = exports.postContentInputValidator = exports.postShortDescriptionInputValidator = exports.postTitleInputValidator = void 0;
const express_validator_1 = require("express-validator");
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
    .isLength({ min: 1, max: 24 })
    .withMessage("No blog id provided!");
// .custom(async (blogId) => {
//     const blog = await blogsRepository.findBy(new ObjectId(blogId))
//     if (!blog) {
//       throw new Error('No blog with such id has been found!')
//     }
//   })
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
    exports.postBlogIdAsForeignKeyIdInputValidator,
    exports.postTitleInputValidator,
    exports.postShortDescriptionInputValidator,
    exports.postContentInputValidator,
];
