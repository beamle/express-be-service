import { runDb } from "../../src/app/db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AuthService } from "../../src/routers/auth/auth.service";
import usersService from "../../src/routers/users/users.service";
import jwtService from "../../src/authorization/services/jwt-service";
import { CustomError } from "../../src/helpers/CustomError";
import { UsersErrors } from "../../src/routers/users/meta/Errors";

jest.mock('../../src/routers/users/users.service');
jest.mock('../../src/authorization/services/jwt-service');
// jest.mock('../managers/emailManager');
// jest.mock('../repositories/usersRepository');

let server: MongoMemoryServer;
describe("AuthService", () => {
  const authService = new AuthService();

  beforeAll(async () => {
    jest.clearAllMocks();
    server = await MongoMemoryServer.create()
    const url = server.getUri()
    await runDb(url)
    // await authCollection.drop()
  })
  afterAll(async () => {
    await server.stop()
  })

  describe("login", () => {
    it("should return access and refresh tokens for valid credentials", async () => {
      const fakeUser = { id: "123", email: "test@example.com" };
      const fakeAccessToken = "access.token";
      const fakeRefreshToken = "refresh.token";

      (usersService.checkCredentials as jest.Mock).mockResolvedValue(fakeUser);
      (jwtService.createAccessToken as jest.Mock).mockResolvedValue(fakeAccessToken);
      (jwtService.createRefreshToken as jest.Mock).mockResolvedValue({ refreshToken: fakeRefreshToken });

      const result = await authService.login("test@example.com", "password");

      expect(result).toEqual({
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
      });
    });

    it("should throw if user is not found", async () => {
      (usersService.checkCredentials as jest.Mock).mockResolvedValue(null);

      await expect(authService.login("wrong@example.com", "pass"))
        .rejects
        .toThrow(new CustomError(UsersErrors.NO_USERS));
    });
  });
  describe("registration", () => {
    it("should return created user information", async () => {
      const fakeUser = { id: "123", email: "test@example.com", password: "password", login: "login" };
    }
  })
});