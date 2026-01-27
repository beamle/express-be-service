import { MeViewModel, UserTypeViewModel } from '../../app/db';
import { UsersQueryRepository } from '../users/users.queryRepository';

class AuthQueryRepository {
  private usersQueryRepository: UsersQueryRepository;
  constructor() {
    this.usersQueryRepository = new UsersQueryRepository();
  }
  async getMeBy(userId: string): Promise<MeViewModel> {
    const userInfo = (await this.usersQueryRepository.getUserBy({ id: userId })) as UserTypeViewModel; // will bubble up the same thrown error from getUSerBy
    return { email: userInfo.email, login: userInfo.login, userId: userInfo.id };
  }
}

export default new AuthQueryRepository();
