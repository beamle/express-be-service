import { runDb } from "../../src/app/db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AuthService } from "../../src/routers/auth/auth.service";
import usersService from "../../src/routers/users/users.service";
import jwtService from "../../src/authorization/services/jwt-service";
import { CustomError } from "../../src/helpers/CustomError";
import { UsersErrors } from "../../src/routers/users/meta/Errors";
import emailManager from "../../src/managers/email.manager";
import usersRepository from "../../src/routers/users/users.repository";

jest.mock('../../src/routers/users/users.service');
jest.mock('../../src/authorization/services/jwt-service');
jest.mock("../../src/routers/users/users.repository");
jest.mock("../../src/managers/email.manager", () => ({
  __esModule: true,
  default: {
    sendEmailConfirmationMessage: jest.fn()
  }
}));

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

  describe("AuthService - registration", () => {
    const dto = { email: "test@example.com", login: "testuser", password: "password123" };

    const mockUser = {
      id: "some-user-id",
      email: dto.email,
      login: dto.login,
      emailConfirmation: {
        confirmationCode: "123456",
        isConfirmed: false,
      }
    };

    it("should register a new user and send confirmation email", async () => {
      // Mocks for user existence checks
      (usersService.getUserBy as jest.Mock).mockResolvedValue(null);

      // Mocks for user creation and retrieval
      (usersService.createUser as jest.Mock).mockResolvedValue("some-user-id");
      (usersService.findUserBy as jest.Mock).mockResolvedValue(mockUser);

      // Mock email sending
      (emailManager.sendEmailConfirmationMessage as jest.Mock).mockResolvedValue(true);

      const result = await authService.registration(dto);

      expect(usersService.getUserBy).toHaveBeenCalledTimes(2);
      expect(usersService.createUser).toHaveBeenCalledWith(expect.objectContaining(dto), false);
      expect(emailManager.sendEmailConfirmationMessage).toHaveBeenCalledWith(
        mockUser,
        expect.stringContaining("confirm-registration?code="),
        "Registration confirmation"
      );
      expect(result).toEqual(mockUser);
    });

    it("should delete user and throw if email sending fails", async () => {
      // Mocks for user existence checks
      (usersService.getUserBy as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      (usersService.createUser as jest.Mock).mockResolvedValue("some-user-id");
      (usersService.findUserBy as jest.Mock).mockResolvedValue(mockUser);

      (emailManager.sendEmailConfirmationMessage as jest.Mock).mockRejectedValue(new Error("SMTP failed"));

      await expect(authService.registration(dto)).rejects.toThrow(CustomError);
      expect(usersRepository.deleteUser).toHaveBeenCalledWith("some-user-id");
    });
  });

})