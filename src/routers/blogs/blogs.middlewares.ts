import { NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'
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
  .optional()
  .custom(async (blogId) => {
    const blog = await blogsRepository.findBy(blogId)
    if (!blog && blogId !== undefined) {
      return new Error('No blog with such id has been found!')
    }
    return true
  })


export const blogInputValidators = [
  blogTitleInputValidator,
  blogDescriptionInputValidator,
  blogWebsiteUrlInputValidator,
]

export const inputCheckErrorsFormatter = (req: any, res: any, next: NextFunction) => {
  const errors = validationResult(req).array({ onlyFirstError: true })
  if (errors.length > 0) {
    const formattedErrors = errors.map((err: any) => {
      console.log(errors, "ERRORS")
      return {
        message: err.msg,
        field: err.path
      }
    });
    return res.status(400).json({ errorsMessages: formattedErrors });
  }
  next();
};