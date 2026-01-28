import { InsertOneResult } from 'mongodb';
import { refreshTokenBlacklistCollection, sessionsCollection, UserSessionDBType } from '../../app/db';
import { SessionMeta } from './session.types';

export class SessionRepository {
  async addRefreshTokenToBlackList(refreshToken: string) {
    return await refreshTokenBlacklistCollection.insertOne({ refreshToken });
  }

  async checkIfRefreshTokenInBlackList(refreshToken: string) {
    const found = await refreshTokenBlacklistCollection.findOne({
      refreshToken,
    });
    return !!found;
  }

  async updateSessionRefreshData(deviceId: string, iat: number) {
    return await sessionsCollection.updateOne(
      { deviceId: deviceId },
      {
        $set: {
          lastActiveDate: new Date(iat * 1000), // Sync DB with the token's issued-at time
        },
      },
    );
  }

  async create(sessionMeta: SessionMeta): Promise<InsertOneResult<UserSessionDBType>> {
    return await sessionsCollection.insertOne(sessionMeta);
  }

  // async findByDeviceId(deviceId: string): Promise<any | null> {},
  // async updateIat(deviceId: string, newIat: Date): Promise<void> {},
  // async deleteByDeviceId(deviceId: string): Promise<void> {},
  async findAllSessionsByUser(userId: string): Promise<SessionMeta[]> {
    return await sessionsCollection.find({ userId: userId }, { projection: { _id: 0, userId: 0 } }).toArray();
  }
  async findAllSessionsByDeviceId(deviceId: string): Promise<SessionMeta[]> {
    return await sessionsCollection.find({ deviceId }, { projection: { _id: 0 } }).toArray();
  }
  async deleteAllSessionsExceptDevice(userId: string, deviceId: string, iat: number) {
    return await sessionsCollection.deleteMany({
      userId: userId,
      $or: [
        { deviceId: { $ne: deviceId } }, // Different devices
        { lastActiveDate: { $ne: new Date(iat * 1000) } }, // Same device, but older session
      ],
    });
  }
  async findByUserAndDeviceMeta(userId: string, deviceName: string, deviceId?: string) {
    return await sessionsCollection.findOne({
      userId: userId,
      deviceName: deviceName,
    });
  }
  async findSessionByDeviceId(deviceId: string) {
    return await sessionsCollection.findOne({ deviceId: deviceId });
  }
  async deleteSessionByDeviceId(deviceId: string) {
    return await sessionsCollection.deleteOne({ deviceId: deviceId });
  }
}
