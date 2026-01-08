import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserTypeViewModel } from '../../app/db';
import { SETTINGS } from '../../app/settings';
import { CustomError } from '../../helpers/CustomError';
import { SessionErrors } from '../../routers/session/session.service';

export const JwtServiceErrors = {
  NO_CORRECT_TOKEN_PROVIDED: { message: 'Unauthorized. You have to pass correct jwt token', field: '', status: 401 },
  NO_TOKEN_PROVIDED: { message: "Unauthorized. You didn't pass jwt token", field: '', status: 404 },
};

class jwtService {
  async createAccessToken(user: UserTypeViewModel): Promise<string> {
    return jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET, { expiresIn: '5m' });
  }

  async createRefreshToken(
    user: UserTypeViewModel,
    deviceId: string,
  ): Promise<{ refreshToken: string } & RefreshTokenPayloadType> {
    const refreshToken = jwt.sign({ userId: user.id, deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '5m' });
    const refreshTokenPayload = jwt.decode(refreshToken) as RefreshTokenPayloadType;

    return {
      refreshToken,
      ...refreshTokenPayload,
    };
  }

  async isTokenValid(token: string, key: string): Promise<boolean> {
    try {
      jwt.verify(token, key);
      return true;
    } catch (err) {
      return false;
    }
  }

  async parseAndValidateRefreshToken(token: string, key: string) {
    const isValid = await this.isTokenValid(token, key);
    if (!isValid) throw new CustomError(SessionErrors.INVALID_REFRESH_TOKEN);

    const decoded = await this.decodeToken(token);
    debugger;
    if (!decoded?.userId || !decoded?.deviceId || !decoded?.iat) {
      throw new CustomError(SessionErrors.INVALID_REFRESH_TOKEN);
    }

    return decoded; // With userId, deviceId, iat
  }

  async decodeToken(token: string) {
    const decoded = jwt.decode(token) as RefreshTokenPayloadType;
    if (!decoded?.userId || !decoded?.deviceId || !decoded?.iat) {
      throw new CustomError(SessionErrors.INVALID_REFRESH_TOKEN);
    }

    return decoded;
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    if (!token || token === 'undefined') {
      throw new CustomError(JwtServiceErrors.NO_TOKEN_PROVIDED);
    }

    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET);
      return (result as JwtPayload).userId;
    } catch (e) {
      throw new CustomError(JwtServiceErrors.NO_CORRECT_TOKEN_PROVIDED);
    }
  }
}

export default new jwtService();
