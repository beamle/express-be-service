import usersRepository from "./users.repository";
import { blogsCollection, usersCollection, UsersSortingData, UserType } from "../../app/db";
import { CustomError } from "../../helpers/CustomError";
import { UsersErrors } from "./meta/Errors";
import { createFilter } from "../../helpers/objectGenerators";
import { UsersViewModel } from "./meta/UsersTypes";

class UsersQueryRepository {
  async getUsers(sortingData: UsersSortingData): Promise<UsersViewModel> {

    const filter: any = createFilter(sortingData)
    const users = await usersRepository.getUsers(sortingData, filter)
    const usersLength = await usersCollection.countDocuments(filter)

    if(!users) {
      throw new CustomError(UsersErrors.NO_USERS)
    }

    return {
      pagesCount: Math.ceil(usersLength / sortingData.pageSize),
      page: sortingData.pageNumber,
      pageSize: sortingData.pageSize,
      totalCount: usersLength,
      items: users
    }
  }
}

export default new UsersQueryRepository()