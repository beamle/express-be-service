import {Request, Response, NextFunction} from "express";

export const ADMIN_AUTH = "admin:qwerty"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"]
  console.log(req.params)
  if(!auth) {
    res.status(401).json({ message: "No authorization header"})
    return
  }

  if(!auth.startsWith("Basic")) {
    res.status(401).json({message: "Invalid authorization type"})
    return
  }

  const codeToBase64Local = Buffer.from(ADMIN_AUTH).toString("base64")

  if(codeToBase64Local === auth.slice(6)) {
    next()
  } else {
    res.status(401).send()
  }

}