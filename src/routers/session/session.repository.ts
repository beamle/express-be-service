import { refreshTokenBlacklistCollection } from "../../app/db";

export const sessionRepository = {
  async addRefreshTokenToBlackList(refreshToken: string) {
    const refreshTokenObj = { refreshToken };
    return await refreshTokenBlacklistCollection.insertOne({ refreshToken });
  },

  async checkIfRefreshTokenInBlackList(refreshToken: string) {
    const found = await refreshTokenBlacklistCollection.findOne({
      refreshToken,
    });
    return !!found;
  },

  async createUserSession() {},

  async create(session: any): Promise<void> {},
  async findByDeviceId(deviceId: string): Promise<any | null> {},
  async updateIat(deviceId: string, newIat: Date): Promise<void> {},
  async deleteByDeviceId(deviceId: string): Promise<void> {},
  // async findAllByUser(userId: string): Promise<any[]> {},
};
