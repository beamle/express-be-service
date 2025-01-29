import { body, param } from 'express-validator'
import { urlRegex } from "./controller/controllerValidation";
import { middlewareObjectIdChecker } from "../posts/posts.middlewares";

export const blogTitleInputValidator = body('name').trim().isString()
    .isLength({min:1, max: 15})
    .withMessage("Name should exist and should be less or equal to 15 symbols")

export const blogDescriptionInputValidator = body('description').trim().isString()
  .isLength({min:1, max: 500})
  .withMessage("Description should exist and should be less or equal to 15 symbols")

export const blogWebsiteUrlInputValidator = body('websiteUrl').isString().trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Website URL should exist and should be less or equal to 100 symbols")
  .matches(urlRegex)
  .withMessage("Invalid URL format");

export const blogIdAsParamValidator = param('blogId').isAlphanumeric().trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Blog id is required")

// export const blogIdAsParamValidator = param('blogId').toInt().isInt().withMessage("PROVERKA")


// export const blogIdAsParamValidator = param('blogId')
//   // .optional()
//   .custom(async (id) => {
//     const blog = await blogsRepository.findBy(id)
//     if (!blog) {
//       throw new Error('No blog with such id has been found!')
//     }
//     return true
//   })


export const blogInputValidators = [
  middlewareObjectIdChecker,
  blogTitleInputValidator,
  blogDescriptionInputValidator,
  blogWebsiteUrlInputValidator,
]