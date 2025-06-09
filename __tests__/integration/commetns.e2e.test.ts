import { dummyBlogs, dummyPostInput1, req } from "../test-helpers";
import { SETTINGS } from "../../src/app/settings";
import { blogsCollection, commentsCollection, postsCollection, runDb } from "../../src/app/db";
import { ADMIN_AUTH } from "../../src/authorization/middlewares/authorization.middleware";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwtService from "../../src/authorization/services/jwt-service";
import { registerAndLoginUser } from "../e2e/utils/testAuthHelpers";
import { ObjectId } from "mongodb";

const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")

async function createDummyPost(): Promise<{ postId: string }> {
  await blogsCollection.insertMany(dummyBlogs);
  const createdPost = await req
    .post(SETTINGS.PATH.POSTS)
    .set({ Authorization: "Basic " + codedAdminCredentials })
    .send(dummyPostInput1)
    .expect(201);
  return { postId: createdPost.body.id };
}

let server: MongoMemoryServer;
describe("test /blogs path", () => {
  beforeAll(async () => {
    server = await MongoMemoryServer.create()
    const url = server.getUri()
    await runDb(url)
    await blogsCollection.drop()
  })
  afterAll(async () => {
    await server.stop()
  })

  afterEach(async () => {
    await blogsCollection.drop()
  })

  test("POST /posts/:postId/comments creates comment for authenticated user", async () => {
    // 1.
    const { postId } = await createDummyPost()

    // 2. Register and login dumb user
    const { accessToken, login } = await registerAndLoginUser({
      email: "test@example.com",
      login: "testuser",
      password: "pass123"
    });

    // 3. Send comment
    const commentInput = { content: "Comment should be minimum 20 characters long" };
    const commentRes = await req
      .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
      .set({ Authorization: "Bearer " + accessToken })
      .send(commentInput)
      .expect(201);

    // 4. Assert response
    expect(commentRes.body).toMatchObject({
      content: commentInput.content,
      commentatorInfo: {
        userLogin: login,
        userId: expect.any(String)
      },
    });
  });
})