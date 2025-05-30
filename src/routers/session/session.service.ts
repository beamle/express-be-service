import { CustomError } from "../../helpers/CustomError";
import jwtService from "../../authorization/services/jwt-service";
import { sessionRepository } from "./session.repository";
import usersService from "../users/users.service";
import { UsersErrors } from "../users/meta/Errors";
import { SETTINGS } from "../../app/settings";

export const SessionErrors = {
  NO_REFRESH_TOKEN: { message: 'No refresh token', field: "refreshToken", status: 401 },
  INVALID_REFRESH_TOKEN: { message: 'Invalid refresh token', field: "refreshToken", status: 401 },
  REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST: {
    message: 'Refresh token wasn\'t added to blacklist',
    field: "refreshToken",
    status: 401
  },
}

class SessionService {
  async updateTokens(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    const { userId, deviceId } = await jwtService.parseAndValidateRefreshToken(refreshToken, SETTINGS.JWT_SECRET)

    const result = await sessionRepository.addRefreshTokenToBlackList(refreshToken)
    if (!result.acknowledged) {
      throw new CustomError(SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST)
    }

    const user = await usersService.getUserBy({ id: userId })
    if (!user) {
      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN)
    }

    const newAccessToken = await jwtService.createAccessToken(user);
    const { refreshToken: newRefreshToken } = await jwtService.createRefreshToken(user, deviceId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout(refreshToken: string) {
    await jwtService.parseAndValidateRefreshToken(refreshToken, SETTINGS.JWT_SECRET)

    const result = await sessionRepository.addRefreshTokenToBlackList(refreshToken)
    if (!result.acknowledged) {
      throw new CustomError(SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST)
    }
  }
}

export default new SessionService();