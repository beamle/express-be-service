import usersService from "../../users/users.service";
import { Request, Response } from "express";
import { handleError, handleErrorAsArrayOfErrors } from "../../../helpers/validationHelpers";
import jwtService from "../../../authorization/services/jwt-service";
import usersQueryRepository from "../../users/users.queryRepository";
import emailManager from "../../../managers/email.manager";
import usersRepository from "../../users/users.repository";
import authService from "../auth.service";
import { UserTypeViewModel } from "../../../app/db";
import { CustomError } from "../../../helpers/CustomError";
import { CommentsErrors } from "../../comments/comments.service";
import { uuid } from "uuidv4";
import { ObjectId } from "mongodb";

export const AuthErrors = {
  EMAIL_CONFIRMATION_PROBLEM: { message: "Something wrong with email confirmation. Check isConfirmed or expirtationDate", field: "", status: 404 },
}


class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      if (user) {
        const token = await jwtService.createJWT(user)
        res.status(200).json({ accessToken: token })
        return
      }
    } catch (e) {
      handleError(res, e)
    }
  }

  async registration(req: Request, res: Response) {
    const { email, password, login } = req.body
    try {
      await usersQueryRepository.getUserBy({ email })
      await usersQueryRepository.getUserBy({ login })

      const createdUserId = await usersService.createUser({ email, password, login }, false)
      if (createdUserId) {
        const user = await usersQueryRepository.getUserBy({ id: createdUserId.toString() }) as UserTypeViewModel
        try {
          // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
          await emailManager.sendEmailConfirmationMessage(user, generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode))
        } catch (e) {
          handleErrorAsArrayOfErrors(res, e)
          await usersRepository.deleteUser(createdUserId)
        }
        res.status(204).json(user)
        return
      }
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async resendEmail(req: Request, res: Response) {
    debugger
    const { email } = req.body
    try {
      const user = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
      debugger
      // if(user.emailConfirmation.isConfirmed || user.emailConfirmation.expirationDate < new Date()) {
      if(user.emailConfirmation.isConfirmed) {
        res.sendStatus(200)
        return
        // throw new CustomError(AuthErrors.EMAIL_CONFIRMATION_PROBLEM)
      }

      const newConfirmationCode = uuid()

      await usersRepository.updateUserConfirmationCode(new ObjectId(user.id), newConfirmationCode)
      const updatedUser = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
      // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
      await emailManager.sendEmailConfirmationMessage(updatedUser, generateEmailConfirmationMessage(updatedUser.emailConfirmation.confirmationCode))
      res.sendStatus(204)
      return

    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async confirmEmail(req: Request, res: Response) {
    debugger
    try {
      const result = await authService.confirmEmail(req.body.code, req.body.email)
      if(result) {
        res.status(201).send()
      } else {
        res.status(404).send()
      }
    } catch (e) {
      handleError(res, e)
    }
  }

  async me(req: Request, res: Response) {
    debugger
    try {
      res.status(200).json(req.context.user)
      return
    } catch (e) {
      handleError(res, e)
    }
  }
}

export default new AuthController()

// utils

const generateEmailConfirmationMessage = (code: string) => {
  return "<h1>Thank you for your registration</h1>\n" +
    " <p>To finish registration please follow the link below:\n" +
    `     <a href=https://somesite.com/confirm-email?code=${code}>complete registration</a>\n` +
    " </p>\n"
}
