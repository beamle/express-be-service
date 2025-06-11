import usersRepository from "./users.repository";
import { usersCollection, UsersSortingData, UserType, UserTypeViewModel } from "../../app/db";
import { CustomError } from "../../helpers/CustomError";
import { UsersErrors } from "./meta/Errors";
import { createFilter } from "../../helpers/objectGenerators";
import { UsersViewModel } from "./meta/UsersTypes";
import { ObjectId } from "mongodb";

class UsersQueryRepository {
  async getUsers(sortingData: UsersSortingData): Promise<UsersViewModel> {
    const filter: any = createFilter(sortingData)
    const users = await usersRepository.getUsers(sortingData, filter)
    const usersLength = await usersCollection.countDocuments(filter)

    if (!users) {
      throw new CustomError(UsersErrors.NO_USERS)
    }

    return {
      pagesCount: Math.ceil(usersLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: usersLength,
      items: users.map(user => this.mapUserWithId(user))
    }
  }


  async getUserByEmail({ email }: Partial<UserType>): Promise<UserTypeViewModel | null> {
    if (email) {
      const existingUserByEmail = await usersRepository.findUserBy({ email: email });
      if (!existingUserByEmail) {
        throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL);
      }
      return this.mapUserWithId(existingUserByEmail)
    }

    return null

  }

  async findUserBy({ email, login, id }: Partial<UserType>): Promise<UserType | null> {
    if (id) {
      const user = await usersRepository.findUserBy({ _id: new ObjectId(id) })
      if (user) return user

      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)
    }

    if (email || login) {
      const userByEmail = email ? await usersRepository.findUserBy({ email }) : null;
      if (userByEmail) return userByEmail;

      const userByLogin = login ? await usersRepository.findUserBy({ login }) : null;
      if (userByLogin) return userByLogin;

      throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN);
    }

    return null;
  }

  async getUserBy({ email, login, id }: Partial<UserType>): Promise<Omit<UserTypeViewModel,"emailConfirmation"> | null> {
    if (id) {
      const user = await usersRepository.findUserBy({ _id: new ObjectId(id) })
      if (!user) throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)

      return this.mapUserWithoutEmailConfirmation(user)
    } else if (email) {
      const existingUserByEmail = await usersRepository.findUserBy({ email: email });
      if (existingUserByEmail) throw new CustomError(UsersErrors.USER_WITH_SUCH_EMAIL_ALREADY_EXIST);
      return null
    } else if (login) {
      const existingUserByLogin = await usersRepository.findUserBy({ login: login });
      if (existingUserByLogin) throw new CustomError(UsersErrors.USER_WITH_SUCH_LOGIN_ALREADY_EXIST);
      return null
    }

    return null

  }

  mapUserWithId(user: UserType): UserTypeViewModel {
    const { _id, password, ...rest } = user
    return { ...rest, id: _id!.toString() }
  }

  mapUserWithoutEmailConfirmation(user: UserType): Omit<UserTypeViewModel,"emailConfirmation"> {
    const { _id, password, emailConfirmation, ...rest } = user
    return { ...rest, id: _id!.toString() }
  }
}

export default new UsersQueryRepository()