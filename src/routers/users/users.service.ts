import { ObjectId } from "mongodb";
import usersRepository from "./users.repository";
import { CustomError } from "../../helpers/CustomError";
import { UsersErrors } from "./meta/Errors";
import { UserType } from "../../app/db";
import bcrypt from "bcrypt";
import { add } from "date-fns";
import { uuid } from "uuidv4";

const EXPIRATION_TIME_EXTRA = { ONE_MINUTE: { minutes: 1 } }

class UsersService {
  async createUser(userData: Omit<UserType, "createdAt">, isConfirmed = true): Promise<ObjectId> {
    const passwordHash = await this.generateHash(userData.password, 10)

    const newUser = {
      login: userData.login,
      password: passwordHash,
      email: userData.email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        isConfirmed,
        confirmationCode: uuid(),
        expirationDate: add(new Date(), EXPIRATION_TIME_EXTRA.ONE_MINUTE)
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

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findUserBy({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })

    if (!user) {
      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN)
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new CustomError(UsersErrors.INCORRECT_PASSWORD)
    }

    return user
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
}

export default new UsersService()