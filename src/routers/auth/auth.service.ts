import usersRepository from "../users/users.repository";
import { ObjectId } from "mongodb";
import { CustomError } from "../../helpers/CustomError";
import { UsersErrors } from "../users/meta/Errors";
import { AuthErrors } from "./controller/auth.controller";
import usersService from "../users/users.service";
import { uuid } from "uuidv4";
import jwtService from "../../authorization/services/jwt-service";
import usersQueryRepository from "../users/users.queryRepository";
import { UserTypeViewModel } from "../../app/db";
import emailManager, { generateEmailConfirmationMessage } from "../../managers/email.manager";
import { handleErrorAsArrayOfErrors } from "../../helpers/validationHelpers";

class AuthService {
  async login(loginOrEmail: string, password: string) {
    const user = await usersService.checkCredentials(loginOrEmail, password)
    if (!user) return null;

    const deviceId = uuid();
    const accessToken = await jwtService.createAccessToken(user)
    const { refreshToken } = await jwtService.createRefreshToken(user, deviceId)
    return { accessToken, refreshToken }
  }

  // async registration(email: string, login:string, password: string) {
  //   await usersQueryRepository.getUserBy({ email })
  //   await usersQueryRepository.getUserBy({ login })
  //
  //   const createdUserId = await usersService.createUser({ email, password, login }, false)
  //   const user = await usersQueryRepository.getUserByEmail({ email }) as UserTypeViewModel
  //   // const user = await usersQueryRepository.getUserBy({ email: createdUserId.toString() }) as UserTypeViewModel
  //
  //   try {
  //     await emailManager.sendEmailConfirmationMessage(user, generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode), "Registration confirmation") // fIXME: ne dolzno bytj tut manager, a service nuzhno ispolzovatj
  //   } catch (e) {
  //     handleErrorAsArrayOfErrors(res, e)
  //     await usersRepository.deleteUser(createdUserId)
  //   }
  // }

  async registration(dto: { email: string; password: string; login: string }): Promise<UserTypeViewModel> {
    const { email, password, login } = dto;

    await usersService.getUserBy({ email }) // rename to checkIf exist
    await usersService.getUserBy({ login })

    const userId = await usersService.createUser({ email, password, login }, false);
    const user = await usersService.findUserBy({ email })

    try {
      await emailManager.sendEmailConfirmationMessage(
        user,
        generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode),
        "Registration confirmation"
      );
    } catch (e) {
      await usersRepository.deleteUser(userId);
      throw new CustomError(AuthErrors.ACCOUNT_WAS_NOT_CREATED)
    }

    return user;
  }


  async confirmEmail(code: string, email: string) {
    debugger
    // findUserBy returns Null!
    let user = await usersRepository.findUserBy({ "emailConfirmation.confirmationCode": code })
    if (!user) {
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