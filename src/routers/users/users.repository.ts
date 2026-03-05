import { Filter, ObjectId } from 'mongodb'; import 'reflect-metadata';
import { UsersSortingData, UserType } from '../../app/db';
import { UserModel } from './users.schema';

type UserFilter = Partial<{
  _id?: ObjectId;
  email?: string;
  login?: string;
}>;

type UserFilterType = Filter<UserFilter>;

export class UsersRepository {
  async getUsers(sortingData: UsersSortingData, filter: UsersSortingData) {
    const users = await UserModel
      .find(filter)
      .skip((sortingData.pageNumber - 1) * sortingData.pageSize)
      .limit(sortingData.pageSize)
      .sort({ [sortingData.sortBy]: sortingData.sortDirection === 'asc' ? 1 : -1 })
      .lean();

    return users as unknown as UserType[];
  }

  async findUserBy(filter: UserFilterType): Promise<UserType | null> {
    const user = await UserModel.findOne(filter as any).lean();

    return user as unknown as UserType | null;
  }

  async createUser(userData: UserType): Promise<ObjectId> {
    const newUser = new UserModel(userData);
    const result = await newUser.save();

    return new ObjectId(result._id.toString());
  }

  async deleteUser(id: ObjectId): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });

    return result.deletedCount > 0;
  }

  async updateUserConfirmationCode(id: ObjectId, code: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': code } },
    );

    return result.modifiedCount === 1;
  }

  async updateConfirmation(id: ObjectId): Promise<boolean> {
    let result = await UserModel.updateOne({ _id: id }, { $set: { 'emailConfirmation.isConfirmed': true } });
    return result.modifiedCount === 1;
  }

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newPasswordHash } },
    );
    return result.modifiedCount === 1;
  }
}
