import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDb } from '../../src/app/db';
import jwtService from '../../src/authorization/services/jwt-service';
import { CustomError } from '../../src/helpers/CustomError';
import emailManager from '../../src/managers/email.manager';
import { AuthService } from '../../src/routers/auth/auth.service';
import { AuthController } from '../../src/routers/auth/controller/auth.controller';
import { SessionErrors } from '../../src/routers/session/session.service';
import { UsersErrors } from '../../src/routers/users/meta/Errors';
import usersRepository from '../../src/routers/users/users.repository';
import { UsersService } from '../../src/routers/users/users.service';

jest.mock('../../src/routers/users/users.service');
jest.mock('../../src/authorization/services/jwt-service');
jest.mock('../../src/routers/users/users.repository');
jest.mock('../../src/managers/email.manager', () => ({
  __esModule: true,
  default: {
    sendEmailConfirmationMessage: jest.fn(),
  },
}));

let server: MongoMemoryServer;
describe('AuthService', () => {
  const authController = new AuthController();
  const authService = new AuthService();
  const usersService = new UsersService();

  beforeAll(async () => {
    jest.clearAllMocks();
    server = await MongoMemoryServer.create();
    const url = server.getUri();
    await runDb(url);
    // await authCollection.drop()
  });
  afterAll(async () => {
    await server.stop();
  });

  describe('login', () => {
    it('should return access and refresh tokens for valid credentials', async () => {
      const fakeUser = { id: '123', email: 'test@example.com' };
      const fakeAccessToken = 'access.token';
      const fakeRefreshToken = 'refresh.token';

      (usersService.checkCredentials as jest.Mock).mockResolvedValue(fakeUser);
      (jwtService.createAccessToken as jest.Mock).mockResolvedValue(fakeAccessToken);
      (jwtService.createRefreshToken as jest.Mock).mockResolvedValue({ refreshToken: fakeRefreshToken });

      const result = await authService.login('test@example.com', 'password', '');

      expect(result).toEqual({
        accessToken: fakeAccessToken,
        refreshToken: fakeRefreshToken,
      });
    });

    it('should throw if user is not found', async () => {
      (usersService.checkCredentials as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('wrong@example.com', 'pass', '')).rejects.toThrow(
        new CustomError(UsersErrors.NO_USERS),
      );
    });
  });

  describe('AuthService - registration', () => {
    const dto = { email: 'test@example.com', login: 'testuser', password: 'password123' };

    const mockUser = {
      id: 'some-user-id',
      email: dto.email,
      login: dto.login,
      emailConfirmation: {
        confirmationCode: '123456',
        isConfirmed: false,
      },
    };

    it('should delete user and throw if email sending fails', async () => {
      // Mocks for user existence checks
      (usersService.getUserBy as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      (usersService.createUser as jest.Mock).mockResolvedValue('some-user-id');
      (usersService.findUserBy as jest.Mock).mockResolvedValue(mockUser);

      (emailManager.sendEmailConfirmationMessage as jest.Mock).mockRejectedValue(new Error('SMTP failed'));

      await expect(authService.registration(dto)).rejects.toThrow(CustomError);
      expect(usersRepository.deleteUser).toHaveBeenCalledWith('some-user-id');
    });
  });

  describe('updateTokens', () => {
    const oldRefreshToken = 'oldRefreshToken';
    const newAccessToken = 'newAccessToken';
    const newRefreshToken = 'newRefreshToken';

    it('should return new access and refresh tokens and invalidate the old refresh token', async () => {
      // Mock sessionService.updateTokens to simulate the token refresh process
      (authController.updateTokens as jest.Mock).mockResolvedValue({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      // Simulate a request with a valid old refresh token
      const req = {
        cookies: {
          refreshToken: oldRefreshToken,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController.updateTokens(req as any, res as any);

      // Assertions
      expect(authController.updateTokens).toHaveBeenCalledWith(oldRefreshToken);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        newRefreshToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'development', // Check secure flag based on environment
        }),
      );
      expect(res.json).toHaveBeenCalledWith({ accessToken: newAccessToken });
    });

    it('should throw error if the refresh token is invalid or expired', async () => {
      // Simulate invalid refresh token
      const invalidRefreshToken = 'invalidRefreshToken';

      (authController.updateTokens as jest.Mock).mockRejectedValue(
        new CustomError(SessionErrors.INVALID_REFRESH_TOKEN),
      );

      // Simulate a request with an invalid refresh token
      const req = {
        cookies: {
          refreshToken: invalidRefreshToken,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await authController.updateTokens(req as any, res as any);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid or expired refresh token', // Customize the error message as needed
      });
    });
  });
});
