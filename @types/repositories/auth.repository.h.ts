declare module 'types/auth.repository' {
  import {MongoObjectID} from 'types/utils';
  import {LanguageType} from 'types/User.model';
  import {ObjectId} from 'bson';

  type NewSessionObject = {
    username: string;
    sessionToken: string;
  };
  type NewPasswordObject = {
    resetToken?: string;
    userId?: ObjectId;
    password: string;
  };

  type RecoveryResponseObject = {
    userId: ObjectId;
    resetToken: string;
  };

  type SessionObject = {
    username: string;
    userId: ObjectId;
    language: LanguageType;
  };

  type SetActivationTokenObject = {
    userId: ObjectId;
    activationToken: string;
  };

  type SetRecoveryTokenObject = {
    email: string;
    recoveryToken: string;
  };
}
