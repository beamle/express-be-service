import { db } from '../../app/db';
import { PasswordRecoveryDBType, PasswordRecoveryType } from './password-recovery.types';

export const passwordRecoveryRepository = {
  async createOrUpdatePasswordRecovery(passwordRecovery: PasswordRecoveryType): Promise<void> {
    await db.collection<PasswordRecoveryType>('auth').updateOne(
      { email: passwordRecovery.email },
      { $set: passwordRecovery },
      { upsert: true },
    );
  },
  async findPasswordRecoveryByCode(recoveryCode: string): Promise<PasswordRecoveryDBType | null> {
    return db.collection<PasswordRecoveryType>('auth').findOne({ recoveryCode });
  },
};
