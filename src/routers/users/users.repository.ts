import { postsCollection, usersCollection, UsersSortingData } from "../../app/db";

class UsersRepository {
  async getUsers(sortingData: UsersSortingData, filter: UsersSortingData) {

    const users = await usersCollection
      // .find(blogId ? { blogId: blogId.toString() } : {}, { projection: { _id: 0 } })
      .find(filter ? filter: {}, { projection: { _id: 0 } })
      .skip((sortingData.pageNumber - 1) * sortingData.pageSize)
      .limit(sortingData.pageSize)
      .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()

    return users
  }
}

export default new UsersRepository()