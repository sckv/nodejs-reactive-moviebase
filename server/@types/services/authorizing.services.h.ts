declare module 'types/authorizing.services' {
  import {ObjectId} from 'bson';
  import {MongoObjectID} from 'types/utils';
  import {LanguageType} from 'types/User.model';

  interface LoginObject {
    username: string;
    password: string;
  }

  interface LoginResponseObject {
    userId: ObjectId | MongoObjectID;
    token: string;
    language: LanguageType;
  }
}
