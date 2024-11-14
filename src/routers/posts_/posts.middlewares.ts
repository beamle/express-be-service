import { body } from 'express-validator'
import { blogsRepository } from "../blogs/blogs.repository";
import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../helpers/CustomError";

export const postTitleInputValidator = body('title').trim().isString()
    .isLength({min:1, max: 30})
    .withMessage("Title should exist and should be less or equal to 30 symbols")

export const postShortDescriptionInputValidator = body('shortDescription').trim().isString()
  .isLength({min:1, max: 100})
  .withMessage("Short description should exist and should be less or equal to 100 symbols")

export const postContentInputValidator = body('content').isString().trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Content should exist and should be less or equal to 1000 symbols")

export const postBlogIdAsForeignKeyIdInputValidator = body('blogId')
  .trim()
  .isLength({ min: 24, max: 24 })
  .withMessage("Invalid blog ID length!")
  .isHexadecimal()
  .withMessage("Blog ID must be a valid hexadecimal value!")
  .custom(async (blogId) => {
      const blog = await blogsRepository.findBy(new ObjectId(blogId))
      if (!blog) {
        throw new CustomError({ message: 'No blog with such id has been found!', field: 'blogId', status: 400 })
      }
    })

export const middlewareObjectIdChecker = (req: Request, res: Response, next: NextFunction) => {
  // if(!ObjectId.isValid(req.params.id)){
  //   res.status(404).json({message: "Not found", field: "id"})
  //   return
  // }
  next()
} // : TODO VYTASHI V ODNELINYJ FAIL
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


export const postInputValidators = [
  middlewareObjectIdChecker,
  postTitleInputValidator,
  postShortDescriptionInputValidator,
  postBlogIdAsForeignKeyIdInputValidator,
  postContentInputValidator,
]