import { NextFunction, Request, Response } from "express";
import jwtService from "../services/jwt-service";
import authQueryRepository from "../../routers/auth/auth.queryRepository";
import { handleError } from "../../helpers/validationHelpers";

export async function bearerAuthorizationValidator(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"]
  debugger

  if (!auth) {
    res.status(401).json({ message: "No authorization header" })
    return
  }

  if (!auth.startsWith("Bearer")) {
    res.status(401).json({ message: "Invalid authorization type" })
    return
  }

  const token = req.headers.authorization!.split(' ')[1]

  try {
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
      const user = await authQueryRepository.getMeBy(userId)
      req.context.user = user
      next()
    }
  } catch (e) {
    handleError(res, e)
  }
  // res.sendStatus(401)
}