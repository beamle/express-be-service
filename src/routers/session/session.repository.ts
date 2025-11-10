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

  // async findByDeviceId(deviceId: string): Promise<any | null> {},
  // async updateIat(deviceId: string, newIat: Date): Promise<void> {},
  // async deleteByDeviceId(deviceId: string): Promise<void> {},
  async findAllSessionsByUser(userId: string): Promise<SessionMeta[]> {
    return await userSessionsCollection
      .find({ user_id: userId }, { projection: { _id: 0 } })
      .toArray();
  },
  async deleteAllSessionsExceptDevice(userId: string, deviceId: string) {
    return await userSessionsCollection.deleteMany({
      user_id: userId,
      device_id: { $ne: deviceId },
    });
  },
  async findByUserAndDeviceMeta(userId: string, deviceName: string, ip: string) {
    return await userSessionsCollection.findOne({
      user_id: userId,
      device_name: deviceName,
      ip,
    });
  },
  async findSessionByDeviceId(deviceId: string) {
    return await userSessionsCollection.findOne({ device_id: deviceId });
  },
  async deleteSessionByDeviceId(deviceId: string) {
    return await userSessionsCollection.deleteOne({ device_id: deviceId });
  }
};
