import { NextFunction, Request, Response } from "express";
import jwtService from "../services/jwt-service";
import authQueryRepository from "../../routers/auth/auth.queryRepository";

export async function bearerAuthorizationValidator(req: Request, res: Response, next: NextFunction) {
  debugger
  const auth = req.headers["authorization"]

  if (!auth) {
    res.status(401).json({ message: "No authorization header" })
    return
  }

  if (!auth.startsWith("Bearer")) {
    res.status(401).json({ message: "Invalid authorization type" })
    return
  }

  const token = req.headers.authorization!.split(' ')[1]

  const userId = await jwtService.getUserIdByToken(token)
  if (userId) {
    const user =  await authQueryRepository.getMeBy(userId)
    req.context.user = user
    next()
  }
  // res.sendStatus(401)
}