declare module 'types/auth.repository' {
  import {ObjectID} from 'bson';
  import {LanguageType} from 'types/User.model';

  interface NewSessionObject {
    username: string;
    sessionToken: string;
  }
  interface NewPasswordObject {
    userId: ObjectID;
    password: string;
  }

  interface RecoveryResponseObject {
    userId: ObjectID;
    resetToken: string;
  }

  interface SessionObject {
    username: string;
    userId: ObjectID;
    language: LanguageType;
  }

  interface SetActivationTokenObject {
    userId: ObjectID;
    activationToken: string;
  }

  interface SetRecoveryTokenObject {
    email: string;
    recoveryToken: string;
  }
}
