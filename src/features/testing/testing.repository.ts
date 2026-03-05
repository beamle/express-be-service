import { BlogModel } from '../blogs/blogs.schema';
import { CommentModel } from '../comments/comments.schema';
import { PostModel } from '../posts/posts.schema';
import { RefreshTokenBlacklistModel, SessionModel } from '../session/session.schema';
import { UserModel } from '../users/users.schema';
import { RequestCasesModel } from '../request-cases/request-cases.schema';
import { PasswordRecoveryModel } from '../auth/password-recovery.schema';

class TestingRepository {
  async clearAllData() {
    await PostModel.deleteMany({});
    await BlogModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await SessionModel.deleteMany({});
    await RefreshTokenBlacklistModel.deleteMany({});
    await RequestCasesModel.deleteMany({});
    await PasswordRecoveryModel.deleteMany({});
  }

  async getAllBlackListedRefreshTokens() {
    return await RefreshTokenBlacklistModel.find().lean();
  }
}

export default new TestingRepository()