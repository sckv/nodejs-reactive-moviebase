declare module 'types/auth.repository' {
  import {ObjectID} from 'bson';
  import {LanguageType} from 'types/movies.repository';

  interface LoginObject {
    username: string;
    password: string;
  }

  interface LoginResponseObject {
    userId: ObjectID;
    token: string;
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
}
