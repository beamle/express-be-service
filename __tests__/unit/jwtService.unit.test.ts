import jwt from 'jsonwebtoken';
import jwtService, { JwtServiceErrors } from "../../src/authorization/services/jwt-service";
import { CustomError } from "../../src/helpers/CustomError";
import { SessionErrors } from "../../src/routers/session/session.service";

jest.mock('jsonwebtoken');  // Mock the jwt library

describe('jwtService', () => {
  const fakeUser = {
    id: 'user123',
    login: 'testUser',
    email: 'testuser@example.com',
    createdAt: '2022-01-01T00:00:00.000Z',
    emailConfirmation: {
      isConfirmed: true,
      confirmationCode: '123456',
      expirationDate: new Date('2022-01-01T01:00:00.000Z'),
    },
  };

  const deviceId = 'device123';
  const secret = "!23";  // The secret as defined in SETTINGS

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccessToken', () => {
    it('should create a valid access token for a user', async () => {
      // Mock jwt.sign to return a token
      (jwt.sign as jest.Mock).mockReturnValue('fakeAccessToken');

      const token = await jwtService.createAccessToken(fakeUser);

      expect(token).toBe('fakeAccessToken');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: fakeUser.id },
        secret,
        { expiresIn: '10s' }
      );
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token for a user with deviceId', async () => {
      const mockDecoded = { userId: fakeUser.id, deviceId, iat: 1234567890 };

      // Mock jwt.sign to return a refresh token and decode the token
      (jwt.sign as jest.Mock).mockReturnValue('fakeRefreshToken');
      (jwt.decode as jest.Mock).mockReturnValue(mockDecoded);

      const { refreshToken, userId, deviceId: tokenDeviceId } = await jwtService.createRefreshToken(fakeUser, deviceId);

      expect(refreshToken).toBe('fakeRefreshToken');
      expect(userId).toBe(fakeUser.id);
      expect(tokenDeviceId).toBe(deviceId);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: fakeUser.id, deviceId },
        secret,
        { expiresIn: '15s' }
      );
    });
  });

  describe('isTokenValid', () => {
    it('should return true if the token is valid', async () => {
      (jwt.verify as jest.Mock).mockReturnValue(true);

      const isValid = await jwtService.isTokenValid('validToken', secret);

      expect(isValid).toBe(true);
      expect(jwt.verify).toHaveBeenCalledWith('validToken', secret);
    });

    it('should return false if the token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token') });

      const isValid = await jwtService.isTokenValid('invalidToken', secret);

      expect(isValid).toBe(false);
      expect(jwt.verify).toHaveBeenCalledWith('invalidToken', secret);
    });
  });

  describe('jwtService', () => {
    it('should spy on isTokenValid', async () => {
      // Spying on the method and mocking the return value
      // @ts-ignore
      jest.spyOn(jwtService, 'isTokenValid').mockResolvedValue(true);

      const result = await jwtService.isTokenValid('validToken', 'secret');
      expect(result).toBe(true);
      expect(jwtService.isTokenValid).toHaveBeenCalledWith('validToken', 'secret');
    });

    it('should spy on decodeToken', async () => {
      const mockDecoded = { userId: 'fakeUserId', deviceId: 'fakeDeviceId', iat: 1234567890, exp: 12234848 };

      // Spying on the decodeToken method and mocking the return value
      // @ts-ignore
      jest.spyOn(jwtService, 'decodeToken').mockResolvedValue(mockDecoded);

      const decoded = await jwtService.decodeToken('validToken');
      expect(decoded).toEqual(mockDecoded);
      expect(jwtService.decodeToken).toHaveBeenCalledWith('validToken');
    });
  });

  describe('parseAndValidateRefreshToken', () => {
    it('should return decoded token if valid', async () => {
      const mockDecoded = { userId: fakeUser.id, deviceId, iat: 1234567890 };

      // Spying and mocking methods without the 3rd argument (access type)
      // @ts-ignore
      jest.spyOn(jwtService, 'isTokenValid').mockResolvedValue(true);  // Mocking the isTokenValid method
      // @ts-ignore
      jest.spyOn(jwtService, 'decodeToken').mockResolvedValue(mockDecoded);  // Mocking the decodeToken method

      // Call the method
      const result = await jwtService.parseAndValidateRefreshToken('validRefreshToken', secret);

      // Assert the result
      expect(result).toEqual(mockDecoded);
      expect(jwtService.isTokenValid).toHaveBeenCalledWith('validRefreshToken', secret);
      expect(jwtService.decodeToken).toHaveBeenCalledWith('validRefreshToken');
    });

    it('should throw an error if token is invalid', async () => {
      // Mocking isTokenValid to return false
      // @ts-ignore
      jest.spyOn(jwtService, 'isTokenValid').mockResolvedValue(false);

      // Call the method and check for error
      await expect(jwtService.parseAndValidateRefreshToken('invalidRefreshToken', secret))
        .rejects
        .toThrow(new CustomError(SessionErrors.INVALID_REFRESH_TOKEN));

      expect(jwtService.isTokenValid).toHaveBeenCalledWith('invalidRefreshToken', secret);
    });

    it('should throw an error if decoded token is missing required fields', async () => {
      // Mock decoded token missing 'deviceId'
      const mockDecoded = { userId: fakeUser.id, deviceId: null, iat: 1234567890 };

      // Mocking isTokenValid and decodeToken methods
      // @ts-ignore
      jest.spyOn(jwtService, 'isTokenValid').mockResolvedValue(true);
      // @ts-ignore
      jest.spyOn(jwtService, 'decodeToken').mockResolvedValue(mockDecoded);

      // Call the method and check for error
      await expect(jwtService.parseAndValidateRefreshToken('invalidRefreshToken', secret))
        .rejects
        .toThrow(new CustomError(SessionErrors.INVALID_REFRESH_TOKEN));

      expect(jwtService.decodeToken).toHaveBeenCalledWith('invalidRefreshToken');
    });
  });


  describe('decodeToken', () => {
    it('should decode the token correctly', async () => {
      const mockDecoded = { userId: fakeUser.id, deviceId, iat: 1234567890 };
      (jwt.decode as jest.Mock).mockReturnValue(mockDecoded);

      const decoded = await jwtService.decodeToken('validToken');

      expect(decoded).toEqual(mockDecoded);
      expect(jwt.decode).toHaveBeenCalledWith('validToken');
    });
  });

  describe('getUserIdByToken', () => {
    it('should return the userId from a valid token', async () => {
      const mockDecoded = { userId: fakeUser.id };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const userId = await jwtService.getUserIdByToken('validToken');

      expect(userId).toBe(fakeUser.id);
      expect(jwt.verify).toHaveBeenCalledWith('validToken', secret);
    });

    it('should throw an error if the token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token') });

      await expect(jwtService.getUserIdByToken('invalidToken'))
        .rejects
        .toThrow(new CustomError(JwtServiceErrors.NO_CORRECT_TOKEN_PROVIDED));

      expect(jwt.verify).toHaveBeenCalledWith('invalidToken', secret);
    });

    it('should throw an error if no token is provided', async () => {
      await expect(jwtService.getUserIdByToken(''))
        .rejects
        .toThrow(new CustomError(JwtServiceErrors.NO_TOKEN_PROVIDED));
    });
  });
});
