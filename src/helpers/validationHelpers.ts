import { NextFunction } from "express";
import { validationResult } from "express-validator";

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
    // TODO: SPROSITJ KAK PRAVILJNO OBrabatyvatj v formatter raznye case oshibok
    // if (req.method === "DELETE" && formattedErrors.some(error => error.field === "id")) {
    //   return res.status(404).json({ errorsMessages: formattedErrors });
    // }

    return res.status(400).json({ errorsMessages: formattedErrors });
  }
  next();
};