declare module 'types/users.repository' {
  import {ObjectID} from 'bson';

  interface RegisterUserObject {
    username: string;
    password: string;
    email: string;
  }

  interface SearchUsersObject {
    username?: string;
  }

  interface GetUserObject {
    userId: ObjectID;
    selfId: ObjectID;
    personalData?: boolean;
    moviesData?: boolean;
    listsData?: boolean;
    followers?: boolean;
    follows?: boolean;
  }

  interface ModifyUserObject {
    userId: ObjectID;
    password?: string;
  }
}
