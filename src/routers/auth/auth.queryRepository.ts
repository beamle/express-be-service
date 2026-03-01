import { inject, injectable } from 'inversify';
import { MeViewModel, UserTypeViewModel } from '../../app/db';
import { UsersQueryRepository } from '../users/users.queryRepository';

@injectable()
export class AuthQueryRepository {
  constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository) {
    this.usersQueryRepository = usersQueryRepository;
  }
  async getMeBy(userId: string): Promise<MeViewModel> {
    const userInfo = (await this.usersQueryRepository.getUserBy({ id: userId })) as UserTypeViewModel; // will bubble up the same thrown error from getUSerBy
    return { email: userInfo.email, login: userInfo.login, userId: userInfo.id };
  }
}
