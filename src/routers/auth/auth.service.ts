import { ObjectId } from 'mongodb';
import { uuid } from 'uuidv4';
import { UserTypeViewModel } from '../../app/db';
import { JwtService } from '../../authorization/services/jwt-service';
import { CustomError } from '../../helpers/CustomError';
import emailManager, {
  generateEmailConfirmationMessage,
  generateEmailConfirmationResendMessage,
} from '../../managers/email.manager';
import { SessionErrors } from '../session/session.service';
import { UsersErrors } from '../users/meta/Errors';
import usersRepository from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { AuthErrors } from './controller/auth.controller';

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
  private jwtService: JwtService;
  private usersService: UsersService;

  constructor() {
    this.jwtService = new JwtService();
    this.usersService = new UsersService();
  }
  async login(
    loginOrEmail: string,
    password: string,
    normalizedDeviceName: string,
    userAgent?: string,
    ip?: string,
  ): Promise<LoginResponseType> {
    const user = await this.usersService.checkCredentials(loginOrEmail, password);

    if (!user) throw new CustomError(UsersErrors.NO_USERS);
    if (!userAgent || !ip) throw new CustomError(SessionErrors.NO_USERAGENT_OR_IP_PROVIDED);

    let deviceId = uuid();
    // TODO: Currently i dont create new deviceId if user and devince name already exist. But ishould ?
    // I should somehow check is used deviceName is the same ? And if it is then keep old deviceId. But currently it return "other" always.
    // const existingSession = await sessionRepository.findByUserAndDeviceMeta(
    //   user.id,
    //   normalizedDeviceName,
    // );
    //
    // if (existingSession) {
    //   deviceId = existingSession.deviceId;
    // } else {
    //   deviceId = uuid();
    // }

    const accessToken = await this.jwtService.createAccessToken(user);
    const { refreshToken, iat, exp } = await this.jwtService.createRefreshToken(user, deviceId);

    return {
      accessToken,
      refreshToken,
      refreshPayload: { deviceId, iat, exp },
      user,
    };
  }

  async registration(dto: { email: string; password: string; login: string }): Promise<UserTypeViewModel> {
    const { email, password, login } = dto;

    await this.usersService.getUserBy({ email }); // rename to checkIf exist
    await this.usersService.getUserBy({ login });

    const userId = await this.usersService.createUser({ email, password, login }, false);
    const user = await this.usersService.findUserBy({ email });

    try {
      await emailManager.sendEmailConfirmationMessage(
        user,
        generateEmailConfirmationMessage(user.emailConfirmation.confirmationCode),
        'Registration confirmation',
      );
    } catch (e) {
      await usersRepository.deleteUser(userId);
      throw new CustomError(AuthErrors.ACCOUNT_WAS_NOT_CREATED);
    }

    return user;
  }

  async confirmEmail(code: string, email: string) {
    let user = await usersRepository.findUserBy({
      'emailConfirmation.confirmationCode': code,
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
    const user = await this.usersService.findUserBy({ email });
    if (user.emailConfirmation.isConfirmed) throw new CustomError(AuthErrors.EMAIL_ALREADY_CONFIRMED);

    const newConfirmationCode = uuid();

    await usersRepository.updateUserConfirmationCode(new ObjectId(user.id), newConfirmationCode);
    const updatedUser = await this.usersService.findUserBy({ email });
    await emailManager.sendEmailConfirmationMessage(
      updatedUser,
      generateEmailConfirmationResendMessage(updatedUser.emailConfirmation.confirmationCode),
      'Registration confirmation',
    );
  }
}
