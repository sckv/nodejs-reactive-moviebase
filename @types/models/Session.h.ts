declare module 'types/Session.model' {
  import {MongoObjectID} from 'types/utils';
  import {ObjectId} from 'bson';

  interface Session {
    _id: ObjectId;
    userId: ObjectId;
    token: string;
    closed: boolean;
  }
}
