import {Request, Response, NextFunction} from "express";

export const ADMIN_AUTH = "admin:qwerty"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"]

  if(!auth) {
    res.status(401).json({ message: "No authorization header"})
    return
  }

  if(!auth.startsWith("Basic")) {
    res.status(401).json({message: "Invalid authorization type"})
  }

  const encodedCredentials = Buffer.from(auth.slice(6), "base64").toString("utf8")

  if(ADMIN_AUTH === encodedCredentials) {
    next()
  }

}