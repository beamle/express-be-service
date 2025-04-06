import { body } from 'express-validator'

export const authPasswordInputValidator = body('password').trim().isString()
  .isLength({min:6, max: 20})
  .withMessage("Password should exist, should be less or equal to 20 symbols and at least 6")

export const authLoginInputValidator = body('login').trim().isString()
  .isLength({min:3, max: 10})
  .withMessage("Login should exist, should be less or equal to 10 symbols and at least 3")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Email should have a valid pattern: ^[a-zA-Z0-9_-]*$")

export const authEmailInputValidator = body('email').isString().trim()
  .isLength({ min: 1 })
  .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Email should have a valid pattern: ^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")

export const authValidators = [authPasswordInputValidator, authLoginInputValidator, authEmailInputValidator]