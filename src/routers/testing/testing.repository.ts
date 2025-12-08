import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  refreshTokenBlacklistCollection,
  sessionsCollection,
  usersCollection
} from "../../app/db";

class TestingRepository {
  async clearAllData() {
    await postsCollection.deleteMany({})
    await blogsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await sessionsCollection.deleteMany({})
    await refreshTokenBlacklistCollection.deleteMany({})
  }

  async getAllBlackListedRefreshTokens() {
    return await refreshTokenBlacklistCollection.find().toArray()
  }
}

export default new TestingRepository()