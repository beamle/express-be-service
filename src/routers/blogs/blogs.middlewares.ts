import { body, param } from 'express-validator'
import { urlRegex } from "./controller/controllerValidation";
import { blogsRepository } from "./blogs.repository";

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

export const blogIdInputValidator = param('id')
  // .optional()
  .custom(async (blogId) => {
    debugger
    const blog = await blogsRepository.findBy(blogId)
    if (!blog && blogId !== undefined) {
      throw new Error('No blog with such id has been found!')
    }
    return true
  })


export const blogInputValidators = [
  blogTitleInputValidator,
  blogDescriptionInputValidator,
  blogWebsiteUrlInputValidator,
]