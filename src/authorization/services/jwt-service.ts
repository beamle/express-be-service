import { UserType } from "../../app/db";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from "../../app/settings";
import { CustomError } from "../../helpers/CustomError";

const JwtServiceErrors = {
  NO_CORRECT_TOKEN_PROVIDED: { message: "Unauthorized. You have to pass correct jwt token", field: "", status: 401 },
  NO_TOKEN_PROVIDED: { message: "Unauthorized. You didn't pass jwt token", field: "", status: 404 },
}

class jwtService {
  async createJWT(user: UserType): Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = jwt.sign({ userId: user._id }, SETTINGS.JWT_SECRET, { expiresIn: '10h' })
    const refreshToken = jwt.sign({ userId: user._id }, SETTINGS.JWT_SECRET, { expiresIn: '1d' });
    return { accessToken, refreshToken }
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