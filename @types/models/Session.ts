declare module 'types/Session.model' {
  import {ObjectID} from 'bson';
  import {_UserId} from 'types/User.model';

  interface Session {
    _id: ObjectID;
    userId: _UserId;
    token: string;
    closed: boolean;
  }
}
