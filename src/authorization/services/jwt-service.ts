import { UserType, UserTypeViewModel } from "../../app/db";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from "../../app/settings";
import { CustomError } from "../../helpers/CustomError";

const JwtServiceErrors = {
  NO_CORRECT_TOKEN_PROVIDED: { message: "Unauthorized. You have to pass correct jwt token", field: "", status: 401 },
  NO_TOKEN_PROVIDED: { message: "Unauthorized. You didn't pass jwt token", field: "", status: 404 },
}

class jwtService {
  async createAccessToken(user: UserTypeViewModel): Promise<string> {
    return jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET, { expiresIn: '10h' })
  }

  async createRefreshToken(user: UserTypeViewModel, deviceId: string): Promise<{ refreshToken: string } & RefreshTokenPayloadType> {
    const refreshToken = jwt.sign({ userId: user.id, deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '1d' });
    const refreshTokenPayload = jwt.decode(refreshToken) as RefreshTokenPayloadType;

    return {
      refreshToken,
      ...refreshTokenPayload
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

  async decodeToken(token: string) {
    return jwt.decode(token) as RefreshTokenPayloadType
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    if (!token || token === "undefined") {
      throw new CustomError(JwtServiceErrors.NO_TOKEN_PROVIDED);
    }

    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET)
      return (result as JwtPayload).userId;
    } catch (e) {
      throw new CustomError(JwtServiceErrors.NO_CORRECT_TOKEN_PROVIDED)
    }
  }
}

export default new jwtService();