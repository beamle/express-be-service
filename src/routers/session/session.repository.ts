import { InsertOneResult } from 'mongodb';
import { refreshTokenBlacklistCollection, UserSessionDBType, userSessionsCollection } from '../../app/db';
import { SessionMeta } from './session.types';

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

  async create(sessionMeta: SessionMeta): Promise<InsertOneResult<UserSessionDBType>> {
    return await userSessionsCollection.insertOne(sessionMeta);
  },

  async findByDeviceId(deviceId: string): Promise<any | null> {},
  async updateIat(deviceId: string, newIat: Date): Promise<void> {},
  async deleteByDeviceId(deviceId: string): Promise<void> {},
  async findAllSessionsByUser(userId: string): Promise<any> {
    return await userSessionsCollection.find({}, { projection: { _id: 0 } });
  },
};
