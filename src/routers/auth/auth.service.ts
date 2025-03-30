import usersQueryRepository from "../users/users.queryRepository";
import { UserTypeViewModel } from "../../app/db";
import usersRepository from "../users/users.repository";
import { ObjectId } from "mongodb";

class AuthService {
  async confirmEmail(code: string, email: string) {
    let user = await usersRepository.findUserBy({ "emailConfirmation.confirmationCode": code }) as UserTypeViewModel
    if (!user) return false
    if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
      const result = await usersRepository.updateConfirmation(new ObjectId(user._id))
      return result
    }
    return false
  }

}

export default new AuthService()