import nodemailer from "nodemailer";
import {config} from 'dotenv'
import { CustomError } from "../helpers/CustomError";

config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class EmailAdapter {

  async sendEmail(email: string, message: string, subject?: string) {
    try {
      console.log(`email`, email)
      console.log(`message`, message)
      console.log(`subject`, subject)
      const info = await transporter.sendMail({
        from: 'Nikita <nikitadevmode@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
      });
      return info
    } catch (e) {
      console.log('Error sending email: ', e)
      throw new CustomError({
        message: "Something went wrong with sending email",
        field: "email STMP service",
        status: 400
      })
    }
  }
}

export default new EmailAdapter()