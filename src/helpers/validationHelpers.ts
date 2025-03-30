import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "./CustomError";

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
    //
    // if (req.method === "GET" && formattedErrors.some(error => error.field === "blogId")) {
    //   return res.status(404).json({ errorsMessages: formattedErrors });
    // }
    //
    // if (req.method === "POST" && formattedErrors.some(error => error.field === "blogId")) {
    //   return res.status(404).json({ errorsMessages: formattedErrors });
    // }

    return res.status(400).json({ errorsMessages: formattedErrors });
  }
  next();
};


export function handleError(res: Response, error: any) {
  if (error.name === 'CustomError') {
    res.status(error.status).json({ message: error.message, field: error.field });
    return
  } else {
    // res.status(500).json(PostErrors.INTERNAL_SERVER_ERROR);
    res.status(500).json({ message: "Internal server error", field: "", status: 500 });
    console.log(res,"RES")
    return
  }
}

export function handleErrorAsArrayOfErrors(res: Response, error: any) {
  if (error.name === 'CustomError') {
    res.status(error.status).json([{ errorMessages: error.message, field: error.field }]);
    return
  } else {
    res.status(500).json({ message: "Internal server error", field: "", status: 500 });
    console.log(res,"RES")
    return
  }
}