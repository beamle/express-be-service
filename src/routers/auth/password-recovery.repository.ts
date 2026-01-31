import { db } from '../../app/db';
import { PasswordRecoveryDBType, PasswordRecoveryType } from './password-recovery.types';

const passwordRecoveryCollection = db.collection<PasswordRecoveryType>('password-recovery');

export const passwordRecoveryRepository = {
  async createOrUpdatePasswordRecovery(passwordRecovery: PasswordRecoveryType): Promise<void> {
    await passwordRecoveryCollection.updateOne(
      { email: passwordRecovery.email },
      { $set: passwordRecovery },
      { upsert: true },
    );
  },
  async findPasswordRecoveryByCode(recoveryCode: string): Promise<PasswordRecoveryDBType | null> {
    return passwordRecoveryCollection.findOne({ recoveryCode });
  },
};
