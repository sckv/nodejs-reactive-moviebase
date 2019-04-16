declare module 'types/authorizing.services' {
  import {ObjectID} from 'bson';

  interface LoginObject {
    username: string;
    password: string;
  }

  interface LoginResponseObject {
    userId: ObjectID;
    token: string;
  }
}
