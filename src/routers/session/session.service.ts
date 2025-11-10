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

  NO_USER_ID_PROVIDED_: {
    message: 'UserId was not provided!',
    field: 'userId',
    status: 404,
  },

  NO_USERAGENT_OR_IP_PROVIDED: {
    message: 'No user agent or ip provided!',
    field: 'device_id',
    status: 404,
  },

  TRYING_TO_DELETE_OTHER_USER_DATA: {
    message: 'Trying to delete other user data. UserId is incorrect!',
    field: 'ip',
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

  async getAllSessionsBy(userId: string | undefined) {
    if (!userId) throw new CustomError(SessionErrors.NO_USER_ID_PROVIDED_)
    const result = await sessionRepository.findAllSessionsByUser(userId);

    if (!result) {
      throw new CustomError(SessionErrors.NO_SESSIONS_FOR_USER_ID);
    }

    return result;
  }

  async deleteAllSessionsExceptCurrent(refreshToken: string) {
    if (!refreshToken) {
      throw new CustomError(SessionErrors.NO_REFRESH_TOKEN);
    }

    await this.checkIfRefreshTokenIsNotBlacklisted(refreshToken);

    const { userId, deviceId } = await jwtService.parseAndValidateRefreshToken(refreshToken, SETTINGS.JWT_SECRET);

    if (!userId) {
      throw new CustomError(SessionErrors.NO_USER_ID_PROVIDED_);
    }

    return await sessionRepository.deleteAllSessionsExceptDevice(userId, deviceId);
  }

  async deleteDeviceSessionByDeviceId(userId: string | undefined, deviceId: string | undefined): Promise<boolean> {
    if (!userId) throw new CustomError(SessionErrors.NO_USER_ID_PROVIDED_)
    if (!deviceId) throw new CustomError(SessionErrors.NO_SESSIONS_FOR_USER_ID)

    const session = await sessionRepository.findSessionByDeviceId(deviceId);
    if (!session) throw new CustomError(SessionErrors.NO_SESSIONS_FOR_USER_ID);

    if (session.user_id !== userId) {
      throw new CustomError(SessionErrors.TRYING_TO_DELETE_OTHER_USER_DATA)
    }

    const result = await sessionRepository.deleteSessionByDeviceId(deviceId);
    return result.deletedCount > 0;
  }
}

export default new SessionService();
