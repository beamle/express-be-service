import usersQueryRepository from "../users/users.queryRepository";
import { MeViewModel, UserTypeViewModel } from "../../app/db";

class AuthQueryRepository {
  async getMeBy(userId: string): Promise<MeViewModel> {
    const userInfo = await usersQueryRepository.getUserBy({ id: userId }) as UserTypeViewModel // will bubble up the same thrown error from getUSerBy
    return { email: userInfo.email, login: userInfo.login, userId: userInfo.id }
  }
}

export default new AuthQueryRepository()