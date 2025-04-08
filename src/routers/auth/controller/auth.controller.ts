import usersService from "../../users/users.service";
import { Request, Response } from "express";
import { handleError, handleErrorAsArrayOfErrors } from "../../../helpers/validationHelpers";
import jwtService from "../../../authorization/services/jwt-service";
import usersQueryRepository from "../../users/users.queryRepository";
import emailManager from "../../../managers/email.manager";
import usersRepository from "../../users/users.repository";
import authService from "../auth.service";
import { UserTypeViewModel } from "../../../app/db";
import { uuid } from "uuidv4";
import { ObjectId } from "mongodb";
import { CustomError } from "../../../helpers/CustomError";
import { UsersErrors } from "../../users/meta/Errors";

export const AuthErrors = {
  EMAIL_CONFIRMATION_PROBLEM: {
    message: "Something wrong with email confirmation. Code is confirmed already or expirtationDate has expired",
    field: "code",
    status: 400
  },
  ACCOUNT_ALREADY_CONFIRMED: {
    message: "Your account is already confirmed",
    field: "code",
    status: 400
  },
  EMAIL_ALREADY_CONFIRMED: {
    message: "Your email is already confirmed",
    field: "code",
    status: 400
  },
}


class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
      if (user) {
        const {accessToken, refreshToken} = await jwtService.createJWT(user)
        res
          .status(200)
          .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
          // .header('Authorization', accessToken)
          .json({ accessToken });
        // res.status(200).json({ accessToken: accessToken })
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
      const user = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
      // const user = await usersQueryRepository.getUserBy({ email: createdUserId.toString() }) as UserTypeViewModel
debugger
      try {
        await emailManager.sendEmailConfirmationMessage(user, generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode), "Registration confirmation") // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
      } catch (e) {
        handleErrorAsArrayOfErrors(res, e)
        await usersRepository.deleteUser(createdUserId)
      }
      res.status(204).json(user)
      return
      // }
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async resendEmail(req: Request, res: Response) {
    const { email } = req.body
    try {
      const user = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
      if (user.emailConfirmation.isConfirmed) {
        throw new CustomError(AuthErrors.EMAIL_ALREADY_CONFIRMED);
      }

      const newConfirmationCode = uuid()
      await usersRepository.updateUserConfirmationCode(new ObjectId(user.id), newConfirmationCode)
      const updatedUser = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
      await emailManager.sendEmailConfirmationMessage(updatedUser, generateEmailConfirmationMessage(updatedUser.emailConfirmation.confirmationCode), "Resending registration email")      // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
      res.sendStatus(204)
      return

    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      const result = await authService.confirmEmail(req.body.code, req.body.email)
      if (result) {
        res.status(204).send()
        return
      } else {
        throw new CustomError(AuthErrors.ACCOUNT_ALREADY_CONFIRMED)
      }
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async me(req: Request, res: Response) {
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
    `     <a href=https://somesite.com/confirm-registration?code=${code}>complete registration</a>\n` +
    " </p>\n"
}