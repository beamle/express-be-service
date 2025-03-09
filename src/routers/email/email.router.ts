import { Request, Response, Router } from "express";
import nodemailer from "nodemailer"
import emailAdapter from "../../adapters/email.adapter";
import emailService from "./email.service";

export const emailRouter = Router({})

emailRouter.post("/send", async (req: Request, res: Response) => {
  await emailService.sendEmail(req.body.email, req.body.subject, req.body.message)
})

// tvbt ipsb dzjh kgud