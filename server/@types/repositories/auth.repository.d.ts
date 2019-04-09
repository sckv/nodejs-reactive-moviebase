declare module 'types/auth.repository' {
  import {ObjectID} from 'bson';

  type LoginObject = {
    username: string;
    password: string;
  };

  type LoginResponseObject = {
    userId: ObjectID;
    token: string;
  };

  type NewPasswordObject = {
    userId: ObjectID;
    password: string;
  };

  type RecoveryResponseObject = {
    userId: ObjectID;
    resetToken: string;
  };

  type SessionObject = {
    username: string;
    userId: ObjectID;
  };
}
