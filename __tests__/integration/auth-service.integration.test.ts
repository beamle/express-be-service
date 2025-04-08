import AuthService from "../../src/routers/auth/auth.service";
import UsersService from "../../src/routers/users/users.service";
import { MongoMemoryServer } from "mongodb-memory-server";
import { runDb } from "../../src/app/db";
import { ADMIN_AUTH } from "../../src/authorization/middlewares/authorization.middleware";
import { ObjectId } from "mongodb";

// Set global timeout for the entire test suite
jest.setTimeout(10000);

let server: MongoMemoryServer;
describe('Integration tests for AuthService', () => {
  beforeAll(async () => {
    server = await MongoMemoryServer.create()
    const url = server.getUri()
    await runDb(url)
  })
  afterAll(async () => await server.stop())

  const codedAdminCredentials = Buffer.from(ADMIN_AUTH, 'utf8').toString("base64")
  const authService = AuthService
  const usersService = UsersService

    describe('createUser', () => {

    test("should return", async () => {
      const result = await usersService.createUser({ email: "bob@gmail.com", login: "Bob", password: "123"}, false, false )
      expect(result).toBeInstanceOf(ObjectId)
    })
  });
});