import usersQueryRepository from "../users/users.queryRepository";
import { UserTypeViewModel } from "../../app/db";
import usersRepository from "../users/users.repository";
import { ObjectId } from "mongodb";
import { CustomError } from "../../helpers/CustomError";
import { CommentsErrors } from "../comments/comments.service";
import { UsersErrors } from "../users/meta/Errors";
import { AuthErrors } from "./controller/auth.controller";

class AuthService {
  async confirmEmail(code: string, email: string) {
    debugger
    let user = await usersRepository.findUserBy({ "emailConfirmation.confirmationCode": code })
    if (!user){
      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_CODE_EXIST)
    }
    // && user.emailConfirmation.expirationDate > new Date()
    if (user.emailConfirmation.confirmationCode === code) {
      const result = await usersRepository.updateConfirmation(new ObjectId(user._id))
      return result
    } else {
      throw new CustomError(AuthErrors.ACCOUNT_ALREADY_CONFIRMED)
    }
  }

}

export default new AuthService()