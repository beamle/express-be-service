import { InsertOneResult, OptionalId } from "mongodb";
import {
  refreshTokenBlacklistCollection,
  UserSession,
  UserSessionDBType,
  userSessionsCollection,
} from "../../app/db";
import { SessionMeta } from "./session.types";

export const sessionRepository = {
  async addRefreshTokenToBlackList(refreshToken: string) {
    return await refreshTokenBlacklistCollection.insertOne({ refreshToken });
  },

  async checkIfRefreshTokenInBlackList(refreshToken: string) {
    const found = await refreshTokenBlacklistCollection.findOne({
      refreshToken,
    });
    return !!found;
  },

  async create(
    sessionMeta: SessionMeta
  ): Promise<InsertOneResult<UserSessionDBType>> {
    return await userSessionsCollection.insertOne(sessionMeta);
  },

  async findByDeviceId(deviceId: string): Promise<any | null> {},
  async updateIat(deviceId: string, newIat: Date): Promise<void> {},
  async deleteByDeviceId(deviceId: string): Promise<void> {},
  // async findAllByUser(userId: string): Promise<any[]> {},
};
