import { Request, Response } from "express";
import { handleError, handleErrorAsArrayOfErrors } from "../../../helpers/validationHelpers";
import authService from "../auth.service";
import sessionService from "../../session/session.service";
import { CustomError } from "../../../helpers/CustomError";

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
    field: "email",
    status: 400
  },
  ACCOUNT_WAS_NOT_CREATED: {
    message: "Email sending failed. Registration rolled back.",
    field: "email",
    status: 400
  },
}


class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { accessToken, refreshToken } = await authService.login(req.body.loginOrEmail, req.body.password)
      res
        .status(200)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'development'
        })
        .json({ accessToken })
      return
    } catch (e) {
      handleError(res, e)
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await sessionService.logout(refreshToken)
      res.sendStatus(204)
      return
    } catch (e) {
      handleError(res, e)
    }
  }

  async updateTokens(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      debugger
      const { accessToken, refreshToken: newRefreshToken } = await sessionService.updateTokens(refreshToken)
      const secondCall = sessionService.updateTokens(refreshToken); // old token
      await secondCall.catch(err => console.log(err.message));
      debugger
      res
        .status(200)
        .cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict',  secure: process.env.NODE_ENV === 'development' })
        .json({ accessToken });
      return
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async registration(req: Request, res: Response): Promise<void> {
    const { email, password, login } = req.body;
    try {
      const user = await authService.registration({ email, password, login });
      res.status(204).json(user);
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async resendEmail(req: Request, res: Response) {
    try {
      await authService.resendEmail(req.body.email)
      res.sendStatus(204)
      return
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e)
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      await authService.confirmEmail(req.body.code, req.body.email)
      res.status(204).send()
      return
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
