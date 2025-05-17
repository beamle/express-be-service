"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputValidators = exports.middlewareObjectIdChecker = void 0;
// export const postTitleInputValidator = body('title').trim().isString()
//   .isLength({ min: 1, max: 30 })
//   .withMessage("Title should exist and should be less or equal to 30 symbols")
//
// export const postShortDescriptionInputValidator = body('shortDescription').trim().isString()
//   .isLength({ min: 1, max: 100 })
//   .withMessage("Short description should exist and should be less or equal to 100 symbols")
//
// export const postContentInputValidator = body('content').isString().trim()
//   .isLength({ min: 1, max: 1000 })
//   .withMessage("Content should exist and should be less or equal to 1000 symbols")
//
// export const postBlogIdAsForeignKeyIdInputValidator = body('blogId')
//   .trim()
//   .isLength({ min: 24, max: 24 })
//   .withMessage("Invalid blog ID length!")
//   .isHexadecimal()
//   .withMessage("Blog ID must be a valid hexadecimal value!")
//   .custom(async (blogId) => {
//     const blog = await blogsRepository.findBy(new ObjectId(blogId))
//     if (!blog) {
//       throw new CustomError({ message: 'No blog with such id has been found!', field: 'blogId', status: 400 })
//     }
//   })
//
// export const postCommentContentValidator = body("content")
//   .isLength({ min: 20, max: 300 })
//   .withMessage("Length of content must be at least 20 symbols up to 300 symbols")
const middlewareObjectIdChecker = (req, res, next) => {
    // if(!ObjectId.isValid(req.params.id)){
    //   res.status(404).json({message: "Not found", field: "id"})
    //   return
    // }
    next();
};
exports.middlewareObjectIdChecker = middlewareObjectIdChecker;
exports.postInputValidators = [
    exports.middlewareObjectIdChecker,
    // postTitleInputValidator,
    // postShortDescriptionInputValidator,
    // postBlogIdAsForeignKeyIdInputValidator,
    // postContentInputValidator,
];
