import { ObjectId } from "mongodb";
import { uuid } from "uuidv4";
import { UserTypeViewModel } from "../../app/db";
import jwtService from "../../authorization/services/jwt-service";
import { CustomError } from "../../helpers/CustomError";
import emailManager, {
  generateEmailConfirmationMessage,
  generateEmailConfirmationResendMessage,
} from "../../managers/email.manager";
import { UsersErrors } from "../users/meta/Errors";
import usersRepository from "../users/users.repository";
import usersService from "../users/users.service";
import { AuthErrors } from "./controller/auth.controller";

type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
  refreshPayload: {
    deviceId: string;
    iat: number;
    exp: number;
  };
  user: UserTypeViewModel;
};

export class AuthService {
  async login(
    loginOrEmail: string,
    password: string
  ): Promise<LoginResponseType> {
    const user = await usersService.checkCredentials(loginOrEmail, password);
    if (!user) throw new CustomError(UsersErrors.NO_USERS);

    const deviceId = uuid();
    const accessToken = await jwtService.createAccessToken(user);
    const { refreshToken, iat, exp } = await jwtService.createRefreshToken(
      user,
      deviceId
    );

    return {
      accessToken,
      refreshToken,
      refreshPayload: { deviceId, iat, exp },
      user,
    };
  }

  async registration(dto: {
    email: string;
    password: string;
    login: string;
  }): Promise<UserTypeViewModel> {
    const { email, password, login } = dto;

    await usersService.getUserBy({ email }); // rename to checkIf exist
    await usersService.getUserBy({ login });

    const userId = await usersService.createUser(
      { email, password, login },
      false
    );
    const user = await usersService.findUserBy({ email });

    try {
      await emailManager.sendEmailConfirmationMessage(
        user,
        generateEmailConfirmationMessage(
          user.emailConfirmation.confirmationCode
        ),
        "Registration confirmation"
      );
    } catch (e) {
      await usersRepository.deleteUser(userId);
      throw new CustomError(AuthErrors.ACCOUNT_WAS_NOT_CREATED);
    }

    return user;
  }

  async confirmEmail(code: string, email: string) {
    let user = await usersRepository.findUserBy({
      "emailConfirmation.confirmationCode": code,
    });
    if (!user) throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_CODE_EXIST);

    if (user.emailConfirmation.isConfirmed) {
      throw new CustomError(UsersErrors.EMAIL_ALREADY_CONFIRMED);
    }

    if (user.emailConfirmation.confirmationCode === code) {
      return await usersRepository.updateConfirmation(new ObjectId(user._id!));
    } else {
      throw new CustomError(AuthErrors.ACCOUNT_ALREADY_CONFIRMED);
    }
  }

  async resendEmail(email: string) {
    const user = await usersService.findUserBy({ email });
    if (user.emailConfirmation.isConfirmed)
      throw new CustomError(AuthErrors.EMAIL_ALREADY_CONFIRMED);

    const newConfirmationCode = uuid();

    await usersRepository.updateUserConfirmationCode(
      new ObjectId(user.id),
      newConfirmationCode
    );
    const updatedUser = await usersService.findUserBy({ email });
    await emailManager.sendEmailConfirmationMessage(
      updatedUser,
      generateEmailConfirmationResendMessage(
        updatedUser.emailConfirmation.confirmationCode
      ),
      "Registration confirmation"
    );
  }

  // async confirmEmail(code: string, email: string) {
  //   const result = await this.confirmEmail(code, email)
  //   if (result) {
  //     return
  //   } else {
  //     throw new CustomError(AuthErrors.ACCOUNT_ALREADY_CONFIRMED)
  //   }
  // }
}

export default new AuthService();
