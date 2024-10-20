import { body, param } from 'express-validator'
import { postsRepository } from "./posts.repository";
import { blogsRepository } from "../blogs/blogs.repository";

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
  .isLength({min: 1})
  .withMessage("No blog id provided!")
  .custom(async (blogId) => {
    const blog = await blogsRepository.findBy(blogId)
    if (!blog) {
      throw new Error('No blog with such id has been found!')
    }
    return true
  })

export const postIdInputValidator = param('id')
  .optional()
  .custom(async (id) => {
    const post = await postsRepository.findBy(id)
    if (!post && id !== undefined) {
      throw new Error('No post with such id has been found!')
    }
    return true
  })


export const postInputValidators = [
  postBlogIdAsForeignKeyIdInputValidator,
  postTitleInputValidator,
  postShortDescriptionInputValidator,
  postContentInputValidator,
]