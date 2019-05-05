declare module 'types/authorizing.services' {
  import {ObjectId} from 'bson';
  import {MongoObjectID} from 'types/utils';

  interface LoginObject {
    username: string;
    password: string;
  }

  interface LoginResponseObject {
    userId: ObjectId | MongoObjectID;
    token: string;
  }
}
