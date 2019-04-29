declare module 'types/auth.repository' {
  import {MongoObjectID} from 'types/utils';
  import {LanguageType} from 'types/User.model';

  type NewSessionObject = {
    username: string;
    sessionToken: string;
  };
  type NewPasswordObject = {
    resetToken?: string;
    userId?: MongoObjectID;
    password: string;
  };

  type RecoveryResponseObject = {
    userId: MongoObjectID;
    resetToken: string;
  };

  type SessionObject = {
    username: string;
    userId: MongoObjectID;
    language: LanguageType;
  };

  type SetActivationTokenObject = {
    userId: MongoObjectID;
    activationToken: string;
  };

  type SetRecoveryTokenObject = {
    email: string;
    recoveryToken: string;
  };
}
