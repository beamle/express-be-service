type RefreshTokenPayloadType = {
  userId: string;
  deviceId: string;
  exp: number;
  iat: number;
};


type CreateRefreshTokenResponse = {
  refreshToken: string;
  deviceId: string;
  userId: string;
  exp: string;
  iat: string;
};