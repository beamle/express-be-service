import { Request, Response } from "express";
import {
  handleError,
  handleErrorAsArrayOfErrors,
} from "../../../helpers/validationHelpers";
import sessionService from "../../session/session.service";
import authService from "../auth.service";

export const AuthErrors = {
  EMAIL_CONFIRMATION_PROBLEM: {
    message:
      "Something wrong with email confirmation. Code is confirmed already or expirtationDate has expired",
    field: "code",
    status: 400,
  },
  ACCOUNT_ALREADY_CONFIRMED: {
    message: "Your account is already confirmed",
    field: "code",
    status: 400,
  },
  EMAIL_ALREADY_CONFIRMED: {
    message: "Your email is already confirmed",
    field: "email",
    status: 400,
  },
  ACCOUNT_WAS_NOT_CREATED: {
    message: "Email sending failed. Registration rolled back.",
    field: "email",
    status: 400,
  },
};
export function getDeviceInfo(userAgent: string): {
  deviceType: string;
  deviceName: string | null;
} {
  let deviceType = "Unknown";
  let deviceName: string | null = null;

  if (/android/i.test(userAgent)) {
    deviceType = "Mobile";
    const match = userAgent.match(/\((?:Linux; )?Android.*?; ([^)]+)\)/i);
    if (match && match[1]) deviceName = match[1].trim();
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = "Mobile";
    deviceName = /iPhone/i.test(userAgent)
      ? "iPhone"
      : /iPad/i.test(userAgent)
      ? "iPad"
      : "iOS Device";
  } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
    deviceType = "Mac";
  } else if (/Windows NT/i.test(userAgent)) {
    deviceType = "PC";
  } else if (/Linux/i.test(userAgent)) {
    deviceType = "PC";
  }

  return { deviceType, deviceName };
}

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { accessToken, refreshToken, refreshPayload, user } =
        await authService.login(req.body.loginOrEmail, req.body.password);

      const userAgent = req.headers["user-agent"] || "Unknown";
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const { deviceType, deviceName } = getDeviceInfo(userAgent);
      await sessionService.createSession({
        user_id: user.id,
        device_id: refreshPayload.deviceId,
        device_name: `${deviceType}${deviceName ? ` - ${deviceName}` : ""}`,
        ip: String(ip),
        iat: new Date(refreshPayload.iat * 1000),
        exp: new Date(refreshPayload.exp * 1000),
      });

      res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "development",
        })
        .json({ accessToken });
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await sessionService.logout(refreshToken);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }

  async updateTokens(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      debugger;
      const { accessToken, refreshToken: newRefreshToken } =
        await sessionService.updateTokens(refreshToken);
      const secondCall = sessionService.updateTokens(refreshToken); // old token
      await secondCall.catch((err) => console.log(err.message));
      debugger;
      res
        .status(200)
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "development",
        })
        .json({ accessToken });
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
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
      await authService.resendEmail(req.body.email);
      res.sendStatus(204);
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      await authService.confirmEmail(req.body.code, req.body.email);
      res.status(204).send();
      return;
    } catch (e) {
      handleErrorAsArrayOfErrors(res, e);
    }
  }

  async me(req: Request, res: Response) {
    try {
      res.status(200).json(req.context.user);
      return;
    } catch (e) {
      handleError(res, e);
    }
  }
}

export default new AuthController();
