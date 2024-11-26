import { UserType } from "../../app/db";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SETTINGS } from "../../app/settings";
import { CustomError } from "../../helpers/CustomError";

const JwtServiceErrors = {
  NO_TOKEN_PROVIDED: { message: "Unauthorized. You have to pass correct jwt token", field: "", status: 401 },
}

class jwtService {
  async createJWT(user: UserType): Promise<string> {
    debugger
    const token = jwt.sign({ userId: user._id }, SETTINGS.JWT_SECRET, { expiresIn: '10h' })
    return token
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    debugger
    try {
      const result = jwt.verify(token, SETTINGS.JWT_SECRET)
      return (result as JwtPayload).userId;
    } catch (e) {
      throw new CustomError(JwtServiceErrors.NO_TOKEN_PROVIDED)
    }
  }
}

export default new jwtService();