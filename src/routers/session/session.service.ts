import { SETTINGS } from '../../app/settings';
import jwtService from '../../authorization/services/jwt-service';
import { CustomError } from '../../helpers/CustomError';
import { UsersErrors } from '../users/meta/Errors';
import usersService from '../users/users.service';
import { sessionRepository } from './session.repository';
import { SessionMeta } from './session.types';

export const SessionErrors = {
  NO_REFRESH_TOKEN: {
    message: 'No refresh token',
    field: 'refreshToken',
    status: 401,
  },
  INVALID_REFRESH_TOKEN: {
    message: 'Invalid refresh token',
    field: 'refreshToken',
    status: 401,
  },
  REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST: {
    message: "Refresh token wasn't added to blacklist",
    field: 'refreshToken',
    status: 401,
  },
  INVALID_OR_EXPIRED_REFRESH_TOKEN: {
    message: 'Invalid or expired refresh token',
    field: 'refreshToken',
    status: 401,
  },

  NO_SESSIONS_FOR_USER_ID: {
    message: 'No sessions for such userId was found!',
    field: 'id',
    status: 404,
  },
};

class SessionService {
  async updateTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    await this.checkIfRefreshTokenIsNotBlacklisted(refreshToken);
    const { userId, deviceId } = await jwtService.parseAndValidateRefreshToken(refreshToken, SETTINGS.JWT_SECRET);

    const result = await sessionRepository.addRefreshTokenToBlackList(refreshToken);
    if (!result.acknowledged) {
      throw new CustomError(SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST);
    }

    const user = await usersService.getUserBy({ id: userId });
    if (!user) {
      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN);
    }

    const newAccessToken = await jwtService.createAccessToken(user);
    const { refreshToken: newRefreshToken } = await jwtService.createRefreshToken(user, deviceId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new CustomError(SessionErrors.INVALID_OR_EXPIRED_REFRESH_TOKEN);
    }

    const isInvalid = await sessionRepository.checkIfRefreshTokenInBlackList(refreshToken);
    if (isInvalid) {
      throw new CustomError(SessionErrors.INVALID_OR_EXPIRED_REFRESH_TOKEN);
    }

    await jwtService.parseAndValidateRefreshToken(refreshToken, SETTINGS.JWT_SECRET);

    const result = await sessionRepository.addRefreshTokenToBlackList(refreshToken);
    if (!result.acknowledged) {
      throw new CustomError(SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST);
    }
  }

  async checkIfRefreshTokenIsNotBlacklisted(refreshToken: string) {
    const isInvalid = await sessionRepository.checkIfRefreshTokenInBlackList(refreshToken);
    if (isInvalid) throw new CustomError(SessionErrors.INVALID_OR_EXPIRED_REFRESH_TOKEN);
    return true;
  }

  async createSession(sessionMeta: SessionMeta) {
    const result = await sessionRepository.create(sessionMeta);

    return { id: result.insertedId.toString(), ...sessionMeta };
  }

  async getAllSessionsBy(userId: string) {
    const result = await sessionRepository.findAllSessionsByUser(userId);

    if (!result) {
      throw new CustomError(SessionErrors.NO_SESSIONS_FOR_USER_ID);
    }

    return result;
  }
}

export default new SessionService();
