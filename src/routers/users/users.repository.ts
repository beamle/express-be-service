import { usersCollection, UsersSortingData, UserType } from "../../app/db";
import { Filter, ObjectId } from "mongodb";

type UserFilter = Partial<{
  _id?: ObjectId
  email?: string
  login?: string
}>

type UserFilterType = Filter<UserFilter>;

class UsersRepository {
  async getUsers(sortingData: UsersSortingData, filter: UsersSortingData) {

    const users = await usersCollection
      // .find(filter ? filter : {})
      .find(filter)
      .skip((sortingData.pageNumber - 1) * sortingData.pageSize)
      .limit(sortingData.pageSize)
      .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 'asc' : 'desc' })
      .toArray()

    return users
  }

  async findUserBy(filter: UserFilterType) {
    const user = await usersCollection.findOne(filter as Filter<any>) // to allow passing mongodb Query strings

    return user
  }

  async createUser(userData: UserType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(userData)

    return result.insertedId
  }

  async deleteUser(id: ObjectId): Promise<boolean> {
    const result = await usersCollection.deleteOne({_id: id})

    return result.acknowledged
  }
}

export default new UsersRepository()