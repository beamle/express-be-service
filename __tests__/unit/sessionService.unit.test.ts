import jwtService from "../../src/authorization/services/jwt-service";
import { sessionRepository } from "../../src/routers/session/session.repository";
import usersService from "../../src/routers/users/users.service";
import SessionService, { SessionErrors } from "../../src/routers/session/session.service";
import { CustomError } from "../../src/helpers/CustomError";
import { UsersErrors } from "../../src/routers/users/meta/Errors";

jest.mock('../services/jwtService')
jest.mock('../repositories/sessionRepository')
jest.mock('../services/usersService')

const mockedJwtService = jest.mocked(jwtService, true)
const mockedSessionRepo = jest.mocked(sessionRepository, true)
const mockedUsersService = jest.mocked(usersService, true)

// Mocking dependencies
jest.mock('../../authorization/services/jwt-service');
jest.mock('./session.repository');
jest.mock('../users/users.service');

describe('SessionService', () => {
  const refreshToken = 'valid.refresh.token';
  const fakeUser = { id: 'user123', login: 'testUser' };
  const deviceId = 'device456';

  beforeEach(() => {
    jest.clearAllMocks();  // Reset mocks to avoid state leaks
  });

  it('should return new tokens on success', async () => {
    // Arrange: Mock jwtService methods
    mockedJwtService.parseAndValidateRefreshToken.mockResolvedValue({
      userId: fakeUser.id,
      deviceId,
      iat: 1234567890,
    });

    mockedSessionRepo.addRefreshTokenToBlackList.mockResolvedValue({
      acknowledged: true,
    });

    mockedUsersService.getUserBy.mockResolvedValue(fakeUser);

    mockedJwtService.createAccessToken.mockResolvedValue('newAccessToken');
    mockedJwtService.createRefreshToken.mockResolvedValue({
      refreshToken: 'newRefreshToken',
    });

    // Act
    const result = await SessionService.updateTokens(refreshToken);

    // Assert
    expect(result).toEqual({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });

    expect(mockedJwtService.parseAndValidateRefreshToken).toHaveBeenCalledWith(
      refreshToken,
      expect.any(String) // your JWT_SECRET
    );
  });

  it('should throw error if refresh token is invalid', async () => {
    // Mock an invalid token scenario
    mockedJwtService.parseAndValidateRefreshToken.mockRejectedValue(
      new CustomError(SessionErrors.INVALID_REFRESH_TOKEN)
    );

    await expect(SessionService.updateTokens(refreshToken)).rejects.toThrow(
      new CustomError(SessionErrors.INVALID_REFRESH_TOKEN)
    );
  });

  it('should throw error if refresh token is not blacklisted', async () => {
    // Mock the valid token and blacklisting failure
    mockedJwtService.parseAndValidateRefreshToken.mockResolvedValue({
      userId: fakeUser.id,
      deviceId,
      iat: 1234567890,
    });

    mockedSessionRepo.addRefreshTokenToBlackList.mockResolvedValue({
      acknowledged: false,
    });

    await expect(SessionService.updateTokens(refreshToken)).rejects.toThrow(
      new CustomError(SessionErrors.REFRESH_TOKEN_WAS_NOT_ADDED_TO_BLACKLIST)
    );
  });

  it('should throw error if user is not found', async () => {
    // Mock the valid token, blacklisting success, but user not found
    mockedJwtService.parseAndValidateRefreshToken.mockResolvedValue({
      userId: fakeUser.id,
      deviceId,
      iat: 1234567890,
    });

    mockedSessionRepo.addRefreshTokenToBlackList.mockResolvedValue({
      acknowledged: true,
    });

    mockedUsersService.getUserBy.mockResolvedValue(null);

    await expect(SessionService.updateTokens(refreshToken)).rejects.toThrow(
      new CustomError(UsersErrors.NO_USER_WITH_SUCH_EMAIL_OR_LOGIN)
    );
  });

  it('should throw error if JWT is invalid', async () => {
    mockedJwtService.parseAndValidateRefreshToken.mockRejectedValue(
      new CustomError(SessionErrors.INVALID_REFRESH_TOKEN)
    );

    await expect(SessionService.updateTokens('invalid.token')).rejects.toThrow(
      SessionErrors.INVALID_REFRESH_TOKEN
    );
  });
});
