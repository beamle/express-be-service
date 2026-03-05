import { PasswordRecoveryDBType, PasswordRecoveryType } from './password-recovery.types';
import { PasswordRecoveryModel } from './password-recovery.schema';

export const passwordRecoveryRepository = {
  async createOrUpdatePasswordRecovery(passwordRecovery: PasswordRecoveryType): Promise<void> {
    await PasswordRecoveryModel.updateOne(
      { email: passwordRecovery.email },
      { $set: passwordRecovery },
      { upsert: true },
    );
  },
  async findPasswordRecoveryByCode(recoveryCode: string): Promise<PasswordRecoveryDBType | null> {
    return PasswordRecoveryModel.findOne({ recoveryCode }).lean();
  },
};
