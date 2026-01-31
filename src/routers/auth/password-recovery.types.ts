import { WithId } from 'mongodb';

export type PasswordRecoveryType = {
  email: string;
  recoveryCode: string;
  expirationDate: Date;
};

export type PasswordRecoveryDBType = WithId<PasswordRecoveryType>;
