import { NextFunction } from "express";
import { validationResult } from "express-validator";

export const inputCheckErrorsFormatter = (req: any, res: any, next: NextFunction) => {
  const errors = validationResult(req).array({ onlyFirstError: true })
  debugger
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