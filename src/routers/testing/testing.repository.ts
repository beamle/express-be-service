import { blogsCollection, postsCollection, usersCollection } from "../../app/db";

class TestingRepository {
  async clearAllData() {
    await postsCollection.deleteMany({})
    await blogsCollection.deleteMany({})
    await usersCollection.deleteMany({})
  }
}

export default new TestingRepository()