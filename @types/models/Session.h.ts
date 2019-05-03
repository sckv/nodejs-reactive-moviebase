declare module 'types/Session.model' {
  import {MongoObjectID} from 'types/utils';

  interface Session {
    _id: MongoObjectID;
    userId: MongoObjectID;
    token: string;
    closed: boolean;
  }
}
