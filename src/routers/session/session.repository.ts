import { SessionModel, RefreshTokenBlacklistModel } from './session.schema';
import { SessionMeta } from './session.types';

export class SessionRepository {
  async addRefreshTokenToBlackList(refreshToken: string) {
    const newBlacklistToken = new RefreshTokenBlacklistModel({ refreshToken });
    return await newBlacklistToken.save();
  }

  async checkIfRefreshTokenInBlackList(refreshToken: string) {
    const found = await RefreshTokenBlacklistModel.findOne({
      refreshToken,
    }).lean();
    return !!found;
  }

  async updateSessionRefreshData(deviceId: string, iat: number) {
    return await SessionModel.updateOne(
      { deviceId: deviceId },
      {
        $set: {
          lastActiveDate: new Date(iat * 1000), // Sync DB with the token's issued-at time
        },
      },
    );
  }

  async create(sessionMeta: SessionMeta) {
    const newSession = new SessionModel(sessionMeta);
    return await newSession.save();
  }

  async findAllSessionsByUser(userId: string): Promise<SessionMeta[]> {
    return await SessionModel.find({ userId: userId }).select('-_id -userId -__v').lean() as unknown as SessionMeta[];
  }
  async findAllSessionsByDeviceId(deviceId: string): Promise<SessionMeta[]> {
    return await SessionModel.find({ deviceId }).select('-_id -__v').lean() as unknown as SessionMeta[];
  }
  async deleteAllSessionsExceptDevice(userId: string, deviceId: string, iat: number) {
    return await SessionModel.deleteMany({
      userId: userId,
      $or: [
        { deviceId: { $ne: deviceId } }, // Different devices
        { lastActiveDate: { $ne: new Date(iat * 1000) } }, // Same device, but older session
      ],
    });
  }
  async findByUserAndDeviceMeta(userId: string, deviceName: string, deviceId?: string) {
    return await SessionModel.findOne({
      userId: userId,
      deviceName: deviceName,
    }).lean();
  }
  async findSessionByDeviceId(deviceId: string) {
    return await SessionModel.findOne({ deviceId: deviceId }).lean();
  }
  async deleteSessionByDeviceId(deviceId: string) {
    return await SessionModel.deleteOne({ deviceId: deviceId });
  }
}
