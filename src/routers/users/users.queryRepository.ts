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
      items: this.mapUserOrUsersWithId(users) as UserTypeViewModel[]
    }
  }

// TODO: get rid if UserTypeViewModel[]

//   async getUserById(userId: ObjectId): Promise<UserTypeViewModel | UserTypeViewModel[]> {
//     const user = await usersRepository.findUserById(userId)
//
//     if (!user) {
//       throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)
//     }
//
//     return this.mapUserOrUsersWithId(user)
//   }

  async getUserBy({ email, login, id }: Partial<UserType>): Promise<UserTypeViewModel | UserTypeViewModel[] | null> {

    if (id) {
      const user = await usersRepository.findUserBy({ _id: new ObjectId(id) })
      if (!user) {
        throw new CustomError(UsersErrors.NO_USER_WITH_SUCH_ID)
      }
      return this.mapUserOrUsersWithId(user)
    }

    else if(email) {
      const existingUserByEmail = await usersRepository.findUserBy({ email: email });
      if (existingUserByEmail) {
        throw new CustomError(UsersErrors.USER_WITH_SUCH_EMAIL_ALREADY_EXIST);
      }
      return null
    }

    else if(login) {
      const existingUserByLogin = await usersRepository.findUserBy({ login: login });
      if (existingUserByLogin) {
        throw new CustomError(UsersErrors.USER_WITH_SUCH_LOGIN_ALREADY_EXIST);
      }
      return null
    }

    return null

  }

  mapUserOrUsersWithId(userOrUsers: UserType | UserType[]): UserTypeViewModel | UserTypeViewModel[] {
    debugger
    if (Array.isArray(userOrUsers)) {
      return userOrUsers.map(({ _id, ...restOfUser }) => ({ ...restOfUser, id: _id!.toString(), createdAt: new Date() }))
    }

    const { _id, ...rest } = userOrUsers
    return { ...rest, id: _id!.toString(), createdAt: new Date() } as UserTypeViewModel
  }
}

export default new UsersQueryRepository()