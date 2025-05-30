import { ObjectId } from "mongodb";
import usersRepository from "./users.repository";
import { CustomError } from "../../helpers/CustomError";
import { UsersErrors } from "./meta/Errors";
import { UserCreationType, UserType, UserTypeViewModel } from "../../app/db";
import bcrypt from "bcrypt";
import { add } from "date-fns";
import { uuid } from "uuidv4";
import usersQueryRepository from "./users.queryRepository";

const EXPIRATION_TIME_EXTRA = {
  ONE_MINUTE: { minutes: 1 },
  FIVE_MINUTES: { minutes: 5 }
}

class UsersService {
  // TODO: change method. Currently by id it reutnr user but email and login checks for eixstence
  async getUserBy({ email, login, id }: Partial<UserType>): Promise<UserTypeViewModel | null> {
    if (id) {
      const user = await usersRepository.findUserBy({ _id: new ObjectId(id) })
      if (!user) throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)

      return this.mapUserWithId(user)
    }

    else if(email) {
      const existingUserByEmail = await usersRepository.findUserBy({ email: email });
      if (existingUserByEmail) throw new CustomError(UsersErrors.USER_WITH_SUCH_EMAIL_ALREADY_EXIST);
      return null
    }

    else if(login) {
      const existingUserByLogin = await usersRepository.findUserBy({ login: login });
      if (existingUserByLogin) throw new CustomError(UsersErrors.USER_WITH_SUCH_LOGIN_ALREADY_EXIST);
      return null
    }

    return null

  }

  async findUserBy({ email, login, id }: Partial<UserType>): Promise<UserTypeViewModel> {
    let user;
    if (id) {
      user = await usersRepository.findUserBy({ _id: new ObjectId(id) })
      if (!user) throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)

      return this.mapUserWithId(user)
    }

    else if(email) {
      user = await usersRepository.findUserBy({ email: email });
      if (!user) throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL);
      return this.mapUserWithId(user)
    }

    else if(login) {
      user = await usersRepository.findUserBy({ login: login });
      if (!user) throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_LOGIN);
      return this.mapUserWithId(user)
    }

    throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN_OR_ID);

  }

  async createUser(userData: UserCreationType, isConfirmed = false, createByAdmin = false): Promise<ObjectId> {
    const passwordHash = await this.generateHash(userData.password, 10)

    const newUser = {
      login: userData.login,
      password: passwordHash,
      email: userData.email,
      createdAt: new Date().toISOString(),
      // registrationData: { ip: userData.ip}, // TODO: esli za poslednie 5 minut, s odnogo Ip adressa mngoo registracij, to block for 5 minutes
      emailConfirmation: {
        isConfirmed: createByAdmin,
        confirmationCode: uuid(),
        expirationDate: add(new Date(), EXPIRATION_TIME_EXTRA.FIVE_MINUTES)
      }
    }

    const newUserId = await usersRepository.createUser(newUser)

    if (!newUserId) {
      throw new CustomError(UsersErrors.USER_NOT_CREATED)
    }

    return newUserId
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await usersRepository.deleteUser(new ObjectId(id))

    return result
  }

  async checkCredentials(loginOrEmail: string, password: string): Promise<UserTypeViewModel> {
    // const user = await usersRepository.findUserBy({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
    const user = await usersQueryRepository.findUserBy({ login: loginOrEmail, email: loginOrEmail })

    if (!user) {
      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN)
    }

    if(!user.password) {
      throw new CustomError(UsersErrors.NO_PASSWORD)
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new CustomError(UsersErrors.INCORRECT_PASSWORD)
    }

    return usersQueryRepository.mapUserWithId(user)
  }

  async getMe(token: string) {

  }

  private async generateSalt(rounds: number) {
    return await bcrypt.genSalt(rounds);
  }

  private async generateHash(password: string, rounds: number) {
    const salt = await this.generateSalt(rounds)
    const hash = await bcrypt.hash(password, salt)

    return hash
  }

  private mapUserWithId(user: UserType): UserTypeViewModel {
    const { _id, password, ...rest } = user
    return { ...rest, id: _id!.toString() }
  }
}

export default new UsersService()